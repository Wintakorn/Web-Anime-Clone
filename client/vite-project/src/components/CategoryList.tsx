import { categories } from "../service/categories";

export default function CategoryList() {
  return (
    <section className="my-6 px-4">
      <h2 className="text-lg font-semibold text-blue-900 mb-4">หมวดหมู่</h2>
      <div className="flex flex-wrap gap-3">
        {categories.map((cat, i) => (
          <button
            key={i}
            className={`${cat.color} text-white px-4 py-1.5 rounded-full text-sm font-medium hover:opacity-90 transition`}
          >
            {cat.name}
          </button>
        ))}
      </div>
    </section>
  );
}