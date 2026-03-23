import React, { useState, useEffect } from "react";
import { Post as PostType } from "../types";
import { Comment as CommentType } from "../types";
import { Post } from "../components/Post";
import { useStore } from "../store/useStore";
import { getHomePostsApi, sharePostApi } from "../services/postService";
import SidebarFilters from "@/components/SidebarFilters";
import RightSidebar from "@/components/RightSidebar";
export const News: React.FC = () => {
  const { user } = useStore();
  const [posts, setPosts] = useState<PostType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPosts, setTotalPosts] = useState(0);

  useEffect(() => {
    loadPosts(currentPage);
  }, [currentPage]);

  const handleAddComment = (postCode: string, comment: CommentType) => {
    setPosts((prev) =>
      prev.map((p) =>
        p.code === postCode
          ? {
              ...p,
              comments: [comment, ...(p.comments || [])],
              commentCount: (p.commentCount || 0) + 1,
            }
          : p,
      ),
    );
  };

  const loadPosts = async (page: number) => {
    try {
      setIsLoading(true);
      setError(null);

      const { posts, total } = await getHomePostsApi(page, 10);

      setPosts(posts);
      setTotalPosts(total);
    } catch (err) {
      const errorMsg =
        err instanceof Error ? err.message : "Lỗi khi tải bài viết";

      console.error("[News] ❌ Error loading posts:", err);
      setError(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLike = (postCode: string, liked: boolean) => {
    setPosts((prev) =>
      prev.map((p) =>
        p.code === postCode
          ? {
              ...p,
              likeCount: liked ? p.likeCount + 1 : p.likeCount - 1,
              isLiked: liked,
            }
          : p,
      ),
    );
  };

  const handleShare = async (postId: string) => {
    try {
      await sharePostApi(postId);
      // Update local state
      setPosts(
        posts.map((post) => {
          if (post.id === postId) {
            return {
              ...post,
              shares: post.shares + 1,
            };
          }
          return post;
        }),
      );
      alert("Đã chia sẻ bài viết");
    } catch (err) {
      console.error("Error sharing post:", err);
    }
  };

  const handleDeleteComment = async (postId: string, commentId: string) => {
    try {
      await deleteCommentApi(postId, commentId);
      // Update local state
      setPosts(
        posts.map((post) => {
          if (post.id === postId) {
            return {
              ...post,
              comments: post.comments.filter((c) => c.id !== commentId),
            };
          }
          return post;
        }),
      );
    } catch (err) {
      console.error("Error deleting comment:", err);
      alert("Không thể xóa bình luận");
    }
  };

  const handleLoadMore = () => {
    setCurrentPage(currentPage + 1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Main Layout */}
      <div className="max-w-[1600px] mx-auto px-4 py-6 flex flex-col lg:flex-row gap-6 items-start">
        <SidebarFilters />

        <div className="max-w-3xl mx-auto px-4 py-8">
          {/* Loading state */}
          {isLoading && posts.length === 0 && (
            <div className="bg-white rounded-2xl p-12 text-center">
              <div className="inline-block">
                <div className="w-8 h-8 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin"></div>
              </div>
              <p className="text-slate-500 mt-4">Đang tải bài viết...</p>
            </div>
          )}

          {/* Error state */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-4 text-red-700 text-center mb-6">
              <p>{error}</p>
              <button
                onClick={() => loadPosts(currentPage)}
                className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
              >
                Thử lại
              </button>
            </div>
          )}

          {/* Posts list */}
          <div className="space-y-6">
            {posts && posts.length > 0
              ? posts.map((post) => (
                  <Post
                    key={post.code}
                    post={post}
                    onLike={handleLike}
                    onAddComment={handleAddComment}
                    onShare={handleShare}
                    onDeleteComment={handleDeleteComment}
                  />
                ))
              : !isLoading && (
                  <div className="bg-white rounded-2xl p-12 text-center text-slate-500">
                    <p className="text-lg">Chưa có bài viết nào</p>
                  </div>
                )}
          </div>

          {/* Load more button */}
          {posts && posts.length > 0 && currentPage * 10 < totalPosts && (
            <div className="mt-8 text-center">
              <button
                onClick={handleLoadMore}
                disabled={isLoading}
                className="px-8 py-3 bg-brand-600 text-white rounded-full font-bold hover:bg-brand-700 transition shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Đang tải..." : "Xem thêm bài viết"}
              </button>
            </div>
          )}
        </div>
        {/* Right Sidebar */}
      <RightSidebar /> 
      </div>
      
    </div>
  );
};
