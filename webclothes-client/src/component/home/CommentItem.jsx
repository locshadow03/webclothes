import React from 'react';

const CommentItem = ({ comment, onReplyClick, currentUser }) => {
  return (
    <div 
      className="mb-3" 
      style={{ 
        marginLeft: comment.parentId ? '40px' : '0',
        borderLeft: comment.parentId ? '2px solid #eee' : 'none',
        paddingLeft: comment.parentId ? '20px' : '0'
      }}
    >
      <div className="d-flex gap-3">
        {/* User Avatar */}
        <div 
          className="rounded-circle" 
          style={{ 
            width: 40, 
            height: 40, 
            backgroundColor: "#e4e6eb",
            flexShrink: 0 
          }}
        />

        {/* Comment Content */}
        <div className="flex-grow-1">
          <div className="bg-light rounded-3 p-3">
            <div className="d-flex align-items-center gap-2 mb-2">
              <strong className="text-primary">{comment.userName}</strong>
              {comment.userName === currentUser && <span className="badge bg-secondary">Bạn</span>}
              <small className="text-muted">
                {new Date(comment.createdAt).toLocaleDateString('vi-VN', {
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </small>
            </div>
            <p className="mb-1">{comment.content}</p>
          </div>

          {/* Reply Button */}
          <button 
            onClick={() => onReplyClick(comment)}
            className="btn btn-link text-decoration-none p-0 mt-1"
            style={{ fontSize: '0.875rem' }}
          >
            Phản hồi
          </button>

          {/* Nested Comments */}
          {comment.replies?.map((child) => (
            <CommentItem
              key={child.id}
              comment={child}
              onReplyClick={onReplyClick}
              currentUser={currentUser}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default CommentItem;