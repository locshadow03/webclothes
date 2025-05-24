package com.shopclothes.service.category;

import com.shopclothes.extension.InternalServerException;
import com.shopclothes.extension.ResourceNotFoundException;
import com.shopclothes.model.Category;
import com.shopclothes.repository.CategoryRepository;
import com.shopclothes.service.upload.IImageService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.sql.rowset.serial.SerialBlob;
import java.io.IOException;
import java.sql.Blob;
import java.sql.SQLException;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CategoryImpl implements ICategoryService{
    private final CategoryRepository categoryRepository;
    private final IImageService imageService;
    @Override
    public Category addNewCategory(String nameCategory, MultipartFile file) throws IOException {
        Category category = new Category();
        category.setNameCategory(nameCategory);
        if(!file.isEmpty()){
            category.setImageCategory(imageService.saveImage(file));
        }
        return categoryRepository.save(category);
    }

    @Override
    public List<Category> getAllCategorys() {
        return categoryRepository.findAll();
    }

    @Override
    public List<String> getAllCategoryTypes() {
        return categoryRepository.findDistinctCategoryTypes();
    }

    @Override
    public void deleteCategory(Long categoryId) throws IOException {
        Optional<Category> theCategory = categoryRepository.findById(categoryId);
        if(theCategory.isPresent()){
            categoryRepository.deleteById(categoryId);
            imageService.deleteImage(theCategory.get().getImageCategory());
        }
    }

//    @Override
//    public byte[] getCategoryPhotoByCategoryId(Long categoryId) throws SQLException {
//        Optional<Category> theCategory = categoryRepository.findById(categoryId);
//        if(theCategory.isEmpty()){
//            throw  new ResourceNotFoundException("Sorry, Category not found!");
//        }
//        Blob photoBlob = theCategory.get().getImageCategory();
//        if(photoBlob != null){
//            return photoBlob.getBytes(1, (int) photoBlob.length());
//        }
//        return null;
//    }

    @Override
    public Category updateCategory(Long categoryId, String nameCategory, MultipartFile file) throws IOException {
        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found"));

        if(nameCategory != null) category.setNameCategory(nameCategory);
        if(file != null){
            imageService.deleteImage(category.getImageCategory());
            String imageSave = imageService.saveImage(file);
            if(imageSave != null) {
                category.setImageCategory(imageSave);
            }
        }
        return categoryRepository.save(category);
    }

    @Override
    public Optional<Category> getCategoryById(Long categoryId) {
        return Optional.of(categoryRepository.findById(categoryId).get());
    }

    @Override
    public long getTotalCategories() {
        return categoryRepository.count();
    }
}
