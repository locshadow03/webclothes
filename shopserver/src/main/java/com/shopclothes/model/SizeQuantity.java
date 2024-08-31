package com.shopclothes.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "size_quantities")
public class SizeQuantity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "size_quantity_id")
    private Long id;

    @Column(nullable = false)
    private String size;

    @Column(nullable = false)
    private int quantity;

    @ManyToOne
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    public SizeQuantity(String size, int quantity, Product product) {
        this.size = size;
        this.quantity = quantity;
        this.product = product;
    }
}

