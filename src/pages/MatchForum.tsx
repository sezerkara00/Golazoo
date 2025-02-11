import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Comment } from '../types/forum';
import { useAuth } from '../contexts/AuthContext'; // Auth context'i oluşturmanız gerekecek

interface MatchForumProps {
  matchId: number;
}

const CommentItem: React.FC<{ comment: Comment }> = ({ comment }) => {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const { user } = useAuth();

  const handleLike = async () => {
    try {
      await api.post(`/comments/${comment.id}/like`);
      // Yorumları yeniden yükle
    } catch (error) {
      console.error('Beğeni işlemi başarısız:', error);
    }
  };

  return (
    <div className="p-4 border-b border-gray-800">
      <div className="flex gap-3">
        <img 
          src={comment.userAvatar || '/default-avatar.png'} 
          alt={comment.userName}
          className="w-10 h-10 rounded-full"
        />
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="font-medium text-white">{comment.userName}</span>
            <span className="text-xs text-gray-500">
              {new Date(comment.createdAt).toLocaleString()}
            </span>
          </div>
          <p className="mt-2 text-gray-300">{comment.content}</p>
          <div className="mt-2 flex gap-4 text-sm">
            <button 
              onClick={handleLike}
              className={`flex items-center gap-1 ${comment.isLiked ? 'text-blue-500' : 'text-gray-500'}`}
            >
              👍 {comment.likes}
            </button>
            <button 
              onClick={() => setShowReplyForm(!showReplyForm)}
              className="text-gray-500 hover:text-gray-300"
            >
              💬 Yanıtla
            </button>
          </div>
          {showReplyForm && user && (
            <CommentForm 
              matchId={comment.matchId} 
              parentId={comment.id}
              onSuccess={() => setShowReplyForm(false)}
            />
          )}
          {comment.replies && comment.replies.length > 0 && (
            <div className="ml-8 mt-4 space-y-4">
              {comment.replies.map(reply => (
                <CommentItem key={reply.id} comment={reply} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const CommentForm: React.FC<{ 
  matchId: number; 
  parentId?: number;
  onSuccess?: () => void;
}> = ({ matchId, parentId, onSuccess }) => {
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || !user) return;

    setIsSubmitting(true);
    try {
      await api.post('/comments', {
        matchId,
        parentId,
        content: content.trim(),
      });
      setContent('');
      onSuccess?.();
    } catch (error) {
      console.error('Yorum gönderme başarısız:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Yorumunuzu yazın..."
        className="w-full p-3 bg-gray-800 rounded-lg text-white resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
        rows={3}
      />
      <div className="mt-2 flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting || !content.trim()}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Gönderiliyor...' : 'Gönder'}
        </button>
      </div>
    </form>
  );
};

const MatchForum: React.FC<MatchForumProps> = ({ matchId }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await api.get(`/matches/${matchId}/comments`);
        setComments(response.data);
      } catch (error) {
        console.error('Yorumlar yüklenirken hata:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, [matchId]);

  if (loading) return <div className="text-center text-gray-400">Yükleniyor...</div>;

  return (
    <div className="max-w-2xl mx-auto">
      {user ? (
        <CommentForm matchId={matchId} />
      ) : (
        <div className="text-center p-4 bg-gray-800 rounded-lg">
          <p className="text-gray-400">Yorum yapmak için giriş yapmalısınız.</p>
          <button className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg">
            Giriş Yap
          </button>
        </div>
      )}

      <div className="mt-8">
        {comments.length > 0 ? (
          <div className="divide-y divide-gray-800">
            {comments.map(comment => (
              <CommentItem key={comment.id} comment={comment} />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-400">
            Henüz yorum yapılmamış. İlk yorumu siz yapın!
          </p>
        )}
      </div>
    </div>
  );
};

export default MatchForum; 