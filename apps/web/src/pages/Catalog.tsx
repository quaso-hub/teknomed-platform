import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getProducts } from '@teknomed/database';
import type { Product } from '@teknomed/database';

export default function Catalog() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'gallery' | 'list'>('gallery');

  useEffect(() => {
    getProducts()
      .then(setProducts)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex items-center justify-center h-96 text-gray-400">Loading...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-[#043962]">Katalog Produk</h1>
        <div className="flex gap-2">
          <button
            onClick={() => setView('gallery')}
            className={`px-4 py-2 text-sm rounded-lg ${view === 'gallery' ? 'bg-[#043962] text-white' : 'bg-gray-100 text-gray-600'}`}
          >
            3D Gallery
          </button>
          <button
            onClick={() => setView('list')}
            className={`px-4 py-2 text-sm rounded-lg ${view === 'list' ? 'bg-[#043962] text-white' : 'bg-gray-100 text-gray-600'}`}
          >
            Catalog List
          </button>
        </div>
      </div>

      {view === 'gallery' ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map((p) => (
            <Link key={p.id} to={`/catalog/${p.id}`} className="group block rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-square bg-gray-100 flex items-center justify-center text-gray-400 text-sm">
                {p.thumbnail_url ? (
                  <img src={p.thumbnail_url} alt={p.name} className="w-full h-full object-cover" />
                ) : (
                  '3D Preview'
                )}
              </div>
              <div className="p-3">
                <h3 className="font-medium text-sm text-gray-800 group-hover:text-[#043962]">{p.name}</h3>
                <p className="text-xs text-gray-500">{p.category}</p>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="border border-gray-200 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Produk</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Kategori</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Spesifikasi</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id} className="border-t border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <Link to={`/catalog/${p.id}`} className="font-medium text-[#043962] hover:underline">{p.name}</Link>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{p.category}</td>
                  <td className="px-4 py-3 text-gray-500 text-xs">
                    {p.specs?.slice(0, 3).map(s => s.value).join(' / ')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
