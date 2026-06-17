export default function Home() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-20">
      <h1 className="text-4xl font-bold text-[#043962] font-['Plus_Jakarta_Sans',sans-serif]">
        PT Teknomed Indo Timur
      </h1>
      <p className="mt-4 text-lg text-gray-600 max-w-2xl">
        Medical Contractor — Konstruksi MEP, HVAC, Instalasi Gas Medis, Modular Operating Theatre
      </p>
      <div className="mt-8 flex gap-4">
        <a href="/catalog" className="px-6 py-3 bg-[#043962] text-white rounded-lg font-medium hover:bg-[#022440] transition-colors">
          Lihat Katalog
        </a>
        <a href="/contact" className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors">
          Hubungi Kami
        </a>
      </div>
    </div>
  );
}
