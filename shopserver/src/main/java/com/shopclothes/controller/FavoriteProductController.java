package com.shopclothes.controller;

import com.shopclothes.dto.*;
import com.shopclothes.extension.PhotoRetrievalExcetion;
import com.shopclothes.model.FavoriteProduct;
import com.shopclothes.model.Product;
import com.shopclothes.service.favorite.IFavoriteProductService;
import com.shopclothes.service.product.IProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
@RequestMapping("/home/favorites")
public class FavoriteProductController {
    private final IFavoriteProductService favoriteProductService;
    private final IProductService productService;

    @GetMapping("/{userId}")
    public ResponseEntity<List<FavoriteProductDto>> getFavoriteProducts(@PathVariable Long userId) throws SQLException {
        List<FavoriteProduct> favoriteProducts = favoriteProductService.getAllFavoriteProductsByUser(userId);
        List<FavoriteProductDto> favoriteProductDtos = new ArrayList<>();
        for (FavoriteProduct favoriteProduct : favoriteProducts) {
            byte[] photoBytes = productService.getProductPhotoById(favoriteProduct.getProduct().getId());
            if (photoBytes != null && photoBytes.length > 0) {
                String base64Photo = Base64.getEncoder().encodeToString(photoBytes);
                FavoriteProductDto favoriteProductDto = getfavoriteDto(favoriteProduct);
                favoriteProductDto.setProductImage(base64Photo);
                favoriteProductDtos.add(favoriteProductDto);
            }
        }
        return ResponseEntity.ok(favoriteProductDtos);
    }

    private FavoriteProductDto getfavoriteDto(FavoriteProduct favoriteProduct) {
        byte[] photoBytes = null;
        Blob photoBlob = favoriteProduct.getProduct().getImageProduct();
        if (photoBlob != null) {
            try {
                photoBytes = photoBlob.getBytes(1, (int) photoBlob.length());
            } catch (SQLException e) {
                throw new PhotoRetrievalExcetion("Error retrieving photo");
            }
        }
        FavoriteProductDto favoriteProductDto = new FavoriteProductDto(favoriteProduct.getProduct().getId(), favoriteProduct.getProduct().getName(), favoriteProduct.getProduct().getDisCount(),favoriteProduct.getProduct().getPrice(), photoBytes);
        return favoriteProductDto;
    }

    @PostMapping("/{userId}/{productId}")
    public ResponseEntity<FavoriteProductDto> addProductToFavorites(@PathVariable Long userId, @PathVariable Long productId) throws SQLException {
        FavoriteProduct favoriteProduct = favoriteProductService.addProductToFavorites(userId, productId);
        byte[] photoBytes = productService.getProductPhotoById(productId);
        String base64Photo = null;
        if (photoBytes != null && photoBytes.length > 0) {
            base64Photo = Base64.getEncoder().encodeToString(photoBytes);
        }
        FavoriteProductDto favoriteProductDto = new FavoriteProductDto(favoriteProduct.getProduct().getName(), favoriteProduct.getProduct().getDisCount(), favoriteProduct.getProduct().getPrice(), base64Photo);
        return ResponseEntity.ok(favoriteProductDto);
    }

