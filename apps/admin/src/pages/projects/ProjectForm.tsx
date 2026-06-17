import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getProject, createProject, updateProject } from '@teknomed/database';
import { Save, ArrowLeft, Plus, Trash2 } from 'lucide-react';
import { ImageUpload } from '../../components/ImageUpload';
import type { ProjectInsert } from '@teknomed/database';

const emptyProject: ProjectInsert = {
  id: '',
  title: '',
  subtitle: '',
  category: 'Konstruksi',
  area: '',
  year: new Date().getFullYear(),
  scope: [],
  tags: [],
  highlight: '',
  image_url: null,
  map_query: '',
  is_published: false,
  sort_order: 0,
};

export default function ProjectForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [form, setForm] = useState<ProjectInsert>(emptyProject);
  const [saving, setSaving] = useState(false);
  const [newScope, setNewScope] = useState('');
  const [newTag, setNewTag] = useState('');
  const isEdit = !!id;

  useEffect(() => {
    if (id) {
      getProject(id).then((p) => {
        if (p) setForm(p);
      });
    }
  }, [id]);

  const handleSave = async () => {
    if (!form.title) {
      alert('Judul wajib diisi');
      return;
    }
    setSaving(true);
    try {
      if (isEdit) {
        await updateProject(id!, form);
      } else {
        await createProject(form);
      }
      navigate('/projects');
    } catch (err) {
      console.error(err);
      alert('Gagal menyimpan');
    } finally {
      setSaving(false);
    }
  };

  const addScope = () => {
    if (newScope.trim()) {
      setForm({ ...form, scope: [...form.scope, newScope.trim()] });
      setNewScope('');
    }
  };

  const addTag = () => {
    if (newTag.trim()) {
      setForm({ ...form, tags: [...form.tags, newTag.trim()] });
      setNewTag('');
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/projects')} className="p-2 text-gray-400 hover:text-gray-600">
            <ArrowLeft size={20} />
          </button>
          <h2 className="text-2xl font-bold text-gray-800">{isEdit ? 'Edit Proyek' : 'Tambah Proyek'}</h2>
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
        {/* Basic Info */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <h3 className="font-semibold text-gray-800">Informasi Proyek</h3>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Judul</label>
            <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#043962] focus:outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Subjudul</label>
            <input value={form.subtitle ?? ''} onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#043962] focus:outline-none" />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
              <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value as ProjectInsert['category'] })}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#043962] focus:outline-none">
                <option value="Konstruksi">Konstruksi</option>
                <option value="Sales">Sales</option>
                <option value="Maintenance">Maintenance</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Area</label>
              <input value={form.area} onChange={(e) => setForm({ ...form, area: e.target.value })}
                placeholder="Jawa Timur"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#043962] focus:outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tahun</label>
              <input type="number" value={form.year} onChange={(e) => setForm({ ...form, year: Number(e.target.value) })}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#043962] focus:outline-none" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Highlight</label>
            <textarea rows={2} value={form.highlight ?? ''} onChange={(e) => setForm({ ...form, highlight: e.target.value })}
              placeholder="Highlight proyek..."
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#043962] focus:outline-none resize-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Google Maps Query</label>
            <input value={form.map_query ?? ''} onChange={(e) => setForm({ ...form, map_query: e.target.value })}
              placeholder="RSUD Dr. Soetomo, Surabaya"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#043962] focus:outline-none" />
          </div>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={form.is_published} onChange={(e) => setForm({ ...form, is_published: e.target.checked })} className="rounded border-gray-300" />
            <span className="text-sm text-gray-700">Published</span>
          </label>
        </div>

        {/* Image */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <h3 className="font-semibold text-gray-800">Foto Proyek</h3>
          <ImageUpload
            bucket="images"
            path={`projects/${form.id || 'new'}`}
            currentUrl={form.image_url}
            onUpload={(url) => setForm({ ...form, image_url: url })}
            onRemove={() => setForm({ ...form, image_url: null })}
            label="Foto Proyek"
          />
        </div>

        {/* Scope */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <h3 className="font-semibold text-gray-800">Scope Pekerjaan</h3>
          <div className="flex gap-2">
            <input value={newScope} onChange={(e) => setNewScope(e.target.value)} placeholder="e.g. HVAC"
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addScope())}
              className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#043962] focus:outline-none" />
            <button onClick={addScope} className="px-3 py-2 bg-gray-100 text-gray-600 rounded-lg text-sm hover:bg-gray-200">
              <Plus size={16} />
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {form.scope.map((s, i) => (
              <span key={i} className="flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                {s}
                <button onClick={() => setForm({ ...form, scope: form.scope.filter((_, idx) => idx !== i) })}>
                  <Trash2 size={12} className="text-gray-400 hover:text-red-600" />
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Tags */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <h3 className="font-semibold text-gray-800">Tags</h3>
          <div className="flex gap-2">
            <input value={newTag} onChange={(e) => setNewTag(e.target.value)} placeholder="e.g. OR"
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
              className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#043962] focus:outline-none" />
            <button onClick={addTag} className="px-3 py-2 bg-gray-100 text-gray-600 rounded-lg text-sm hover:bg-gray-200">
              <Plus size={16} />
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {form.tags.map((t, i) => (
              <span key={i} className="flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                {t}
                <button onClick={() => setForm({ ...form, tags: form.tags.filter((_, idx) => idx !== i) })}>
                  <Trash2 size={12} className="text-gray-400 hover:text-red-600" />
                </button>
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
