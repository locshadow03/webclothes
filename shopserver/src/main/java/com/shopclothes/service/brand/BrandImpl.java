package com.shopclothes.service.brand;

import com.shopclothes.extension.InternalServerException;
import com.shopclothes.extension.ResourceNotFoundException;
import com.shopclothes.model.Brand;
import com.shopclothes.repository.BrandRepository;
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
public class BrandImpl implements IBrandService{
    private final BrandRepository brandRepository;
    @Override
    public Brand addNewBrand(String nameBrand, MultipartFile file) throws SQLException, IOException {
        Brand newBrand = new Brand();
        newBrand.setName(nameBrand);
        if(!file.isEmpty()){
            byte[] photoBytes = file.getBytes();
            Blob photoBlob = new SerialBlob(photoBytes);
            newBrand.setImageBrand(photoBlob);
        }
        return brandRepository.save(newBrand);
    }

    @Override
    public List<Brand> getAllBrands() {
        return brandRepository.findAll();
    }

    @Override
    public List<String> getAllBrandTypes() {
        return brandRepository.findDistinctBrandTypes();
    }

    @Override
    public void deleteBrand(Long brandId) {
        Optional<Brand> theBrand = brandRepository.findById(brandId);
        if(theBrand.isPresent()){
            brandRepository.deleteById(brandId);
        }

    }

    @Override
    public byte[] getBrandPhotoById(Long brandId) throws SQLException {
        Optional<Brand> theBrand = brandRepository.findById(brandId);
        if(theBrand.isEmpty()){
            throw new ResourceNotFoundException("Sorry, Brand not found!");
        }
        Blob photoBrand = theBrand.get().getImageBrand();
        if(photoBrand != null) {
            return photoBrand.getBytes(1,(int)photoBrand.length());
        }
        return null;
    }

    @Override
    public Brand updateBrand(Long brandId, String nameBrand, byte[] photoBytes) {
        Brand theBrand = brandRepository.findById(brandId)
                .orElseThrow(() -> new ResourceNotFoundException("Sorry, Brand not found!"));
        if(nameBrand != null) theBrand.setName(nameBrand);
        if(photoBytes != null && photoBytes.length > 0){
            try{
                theBrand.setImageBrand(new SerialBlob(photoBytes));
            } catch (SQLException ex){
                new InternalServerException("Error updating brand");
            }
        }
        return brandRepository.save(theBrand);
    }

    @Override
    public Optional<Brand> getBrandById(Long brandId) {
        return Optional.of(brandRepository.findById(brandId).get());
    }

    @Override
    public long getTotalBrands() {
        return brandRepository.count();
    }
}
