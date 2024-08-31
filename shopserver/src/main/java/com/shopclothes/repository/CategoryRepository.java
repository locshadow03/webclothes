package com.shopclothes.repository;

import com.shopclothes.model.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface CategoryRepository extends JpaRepository<Category, Long> {
    long count();

    Optional<Category> findByNameCategory(String nameCategory);

    @Query("SELECT DISTINCT c.nameCategory FROM Category c")
    List<String> findDistinctCategoryTypes();

}
