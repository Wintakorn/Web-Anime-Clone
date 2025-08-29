import { useEffect, useState } from "react";
import { fetchReviews } from "../../features/manga/reviewsAPI";
import type { ReviewItem } from "../../types/review.t";
import type { User } from "../../types/user.t";
import type { Props } from "../../components/review";
import { FaStar } from "react-icons/fa";
import { Link, useParams } from "react-router-dom";
import UserTagBadges from "../../components/profile-component/UserTagBadges";
import { fetchUserById, getCurrentUser } from "../../features/user/userAPI";

const Profile = ({ mangaId }: Props) => {
    const { userId } = useParams();
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [userData, setUserData] = useState<User | null>(null);
    const [reviews, setReviews] = useState<ReviewItem[]>([]);
    const isCurrentUser = userData && currentUser && userData._id === currentUser._id;
    useEffect(() => {
        const fetchUser = async () => {
            try {
                if (!userId) {
                    const me = await getCurrentUser();
                    setCurrentUser(me);
                    setUserData(me);
                } else {
                    const target = await fetchUserById(userId);
                    setUserData(target);
                    try {
                        const me = await getCurrentUser();
                        setCurrentUser(me);
                    } catch (err) {
                        setCurrentUser(null); 
                    }
                }
            } catch (err) {
                console.error("โหลด user ล้มเหลว:", err);
            }
        };
        fetchUser();
    }, [userId]);
    // console.log(userData?.username)

    useEffect(() => {
        const fetchUserReviews = async () => {
            try {
                const allReviews = await fetchReviews();
                const filtered = allReviews.filter(
                    (review: ReviewItem) =>
                        review.user._id === userData?._id &&
                        (!mangaId || review.mangaId === mangaId)
                );
                setReviews(filtered);
                // console.log("User reviews loaded:", filtered);
            } catch (error) {
                console.error("เกิดข้อผิดพลาดในการโหลดรีวิว:", error);
            }
        };

        if (userData) {
            fetchUserReviews();
        }
    }, [userData, mangaId]);


    if (!userData) {
        return <div className="text-center my-20 text-gray-500">กำลังโหลดข้อมูล...</div>;
    }

    return (
        <main className="mx-10 my-10">
            <div className="flex items-center gap-5">
                <div className="flex items-center">
                    <img
                        className="rounded-full w-28 h-28 border-4 object-cover border-slate-300 shadow-lg hover:scale-105 transition-transform duration-300"
                        src={userData.profileImage || "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
                        alt="avatar"
                    />
                </div>
                <div className="">
                    <div className="flex items-center gap-5">
                        <div className="">
                            <h1 className="text-2xl font-bold text-white">{userData.username}</h1>
                        </div>
                        {reviews.length > 0 && (
                            <UserTagBadges tagPerson={reviews[0].user.tagPerson} />
                        )}
                    </div>
                    <div className="mt-1 flex space-x-10 items-center">
                        <div className="flex items-center gap-2">
                            <div className="text-slate-400 hover:text-white transition-colors">ติดตามแล้ว</div>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="text-slate-400 hover:text-white transition-colors">แฟนคลับ</div>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="font-bold text-[#60bffb]">{userData.likes ?? 0}</div>
                            <span className="text-white">Like</span>
                        </div>
                        {isCurrentUser && (
                            <Link to="/profile/ProfileSetting" className="no-underline">
                                <button className="border border-[#60bffb] text-[#60bffb] px-4 py-1 rounded-md hover:bg-[#60bffb]/10 transition-all duration-300 hover:scale-105">
                                    แก้ไขโปรไฟล์
                                </button>
                            </Link>
                        )}
                    </div>
                </div>
            </div>
            <div className="border-t border-slate-600 mt-3">
                <div className="mt-3">
                    <h1 className="font-bold text-white">AboutMe ?</h1>
                    {userData.aboutMe ? (
                        <p className="text-slate-300 leading-relaxed">{userData.aboutMe}</p>
                    ) : (
                        <p className="text-slate-400 italic">-</p>
                    )}
                </div>
            </div>
            <div className="mt-5">
                <p className="font-bold text-2xl text-white">Comment History: </p>
            </div>
            {reviews.length > 0 ? (
                <div className="mt-2 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full">
                    {reviews.map((review, index) => (
                        <Link to={`/manga/${review.book_manga._id}`} className="no-underline" key={index}>
                            <div key={index} className="bg-slate-800 border border-slate-600 p-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 hover:border-[#60bffb]/50">
                                <img
                                    src={
                                        (review.book_manga.image) ||
                                        "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                                    }
                                    alt="manga cover"
                                    className="w-full h-36 object-cover rounded border-2 border-slate-600"
                                />
                                <h2 className="mt-2 font-semibold text-sm truncate text-white">
                                    {review.comment || "ไม่ทราบชื่อเรื่อง"}
                                </h2>
                                <div className="flex items-center gap-1 text-[#60bffb] text-xs mt-1">
                                    {[...Array(review.rating ?? 0)].map((_, i) => (
                                        <FaStar key={i} />
                                    ))}
                                </div>
                                <p className="mt-1 text-sm text-slate-300 line-clamp-2">{userData.comment}</p>
                            </div>
                        </Link>
                    ))}
                </div>
            ) : (
                <div className="mt-20 text-slate-400 text-center">
                    <img
                        className="mx-auto w-32 h-32 opacity-70 hover:opacity-100 transition-opacity duration-300"
                        src={"https://cdn-icons-png.flaticon.com/512/10437/10437207.png"}
                        alt="no content"
                    />
                    <p className="mt-2">ขออภัย, ไม่พบรายการรีวิว</p>
                </div>
            )}
        </main>
    );
};

export default Profile;
