import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Star, Crown, ShieldCheck, Megaphone, MessageCircle } from 'lucide-react';

const ADMIN_WHATSAPP = '2348000000000'; // TODO: replace with your real WhatsApp number

const plans = [
  {
    icon: Star,
    title: 'Featured Artisan Listing',
    price: '₦2,000 / week',
    color: 'text-yellow-600 bg-yellow-50',
    description: 'Your profile appears in the "Featured Artisans" section on the homepage, seen first by every customer in your city.',
    perks: ['Top placement on homepage', 'Priority in category search', 'Featured badge on profile'],
  },
  {
    icon: Crown,
    title: 'Premium Subscription',
    price: '₦5,000 / month',
    color: 'text-purple-600 bg-purple-50',
    description: 'Ongoing perks for artisans who want consistent visibility and tools to grow their bookings.',
    perks: ['Always appears above non-premium artisans', 'Unlimited portfolio photos', 'Premium badge on profile', 'Priority customer support'],
  },
  {
    icon: ShieldCheck,
    title: 'Fast-Track Verification',
    price: '₦1,000 one-time',
    color: 'text-blue-600 bg-blue-50',
    description: 'Skip the queue — get your NIN and selfie reviewed within 24 hours instead of standard review times.',
    perks: ['Reviewed within 24 hours', 'Priority admin attention', 'Verified badge as soon as approved'],
  },
  {
    icon: Megaphone,
    title: 'Sponsored Listing',
    price: 'Custom pricing',
    color: 'text-primary-600 bg-primary-50',
    description: 'For businesses and larger artisan teams — sponsored placement across multiple categories or cities.',
    perks: ['Multi-category visibility', 'Custom banner placement', 'Dedicated account support'],
  },
];

export default function ArtisanPricing() {
  const navigate = useNavigate();

  function contactAdmin(planTitle) {
    const message = encodeURIComponent(`Hi, I'm interested in the "${planTitle}" plan on WorkmanLink. Please tell me how to proceed.`);
    window.open(`https://wa.me/${ADMIN_WHATSAPP}?text=${message}`, '_blank');
  }

  return (
    <div className="min-h-screen px-4 pt-6 pb-10">
      <div className="flex items-center gap-3 mb-2">
        <button onClick={() => navigate(-1)}><ArrowLeft size={22} /></button>
        <h1 className="font-bold text-lg text-gray-900">Grow Your Business</h1>
      </div>
      <p className="text-sm text-gray-500 mb-6">
        Get more visibility and bookings on WorkmanLink with these add-ons.
      </p>

      <div className="flex flex-col gap-4">
        {plans.map((plan) => (
          <div key={plan.title} className="card p-5">
            <div className="flex items-start gap-3 mb-3">
              <div className={`p-2.5 rounded-xl ${plan.color}`}>
                <plan.icon size={22} />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-900">{plan.title}</p>
                <p className="text-primary-600 font-bold text-sm mt-0.5">{plan.price}</p>
              </div>
            </div>

            <p className="text-sm text-gray-600 mb-3">{plan.description}</p>

            <ul className="flex flex-col gap-1.5 mb-4">
              {plan.perks.map((perk) => (
                <li key={perk} className="text-xs text-gray-500 flex items-start gap-1.5">
                  <span className="text-primary-500 mt-0.5">✓</span>
                  <span>{perk}</span>
                </li>
              ))}
            </ul>

            <button
              onClick={() => contactAdmin(plan.title)}
              className="w-full flex items-center justify-center gap-2 bg-gray-900 text-white py-2.5 rounded-xl text-sm font-medium"
            >
              <MessageCircle size={16} /> Contact Admin to Subscribe
            </button>
          </div>
        ))}
      </div>

      <p className="text-[11px] text-gray-400 text-center mt-6">
        Online payment for these plans is coming soon. For now, reach out directly and we'll set it up for you.
      </p>
    </div>
  );
}
