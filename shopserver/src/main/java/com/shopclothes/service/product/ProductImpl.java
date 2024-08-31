package com.shopclothes.service.product;

import com.shopclothes.dto.SizeQuantityDto;
import com.shopclothes.extension.InternalServerException;
import com.shopclothes.extension.ResourceNotFoundException;
import com.shopclothes.model.Brand;
import com.shopclothes.model.Category;
import com.shopclothes.model.Product;
import com.shopclothes.model.SizeQuantity;
import com.shopclothes.repository.BrandRepository;
import com.shopclothes.repository.CategoryRepository;
import com.shopclothes.repository.ProductRepository;
import com.shopclothes.repository.SizeQuantityRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import javax.sql.rowset.serial.SerialBlob;
import java.io.IOException;
import java.sql.Blob;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductImpl implements IProductService{
    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final BrandRepository brandRepository;
    private final SizeQuantityRepository sizeQuantityRepository;

    @Override
    public Product addNewProduct(String name, String code, String nameCategory, String description, double price, List<SizeQuantityDto> sizeQuantities, MultipartFile imageProduct, String nameBrand, double disCount) throws SQLException, IOException {
        Optional<Category> categoryOpt = categoryRepository.findByNameCategory(nameCategory);
        Optional<Brand> brandOpt = brandRepository.findByName(nameBrand);

        if (!categoryOpt.isPresent() || !brandOpt.isPresent()) {
            throw new IllegalArgumentException("Invalid category or brand name");
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

        if(!imageProduct.isEmpty()){
            byte[] photoBytes = imageProduct.getBytes();
            Blob photoBlob = new SerialBlob(photoBytes);
            product.setImageProduct(photoBlob);
        }

        List<SizeQuantity> sizeQuantityList = sizeQuantities.stream()
                .map(dto -> new SizeQuantity(null, dto.getSize(), dto.getQuantity(), product))
                .collect(Collectors.toList());

        product.setSizeQuantities(sizeQuantityList);

        return productRepository.save(product);
    }

    @Override
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    @Override
    public byte[] getProductPhotoById(Long productId) throws SQLException {
        Optional<Product> theProduct = productRepository.findById(productId);
        if(theProduct.isEmpty()){
            throw  new ResourceNotFoundException("Sorry, Product not found!");
        }
        Blob photoBlob = theProduct.get().getImageProduct();
        if(photoBlob != null){
            return photoBlob.getBytes(1, (int) photoBlob.length());
        }
        return null;
    }

    public void deleteProduct(Long productId){
        Optional<Product> theProduct = productRepository.findById(productId);
        if(theProduct.isPresent()){
            productRepository.deleteById(productId);
        }
    }

    @Transactional
    @Override
    public Product updateProduct(Long productId, String nameProduct, String codeProduct, String nameCategory, String description, double price, List<SizeQuantityDto> sizeQuantities, String nameBrand, byte[] photoBytes, double disCount) {
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

        // Xóa tất cả SizeQuantity hiện tại liên quan đến sản phẩm
        sizeQuantityRepository.deleteByProduct_Id(productId);

        // Thêm các SizeQuantity mới
        List<SizeQuantity> newSizeQuantities = sizeQuantities.stream()
                .map(dto -> new SizeQuantity(dto.getSize(), dto.getQuantity(), product))
                .collect(Collectors.toList());

        product.setSizeQuantities(newSizeQuantities);

        // Cập nhật ảnh sản phẩm
        if (photoBytes != null && photoBytes.length > 0) {
            try {
                product.setImageProduct(new SerialBlob(photoBytes));
            } catch (SQLException ex) {
                throw new InternalServerException("Error updating product image");
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
