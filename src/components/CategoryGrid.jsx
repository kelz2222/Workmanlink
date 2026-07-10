import { useNavigate } from 'react-router-dom';

export default function CategoryGrid({ categories, selectedCitySlug }) {
  const navigate = useNavigate();

  function handleCategoryClick(slug) {
    const params = new URLSearchParams();
    params.set('category', slug);
    if (selectedCitySlug) params.set('city', selectedCitySlug);
    navigate(`/browse?${params.toString()}`);
  }

  return (
    <div className="grid grid-cols-4 gap-3">
      {categories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => handleCategoryClick(cat.slug)}
          className="flex flex-col items-center gap-1 active:scale-95 transition-transform"
        >
          <div className="w-14 h-14 rounded-2xl bg-primary-50 flex items-center justify-center text-2xl">
            {cat.icon}
          </div>
          <span className="text-[11px] text-gray-700 text-center leading-tight">{cat.name}</span>
        </button>
      ))}
    </div>
  );
}
