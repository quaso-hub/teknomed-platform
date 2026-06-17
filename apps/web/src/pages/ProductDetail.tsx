import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getProduct } from '@teknomed/database';
import { ProductSpecTable, MaterialLayers } from '@teknomed/viewers';
import type { Product } from '@teknomed/database';

export default function ProductDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'3d' | 'catalog'>('3d');

  useEffect(() => {
    if (!slug) return;
    getProduct(slug)
      .then(setProduct)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <div className="flex items-center justify-center h-96 text-gray-400">Loading...</div>;
  if (!product) return <div className="flex items-center justify-center h-96 text-gray-400">Produk tidak ditemukan</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-[#043962]">{product.name}</h1>
          <p className="text-gray-500">{product.category}</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setView('3d')}
            className={`px-4 py-2 text-sm rounded-lg ${view === '3d' ? 'bg-[#043962] text-white' : 'bg-gray-100 text-gray-600'}`}
          >
            3D View
          </button>
          <button
            onClick={() => setView('catalog')}
            className={`px-4 py-2 text-sm rounded-lg ${view === 'catalog' ? 'bg-[#043962] text-white' : 'bg-gray-100 text-gray-600'}`}
          >
            Catalog View
          </button>
        </div>
      </div>

      {view === '3d' ? (
        <div className="aspect-video bg-gray-100 rounded-xl flex items-center justify-center text-gray-400">
          3D Viewer — {product.name}
          <br />
          <span className="text-xs">(Phase 3: migrate viewer dari 3dproductcatalog)</span>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="rounded-xl border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-800 mb-4">Spesifikasi Teknis</h3>
              <ProductSpecTable specs={product.specs} />
            </div>
            <div className="rounded-xl border border-gray-200 p-6">
              <MaterialLayers layers={product.layers} />
            </div>
          </div>
          <div className="space-y-4">
            {product.description && (
              <div className="rounded-xl border border-gray-200 p-6">
                <h3 className="font-semibold text-gray-800 mb-2">Deskripsi</h3>
                <p className="text-sm text-gray-600">{product.description}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
