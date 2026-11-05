import { useState } from "react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { Search, Lock } from "lucide-react";
import { useApp } from "../store.jsx";
import { FILTERS, quickRisk } from "../data.js";
import { Card, PageHead, Badge, Field, Banner, Spark, PRI, inp, btn } from "../ui.jsx";

export function PatientList() {
  const { mine, role, user } = useApp();
  const [params, setParams] = useSearchParams();
  const [q, setQ] = useState("");
  const filter = params.get("filter") || "all";
  const rows = mine.filter(FILTERS[filter]).filter((p) => `${p.id} ${p.name}`.toLowerCase().includes(q.toLowerCase()));
  return (
    <>
      <PageHead title="Patients" sub={`Records visible to you: ${user.facility} only.`} right={role.can.register && <Link to="/patients/new" className={btn}>Register patient</Link>} />
      <Card>
        <div className="mb-4 flex flex-wrap gap-3">
          <div className="relative min-w-64 flex-1"><Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" /><input className={`${inp} pl-9`} placeholder="Search by patient ID or name" value={q} onChange={(e) => setQ(e.target.value)} /></div>
          <select className={`${inp} w-auto`} value={filter} aria-label="Filter" onChange={(e) => setParams({ filter: e.target.value })}>
            {[["all", "All patients"], ["monitoring", "Under monitoring"], ["urgent", "Urgent"], ["high", "High risk"], ["confirmed", "Confirmed resistance"], ["awaiting", "Awaiting results"], ["due", "Due for follow-up"]].map(([k, l]) => <option key={k} value={k}>{l}</option>)}
          </select>
        </div>
        <table className="w-full text-left text-sm"><thead className="text-xs text-slate-500"><tr><th className="pb-2">ID</th><th>Name</th><th>Age / sex</th><th>Regimen</th><th>Risk</th></tr></thead>
          <tbody>{rows.map((p) => <tr key={p.id} className="border-t border-slate-100"><td className="py-2.5"><Link className="font-medium text-teal-700 hover:underline" to={`/patients/${p.id}`}>{p.id}</Link></td>
            <td>{p.name}</td><td>{p.age} / {p.sex}</td><td>{p.regimen} ({p.line} line)</td><td><Badge tone={PRI[p.risk]}>{p.risk}</Badge></td></tr>)}</tbody></table>
        {!rows.length && <p className="py-6 text-center text-sm text-slate-500">No patients match. Clear the search or change the filter.</p>}
      </Card>
    </>
  );
}

export function PatientProfile() {
  const { id } = useParams();
  const { mine, role, user, addLog } = useApp();
  const p = mine.find((x) => x.id === id);
  const [f, setF] = useState({ date: "", vl: "", cd4: "", adh: "", regimen: "" });
  if (!p) return <Banner icon={Lock} tone="bg-red-50 border-red-200 text-red-900">This patient is not in your facility scope or does not exist. <Link className="underline" to="/patients">Back to patients</Link></Banner>;
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  const save = (e) => { e.preventDefault(); addLog(p.id, { date: f.date, vl: +f.vl, cd4: +f.cd4, adh: +f.adh, regimen: f.regimen || p.regimen, by: user.name }); setF({ date: "", vl: "", cd4: "", adh: "", regimen: "" }); };
  return (
    <>
      <PageHead title={`${p.name}`} sub={`${p.id} · ${p.age} / ${p.sex} · ${p.facility}`} right={<div className="flex gap-2"><Badge tone={PRI[p.risk]}>{p.risk} risk</Badge>{p.confirmed && <Badge tone="bg-violet-100 text-violet-800">Confirmed: {p.confirmed}</Badge>}</div>} />
      <div className="grid gap-5 lg:grid-cols-3">
        <Card title="Treatment"><dl className="space-y-1 text-sm"><div className="flex justify-between"><dt className="text-slate-500">Regimen</dt><dd>{p.regimen}</dd></div><div className="flex justify-between"><dt className="text-slate-500">Line</dt><dd>{p.line}</dd></div><div className="flex justify-between"><dt className="text-slate-500">Duration</dt><dd>{p.months} months</dd></div></dl></Card>
        <Card title="Viral load over time"><Spark v={p.logs.map((l) => l.vl)} /><p className="text-xs text-slate-500">Dashed line: 1,000 copies/mL</p></Card>
        <Card title="Why flagged">{p.factors.length ? <ul className="list-disc pl-5 text-sm">{p.factors.map((x) => <li key={x}>{x}</li>)}</ul> : <p className="text-sm text-slate-500">No risk factors identified.</p>}</Card>
      </div>
      <Card className="mt-5" title="Clinical history (entries are added, never overwritten)">
        <table className="w-full text-left text-sm"><thead className="text-xs text-slate-500"><tr><th className="pb-2">Date</th><th>Viral load</th><th>CD4</th><th>Adherence</th><th>Regimen</th><th>Recorded by</th></tr></thead>
          <tbody>{[...p.logs].reverse().map((l, i) => <tr key={i} className="border-t border-slate-100"><td className="py-2">{l.date}</td><td>{l.vl.toLocaleString()}</td><td>{l.cd4}</td><td>{l.adh}%</td><td>{l.regimen}</td><td>{l.by}</td></tr>)}</tbody></table>
        {role.can.edit && <form onSubmit={save} className="mt-4 grid gap-3 border-t border-slate-100 pt-4 sm:grid-cols-5">
          <Field label="Date"><input type="date" className={inp} value={f.date} onChange={set("date")} required /></Field>
          <Field label="Viral load"><input type="number" min="0" className={inp} value={f.vl} onChange={set("vl")} required /></Field>
          <Field label="CD4"><input type="number" min="0" className={inp} value={f.cd4} onChange={set("cd4")} required /></Field>
          <Field label="Adherence %"><input type="number" min="0" max="100" className={inp} value={f.adh} onChange={set("adh")} required /></Field>
          <div className="flex items-end"><button className={btn}>Add entry</button></div></form>}
      </Card>
    </>
  );
}

