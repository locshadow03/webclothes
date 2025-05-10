package com.shopclothes.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "discount_event_brands")
public class DiscountEventBrands {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "event_id")
    private DiscountEvent discountEvent;

    @ManyToOne
    @JoinColumn(name = "brand_id")
    private Brand brand;

    private Double discountAmount;

    private boolean isPercentage;
}
