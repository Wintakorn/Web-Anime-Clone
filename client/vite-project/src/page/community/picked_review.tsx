import { useEffect, useState } from 'react';
import { fetchReviews } from '../../features/manga/reviewsAPI';
import type { ReviewItem } from '../../types/review.t';
import UserTagBadges from '../../components/profile-component/UserTagBadges';


export default function ReviewGridPage() {
    const [reviews, setReviews] = useState<ReviewItem[]>([]);
    const [page, setPage] = useState(1);

    useEffect(() => {
        fetchReviews().then((res) => setReviews(res))
    }, [page]);

    return (
        <div className="max-w-5xl mx-auto px-4 my-10">
            <h2 className="text-2xl font-bold text-white mb-4">Review all</h2>

            <div className="grid gap-6">
                {reviews.filter((r) => r.rating === 5 && r.comment.length >= 100).map((r) => (
                    <div key={r.id} className="flex flex-col md:flex-row border border-gray-400 rounded-lg shadow">
                        <div className="flex-1 p-6 px-10 pt-10">
                            <p className="text-slate-300 text-sm whitespace-pre-wrap mb-10">{r.comment}</p>
                            <h1 className='text-[#60bffb]'>รีวิวจาก</h1>
                            <div className="flex justify-between items-center mt-1">

                                <div className="flex items-center gap-2 text-sm text-gray-500 ">
                                    <img src={r.user.avatar} alt="avatar" className="w-8 h-8 rounded-full object-cover" />
                                    <span className="font-semibold text-white">{r.user.name}</span>
                                    {reviews.length > 0 && (
                                        <UserTagBadges tagPerson={reviews[0].user.tagPerson} />
                                    )}
                                </div>
                                <div className="mt-2 text-pink-500">{'❤️'.repeat(r.rating)}</div>
                            </div>
                        </div>
                        <div className="w-full md:w-56 mt-4 md:mt-0 md:ml-6 text-center p-5">
                            <img src={r.book_manga.image} alt={r.book_manga.title} className="w-full rounded shadow mb-2 shadow-lg" />
                            <div className="font-semibold text-sm text-white">{r.book_manga.title}</div>
                            <div className="text-sm text-slate-400">{r.book_manga.genre.join(" /")}</div>
                            <div className="text-xs text-gray-500">
                                {r.rating.toFixed(1)} คะแนน จาก {r.rating} เรตติ้ง
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="flex justify-center items-center gap-3 mt-8">
                <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    className="px-3 text-white py-1 border rounded hover:bg-gray-100"
                >
                    ◀ หน้าเดิม
                </button>
                <span className="text-sm">หน้าที่ {page}</span>
                <button
                    onClick={() => setPage((p) => p + 1)}
                    className="px-3 py-1 text-white border rounded hover:bg-gray-100"
                >
                    หน้าถัดไป ▶
                </button>
            </div>
        </div>
    );
}
