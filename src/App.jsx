import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Browse from './pages/Browse';
import ArtisanProfile from './pages/ArtisanProfile';
import ArtisanRegister from './pages/ArtisanRegister';
import ArtisanDashboard from './pages/ArtisanDashboard';
import ConfirmJob from './pages/ConfirmJob';
import ArtisanPricing from './pages/ArtisanPricing';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import AdminLogin from './pages/Admin/AdminLogin';
import AdminDashboard from './pages/Admin/AdminDashboard';
import AdminArtisans from './pages/Admin/AdminArtisans';
import AdminReports from './pages/Admin/AdminReports';

export default function App() {
  const location = useLocation();
  const hideNavbar = location.pathname.startsWith('/admin') || location.pathname.startsWith('/confirm');

  return (
    <div className="max-w-md mx-auto bg-[#F7FAF8] min-h-screen relative">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/browse" element={<Browse />} />
        <Route path="/artisan/:id" element={<ArtisanProfile />} />
        <Route path="/register" element={<ArtisanRegister />} />
        <Route path="/my-jobs" element={<ArtisanDashboard />} />
        <Route path="/confirm/:jobId" element={<ConfirmJob />} />
        <Route path="/pricing" element={<ArtisanPricing />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<TermsOfService />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/artisans" element={<AdminArtisans />} />
        <Route path="/admin/reports" element={<AdminReports />} />
      </Routes>
      {!hideNavbar && <Navbar />}
    </div>
  );
}
