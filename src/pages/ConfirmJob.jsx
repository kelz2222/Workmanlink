import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import ReviewForm from '../components/ReviewForm';
import { CheckCircle2 } from 'lucide-react';

export default function ConfirmJob() {
  const { jobId } = useParams();
  const [job, setJob] = useState(null);
  const [artisan, setArtisan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [confirmed, setConfirmed] = useState(false);

  useEffect(() => { loadJob(); }, [jobId]);

  async function loadJob() {
    const { data: jobData } = await supabase.from('jobs').select('*').eq('id', jobId).single();
    if (jobData) {
      setJob(jobData);
      const { data: artisanData } = await supabase.from('artisans').select('id, full_name, profile_photo_url').eq('id', jobData.artisan_id).single();
      setArtisan(artisanData);

      // Also save to localStorage so device-based detection works too
      const jobs = JSON.parse(localStorage.getItem('wl_active_jobs') || '{}');
      jobs[jobId] = { artisanId: jobData.artisan_id };
      localStorage.setItem('wl_active_jobs', JSON.stringify(jobs));
      localStorage.setItem('wl_customer_name', jobData.customer_name);
      localStorage.setItem('wl_customer_phone', jobData.customer_phone);
    }
    setLoading(false);
  }

  async function handleConfirm() {
    await supabase.from('jobs').update({ status: 'completed', completed_at: new Date().toISOString() }).eq('id', jobId);
    const { data: artisanRow } = await supabase.from('artisans').select('completed_jobs').eq('id', job.artisan_id).single();
    await supabase.from('artisans').update({ completed_jobs: (artisanRow.completed_jobs || 0) + 1 }).eq('id', job.artisan_id);
    setJob({ ...job, status: 'completed' });
    setConfirmed(true);
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center text-gray-400">Loading...</div>;
  if (!job) return <div className="min-h-screen flex items-center justify-center text-gray-400 px-6 text-center">Job not found. This link may be invalid.</div>;

  return (
    <div className="min-h-screen px-4 pt-10 pb-10">
      <div className="text-center mb-6">
        <img src={artisan?.profile_photo_url || 'https://placehold.co/80x80/128C4A/ffffff?text=WL'} className="w-16 h-16 rounded-2xl mx-auto object-cover mb-3" />
        <h1 className="font-bold text-lg text-gray-900">Confirm Job Completion</h1>
        <p className="text-sm text-gray-500 mt-1">{artisan?.full_name} marked this job as finished</p>
      </div>

      {job.status === 'awaiting_confirmation' && (
        <div className="card p-5 border-2 border-blue-300 bg-blue-50">
          <p className="text-sm text-blue-900 mb-4">Please confirm only if {artisan?.full_name.split(' ')[0]} actually completed the work to your satisfaction.</p>
          <button onClick={handleConfirm} className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-3 rounded-xl font-semibold">
            <CheckCircle2 size={18} /> Yes, Job Completed
          </button>
        </div>
      )}

      {job.status === 'completed' && !confirmed && (
        <div className="card p-5 text-center">
          <CheckCircle2 className="text-primary-500 mx-auto mb-2" size={28} />
          <p className="text-sm text-gray-700">This job was already confirmed as completed.</p>
        </div>
      )}

      {(confirmed || job.status === 'completed') && (
        <ReviewForm artisanId={job.artisan_id} jobId={jobId} onDone={() => window.location.href = '/'} />
      )}

      {job.status === 'hired' && (
        <div className="card p-5 text-center">
          <p className="text-sm text-gray-500">This job hasn't been marked finished yet by the artisan.</p>
        </div>
      )}
    </div>
  );
}
