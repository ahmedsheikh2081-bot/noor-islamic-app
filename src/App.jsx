import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Navbar from "./Component/Navbar";
import Footer from "./Component/Footer";
import ProtectedRoute from "./Component/ProtectedRoute";

import Home from "./pages/Home";
import Quran from "./pages/Quran";
import Hadith from "./pages/Hadith";
import Duas from "./pages/Duas";
import Tasbeeh from "./pages/Tasbeeh";
import Bookmarks from "./pages/Bookmarks";
import SurahDetail from "./pages/SurahDetail";
import SearchResults from "./pages/SearchResults";
import Qibla from "./pages/Qibla";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import VerifyEmail from "./pages/VerifyEmail";

import Dashboard from "./pages/Dashboard";
import AccountSettings from "./pages/AccountSettings";

function App() {
  return (
    <BrowserRouter>
      {/* ================= NAVBAR ================= */}
      <Navbar />

      {/* ================= ROUTES ================= */}
      <Routes>
        {/* ================= PUBLIC PAGES ================= */}

        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/quran"
          element={<Quran />}
        />

        <Route
          path="/quran/:surahNumber"
          element={<SurahDetail />}
        />

        <Route
          path="/hadith"
          element={<Hadith />}
        />

        <Route
          path="/duas"
          element={<Duas />}
        />

        <Route
          path="/tasbeeh"
          element={<Tasbeeh />}
        />

        <Route
          path="/qibla"
          element={<Qibla />}
        />

        <Route
          path="/search"
          element={<SearchResults />}
        />

        {/* ================= AUTHENTICATION ================= */}

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/signup"
          element={<Signup />}
        />

        {/* ================= EMAIL VERIFICATION ================= */}

        <Route
          path="/verify-email"
          element={<VerifyEmail />}
        />

        {/* ================= PROTECTED PAGES ================= */}

        {/* Bookmarks */}
        <Route
          path="/bookmarks"
          element={
            <ProtectedRoute>
              <Bookmarks />
            </ProtectedRoute>
          }
        />

        {/* Dashboard */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* Account Settings */}
        <Route
          path="/account-settings"
          element={
            <ProtectedRoute>
              <AccountSettings />
            </ProtectedRoute>
          }
        />
      </Routes>

      {/* ================= FOOTER ================= */}
      <Footer />

      {/* ================= TOAST ================= */}
      <ToastContainer
        position="top-right"
        autoClose={2500}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        draggable
        theme="light"
      />
    </BrowserRouter>
  );
}

export default App;