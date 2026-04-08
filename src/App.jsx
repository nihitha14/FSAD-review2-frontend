import { Route, Routes } from "react-router-dom";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import AdminLoginPage from "./pages/AdminLoginPage";
import AdminSignupPage from "./pages/AdminSignupPage";
import AuthPortalPage from "./pages/AuthPortalPage";
import BookSessionPage from "./pages/BookSessionPage";
import CareersPage from "./pages/CareersPage";
import CounsellorsPage from "./pages/CounsellorsPage";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import ResourcesPage from "./pages/ResourcesPage";
import SignupPage from "./pages/SignupPage";
import StudentDashboardPage from "./pages/StudentDashboardPage";

function App() {
  return (
    <div className="site-shell">
      <div className="site-bg-shape site-bg-shape-one" />
      <div className="site-bg-shape site-bg-shape-two" />
      <Navbar />
      <main className="page-shell">
        <Routes>
          <Route path="/" element={<AuthPortalPage />} />
          <Route
            path="/home"
            element={
              <ProtectedRoute allowedRoles={["student", "admin"]} loginPath="/">
                <HomePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/careers"
            element={
              <ProtectedRoute allowedRoles={["student", "admin"]} loginPath="/">
                <CareersPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/resources"
            element={
              <ProtectedRoute allowedRoles={["student", "admin"]} loginPath="/">
                <ResourcesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/counsellors"
            element={
              <ProtectedRoute allowedRoles={["student", "admin"]} loginPath="/">
                <CounsellorsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/book-session"
            element={
              <ProtectedRoute allowedRoles={["student"]} loginPath="/">
                <BookSessionPage />
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route path="/admin/signup" element={<AdminSignupPage />} />
          <Route
            path="/student-dashboard"
            element={
              <ProtectedRoute allowedRoles={["student"]} loginPath="/">
                <StudentDashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={["admin"]} loginPath="/admin/login">
                <AdminDashboardPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
