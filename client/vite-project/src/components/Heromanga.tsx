import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Manga } from '../types/manga.t';
import { fetchMangas } from '../features/manga/mangaAPI';

export default function HeroSlider() {
  const [mangas, setMangas] = useState<Manga[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [fade, setFade] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchMangas().then((data) => {
      const sorted = [...data].sort(
        (a, b) => new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime()
      );
      setMangas(sorted.slice(0, 5));
    });
  }, []);

  console.log(mangas)
  useEffect(() => {
    const timer = setTimeout(() => {
      setFade(false);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % mangas.length);
        setFade(true);
      }, 300);
    }, 5000);
    return () => clearTimeout(timer);
  }, [currentIndex, mangas.length]);

  if (mangas.length === 0) return null;
  const current = mangas[currentIndex];

  const goTo = (newIndex: number) => {
    if (newIndex === currentIndex) return;
    setFade(false);
    setTimeout(() => {
      setCurrentIndex((newIndex + mangas.length) % mangas.length);
      setFade(true);
    }, 300);
  };

  return (
    <div className="relative w-full max-w-6xl mx-auto overflow-hidden rounded-xl shadow-2xl">
      {/* Background with blur effect */}
      <div 
        className="absolute inset-0 bg-cover bg-center scale-110 blur-md"
        style={{
          backgroundImage: `url(${current.image})`,
        }}
      />
      
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent" />
      
      {/* Navigation buttons */}
      <button
        onClick={() => goTo(currentIndex - 1)}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white rounded-full p-3 shadow-lg transition-all duration-300 hover:scale-110"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button
        onClick={() => goTo(currentIndex + 1)}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white rounded-full p-3 shadow-lg transition-all duration-300 hover:scale-110"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Main content */}
      <div className={`relative z-10 transition-opacity duration-500 ${fade ? 'opacity-100' : 'opacity-0'}`}>
        <div className="h-[450px] flex flex-col md:flex-row items-center gap-8 px-8 py-8">
          {/* Image */}
          <div className="flex-shrink-0">
            <img
              src={current.image}
              alt={current.title}
              className="h-[380px] w-auto object-cover rounded-2xl shadow-2xl cursor-pointer hover:scale-105 transition-transform duration-500 border-4 border-white/20"
              onClick={() => navigate(`/manga/${current._id}`)}
            />
          </div>

          {/* Content */}
          <div className="max-w-2xl text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-shadow-lg leading-tight">
              {current.title}
            </h1>
            
            {/* Metadata */}
            <div className="mb-6 space-y-2">
              <div className="flex flex-wrap gap-4 text-sm text-white/80">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-[#60bffb]">Author:</span>
                  <span>N/A</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-[#60bffb]">Status:</span>
                  <span className="bg-green-500/20 text-green-300 px-2 py-1 rounded-full text-xs">
                    On Going
                  </span>
                </div>
              </div>
              
              <div className="flex items-center gap-2 text-sm text-white/80">
                <span className="font-medium text-[#60bffb]">Views:</span>
                <span>{(Math.random() * 100000).toFixed(0)}</span>
                <span className="mx-2">•</span>
                <span className="font-medium text-[#60bffb]">Rating:</span>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                    </svg>
                  ))}
                  <span className="ml-1">4.8</span>
                </div>
              </div>
            </div>

            {/* Synopsis */}
            <p className="text-white/90 text-base leading-relaxed mb-6 line-clamp-4">
              {current.synopsis}
            </p>

            {/* Genres */}
            <div className="mb-6">
              <div className="flex flex-wrap gap-2">
                {current.genre.slice(0, 4).map((genre, index) => (
                  <span 
                    key={index}
                    className="px-3 py-1 bg-[#60bffb]/20 text-[#60bffb] rounded-full text-xs font-medium border border-[#60bffb]/30"
                  >
                    {genre}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-20">
        <div className="flex justify-center gap-3">
          {mangas.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                i === currentIndex 
                  ? 'bg-[#60bffb] scale-125 shadow-lg' 
                  : 'bg-white/50 hover:bg-white/70'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}