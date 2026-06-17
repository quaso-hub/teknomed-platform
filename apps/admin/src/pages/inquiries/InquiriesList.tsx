import { useEffect, useState } from 'react';
import { getInquiries, updateInquiry, deleteInquiry } from '@teknomed/database';
import { Trash2 } from 'lucide-react';
import type { Inquiry } from '@teknomed/database';

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  new: { label: 'Baru', color: 'bg-yellow-100 text-yellow-700' },
  contacted: { label: 'Sudah Dihubungi', color: 'bg-blue-100 text-blue-700' },
  quoted: { label: 'Sudah Penawaran', color: 'bg-purple-100 text-purple-700' },
  closed: { label: 'Selesai', color: 'bg-green-100 text-green-700' },
};

export default function InquiriesList() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    getInquiries().then(setInquiries).catch(console.error).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleStatusChange = async (id: string, status: Inquiry['status']) => {
    await updateInquiry(id, { status });
    load();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Hapus inquiry ini?')) return;
    await deleteInquiry(id);
    load();
  };

  if (loading) return <div className="text-gray-400">Loading...</div>;

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Inquiry Masuk</h2>
      <div className="space-y-4">
        {inquiries.map((inq) => (
          <div key={inq.id} className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-medium text-gray-800">{inq.name}</h3>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${STATUS_LABELS[inq.status]?.color}`}>
                    {STATUS_LABELS[inq.status]?.label}
                  </span>
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  {inq.company && `${inq.company} · `}
                  {inq.email && `${inq.email} · `}
                  {inq.phone}
                </p>
                <p className="text-sm text-gray-700 mt-2">{inq.message}</p>
                <p className="text-xs text-gray-400 mt-2">
                  {new Date(inq.created_at).toLocaleString('id-ID')}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <select
                  value={inq.status}
                  onChange={(e) => handleStatusChange(inq.id, e.target.value as Inquiry['status'])}
                  className="text-xs border border-gray-300 rounded-lg px-2 py-1 focus:border-[#043962] focus:outline-none"
                >
                  <option value="new">Baru</option>
                  <option value="contacted">Sudah Dihubungi</option>
                  <option value="quoted">Sudah Penawaran</option>
                  <option value="closed">Selesai</option>
                </select>
                <button onClick={() => handleDelete(inq.id)} className="p-1.5 text-gray-400 hover:text-red-600">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
        {inquiries.length === 0 && (
          <div className="text-center text-gray-400 py-12">Belum ada inquiry</div>
        )}
      </div>
    </div>
  );
}
