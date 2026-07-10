import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase, PUBLIC_ARTISAN_FIELDS } from '../lib/supabase';
import SearchBar from '../components/SearchBar';
import CategoryGrid from '../components/CategoryGrid';
import ArtisanCard from '../components/ArtisanCard';
import { BadgeCheck, MessageCircle, ShieldCheck, UserPlus, Bell } from 'lucide-react';
import { requestPushPermission } from '../lib/onesignal';

export default function Home() {
  const navigate = useNavigate();
  const [cities, setCities] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCity, setSelectedCity] = useState(null);
  const [featured, setFeatured] = useState([]);
  const [nearYou, setNearYou] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    if (selectedCity) loadArtisans();
  }, [selectedCity]);

  async function loadInitialData() {
    const [citiesRes, categoriesRes] = await Promise.all([
      supabase.from('cities').select('*').eq('is_active', true).order('name'),
      supabase.from('categories').select('*').eq('is_active', true).order('name'),
    ]);

    setCities(citiesRes.data || []);
    setCategories(categoriesRes.data || []);

    const savedCitySlug = localStorage.getItem('wl_selected_city');
    const defaultCity = citiesRes.data?.find(c => c.slug === savedCitySlug) || citiesRes.data?.[0];
    setSelectedCity(defaultCity);
    setLoading(false);
  }

  async function loadArtisans() {
    const [featuredRes, nearRes] = await Promise.all([
      supabase.from('artisans')
        .select(PUBLIC_ARTISAN_FIELDS)
        .eq('status', 'approved')
        .eq('city_id', selectedCity.id)
        .eq('is_featured', true)
        .limit(6),
      supabase.from('artisans')
        .select(PUBLIC_ARTISAN_FIELDS)
        .eq('status', 'approved')
        .eq('city_id', selectedCity.id)
        .order('created_at', { ascending: false })
        .limit(8),
    ]);

    setFeatured(featuredRes.data || []);
    setNearYou(nearRes.data || []);
  }

  function handleCityChange(city) {
    setSelectedCity(city);
    localStorage.setItem('wl_selected_city', city.slug);
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-400">Loading WorkmanLink...</p>
      </div>
    );
  }

  return (
    <div className="pb-24 min-h-screen">
      <div className="bg-primary-500 px-4 pt-6 pb-8 rounded-b-[32px]">
        <div className="flex items-center gap-2 mb-1">
          <img src="/logo.png" alt="WorkmanLink" className="w-9 h-9 rounded-lg" />
          <h1 className="text-white text-xl font-bold">WorkmanLink</h1>
        </div>
        <p className="text-primary-50 text-sm mb-4">Guiding you to exceptional local skill</p>

        <div className="flex gap-2 mb-4">
          {cities.map((city) => (
            <button
              key={city.id}
              onClick={() => handleCityChange(city)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedCity?.id === city.id
                  ? 'bg-white text-primary-600'
                  : 'bg-primary-600/40 text-white'
              }`}
            >
              {city.name}
            </button>
          ))}
        </div>

        <SearchBar selectedCitySlug={selectedCity?.slug} />

        <button
          onClick={() => navigate(`/browse?city=${selectedCity?.slug}`)}
          className="w-full mt-4 bg-white text-primary-600 font-semibold py-3 rounded-2xl active:scale-[0.98] transition-transform"
        >
          Find an Artisan Now
        </button>
      </div>

      <div className="px-4 mt-6">
        <h2 className="font-bold text-gray-900 mb-3">Browse by Category</h2>
        <CategoryGrid categories={categories} selectedCitySlug={selectedCity?.slug} />
      </div>

      {featured.length > 0 && (
        <div className="px-4 mt-7">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold text-gray-900">Featured Artisans</h2>
          </div>
          <div className="flex flex-col gap-2">
            {featured.map((a) => <ArtisanCard key={a.id} artisan={a} />)}
          </div>
        </div>
      )}

      <div className="px-4 mt-7">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-bold text-gray-900">Artisans Near You</h2>
          <button
            onClick={() => navigate(`/browse?city=${selectedCity?.slug}`)}
            className="text-primary-600 text-sm font-medium"
          >
            See all
          </button>
        </div>
        <div className="flex flex-col gap-2">
          {nearYou.length > 0 ? (
            nearYou.map((a) => <ArtisanCard key={a.id} artisan={a} />)
          ) : (
            <p className="text-gray-400 text-sm text-center py-6">
              No artisans yet in {selectedCity?.name}. Be the first!
            </p>
          )}
        </div>
      </div>

      <div className="px-4 mt-7">
        <button
          onClick={requestPushPermission}
          className="w-full flex items-center justify-center gap-2 bg-white border border-gray-200 text-gray-700 py-3 rounded-xl text-sm font-medium"
        >
          <Bell size={16} className="text-primary-500" /> Enable Notifications
        </button>
      </div>

      <div className="px-4 mt-7">
        <div
          onClick={() => navigate('/register')}
          className="bg-gray-900 rounded-2xl p-5 flex items-center justify-between active:scale-[0.98] transition-transform cursor-pointer"
        >
          <div>
            <p className="text-white font-bold">Are you an Artisan?</p>
            <p className="text-gray-300 text-sm mt-0.5">Join WorkmanLink and get more customers</p>
          </div>
          <UserPlus className="text-primary-500" size={28} />
        </div>
      </div>

      <div className="px-4 mt-7">
        <h2 className="font-bold text-gray-900 mb-3">Why WorkmanLink</h2>
        <div className="grid grid-cols-1 gap-3">
          <div className="card p-4 flex items-center gap-3">
            <BadgeCheck className="text-primary-500 flex-shrink-0" size={26} />
            <div>
              <p className="font-semibold text-sm text-gray-900">Verified Artisans</p>
              <p className="text-xs text-gray-500">ID-checked and admin-approved before listing</p>
            </div>
          </div>
          <div className="card p-4 flex items-center gap-3">
            <MessageCircle className="text-primary-500 flex-shrink-0" size={26} />
            <div>
              <p className="font-semibold text-sm text-gray-900">Direct WhatsApp Contact</p>
              <p className="text-xs text-gray-500">No middleman — talk to the artisan directly</p>
            </div>
          </div>
          <div className="card p-4 flex items-center gap-3">
            <ShieldCheck className="text-primary-500 flex-shrink-0" size={26} />
            <div>
              <p className="font-semibold text-sm text-gray-900">Local & Reliable</p>
              <p className="text-xs text-gray-500">Real reviews from real customers nearby</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
