package com.shopclothes.service.product;

import com.shopclothes.dto.ColorImageProductDto;
import com.shopclothes.dto.SizeQuantityDto;
import com.shopclothes.extension.InternalServerException;
import com.shopclothes.extension.ResourceNotFoundException;
import com.shopclothes.model.*;
import com.shopclothes.repository.*;
import com.shopclothes.service.upload.IImageService;
import jakarta.validation.constraints.Size;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import javax.sql.rowset.serial.SerialBlob;
import java.io.IOException;
import java.sql.Blob;
import java.sql.SQLException;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductImpl implements IProductService{
    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final BrandRepository brandRepository;
    private final SizeQuantityRepository sizeQuantityRepository;
    private final IImageService imageService;
    private final ColorImageProductRepository colorImageProductRepository;

    @Override
    public Product addNewProduct(String name, String code, String nameCategory, String description, double price, List<SizeQuantityDto> sizeQuantities, MultipartFile imageProduct, String nameBrand, double disCount) throws IOException {
        Optional<Category> categoryOpt = categoryRepository.findByNameCategory(nameCategory);
        Optional<Brand> brandOpt = brandRepository.findByName(nameBrand);

        if (!categoryOpt.isPresent() || !brandOpt.isPresent()) {
            throw new IllegalArgumentException("Không tồn tại danh mục sản phẩm hoặc thương hiệu đã chọn!");
        }
        Category category = categoryOpt.get();
        Brand brand = brandOpt.get();
        Product product = new Product();
        product.setName(name);
        product.setCode(code);
        product.setCategory(category);
        product.setDescription(description);
        product.setPrice(price);
        product.setBrand(brand);
        product.setDisCount(disCount);
        product.setImageProduct(imageService.saveImage(imageProduct));

        List<SizeQuantity> sizeQuantityList = sizeQuantities.stream()
                .map(dto -> {
                    SizeQuantity sizeQuantity = new  SizeQuantity(null, dto.getSize(), new ArrayList<>(), product);
                    List<ColorImageProduct> colorImageProducts = dto.getColorImageProductDtos().stream().map(colorDto -> new ColorImageProduct(null,colorDto.getImageProduct(), colorDto.getColor(), colorDto.getQuantity(), sizeQuantity)).collect(Collectors.toList());
                    sizeQuantity.setColorImageProducts(colorImageProducts);
                    return sizeQuantity;
                })
                .collect(Collectors.toList());

        product.setSizeQuantities(sizeQuantityList);

        return productRepository.save(product);
    }

    @Override
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

//    @Override
//    public byte[] getProductPhotoById(Long productId) throws SQLException {
//        Optional<Product> theProduct = productRepository.findById(productId);
//        if(theProduct.isEmpty()){
//            throw  new ResourceNotFoundException("Sorry, Product not found!");
//        }
//        Blob photoBlob = theProduct.get().getImageProduct();
//        if(photoBlob != null){
//            return photoBlob.getBytes(1, (int) photoBlob.length());
//        }
//        return null;
//    }

    public void deleteProduct(Long productId){
        Optional<Product> theProduct = productRepository.findById(productId);
        if(theProduct.isPresent()){
            productRepository.deleteById(productId);
        }
    }

    @Transactional
    @Override
    public Product updateProduct(Long productId, String nameProduct, String codeProduct, String nameCategory, String description, double price, List<SizeQuantityDto> sizeQuantities, String nameBrand, MultipartFile file, double disCount) throws IOException {
        Optional<Category> categoryOpt = categoryRepository.findByNameCategory(nameCategory);
        Optional<Brand> brandOpt = brandRepository.findByName(nameBrand);
        if (!categoryOpt.isPresent() || !brandOpt.isPresent()) {
            throw new IllegalArgumentException("Invalid category or brand name");
        }
        Category category = categoryOpt.get();
        Brand brand = brandOpt.get();

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));

        if (nameProduct != null) product.setName(nameProduct);
        if (codeProduct != null) product.setCode(codeProduct);
        product.setCategory(category);
        if (description != null) product.setDescription(description);
        product.setPrice(price);
        product.setBrand(brand);
        product.setDisCount(disCount);
        imageService.deleteImage(product.getImageProduct());
        product.setImageProduct(imageService.saveImage(file));
        List<SizeQuantity> existingSizeQuantities = sizeQuantityRepository.findByProductId(productId);

        Set<Long> incomingSizeIds = sizeQuantities.stream()
                .filter(dto -> dto.getId() != null)
                .map(SizeQuantityDto::getId)
                .collect(Collectors.toSet());

        Iterator<SizeQuantity> sizeIterator = existingSizeQuantities.iterator();

        while (sizeIterator.hasNext()) {
            SizeQuantity existingSize = sizeIterator.next();
            System.out.println("Checking existing size: " + existingSize.getId());

            if (existingSize.getId() != null && !incomingSizeIds.contains(existingSize.getId())) {
                System.out.println("Deleting size: " + existingSize.getId());

                for (ColorImageProduct color : existingSize.getColorImageProducts()) {
                    imageService.deleteImage(color.getImageProduct());
                }
                existingSize.getColorImageProducts().clear();

                product.getSizeQuantities().removeIf(sq -> sq.getId().equals(existingSize.getId()));
                sizeQuantityRepository.deleteById(existingSize.getId());

            } else {
                for (SizeQuantityDto sizeQuantityDto : sizeQuantities) {
                    if (existingSize.getId().equals(sizeQuantityDto.getId())) {
                        System.out.println("Deleting color for size: " + existingSize.getId());

                        Set<Long> incomingColorIds = sizeQuantityDto.getColorImageProductDtos().stream()
                                .filter(dto -> dto.getId() != null)
                                .map(ColorImageProductDto::getId)
                                .collect(Collectors.toSet());

                        Iterator<ColorImageProduct> colorIterator = existingSize.getColorImageProducts().iterator();

                        while (colorIterator.hasNext()) {
                            ColorImageProduct existingColor = colorIterator.next();
                            if (existingColor.getId() != null && !incomingColorIds.contains(existingColor.getId())) {
                                imageService.deleteImage(existingColor.getImageProduct());
                                colorIterator.remove();
                            }
                        }
                    }
                }
            }
        }
        productRepository.save(product);




        for(SizeQuantityDto sizeQuantityDtoNow : sizeQuantities){
            if(sizeQuantityRepository.getSizeQuantitiesById(sizeQuantityDtoNow.getId()) != null){
                SizeQuantity sizeQuantity = sizeQuantityRepository.getSizeQuantitiesById(sizeQuantityDtoNow.getId());
                sizeQuantity.setSize(sizeQuantityDtoNow.getSize());
                for(ColorImageProductDto colorImageProductDto : sizeQuantityDtoNow.getColorImageProductDtos()){
                    if(colorImageProductDto.getId() != null){
                        ColorImageProduct colorImageProduct = colorImageProductRepository.getColorImageProductById(colorImageProductDto.getId());
                        colorImageProduct.setColor(colorImageProductDto.getColor());
                        colorImageProduct.setQuantity(colorImageProductDto.getQuantity());
                        if(colorImageProductDto.getImageProduct() != null){
                            imageService.deleteImage(colorImageProduct.getImageProduct());
                            colorImageProduct.setImageProduct(colorImageProductDto.getImageProduct());
                        }

                    } else {
                        ColorImageProduct colorImageProduct = new ColorImageProduct(null, colorImageProductDto.getImageProduct(), colorImageProductDto.getColor(), colorImageProductDto.getQuantity(), sizeQuantity);
                        colorImageProductRepository.save(colorImageProduct);
                    }
                }
            } else{
                SizeQuantity sizeQuantity = new SizeQuantity(null, sizeQuantityDtoNow.getSize(), new ArrayList<>(), product);
                List<ColorImageProduct> colorImageProducts = sizeQuantityDtoNow.getColorImageProductDtos().stream().map(colorDto -> new ColorImageProduct(null, colorDto.getImageProduct(), colorDto.getColor(), colorDto.getQuantity(), sizeQuantity)).collect(Collectors.toList());

                sizeQuantity.setColorImageProducts(colorImageProducts);
                sizeQuantityRepository.save(sizeQuantity);
            }
        }
        return productRepository.save(product);
    }





    @Override
    public Optional<Product> getProductById(Long productId) {
        return Optional.of(productRepository.findById(productId).get());
    }
    @Override
    public void incrementViewCount(Long productId) {
        Optional<Product> optionalProduct = getProductById(productId);
        if (optionalProduct.isPresent()) {
            Product product = optionalProduct.get();
            product.setViewCount(product.getViewCount() + 1);
            productRepository.save(product);
        } else {
            throw new ResourceNotFoundException("Product with ID " + productId + " not found");
        }
    }

    public List<Product> searchProductsByName(String name) {
        return productRepository.findByNameContainingIgnoreCase(name);
    }
}
