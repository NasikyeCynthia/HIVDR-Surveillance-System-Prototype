import { NavLink, Navigate, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { LayoutDashboard, Users, UserPlus, DatabaseZap, BrainCircuit, Dna, ClipboardCheck, Baby, BarChart3, LogOut, ShieldCheck, UserCog, Building2 } from "lucide-react";
import { useApp } from "./store.jsx";
import { ROLES, FACILITIES, NO_FACILITY, keyOf } from "./data.js";
import Dashboard from "./pages/Dashboard.jsx";
import { PatientList, PatientProfile, Register } from "./pages/Patients.jsx";
import Integration from "./pages/Integration.jsx";
import Risk from "./pages/Risk.jsx";
import Resistance from "./pages/Resistance.jsx";
import Review from "./pages/Review.jsx";
import Maternal from "./pages/Maternal.jsx";
import Analytics from "./pages/Analytics.jsx";

const NAV = [
  ["dashboard", "/", "Dashboard", LayoutDashboard], ["patients", "/patients", "Patients", Users], ["register", "/patients/new", "Register patient", UserPlus],
  ["integration", "/integration", "Data integration", DatabaseZap], ["risk", "/risk", "Risk assessment", BrainCircuit], ["resistance", "/resistance", "Resistance (HIVDB)", Dna],
  ["review", "/review", "Clinical review", ClipboardCheck], ["maternal", "/maternal", "Maternal and infant", Baby], ["analytics", "/analytics", "Multi-facility analytics", BarChart3],
];

function RoleSimulator() {
  const { user, setUser } = useApp();
  const nav = useNavigate();
  const setRole = (r) => {
    setUser({ role: r, name: ROLES[r].person, facility: NO_FACILITY.includes(r) ? null : user.facility || FACILITIES[0] });
    nav("/");
  };
  return (
    <div className="fixed bottom-4 right-4 z-50 w-64 rounded-xl border border-teal-700 bg-white p-3 shadow-xl">
      <p className="mb-2 flex items-center gap-2 text-xs font-semibold text-teal-800"><UserCog className="h-4 w-4" />Role simulator (demo only)</p>
      <select aria-label="Simulated role" className="mb-2 w-full rounded border border-slate-300 px-2 py-1.5 text-sm" value={user.role} onChange={(e) => setRole(e.target.value)}>
        {Object.entries(ROLES).map(([k, r]) => <option key={k} value={k}>{r.label}</option>)}
      </select>
      <select aria-label="Assigned facility" disabled={NO_FACILITY.includes(user.role)} className="w-full rounded border border-slate-300 px-2 py-1.5 text-sm disabled:bg-slate-100"
        value={user.facility || ""} onChange={(e) => setUser({ ...user, facility: e.target.value })}>
        {NO_FACILITY.includes(user.role) ? <option value="">{user.role === "moh" ? "All facilities (aggregated)" : "System-wide"}</option> : FACILITIES.map((f) => <option key={f}>{f}</option>)}
      </select>
    </div>
  );
}

export default function Shell() {
  const { user, setUser, role } = useApp();
  const { pathname } = useLocation();
  if (!role.nav.includes(keyOf(pathname))) return <Navigate to="/" replace />;
  return (
    <div className="min-h-screen">
      <aside className="fixed inset-y-0 left-0 flex w-60 flex-col bg-navy-900 text-slate-200 max-md:w-16">
        <div className="flex items-center gap-2 px-4 py-5 text-white"><ShieldCheck className="h-6 w-6 shrink-0 text-teal-400" /><span className="font-semibold leading-tight max-md:hidden">HIVDR<br />Surveillance</span></div>
        <nav className="flex-1 space-y-1 px-2">
          {NAV.filter(([k]) => role.nav.includes(k)).map(([k, to, label, Icon]) => (
            <NavLink key={k} to={to} end title={label} className={({ isActive }) => `flex items-center gap-3 rounded-lg px-3 py-2 text-sm ${isActive ? "bg-teal-700 text-white" : "hover:bg-navy-800"}`}>
              <Icon className="h-4 w-4 shrink-0" /><span className="max-md:hidden">{label}</span></NavLink>))}
        </nav>
        <div className="border-t border-navy-700 p-4 text-xs max-md:hidden">
          <p className="font-semibold text-white">{user.name}</p><p>{role.label}</p>
          <p className="mt-1 flex items-center gap-1 text-teal-300"><Building2 className="h-3 w-3" />{user.facility || (user.role === "moh" ? "All facilities (aggregated)" : "System-wide")}</p>
          <button onClick={() => setUser(null)} className="mt-3 flex items-center gap-2 text-slate-300 hover:text-white"><LogOut className="h-4 w-4" />Sign out</button>
        </div>
        <button onClick={() => setUser(null)} title="Sign out" className="hidden p-4 text-slate-300 max-md:block"><LogOut className="h-4 w-4" /></button>
      </aside>
      <main className="ml-60 p-8 pb-28 max-md:ml-16 max-md:p-4 max-md:pb-28">
        <Routes>
          <Route index element={<Dashboard />} />
          <Route path="patients" element={<PatientList />} />
          <Route path="patients/new" element={<Register />} />
          <Route path="patients/:id" element={<PatientProfile />} />
          <Route path="integration" element={<Integration />} />
          <Route path="risk" element={<Risk />} />
          <Route path="resistance" element={<Resistance />} />
          <Route path="review" element={<Review />} />
          <Route path="maternal" element={<Maternal />} />
          <Route path="analytics" element={<Analytics />} />
        </Routes>
      </main>
      <RoleSimulator />
    </div>
  );
}
