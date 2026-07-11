import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function PrivacyPolicy() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen px-4 pt-6 pb-10">
      <div className="flex items-center gap-3 mb-4">
        <button onClick={() => navigate(-1)}><ArrowLeft size={22} /></button>
        <h1 className="font-bold text-lg text-gray-900">Privacy Policy</h1>
      </div>

      <div className="text-sm text-gray-600 flex flex-col gap-4">
        <p className="text-xs text-gray-400">Last updated: {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</p>

        <section>
          <h2 className="font-semibold text-gray-900 mb-1">1. Information We Collect</h2>
          <p>When you use WorkmanLink, we collect information you provide directly, including:</p>
          <ul className="list-disc pl-5 mt-1 flex flex-col gap-1">
            <li>For customers: name and phone number when hiring an artisan or leaving a review</li>
            <li>For artisans: full name, phone number, WhatsApp number, National Identification Number (NIN), a photo of your NIN document, a selfie photograph, bank account details, and portfolio images</li>
          </ul>
        </section>

        <section>
          <h2 className="font-semibold text-gray-900 mb-1">2. How We Use Your Information</h2>
          <p>We use this information to:</p>
          <ul className="list-disc pl-5 mt-1 flex flex-col gap-1">
            <li>Verify artisan identity before approving their listing</li>
            <li>Connect customers with artisans for service bookings</li>
            <li>Process payments and payouts once online payment is enabled</li>
            <li>Investigate reports of fraud or poor service</li>
          </ul>
        </section>

        <section>
          <h2 className="font-semibold text-gray-900 mb-1">3. Who Can See Your Information</h2>
          <p>
            Your NIN number, NIN document, and selfie photograph are strictly private and are visible only to WorkmanLink administrators for verification purposes. They are never shown publicly on your profile or to other users.
          </p>
          <p className="mt-1">
            Your name, category, location, phone number, WhatsApp number, portfolio photos, and reviews are visible publicly to help customers find and contact you.
          </p>
        </section>

        <section>
          <h2 className="font-semibold text-gray-900 mb-1">4. Data Storage and Security</h2>
          <p>
            Your data is stored securely using Supabase, with private documents (NIN and selfie) protected by access controls that restrict viewing to authorized administrators only.
          </p>
        </section>

        <section>
          <h2 className="font-semibold text-gray-900 mb-1">5. Data Retention and Deletion</h2>
          <p>
            If your artisan application is rejected or your account is removed, your NIN, selfie, and related documents are permanently deleted from our systems. You may request deletion of your data at any time by contacting us.
          </p>
        </section>

        <section>
          <h2 className="font-semibold text-gray-900 mb-1">6. Your Rights</h2>
          <p>
            You have the right to access, correct, or request deletion of your personal data. To exercise these rights, please contact us using the details below.
          </p>
        </section>

        <section>
          <h2 className="font-semibold text-gray-900 mb-1">7. Contact Us</h2>
          <p>
            For questions about this Privacy Policy or your data, please reach out to us via WhatsApp or email through the contact details provided on our platform.
          </p>
        </section>

        <p className="text-xs text-gray-400 mt-4">
          This policy may be updated from time to time. Continued use of WorkmanLink after changes means you accept the updated policy.
        </p>
      </div>
    </div>
  );
}
