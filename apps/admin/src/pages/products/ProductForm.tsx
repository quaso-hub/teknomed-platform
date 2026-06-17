import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getProduct, createProduct, updateProduct } from '@teknomed/database';
import { Save, ArrowLeft, Plus, Trash2 } from 'lucide-react';
import { ImageUpload } from '../../components/ImageUpload';
import { ModelUpload } from '../../components/ModelUpload';
import type { ProductInsert, ProductSpec, MaterialLayer, ProductCategory, CameraPreset } from '@teknomed/database';

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
    if (!form.id || !form.name) {
      alert('ID dan Nama wajib diisi');
      return;
    }
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
  const removeSpec = (i: number) => setForm({ ...form, specs: form.specs.filter((_, idx) => idx !== i) });

  const addLayer = () => setForm({ ...form, layers: [...form.layers, { name: '', material: '', thickness: '' }] });
  const removeLayer = (i: number) => setForm({ ...form, layers: form.layers.filter((_, idx) => idx !== i) });

  const addPreset = () => setForm({
    ...form,
    camera_presets: [...form.camera_presets, { name: '', position: [0, 0, 0], target: [0, 0, 0] }],
  });
  const removePreset = (i: number) => setForm({
    ...form,
    camera_presets: form.camera_presets.filter((_, idx) => idx !== i),
  });

  return (
    <div>
      {/* Header */}
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
        {/* ── Basic Info ── */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <h3 className="font-semibold text-gray-800">Informasi Dasar</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">ID (slug)</label>
              <input
                value={form.id}
                onChange={(e) => setForm({ ...form, id: e.target.value })}
                disabled={isEdit}
                placeholder="pacs-cabinet"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#043962] focus:outline-none disabled:bg-gray-100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nama Produk</label>
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="PACS Cabinet SUS 304"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#043962] focus:outline-none"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value as ProductCategory })}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#043962] focus:outline-none"
              >
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Urutan</label>
              <input
                type="number"
                value={form.sort_order}
                onChange={(e) => setForm({ ...form, sort_order: Number(e.target.value) })}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#043962] focus:outline-none"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
            <textarea
              rows={3}
              value={form.description ?? ''}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Deskripsi produk..."
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#043962] focus:outline-none resize-none"
            />
          </div>
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={form.is_published}
                onChange={(e) => setForm({ ...form, is_published: e.target.checked })}
                className="rounded border-gray-300"
              />
              <span className="text-sm text-gray-700">Published</span>
            </label>
          </div>
        </div>

        {/* ── Media ── */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <h3 className="font-semibold text-gray-800">Media</h3>

          <ImageUpload
            bucket="images"
            path={`products/${form.id || 'new'}`}
            currentUrl={form.thumbnail_url}
            onUpload={(url) => setForm({ ...form, thumbnail_url: url })}
            onRemove={() => setForm({ ...form, thumbnail_url: null })}
            label="Thumbnail"
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Viewer Type</label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  value="procedural"
                  checked={form.viewer_type === 'procedural'}
                  onChange={() => setForm({ ...form, viewer_type: 'procedural' })}
                />
                <span className="text-sm text-gray-700">Procedural (kode)</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  value="glb"
                  checked={form.viewer_type === 'glb'}
                  onChange={() => setForm({ ...form, viewer_type: 'glb' })}
                />
                <span className="text-sm text-gray-700">GLB Model</span>
              </label>
            </div>
          </div>

          {form.viewer_type === 'glb' && (
            <ModelUpload
              currentUrl={form.model_url}
              onUpload={(url) => setForm({ ...form, model_url: url })}
              onRemove={() => setForm({ ...form, model_url: null })}
            />
          )}
        </div>

        {/* ── Specs ── */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-800">Spesifikasi</h3>
            <button onClick={addSpec} className="flex items-center gap-1 text-sm text-[#043962] hover:underline">
              <Plus size={14} /> Tambah
            </button>
          </div>
          {form.specs.map((spec: ProductSpec, i: number) => (
            <div key={i} className="grid grid-cols-[1fr_1fr_auto] gap-3 items-center">
              <input
                value={spec.label}
                placeholder="Label (e.g. Dimensi)"
                onChange={(e) => {
                  const specs = [...form.specs]; specs[i] = { ...specs[i], label: e.target.value }; setForm({ ...form, specs });
                }}
                className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#043962] focus:outline-none"
              />
              <input
                value={spec.value}
                placeholder="Value (e.g. 1200×2000×400 mm)"
                onChange={(e) => {
                  const specs = [...form.specs]; specs[i] = { ...specs[i], value: e.target.value }; setForm({ ...form, specs });
                }}
                className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#043962] focus:outline-none"
              />
              <button onClick={() => removeSpec(i)} className="p-2 text-gray-400 hover:text-red-600">
                <Trash2 size={16} />
              </button>
            </div>
          ))}
          {form.specs.length === 0 && (
            <p className="text-sm text-gray-400">Belum ada spesifikasi</p>
          )}
        </div>

        {/* ── Layers ── */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-800">Material Layers</h3>
            <button onClick={addLayer} className="flex items-center gap-1 text-sm text-[#043962] hover:underline">
              <Plus size={14} /> Tambah
            </button>
          </div>
          {form.layers.map((layer: MaterialLayer, i: number) => (
            <div key={i} className="grid grid-cols-[1fr_1fr_1fr_auto] gap-3 items-center">
              <input
                value={layer.name}
                placeholder="Nama"
                onChange={(e) => {
                  const layers = [...form.layers]; layers[i] = { ...layers[i], name: e.target.value }; setForm({ ...form, layers });
                }}
                className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#043962] focus:outline-none"
              />
              <input
                value={layer.material}
                placeholder="Material"
                onChange={(e) => {
                  const layers = [...form.layers]; layers[i] = { ...layers[i], material: e.target.value }; setForm({ ...form, layers });
                }}
                className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#043962] focus:outline-none"
              />
              <input
                value={layer.thickness}
                placeholder="Ketebalan"
                onChange={(e) => {
                  const layers = [...form.layers]; layers[i] = { ...layers[i], thickness: e.target.value }; setForm({ ...form, layers });
                }}
                className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#043962] focus:outline-none"
              />
              <button onClick={() => removeLayer(i)} className="p-2 text-gray-400 hover:text-red-600">
                <Trash2 size={16} />
              </button>
            </div>
          ))}
          {form.layers.length === 0 && (
            <p className="text-sm text-gray-400">Belum ada material layers</p>
          )}
        </div>

        {/* ── Camera Presets ── */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-800">Camera Presets</h3>
            <button onClick={addPreset} className="flex items-center gap-1 text-sm text-[#043962] hover:underline">
              <Plus size={14} /> Tambah
            </button>
          </div>
          {form.camera_presets.map((preset: CameraPreset, i: number) => (
            <div key={i} className="grid grid-cols-[1fr_1fr_1fr_auto] gap-3 items-end">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Nama</label>
                <input
                  value={preset.name}
                  placeholder="front / side / iso"
                  onChange={(e) => {
                    const p = [...form.camera_presets]; p[i] = { ...p[i], name: e.target.value }; setForm({ ...form, camera_presets: p });
                  }}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#043962] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Position (x,y,z)</label>
                <input
                  value={preset.position.join(',')}
                  placeholder="120,80,100"
                  onChange={(e) => {
                    const p = [...form.camera_presets];
                    p[i] = { ...p[i], position: e.target.value.split(',').map(Number) as [number, number, number] };
                    setForm({ ...form, camera_presets: p });
                  }}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#043962] focus:outline-none font-mono"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Target (x,y,z)</label>
                <input
                  value={preset.target.join(',')}
                  placeholder="0,40,0"
                  onChange={(e) => {
                    const p = [...form.camera_presets];
                    p[i] = { ...p[i], target: e.target.value.split(',').map(Number) as [number, number, number] };
                    setForm({ ...form, camera_presets: p });
                  }}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#043962] focus:outline-none font-mono"
                />
              </div>
              <button onClick={() => removePreset(i)} className="p-2 text-gray-400 hover:text-red-600">
                <Trash2 size={16} />
              </button>
            </div>
          ))}
          {form.camera_presets.length === 0 && (
            <p className="text-sm text-gray-400">Belum ada camera presets</p>
          )}
        </div>
      </div>
    </div>
  );
}
