import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import type { Manga } from '../../types/manga.t';
import { fetchMangaById, updateManga } from '../../features/manga/mangaAPI';

export default function EditMangaPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [form, setForm] = useState<Partial<Manga> | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetchMangaById(id)
      .then((data) => {
        setForm(data);
        setLoading(false);
      })
      .catch(() => {
        setError('ไม่พบข้อมูลมังงะ');
        setLoading(false);
      });
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => prev ? { ...prev, [name]: value } : prev);
    setError(''); // Clear error when user starts typing
  };

  const handleArrayChange = (e: React.ChangeEvent<HTMLInputElement>, key: keyof Manga) => {
    const values = e.target.value.split(',').map(v => v.trim());
    setForm((prev) => prev ? { ...prev, [key]: values } : prev);
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form || !id) return;

    setLoading(true);
    setError('');

    try {
      await updateManga(id, form);
      setSuccess(true);
      setTimeout(() => {
        navigate('/');
      }, 1500);
    } catch (err: any) {
      setError(err.response?.data?.message || 'เกิดข้อผิดพลาด');
      setLoading(false);
    }
  };

  if (loading && !form) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mb-4"></div>
          <p className="text-xl text-gray-600 font-medium">กำลังโหลดข้อมูล...</p>
        </div>
      </div>
    );
  }

  if (!form) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in-down">
          <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-2">
            ✏️ แก้ไขมังงะ
          </h1>
          <p className="text-gray-600 text-lg">ปรับปรุงข้อมูลมังงะของคุณ</p>
        </div>

        {/* Success Message */}
        {success && (
          <div className="mb-6 animate-slide-down">
            <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded-r-lg shadow-md">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="font-medium">✅ บันทึกสำเร็จ! กำลังกลับหน้าหลัก...</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 animate-slide-down">
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-r-lg shadow-md">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="font-medium">{error}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="animate-fade-in-up">
          <div className="bg-white/80 backdrop-blur-sm shadow-2xl rounded-2xl border border-white/20 overflow-hidden">
            <div className="p-8">
              {/* Basic Information Section */}
              <div className="mb-8">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                  ข้อมูลพื้นฐาน
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    name="title"
                    label="ชื่อเรื่อง"
                    value={form.title || ''}
                    onChange={handleChange}
                    icon="📚"
                    required
                  />
                  <Input
                    name="image"
                    label="URL รูปภาพ"
                    value={form.image || ''}
                    onChange={handleChange}
                    icon="🖼️"
                  />
                </div>
                <div className="mt-6">
                  <Textarea
                    name="synopsis"
                    label="เรื่องย่อ"
                    value={form.synopsis || ''}
                    onChange={handleChange}
                    icon="📝"
                    rows={4}
                  />
                </div>
              </div>

              {/* Rating & Score Section */}
              <div className="mb-8">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                  <span className="w-2 h-2 bg-yellow-500 rounded-full mr-3"></span>
                  คะแนนและการจัดอันดับ
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Input
                    type="number"
                    name="score"
                    label="คะแนน"
                    value={form.score || ''}
                    onChange={handleChange}
                    icon="⭐"
                    step="0.1"
                    min="0"
                    max="10"
                  />
                  <Input
                    type="number"
                    name="ranked"
                    label="อันดับ"
                    value={form.ranked || ''}
                    onChange={handleChange}
                    icon="🏆"
                    min="1"
                  />
                  <Input
                    type="number"
                    name="popularity"
                    label="ความนิยม"
                    value={form.popularity || ''}
                    onChange={handleChange}
                    icon="📈"
                    min="1"
                  />
                </div>
              </div>

              {/* Categories & Details Section */}
              <div className="mb-8">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                  หมวดหมู่และรายละเอียด
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    name="genre"
                    label="หมวดหมู่ (คั่นด้วยจุลภาค)"
                    value={form.genre?.join(', ') || ''}
                    onChange={(e) => handleArrayChange(e, 'genre')}
                    icon="🎭"
                    placeholder="Action, Adventure, Drama"
                  />
                  <Input
                    name="demographic"
                    label="กลุ่มเป้าหมาย"
                    value={form.demographic || ''}
                    onChange={handleChange}
                    icon="👥"
                  />
                  <Input
                    name="status"
                    label="สถานะ"
                    value={form.status || ''}
                    onChange={handleChange}
                    icon="📊"
                  />
                  <Input
                    name="source"
                    label="ต้นฉบับ"
                    value={form.source || ''}
                    onChange={handleChange}
                    icon="📖"
                  />
                  <Input
                    name="rating"
                    label="เรท"
                    value={form.rating || ''}
                    onChange={handleChange}
                    icon="🔞"
                  />
                  <Input
                    type="number"
                    name="favorites"
                    label="ผู้ติดตาม"
                    value={form.favorites || ''}
                    onChange={handleChange}
                    icon="❤️"
                    min="0"
                  />
                </div>
              </div>

              {/* Episode & Broadcasting Section */}
              <div className="mb-8">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                  <span className="w-2 h-2 bg-purple-500 rounded-full mr-3"></span>
                  ตอนและการออกอากาศ
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    type="number"
                    name="episodes"
                    label="จำนวนตอน"
                    value={form.episodes || ''}
                    onChange={handleChange}
                    icon="📺"
                    min="1"
                  />
                  <Input
                    type="date"
                    name="releaseDate"
                    label="วันที่เผยแพร่"
                    value={form.releaseDate?.slice(0, 10) || ''}
                    onChange={handleChange}
                    icon="📅"
                  />
                  <Input
                    name="premiered"
                    label="ฤดูกาล"
                    value={form.premiered || ''}
                    onChange={handleChange}
                    icon="🌸"
                    placeholder="Spring 2024"
                  />
                  <Input
                    name="aired"
                    label="ช่วงเวลาออกอากาศ"
                    value={form.aired || ''}
                    onChange={handleChange}
                    icon="🗓️"
                    placeholder="Apr 2024 - Jun 2024"
                  />
                  <Input
                    name="broadcast"
                    label="วันเวลาออกอากาศ"
                    value={form.broadcast || ''}
                    onChange={handleChange}
                    icon="⏰"
                    placeholder="Sundays at 24:00"
                  />
                </div>
              </div>

              {/* Production Section */}
              <div className="mb-8">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                  <span className="w-2 h-2 bg-red-500 rounded-full mr-3"></span>
                  การผลิต
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    name="producers"
                    label="ผู้ผลิต (คั่นด้วยจุลภาค)"
                    value={form.producers?.join(', ') || ''}
                    onChange={(e) => handleArrayChange(e, 'producers')}
                    icon="🎬"
                  />
                  <Input
                    name="studios"
                    label="สตูดิโอ (คั่นด้วยจุลภาค)"
                    value={form.studios?.join(', ') || ''}
                    onChange={(e) => handleArrayChange(e, 'studios')}
                    icon="🏢"
                  />
                  <Input
                    name="licensors"
                    label="ผู้ได้รับลิขสิทธิ์ (คั่นด้วยจุลภาค)"
                    value={form.licensors?.join(', ') || ''}
                    onChange={(e) => handleArrayChange(e, 'licensors')}
                    icon="📜"
                  />
                </div>
              </div>

              {/* Pricing Section */}
              <div className="mb-8">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full mr-3"></span>
                  ราคาและส่วนลด
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    type="number"
                    name="price"
                    label="ราคา (บาท)"
                    value={form.price || ''}
                    onChange={handleChange}
                    icon="💰"
                    min="0"
                    step="0.01"
                  />
                  <Input
                    type="number"
                    name="discountPercent"
                    label="ส่วนลด (%)"
                    value={form.discountPercent || ''}
                    onChange={handleChange}
                    icon="🏷️"
                    min="0"
                    max="100"
                  />
                </div>
              </div>

              {/* Additional Info Section */}
              <div className="mb-8">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                  <span className="w-2 h-2 bg-indigo-500 rounded-full mr-3"></span>
                  ข้อมูลเพิ่มเติม
                </h3>
                <Input
                  name="animeSimpleUrl"
                  label="ลิงก์รายละเอียด"
                  value={form.animeSimpleUrl || ''}
                  onChange={handleChange}
                  icon="🔗"
                  type="url"
                />
              </div>

              {/* Submit Button */}
              <div className="flex justify-center pt-6">
                <button
                  type="submit"
                  disabled={loading}
                  className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-lg font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none min-w-[200px]"
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                      กำลังบันทึก...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center">
                      <span className="mr-2">💾</span>
                      บันทึกการแก้ไข
                    </div>
                  )}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

