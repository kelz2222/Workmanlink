import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { supabase, PUBLIC_ARTISAN_FIELDS } from '../lib/supabase';
import ArtisanCard from '../components/ArtisanCard';
import { SlidersHorizontal, X } from 'lucide-react';

export default function Browse() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [artisans, setArtisans] = useState([]);
  const [cities, setCities] = useState([]);
  const [categories, setCategories] = useState([]);
  const [areas, setAreas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  const [filters, setFilters] = useState({
    q: searchParams.get('q') || '',
    city: searchParams.get('city') || '',
    category: searchParams.get('category') || '',
    area: searchParams.get('area') || '',
    verifiedOnly: false,
    topRated: false,
  });

  useEffect(() => {
    loadFilters();
  }, []);

  useEffect(() => {
    loadArtisans();
  }, [filters.city, filters.category, filters.area, filters.verifiedOnly, filters.topRated]);

  async function loadFilters() {
    const [citiesRes, categoriesRes] = await Promise.all([
      supabase.from('cities').select('*').eq('is_active', true).order('name'),
      supabase.from('categories').select('*').eq('is_active', true).order('name'),
    ]);
    setCities(citiesRes.data || []);
    setCategories(categoriesRes.data || []);
  }

  useEffect(() => {
    async function loadAreas() {
      if (!filters.city) { setAreas([]); return; }
      const city = cities.find(c => c.slug === filters.city);
      if (!city) return;
      const { data } = await supabase.from('areas').select('*').eq('city_id', city.id).order('name');
      setAreas(data || []);
    }
    loadAreas();
  }, [filters.city, cities]);

  async function loadArtisans() {
    setLoading(true);
    let query = supabase.from('artisans').select(PUBLIC_ARTISAN_FIELDS).eq('status', 'approved');

    if (filters.city) {
      const city = cities.find(c => c.slug === filters.city);
      if (city) query = query.eq('city_id', city.id);
    }
    if (filters.category) {
      const cat = categories.find(c => c.slug === filters.category);
      if (cat) query = query.eq('category_id', cat.id);
    }
    if (filters.area) {
      query = query.eq('area_id', filters.area);
    }
    if (filters.verifiedOnly) {
      query = query.eq('is_verified', true);
    }
    if (filters.topRated) {
      query = query.order('average_rating', { ascending: false });
    } else {
      query = query.order('created_at', { ascending: false });
    }

    const { data } = await query;
    let results = data || [];

    if (filters.q.trim()) {
      const q = filters.q.trim().toLowerCase();
      results = results.filter(a =>
        a.full_name?.toLowerCase().includes(q) ||
        a.categories?.name?.toLowerCase().includes(q) ||
        a.bio?.toLowerCase().includes(q)
      );
    }

    setArtisans(results);
    setLoading(false);
  }

  function updateFilter(key, value) {
    setFilters(prev => ({ ...prev, [key]: value }));
  }

  function clearFilters() {
    setFilters({ q: '', city: '', category: '', area: '', verifiedOnly: false, topRated: false });
  }

  const activeFilterCount = [filters.city, filters.category, filters.area].filter(Boolean).length
    + (filters.verifiedOnly ? 1 : 0) + (filters.topRated ? 1 : 0);

  return (
    <div className="pb-24 min-h-screen px-4 pt-5">
      <div className="flex items-center gap-2 mb-4">
        <input
          type="text"
          value={filters.q}
          onChange={(e) => updateFilter('q', e.target.value)}
          placeholder="Search artisans..."
          className="flex-1 px-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-primary-500 text-sm"
        />
        <button
          onClick={() => setShowFilters(true)}
          className="relative p-3 bg-white rounded-xl border border-gray-200"
        >
          <SlidersHorizontal size={18} className="text-gray-600" />
          {activeFilterCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-primary-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
              {activeFilterCount}
            </span>
          )}
        </button>
      </div>

      {/* Quick filter chips */}
      <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
        <button
          onClick={() => updateFilter('verifiedOnly', !filters.verifiedOnly)}
          className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap ${
            filters.verifiedOnly ? 'bg-primary-500 text-white' : 'bg-white border border-gray-200 text-gray-600'
          }`}
        >
          ✓ Verified
        </button>
        <button
          onClick={() => updateFilter('topRated', !filters.topRated)}
          className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap ${
            filters.topRated ? 'bg-primary-500 text-white' : 'bg-white border border-gray-200 text-gray-600'
          }`}
        >
          ⭐ Top Rated
        </button>
        {activeFilterCount > 0 && (
          <button onClick={clearFilters} className="px-3 py-1.5 rounded-full text-xs font-medium text-red-500 whitespace-nowrap">
            Clear all
          </button>
        )}
      </div>

      {/* Results */}
      {loading ? (
        <p className="text-center text-gray-400 py-10">Loading artisans...</p>
      ) : artisans.length === 0 ? (
        <p className="text-center text-gray-400 py-10">No artisans found. Try adjusting filters.</p>
      ) : (
        <div className="flex flex-col gap-2">
          {artisans.map((a) => <ArtisanCard key={a.id} artisan={a} />)}
        </div>
      )}

      {/* Filter drawer */}
      {showFilters && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-end" onClick={() => setShowFilters(false)}>
          <div className="bg-white w-full rounded-t-3xl p-5 max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-lg">Filters</h3>
              <button onClick={() => setShowFilters(false)}><X size={22} /></button>
            </div>

            <p className="text-sm font-semibold text-gray-700 mb-2">City</p>
            <div className="flex gap-2 mb-4 flex-wrap">
              {cities.map((c) => (
                <button
                  key={c.id}
                  onClick={() => updateFilter('city', filters.city === c.slug ? '' : c.slug)}
                  className={`px-3 py-2 rounded-xl text-sm ${filters.city === c.slug ? 'bg-primary-500 text-white' : 'bg-gray-100 text-gray-700'}`}
                >
                  {c.name}
                </button>
              ))}
            </div>

            {areas.length > 0 && (
              <>
                <p className="text-sm font-semibold text-gray-700 mb-2">Area</p>
                <div className="flex gap-2 mb-4 flex-wrap">
                  {areas.map((a) => (
                    <button
                      key={a.id}
                      onClick={() => updateFilter('area', filters.area === a.id ? '' : a.id)}
                      className={`px-3 py-2 rounded-xl text-sm ${filters.area === a.id ? 'bg-primary-500 text-white' : 'bg-gray-100 text-gray-700'}`}
                    >
                      {a.name}
                    </button>
                  ))}
                </div>
              </>
            )}

            <p className="text-sm font-semibold text-gray-700 mb-2">Category</p>
            <div className="grid grid-cols-3 gap-2 mb-6">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => updateFilter('category', filters.category === cat.slug ? '' : cat.slug)}
                  className={`px-2 py-2 rounded-xl text-xs ${filters.category === cat.slug ? 'bg-primary-500 text-white' : 'bg-gray-100 text-gray-700'}`}
                >
                  {cat.icon} {cat.name}
                </button>
              ))}
            </div>

            <button
              onClick={() => setShowFilters(false)}
              className="btn-primary w-full"
            >
              Show Results
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
