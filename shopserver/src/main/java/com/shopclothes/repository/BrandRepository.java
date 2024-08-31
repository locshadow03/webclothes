package com.shopclothes.repository;

import com.shopclothes.model.Brand;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface BrandRepository extends JpaRepository<Brand, Long> {
    long count();

    Optional<Brand> findByName(String name);

    @Query("SELECT DISTINCT b.name FROM Brand b")
    List<String> findDistinctBrandTypes();
}
