
import { Home, Search, PlusSquare, BookOpen, Clock, Settings, Facebook } from 'lucide-react';

const Sidebar: React.FC = () => {
  // const [showMoreCategories, setShowMoreCategories] = useState<boolean>(false);



  const userMenuItems = [
    { icon: Home, label: 'Home', path: "/", active: true },
    { icon: Search, label: 'Explore', path: "/explore" },
    { icon: PlusSquare, label: 'Post', path: "/post" },
    { icon: BookOpen, label: 'Favorite', path: "/favorite" },
    { icon: Clock, label: 'History' },
    { icon: Settings, label: 'Editor Backend' }
  ];

  const socialItems = [
    { icon: Facebook, label: 'Facebook', color: 'text-blue-500' },
    // { label: 'Line', color: 'text-green-500', customIcon: '💬' },
    // { label: 'Discord', color: 'text-indigo-500', customIcon: '🎮' }
  ];

  return (
    <div className="bg-slate-800 text-white min-h-screen w-80 flex flex-col">
      <div className="flex items-center p-3 mb-2  ">
        <span className='text-2xl font-bold'>MY</span>
        <span className='text-blue-400 text-2xl font-bold'>MANGA</span>
      </div>
      <div className="flex-1 ">
        <div>
          <nav className="space-y-2">
            {userMenuItems.map((item, index) => {
              const IconComponent = item.icon;
              return (
                <a
                  key={index}
                  href={item.path}
                  className="flex items-center space-x-3 px-3 py-2 text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
                >
                  <IconComponent size={20} />
                  <span>{item.label}</span>
                </a>
              );
            })}
          </nav>
        </div>
        <div>
          <h3 className="text-slate-400 text-sm font-medium mb-3 px-3">Social Network</h3>
          <nav className="space-y-2">
            {socialItems.map((item, index) => (
              <a
                key={index}
                href="#"
                className="flex items-center space-x-3 px-3 py-2 rounded-lg text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
              >
                {item.icon ? (
                  <item.icon size={20} className={item.color} />
                ) : (
                  // <span className="text-lg">{item.customIcon}</span>
                  <></>
                )}
                <span>{item.label}</span>
              </a>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;