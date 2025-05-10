package com.shopclothes.repository;

import com.shopclothes.model.Brand;
import com.shopclothes.model.DiscountEventBrands;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface DiscountEventBrandRepository extends JpaRepository<DiscountEventBrands, Long> {
    @Query("SELECT d.brand.id FROM DiscountEventBrands d WHERE d.discountEvent.id = :event_id")
    List<Long> findAllBrandByEventId(@Param("event_id") Long event_id);
}
