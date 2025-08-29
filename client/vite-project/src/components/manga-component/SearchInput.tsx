import type { FC } from "react";


type SearchInputProps = {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onSortChange: (sortType: string) => void;
  currentSort: string;
};


const SearchInput: FC<SearchInputProps> = ({ searchTerm, onSearchChange, onSortChange }) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder="ค้นหา 'manga'"
        className="w-full md:w-1/2 px-4 py-2  rounded-md border border-gray-400 text-white"
      />
      <div className="flex gap-2 flex-wrap text-sm">
        <button onClick={() => onSortChange('relevance')} className="px-4 py-1 bg-gray-200 rounded hover:bg-orange-400 hover:text-white">เกี่ยวข้อง</button>
        <button onClick={() => onSortChange('latest')} className="px-4 py-1 bg-gray-200 rounded hover:bg-orange-400 hover:text-white">ล่าสุด</button>
        <button onClick={() => onSortChange('bestseller')} className="px-4 py-1 bg-gray-200 rounded hover:bg-orange-400 hover:text-white">สินค้าขายดี</button>
        <button onClick={() => onSortChange('price_asc')} className="px-4 py-1 bg-gray-200 rounded hover:bg-orange-400 hover:text-white">ราคาน้อย ⬆️</button>
        <button onClick={() => onSortChange('price_desc')} className="px-4 py-1 bg-gray-200 rounded hover:bg-orange-400 hover:text-white">ราคามาก ⬇️</button>
      </div>

    </div>
  );
};

export default SearchInput;
