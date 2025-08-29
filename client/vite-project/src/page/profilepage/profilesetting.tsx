import { useEffect, useState } from 'react';

import type { User } from '../../types/user.t';
import { useNavigate } from 'react-router-dom';
import Cropper from 'react-easy-crop';
import getCroppedImg from '../../utils/corpImage';
import { getCurrentUser, updateProfileImage, updateUser } from '../../features/user/userAPI';
import toast from 'react-hot-toast';

export default function EditProfilePage() {
  const [form, setForm] = useState<Partial<User> | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState('');
  const [showCropper, setShowCropper] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    getCurrentUser().then((data) => {
      setForm(data);
      setImagePreview(data.profileImage || '');
    }).catch(() => {
      setError('ไม่สามารถโหลดข้อมูลผู้ใช้ได้');
    });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => prev ? { ...prev, [name]: value } : prev);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageSrc(reader.result as string);
        setShowCropper(true);
      };
      reader.readAsDataURL(selected);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (form && form._id) {
        if (file) {
          const formData = new FormData();
          formData.append('image', file);
          const res = await updateProfileImage(formData);
          form.profileImage = res.profileImage;
        }
        await updateUser(form._id, form);
        toast.success('✅ บันทึกสำเร็จ');
        navigate('/profile');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'เกิดข้อผิดพลาด');
    }
  };

  const handleCropSave = async () => {
    if (!imageSrc || !croppedAreaPixels) return;
    const blob = await getCroppedImg(imageSrc, croppedAreaPixels);
    const croppedFile = new File([blob], 'cropped.jpg', { type: 'image/jpeg' });
    setImagePreview(URL.createObjectURL(blob));
    setFile(croppedFile);
    setShowCropper(false);
  };

  if (!form) return <p className="text-center mt-10">⏳ กำลังโหลดข้อมูล...</p>;

  return (
    <div className="mt-5 mx-10">
      <h2 className="text-2xl text-white font-bold mb-4">โปรไฟล์ของฉัน</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <img src={imagePreview || '/avatars/default.png'} className="w-24 h-24 rounded-full object-cover border" />
          <input type="file" accept="image/*" onChange={handleImageChange} className="mt-2"/>
          <p className="text-xs text-gray-500">รองรับ JPG/PNG ขนาดไม่เกิน 2MB</p>
        </div>

        <div>
          <label className="block font-medium text-sm text-gray-700">UID</label>
          <input value={form._id} disabled className="mt-1 px-3 py-2 border rounded  text-gray-500 w-[384px] h-[44px]" />
        </div>

        <div>
          <label className="block font-medium text-sm text-gray-700">ชื่อเล่น</label>
          <input name="username" value={form.username || ''} onChange={handleChange} className="mt-1 px-3 py-2 border border-gray-400 rounded text-white  w-[384px] h-[44px]" maxLength={20} />
        </div>

        <div>
          <label className="block font-medium text-sm text-gray-700">คำแนะนำตัวเอง</label>
          <textarea placeholder='กรุณากรอกคำแนะนำของคุณ' name="aboutMe" onChange={handleChange} className="mt-1 px-3 py-2 border border-gray-400 rounded text-white  w-[484px] h-[84px]" maxLength={200} />
        </div>

        <div className="flex items-center gap-3">
          <button type="submit" className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600">อัปเดต</button>
        </div>
      </form>

      {showCropper && imageSrc && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg w-full max-w-3xl shadow-xl">
            <h2 className="text-xl font-semibold mb-4">เปลี่ยนรูปโปรไฟล์</h2>
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-1 relative h-[300px]">
                <Cropper
                  image={imageSrc}
                  crop={crop}
                  zoom={zoom}
                  aspect={1}
                  cropShape="round"
                  onCropChange={setCrop}
                  onZoomChange={setZoom}
                  onCropComplete={(_, cropped) => setCroppedAreaPixels(cropped)}
                />
              </div>
              <div className="w-[200px] text-center">
                <div className="text-sm text-gray-600 mb-2">ตัวอย่าง</div>
                <div className="flex flex-col items-center gap-4">
                  <div className="w-[200px] h-[200px] rounded-full overflow-hidden border">
                    <img src={imagePreview} className="w-full h-full object-cover" />
                  </div>
                  <div className="w-[50px] h-[50px] rounded-full overflow-hidden border">
                    <img src={imagePreview} className="w-full h-full object-cover" />
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-between items-center mt-6">
              <label className="text-blue-600 text-sm cursor-pointer">
                <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                📥 อัปโหลดใหม่
              </label>
              <div className="flex gap-2">
                <button onClick={() => setShowCropper(false)} className="border px-6 py-2 rounded text-blue-600 hover:bg-blue-50">ยกเลิก</button>
                <button onClick={handleCropSave} className="bg-blue-600 px-6 py-2 rounded text-white hover:bg-blue-700">บันทึก</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}