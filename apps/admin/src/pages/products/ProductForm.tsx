import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getProduct, createProduct, updateProduct, uploadFile } from '@teknomed/database';
import { Save, ArrowLeft } from 'lucide-react';
import type { ProductInsert, ProductSpec, MaterialLayer, ProductCategory } from '@teknomed/database';

const CATEGORIES: ProductCategory[] = [
  'Wall Panel', 'Ceiling', 'Doors', 'Surgical', 'Support',
  'HVAC', 'Medical Gas', 'Fixtures', 'Flooring', 'Accessories',
];

const emptyProduct: ProductInsert = {
  id: '',
  name: '',
  category: 'Wall Panel',
  description: '',
  specs: [],
  layers: [],
  camera_presets: [],
  assembled_camera_start: { name: 'iso', position: [120, 80, 100], target: [0, 40, 0] },
  exploded_camera_start: { name: 'iso', position: [180, 120, 140], target: [0, 60, 0] },
  thumbnail_url: null,
  catalog_images: [],
  model_url: null,
  viewer_type: 'procedural',
  is_published: false,
  sort_order: 0,
};

export default function ProductForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [form, setForm] = useState<ProductInsert>(emptyProduct);
  const [saving, setSaving] = useState(false);
  const isEdit = !!id;

  useEffect(() => {
    if (id) {
      getProduct(id).then((p) => {
        if (p) setForm(p);
      });
    }
  }, [id]);

  const handleSave = async () => {
    setSaving(true);
    try {
      if (isEdit) {
        await updateProduct(id!, form);
      } else {
        await createProduct(form);
      }
      navigate('/products');
    } catch (err) {
      console.error(err);
      alert('Gagal menyimpan');
    } finally {
      setSaving(false);
    }
  };

  const addSpec = () => setForm({ ...form, specs: [...form.specs, { label: '', value: '' }] });
  const addLayer = () => setForm({ ...form, layers: [...form.layers, { name: '', material: '', thickness: '' }] });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/products')} className="p-2 text-gray-400 hover:text-gray-600">
            <ArrowLeft size={20} />
          </button>
          <h2 className="text-2xl font-bold text-gray-800">{isEdit ? 'Edit Produk' : 'Tambah Produk'}</h2>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-4 py-2 bg-[#043962] text-white rounded-lg text-sm font-medium hover:bg-[#022440] transition-colors disabled:opacity-50"
        >
          <Save size={16} />
          {saving ? 'Menyimpan...' : 'Simpan'}
        </button>
      </div>

      <div className="space-y-6 max-w-3xl">
        {/* Basic info */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <h3 className="font-semibold text-gray-800">Informasi Dasar</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">ID (slug)</label>
              <input value={form.id} onChange={(e) => setForm({ ...form, id: e.target.value })} disabled={isEdit}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#043962] focus:outline-none disabled:bg-gray-100" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nama Produk</label>
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#043962] focus:outline-none" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
              <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value as ProductCategory })}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#043962] focus:outline-none">
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Urutan</label>
              <input type="number" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: Number(e.target.value) })}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#043962] focus:outline-none" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
            <textarea rows={3} value={form.description ?? ''} onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#043962] focus:outline-none resize-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Thumbnail URL</label>
            <input value={form.thumbnail_url ?? ''} onChange={(e) => setForm({ ...form, thumbnail_url: e.target.value || null })}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#043962] focus:outline-none" />
          </div>
        </div>

        {/* Specs */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-800">Spesifikasi</h3>
            <button onClick={addSpec} className="text-sm text-[#043962] hover:underline">+ Tambah</button>
          </div>
          {form.specs.map((spec: ProductSpec, i: number) => (
            <div key={i} className="grid grid-cols-2 gap-4">
              <input value={spec.label} placeholder="Label" onChange={(e) => {
                const specs = [...form.specs]; specs[i] = { ...specs[i], label: e.target.value }; setForm({ ...form, specs });
              }} className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#043962] focus:outline-none" />
              <input value={spec.value} placeholder="Value" onChange={(e) => {
                const specs = [...form.specs]; specs[i] = { ...specs[i], value: e.target.value }; setForm({ ...form, specs });
              }} className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#043962] focus:outline-none" />
            </div>
          ))}
        </div>

        {/* Layers */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-800">Material Layers</h3>
            <button onClick={addLayer} className="text-sm text-[#043962] hover:underline">+ Tambah</button>
          </div>
          {form.layers.map((layer: MaterialLayer, i: number) => (
            <div key={i} className="grid grid-cols-3 gap-4">
              <input value={layer.name} placeholder="Nama" onChange={(e) => {
                const layers = [...form.layers]; layers[i] = { ...layers[i], name: e.target.value }; setForm({ ...form, layers });
              }} className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#043962] focus:outline-none" />
              <input value={layer.material} placeholder="Material" onChange={(e) => {
                const layers = [...form.layers]; layers[i] = { ...layers[i], material: e.target.value }; setForm({ ...form, layers });
              }} className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#043962] focus:outline-none" />
              <input value={layer.thickness} placeholder="Ketebalan" onChange={(e) => {
                const layers = [...form.layers]; layers[i] = { ...layers[i], thickness: e.target.value }; setForm({ ...form, layers });
              }} className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#043962] focus:outline-none" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
