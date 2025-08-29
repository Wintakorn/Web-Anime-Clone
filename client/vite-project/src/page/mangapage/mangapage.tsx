import { useEffect, useState } from 'react';
import { fetchMangaseach } from '../../features/manga/mangaAPI';
import type { Manga } from '../../types/manga.t';
import MangaCard from '../../components/manga-component/mangaCard';
import SearchInput from '../../components/manga-component/SearchInput';
import CategoryList from '../../components/CategoryList';

const MangaPage = () => {
  const [mangas, setMangas] = useState<Manga[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortType, setSortType] = useState('relevance');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    fetchMangaseach({
      search: searchTerm,
      sort: sortType,
      page,
      limit: 20,
    }).then((data) => {
      setMangas(data.mangas);
      setTotal(data.total);
    });
  }, [searchTerm, sortType, page]);

  const totalPages = Math.ceil(total / 20);

  return (
    <div className="px-6 space-y-6">
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1">
          <SearchInput
            searchTerm={searchTerm}
            onSearchChange={(term) => {
              setSearchTerm(term);
              setPage(1);
            }}
            onSortChange={(sort) => {
              setSortType(sort);
              setPage(1);
            }}
            currentSort={sortType}
          />

          <CategoryList />

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4">
            {mangas.map((manga) => (
              <MangaCard key={manga._id} manga={manga} />
            ))}
          </div>

          <div className="flex justify-center mt-10">
            <div className="inline-flex items-center space-x-2">
              <button
                className="px-3 py-1 border border-[#60bffb]/20 text-white rounded"
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
              >
                ❮
              </button>
              <span className="font-semibold text-[#60bffb]">
                {page} / {totalPages}
              </span>
              <button
                className="px-3 py-1 border border-[#60bffb]/20 text-white rounded"
                disabled={page === totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                ❯
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

  );
};

export default MangaPage;
