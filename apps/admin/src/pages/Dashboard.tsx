import { useEffect, useState } from 'react';
import { getAllProducts, getInquiries } from '@teknomed/database';

export default function Dashboard() {
  const [stats, setStats] = useState({ products: 0, inquiries: 0, newInquiries: 0 });

  useEffect(() => {
    Promise.all([getAllProducts(), getInquiries()]).then(([products, inquiries]) => {
      setStats({
        products: products.length,
        inquiries: inquiries.length,
        newInquiries: inquiries.filter((i) => i.status === 'new').length,
      });
    });
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Dashboard</h2>
      <div className="grid grid-cols-3 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <p className="text-sm text-gray-500">Total Produk</p>
          <p className="text-3xl font-bold text-[#043962] mt-1">{stats.products}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <p className="text-sm text-gray-500">Total Inquiry</p>
          <p className="text-3xl font-bold text-[#043962] mt-1">{stats.inquiries}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <p className="text-sm text-gray-500">Inquiry Baru</p>
          <p className="text-3xl font-bold text-yellow-600 mt-1">{stats.newInquiries}</p>
        </div>
      </div>
    </div>
  );
}
