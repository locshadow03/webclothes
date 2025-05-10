package com.shopclothes.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "discount_event_products")
public class DiscountEventProducts {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "event_id")
    private DiscountEvent discountEvent;

    @ManyToOne
    @JoinColumn(name = "event_product")
    private Product product;

    private Double discountAmount;

    private boolean isPercentage;
}
