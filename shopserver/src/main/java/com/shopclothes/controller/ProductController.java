package com.shopclothes.controller;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.shopclothes.dto.CategoryDto;
import com.shopclothes.dto.ColorImageProductDto;
import com.shopclothes.dto.ProductDto;
import com.shopclothes.dto.SizeQuantityDto;
import com.shopclothes.dto.event.DiscountAndPercentage;
import com.shopclothes.extension.PhotoRetrievalExcetion;
import com.shopclothes.extension.ResourceNotFoundException;
import com.shopclothes.model.Category;
import com.shopclothes.model.Product;
import com.shopclothes.repository.ProductRepository;
import com.shopclothes.service.event.IDiscountEventService;
import com.shopclothes.service.product.IProductService;
import com.shopclothes.service.upload.IImageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.sql.rowset.serial.SerialBlob;
import java.io.IOException;
import java.sql.Blob;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Base64;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@CrossOrigin("http://localhost:3000")
@RestController
@RequiredArgsConstructor
@RequestMapping("/dashboard/products")
public class ProductController {
    private final IProductService productService;
    private final ProductRepository productRepository;
    private final IImageService imageService;
    private final IDiscountEventService discountEventService;
    @PostMapping("/add/new-product")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ProductDto> addNewProduct(@RequestParam("nameProduct") String nameProduct,
                                                    @RequestParam("codeProduct") String codeProduct,
                                                    @RequestParam("nameCategory") String nameCategory,
                                                    @RequestParam("description") String description,
                                                    @RequestParam("price") double price,
                                                    @RequestParam("sizeQuantities") String sizeQuantitiesJson,
                                                    @RequestParam(value = "colorImageProducts", required = false) List<MultipartFile> colorImageProduct,
                                                    @RequestParam("colorIndices") String colorIndicesJson,
                                                    @RequestParam("sizeIndices")  String sizeIndicesJson,
                                                    @RequestParam("nameBrand") String nameBrand,
                                                    @RequestParam("photo") MultipartFile photo) throws SQLException, IOException {
        ObjectMapper mapper = new ObjectMapper();
        List<SizeQuantityDto> sizeQuantities = mapper.readValue(sizeQuantitiesJson, new TypeReference<List<SizeQuantityDto>>() {});
        ObjectMapper objectMapper = new ObjectMapper();
        List<Integer> colorIndices = objectMapper.readValue(colorIndicesJson, new TypeReference<List<Integer>>() {});
        List<Integer> sizeIndices = objectMapper.readValue(sizeIndicesJson, new TypeReference<List<Integer>>() {});
        if (colorImageProduct != null && !colorImageProduct.isEmpty()) {
            for (int i = 0; i < colorImageProduct.size(); i++) {
                MultipartFile file = colorImageProduct.get(i);
                int colorIndex = colorIndices.get(i);
                int sizeIndex = sizeIndices.get(i);

                if (file != null && !file.isEmpty()) {
                    System.out.println("Processing file #" + i + " for colorIndex: " + colorIndex + " and sizeIndex: " + sizeIndex);
                    SizeQuantityDto sizeQuantityDto = sizeQuantities.get(sizeIndex);
                    ColorImageProductDto colorImageProductDto = sizeQuantityDto.getColorImageProductDtos().get(colorIndex);
                    colorImageProductDto.setImageProduct(imageService.saveImage(file));
                }
            }
        } else {
            System.out.println("colorImageProducts is null or empty");
        }
        Product savedProduct = productService.addNewProduct(nameProduct, codeProduct, nameCategory, description, price, sizeQuantities, photo, nameBrand);
        ProductDto productDto = new ProductDto(savedProduct.getName(), savedProduct.getCode(), savedProduct.getCategory().getNameCategory(), savedProduct.getDescription(), savedProduct.getPrice(), savedProduct.getBrand().getName());
        productDto.setSizeQuantities(sizeQuantities);
        return ResponseEntity.ok(productDto);
    }

    @GetMapping("/all-products")
    public ResponseEntity<List<ProductDto>> getAllProducts() throws SQLException {
        List<Product> products = productService.getAllProducts();
        List<ProductDto> productDtos = new ArrayList<>();
        for (Product product : products) {
                ProductDto productDto = getProductDto(product);
                productDtos.add(productDto);
        }
        return ResponseEntity.ok(productDtos);
    }

