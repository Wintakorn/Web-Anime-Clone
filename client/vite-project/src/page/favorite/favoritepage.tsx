import { useEffect, useState } from 'react';
import { Edit, Bookmark } from 'lucide-react';
import { fetchUserFavorites, favorite as toggleFavorite } from '../../features/user/userAPI';
import type { Manga } from '../../types/manga.t';

const Favoritespage = () => {
    const [favorites, setFavorites] = useState<Manga[]>([]);

    useEffect(() => {
        fetchUserFavorites()
            .then(setFavorites)
            .catch(console.error);
    }, []);

    const handleToggleFavorite = async (id: string) => {
        try {
            await toggleFavorite(id);
            setFavorites(prev => prev.filter((item) => item._id !== id));
        } catch (err) {
            console.error('ลบรายการโปรดล้มเหลว:', err);
        }
    };

    const getTotal = () => favorites.reduce((sum, item) => sum + item.price, 0);


    return (
        <div className="min-h-screen bg-gray-900 text-white">
            <div className="border-b border-gray-700 p-6">
                <div className="flex items-center justify-between max-w-6xl mx-auto">
                    <h1 className="text-xl font-bold">{favorites.length} รายการที่ชื่นชอบ</h1>
                </div>
            </div>

            <div className="max-w-6xl mx-auto p-6">
                {favorites.map((item) => (
                    <div key={item._id} className="flex gap-8 my-3 mb-5">
                        <div className="flex-shrink-0">
                            <div className="w-80 h-96 bg-gradient-to-br from-purple-600 via-pink-500 to-blue-500 rounded-lg overflow-hidden shadow-lg">
                                <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                            </div>
                        </div>

                        <div className="flex-1">
                            <h2 className="text-2xl font-bold mb-2">{item.title}</h2>

                            <div className="text-3xl font-bold text-blue-400 mb-6">
                                ฿{item.price.toFixed(2)}
                            </div>

                            <div className="flex gap-4 mb-8">
                                <button className="bg-green-600 hover:bg-green-700 px-8 py-3 rounded-lg font-semibold transition-colors">
                                    ซื้อเลย
                                </button>
                                <button className="bg-gray-700 hover:bg-gray-600 p-3 rounded-lg transition-colors">
                                    <Edit className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={() => handleToggleFavorite(item._id)}
                                    className="bg-red-600 hover:bg-red-700 p-3 rounded-lg transition-colors"
                                >
                                    <Bookmark className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}

                <div className="border-t border-gray-700 pt-6 mt-8">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold">ยอดรวมทั้งหมด</h3>
                        <div className="text-2xl font-bold text-green-400">฿{getTotal().toFixed(2)}</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Favoritespage;