    @DeleteMapping("/{userId}/{productId}")
    public ResponseEntity<Void>  removeProductFromFavorites(@PathVariable Long userId, @PathVariable Long productId) {
        favoriteProductService.removeProductFromFavorites(userId, productId);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @GetMapping("/top_favorite_product/today")
    public ResponseEntity<List<TopFavoriteProductDto>> getTopFavoriteProductToday() throws SQLException {
        List<FavoriteProductResponse> favoriteProductResponses = favoriteProductService.getTopFavoriteProductByToday();
        List<TopFavoriteProductDto> topFavoriteProductDtos = new ArrayList<>();

        for(FavoriteProductResponse favoriteProductResponse : favoriteProductResponses){
            TopFavoriteProductDto topFavoriteProductDto = new TopFavoriteProductDto();

            topFavoriteProductDto.setNameProduct(favoriteProductResponse.getProduct().getName());
            topFavoriteProductDto.setPrice(favoriteProductResponse.getProduct().getPrice());
            topFavoriteProductDto.setDiscount(favoriteProductResponse.getProduct().getDisCount());
            topFavoriteProductDto.setId(favoriteProductResponse.getProduct().getId());
            topFavoriteProductDto.setTotalFavoriteProduct(favoriteProductResponse.getTotalFavoriteProduct());
            byte[] photoBytes = productService.getProductPhotoById(favoriteProductResponse.getProduct().getId());
            if (photoBytes != null && photoBytes.length > 0) {
                String base64Photo = Base64.getEncoder().encodeToString(photoBytes);
                topFavoriteProductDto.setAvatar(base64Photo);
            }
            topFavoriteProductDtos.add(topFavoriteProductDto);
        }
        return ResponseEntity.ok(topFavoriteProductDtos);
    }

    @GetMapping("/top_favorite_product/month")
    public ResponseEntity<List<TopFavoriteProductDto>> getTopFavoriteProductMonth() throws SQLException {
        List<FavoriteProductResponse> favoriteProductResponses = favoriteProductService.getTopFavoriteProductByMonth();
        List<TopFavoriteProductDto> topFavoriteProductDtos = new ArrayList<>();

        for(FavoriteProductResponse favoriteProductResponse : favoriteProductResponses){
            TopFavoriteProductDto topFavoriteProductDto = new TopFavoriteProductDto();

            topFavoriteProductDto.setNameProduct(favoriteProductResponse.getProduct().getName());
            topFavoriteProductDto.setPrice(favoriteProductResponse.getProduct().getPrice());
            topFavoriteProductDto.setDiscount(favoriteProductResponse.getProduct().getDisCount());
            topFavoriteProductDto.setId(favoriteProductResponse.getProduct().getId());
            topFavoriteProductDto.setTotalFavoriteProduct(favoriteProductResponse.getTotalFavoriteProduct());
            byte[] photoBytes = productService.getProductPhotoById(favoriteProductResponse.getProduct().getId());
            if (photoBytes != null && photoBytes.length > 0) {
                String base64Photo = Base64.getEncoder().encodeToString(photoBytes);
                topFavoriteProductDto.setAvatar(base64Photo);
            }
            topFavoriteProductDtos.add(topFavoriteProductDto);
        }
        return ResponseEntity.ok(topFavoriteProductDtos);
    }

    @GetMapping("/top_favorite_product/year")
    public ResponseEntity<List<TopFavoriteProductDto>> getTopFavoriteProductYear() throws SQLException {
        List<FavoriteProductResponse> favoriteProductResponses = favoriteProductService.getTopFavoriteProductByYear();
        List<TopFavoriteProductDto> topFavoriteProductDtos = new ArrayList<>();

        for(FavoriteProductResponse favoriteProductResponse : favoriteProductResponses){
            TopFavoriteProductDto topFavoriteProductDto = new TopFavoriteProductDto();

            topFavoriteProductDto.setNameProduct(favoriteProductResponse.getProduct().getName());
            topFavoriteProductDto.setPrice(favoriteProductResponse.getProduct().getPrice());
            topFavoriteProductDto.setDiscount(favoriteProductResponse.getProduct().getDisCount());
            topFavoriteProductDto.setId(favoriteProductResponse.getProduct().getId());
            topFavoriteProductDto.setTotalFavoriteProduct(favoriteProductResponse.getTotalFavoriteProduct());
            byte[] photoBytes = productService.getProductPhotoById(favoriteProductResponse.getProduct().getId());
            if (photoBytes != null && photoBytes.length > 0) {
                String base64Photo = Base64.getEncoder().encodeToString(photoBytes);
                topFavoriteProductDto.setAvatar(base64Photo);
            }
            topFavoriteProductDtos.add(topFavoriteProductDto);
        }
        return ResponseEntity.ok(topFavoriteProductDtos);
    }

    @GetMapping("/top_favorite_product")
    public ResponseEntity<List<TopFavoriteProductDto>> getTopFavoriteProductAll() throws SQLException {
        List<FavoriteProductResponse> favoriteProductResponses = favoriteProductService.getTopFavoriteProductByAll();
        List<TopFavoriteProductDto> topFavoriteProductDtos = new ArrayList<>();

        for(FavoriteProductResponse favoriteProductResponse : favoriteProductResponses){
            TopFavoriteProductDto topFavoriteProductDto = new TopFavoriteProductDto();

            topFavoriteProductDto.setNameProduct(favoriteProductResponse.getProduct().getName());
            topFavoriteProductDto.setPrice(favoriteProductResponse.getProduct().getPrice());
            topFavoriteProductDto.setDiscount(favoriteProductResponse.getProduct().getDisCount());
            topFavoriteProductDto.setId(favoriteProductResponse.getProduct().getId());
            topFavoriteProductDto.setTotalFavoriteProduct(favoriteProductResponse.getTotalFavoriteProduct());
            byte[] photoBytes = productService.getProductPhotoById(favoriteProductResponse.getProduct().getId());
            if (photoBytes != null && photoBytes.length > 0) {
                String base64Photo = Base64.getEncoder().encodeToString(photoBytes);
                topFavoriteProductDto.setAvatar(base64Photo);
            }
            topFavoriteProductDtos.add(topFavoriteProductDto);
        }
        return ResponseEntity.ok(topFavoriteProductDtos);
    }
}
