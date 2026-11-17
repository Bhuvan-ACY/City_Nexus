import React, { useState } from 'react';
import { UserRole } from '../../types/domain.types';
import { Users, UserPlus, Shield } from 'lucide-react';

interface ManagedUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department: string;
  status: 'active' | 'suspended';
  lastLogin: string;
}

const mockUsers: ManagedUser[] = [
  { id: 'usr-001', name: 'Dr. Arjun Rao', email: 'arjun.rao@citynexus.gov', role: 'city_planner', department: 'Urban Mobility & Planning Authority', status: 'active', lastLogin: '10 mins ago' },
  { id: 'usr-002', name: 'Sneha Kulkarni', email: 'sneha.k@bescom.gov', role: 'grid_operator', department: 'State Electricity Supply Corp', status: 'active', lastLogin: '2 mins ago' },
  { id: 'usr-003', name: 'Vikram Mehta', email: 'v.mehta@trafficpolice.gov', role: 'traffic_controller', department: 'Metropolitan Traffic Command', status: 'active', lastLogin: '1 hour ago' },
  { id: 'usr-004', name: 'Pooja Iyer', email: 'p.iyer@waterboard.gov', role: 'utility_manager', department: 'Water Supply and Sewerage Board', status: 'active', lastLogin: 'Yesterday' },
  { id: 'usr-005', name: 'Rajesh Varma', email: 'admin@citynexus.gov', role: 'admin', department: 'Municipal IT & Security Division', status: 'active', lastLogin: 'Now' },
];

