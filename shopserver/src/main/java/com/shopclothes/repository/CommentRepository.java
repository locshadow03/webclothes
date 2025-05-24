package com.shopclothes.repository;

import com.shopclothes.model.Comment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface CommentRepository extends JpaRepository<Comment, Long> {
    @Query("SELECT c FROM Comment c WHERE c.product.id = :productId AND c.parent IS NULL ORDER BY c.createdAt DESC")
    List<Comment> findByProductIdAndParentIsNullOrderByCreatedAtDesc(@Param("productId") Long productId);

}
