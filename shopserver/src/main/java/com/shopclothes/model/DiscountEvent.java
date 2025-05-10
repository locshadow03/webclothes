package com.shopclothes.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "discount_event")
public class DiscountEvent {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name_event;

    private String description_event;

    private String img_event;

    private LocalDate startDate;
    private LocalDate endDate;

    private Double discountAmount;

    private boolean isPercentage;

    private boolean active = true;

    @OneToMany(mappedBy = "discountEvent" , cascade = CascadeType.ALL, orphanRemoval = true)
    private List<DiscountEventBrands> discountEventBrands = new ArrayList<>();

    @OneToMany(mappedBy = "discountEvent", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<DiscountEventCategories> discountEventCategories = new ArrayList<>();

    @OneToMany(mappedBy = "discountEvent", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<DiscountEventProducts> discountEventProducts = new ArrayList<>();
}
