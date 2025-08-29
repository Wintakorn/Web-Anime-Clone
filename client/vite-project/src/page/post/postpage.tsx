import { useEffect, useState } from 'react';
import { Heart, MessageCircle, Share, MoreHorizontal, Plus } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { fetchPosts } from '../../features/post/postAPI';
import type { IPost } from '../../types/post.t';
import { categories } from '../../utils/categories';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

const ForumPostPage = () => {
  const [post, setPost] = useState<IPost[]>([]);
  const [activeCategory, setActiveCategory] = useState('All Category');
  const navigate = useNavigate();

  useEffect(() => {
    fetchPosts()
      .then((data) => {
        const postsArray = Array.isArray(data) ? data : [data];
        const formatted = postsArray.map((post: IPost) => ({
          ...post,
        }));
        setPost(formatted);
      })
      .catch(console.error);
  }, []);

  const filteredPosts = activeCategory === 'All Category'
    ? post
    : post.filter(p => p.categories.includes(activeCategory));

  return (
    <div className="min-h-screen bg-gray-900 text-white px-20 py-10">
      <div className="grid grid-cols-4 gap-4 mb-8">
        {categories.map((category) => {
          const IconComponent = category.icon;
          return (
            <button
              key={category.name}
              onClick={() => setActiveCategory(category.name)}
              className={`flex items-center space-x-3 p-4 rounded-xl transition-all duration-200 ${activeCategory === category.name
                ? 'bg-blue-600 text-white'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
            >
              <IconComponent size={24} />
              <span className="font-medium">{category.name}</span>
            </button>
          );
        })}
      </div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold">Latest Update</h2>
        <Link to="/create/post">
          <button className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-xl transition-colors">
            <Plus size={20} />
            <span>Create Topic</span>
          </button>
        </Link>
      </div>

      <div className="space-y-6 ">
        {filteredPosts.map((postItem) => (
          <div key={postItem.id} onClick={() => navigate(`/post/${postItem.id}`)} className="bg-gray-800 rounded-xl overflow-hidden my-5 hover:bg-slate-900 border border-gray-800 ">
            <div className="flex items-center justify-between p-4 border-b border-gray-700">
              <Link
                to={`/profile/${postItem.user._id}`}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center space-x-3">
                  <img
                    src={postItem.user?.avatar || '/default-avatar.png'}
                    alt={postItem.user?._id}
                    className="w-16 h-16 rounded-full"
                  />
                  <div>
                    <h3 className="font-semibold text-blue-400">{postItem.user.name || 'Unknown'}</h3>
                    <p className='text-slate-300'>
                      {dayjs(postItem.createdAt).fromNow()}
                    </p>
                  </div>
                </div>
              </Link>
              <button className="text-gray-400 hover:text-white">
                <MoreHorizontal size={20} />
              </button>
            </div>

            <div className="p-4">
              <h4 className="text-lg font-semibold mb-3 text-white">{postItem.title}</h4>
              {postItem.postImage && (
                <img
                  src={postItem.postImage}
                  alt="Post"
                  className="w-lg h-auto rounded-lg mb-4"
                />
              )}

              <p className="text-gray-300 leading-relaxed mb-4">
                {postItem.postContent}
              </p>
              <p className="text-slate-300 leading-relaxed mb-4">
                #{postItem.categories}
              </p>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-6">
                  <button className="flex items-center space-x-2 text-gray-400 hover:text-red-400">
                    <Heart size={18} />
                    <span>0</span>
                  </button>
                  <button className="flex items-center space-x-2 text-gray-400 hover:text-blue-400">
                    <MessageCircle size={18} />
                    <span>{postItem.commentCount}</span>
                  </button>
                </div>
                <button className="text-gray-400 hover:text-white">
                  <Share size={18} />
                </button>
              </div>
            </div>
          </div>
          // </Link>
        ))}
      </div>
    </div>
  );
};

export default ForumPostPage;
