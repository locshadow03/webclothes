package com.shopclothes.repository;

import com.shopclothes.model.Category;
import com.shopclothes.model.DiscountEventProducts;
import com.shopclothes.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface DiscountEventProductRepository extends JpaRepository<DiscountEventProducts, Long> {
    @Query("SELECT d.product.id FROM DiscountEventProducts d where d.discountEvent.id = :event_id")
    List<Long> findAllProductByEventId(@Param("event_id") Long event_id);
}
