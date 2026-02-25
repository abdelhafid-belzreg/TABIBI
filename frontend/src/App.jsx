import { BrowserRouter, Routes, Route } from "react-router-dom";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import { Toaster } from "@/components/ui/toaster";
import ScrollToTop from "@/components/ui/ScrollToTop";

import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Doctors from "./pages/Doctors";
import DoctorProfile from "./pages/DoctorProfile";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import VerifyEmail from "@/pages/VerifyEmail";
import ForgotPassword from "@/pages/ForgotPassword";
import ResetPassword from "@/pages/ResetPassword";

import DoctorLayout from "./pages/doctor/DoctorLayout";
import DoctorDashboard from "./pages/doctor/DoctorDashboard";
import DoctorAppointments from "./pages/doctor/DoctorAppointments";
import DoctorProfileEdit from "./pages/doctor/DoctorProfileEdit";
import DoctorAvailability from "./pages/doctor/DoctorAvailability";

import PatientLayout from "./pages/patient/PatientLayout";
import PatientDashboard from "./pages/patient/PatientDashboard";
import BookAppointment from "./pages/patient/BookAppointment";
import PatientAppointment from "./pages/patient/PatientAppointments";
import PatientProfile from "./pages/patient/PatientProfile";

import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import UserManagement from "./pages/admin/UserManagement";
import DoctorValidation from "./pages/admin/DoctorValidation";
import SpecialtyManagement from "./pages/admin/SpecialtyManagement";
import Statistics from "./pages/admin/Statistics";
import Reports from "./pages/admin/Reports";

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <ScrollToTop />
      <main className="container-fluid p-0">
        <Routes>
          {/* Public */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/doctors" element={<Doctors />} />
          <Route path="/doctors/:id" element={<DoctorProfile />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/email/verify/:id/:hash" element={<VerifyEmail />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="*" element={<NotFound />} />

          {/* Doctor */}
          <Route path="/doctor" element={<DoctorLayout />}>
            <Route path="dashboard" element={<DoctorDashboard />} />
            <Route path="appointments" element={<DoctorAppointments />} />
            <Route path="profile/edit" element={<DoctorProfileEdit />} />
            <Route path="availability" element={<DoctorAvailability />} />
          </Route>

          {/* Patient */}
          <Route path="/patient" element={<PatientLayout />}>
            <Route path="dashboard" element={<PatientDashboard />} />
            <Route path="book/:doctorId" element={<BookAppointment />} />
            <Route path="appointments" element={<PatientAppointment />} />
            <Route path="profile" element={<PatientProfile />} />
          </Route>

          {/* Admin */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="users" element={<UserManagement />} />
            <Route path="doctors/validation" element={<DoctorValidation />} />
            <Route path="specialties" element={<SpecialtyManagement />} />
            <Route path="statistics" element={<Statistics />} />
            <Route path="reports" element={<Reports />} />
          </Route>
        </Routes>
      </main>
      <Footer />
      <Toaster />
    </BrowserRouter>
  );
}