import { useEffect, useState } from 'react';
import { fetchMangas } from '../../features/manga/mangaAPI';
import type { Manga } from '../../types/manga.t';

const Explorepage = () => {
    const [selectedGenre, setSelectedGenre] = useState('Fantasy');
    const [selectedStatus, setSelectedStatus] = useState('All');
    const [selectedSort, setSelectedSort] = useState('Last update');
    const [selectedSpecialTypes, setSelectedSpecialTypes] = useState<string[]>([]);
    const [mangas, setMangas] = useState<Manga[]>([]);

    useEffect(() => {
        fetchMangas().then(setMangas).catch(console.error)
    }, [])

    const genres = [
        'Fantasy', 'Action', 'Drama', 'Sport',
        'Sci-fi', 'Comedy', 'Slice of Life', 'Romance',
        'Adventure', 'Yaoi', 'Seinen', 'Trap',
        'Gender Bender', 'Second Life', 'Isekai', 'School Life',
        'Mystery', 'Horror', 'Shounen', 'Shoujo',
        'Yuri', 'Gourmet', 'Harem', 'Reincarnate'
    ];

    const specialTypes = ['Mature', 'Intense', 'Violent', 'Glue', 'Religion'];

    const handleSpecialTypeToggle = (type: string) => {
        setSelectedSpecialTypes(prev =>
            prev.includes(type)
                ? prev.filter(t => t !== type)
                : [...prev, type]
        );
    };


    const getTypeColor = (type: string): string => {
        switch (type) {
            case 'NOVEL': return 'bg-blue-500';
            case 'COMIC': return 'bg-green-500';
            case 'MANGA': return 'bg-red-500';
            case 'ORIGINAL NOVEL': return 'bg-gray-700';
            default: return 'bg-gray-500';
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header Filters */}
                <div className="flex gap-8 mb-8">
                    {/* Genre Section */}
                    <div className="flex-1">
                        <h2 className="text-2xl font-bold mb-4">Genre</h2>
                        <div className="grid grid-cols-4 gap-2">
                            {genres.map((genre) => (
                                <button
                                    key={genre}
                                    onClick={() => setSelectedGenre(genre)}
                                    className={`px-4 py-2 rounded-lg border transition-colors ${selectedGenre === genre
                                        ? 'bg-blue-500 border-blue-500 text-white'
                                        : 'bg-transparent border-gray-600 text-gray-300 hover:border-gray-400'
                                        }`}
                                >
                                    {genre}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Filter Section */}
                    <div className="w-80">
                        <h2 className="text-2xl font-bold mb-4">Filter by</h2>

                        {/* Status */}
                        <div className="mb-6">
                            <h3 className="text-lg font-semibold mb-2 text-gray-400">Status</h3>
                            <div className="flex gap-2">
                                {['All', 'Ongoing', 'Completed'].map((status) => (
                                    <button
                                        key={status}
                                        onClick={() => setSelectedStatus(status)}
                                        className={`px-4 py-2 rounded-lg transition-colors ${selectedStatus === status
                                            ? 'bg-blue-500 text-white'
                                            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                            }`}
                                    >
                                        {status}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Special Type */}
                        <div className="mb-6">
                            <h3 className="text-lg font-semibold mb-2 text-gray-400">Special Type</h3>
                            <div className="flex flex-wrap gap-2">
                                {specialTypes.map((type) => (
                                    <button
                                        key={type}
                                        onClick={() => handleSpecialTypeToggle(type)}
                                        className={`px-4 py-2 rounded-lg transition-colors ${selectedSpecialTypes.includes(type)
                                            ? 'bg-blue-500 text-white'
                                            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                            }`}
                                    >
                                        {type}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Sort by */}
                        <div>
                            <h3 className="text-lg font-semibold mb-2 text-gray-400">
                                Sort by <span className="text-sm text-gray-500">(random refresh in 5 mins)</span>
                            </h3>
                            <div className="flex gap-2">
                                {['Last update', 'Create date', 'Random'].map((sort) => (
                                    <button
                                        key={sort}
                                        onClick={() => setSelectedSort(sort)}
                                        className={`px-4 py-2 rounded-lg transition-colors ${selectedSort === sort
                                            ? 'bg-blue-500 text-white'
                                            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                            }`}
                                    >
                                        {sort}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="grid grid-cols-6 gap-6">
                    {mangas.map((item) => (
                        <div key={item._id} className="h-60 bg-gray-800 rounded-lg overflow-hidden hover:transform hover:scale-105 transition-transform cursor-pointer">
                            <div className="relative h-full">
                                <img
                                    className="w-full h-full object-cover"
                                    src={item.image || '/api/placeholder/200/240'}
                                    alt={item.title}
                                />
                                <div className={`absolute top-2 left-2 px-2 py-1 rounded text-xs font-bold text-white ${getTypeColor(item.source)}`}>
                                    {item.source}
                                </div>
                                <div className="absolute bottom-2 right-2 bg-[rgba(0,0,0,0.6)] px-3 py-1 rounded text-xs ml-3">
                                    {item.title}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="text-center mt-8">
                    <button className="bg-blue-600 hover:bg-blue-700 px-8 py-3 rounded-lg font-semibold transition-colors">
                        Load More
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Explorepage;
;