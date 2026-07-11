import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function TermsOfService() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen px-4 pt-6 pb-10">
      <div className="flex items-center gap-3 mb-4">
        <button onClick={() => navigate(-1)}><ArrowLeft size={22} /></button>
        <h1 className="font-bold text-lg text-gray-900">Terms of Service</h1>
      </div>

      <div className="text-sm text-gray-600 flex flex-col gap-4">
        <p className="text-xs text-gray-400">Last updated: {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</p>

        <section>
          <h2 className="font-semibold text-gray-900 mb-1">1. About WorkmanLink</h2>
          <p>
            WorkmanLink is a platform that connects customers with local artisans in Umuahia and Port Harcourt. We are a directory and booking facilitation service — we do not employ artisans, and artisans are independent service providers, not WorkmanLink staff.
          </p>
        </section>

        <section>
          <h2 className="font-semibold text-gray-900 mb-1">2. Artisan Verification</h2>
          <p>
            We review NIN documents and selfies submitted by artisans as a verification step. A "Verified" badge indicates our admin team has reviewed these documents, but it is not a guarantee of the artisan's skill, reliability, or the quality of their work. Customers should exercise their own judgment when hiring.
          </p>
        </section>

        <section>
          <h2 className="font-semibold text-gray-900 mb-1">3. Bookings and Payment</h2>
          <p>
            When online payment is enabled, payments made through WorkmanLink are held securely and only released to the artisan once the customer confirms the job is complete. WorkmanLink deducts a service fee from each transaction. Customers are responsible for confirming job completion in good faith.
          </p>
        </section>

        <section>
          <h2 className="font-semibold text-gray-900 mb-1">4. Reports and Account Actions</h2>
          <p>
            We reserve the right to suspend, reject, or delete any artisan or customer account found to be engaging in fraud, providing false information, or violating these terms. Reports of misconduct are reviewed by our admin team.
          </p>
        </section>

        <section>
          <h2 className="font-semibold text-gray-900 mb-1">5. Limitation of Liability</h2>
          <p>
            WorkmanLink facilitates connections between customers and artisans but is not responsible for the quality, safety, or outcome of work performed by artisans. Any disputes regarding workmanship should first be raised through our reporting system.
          </p>
        </section>

        <section>
          <h2 className="font-semibold text-gray-900 mb-1">6. Changes to These Terms</h2>
          <p>
            We may update these Terms from time to time. Continued use of WorkmanLink after changes are posted means you accept the revised Terms.
          </p>
        </section>

        <section>
          <h2 className="font-semibold text-gray-900 mb-1">7. Contact</h2>
          <p>
            For questions about these Terms, please reach out via WhatsApp or email through the contact details provided on our platform.
          </p>
        </section>
      </div>
    </div>
  );
}
