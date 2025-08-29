import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { fetchMangaById, fetchMangas } from '../../../features/manga/mangaAPI';
import type { Manga } from '../../../types/manga.t';
import { addToCart } from '../../../features/cartAPI';
import ReviewSection from '../../../components/review';
import { extractYouTubeId } from '../../../service/extractYotube';
import { favorite, getCurrentUser } from '../../../features/user/userAPI';
import { Heart } from 'lucide-react';
import toast from 'react-hot-toast';

const MangaDetailPage = () => {
  const { id } = useParams();
  const [manga, setManga] = useState<Manga | null>(null);
  const [mangas, setMangas] = useState<Manga[]>([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [role, setRole] = useState<'admin' | 'user' | null>(null)
  const [favorites, setFavorites] = useState<string[]>([]);

  const token = localStorage.getItem('token');
  const handleAddToCart = async (item: Manga, qty: number) => {
    if (!token) {
      toast.error('กรุณาเข้าสู่ระบบก่อนเพิ่มสินค้า');
      return;
    }
    try {
      await addToCart({
        mangaId: item._id,
        title: item.title,
        price: item.price,
        coverImage: item.image,
        quantity: qty,
      });

      toast.success('✅ เพิ่มลงตะกร้าเรียบร้อย');
    } catch (error) {
      console.error(error);
      toast.error('❌ ไม่สามารถเพิ่มลงตะกร้าได้');
    }
  };

  useEffect(() => {
    getCurrentUser().then(user => {
      setRole(user.role || null);
      setFavorites(user.favorites || []);
    })
  }, [])

  useEffect(() => {
    if (!id) return;
    fetchMangaById(id)
      .then(setManga)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);


  useEffect(() => {
    if (!id) return;
    fetchMangaById(id)
      .then((data) => {
        setManga(data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    fetchMangas().then(setMangas).catch(console.error);
  }, []);

  if (loading) return <div className="text-center py-10">กำลังโหลด...</div>;
  if (!manga) return <div className="text-center py-10 text-red-500">ไม่พบมังงะ</div>;
  const discountPrice = manga.price - (manga.price * (manga.discountPercent || 0)) / 100;
  const saved = manga.price - discountPrice;

  const relatedMangas = mangas
    .filter((m) => m._id !== manga._id && m.genre.some((g) => manga.genre.includes(g)))
    .slice(0, 4);

  const handleToggleFavorite = async () => {
    if (!token) {
      toast.error('กรุณาเข้าสู่ระบบก่อน');
      return;
    }

    try {
      await favorite(manga._id);
      const updated = favorites.includes(manga._id)
        ? favorites.filter(id => id !== manga._id)
        : [...favorites, manga._id];
      setFavorites(updated);
      toast(favorites.includes(manga._id) ? '❌ ลบออกจากรายการโปรดแล้ว' : '❤️ เพิ่มในรายการโปรดแล้ว');
    } catch (err) {
      console.error(err);
      toast.error('เกิดข้อผิดพลาดในการเพิ่มรายการโปรด');
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 my-8 ">
      <div className="flex flex-col md:flex-row gap-10">
        <div className="w-full h-full md:w-1/4">
          <img src={manga.image} alt={manga.title} className="rounded shadow-md min-h-full" />
          <button
            onClick={handleToggleFavorite}
            className="border rounded p-2 my-3 text-center w-full text-white bg-blue-500 hover:bg-blue-600 transition flex justify-center items-center gap-2"
          >
            <Heart
              className={`w-4 h-4 ${favorites.includes(manga._id) ? 'fill-red-500 text-red-500' : 'text-white'}`}
            />
            {favorites.includes(manga._id) ? 'ในรายการโปรดแล้ว' : 'เพิ่มในรายการโปรด'}
          </button>
        </div>
        <div className="flex-1">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-1 space-y-4">
              <h1 className="text-2xl text-white font-bold">{manga.title}</h1>
              <p className="text-sm text-slate-300">ประเภท: {manga.genre.join(', ')}</p>
              <p className="text-sm text-slate-300">จำนวนตอน: {manga.episodes}</p>
              <p className="text-sm text-slate-300">
                วันที่ออก: {new Date(manga.releaseDate).toLocaleDateString()}
              </p>
              <p className="text-sm text-slate-300">ความนิยม: {manga.popularity}</p>
              <p className="text-sm text-slate-300">จำนวนคนติดตาม: {manga.favorites}</p>
              <p className="text-sm text-slate-300">คะแนนรีวิว: {manga.score} ⭐</p>
              <p className="text-sm text-slate-300">{manga.status}</p>
            </div>

            <div className="border border-gray-400 p-4 rounded-md shadow-sm">
              <p className="text-xl font-bold text-white">
                ราคา: ฿{discountPrice.toFixed(2)}{' '}
                <span className="line-through text-sm text-gray-400">฿{manga.price.toFixed(2)}</span>
              </p>
              <p className="text-gray-400 font-semibold">
                ประหยัด {saved.toFixed(2)} บาท ({manga.discountPercent}%)
              </p>
              <p className="text-sm text-[#60bffb] mt-2">
                ได้รับ {Math.floor(discountPrice / 20)} คะแนนสะสม
              </p>
              <div className="mt-4 flex gap-3 items-center">
                <label htmlFor="quantity" className="text-sm text-white">
                  จำนวน:
                </label>
                <select
                  id="quantity"
                  className="border text-white rounded px-2 py-1"
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                >
                  {[1, 2, 3, 4, 5].map((n) => (
                    <option className='bg-gray-500' key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
              </div>
              <button
                onClick={() => handleAddToCart(manga, quantity)}
                className="mt-4 bg-slate-600 text-white px-5 py-2 rounded hover:bg-slate-700 border border-gray-400 transition"
              >
                🛒 Add to cart
              </button>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="mt-6 border-t pt-4">
              <h2 className="font-semibold text-blue-500 text-lg">โปรโมชั่นพิเศษ</h2>
              <p className="text-sm text-slate-300">
                Summer Readcation หนังสือ ลด 10% ทุกรายการ และสะสมคะแนนได้
              </p>
            </div>
            {role === 'admin' ? (
              <div className="flex items-center justify-center">
                <Link to={`/admin/edit/${manga._id}`} className="text-red-500">
                  Edit
                </Link>
              </div>
            ) : (
              <p></p>
            )}
          </div>
        </div>
      </div>

      <div className="my-10">
        <h1 className='text-blue-500 font-bold'>รายละเอียด: {manga.title}</h1>
        <p className="text-slate-300">{manga.synopsis}</p>
      </div>
      <div className="">
        <h1 className="text-xl text-white font-bold mb-4">ข้อมูลเพิ่มเติม</h1>
        <ul className="list-disc pl-5 text-slate-300 space-y-2">
          <li>สำนักพิมพ์: {manga.studios}</li>
          <li>จำนวนหน้า: 99999999</li>
          <li>วันที่วางจำหน่าย: {new Date(manga.releaseDate).toLocaleDateString()}</li>
        </ul>
      </div>
      {
        manga.animeSimpleUrl ? (
          <div className="rounded overflow-hidden my-8 flex justify-center">
            <iframe
              width="800"
              height="400"
              src={`https://www.youtube.com/embed/${extractYouTubeId(manga.animeSimpleUrl || '')}`}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="rounded"
            ></iframe>
          </div>
        ) : (
          <p className="mt-4 text-white">-ไม่มีวิดีโอแนะนำสำหรับมังงะนี้</p>
        )
      }
      <div className="mt-10">
        <h1 className="text-xl text-blue-500 font-bold mb-4">สินค้าที่เกี่ยวข้อง</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {relatedMangas.length > 0 ? (
            relatedMangas.map((m) => (
              <div
                key={m._id}
                className="flex flex-col h-full  rounded-lg border shadow-sm hover:shadow-md transition"
              >
                <Link to={`/manga/${m._id}`} className="flex-1 flex flex-col">
                  <img
                    src={m.image}
                    alt={m.title}
                    className="w-full h-64 object-cover rounded-t-md"
                  />
                  <div className="p-2 flex-1">
                    <h2 className="text-md text-white font-semibold line-clamp-2">{m.title}</h2>
                    <p className="text-sm text-slate-300 mt-1">คะแนน: {m.score}</p>
                  </div>
                </Link>
                <div className="">
                  <button
                    onClick={() => handleAddToCart(m, 1)}
                    className="w-full bg-slate-800 text-white py-2 rounded-b-md hover:bg-slate-600 transition"
                  >
                    🛒 Add to cart
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-red-500">ไม่มีรายการที่เกี่ยวข้อง</p>
          )}
        </div>
        <div className="mt-10">
          <ReviewSection mangaId={manga._id} />
        </div>
      </div>
    </div >
  );
};

export default MangaDetailPage;