    @PutMapping("/update/{productId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ProductDto> updateProduct(
            @PathVariable Long productId,
            @RequestParam("nameProduct") String nameProduct,
            @RequestParam("codeProduct") String codeProduct,
            @RequestParam("nameCategory") String nameCategory,
            @RequestParam("description") String description,
            @RequestParam("price") double price,
            @RequestParam("sizeQuantities") String sizeQuantitiesJson,
            @RequestParam(value = "colorImageProducts", required = false) List<MultipartFile> colorImageProduct,
            @RequestParam("colorIndices") String colorIndicesJson,
            @RequestParam("sizeIndices")  String sizeIndicesJson,
            @RequestParam("nameBrand") String nameBrand,
            @RequestParam(value = "imageProductMain", required = false) MultipartFile photo) throws IOException {

        ObjectMapper mapper = new ObjectMapper();
        List<SizeQuantityDto> sizeQuantities = mapper.readValue(sizeQuantitiesJson, new TypeReference<List<SizeQuantityDto>>() {});

        System.out.println(colorImageProduct);

        ObjectMapper objectMapper = new ObjectMapper();
        List<Integer> colorIndices = objectMapper.readValue(colorIndicesJson, new TypeReference<List<Integer>>() {});
        List<Integer> sizeIndices = objectMapper.readValue(sizeIndicesJson, new TypeReference<List<Integer>>() {});

        if (colorImageProduct != null && !colorImageProduct.isEmpty()) {
            for (int i = 0; i < colorImageProduct.size(); i++) {
                MultipartFile file = colorImageProduct.get(i);
                int colorIndex = colorIndices.get(i);
                int sizeIndex = sizeIndices.get(i);

                if (file != null && !file.isEmpty()) {
                    System.out.println("Processing file #" + i + " for colorIndex: " + colorIndex + " and sizeIndex: " + sizeIndex);
                    SizeQuantityDto sizeQuantityDto = sizeQuantities.get(sizeIndex);
                    ColorImageProductDto colorImageProductDto = sizeQuantityDto.getColorImageProductDtos().get(colorIndex);
                    colorImageProductDto.setImageProduct(imageService.saveImage(file));
                }
            }
        } else {
            System.out.println("colorImageProducts is null or empty");
        }


        Product theProduct = productService.updateProduct(productId, nameProduct, codeProduct, nameCategory, description, price, sizeQuantities, nameBrand, photo);

        ProductDto productDto = getProductDtoDetail(theProduct);
        return ResponseEntity.ok(productDto);
    }

    @GetMapping("/product/{productId}")
    public ResponseEntity<Optional<ProductDto>> getProductById(@PathVariable Long productId) {
        Optional<Product> theProduct = productService.getProductById(productId);
        return theProduct.map(product -> {
            productService.incrementViewCount(productId);
            ProductDto productDto = getProductDtoDetail(product);
            return ResponseEntity.ok(Optional.of(productDto));
        }).orElseThrow(() -> new ResourceNotFoundException("Product not found"));
    }


    @DeleteMapping("/delete/product/{productId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long productId){
        productService.deleteProduct(productId);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    private ProductDto getProductDto(Product product) {
        List<SizeQuantityDto> sizeQuantities = product.getSizeQuantities().stream()
                .map(sq -> new SizeQuantityDto(sq.getId(), sq.getSize(), sq.getColorImageProducts()))
                .collect(Collectors.toList());
        ProductDto productDto = new ProductDto(product.getId(), product.getName(), product.getPrice(), product.getImageProduct(), product.getDisCount(), product.getViewCount());
        productDto.setSizeQuantities(sizeQuantities);
        productDto.setNameCategory(product.getCategory().getNameCategory());
        DiscountAndPercentage discountAndPercentage = discountEventService.getDisCountProductNowByProductId(product.getId());
        if(discountAndPercentage != null){
            productDto.setDisCount(discountAndPercentage.getDiscount());
            productDto.setPercentage(discountAndPercentage.isPercentage());
        } else{
            productDto.setDisCount(0.0);
            productDto.setPercentage(false);
        }

        System.out.println(productDto.isPercentage());
        productDto.setNameBrand(product.getBrand().getName());
        return productDto;
    }

    private ProductDto getProductDtoDetail(Product product) {

        List<SizeQuantityDto> sizeQuantities = product.getSizeQuantities().stream()
                .map(sq -> new SizeQuantityDto(sq.getId(), sq.getSize(), sq.getColorImageProducts()))
                .collect(Collectors.toList());

        ProductDto productDto = new ProductDto(product.getId(), product.getName(), product.getCode(), product.getCategory().getNameCategory(), product.getDescription(), product.getPrice(), product.getImageProduct(), product.getBrand().getName(), sizeQuantities, product.getCreatedAt(), product.getUpdatedAt(), product.getDisCount(), product.getViewCount());

        DiscountAndPercentage discountAndPercentage = discountEventService.getDisCountProductNowByProductId(product.getId());
        if(discountAndPercentage != null){
            productDto.setDisCount(discountAndPercentage.getDiscount());
            productDto.setPercentage(discountAndPercentage.isPercentage());
        } else{
            productDto.setDisCount(0.0);
            productDto.setPercentage(false);
        }

        productDto.setSizeQuantities(sizeQuantities);
        return productDto;
    }

    @GetMapping("/search")
    public ResponseEntity<List<ProductDto>> searchProducts(@RequestParam("search") String name) throws SQLException {
        List<Product> products = productService.searchProductsByName(name);
        List<ProductDto> productDtos = new ArrayList<>();
        for (Product product : products) {
//            byte[] photoBytes = productService.getProductPhotoById(product.getId());
//            if (photoBytes != null && photoBytes.length > 0) {
//                String base64Photo = Base64.getEncoder().encodeToString(photoBytes);
//                ProductDto productDto = getProductDto(product);
//                productDto.setImageProduct(base64Photo);
//                productDtos.add(productDto);
//            }
            ProductDto productDto = getProductDto(product);
            productDtos.add(productDto);
        }
        return ResponseEntity.ok(productDtos);
    }


}
