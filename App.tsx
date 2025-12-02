import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import BlogListPage from './pages/BlogListPage';
import BlogPostPage from './pages/BlogPostPage';
import AdminPage from './pages/AdminPage'; // Import AdminPage
import { ThemeProvider } from './contexts/ThemeContext';
import ServicesPage from "./pages/ServicesPage.tsx";
import { AuthProvider } from './auth/AuthProvider';
import { ProtectedRoute } from './auth/ProtectedRoute';
import LoginPage from './auth/LoginPage';
import CookieConsent from "./components/CookieConsent.tsx";
import ContactPage from "./pages/ContactPage.tsx";
import ScrollProgressBar from "./components/ScrollProgressBar.tsx";


function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <AuthProvider>
          <div className="bg-gray-50 dark:bg-neutral-950 text-gray-800 dark:text-neutral-200 min-h-screen antialiased transition-colors duration-300">
            <ScrollProgressBar />

            <Header />
            <main className="pt-20">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/realizacje" element={<BlogListPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/realizacje/:slug" element={<BlogPostPage />} />
                <Route path="/admin" element={<ProtectedRoute><AdminPage /></ProtectedRoute>} /> {/* Add Admin Route */}
                <Route path="/uslugi" element={<ServicesPage />} />
                <Route path="/kontakt" element={<ContactPage />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </AuthProvider>

      </BrowserRouter>
      <CookieConsent />
    </ThemeProvider>
  );
}

export default App;