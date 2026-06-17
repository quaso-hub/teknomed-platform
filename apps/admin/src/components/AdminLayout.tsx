import { Link, useLocation } from 'react-router-dom';
import { signOut } from '@teknomed/database';
import { LayoutDashboard, Package, FolderKanban, MessageSquare, Users, LogOut } from 'lucide-react';

const navItems = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/products', label: 'Produk', icon: Package },
  { to: '/projects', label: 'Proyek', icon: FolderKanban },
  { to: '/inquiries', label: 'Inquiry', icon: MessageSquare },
  { to: '/users', label: 'Users', icon: Users },
];

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();

  const handleLogout = async () => {
    await signOut();
    window.location.href = '/login';
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-[#043962] text-white flex flex-col">
        <div className="p-6">
          <h1 className="font-bold text-lg">Teknomed Admin</h1>
          <p className="text-xs text-blue-200 mt-1">Panel Manajemen</p>
        </div>
        <nav className="flex-1 px-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.to || (item.to !== '/' && location.pathname.startsWith(item.to));
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                  isActive ? 'bg-white/15 text-white' : 'text-blue-200 hover:text-white hover:bg-white/10'
                }`}
              >
                <Icon size={18} />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-3">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-blue-200 hover:text-white hover:bg-white/10 w-full transition-colors"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-8 overflow-auto">
        {children}
      </main>
    </div>
  );
}
