package com.shopclothes.model;

import jakarta.persistence.*;
import lombok.*;

import java.sql.Blob;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "categories")
public class Category {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "category_id")
    private Long id;

    @Column(nullable = false, unique = true)
    private String nameCategory;

    @Lob
    @Column(nullable = false)
    private Blob imageCategory;

    @OneToMany(mappedBy = "category")
    private List<Product> products;
}
