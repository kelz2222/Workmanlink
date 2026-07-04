import { Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

export default function SearchBar({ selectedCitySlug }) {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (query.trim()) params.set('q', query.trim());
    if (selectedCitySlug) params.set('city', selectedCitySlug);
    navigate(`/browse?${params.toString()}`);
  };

  return (
    <form onSubmit={handleSearch} className="relative">
      <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search: electrician, plumber, tailor..."
        className="w-full pl-11 pr-4 py-4 rounded-2xl border-none shadow-md text-[15px] outline-none focus:ring-2 focus:ring-primary-500"
      />
    </form>
  );
}
