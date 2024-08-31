package com.shopclothes.service.category;


import com.shopclothes.model.Category;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.sql.SQLException;
import java.util.List;
import java.util.Optional;

public interface ICategoryService {
    Category addNewCategory(String nameCategory, MultipartFile imageCategory) throws SQLException, IOException;

    List<Category> getAllCategorys();

    List<String> getAllCategoryTypes();

    void deleteCategory(Long categoryId);

    byte[] getCategoryPhotoByCategoryId(Long categoryId) throws SQLException;

    Category updateCategory(Long categoryId,  String nameCategory, byte[] photoBytes);

    Optional<Category> getCategoryById(Long categoryId);
    long getTotalCategories();

}
