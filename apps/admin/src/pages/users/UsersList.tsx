import { useEffect, useState } from 'react';
import { getUserProfiles, updateUserRole, getCurrentProfile } from '@teknomed/database';
import { Shield, UserCheck } from 'lucide-react';
import type { UserProfile } from '@teknomed/database';

const ROLE_LABELS: Record<string, { label: string; color: string; description: string }> = {
  admin: { label: 'Admin', color: 'bg-red-100 text-red-700', description: 'Full access — CRUD semua data' },
  sales: { label: 'Sales', color: 'bg-blue-100 text-blue-700', description: 'Baca semua data, kelola inquiry' },
  viewer: { label: 'Viewer', color: 'bg-gray-100 text-gray-700', description: 'Read-only akses' },
};

export default function UsersList() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [currentProfile, setCurrentProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      const [profiles, current] = await Promise.all([getUserProfiles(), getCurrentProfile()]);
      setUsers(profiles);
      setCurrentProfile(current);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleRoleChange = async (userId: string, newRole: UserProfile['role']) => {
    if (userId === currentProfile?.id) {
      alert('Tidak bisa mengubah role sendiri');
      return;
    }
    await updateUserRole(userId, newRole);
    load();
  };

  if (loading) return <div className="text-gray-400">Loading...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">User Management</h2>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Shield size={16} />
          <span>RBAC — Role-Based Access Control</span>
        </div>
      </div>

      {/* Role explanation */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {Object.entries(ROLE_LABELS).map(([key, role]) => (
          <div key={key} className="bg-white rounded-lg border border-gray-200 p-4">
            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${role.color}`}>
              {role.label}
            </span>
            <p className="text-xs text-gray-500 mt-2">{role.description}</p>
          </div>
        ))}
      </div>

      {/* Users table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left px-4 py-3 font-medium text-gray-600">User</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Email</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Role</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Bergabung</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-t border-gray-100">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-xs font-medium text-gray-600">
                      {(user.full_name ?? user.email)[0].toUpperCase()}
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">{user.full_name ?? '-'}</p>
                      {user.id === currentProfile?.id && (
                        <span className="text-xs text-gray-400">You</span>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-gray-600">{user.email}</td>
                <td className="px-4 py-3">
                  {user.id === currentProfile?.id ? (
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${ROLE_LABELS[user.role]?.color}`}>
                      {ROLE_LABELS[user.role]?.label} (you)
                    </span>
                  ) : (
                    <select
                      value={user.role}
                      onChange={(e) => handleRoleChange(user.id, e.target.value as UserProfile['role'])}
                      className="text-xs border border-gray-300 rounded-lg px-2 py-1 focus:border-[#043962] focus:outline-none"
                    >
                      <option value="admin">Admin</option>
                      <option value="sales">Sales</option>
                      <option value="viewer">Viewer</option>
                    </select>
                  )}
                </td>
                <td className="px-4 py-3 text-gray-500 text-xs">
                  {new Date(user.created_at).toLocaleDateString('id-ID')}
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr><td colSpan={4} className="px-4 py-8 text-center text-gray-400">Belum ada user</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
