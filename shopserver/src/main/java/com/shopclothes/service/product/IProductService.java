package com.shopclothes.service.product;

import com.shopclothes.model.Product;
import com.shopclothes.dto.SizeQuantityDto;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.sql.SQLException;
import java.util.List;
import java.util.Optional;

public interface IProductService {
    Product addNewProduct(String name, String code, String nameCategory, String description, double price, List<SizeQuantityDto> sizeQuantities, MultipartFile imageProduct, String nameBrand, double discount) throws SQLException, IOException;

    List<Product> getAllProducts();

    byte[] getProductPhotoById(Long id) throws SQLException;

    void deleteProduct(Long productId);

    Product updateProduct(Long productId, String nameProduct, String codeProduct, String nameCategory, String description, double price, List<SizeQuantityDto> sizeQuantities, String nameBrand, byte[] photoBytes, double disCount);

    Optional<Product> getProductById(Long productId);

    void incrementViewCount(Long productId);

    List<Product> searchProductsByName(String name);
}
