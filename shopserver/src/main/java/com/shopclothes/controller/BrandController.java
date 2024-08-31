package com.shopclothes.controller;

import com.shopclothes.dto.BrandDto;
import com.shopclothes.extension.PhotoRetrievalExcetion;
import com.shopclothes.extension.ResourceNotFoundException;
import com.shopclothes.model.Brand;
import com.shopclothes.service.brand.IBrandService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.sql.rowset.serial.SerialBlob;
import java.io.IOException;
import java.sql.Blob;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Base64;
import java.util.List;
import java.util.Optional;

@CrossOrigin("http://localhost:3000")
@RestController
@RequiredArgsConstructor
@RequestMapping("/dashboard/brands")
public class BrandController {
    private final IBrandService brandService;

    @PostMapping("/add/new-brand")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<BrandDto> addNewBrand(@RequestParam("nameBrand") String nameBrand,
                                                @RequestParam("photoBrand") MultipartFile photoBrand) throws SQLException, IOException{
        Brand savedBrand = brandService.addNewBrand(nameBrand, photoBrand);
        BrandDto brandDto = new BrandDto(savedBrand.getId(), savedBrand.getName());
        return ResponseEntity.ok(brandDto);
    }

    @GetMapping("/all-brands")
    public ResponseEntity<List<BrandDto>> allBrands() throws SQLException{
        List<Brand> brands = brandService.getAllBrands();
        List<BrandDto> brandDtos = new ArrayList<>();
        for(Brand brand : brands){
            byte[] photoBytes = brandService.getBrandPhotoById(brand.getId());
            if(photoBytes != null && photoBytes.length > 0){
                String base64Photo = Base64.getEncoder().encodeToString(photoBytes);
                BrandDto brandDto = getBrandDto(brand);
                brandDto.setImageBrand(base64Photo);
                brandDtos.add(brandDto);
            }
        }
        return ResponseEntity.ok(brandDtos);
    }

    @DeleteMapping("/delete/brand/{brandId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteBrand(@PathVariable Long brandId){
        brandService.deleteBrand(brandId);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @PutMapping("/update/{brandId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<BrandDto> updateRoom(@PathVariable Long brandId,
                                                  @RequestParam("nameBrand") String nameBrand,
                                                  @RequestParam("imageBrand") MultipartFile photo) throws SQLException, IOException {
        byte[] photoBytes = photo != null && !photo.isEmpty() ? photo.getBytes() : brandService.getBrandPhotoById(brandId);

        Blob photoBlob = photoBytes != null && photoBytes.length > 0 ? new SerialBlob(photoBytes) : null;
        Brand brand = brandService.updateBrand(brandId, nameBrand, photoBytes);
        brand.setImageBrand(photoBlob);
        BrandDto brandDto = getBrandDto(brand);
        return ResponseEntity.ok(brandDto);
    }

    @GetMapping("/brand/{brandId}")
    public ResponseEntity<Optional<BrandDto>> getBrandById(@PathVariable Long brandId){
        Optional<Brand> theBrand = brandService.getBrandById(brandId);
        return theBrand.map(brand ->{
            BrandDto brandDto = getBrandDto(brand);
            return ResponseEntity.ok(Optional.of(brandDto));
        }).orElseThrow(() -> new ResourceNotFoundException("Brand not found"));
    }

    @GetMapping("/brand/types")
    public List<String> getBrandTypes(){
        return brandService.getAllBrandTypes();
    }

    private BrandDto getBrandDto(Brand brand) {
        byte[] photoBytes = null;
        Blob photoBlob = brand.getImageBrand();
        if(photoBlob != null){
            try{
                photoBytes = photoBlob.getBytes(1, (int) photoBlob.length());
            } catch (SQLException e){
                throw  new PhotoRetrievalExcetion("Error retrieving photo");
            }
        }
        return new BrandDto(brand.getId(), brand.getName(),photoBytes);
    }

    @GetMapping("/brand/count")
    public long getTotalBrand() {
        return brandService.getTotalBrands();
    }
}
