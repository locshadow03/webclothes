package com.shopclothes.controller;

import com.shopclothes.dto.CategoryDto;
import com.shopclothes.extension.PhotoRetrievalExcetion;
import com.shopclothes.extension.ResourceNotFoundException;
import com.shopclothes.model.Category;
import com.shopclothes.service.category.ICategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.sql.rowset.serial.SerialBlob;
import java.io.IOException;
import java.math.BigDecimal;
import java.sql.Blob;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Base64;
import java.util.List;
import java.util.Optional;

@CrossOrigin("http://localhost:3000")
@RestController
@RequiredArgsConstructor
@RequestMapping("/dashboard/categories")
public class CategoryController {
    private final ICategoryService categoryService;

    @PostMapping("/add/new-category")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<CategoryDto> addNewCategory(@RequestParam("nameCategory") String nameCategory,
                                                      @RequestParam("photo") MultipartFile photo) throws SQLException, IOException {
        Category savedCategory = categoryService.addNewCategory(nameCategory, photo);
        CategoryDto categoryDto = new CategoryDto(savedCategory.getId(),savedCategory.getNameCategory());
        return ResponseEntity.ok(categoryDto);
    }

    @GetMapping("/category/types")
    public List<String> getCategoryTypes(){
        return categoryService.getAllCategoryTypes();
    }

    @GetMapping("/all-categories")
    public ResponseEntity<List<CategoryDto>> getAllCategories() throws SQLException {
        List<Category> categories = categoryService.getAllCategorys();
        List<CategoryDto> categoryDtos = new ArrayList<>();
        for(Category category : categories){
            byte[] photoBytes = categoryService.getCategoryPhotoByCategoryId(category.getId());
            if(photoBytes != null && photoBytes.length > 0){
                String base64Photo = Base64.getEncoder().encodeToString(photoBytes);
                CategoryDto categoryDto = getCategoryDto(category);
                categoryDto.setImageCategory(base64Photo);
                categoryDtos.add(categoryDto);
            }
        }
        return  ResponseEntity.ok(categoryDtos);
    }

    @DeleteMapping("/delete/category/{categoryId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteCategory(@PathVariable Long categoryId){
        categoryService.deleteCategory(categoryId);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @PutMapping("/update/{categoryId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<CategoryDto> updateRoom(@PathVariable Long categoryId,
                                                  @RequestParam("nameCategory") String nameCategory,
                                                  @RequestParam("imageCategory") MultipartFile photo) throws SQLException, IOException {
        byte[] photoBytes = photo != null && !photo.isEmpty() ? photo.getBytes() : categoryService.getCategoryPhotoByCategoryId(categoryId);

        Blob photoBlob = photoBytes != null && photoBytes.length > 0 ? new SerialBlob(photoBytes) : null;
        Category theCategory = categoryService.updateCategory(categoryId, nameCategory, photoBytes);
        theCategory.setImageCategory(photoBlob);
        CategoryDto categoryDto = getCategoryDto(theCategory);
        return ResponseEntity.ok(categoryDto);
    }

    @GetMapping("/category/{categoryId}")
    public ResponseEntity<Optional<CategoryDto>> getRoomById(@PathVariable Long categoryId){
        Optional<Category> theCategory = categoryService.getCategoryById(categoryId);
        return theCategory.map(category ->{
            CategoryDto categoryDto = getCategoryDto(category);
            return ResponseEntity.ok(Optional.of(categoryDto));
        }).orElseThrow(() -> new ResourceNotFoundException("Category not found"));
    }

    @GetMapping("/category/count")
    public long getTotalCategories() {
        return categoryService.getTotalCategories();
    }

    private CategoryDto getCategoryDto(Category category) {
        byte[] photoBytes = null;
        Blob photoBlob = category.getImageCategory();
        if(photoBlob != null){
            try{
                photoBytes = photoBlob.getBytes(1, (int) photoBlob.length());
            } catch (SQLException e){
                throw  new PhotoRetrievalExcetion("Error retrieving photo");
            }
        }
        return new CategoryDto(category.getId(),
               category.getNameCategory(), photoBytes);
    }

}
