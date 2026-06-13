import { useState } from "react";
import {
  Users,
  Search,
  Filter,
  UserPlus,
  MoreVertical,
  Shield,
  MapPin,
  Phone,
  Mail,
  CheckCircle2,
  XCircle,
  X,
  Clock,
  Eye,
  ClipboardList,
  User,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { StatCard } from "@/components/dashboard/StatCard";

interface PlatformUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: "admin" | "supervisor" | "enumerator" | "respondent";
  region: string;
  status: "active" | "inactive" | "pending";
  lastLogin: string;
  surveysAssigned: number;
}

const users: PlatformUser[] = [
  { id: "U001", name: "Dr. Priya Sharma", email: "priya.sharma@mospi.gov.in", phone: "+91 98XXX-XX001", role: "admin", region: "National", status: "active", lastLogin: "Jun 13, 2026", surveysAssigned: 0 },
  { id: "U002", name: "Suresh Babu K.", email: "suresh.babu@mospi.gov.in", phone: "+91 87XXX-XX002", role: "supervisor", region: "Karnataka", status: "active", lastLogin: "Jun 12, 2026", surveysAssigned: 5 },
  { id: "U003", name: "Anjali Menon", email: "anjali.menon@mospi.gov.in", phone: "+91 76XXX-XX003", role: "supervisor", region: "Kerala", status: "active", lastLogin: "Jun 11, 2026", surveysAssigned: 3 },
  { id: "U004", name: "Ravi Teja P.", email: "ravi.teja@field.mospi.gov.in", phone: "+91 99XXX-XX004", role: "enumerator", region: "Bengaluru Urban", status: "active", lastLogin: "Jun 13, 2026", surveysAssigned: 12 },
  { id: "U005", name: "Meera Joshi", email: "meera.joshi@field.mospi.gov.in", phone: "+91 88XXX-XX005", role: "enumerator", region: "Mysuru", status: "active", lastLogin: "Jun 12, 2026", surveysAssigned: 8 },
  { id: "U006", name: "Karthik N.", email: "karthik.n@field.mospi.gov.in", phone: "+91 77XXX-XX006", role: "enumerator", region: "Dharwad", status: "inactive", lastLogin: "May 30, 2026", surveysAssigned: 0 },
  { id: "U007", name: "Deepa R.", email: "deepa.r@field.mospi.gov.in", phone: "+91 66XXX-XX007", role: "enumerator", region: "Raichur", status: "pending", lastLogin: "Never", surveysAssigned: 0 },
  { id: "U008", name: "Ganesh Hegde", email: "ganesh.h@mospi.gov.in", phone: "+91 95XXX-XX008", role: "supervisor", region: "Tamil Nadu", status: "active", lastLogin: "Jun 10, 2026", surveysAssigned: 4 },
  { id: "U009", name: "Lakshmi P.", email: "lakshmi.p@field.mospi.gov.in", phone: "+91 84XXX-XX009", role: "enumerator", region: "Belagavi", status: "active", lastLogin: "Jun 13, 2026", surveysAssigned: 15 },
  { id: "U010", name: "Mahesh Kumar", email: "mahesh.k@field.mospi.gov.in", phone: "+91 73XXX-XX010", role: "enumerator", region: "Shimoga", status: "active", lastLogin: "Jun 11, 2026", surveysAssigned: 6 },
];

const roleConfig: Record<string, { label: string; color: string; bg: string; icon: LucideIcon }> = {
  admin: { label: "Admin", color: "text-purple-700", bg: "bg-purple-50", icon: Shield },
  supervisor: { label: "Supervisor", color: "text-blue-700", bg: "bg-blue-50", icon: Eye },
  enumerator: { label: "Enumerator", color: "text-amber-700", bg: "bg-amber-50", icon: ClipboardList },
  respondent: { label: "Respondent", color: "text-emerald-700", bg: "bg-emerald-50", icon: User },
};

const statusStyles: Record<string, { label: string; color: string; bg: string }> = {
  active: { label: "Active", color: "text-emerald-700", bg: "bg-emerald-50" },
  inactive: { label: "Inactive", color: "text-gray-600", bg: "bg-gray-100" },
  pending: { label: "Pending Approval", color: "text-amber-700", bg: "bg-amber-50" },
};

