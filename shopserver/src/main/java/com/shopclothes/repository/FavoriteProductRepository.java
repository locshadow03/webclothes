package com.shopclothes.repository;

import com.shopclothes.model.FavoriteProduct;
import com.shopclothes.model.Product;
import com.shopclothes.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface FavoriteProductRepository extends JpaRepository<FavoriteProduct, Long> {
    List<FavoriteProduct> findByUser(User user);
    Optional<FavoriteProduct> findByUserAndProduct(User user, Product product);

    @Query("SELECT fp.product, COUNT(fp.id) FROM FavoriteProduct fp WHERE FUNCTION('DATE', fp.dateAdded) = FUNCTION('DATE', CURRENT_DATE) GROUP BY fp.product ORDER BY COUNT(fp.id) DESC")
    List<Object[]> findTopFavoriteProductsToday();

    @Query("SELECT fp.product, COUNT(fp.id) FROM FavoriteProduct fp WHERE FUNCTION('MONTH', fp.dateAdded) = FUNCTION('MONTH', CURRENT_DATE) AND FUNCTION('YEAR', fp.dateAdded) = FUNCTION('YEAR', CURRENT_DATE) GROUP BY fp.product ORDER BY COUNT(fp.id) DESC")
    List<Object[]> findTopFavoriteProductsThisMonth();

    @Query("SELECT fp.product, COUNT(fp.id) FROM FavoriteProduct fp WHERE FUNCTION('YEAR', fp.dateAdded) = FUNCTION('YEAR', CURRENT_DATE) GROUP BY fp.product ORDER BY COUNT(fp.id) DESC")
    List<Object[]> findTopFavoriteProductsThisYear();

    @Query("SELECT fp.product, COUNT(fp.id) FROM FavoriteProduct fp GROUP BY fp.product ORDER BY COUNT(fp.id) DESC")
    List<Object[]> findTopFavoriteProductsOverall();



}
