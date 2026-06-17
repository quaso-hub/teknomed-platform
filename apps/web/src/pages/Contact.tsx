import { useState } from 'react';
import { createInquiry } from '@teknomed/database';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', company: '', message: '', product_id: null as string | null });
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    try {
      await createInquiry(form);
      setSent(true);
    } catch (err) {
      console.error(err);
    } finally {
      setSending(false);
    }
  };

  if (sent) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-[#043962]">Terima Kasih</h2>
        <p className="mt-4 text-gray-600">Pesan Anda sudah kami terima. Tim kami akan menghubungi Anda segera.</p>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-[#043962] mb-8">Hubungi Kami</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nama</label>
          <input
            type="text"
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#043962] focus:outline-none focus:ring-1 focus:ring-[#043962]/20"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#043962] focus:outline-none focus:ring-1 focus:ring-[#043962]/20"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Telepon</label>
            <input
              type="tel"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#043962] focus:outline-none focus:ring-1 focus:ring-[#043962]/20"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Perusahaan / Rumah Sakit</label>
          <input
            type="text"
            value={form.company}
            onChange={(e) => setForm({ ...form, company: e.target.value })}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#043962] focus:outline-none focus:ring-1 focus:ring-[#043962]/20"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Pesan</label>
          <textarea
            required
            rows={4}
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#043962] focus:outline-none focus:ring-1 focus:ring-[#043962]/20 resize-none"
          />
        </div>
        <button
          type="submit"
          disabled={sending}
          className="w-full py-3 bg-[#043962] text-white rounded-lg font-medium hover:bg-[#022440] transition-colors disabled:opacity-50"
        >
          {sending ? 'Mengirim...' : 'Kirim Pesan'}
        </button>
      </form>
    </div>
  );
}