export default function UserManagement() {
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);

  const admins = users.filter(u => u.role === "admin").length;
  const supervisors = users.filter(u => u.role === "supervisor").length;
  const enumerators = users.filter(u => u.role === "enumerator").length;
  const pendingApprovals = users.filter(u => u.status === "pending").length;

  const filtered = users.filter(u => {
    const matchesRole = roleFilter === "all" || u.role === roleFilter;
    const matchesSearch = u.name.toLowerCase().includes(searchQuery.toLowerCase()) || u.email.toLowerCase().includes(searchQuery.toLowerCase()) || u.region.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesRole && matchesSearch;
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="User Management"
        description="Manage platform users, roles, permissions, and regional assignments."
      />

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Administrators" value={admins} icon={Shield} iconColor="#7c3aed" iconBg="#f5f3ff" />
        <StatCard label="Supervisors" value={supervisors} icon={Users} iconColor="#2563eb" iconBg="#eff6ff" />
        <StatCard label="Enumerators" value={enumerators} icon={Users} iconColor="#f59e0b" iconBg="#fffbeb" />
        <StatCard label="Pending Approvals" value={pendingApprovals} icon={Users} iconColor="#ef4444" iconBg="#fef2f2" trend={pendingApprovals > 0 ? { value: "Needs action", direction: "down" } : undefined} />
      </div>

      {/* User Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 flex-wrap">
            <Filter className="h-4 w-4 text-gray-400" />
            {["all", "admin", "supervisor", "enumerator"].map(f => (
              <button
                key={f}
                onClick={() => setRoleFilter(f)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                  roleFilter === f 
                    ? "bg-[#1e3a8a] text-white" 
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {f === "all" ? "All Roles" : roleConfig[f]?.label || f}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <div className="relative w-full sm:w-56">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search users..."
                className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:border-[#1e3a8a] bg-white"
              />
            </div>
            <button 
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-1.5 px-4 py-2 bg-[#1e3a8a] text-white text-xs font-bold rounded-lg hover:bg-[#1e3a8a]/90 transition-colors shrink-0"
            >
              <UserPlus className="h-3.5 w-3.5" /> Add User
            </button>
          </div>
        </div>

        {/* Table Header */}
        <div className="hidden sm:grid grid-cols-[1fr_1fr_120px_120px_100px_60px] gap-4 px-4 py-3 border-b border-gray-100 bg-slate-50/80 text-[10px] font-bold text-gray-500 uppercase tracking-wider">
          <span>User</span>
          <span>Contact</span>
          <span>Role</span>
          <span>Region</span>
          <span>Status</span>
          <span></span>
        </div>

        {/* User Rows */}
        <div className="divide-y divide-gray-100">
          {filtered.map(u => {
            const role = roleConfig[u.role];
            const status = statusStyles[u.status];
            return (
              <div key={u.id} className="grid grid-cols-1 sm:grid-cols-[1fr_1fr_120px_120px_100px_60px] gap-3 sm:gap-4 items-center p-4 hover:bg-slate-50/50 transition-colors">
                {/* User info */}
                <div className="flex items-center gap-3">
                  <div className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold shrink-0 ${role.bg} ${role.color}`}>
                    {u.name.split(" ").map(n => n[0]).join("").substring(0, 2)}
                  </div>
                  <div>
                    <span className="text-sm font-bold text-gray-900 block">{u.name}</span>
                    <span className="text-xs text-gray-400">ID: {u.id} · Last login: {u.lastLogin}</span>
                  </div>
                </div>

                {/* Contact */}
                <div className="text-xs text-gray-600 space-y-0.5">
                  <div className="flex items-center gap-1"><Mail className="h-3 w-3 text-gray-400" /> {u.email}</div>
                  <div className="flex items-center gap-1"><Phone className="h-3 w-3 text-gray-400" /> {u.phone}</div>
                </div>

                {/* Role */}
                <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold w-fit ${role.bg} ${role.color}`}>
                  <role.icon className="h-3.5 w-3.5" /> {role.label}
                </span>

                {/* Region */}
                <span className="flex items-center gap-1 text-xs text-gray-600 font-medium">
                  <MapPin className="h-3 w-3 text-gray-400" /> {u.region}
                </span>

                {/* Status */}
                <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold w-fit ${status.bg} ${status.color}`}>
                  {u.status === "active" ? <CheckCircle2 className="h-3.5 w-3.5" /> : u.status === "inactive" ? <XCircle className="h-3.5 w-3.5" /> : <Clock className="h-3.5 w-3.5" />}
                  {status.label}
                </span>

                {/* Actions */}
                <div className="flex items-center justify-end">
                  {u.status === "pending" ? (
                    <button className="text-[10px] font-bold px-2.5 py-1 bg-emerald-500 text-white rounded-md hover:bg-emerald-600">Approve</button>
                  ) : (
                    <button className="p-1.5 text-gray-400 hover:text-gray-700 rounded-lg hover:bg-gray-100 transition-colors">
                      <MoreVertical className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 bg-slate-50 flex items-center justify-between text-xs text-gray-500">
          <span>Showing {filtered.length} of {users.length} users</span>
          <span className="font-bold text-[#1e3a8a]">{users.filter(u => u.status === "active").length} active users</span>
        </div>
      </div>

      {/* Add User Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden border border-gray-200">
            <div className="bg-[#1e3a8a] p-5 text-white flex justify-between items-center">
              <div>
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <UserPlus className="h-5 w-5 text-blue-200" /> Add New User
                </h3>
                <p className="text-blue-100 text-xs mt-0.5">Create a new user account and assign permissions.</p>
              </div>
              <button onClick={() => setShowAddModal(false)} className="text-white/70 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">Full Name</label>
                <input type="text" placeholder="Enter full name" className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2.5 outline-none focus:border-[#1e3a8a]" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">Email Address</label>
                <input type="email" placeholder="name@mospi.gov.in" className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2.5 outline-none focus:border-[#1e3a8a]" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">Phone Number</label>
                <input type="tel" placeholder="+91 XXXXX-XXXXX" className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2.5 outline-none focus:border-[#1e3a8a]" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1">Role</label>
                  <select className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2.5 outline-none focus:border-[#1e3a8a] bg-white">
                    <option value="">Select role</option>
                    <option value="admin">Admin</option>
                    <option value="supervisor">Supervisor</option>
                    <option value="enumerator">Enumerator</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1">Region</label>
                  <select className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2.5 outline-none focus:border-[#1e3a8a] bg-white">
                    <option value="">Select region</option>
                    <option value="national">National</option>
                    <option value="karnataka">Karnataka</option>
                    <option value="tamil_nadu">Tamil Nadu</option>
                    <option value="kerala">Kerala</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button onClick={() => setShowAddModal(false)} className="px-4 py-2 text-sm font-bold text-gray-600 hover:bg-gray-100 rounded-lg">Cancel</button>
                <button onClick={() => setShowAddModal(false)} className="bg-[#1e3a8a] text-white px-5 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-[#1e3a8a]/90 transition-all">
                  <UserPlus className="h-4 w-4" /> Create User
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
