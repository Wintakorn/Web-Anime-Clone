import { useState } from 'react';
import type { LoginInput, UserInput } from '../types/user.t';
import { useNavigate } from 'react-router-dom';
import { loginUser, registerUser } from '../features/user/userAPI';

interface AuthPageProps {
  onClose?: () => void;
}

export default function AuthPage({ onClose }: AuthPageProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [image, setImage] = useState<File | null>(null);

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      if (isLogin) {
        const loginData: LoginInput = { username, password };
        const res = await loginUser(loginData);

        localStorage.setItem('token', res.token);
        localStorage.setItem('role', res.role);
        localStorage.setItem('username', res.username);
        localStorage.setItem('profileImage', res.profileImage || '');

        onClose?.();
        navigate('/');
      } else {
        const registerData: UserInput = { username, email, password };
        await registerUser(registerData);

        if (image) {
          // login เพื่อได้ token ก่อน upload รูป
          const loginRes = await loginUser({ username, password });
          localStorage.setItem('token', loginRes.token);
          localStorage.setItem('role', loginRes.role);
          localStorage.setItem('username', loginRes.username);

          const formData = new FormData();
          formData.append('image', image);
          // const imageUrl = await updateProfileImage(formData);
          // localStorage.setItem('profileImage', imageUrl);
        }

        alert('สมัครสมาชิกสำเร็จ');
        onClose?.(); // ✅ ให้ modal ปิด
        navigate('/'); // ✅ เพื่อ reload หน้า/แสดง avatar ทันที
      }

    } catch (err: any) {
      setError(err.response?.data?.message || 'เกิดข้อผิดพลาด');
    }
  };

  return (
    <div className="bg-white shadow-xl rounded-xl w-full max-w-sm px-8 py-6 relative">
      {onClose && (
        <button onClick={onClose} className="absolute top-3 right-4 text-gray-400 hover:text-black text-2xl">
          &times;
        </button>
      )}

      <div className="text-center mb-6">
        <h2 className="text-xl font-bold">{isLogin ? 'ล็อกอินบัญชี' : 'สมัครสมาชิก'}</h2>
      </div>

      {error && <div className="text-red-500 text-sm text-center mb-2">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        {!isLogin && (
          <>
            <input
              type="text"
              placeholder="ชื่อผู้ใช้"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full border rounded-full px-4 py-2 text-sm focus:outline-none focus:ring"
              required
            />
            <input
              type="email"
              placeholder="อีเมล"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border rounded-full px-4 py-2 text-sm focus:outline-none focus:ring"
              required
            />
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImage(e.target.files?.[0] || null)}
              className="w-full text-sm"
            />
          </>
        )}

        {isLogin && (
          <input
            type="text"
            placeholder="ชื่อผู้ใช้/อีเมล"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full border rounded-full px-4 py-2 text-sm focus:outline-none focus:ring"
            required
          />
        )}

        <input
          type="password"
          placeholder="รหัสผ่าน"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border rounded-full px-4 py-2 text-sm focus:outline-none focus:ring"
          required
        />

        <button
          type="submit"
          className="w-full py-2 rounded-full text-white bg-[#ee4d2d] hover:bg-[#d8431f] transition"
        >
          {isLogin ? 'เข้าสู่ระบบ' : 'สมัครสมาชิก'}
        </button>
      </form>

      <div className="flex justify-between text-xs text-gray-400 mt-4 px-1">
        <button className="hover:underline">พบปัญหา?</button>
        <button
          onClick={() => setIsLogin(!isLogin)}
          className="text-orange-500 hover:underline"
        >
          {isLogin ? 'ลงทะเบียน' : 'เข้าสู่ระบบ'}
        </button>
      </div>
    </div>
  );
}
