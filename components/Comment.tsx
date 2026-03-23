import React, { useState } from 'react';
import { Comment as CommentType } from '../types';
import { Heart, Trash2 } from 'lucide-react';
import { useStore } from '../store/useStore';

interface CommentProps {
  comment: CommentType;
  onDelete?: (commentId: string) => void;
  onLike?: (commentId: string) => void;
}

export const Comment: React.FC<CommentProps> = ({ comment, onDelete, onLike }) => {
  const { user } = useStore();
  const [isLiked, setIsLiked] = useState(comment.liked);
  const [likeCount, setLikeCount] = useState(comment.likes);

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikeCount(isLiked ? likeCount - 1 : likeCount + 1);
    onLike?.(comment.id);
  };

  const isOwnComment = user?.id === comment.author.id;
  const createdAtTime = new Date(comment.createdAt).toLocaleString('vi-VN');

  return (
    <div className="flex gap-3 pb-3 border-b border-slate-100 last:border-b-0">
      <img
        src={comment.author.avatar}
        alt={comment.author.name}
        className="w-8 h-8 rounded-full object-cover flex-shrink-0"
      />
      <div className="flex-1 min-w-0">
        <div className="bg-slate-100 rounded-2xl px-3 py-2 mb-1">
          <p className="font-semibold text-sm text-slate-900">{comment.author.name}</p>
          <p className="text-sm text-slate-700 break-words">{comment.content}</p>
        </div>
        <div className="flex items-center gap-3 text-xs text-slate-500 px-3">
          <button
            onClick={handleLike}
            className={`font-semibold hover:text-brand-600 transition ${
              isLiked ? 'text-brand-600' : ''
            }`}
          >
            <div className="flex items-center gap-1">
              <Heart size={12} fill={isLiked ? 'currentColor' : 'none'} />
              {likeCount > 0 && <span>{likeCount}</span>}
            </div>
          </button>
          <span>{createdAtTime}</span>
          {isOwnComment && (
            <button
              onClick={() => onDelete?.(comment.id)}
              className="text-slate-400 hover:text-red-500 transition"
              title="Xóa bình luận"
            >
              <Trash2 size={12} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
