import { HashRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import BlogListPage from './pages/BlogListPage';
import BlogPostPage from './pages/BlogPostPage';
import AdminPage from './pages/AdminPage'; // Import AdminPage
import { ThemeProvider } from './contexts/ThemeContext';

function App() {
  return (
    <ThemeProvider>
      <HashRouter>
        <div className="bg-gray-50 dark:bg-neutral-950 text-gray-800 dark:text-neutral-200 min-h-screen antialiased transition-colors duration-300">
          <Header />
          <main className="pt-20">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/insights" element={<BlogListPage />} />
              <Route path="/insights/:slug" element={<BlogPostPage />} />
              <Route path="/admin" element={<AdminPage />} /> {/* Add Admin Route */}
            </Routes>
          </main>
          <Footer />
        </div>
      </HashRouter>
    </ThemeProvider>
  );
}

export default App;