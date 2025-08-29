import { Link } from "react-router-dom";
import type { Manga } from "../../types/manga.t";


type Props = {
  manga: Manga;
};

const MangaCard = ({ manga }: Props) => {
  return (
    <div className="border bg-slate-800 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition duration-300 w-full">
      <img
        src={manga.image}
        alt={manga.title}
        className="w-full h-64 object-cover"  
      />
      <div className="p-4">
        <h3 className="text-lg font-bold text-white truncate">{manga.title}</h3>
        <p className="text-sm text-slate-300 line-clamp-2 mt-1">{manga.synopsis}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {manga.genre.map((tag, index) => (
            <span
              key={index}
              className="text-xs bg-[#60bffb]/20 text-[#60bffb] px-2 py-0.5 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
        <Link
          to={`/manga/${manga._id}`}
          className="mt-4 inline-block text-sm text-blue-500 hover:underline"
        >
          อ่านเพิ่มเติม →
        </Link>
      </div>
    </div>
  );
};

export default MangaCard;
