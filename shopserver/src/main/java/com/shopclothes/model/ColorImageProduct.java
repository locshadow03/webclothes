package com.shopclothes.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "image_product")
public class ColorImageProduct {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String imageProduct;

    @Column(nullable = false)
    private String color;

    @Column(nullable = false)
    private int quantity;

    @ManyToOne
    @JoinColumn(name = "size_id")
    private SizeQuantity sizeQuantity;



}