export const UserManagementView: React.FC = () => {
  const [users, setUsers] = useState<ManagedUser[]>(mockUsers);
  const [filterRole, setFilterRole] = useState<string>('all');
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [newName, setNewName] = useState('');
  const [newRole, setNewRole] = useState<UserRole>('traffic_controller');
  const [newDept, setNewDept] = useState('');

  const handleRoleChange = (userId: string, newRole: UserRole) => {
    setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
  };

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newEmail) return;
    const newUser: ManagedUser = {
      id: `usr-${Date.now().toString().slice(-3)}`,
      name: newName,
      email: newEmail,
      role: newRole,
      department: newDept || 'Municipal Operations',
      status: 'active',
      lastLogin: 'Never',
    };
    setUsers([...users, newUser]);
    setNewName('');
    setNewEmail('');
    setNewDept('');
    setIsInviteOpen(false);
  };

  const filteredUsers = filterRole === 'all' 
    ? users 
    : users.filter(u => u.role === filterRole);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-[#cfd9de] dark:border-slate-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#222222] dark:text-slate-100 flex items-center gap-2.5">
            <Users className="h-7 w-7 text-[#222222] dark:text-purple-400" />
            Personnel & Departmental Access Governance
          </h1>
          <p className="text-sm text-[#71767b] dark:text-slate-400 mt-1">
            Role-Based Access Control: assign operational roles across Traffic, Grid, Water, and Planning departments.
          </p>
        </div>
        <button
          onClick={() => setIsInviteOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#222222] dark:bg-blue-600 hover:bg-[#0a0a0a] dark:hover:bg-blue-700 text-white text-sm font-semibold rounded-lg shadow-sm transition-all"
        >
          <UserPlus className="h-4 w-4" />
          <span>Provision Official User</span>
        </button>
      </div>

      {/* Role Filter & Counter */}
      <div className="flex items-center justify-between bg-white dark:bg-[#111827] border border-[#cfd9de] dark:border-slate-800 p-4 rounded-lg">
        <div className="flex items-center gap-2.5">
          <label className="text-xs font-bold text-[#71767b] dark:text-slate-400 uppercase tracking-wider">Filter Role:</label>
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            aria-label="Filter users by Role"
            className="bg-white dark:bg-slate-800 border border-[#cfd9de] dark:border-slate-700 text-[#222222] dark:text-slate-100 text-sm font-semibold rounded-lg px-3 py-1.5 focus:border-[#222222] dark:focus:border-slate-500 focus:outline-none"
          >
            <option value="all">All Roles ({users.length})</option>
            <option value="city_planner">City Planner</option>
            <option value="traffic_controller">Traffic Controller</option>
            <option value="grid_operator">Grid Operator</option>
            <option value="utility_manager">Utility Manager</option>
            <option value="admin">System Administrator</option>
          </select>
        </div>
        <span className="text-xs sm:text-sm font-mono text-[#71767b] dark:text-slate-400">
          Showing {filteredUsers.length} officers
        </span>
      </div>

      {/* User Table */}
      <div className="bg-white dark:bg-[#111827] border border-[#cfd9de] dark:border-slate-800 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#fafafa] dark:bg-slate-800/80 text-[#71767b] dark:text-slate-400 text-xs uppercase border-b border-[#cfd9de] dark:border-slate-800">
              <tr>
                <th className="py-3 px-4">Officer Name & ID</th>
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4">Department</th>
                <th className="py-3 px-4">Assigned Role</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Last Active</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e8e8e8] dark:divide-slate-800 font-mono text-xs sm:text-sm">
              {filteredUsers.map((u) => (
                <tr key={u.id} className="hover:bg-[#fafafa] dark:hover:bg-slate-800/50 transition-colors">
                  <td className="py-3.5 px-4 font-sans">
                    <div className="font-bold text-[#222222] dark:text-slate-100 text-sm">{u.name}</div>
                    <div className="text-xs font-mono text-[#71767b] dark:text-slate-400">{u.id}</div>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-[#444444] dark:text-slate-300">{u.email}</td>
                  <td className="py-3.5 px-4 font-sans text-[#444444] dark:text-slate-300">{u.department}</td>
                  <td className="py-3.5 px-4 font-sans">
                    <select
                      value={u.role}
                      onChange={(e) => handleRoleChange(u.id, e.target.value as UserRole)}
                      aria-label={`Assigned Role for ${u.name}`}
                      className="bg-white dark:bg-slate-800 border border-[#cfd9de] dark:border-slate-700 text-[#222222] dark:text-slate-100 text-xs sm:text-sm font-semibold rounded-lg px-2.5 py-1.5 focus:border-[#222222] dark:focus:border-slate-500 focus:outline-none"
                    >
                      <option value="city_planner">City Planner</option>
                      <option value="traffic_controller">Traffic Controller</option>
                      <option value="grid_operator">Grid Operator</option>
                      <option value="utility_manager">Utility Manager</option>
                      <option value="admin">System Administrator</option>
                    </select>
                  </td>
                  <td className="py-3.5 px-4 font-sans">
                    <span className="px-2.5 py-0.5 rounded text-xs uppercase font-bold bg-[#e8e8e8] dark:bg-slate-800 text-[#222222] dark:text-slate-200 border border-[#cfd9de] dark:border-slate-700">
                      {u.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-[#71767b] dark:text-slate-400 font-mono text-xs">{u.lastLogin}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Dialog for New User */}
      {isInviteOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-[#111827] border border-[#cfd9de] dark:border-slate-800 rounded-lg max-w-md w-full p-6 space-y-4 shadow-xl">
            <h3 className="text-lg font-bold text-[#222222] dark:text-slate-100 flex items-center gap-2">
              <Shield className="h-5 w-5 text-[#222222] dark:text-slate-200" />
              Provision New Municipal User
            </h3>
            <form onSubmit={handleAddUser} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-[#71767b] dark:text-slate-400 block mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Officer Anita Deshmukh"
                  className="w-full bg-white dark:bg-slate-800 border border-[#cfd9de] dark:border-slate-700 text-[#222222] dark:text-slate-100 text-sm rounded-lg p-2.5 focus:border-[#222222] dark:focus:border-slate-500 focus:outline-none placeholder-[#909090] dark:placeholder-slate-500"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-[#71767b] dark:text-slate-400 block mb-1">Municipal Email</label>
                <input
                  type="email"
                  required
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="anita.d@citynexus.gov"
                  className="w-full bg-white dark:bg-slate-800 border border-[#cfd9de] dark:border-slate-700 text-[#222222] dark:text-slate-100 text-sm rounded-lg p-2.5 focus:border-[#222222] dark:focus:border-slate-500 focus:outline-none placeholder-[#909090] dark:placeholder-slate-500"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-[#71767b] dark:text-slate-400 block mb-1">Department</label>
                <input
                  type="text"
                  value={newDept}
                  onChange={(e) => setNewDept(e.target.value)}
                  placeholder="Electrical Supply Agency"
                  className="w-full bg-white dark:bg-slate-800 border border-[#cfd9de] dark:border-slate-700 text-[#222222] dark:text-slate-100 text-sm rounded-lg p-2.5 focus:border-[#222222] dark:focus:border-slate-500 focus:outline-none placeholder-[#909090] dark:placeholder-slate-500"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-[#71767b] dark:text-slate-400 block mb-1">Authority Role</label>
                <select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value as UserRole)}
                  className="w-full bg-white dark:bg-slate-800 border border-[#cfd9de] dark:border-slate-700 text-[#222222] dark:text-slate-100 text-sm rounded-lg p-2.5 focus:border-[#222222] dark:focus:border-slate-500 focus:outline-none"
                >
                  <option value="city_planner">City Planner (Cross-Domain)</option>
                  <option value="traffic_controller">Traffic Controller (Mobility)</option>
                  <option value="grid_operator">Grid Operator (Power Grid)</option>
                  <option value="utility_manager">Utility Manager (Public Water)</option>
                  <option value="admin">System Administrator (Full)</option>
                </select>
              </div>
              <div className="flex justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setIsInviteOpen(false)}
                  className="px-4 py-2 bg-white dark:bg-slate-800 hover:bg-[#e8e8e8]/50 dark:hover:bg-slate-700 border border-[#cfd9de] dark:border-slate-700 text-[#444444] dark:text-slate-300 text-sm font-semibold rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#222222] dark:bg-blue-600 hover:bg-[#0a0a0a] dark:hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-colors"
                >
                  Confirm Provisioning
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
