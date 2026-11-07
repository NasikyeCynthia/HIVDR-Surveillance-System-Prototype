import { useState } from "react";
import { ShieldCheck } from "lucide-react";
import { useApp } from "../store.jsx";
import { ROLES, FACILITIES } from "../data.js";
import { Field, inp, btn } from "../ui.jsx";

export default function Login() {
  const { setUser } = useApp();
  const [f, setF] = useState({ username: "", password: "" });
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  // Prototype: everyone signs in as a Doctor at Kampala Clinic. Switch with the Role simulator afterwards.
  const submit = (e) => { e.preventDefault(); setUser({ role: "doctor", name: ROLES.doctor.person, facility: FACILITIES[0] }); };
  return (
    <div className="min-h-screen bg-slate-100">
      <header className="bg-brand-800 px-6 py-10 text-center text-white">
        <ShieldCheck className="mx-auto mb-3 h-10 w-10 text-brand-100" />
        <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">HIV Drug Resistance Surveillance System</h1>
        <p className="mx-auto mt-2 max-w-2xl text-sm text-brand-100">
          Routine monitoring, risk assessment, drug resistance classification and decision support for patients on antiretroviral drugs
        </p>
      </header>
      <main className="px-4 pb-10">
        <h2 className="py-8 text-center text-3xl font-semibold text-brand-900">Welcome!</h2>
        <form onSubmit={submit} className="mx-auto w-full max-w-sm space-y-4 rounded-xl border border-slate-200 bg-white p-8 shadow-lg">
          <Field label="Username"><input className={inp} value={f.username} onChange={set("username")} autoComplete="username" required /></Field>
          <Field label="Password"><input type="password" className={inp} value={f.password} onChange={set("password")} autoComplete="current-password" required /></Field>
          <button className={`${btn} w-full justify-center`}>Sign in</button>
        </form>
      </main>
    </div>
  );
}