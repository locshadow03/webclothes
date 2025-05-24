package com.shopclothes.service.comment;

import com.shopclothes.dto.CommentDto;
import com.shopclothes.model.Comment;
import com.shopclothes.model.Product;
import com.shopclothes.model.User;
import com.shopclothes.repository.CommentRepository;
import com.shopclothes.repository.ProductRepository;
import com.shopclothes.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CommentImpl implements ICommentService{
    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final CommentRepository commentRepository;

    @Override
    public Comment createComment(Long productId, Long userId, String content, Long parentId) {
        Product product = productRepository.findById(productId).orElseThrow();
        User user = userRepository.findById(userId).orElseThrow();

        Comment comment = new Comment();
        comment.setProduct(product);
        comment.setUser(user);
        comment.setContent(content);
        comment.setCreatedAt(LocalDateTime.now());

        if (parentId != null) {
            Comment parent = commentRepository.findById(parentId).orElseThrow();
            comment.setParent(parent);
        }

        return commentRepository.save(comment);
    }

    @Override
    @Transactional
    public List<CommentDto> getCommentsByProductId(Long productId) {
        List<Comment> topLevelComments = commentRepository.findByProductIdAndParentIsNullOrderByCreatedAtDesc(productId);
        return topLevelComments.stream().map(this::convertToDto).collect(Collectors.toList());
    }

    private CommentDto convertToDto(Comment c) {
        CommentDto dto = new CommentDto();
        dto.setId(c.getId());
        dto.setContent(c.getContent());
        dto.setUserName(c.getUser().getUsername());
        dto.setCreatedAt(c.getCreatedAt());
        dto.setReplies(
                c.getReplies().stream()
                        .sorted(Comparator.comparing(Comment::getCreatedAt))
                        .map(this::convertToDto)
                        .collect(Collectors.toList())
        );
        return dto;
    }

}
