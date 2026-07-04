import { useNavigate } from 'react-router-dom';
import { BadgeCheck, MapPin } from 'lucide-react';
import StarRating from './StarRating';

export default function ArtisanCard({ artisan }) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/artisan/${artisan.id}`)}
      className="card p-3 flex gap-3 active:scale-[0.98] transition-transform cursor-pointer"
    >
      <img
        src={artisan.profile_photo_url || 'https://placehold.co/80x80/128C4A/ffffff?text=WL'}
        alt={artisan.full_name}
        className="w-16 h-16 rounded-xl object-cover flex-shrink-0"
        loading="lazy"
      />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1">
          <h3 className="font-semibold text-gray-900 truncate">{artisan.full_name}</h3>
          {artisan.is_verified && (
            <BadgeCheck size={16} className="text-primary-500 flex-shrink-0" />
          )}
        </div>
        <p className="text-sm text-primary-600 font-medium">
          {artisan.categories?.icon} {artisan.categories?.name}
        </p>
        <div className="flex items-center gap-1 text-xs text-gray-500 mt-0.5">
          <MapPin size={12} />
          <span className="truncate">{artisan.areas?.name}, {artisan.cities?.name}</span>
        </div>
        <div className="mt-1">
          <StarRating rating={artisan.average_rating} size={13} />
        </div>
      </div>
    </div>
  );
}
