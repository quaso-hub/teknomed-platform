import { Routes, Route, Navigate } from 'react-router-dom';
import { Suspense, lazy, useEffect, useState } from 'react';
import { getSession } from '@teknomed/database';
import { AdminLayout } from './components/AdminLayout';

const Login = lazy(() => import('./pages/Login'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const ProductsList = lazy(() => import('./pages/products/ProductsList'));
const ProductForm = lazy(() => import('./pages/products/ProductForm'));
const InquiriesList = lazy(() => import('./pages/inquiries/InquiriesList'));

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    getSession().then((session) => {
      setAuthenticated(!!session);
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="flex items-center justify-center h-screen text-gray-400">Loading...</div>;
  if (!authenticated) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

export function App() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-screen text-gray-400">Loading...</div>}>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <AdminLayout>
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/products" element={<ProductsList />} />
                  <Route path="/products/new" element={<ProductForm />} />
                  <Route path="/products/:id/edit" element={<ProductForm />} />
                  <Route path="/inquiries" element={<InquiriesList />} />
                </Routes>
              </AdminLayout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </Suspense>
  );
}
