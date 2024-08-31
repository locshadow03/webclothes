package com.shopclothes.service.category;

import com.shopclothes.extension.InternalServerException;
import com.shopclothes.extension.ResourceNotFoundException;
import com.shopclothes.model.Category;
import com.shopclothes.repository.CategoryRepository;
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
    @Override
    public Category addNewCategory(String nameCategory, MultipartFile file) throws SQLException, IOException {
        Category category = new Category();
        category.setNameCategory(nameCategory);
        if(!file.isEmpty()){
            byte[] photoBytes = file.getBytes();
            Blob photoBlob = new SerialBlob(photoBytes);
            category.setImageCategory(photoBlob);
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
    public void deleteCategory(Long categoryId) {
        Optional<Category> theCategory = categoryRepository.findById(categoryId);
        if(theCategory.isPresent()){
            categoryRepository.deleteById(categoryId);
        }
    }

    @Override
    public byte[] getCategoryPhotoByCategoryId(Long categoryId) throws SQLException {
        Optional<Category> theCategory = categoryRepository.findById(categoryId);
        if(theCategory.isEmpty()){
            throw  new ResourceNotFoundException("Sorry, Category not found!");
        }
        Blob photoBlob = theCategory.get().getImageCategory();
        if(photoBlob != null){
            return photoBlob.getBytes(1, (int) photoBlob.length());
        }
        return null;
    }

    @Override
    public Category updateCategory(Long categoryId, String nameCategory, byte[] photoBytes) {
        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found"));

        if(nameCategory != null) category.setNameCategory(nameCategory);
        if(photoBytes != null && photoBytes.length > 0){
            try{
                category.setImageCategory(new SerialBlob(photoBytes));
            }catch (SQLException ex){
                throw new InternalServerException("Error updating category");
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
