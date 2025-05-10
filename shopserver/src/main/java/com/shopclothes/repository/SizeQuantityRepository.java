package com.shopclothes.repository;

import com.shopclothes.model.Product;
import com.shopclothes.model.SizeQuantity;
import jakarta.validation.constraints.Size;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface SizeQuantityRepository extends JpaRepository<SizeQuantity, Long> {
    void deleteByProduct_Id(Long productId);

    @Query("select sq from SizeQuantity sq where sq.id = :size_id")
    SizeQuantity getSizeQuantitiesById(@Param("size_id") Long size_id);

    @Query("SELECT sq FROM SizeQuantity sq WHERE sq.product = :product AND sq.size = :size")
    Optional<SizeQuantity> findByProductAndSize(@Param("product") Product product, @Param("size") String size);

    @Query("select sq from SizeQuantity  sq where sq.product.id = :product_id")
    List<SizeQuantity> findByProductId(@Param("product_id") Long product_id);
}
