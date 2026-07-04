import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase, PUBLIC_ARTISAN_FIELDS } from '../lib/supabase';
import StarRating from '../components/StarRating';
import ReviewForm from '../components/ReviewForm';
import ReportModal from '../components/ReportModal';
import { BadgeCheck, Phone, MessageCircle, MapPin, Flag, CheckCircle2, ArrowLeft } from 'lucide-react';

export default function ArtisanProfile() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [artisan, setArtisan] = useState(null);
  const [portfolio, setPortfolio] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showReport, setShowReport] = useState(false);
  const [showHireModal, setShowHireModal] = useState(false);
  const [activeJob, setActiveJob] = useState(null);
  const [checkingJob, setCheckingJob] = useState(true);

  useEffect(() => {
    loadArtisan();
    checkActiveJob();
  }, [id]);

  async function loadArtisan() {
    const { data } = await supabase.from('artisans').select(PUBLIC_ARTISAN_FIELDS).eq('id', id).single();
    setArtisan(data);

    const { data: images } = await supabase.from('portfolio_images').select('*').eq('artisan_id', id);
    setPortfolio(images || []);

    const { data: revs } = await supabase.from('reviews').select('*').eq('artisan_id', id).order('created_at', { ascending: false });
    setReviews(revs || []);

    setLoading(false);
  }

  async function checkActiveJob() {
    const jobs = JSON.parse(localStorage.getItem('wl_active_jobs') || '{}');
    const jobIdForThisArtisan = Object.keys(jobs).find((jid) => jobs[jid].artisanId === id);

    if (jobIdForThisArtisan) {
      const { data } = await supabase.from('jobs').select('*').eq('id', jobIdForThisArtisan).single();
      setActiveJob(data);
    }
    setCheckingJob(false);
  }

  async function handleHire(name, phone) {
    const { data, error } = await supabase.from('jobs').insert({
      artisan_id: id,
      customer_name: name,
      customer_phone: phone,
      status: 'hired',
      payment_status: 'unpaid',
    }).select().single();

    if (error) { alert('Something went wrong, please try again'); return; }

    const jobs = JSON.parse(localStorage.getItem('wl_active_jobs') || '{}');
    jobs[data.id] = { artisanId: id };
    localStorage.setItem('wl_active_jobs', JSON.stringify(jobs));
    localStorage.setItem('wl_customer_name', name);
    localStorage.setItem('wl_customer_phone', phone);

    setActiveJob(data);
    setShowHireModal(false);
  }

  async function handleSimulatedPayment() {
    await supabase.from('jobs').update({ payment_status: 'paid' }).eq('id', activeJob.id);
    setActiveJob({ ...activeJob, payment_status: 'paid' });
    alert('Payment successful (test mode). Your booking is confirmed.');
  }

  async function handleConfirmCompletion() {
    await supabase.from('jobs').update({
      status: 'completed',
      payment_status: 'released',
      completed_at: new Date().toISOString(),
    }).eq('id', activeJob.id);
    await supabase.from('artisans').update({ completed_jobs: (artisan.completed_jobs || 0) + 1 }).eq('id', id);
    setActiveJob({ ...activeJob, status: 'completed', payment_status: 'released' });
    setArtisan({ ...artisan, completed_jobs: (artisan.completed_jobs || 0) + 1 });
  }

  function handleCall() {
    window.location.href = `tel:${artisan.phone}`;
  }

  function handleWhatsApp() {
    const waMessage = encodeURIComponent(`Hi ${artisan.full_name}, I found you on WorkmanLink.`);
    window.open(`https://wa.me/${artisan.whatsapp_number.replace(/\D/g, '')}?text=${waMessage}`, '_blank');
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center text-gray-400">Loading...</div>;
  if (!artisan) return <div className="min-h-screen flex items-center justify-center text-gray-400">Artisan not found</div>;

  const knownStates = ['hired-unpaid', 'hired-paid', 'completed-released'];
  const currentJobState = activeJob ? `${activeJob.status}-${activeJob.payment_status || 'unpaid'}` : null;
  const effectiveJob = (activeJob && knownStates.includes(currentJobState)) ? activeJob : null;

  const hasReviewedThisJob = effectiveJob?.status === 'completed' &&
    reviews.some(r => r.customer_phone === localStorage.getItem('wl_customer_phone'));

  return (
    <div className="pb-24 min-h-screen">
      <div className="bg-primary-500 px-4 pt-5 pb-6 rounded-b-[28px]">
        <button onClick={() => navigate(-1)} className="text-white mb-3"><ArrowLeft size={22} /></button>
        <div className="flex gap-4 items-center">
          <img
            src={artisan.profile_photo_url || 'https://placehold.co/100x100/ffffff/128C4A?text=WL'}
            className="w-20 h-20 rounded-2xl object-cover border-2 border-white"
          />
          <div className="flex-1">
            <div className="flex items-center gap-1">
              <h1 className="text-white font-bold text-lg">{artisan.full_name}</h1>
              {artisan.is_verified && <BadgeCheck size={18} className="text-white" />}
            </div>
            <p className="text-primary-50 text-sm">{artisan.categories?.icon} {artisan.categories?.name}</p>
            <div className="flex items-center gap-1 text-primary-50 text-xs mt-1">
              <MapPin size={12} />
              <span>{artisan.areas?.name}, {artisan.cities?.name}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 -mt-4">
        <div className="card p-4 grid grid-cols-3 divide-x divide-gray-100 text-center">
          <div>
            <p className="font-bold text-gray-900">{artisan.completed_jobs || 0}</p>
            <p className="text-[11px] text-gray-500">Jobs Done</p>
          </div>
          <div>
            <StarRating rating={artisan.average_rating} size={14} />
            <p className="text-[11px] text-gray-500 mt-0.5">{artisan.review_count || 0} reviews</p>
          </div>
          <div>
            <p className="font-bold text-gray-900">{artisan.years_experience}yrs</p>
            <p className="text-[11px] text-gray-500">Experience</p>
          </div>
        </div>
      </div>

      <div className="px-4 mt-4 flex gap-2">
        <button onClick={handleCall} className="flex-1 flex items-center justify-center gap-2 bg-gray-900 text-white py-3 rounded-xl font-medium">
          <Phone size={18} /> Call
        </button>
        <button onClick={handleWhatsApp} className="flex-1 flex items-center justify-center gap-2 bg-primary-500 text-white py-3 rounded-xl font-medium">
          <MessageCircle size={18} /> WhatsApp
        </button>
      </div>

      <div className="px-4 mt-4">
        {!effectiveJob && (
          <button onClick={() => setShowHireModal(true)} className="btn-primary w-full">
            Hire {artisan.full_name.split(' ')[0]}
          </button>
        )}

        {effectiveJob?.status === 'hired' && effectiveJob?.payment_status === 'unpaid' && (
          <div className="card p-4 bg-yellow-50 border border-yellow-200">
            <p className="text-sm text-yellow-800 font-medium mb-3">Confirm your booking</p>
            <p className="text-xs text-yellow-700 mb-3">
              Pay to secure this booking. Your money is held safely and only sent to {artisan.full_name.split(' ')[0]} once you confirm the job is done — it is not paid out yet.
            </p>
            <button onClick={handleSimulatedPayment} className="w-full bg-yellow-600 text-white py-3 rounded-xl font-semibold">
              Pay & Secure Booking
            </button>
          </div>
        )}

        {effectiveJob?.status === 'hired' && effectiveJob?.payment_status === 'paid' && (
          <div className="card p-4 bg-blue-50 border-2 border-blue-300">
            <p className="text-sm font-semibold text-blue-900 mb-2">Payment secured</p>
            <p className="text-xs text-blue-700 mb-3">
              Once {artisan.full_name.split(' ')[0]} finishes the job to your satisfaction, confirm below to release payment.
            </p>
            <button onClick={handleConfirmCompletion} className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-3 rounded-xl font-semibold">
              <CheckCircle2 size={18} /> Job Finished — Release Payment
            </button>
          </div>
        )}

        {effectiveJob?.status === 'completed' && !hasReviewedThisJob && (
          <ReviewForm artisanId={id} jobId={effectiveJob.id} onDone={() => setActiveJob(null)} />
        )}

        {effectiveJob?.status === 'completed' && hasReviewedThisJob && (
          <div className="card p-4 bg-primary-50 border border-primary-200 text-center">
            <CheckCircle2 className="text-primary-500 mx-auto mb-1" size={24} />
            <p className="text-sm text-primary-700 font-medium">Thanks for your review!</p>
          </div>
        )}
      </div>

      {artisan.bio && (
        <div className="px-4 mt-5">
          <h3 className="font-semibold text-gray-900 mb-1">About</h3>
          <p className="text-sm text-gray-600">{artisan.bio}</p>
        </div>
      )}

      {portfolio.length > 0 && (
        <div className="px-4 mt-5">
          <h3 className="font-semibold text-gray-900 mb-2">Portfolio</h3>
          <div className="grid grid-cols-3 gap-2">
            {portfolio.map((img) => (
              <img key={img.id} src={img.image_url} loading="lazy" className="w-full h-24 object-cover rounded-xl" />
            ))}
          </div>
        </div>
      )}

      <div className="px-4 mt-5">
        <h3 className="font-semibold text-gray-900 mb-2">Reviews ({reviews.length})</h3>
        {reviews.length === 0 ? (
          <p className="text-sm text-gray-400">No reviews yet</p>
        ) : (
          <div className="flex flex-col gap-3">
            {reviews.map((r) => (
              <div key={r.id} className="card p-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-gray-900">{r.customer_name}</p>
                  <StarRating rating={r.rating} size={13} showNumber={false} />
                </div>
                {r.comment && <p className="text-sm text-gray-600 mt-1">{r.comment}</p>}
                {r.photo_url && <img src={r.photo_url} className="w-20 h-20 object-cover rounded-lg mt-2" loading="lazy" />}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="px-4 mt-6">
        <button onClick={() => setShowReport(true)} className="flex items-center gap-2 text-red-500 text-sm font-medium mx-auto">
          <Flag size={15} /> Report this Artisan
        </button>
      </div>

      {showReport && <ReportModal artisanId={id} onClose={() => setShowReport(false)} />}

      {showHireModal && (
        <HireModal
          artisanName={artisan.full_name}
          onClose={() => setShowHireModal(false)}
          onSubmit={handleHire}
        />
      )}
    </div>
  );
}

function HireModal({ artisanName, onClose, onSubmit }) {
  const [name, setName] = useState(localStorage.getItem('wl_customer_name') || '');
  const [phone, setPhone] = useState(localStorage.getItem('wl_customer_phone') || '');

  return (
    <div
      className="fixed inset-0 bg-black/40 z-[60] flex items-end"
      onClick={onClose}
    >
      <div
        className="bg-white w-full rounded-t-3xl max-h-[85vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="overflow-y-auto p-5 flex-1">
          <h3 className="font-bold text-lg mb-1">Hire {artisanName.split(' ')[0]}</h3>
          <p className="text-sm text-gray-500 mb-4">
            Enter your details so we can track this job for payment, confirmation and reviews later.
          </p>

          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            className="w-full p-3 rounded-xl border border-gray-200 text-sm outline-none mb-3"
          />
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            type="tel"
            placeholder="Your phone number"
            className="w-full p-3 rounded-xl border border-gray-200 text-sm outline-none mb-4"
          />

          <button
            onClick={() => name && phone && onSubmit(name, phone)}
            className="btn-primary w-full"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}
