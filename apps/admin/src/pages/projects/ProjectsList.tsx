import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAllProjects, deleteProject } from '@teknomed/database';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import type { Project } from '@teknomed/database';

export default function ProjectsList() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    getAllProjects().then(setProjects).catch(console.error).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Hapus proyek ini?')) return;
    await deleteProject(id);
    load();
  };

  if (loading) return <div className="text-gray-400">Loading...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Proyek</h2>
        <Link
          to="/projects/new"
          className="flex items-center gap-2 px-4 py-2 bg-[#043962] text-white rounded-lg text-sm font-medium hover:bg-[#022440] transition-colors"
        >
          <Plus size={16} />
          Tambah Proyek
        </Link>
      </div>
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Judul</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Kategori</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Area</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Tahun</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Status</th>
              <th className="text-right px-4 py-3 font-medium text-gray-600">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((p) => (
              <tr key={p.id} className="border-t border-gray-100">
                <td className="px-4 py-3 font-medium text-gray-800">{p.title}</td>
                <td className="px-4 py-3 text-gray-600">{p.category}</td>
                <td className="px-4 py-3 text-gray-600">{p.area}</td>
                <td className="px-4 py-3 text-gray-600">{p.year}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${p.is_published ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                    {p.is_published ? 'Published' : 'Draft'}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-2">
                    <Link to={`/projects/${p.id}/edit`} className="p-1.5 text-gray-400 hover:text-blue-600">
                      <Pencil size={16} />
                    </Link>
                    <button onClick={() => handleDelete(p.id)} className="p-1.5 text-gray-400 hover:text-red-600">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {projects.length === 0 && (
              <tr><td colSpan={6} className="px-4 py-8 text-center text-gray-400">Belum ada proyek</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
