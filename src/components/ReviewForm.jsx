import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { Star, Camera } from 'lucide-react';

export default function ReviewForm({ artisanId, jobId, onDone }) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [photoFile, setPhotoFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit() {
    if (rating === 0) return alert('Please select a star rating');
    setSubmitting(true);

    let photo_url = null;
    if (photoFile) {
      const fileName = `${artisanId}-${Date.now()}-${photoFile.name}`;
      const { data: uploadData, error: uploadError } = await supabase
        .storage.from('review-photos').upload(fileName, photoFile);
      if (!uploadError) {
        const { data: urlData } = supabase.storage.from('review-photos').getPublicUrl(fileName);
        photo_url = urlData.publicUrl;
      }
    }

    const customerName = localStorage.getItem('wl_customer_name') || 'Customer';
    const customerPhone = localStorage.getItem('wl_customer_phone') || '';

    await supabase.from('reviews').insert({
      artisan_id: artisanId,
      customer_name: customerName,
      customer_phone: customerPhone,
      rating,
      comment,
      photo_url,
    });

    // Recalculate artisan's average rating + review count
    const { data: reviews } = await supabase.from('reviews').select('rating').eq('artisan_id', artisanId);
    const avg = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
    await supabase.from('artisans').update({
      average_rating: Math.round(avg * 10) / 10,
      review_count: reviews.length,
    }).eq('id', artisanId);

    // Clear the completed job from localStorage tracking so it doesn't ask again
    if (jobId) {
      const jobs = JSON.parse(localStorage.getItem('wl_active_jobs') || '{}');
      delete jobs[jobId];
      localStorage.setItem('wl_active_jobs', JSON.stringify(jobs));
    }

    setSubmitting(false);
    onDone();
  }

  return (
    <div className="card p-4 mt-3 border-2 border-primary-100">
      <p className="font-semibold text-gray-900 mb-3">How was the job? Leave a review</p>

      <div className="flex justify-center gap-1 mb-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <button key={i} onClick={() => setRating(i)} onMouseEnter={() => setHoverRating(i)} onMouseLeave={() => setHoverRating(0)}>
            <Star
              size={32}
              className={i <= (hoverRating || rating) ? 'fill-yellow-400 text-yellow-400' : 'fill-gray-200 text-gray-200'}
            />
          </button>
        ))}
      </div>

      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Tell others about your experience (optional)"
        className="w-full p-3 rounded-xl border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-primary-500 mb-3"
        rows={3}
      />

      <label className="flex items-center gap-2 text-sm text-gray-600 mb-4 cursor-pointer">
        <Camera size={18} />
        <span>{photoFile ? photoFile.name : 'Add a photo of the completed job (optional)'}</span>
        <input type="file" accept="image/*" className="hidden" onChange={(e) => setPhotoFile(e.target.files[0])} />
      </label>

      <button onClick={handleSubmit} disabled={submitting} className="btn-primary w-full disabled:opacity-50">
        {submitting ? 'Submitting...' : 'Submit Review'}
      </button>
    </div>
  );
}
