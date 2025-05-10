package com.shopclothes.service.event;

import com.shopclothes.dto.event.DiscountAndPercentage;
import com.shopclothes.dto.event.DiscountEventDto;
import com.shopclothes.model.*;
import com.shopclothes.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DiscountEventImpl implements IDiscountEventService{
    private final BrandRepository brandRepository;
    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;
    private final DiscountEventRepository discountEventRepository;
    private final DiscountEventBrandRepository discountEventBrandRepository;
    private final DiscountEventCategoryRepository discountEventCategoryRepository;
    private final DiscountEventProductRepository discountEventProductRepository;
    @Override
    public DiscountEventDto createDiscountEvent(DiscountEventDto dto) {
        DiscountEvent event = new DiscountEvent();
        event.setName_event(dto.getName_event());
        event.setDescription_event(dto.getDescriptionEvent());
        event.setImg_event(dto.getImg_event());
        event.setStartDate(dto.getStartDate());
        event.setEndDate(dto.getEndDate());
        event.setDiscountAmount(dto.getDiscountAmount());
        event.setPercentage(dto.isPercentage());

        for (Long brandId : dto.getBrand_id()) {
            Brand brand = brandRepository.findById(brandId)
                    .orElseThrow(() -> new RuntimeException("Brand not found with ID: " + brandId));

            DiscountEventBrands deb = new DiscountEventBrands();
            deb.setBrand(brand);
            deb.setDiscountEvent(event);
            deb.setDiscountAmount(dto.getDiscountAmount());
            deb.setPercentage(dto.isPercentage());

            event.getDiscountEventBrands().add(deb);
        }

        // ==== CATEGORIES ====
        for (Long categoryId : dto.getCategory_id()) {
            Category category = categoryRepository.findById(categoryId)
                    .orElseThrow(() -> new RuntimeException("Category not found with ID: " + categoryId));

            DiscountEventCategories dec = new DiscountEventCategories();
            dec.setCategory(category);
            dec.setDiscountEvent(event);
            dec.setDiscountAmount(dto.getDiscountAmount());
            dec.setPercentage(dto.isPercentage());

            event.getDiscountEventCategories().add(dec);
        }

        // ==== PRODUCTS ====
        for (Long productId : dto.getProduct_id()) {
            Product product = productRepository.findById(productId)
                    .orElseThrow(() -> new RuntimeException("Product not found with ID: " + productId));

            DiscountEventProducts dep = new DiscountEventProducts();
            dep.setProduct(product);
            dep.setDiscountEvent(event);
            dep.setDiscountAmount(dto.getDiscountAmount());
            dep.setPercentage(dto.isPercentage());

            event.getDiscountEventProducts().add(dep);
        }

        DiscountEvent discountEvent = discountEventRepository.save(event);
        return mapToDto(discountEvent);
    }

    @Transactional
    @Override
    public DiscountEventDto updateDiscountEvent(Long id, DiscountEventDto dto) {
        DiscountEvent event = discountEventRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("DiscountEvent not found with id: " + id));

        // Cập nhật thông tin cơ bản
        event.setName_event(dto.getName_event());
        event.setDescription_event(dto.getDescriptionEvent());
        event.setStartDate(dto.getStartDate());
        event.setEndDate(dto.getEndDate());
        event.setDiscountAmount(dto.getDiscountAmount());
        event.setPercentage(dto.isPercentage());

        // Xoá hết các quan hệ cũ
        event.getDiscountEventBrands().clear();
        event.getDiscountEventCategories().clear();
        event.getDiscountEventProducts().clear();

        // Brands mới
        for (Long brandId : dto.getBrand_id()) {
            Brand brand = brandRepository.findById(brandId)
                    .orElseThrow(() -> new RuntimeException("Brand not found: " + brandId));
            DiscountEventBrands deb = new DiscountEventBrands();
            deb.setDiscountEvent(event);
            deb.setBrand(brand);
            deb.setDiscountAmount(dto.getDiscountAmount());
            deb.setPercentage(dto.isPercentage());
            event.getDiscountEventBrands().add(deb);
        }

        // Categories mới
        for (Long categoryId : dto.getCategory_id()) {
            Category category = categoryRepository.findById(categoryId)
                    .orElseThrow(() -> new RuntimeException("Category not found: " + categoryId));
            DiscountEventCategories dec = new DiscountEventCategories();
            dec.setDiscountEvent(event);
            dec.setCategory(category);
            dec.setDiscountAmount(dto.getDiscountAmount());
            dec.setPercentage(dto.isPercentage());
            event.getDiscountEventCategories().add(dec);
        }

        // Products mới
        for (Long productId : dto.getProduct_id()) {
            Product product = productRepository.findById(productId)
                    .orElseThrow(() -> new RuntimeException("Product not found: " + productId));
            DiscountEventProducts dep = new DiscountEventProducts();
            dep.setDiscountEvent(event);
            dep.setProduct(product);
            dep.setDiscountAmount(dto.getDiscountAmount());
            dep.setPercentage(dto.isPercentage());
            event.getDiscountEventProducts().add(dep);
        }

        // Lưu lại
        DiscountEvent saved = discountEventRepository.save(event);

        return mapToDto(saved);
    }

    @Transactional
    public DiscountEventDto getDiscountEventById(Long id) {
        DiscountEvent event = discountEventRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Event not found with id: " + id));

        return mapToDto(event);
    }

    public void deleteDiscountEvent(Long id) {
        DiscountEvent event = discountEventRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Event not found"));
        discountEventRepository.delete(event);
    }

    @Transactional
    public List<DiscountEventDto> getAllDiscountEvents() {
        List<DiscountEvent> events = discountEventRepository.findAll();

        return events.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public List<DiscountEvent> getTodayDiscountEvents() {
        LocalDate today = LocalDate.now();
        return discountEventRepository.findActiveDiscountEventsToday(today);
    }

    @Override
    public DiscountAndPercentage getDisCountProductNowByProductId(Long product_id) {
        Product product = productRepository.findById(product_id).orElseThrow(() -> new RuntimeException("Event not found with id: " + product_id));
        List<DiscountEvent> discountEvents = getTodayDiscountEvents();

        List<DiscountAndPercentage> discountAndPercentages = new ArrayList<>();
        for(DiscountEvent discountEvent : discountEvents){
            List<Long> brands = discountEventBrandRepository.findAllBrandByEventId(discountEvent.getId());
            List<Long> categories = discountEventCategoryRepository.findAllCategoryByEventId(discountEvent.getId());
            List<Long> products = discountEventProductRepository.findAllProductByEventId(discountEvent.getId());
            Set<Long> productIdSet = new HashSet<>(products);
            Set<Long> brandIdSet = new HashSet<>(brands);
            Set<Long> categoryIdSet = new HashSet<>(categories);
            if(productIdSet.contains(product.getId()) || brandIdSet.contains(product.getBrand().getId()) || categoryIdSet.contains(product.getCategory().getId())){
                DiscountAndPercentage discountAndPercentage = new DiscountAndPercentage();
                discountAndPercentage.setDiscount(discountEvent.getDiscountAmount());
                discountAndPercentage.setPercentage(discountEvent.isPercentage());

                if(discountAndPercentage.isPercentage()){
                    discountAndPercentage.setPriceNow(product.getPrice() - product.getPrice() * (discountEvent.getDiscountAmount()/100));
                } else {
                    discountAndPercentage.setPriceNow(product.getPrice() - discountEvent.getDiscountAmount());
                }
                discountAndPercentages.add(discountAndPercentage);
            } else {
                DiscountAndPercentage discountAndPercentage = new DiscountAndPercentage();
                discountAndPercentage.setDiscount(0.0);
                discountAndPercentage.setPercentage(true);
                discountAndPercentage.setPriceNow(product.getPrice());
                discountAndPercentages.add(discountAndPercentage);
            }
        }
        DiscountAndPercentage lowest = discountAndPercentages.stream()
                .min(Comparator.comparingDouble(DiscountAndPercentage::getPriceNow))
                .orElse(null);


        return lowest;
    }

    // Chuyển DiscountEvent thành DiscountEventDto
    private DiscountEventDto convertToDto(DiscountEvent event) {
        DiscountEventDto dto = new DiscountEventDto();
        dto.setId(event.getId());
        dto.setName_event(event.getName_event());
        dto.setImg_event(event.getImg_event());
        dto.setDescriptionEvent(event.getDescription_event());
        dto.setStartDate(event.getStartDate());
        dto.setEndDate(event.getEndDate());
        dto.setDiscountAmount(event.getDiscountAmount());
        dto.setPercentage(event.isPercentage());

        // Lấy danh sách product, brand, category từ event
        dto.setProduct_id(event.getDiscountEventProducts().stream()
                .map(discountEventProduct -> discountEventProduct.getProduct().getId())
                .collect(Collectors.toList()));

        dto.setBrand_id(event.getDiscountEventBrands().stream()
                .map(discountEventBrand -> discountEventBrand.getBrand().getId())
                .collect(Collectors.toList()));

        dto.setCategory_id(event.getDiscountEventCategories().stream()
                .map(discountEventCategory -> discountEventCategory.getCategory().getId())
                .collect(Collectors.toList()));

        return dto;
    }


    private DiscountEventDto mapToDto(DiscountEvent event) {
        DiscountEventDto dto = new DiscountEventDto();
        dto.setId(event.getId());
        dto.setName_event(event.getName_event());
        dto.setImg_event(event.getImg_event());
        dto.setDescriptionEvent(event.getDescription_event());
        dto.setStartDate(event.getStartDate());
        dto.setEndDate(event.getEndDate());
        dto.setDiscountAmount(event.getDiscountAmount());
        dto.setPercentage(event.isPercentage());

        // Lấy id từ các entity liên kết
        dto.setBrand_id(event.getDiscountEventBrands()
                .stream()
                .map(deb -> deb.getBrand().getId())
                .collect(Collectors.toList()));

        dto.setCategory_id(event.getDiscountEventCategories()
                .stream()
                .map(dec -> dec.getCategory().getId())
                .collect(Collectors.toList()));

        dto.setProduct_id(event.getDiscountEventProducts()
                .stream()
                .map(dep -> dep.getProduct().getId())
                .collect(Collectors.toList()));

        return dto;
    }

}
