package com.shopclothes.controller;

import com.shopclothes.dto.event.DiscountEventDto;
import com.shopclothes.service.event.IDiscountEventService;
import com.shopclothes.service.upload.IImageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@CrossOrigin("http://localhost:3000")
@RestController
@RequiredArgsConstructor
@RequestMapping("/event")
public class DisEventController {

    private final IDiscountEventService discountEventService;
    private final IImageService imageService;
    @PostMapping("/create/discount-event")
    public ResponseEntity<DiscountEventDto> createDiscountEvent(
            @RequestParam("imageEvent") MultipartFile imageEvent,
            @RequestParam("name_event") String nameEvent,
            @RequestParam("description_event") String descriptionEvent,
            @RequestParam("startDate") LocalDate startDate,
            @RequestParam("endDate") LocalDate endDate,
            @RequestParam("discountAmount") Double discountAmount,
            @RequestParam("isPercentage") Boolean isPercentage,
            @RequestParam("brand_id") String brandIdString,
            @RequestParam("product_id") String productIdString,
            @RequestParam("category_id") String categoryIdString
    ) throws IOException {

        List<Long> brandIds = parseToLongList(brandIdString);
        List<Long> productIds = parseToLongList(productIdString);
        List<Long> categoryIds = parseToLongList(categoryIdString);
        DiscountEventDto eventDto = new DiscountEventDto();
        // Cập nhật DTO từ các tham số
        eventDto.setName_event(nameEvent);
        eventDto.setDescriptionEvent(descriptionEvent);
        eventDto.setStartDate(startDate);
        eventDto.setEndDate(endDate);
        eventDto.setDiscountAmount(discountAmount);
        if(isPercentage != null){
            eventDto.setPercentage(isPercentage);
        } else {
            eventDto.setPercentage(false);
        }
        eventDto.setProduct_id(productIds);
        eventDto.setBrand_id(brandIds);
        eventDto.setCategory_id(categoryIds);


        // Lưu ảnh nếu có
        if (!imageEvent.isEmpty()) {
            String img = imageService.saveImage(imageEvent);
            eventDto.setImg_event(img);
        }

        DiscountEventDto createdEvent = discountEventService.createDiscountEvent(eventDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdEvent);
    }

    @PutMapping("/update_event/{id}")
    public ResponseEntity<DiscountEventDto> updateDiscountEvent(
            @PathVariable Long id,
            @RequestParam("imageEvent") MultipartFile imageEvent,
            @RequestParam("name_event") String nameEvent,
            @RequestParam("description_event") String descriptionEvent,
            @RequestParam("startDate") LocalDate startDate,
            @RequestParam("endDate") LocalDate endDate,
            @RequestParam("discountAmount") Double discountAmount,
            @RequestParam("isPercentage") Boolean isPercentage,
            @RequestParam("brand_id") String brandIdString,
            @RequestParam("product_id") String productIdString,
            @RequestParam("category_id") String categoryIdString
    ) throws IOException {

        List<Long> brandIds = parseToLongList(brandIdString);
        List<Long> productIds = parseToLongList(productIdString);
        List<Long> categoryIds = parseToLongList(categoryIdString);
        DiscountEventDto eventDto = new DiscountEventDto();
        // Cập nhật DTO từ các tham số
        eventDto.setId(id);
        eventDto.setName_event(nameEvent);
        eventDto.setDescriptionEvent(descriptionEvent);
        eventDto.setStartDate(startDate);
        eventDto.setEndDate(endDate);
        eventDto.setDiscountAmount(discountAmount);
        if(isPercentage != null){
            eventDto.setPercentage(isPercentage);
        } else {
            eventDto.setPercentage(false);
        }
        eventDto.setProduct_id(productIds);
        eventDto.setBrand_id(brandIds);
        eventDto.setCategory_id(categoryIds);

        if (!imageEvent.isEmpty()) {
            String img = imageService.saveImage(imageEvent);
            eventDto.setImg_event(img);
        }

        DiscountEventDto updatedEvent = discountEventService.updateDiscountEvent(id, eventDto);
        return ResponseEntity.ok(updatedEvent);
    }


    @GetMapping("/view_event/{id}")
    public ResponseEntity<DiscountEventDto> getDiscountEvent(@PathVariable Long id) {
        DiscountEventDto event = discountEventService.getDiscountEventById(id);
        return ResponseEntity.ok(event);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDiscountEvent(@PathVariable Long id) {
        discountEventService.deleteDiscountEvent(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    private List<Long> parseToLongList(String input) {
        if (input == null || input.trim().isEmpty()) return new ArrayList<>();
        // Remove square brackets if present
        input = input.replace("[", "").replace("]", "").trim();
        return Arrays.stream(input.split(","))
                .map(String::trim)
                .map(Long::valueOf)
                .collect(Collectors.toList());
    }

    @GetMapping("/all-events")
    public ResponseEntity<List<DiscountEventDto>> getAllDiscountEvents() {
        List<DiscountEventDto> events = discountEventService.getAllDiscountEvents();
        return ResponseEntity.ok(events);
    }
}
