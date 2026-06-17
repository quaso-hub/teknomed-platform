import { useEffect, useState } from 'react';
import { getProjects } from '@teknomed/database';
import type { Project } from '@teknomed/database';

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProjects()
      .then(setProjects)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex items-center justify-center h-96 text-gray-400">Loading...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-[#043962] mb-8">Proyek Kami</h1>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((p) => (
          <div key={p.id} className="rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
            <div className="aspect-video bg-gray-100 flex items-center justify-center text-gray-400">
              {p.image_url ? (
                <img src={p.image_url} alt={p.title} className="w-full h-full object-cover" />
              ) : (
                'Foto Proyek'
              )}
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-gray-800">{p.title}</h3>
              <p className="text-sm text-gray-500">{p.subtitle}</p>
              <div className="mt-2 flex gap-2 flex-wrap">
                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{p.area}</span>
                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{p.year}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
