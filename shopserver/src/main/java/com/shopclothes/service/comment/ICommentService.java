package com.shopclothes.service.comment;

import com.shopclothes.dto.CommentDto;
import com.shopclothes.model.Comment;

import java.util.List;

public interface ICommentService {
    Comment createComment(Long productId, Long userId, String content, Long parentId);

    List<CommentDto> getCommentsByProductId(Long productId);
}
