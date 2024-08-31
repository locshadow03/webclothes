package com.shopclothes.service.favorite;

import com.shopclothes.dto.FavoriteProductResponse;
import com.shopclothes.model.FavoriteProduct;

import java.util.List;


public interface IFavoriteProductService {
    List<FavoriteProduct> getAllFavoriteProductsByUser(Long userId);

    FavoriteProduct addProductToFavorites(Long userId, Long productId);

    void removeProductFromFavorites(Long userId, Long productId);

    List<FavoriteProductResponse> getTopFavoriteProductByToday();
    List<FavoriteProductResponse> getTopFavoriteProductByMonth();

    List<FavoriteProductResponse> getTopFavoriteProductByYear();

    List<FavoriteProductResponse> getTopFavoriteProductByAll();
}
