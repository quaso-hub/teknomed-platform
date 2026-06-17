import { Routes, Route } from 'react-router-dom';
import { Suspense, lazy } from 'react';

const Home = lazy(() => import('./pages/Home'));
const Catalog = lazy(() => import('./pages/Catalog'));
const ProductDetail = lazy(() => import('./pages/ProductDetail'));
const Projects = lazy(() => import('./pages/Projects'));
const Contact = lazy(() => import('./pages/Contact'));

export function App() {
  return (
    <div className="min-h-screen bg-white font-['Inter',sans-serif]">
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <a href="/" className="font-['Plus_Jakarta_Sans',sans-serif] font-bold text-lg text-[#043962]">
            Teknomed
          </a>
          <div className="flex items-center gap-6 text-sm">
            <a href="/" className="text-gray-600 hover:text-[#043962]">Home</a>
            <a href="/catalog" className="text-gray-600 hover:text-[#043962]">Katalog</a>
            <a href="/projects" className="text-gray-600 hover:text-[#043962]">Proyek</a>
            <a href="/contact" className="text-gray-600 hover:text-[#043962]">Kontak</a>
          </div>
        </div>
      </nav>
      <main>
        <Suspense fallback={<div className="flex items-center justify-center h-96 text-gray-400">Loading...</div>}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/catalog" element={<Catalog />} />
            <Route path="/catalog/:slug" element={<ProductDetail />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </Suspense>
      </main>
      <footer className="border-t border-gray-100 py-8 text-center text-sm text-gray-500">
        PT Teknomed Indo Timur — Medical Contractor
      </footer>
    </div>
  );
}
