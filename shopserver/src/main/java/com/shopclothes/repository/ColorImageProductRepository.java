package com.shopclothes.repository;

import com.shopclothes.model.ColorImageProduct;
import com.shopclothes.model.SizeQuantity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ColorImageProductRepository extends JpaRepository<ColorImageProduct, Long> {

    @Query("select  cl from ColorImageProduct cl where cl.id = :colorImage_id")
    ColorImageProduct getColorImageProductById(@Param("colorImage_id") Long colorImage_id);

    @Query("SELECT cip FROM ColorImageProduct cip WHERE cip.sizeQuantity = :sizeQuantity AND cip.color = :color")
    Optional<ColorImageProduct> findBySizeQuantityAndColor(@Param("sizeQuantity") SizeQuantity sizeQuantity, @Param("color") String color);

    @Query("select cl from ColorImageProduct cl where cl.color = :color and cl.sizeQuantity.id = :size_id")
    ColorImageProduct getQuanityByIdColorAndSizeQuantity(@Param("color") String color , @Param("size_id") Long size_id);

    @Query("select cl from ColorImageProduct cl where cl.sizeQuantity.id = :size_id")
    List<ColorImageProduct> findColorImageProductBySizeQuantityId(@Param("size_id") Long size_id);
}
