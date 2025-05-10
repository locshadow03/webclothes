package com.shopclothes.repository;

import com.shopclothes.model.DiscountEvent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface DiscountEventRepository extends JpaRepository<DiscountEvent, Long> {

    @Query("SELECT d FROM DiscountEvent d WHERE :today BETWEEN d.startDate AND d.endDate AND d.active = true")
    List<DiscountEvent> findActiveDiscountEventsToday(@Param("today") LocalDate today);
}
