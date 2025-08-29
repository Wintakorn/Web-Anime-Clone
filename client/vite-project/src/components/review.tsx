import { useEffect, useState } from 'react';
import { FaStar, FaThumbsUp } from 'react-icons/fa';
import { createReview, likeReview, fetchReviewsByManga, deleteReview, fetchReviews } from '../features/manga/reviewsAPI';
import type { ReviewItem, ReviewInput } from '../types/review.t';
import { Link } from 'react-router-dom';
import UserTagBadges from './profile-component/UserTagBadges';
import { getCurrentUser } from '../features/user/userAPI';

export interface Props {
  mangaId: string;
}

export default function ReviewSection({ mangaId }: Props) {
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [averageRating, setAverageRating] = useState<number>(0);
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState(0);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [visibleCount, setVisibleCount] = useState(3);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);

  const loadReviews = async () => {
    const data = await fetchReviewsByManga(mangaId);
    setReviews(data);
    const avg = data.reduce((sum, r) => sum + r.rating, 0) / (data.length || 1);
    setAverageRating(parseFloat(avg.toFixed(1)));
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        const [mangaReviews, allReviews] = await Promise.all([
          fetchReviewsByManga(mangaId),
          fetchReviews()
        ]);

        const tagMap = new Map<string, string[]>();
        allReviews.forEach((r) => {
          if (r.user && r.user._id) {
            tagMap.set(r.user._id, r.user.tagPerson || []);
          }
        });

        const enriched = mangaReviews.map((r) => ({
          ...r,
          user: {
            ...r.user,
            tagPerson: tagMap.get(r.user._id) || []
          }
        }));

        setReviews(enriched);

        const avg = enriched.reduce((sum, r) => sum + r.rating, 0) / (enriched.length || 1);
        setAverageRating(parseFloat(avg.toFixed(1)));
      } catch (err) {
        console.error("โหลดรีวิวล้มเหลว", err);
      }
    };

    loadData();
  }, [mangaId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment || rating === 0 || isSubmitting) return setError('กรุณาใส่ข้อความและให้คะแนน');

    try {
      setIsSubmitting(true);
      const newReview: ReviewInput = { comment, rating, mangaId };
      await createReview(newReview);
      setComment('');
      setRating(0);
      setError('');
      await loadReviews();
    } catch (err) {
      setError('กรุณาเข้าสู่ระบบก่อนแสดงความคิดเห็น');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('คุณแน่ใจหรือไม่ว่าต้องการลบรีวิวนี้?')) return;
    try {
      await deleteReview(id);
      setReviews(prev => prev.filter(r => r.id !== id));
    } catch (err) {
      alert('ลบรีวิวไม่สำเร็จ');
    }
  }

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;
    getCurrentUser().then((user) => {
      if (user) {
        setCurrentUserId(user._id);
        setRole(user.role);
      }
    });
  }, []);

  const handleLike = async (id: string) => {
    try {
      const res = await likeReview(id);
      setReviews(prev =>
        prev.map(r =>
          r.id === id ? { ...r, likes: res.likes, liked: res.liked } : r
        )
      );
    } catch (err: any) {
      alert(err.response?.data?.error || 'กรุณาเข้าสู่ระบบ');
    }
  };

  return (
    <section className="mt-12">
      <h2 className="text-2xl font-bold text-white mb-6 border-b border-slate-600 pb-2">รีวิวจากลูกค้า</h2>

      {/* ฟอร์มแสดงความคิดเห็น */}
      <form onSubmit={handleSubmit} className="mb-8 bg-slate-800 border border-slate-600 p-6 rounded-lg shadow-lg">
        <h3 className="text-lg text-white font-semibold mb-2">เขียนรีวิวของคุณ</h3>
        <div className="flex gap-2 mb-3">
          {[1, 2, 3, 4, 5].map(n => (
            <FaStar
              key={n}
              className={`cursor-pointer text-xl transition-colors ${n <= rating ? 'text-[#60bffb]' : 'text-slate-400'}`}
              onClick={() => setRating(n)}
            />
          ))}
        </div>
        <textarea
          className="w-full border border-slate-600 bg-slate-700 text-white placeholder-slate-400 rounded p-2 text-sm mb-2 focus:outline-none focus:ring-2 focus:ring-[#60bffb]"
          placeholder="เขียนความคิดเห็นของคุณ..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={3}
        />
        {error && <div className="text-red-400 text-sm mb-2">{error}</div>}
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm disabled:opacity-50"
          type="submit"
          disabled={isSubmitting}
        >
          ส่งความคิดเห็น
        </button>
      </form>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* คะแนนรวม */}
        <div className="bg-slate-800 border border-slate-600 p-6 rounded-lg shadow-lg w-full lg:max-w-sm">
          <div className="text-5xl font-bold text-[#60bffb]">{averageRating || '0.0'}</div>
          <div className="flex items-center gap-1 text-[#60bffb] my-2">
            {[...Array(5)].map((_, i) => (
              <FaStar key={i} className={i < Math.round(averageRating) ? 'text-[#60bffb]' : 'text-slate-400'} />
            ))}
            <span className="text-slate-300 ml-2 text-sm">{reviews.length} รีวิว</span>
          </div>
          <div className="space-y-2 mt-4">
            {[5, 4, 3, 2, 1].map((star) => {
              const count = reviews.filter(r => r.rating === star).length;
              const percent = reviews.length ? (count / reviews.length) * 100 : 0;
              return (
                <div key={star} className="flex items-center text-sm">
                  <span className="w-6 text-white">{star} <FaStar className="inline text-[#60bffb]" /></span>
                  <div className="flex-1 h-3 bg-slate-600 rounded mx-2">
                    <div className="h-3 bg-[#60bffb] rounded transition-all" style={{ width: `${percent}%` }} />
                  </div>
                  <span className="text-slate-300">{percent.toFixed(0)}%</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex-1 space-y-6">
          {reviews.slice(0, visibleCount).map((r) => (
            <div key={r.id} className="flex justify-between border-b border-slate-600 pb-4">
              <div className="flex gap-4">
                <img
                  src={r.user.avatar || '/avatars/default.png'}
                  alt={r.user.name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-slate-600"
                />
                <div>
                  <div className="flex items-center">
                    <Link to={`/profile/${r.user._id}`} className="no-underline text-white hover:text-[#60bffb] transition-colors">
                      <div className="font-semibold">
                        {r.user.name}
                        {r.user.role === 'admin' && <span className="text-[#60bffb]"> (admin)</span>}
                      </div>
                    </Link>
                    <div className="mx-2">
                      {r.user.tagPerson && <UserTagBadges tagPerson={r.user.tagPerson} />}
                    </div>
                  </div>
                  <div className="text-xs text-slate-400">{new Date(r.createdAt).toLocaleDateString()}</div>
                  <div className="flex text-[#60bffb] text-sm my-1">
                    {[...Array(r.rating)].map((_, i) => <FaStar key={i} />)}
                  </div>
                  <div className="text-sm text-white">
                    <div className="mb-2">
                      {r.comment}
                    </div>
                    <div className="">
                      {(currentUserId === r.user._id || role === 'admin') && (
                        <button
                          onClick={() => handleDelete(r.id)}
                          className="text-red-400 border border-red-400 rounded text-center hover:bg-red-900/20 transition-colors mt-2 px-1.5 py-0.5"
                        >
                          remove
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <button
                onClick={() => handleLike(r.id)}
                className={`flex items-center gap-1 mx-6 text-slate-400 hover:text-[#60bffb] transition-colors ${r.likes ? 'text-[#60bffb] font-bold' : ''}`}
              >
                <FaThumbsUp />
                <span>{r.likes || 0}</span>
              </button>
            </div>
          ))}
          {visibleCount < reviews.length ? (
            <div className="text-center mt-4">
              <button
                className="text-[#60bffb] hover:text-[#4da8e0] hover:underline text-sm transition-colors"
                onClick={() => setVisibleCount(reviews.length)}
              >
                ดูรีวิวเพิ่มเติม
              </button>
            </div>
          ) : reviews.length > 3 && (
            <div className="text-center mt-4">
              <button
                className="text-slate-400 hover:text-slate-300 hover:underline text-sm transition-colors"
                onClick={() => setVisibleCount(3)}
              >
                ย้อนกลับ
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
} 