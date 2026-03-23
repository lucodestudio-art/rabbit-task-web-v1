import React, { useState } from 'react';
import { Post as PostType } from '../types';
import { Heart, MessageCircle, Share2, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { Comment } from './Comment';
import { useStore } from '../store/useStore';
import PostImageGrid from "./post/PostImageGrid";
import ImageViewerModal from "./post/ImageViewerModal";
import {formatTimeAgo} from "../utils/time";
import { SellerInfo } from './post/SellerInfo';
import { toggleLikeApi } from '../services/postService';
import { createCommentApi } from '../services/postService';
import { Comment as CommentType } from '../types';
import { buildImageUrl } from '../utils/image';



interface PostProps {
  post: PostType;
  onLike?: (postCode: string, liked: boolean) => void
  onAddComment?: (postCode: string, comment: CommentType) => void
  onShare?: (postId: string) => void;
  onDeleteComment?: (postId: string, commentId: string) => void;
}

export const Post: React.FC<PostProps> = ({
  post,
  onLike,
  onComment,
  onShare,
  onDeleteComment
}) => {
  const { user } = useStore();
  const [isLiked, setIsLiked] = useState(post.liked);
  const [likeCount, setLikeCount] = useState(post.likeCount || 0);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [viewerIndex, setViewerIndex] = useState<number | null>(null);


  const handleLike = async () => {
    const newLiked = !isLiked;

    setIsLiked(newLiked);
    setLikeCount(prev => newLiked ? prev + 1 : prev - 1);

    try {
      const res = await toggleLikeApi(post.code);
      onLike?.(post.code, res.data.liked);
    } catch (e) {
      console.error(e);
      // rollback
      setIsLiked(!newLiked);
      setLikeCount(prev => newLiked ? prev - 1 : prev + 1);
    }
  };

  const handleAddComment = async () => {
    if (!commentText.trim()) return;
    try {
      const res = await createCommentApi(
        post.code,
        commentText
      );
      onAddComment?.(post.code, res.data);
      setCommentText("");
    } catch (e) {
      console.error(e);
    }
  };

  const handleShare = () => {
    onShare?.(post.id);
    // Copy to clipboard or open share modal
    const url = `${window.location.origin}/#/news/${post.id}`;
    navigator.clipboard.writeText(url).catch(() => {});
    alert('Đã sao chép liên kết bài viết');
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % post.files.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + post.files.length) % post.files.length);
  };

  const goToImage = (index: number) => {
    setCurrentImageIndex(index);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition duration-300">
      {/* Header - Author info */}
      <div className="p-2 border-b border-slate-100">
        <div className="flex items-center gap-3">
          {post.seller?.avatar && (
            <img
              src={buildImageUrl(post.seller.avatar)}
              alt={post.seller?.name || 'Author'}
              className="w-12 h-12 rounded-full object-cover"
            />
          )}

          <div className="flex-1 min-w-0 leading-tight">

            <SellerInfo seller={post.seller} />
            <p className="text-xs text-slate-400 flex items-center gap-1 mt-1">
              <span>•</span>
              <span>{formatTimeAgo(post.createdAt)}</span>
            </p>
          </div>

        </div>
        
        {/* Post title */}
        {post.title && (
          <h2 className="font-bold text-slate-900 mt-3 text-lg line-clamp-2">{post.title}</h2>
        )}

      </div>

      <div className="p-2 py-1 space-y-2">

        <h2 className="text-base font-semibold text-slate-900 line-clamp-2">
          {post.content}
        </h2>

        {post.description && (
          <p className="text-sm text-slate-600 line-clamp-3 leading-relaxed">
            {post.description}
          </p>
        )}

        {post.apartment && (
        <div className="mt-3 mb-3 flex items-center flex-wrap gap-2 text-xs">

          <span className="flex items-center gap-1 bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-full font-medium">
            📍 Vinhomes Grand Park
          </span>

          <span className="text-slate-300">›</span>

          <span className="bg-sky-50 text-sky-700 px-2.5 py-1 rounded-full font-medium">
            {post.apartment.zoneName}
          </span>

          <span className="text-slate-300">›</span>

          <span className="bg-violet-50 text-violet-700 px-2.5 py-1 rounded-full font-medium">
            {post.apartment.buildingName}
          </span>

          <span className="text-slate-300">›</span>

          <span className="bg-indigo-600 text-white px-3 py-1 rounded-full font-semibold shadow-sm">
            {post.apartment.apartmentName}
          </span>

        </div>
        )}

      </div>

      {post.files?.length > 0 && (
        <PostImageGrid
          files={post.files}
          buildImageUrl={buildImageUrl}
          onImageClick={(index) => setViewerIndex(index)}
        />
      )}

      {/* Image Viewer Modal */}
      {viewerIndex !== null && (
        <ImageViewerModal
          files={post.files}
          index={viewerIndex}
          buildImageUrl={buildImageUrl}
          onClose={() => setViewerIndex(null)}
          onChange={(i) => setViewerIndex(i)}
        />
      )}

      {/* Engagement stats */}
      <div className="px-4 py-2 flex items-center justify-between text-xs text-slate-500 border-b border-slate-100">
        <div className="flex items-center gap-1">
          <Heart size={14} className="text-red-500" />
          <span>{likeCount} người thích</span>
        </div>

        <div className="flex items-center gap-4">
          <span>{post.commentCount || 0} bình luận</span>
          <span>{post.shareCount || 0} chia sẻ</span>
        </div>
      </div>

      {/* Action buttons */}
      <div className="p-3 flex items-center gap-3 border-b border-slate-100">
        <button
          onClick={handleLike}
          className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg font-semibold text-sm transition ${
            isLiked
              ? 'text-brand-600 bg-brand-50'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Heart size={18} fill={isLiked ? 'currentColor' : 'none'} />
          <span>{isLiked ? 'Bỏ thích' : 'Yêu thích'}</span>
        </button>
        <button
          onClick={() => setShowComments(!showComments)}
          className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg font-semibold text-sm text-slate-600 hover:bg-slate-100 transition"
        >
          <MessageCircle size={18} />
          <span>Bình luận</span>
        </button>
        <button
          onClick={handleShare}
          className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg font-semibold text-sm text-slate-600 hover:bg-slate-100 transition"
        >
          <Share2 size={18} />
          <span>Chia sẻ</span>
        </button>
      </div>

      {/* Comments section */}
      {showComments && (
        <div className="p-4 border-t border-slate-100 bg-slate-50">
          {/* Comment input */}
          {user && (
            <div className="flex gap-3 mb-4 pb-4 border-b border-slate-100">
              {user.avatar && (
                <img
                  src={user.avatar}
                  alt={user.name || 'User'}
                  className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                />
              )}
              <div className="flex-1 flex gap-2">
                <input
                  type="text"
                  placeholder="Viết bình luận..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleAddComment();
                    }
                  }}
                  className="flex-1 bg-white border border-slate-200 rounded-full px-4 py-2 text-sm focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
                />
                <button
                  onClick={handleAddComment}
                  disabled={!commentText.trim()}
                  className="px-4 py-2 bg-brand-600 text-white rounded-full font-semibold text-sm hover:bg-brand-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Đăng
                </button>
              </div>
            </div>
          )}

          {/* Comments list */}
          <div className="space-y-3">
            {post.comments && post.comments.length > 0 ? (
              post.comments.map((comment) => (
                <Comment
                  key={comment.id}
                  comment={comment}
                  onDelete={(commentId) => onDeleteComment?.(post.id, commentId)}
                  onLike={(commentId) => {
                    // Handle comment like
                  }}
                />
              ))
            ) : (
              <p className="text-center text-slate-500 text-sm py-4">Chưa có bình luận</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