export function Register() {
  const { user, patients, addPatient } = useApp();
  const nav = useNavigate();
  const [f, setF] = useState({ id: "", name: "", sex: "F", age: "", regimen: "TDF/3TC/DTG", line: "First", months: "", vl: "", cd4: "", adh: "" });
  const [err, setErr] = useState("");
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  const submit = (e) => {
    e.preventDefault();
    if (patients.some((p) => p.id.toLowerCase() === f.id.toLowerCase())) return setErr(`Duplicate: patient ID ${f.id} already exists.`);
    const risk = quickRisk(+f.vl, +f.adh);
    addPatient({ id: f.id, name: f.name, sex: f.sex, age: +f.age, facility: user.facility, regimen: f.regimen, line: f.line, months: +f.months, monitoring: true, urgent: risk === "High", awaiting: false, due: false, risk, score: 0, confirmed: null,
      factors: risk === "Low" ? [] : ["Flagged at registration from first viral load and adherence"], logs: [{ date: new Date().toISOString().slice(0, 10), vl: +f.vl, cd4: +f.cd4, adh: +f.adh, regimen: f.regimen, by: user.name }] });
    nav(`/patients/${f.id}`);
  };
  return (
    <>
      <PageHead title="Register patient" sub={`New patients are assigned to ${user.facility}. The ID is checked for duplicates.`} />
      <Card><form onSubmit={submit} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Field label="Unique patient ID"><input className={inp} value={f.id} onChange={set("id")} placeholder="UG-KLA-0500" required /></Field>
        <Field label="Full name"><input className={inp} value={f.name} onChange={set("name")} required /></Field>
        <Field label="Age"><input type="number" min="0" max="120" className={inp} value={f.age} onChange={set("age")} required /></Field>
        <Field label="Sex"><select className={inp} value={f.sex} onChange={set("sex")}><option value="F">Female</option><option value="M">Male</option></select></Field>
        <Field label="ART regimen"><input className={inp} value={f.regimen} onChange={set("regimen")} required /></Field>
        <Field label="Treatment line"><select className={inp} value={f.line} onChange={set("line")}><option>First</option><option>Second</option><option>Third</option></select></Field>
        <Field label="Months on ART"><input type="number" min="0" className={inp} value={f.months} onChange={set("months")} required /></Field>
        <Field label="Viral load (copies/mL)"><input type="number" min="0" className={inp} value={f.vl} onChange={set("vl")} required /></Field>
        <Field label="CD4 count"><input type="number" min="0" className={inp} value={f.cd4} onChange={set("cd4")} required /></Field>
        <Field label="Adherence (%)"><input type="number" min="0" max="100" className={inp} value={f.adh} onChange={set("adh")} required /></Field>
        <div className="flex items-end gap-3 sm:col-span-2"><button className={btn}>Register patient</button>{err && <p role="alert" className="text-sm font-medium text-red-700">{err}</p>}</div>
      </form></Card>
    </>
  );
}
