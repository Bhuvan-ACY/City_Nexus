import React, { useState } from 'react';
import { useCityNexusStore } from '../../stores/useCityNexusStore';
import { UserRole } from '../../types/domain.types';
import { Users, UserPlus, Shield, CheckCircle, Mail, Building2 } from 'lucide-react';

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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <Users className="h-6 w-6 text-blue-500" />
            Personnel & Departmental Access Governance
          </h1>
          <p className="text-sm text-neutral-400">
            RBAC enforcement: assign municipal operational roles across Traffic, Grid, Water, and Planning departments.
          </p>
        </div>
        <button
          onClick={() => setIsInviteOpen(true)}
          className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-md shadow-sm transition-colors"
        >
          <UserPlus className="h-4 w-4" />
          Provision Official User
        </button>
      </div>

      {/* Role Filter & Counter */}
      <div className="flex items-center justify-between bg-neutral-900/60 border border-neutral-800 p-4 rounded-xl">
        <div className="flex items-center gap-2">
          <label className="text-xs text-neutral-400 font-medium">Filter by Role:</label>
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            aria-label="Filter users by Role"
            className="bg-neutral-800 border border-neutral-700 text-neutral-200 text-xs rounded-md px-3 py-1.5 focus:border-blue-500 focus:outline-none"
          >
            <option value="all">All Roles ({users.length})</option>
            <option value="city_planner">City Planner</option>
            <option value="traffic_controller">Traffic Controller</option>
            <option value="grid_operator">Grid Operator</option>
            <option value="utility_manager">Utility Manager</option>
            <option value="admin">System Administrator</option>
          </select>
        </div>
        <span className="text-xs text-neutral-400">
          Showing {filteredUsers.length} authorized officers
        </span>
      </div>

      {/* User Table */}
      <div className="bg-neutral-900/60 border border-neutral-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-neutral-300">
            <thead className="text-[11px] text-neutral-400 bg-neutral-800/50 uppercase border-b border-neutral-800">
              <tr>
                <th className="py-3 px-4">Officer Name & ID</th>
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4">Department</th>
                <th className="py-3 px-4">Assigned Role</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Last Active</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/60">
              {filteredUsers.map((u) => (
                <tr key={u.id} className="hover:bg-neutral-800/30 transition-colors">
                  <td className="py-3 px-4">
                    <div className="font-semibold text-white">{u.name}</div>
                    <div className="text-[11px] font-mono text-neutral-500">{u.id}</div>
                  </td>
                  <td className="py-3 px-4 font-mono text-neutral-400">{u.email}</td>
                  <td className="py-3 px-4 text-neutral-300">{u.department}</td>
                  <td className="py-3 px-4">
                    <select
                      value={u.role}
                      onChange={(e) => handleRoleChange(u.id, e.target.value as UserRole)}
                      aria-label={`Assigned Role for ${u.name}`}
                      className="bg-neutral-800 border border-neutral-700 text-neutral-200 text-xs rounded px-2.5 py-1 focus:border-blue-500 focus:outline-none"
                    >
                      <option value="city_planner">City Planner</option>
                      <option value="traffic_controller">Traffic Controller</option>
                      <option value="grid_operator">Grid Operator</option>
                      <option value="utility_manager">Utility Manager</option>
                      <option value="admin">System Administrator</option>
                    </select>
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded text-[10px] uppercase font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                      {u.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-neutral-400">{u.lastLogin}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal / Dialog for New User */}
      {isInviteOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl max-w-md w-full p-6 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Shield className="h-5 w-5 text-blue-500" />
              Provision New Municipal User
            </h3>
            <form onSubmit={handleAddUser} className="space-y-4">
              <div>
                <label className="text-xs text-neutral-400 block mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Officer Anita Deshmukh"
                  className="w-full bg-neutral-800 border border-neutral-700 text-neutral-200 text-xs rounded-md p-2.5 focus:border-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="text-xs text-neutral-400 block mb-1">Official Municipal Email</label>
                <input
                  type="email"
                  required
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="anita.d@citynexus.gov"
                  className="w-full bg-neutral-800 border border-neutral-700 text-neutral-200 text-xs rounded-md p-2.5 focus:border-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="text-xs text-neutral-400 block mb-1">Department / Agency</label>
                <input
                  type="text"
                  value={newDept}
                  onChange={(e) => setNewDept(e.target.value)}
                  placeholder="e.g. Electrical Transmission Agency"
                  className="w-full bg-neutral-800 border border-neutral-700 text-neutral-200 text-xs rounded-md p-2.5 focus:border-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="text-xs text-neutral-400 block mb-1">Role & Authority</label>
                <select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value as UserRole)}
                  className="w-full bg-neutral-800 border border-neutral-700 text-neutral-200 text-xs rounded-md p-2.5 focus:border-blue-500 focus:outline-none"
                >
                  <option value="city_planner">City Planner (Full Cross-Domain Simulation)</option>
                  <option value="traffic_controller">Traffic Controller (Signals & Mobility)</option>
                  <option value="grid_operator">Grid Operator (Substations & Dispatch)</option>
                  <option value="utility_manager">Utility Manager (Pumps & Water Reserves)</option>
                  <option value="admin">System Administrator (Global Governance)</option>
                </select>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsInviteOpen(false)}
                  className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs rounded-md transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-md transition-colors"
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
