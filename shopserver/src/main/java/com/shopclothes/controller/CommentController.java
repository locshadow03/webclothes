package com.shopclothes.controller;

import com.shopclothes.dto.CommentDto;
import com.shopclothes.model.Comment;
import com.shopclothes.service.comment.ICommentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/comment")
public class CommentController {
    private final ICommentService commentService;
    @PostMapping("/new_comment")
    public ResponseEntity<?> addComment(@RequestBody Map<String, Object> payload) {
        Long productId = Long.valueOf(payload.get("productId").toString());
        Long userId = Long.valueOf(payload.get("userId").toString());
        String content = payload.get("content").toString();
        Long parentId = payload.get("parentId") != null ? Long.valueOf(payload.get("parentId").toString()) : null;

        Comment comment = commentService.createComment(productId, userId, content, parentId);
        return ResponseEntity.ok(comment);
    }

    @GetMapping("/product/{productId}")
    public ResponseEntity<List<CommentDto>> getCommentsByProductId(@PathVariable Long productId) {
        List<CommentDto> comments = commentService.getCommentsByProductId(productId);
        return ResponseEntity.ok(comments);
    }

}
