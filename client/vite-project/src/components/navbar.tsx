import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthPage from './loginpopup';
import { getCurrentUser } from '../features/user/userAPI';


function Navbar() {
  const [showLogin, setShowLogin] = useState(false);
  const [username, setUsername] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    getCurrentUser().then(user => {
      if (user) {
        setUsername(user.username);
        setRole(user.role);
        setProfileImage(user.profileImage || null);
      }
    });
  }, []);


  const handleLogout = () => {
    localStorage.clear();
    setUsername(null);
    setProfileImage(null);
    navigate('/');
  };

  return (
    <>
      <nav className="bg-slate-800 text-white p-3  sticky top-0 z-50">
        <div className=" flex justify-between items-center">
          <div >
            {/* Undelete */}
          </div>
          <ul className="flex gap-6 font-medium text-sm items-center">
            <li><Link to="/" className="hover:text-orange-400 transition">มังงะทั้งหมด</Link></li>
            <li><Link to="/picked_review" className="hover:text-orange-400 transition">ชุมชน</Link></li>
            {!username ? (
              <li>
                <button onClick={() => setShowLogin(true)} className="hover:text-orange-400 transition">
                  Login
                </button>
              </li>
            ) : (
              <div className="flex items-center gap-4">
                <Link to="/cart" className="hover:text-orange-400 transition">
                  🛒 ตะกร้าสินค้า
                </Link>
                {role === 'admin' ? (
                  <div className="flex gap-3.5 items-center">
                    <li><Link to="/admin/create" className="hover:text-orange-400 transition">เพิ่มมังงะ</Link></li>
                    <li><Link to="/admin/create" className="hover:text-orange-400 transition">DashBoard</Link></li>
                  </div>
                ) : (
                  <></>
                )}
                <li className="relative group">
                  <button className="flex items-center gap-2 hover:text-orange-400 transition">
                    <img
                      key={profileImage}
                      src={profileImage || '/avatars/default.png'}
                      alt="avatar"
                      className="w-10 h-10 rounded-full object-cover border"
                    />
                  </button>
                  <div className="absolute right-0 mt-2 bg-white text-black rounded shadow-md w-32 opacity-0 group-hover:opacity-100 transition">
                    <Link to="/profile" className="block px-4 py-2 hover:bg-gray-100">Profile {username}</Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </div>
                </li>
              </div>
            )}
          </ul>
        </div>
      </nav>
      {showLogin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm transition-opacity duration-300 animate-fadeIn">
          <div className="relative animate-scaleIn">
            <AuthPage
              onClose={() => {
                setShowLogin(false);
                getCurrentUser().then(user => {
                  if (user) {
                    setUsername(user.username);
                    setRole(user.role);
                    setProfileImage(user.profileImage || null);
                  }
                });
              }}
            />
          </div>
        </div>
      )}
    </>
  );
}

export default Navbar;
