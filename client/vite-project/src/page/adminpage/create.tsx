import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Manga } from '../../types/manga.t';
import { createManga } from '../../features/manga/mangaAPI';
import toast from 'react-hot-toast';

export default function CreateMangaPage() {
    const navigate = useNavigate();

    const [form, setForm] = useState<Partial<Manga>>({
        title: '',
        synopsis: '',
        genre: [],
        image: '',
        score: 0,
        releaseDate: '',
        status: '',
        discountPercent: 0,
        price: 0,
        episodes: 0,
        premiered: '',
        aired: '',
        broadcast: '',
        producers: [],
        licensors: [],
        studios: [],
        source: '',
        demographic: '',
        rating: '',
        ranked: 0,
        popularity: 0,
        favorites: 0,
        animeSimpleUrl: '',
    });

    const [error, setError] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleArrayChange = (e: React.ChangeEvent<HTMLInputElement>, key: keyof Manga) => {
        const values = e.target.value.split(',').map(v => v.trim());
        setForm(prev => ({ ...prev, [key]: values }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await createManga(form);
            toast.success('✅ สร้างมังงะสำเร็จ');
            navigate('/');
        } catch (err: any) {
            setError(err.response?.data?.message || 'เกิดข้อผิดพลาด');
        }
    };

    return (
        <div className="max-w-4xl mx-auto mt-10 p-8 text-white shadow-xl rounded-xl border border-gray-200">
            <h2 className="text-3xl font-semibold text-white mb-6 text-center">📚 เพิ่มมังงะใหม่</h2>

            {error && <p className="text-red-600 mb-4 text-center font-medium">{error}</p>}

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* ซ้าย */}
                <div className="space-y-4">
                    <Input name="title" label="ชื่อเรื่อง" value={form.title} onChange={handleChange} required />
                    <Textarea name="synopsis" label="เรื่องย่อ" value={form.synopsis} onChange={handleChange} />
                    <Input name="genre" label="หมวดหมู่ (คั่นด้วย comma)" onChange={(e) => handleArrayChange(e, 'genre')} />
                    <Input name="image" label="URL รูปภาพ" value={form.image} onChange={handleChange} />
                    <Input type="number" name="score" label="คะแนน (0-10)" value={form.score} onChange={handleChange} />
                    <Input type="date" name="releaseDate" label="วันที่เผยแพร่" value={form.releaseDate} onChange={handleChange} />

                    <Input name="status" label="สถานะ (เช่น กำลังฉาย)" value={form.status} onChange={handleChange} />
                    <Input type="number" name="price" label="ราคา" value={form.price} onChange={handleChange} />
                    <Input type="number" name="discountPercent" label="ส่วนลด (%)" value={form.discountPercent} onChange={handleChange} />
                </div>

                {/* ขวา */}
                <div className="space-y-4">
                    <Input type="number" name="episodes" label="จำนวนตอน" value={form.episodes} onChange={handleChange} />
                    <Input name="premiered" label="ฤดูกาล" value={form.premiered} onChange={handleChange} />
                    <Input name="aired" label="ช่วงเวลาออกอากาศ" value={form.aired} onChange={handleChange} />
                    <Input name="broadcast" label="วันเวลาออกอากาศ" value={form.broadcast} onChange={handleChange} />
                    <Input name="producers" label="Producers (คั่นด้วย comma)" onChange={(e) => handleArrayChange(e, 'producers')} />
                    <Input name="licensors" label="Licensors (คั่นด้วย comma)" onChange={(e) => handleArrayChange(e, 'licensors')} />
                    <Input name="studios" label="Studios (คั่นด้วย comma)" onChange={(e) => handleArrayChange(e, 'studios')} />
                </div>

                {/* ด้านล่าง */}
                <div className="col-span-1 md:col-span-2 space-y-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <Input name="source" label="ต้นฉบับ" value={form.source} onChange={handleChange} />
                        <Input name="demographic" label="กลุ่มเป้าหมาย" value={form.demographic} onChange={handleChange} />
                        <Input name="rating" label="เรท" value={form.rating} onChange={handleChange} />
                        <Input type="number" name="ranked" label="อันดับ" value={form.ranked} onChange={handleChange} />
                        <Input type="number" name="popularity" label="ความนิยม" value={form.popularity} onChange={handleChange} />
                        <Input type="number" name="favorites" label="จำนวนผู้ติดตาม" value={form.favorites} onChange={handleChange} />
                        <Input name="mangaSimpleUrl" label="ลิงก์รายละเอียด" value={form.animeSimpleUrl} onChange={handleChange} />
                    </div>

                    <button
                        type="submit"
                        className="w-full py-3 bg-blue-500 hover:bg-orange-600 text-white text-lg font-semibold rounded-lg transition"
                    >
                        ➕ เพิ่มมังงะ
                    </button>
                </div>
            </form>
        </div>
    );
}

// ✅ Reusable Input component
function Input({
    label,
    ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) {
    return (
        <div className="flex flex-col">
            <label className="mb-1 font-medium text-white">{label}</label>
            <input
                {...props}
                className="border border-gray-300 px-4 py-2 rounded-md focus:outline-none"
            />
        </div>
    );
}

// ✅ Reusable Textarea
function Textarea({
    label,
    ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string }) {
    return (
        <div className="flex flex-col">
            <label className="mb-1 font-medium text-white">{label}</label>
            <textarea
                {...props}
                className="border border-gray-300 px-4 py-2 rounded-md resize-y min-h-[80px] focus:outline-none "
            />
        </div>
    );
}
