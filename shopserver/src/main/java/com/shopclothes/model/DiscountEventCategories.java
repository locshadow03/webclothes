package com.shopclothes.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "discount_event_categories")
public class DiscountEventCategories {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "event_id")
    private DiscountEvent discountEvent;

    @ManyToOne
    @JoinColumn(name = "category_id")
    private Category category;

    private Double discountAmount;

    private boolean isPercentage;
}
