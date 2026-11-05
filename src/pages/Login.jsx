import { useState } from "react";
import { Lock, ShieldCheck } from "lucide-react";
import { useApp } from "../store.jsx";
import { ROLES, FACILITIES, NO_FACILITY } from "../data.js";
import { Field, inp, btn } from "../ui.jsx";

export default function Login() {
  const { setUser } = useApp();
  const [f, setF] = useState({ username: "", password: "", role: "doctor", facility: FACILITIES[0] });
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  const fixed = NO_FACILITY.includes(f.role);
  const submit = (e) => { e.preventDefault(); setUser({ role: f.role, name: ROLES[f.role].person, facility: fixed ? null : f.facility }); };
  return (
    <div className="grid min-h-screen md:grid-cols-2">
      <div className="flex flex-col justify-center bg-navy-900 p-10 text-white">
        <ShieldCheck className="mb-4 h-10 w-10 text-teal-400" />
        <h1 className="text-3xl font-semibold">HIV Drug Resistance Surveillance</h1>
        <p className="mt-3 max-w-md text-slate-300">Routine monitoring, risk identification and confirmed resistance tracking for health facilities in Uganda and the Ministry of Health.</p>
        <p className="mt-8 flex items-center gap-2 text-sm text-teal-300"><Lock className="h-4 w-4" />Access is facility-based and audited.</p>
      </div>
      <div className="flex items-center justify-center p-6">
        <form onSubmit={submit} className="w-full max-w-sm space-y-4 rounded-xl border border-slate-200 bg-white p-7 shadow-sm">
          <h2 className="text-xl font-semibold text-navy-900">Sign in</h2>
          <Field label="Username"><input className={inp} value={f.username} onChange={set("username")} autoComplete="username" required /></Field>
          <Field label="Password"><input type="password" className={inp} value={f.password} onChange={set("password")} autoComplete="current-password" required /></Field>
          <Field label="Role (simulated)"><select className={inp} value={f.role} onChange={set("role")}>{Object.entries(ROLES).map(([k, r]) => <option key={k} value={k}>{r.label}</option>)}</select></Field>
          <Field label="Assigned facility (simulated)"><select className={`${inp} disabled:bg-slate-100`} disabled={fixed} value={fixed ? "" : f.facility} onChange={set("facility")}>
            {fixed ? <option value="">{f.role === "moh" ? "All facilities (aggregated only)" : "System-wide (no patient records)"}</option> : FACILITIES.map((x) => <option key={x}>{x}</option>)}</select></Field>
          <button className={`${btn} w-full justify-center`}>Sign in</button>
          <p className="text-xs text-slate-500">Accounts are created by system administrators. There is no public registration. Prototype: any username and password work.</p>
        </form>
      </div>
    </div>
  );
}
