package com.shopclothes.repository;

import com.shopclothes.model.Category;
import com.shopclothes.model.DiscountEventCategories;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface DiscountEventCategoryRepository extends JpaRepository<DiscountEventCategories, Long> {
    @Query("SELECT d.category.id FROM DiscountEventCategories d where d.discountEvent.id = :event_id")
    List<Long> findAllCategoryByEventId(@Param("event_id") Long event_id);
}