function Input({
  label,
  icon,
  className = "",
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  icon?: string;
}) {
  return (
    <div className="group">
      <label className="block mb-2 font-semibold text-gray-700 flex items-center">
        {icon && <span className="mr-2">{icon}</span>}
        {label}
        {props.required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <input
        {...props}
        className={`w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 bg-white/50 backdrop-blur-sm hover:border-gray-300 group-focus-within:shadow-md ${className}`}
      />
    </div>
  );
}

function Textarea({
  label,
  icon,
  className = "",
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label: string;
  icon?: string;
}) {
  return (
    <div className="group">
      <label className="block mb-2 font-semibold text-gray-700 flex items-center">
        {icon && <span className="mr-2">{icon}</span>}
        {label}
        {props.required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <textarea
        {...props}
        className={`w-full px-4 py-3 border-2 border-gray-200 rounded-xl resize-y min-h-[80px] focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 bg-white/50 backdrop-blur-sm hover:border-gray-300 group-focus-within:shadow-md ${className}`}
      />
    </div>
  );
}

// CSS Animations (add to your global CSS file)
// const styles = `
// @keyframes fade-in-down {
//   0% {
//     opacity: 0;
//     transform: translateY(-20px);
//   }
//   100% {
//     opacity: 1;
//     transform: translateY(0);
//   }
// }

// @keyframes fade-in-up {
//   0% {
//     opacity: 0;
//     transform: translateY(20px);
//   }
//   100% {
//     opacity: 1;
//     transform: translateY(0);
//   }
// }

// @keyframes slide-down {
//   0% {
//     opacity: 0;
//     transform: translateY(-10px);
//   }
//   100% {
//     opacity: 1;
//     transform: translateY(0);
//   }
// }

// .animate-fade-in-down {
//   animation: fade-in-down 0.5s ease-out;
// }

// .animate-fade-in-up {
//   animation: fade-in-up 0.6s ease-out;
// }

// .animate-slide-down {
//   animation: slide-down 0.3s ease-out;
// }
// `;