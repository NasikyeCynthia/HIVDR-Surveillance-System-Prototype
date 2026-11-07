import { useState } from "react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { Search, Lock } from "lucide-react";
import { useApp } from "../store.jsx";
import { FILTERS, DSD } from "../data.js";
import { TODAY, addDays, daysBetween } from "../monitoring.js";
import { Card, PageHead, Badge, Field, Banner, Spark, PRI, inp, btn } from "../ui.jsx";

const RefillBadge = ({ r }) => !r.last ? <Badge>No pickups recorded</Badge>
  : r.overdue >= 28 ? <Badge tone="bg-red-100 text-red-800">Overdue {r.overdue} days</Badge>
  : r.overdue >= 1 ? <Badge tone="bg-amber-100 text-amber-800">Late {r.overdue} days</Badge>
  : <Badge tone="bg-emerald-100 text-emerald-800">Supply until {r.coveredUntil}</Badge>;
const Row = ({ k, v }) => <div className="flex justify-between gap-3"><dt className="text-slate-500">{k}</dt><dd className="text-right">{v}</dd></div>;

export function PatientList() {
  const { mine, role, user } = useApp();
  const [params, setParams] = useSearchParams();
  const [q, setQ] = useState("");
  const filter = params.get("filter") || "all";
  const rows = mine.filter(FILTERS[filter]).filter((p) => `${p.id} ${p.name} ${p.site}`.toLowerCase().includes(q.toLowerCase()));
  return (
    <>
      <PageHead title="Patients" sub={`Records visible to you: ${user.facility} only.`} right={role.can.register && <Link to="/patients/new" className={btn}>Register patient</Link>} />
      <Card>
        <div className="mb-4 flex flex-wrap gap-3">
          <div className="relative min-w-64 flex-1"><Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" /><input className={`${inp} pl-9`} placeholder="Search by patient ID, name or health facility" value={q} onChange={(e) => setQ(e.target.value)} /></div>
          <select className={`${inp} w-auto`} value={filter} aria-label="Filter" onChange={(e) => setParams({ filter: e.target.value })}>
            {[["all", "All patients"], ["urgent", "Immediate attention"], ["high", "High risk"], ["confirmed", "Resistance confirmed"], ["awaiting", "Awaiting results"], ["due", "Appointment due"]].map(([k, l]) => <option key={k} value={k}>{l}</option>)}
          </select>
        </div>
        <div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead className="text-xs text-slate-500"><tr><th className="pb-2">ID</th><th>Name</th><th>Age / sex</th><th>Health facility</th><th>Regimen</th><th>ART refill</th><th>Risk</th></tr></thead>
          <tbody>{rows.map((p) => <tr key={p.id} className="border-t border-slate-100"><td className="py-2.5 pr-3"><Link className="font-medium text-brand-700 hover:underline" to={`/patients/${p.id}`}>{p.id}</Link></td>
            <td className="pr-3">{p.name}</td><td className="pr-3">{p.age} / {p.sex}</td><td className="pr-3">{p.site}</td><td className="pr-3">{p.regimen} ({p.line})</td><td className="pr-3"><RefillBadge r={p.refill} /></td><td><Badge tone={PRI[p.risk]}>{p.risk}</Badge></td></tr>)}</tbody></table></div>
        {!rows.length && <p className="py-6 text-center text-sm text-slate-500">No patients match. Clear the search or change the filter.</p>}
      </Card>
    </>
  );
}

export function PatientProfile() {
  const { id } = useParams();
  const { mine, role, user, addLog, addPickup } = useApp();
  const p = mine.find((x) => x.id === id);
  const [f, setF] = useState({ date: TODAY, vl: "", cd4: "", adh: "", regimen: "" });
  const [pk, setPk] = useState({ date: TODAY, days: "90" });
  if (!p) return <Banner icon={Lock} tone="bg-red-50 border-red-200 text-red-900">This patient is not in your facility scope or does not exist. <Link className="underline" to="/patients">Back to patients</Link></Banner>;
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  const saveLog = (e) => { e.preventDefault(); addLog(p.id, { date: f.date, vl: +f.vl, cd4: +f.cd4, adh: +f.adh, regimen: f.regimen || p.regimen, by: user.name }); setF({ date: TODAY, vl: "", cd4: "", adh: "", regimen: "" }); };
  const savePk = (e) => { e.preventDefault(); addPickup(p.id, { date: pk.date, days: +pk.days }); };
  const sorted = [...p.pickups].sort((a, b) => a.date.localeCompare(b.date));
  const pickRows = sorted.map((x, i) => ({ ...x, late: i ? daysBetween(addDays(sorted[i - 1].date, sorted[i - 1].days), x.date) : 0 })).reverse();
  const last = p.logs.at(-1), r = p.refill;
  return (
    <>
      <PageHead title={p.name} sub={`${p.id} · ${p.age} / ${p.sex} · ${p.site}, ${p.facility}`}
        right={<div className="flex flex-wrap gap-2"><Badge tone={PRI[p.risk]}>{p.risk} risk</Badge>{p.confirmed && <Badge tone="bg-violet-100 text-violet-800">Lab-confirmed resistance: {p.confirmed}</Badge>}</div>} />
      <div className="grid gap-5 lg:grid-cols-3">
        <Card title="Treatment"><dl className="space-y-1.5 text-sm">
          <Row k="Regimen" v={`${p.regimen} (${p.line} line)`} /><Row k="ART started" v={`${p.artStart} (${p.months} months)`} /><Row k="On this regimen since" v={p.regimenStart} />
          <Row k="Regimen changes" v={p.regimenChanges} /><Row k="Previous regimens" v={p.prev.join(", ") || "None"} /><Row k="WHO stage" v={p.who} />
          <Row k="Weight" v={`${p.weight} kg`} /><Row k="TB status" v={p.tb} /><Row k="Care status" v={p.careStatus} /></dl></Card>
        <Card title="Adherence and drug pickups"><dl className="space-y-1.5 text-sm">
          <Row k="Self-reported adherence" v={`${last.adh}%`} /><Row k="Refill-based adherence" v={r.mpr === null ? "No data" : `${r.mpr}%`} />
          <Row k="Last ART pickup" v={r.last ? `${r.last.date} (${r.last.days} days)` : "None"} /><Row k="Refill status" v={<RefillBadge r={r} />} />
          <Row k="Dispensing model" v={p.dsd} /><Row k="Missed appointments (6 months)" v={p.missed} /><Row k="Next appointment" v={p.nextAppt} />
          <Row k="Adherence counselling" v={`${p.eac} of 3 sessions`} /></dl></Card>
        <Card title="Why flagged">{p.factors.length ? <ul className="list-disc space-y-1 pl-5 text-sm">{p.factors.map((x) => <li key={x}>{x}</li>)}</ul> : <p className="text-sm text-slate-500">No risk factors identified.</p>}
          <p className="mt-3 text-xs text-slate-500">Risk is worked out from the monitoring data on this page. Resistance is not used here: confirmed results come only from the laboratory module.</p></Card>
      </div>
      <div className="mt-5 grid gap-5 lg:grid-cols-3">
        <Card title="Viral load over time"><Spark v={p.logs.map((l) => l.vl)} /><p className="text-xs text-slate-500">Dashed line: 1,000 copies/mL</p></Card>
        <Card title="Psychosocial barriers" className="lg:col-span-2">{p.pss.length ? <div className="flex flex-wrap gap-2">{p.pss.map((x) => <Badge key={x} tone="bg-slate-100 text-slate-700">{x}</Badge>)}</div> : <p className="text-sm text-slate-500">None recorded.</p>}</Card>
      </div>
      <Card className="mt-5" title="ART pickup history">
        <table className="w-full text-left text-sm"><thead className="text-xs text-slate-500"><tr><th className="pb-2">Pickup date</th><th>Days supplied</th><th>Timeliness</th></tr></thead>
          <tbody>{pickRows.map((x, i) => <tr key={i} className="border-t border-slate-100"><td className="py-2">{x.date}</td><td>{x.days}</td><td>{i === pickRows.length - 1 ? "First recorded pickup" : x.late > 3 ? <Badge tone="bg-amber-100 text-amber-800">Late by {x.late} days</Badge> : <Badge tone="bg-emerald-100 text-emerald-800">On time</Badge>}</td></tr>)}</tbody></table>
        {role.can.edit && <form onSubmit={savePk} className="mt-4 grid gap-3 border-t border-slate-100 pt-4 sm:grid-cols-4">
          <Field label="Pickup date"><input type="date" className={inp} value={pk.date} onChange={(e) => setPk({ ...pk, date: e.target.value })} required /></Field>
          <Field label="Days supplied"><select className={inp} value={pk.days} onChange={(e) => setPk({ ...pk, days: e.target.value })}>{[30, 60, 90, 180].map((d) => <option key={d}>{d}</option>)}</select></Field>
          <div className="flex items-end"><button className={btn}>Record pickup</button></div></form>}
      </Card>
      <Card className="mt-5" title="Clinical history (entries are added, never overwritten)">
        <table className="w-full text-left text-sm"><thead className="text-xs text-slate-500"><tr><th className="pb-2">Date</th><th>Viral load</th><th>CD4</th><th>Adherence</th><th>Regimen</th><th>Recorded by</th></tr></thead>
          <tbody>{[...p.logs].reverse().map((l, i) => <tr key={i} className="border-t border-slate-100"><td className="py-2">{l.date}</td><td>{l.vl.toLocaleString()}</td><td>{l.cd4}</td><td>{l.adh}%</td><td>{l.regimen}</td><td>{l.by}</td></tr>)}</tbody></table>
        {role.can.edit && <form onSubmit={saveLog} className="mt-4 grid gap-3 border-t border-slate-100 pt-4 sm:grid-cols-6">
          <Field label="Date"><input type="date" className={inp} value={f.date} onChange={set("date")} required /></Field>
          <Field label="Viral load"><input type="number" min="0" className={inp} value={f.vl} onChange={set("vl")} required /></Field>
          <Field label="CD4"><input type="number" min="0" className={inp} value={f.cd4} onChange={set("cd4")} required /></Field>
          <Field label="Adherence %"><input type="number" min="0" max="100" className={inp} value={f.adh} onChange={set("adh")} required /></Field>
          <Field label="Regimen (if changed)"><input className={inp} value={f.regimen} onChange={set("regimen")} placeholder={p.regimen} /></Field>
          <div className="flex items-end"><button className={btn}>Add entry</button></div></form>}
      </Card>
    </>
  );
}

export function Register() {
  const { user, patients, addPatient } = useApp();
  const nav = useNavigate();
  const [f, setF] = useState({ id: "", name: "", sex: "F", age: "", weight: "", site: "", artStart: "", regimen: "TDF/3TC/DTG", line: "First", who: "1", dsd: DSD[0],
    vl: "", cd4: "", adh: "", pickupDate: TODAY, pickupDays: "90", nextAppt: "" });
  const [err, setErr] = useState("");
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  const submit = (e) => {
    e.preventDefault();
    if (patients.some((p) => p.id.toLowerCase() === f.id.toLowerCase())) return setErr(`Duplicate: patient ID ${f.id} already exists.`);
    addPatient({ id: f.id, name: f.name, sex: f.sex, age: +f.age, facility: user.facility, site: f.site, weight: +f.weight, artStart: f.artStart, regimen: f.regimen, regimenStart: f.artStart, line: f.line,
      regimenChanges: 0, prev: [], who: +f.who, careStatus: "Alive and on treatment", dsd: f.dsd, eac: 0, missed: 0, stockoutDays: 0, tb: "No", pss: [], monitoring: true, awaiting: false,
      nextAppt: f.nextAppt, pickups: [{ date: f.pickupDate, days: +f.pickupDays }], logs: [{ date: TODAY, vl: +f.vl, cd4: +f.cd4, adh: +f.adh, regimen: f.regimen, by: user.name }] });
    nav(`/patients/${f.id}`);
  };
  const t = (k, label, type = "text", extra = {}) => <Field label={label}><input type={type} className={inp} value={f[k]} onChange={set(k)} required {...extra} /></Field>;
  return (
    <>
      <PageHead title="Register patient" sub={`New patients are assigned to ${user.facility} and monitored from registration. The ID is checked for duplicates.`} />
      <Card><form onSubmit={submit} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {t("id", "Unique patient ID", "text", { placeholder: "UG-KLA-0500" })}{t("name", "Full name")}{t("age", "Age", "number", { min: 0, max: 120 })}
        <Field label="Sex"><select className={inp} value={f.sex} onChange={set("sex")}><option value="F">Female</option><option value="M">Male</option></select></Field>
        {t("weight", "Weight (kg)", "number", { min: 1 })}{t("site", "Health facility / ART clinic")}
        {t("artStart", "ART start date", "date")}{t("regimen", "Current ART regimen")}
        <Field label="Treatment line"><select className={inp} value={f.line} onChange={set("line")}><option>First</option><option>Second</option><option>Third</option></select></Field>
        <Field label="WHO stage"><select className={inp} value={f.who} onChange={set("who")}>{[1, 2, 3, 4].map((s) => <option key={s}>{s}</option>)}</select></Field>
        <Field label="Dispensing model"><select className={inp} value={f.dsd} onChange={set("dsd")}>{DSD.map((d) => <option key={d}>{d}</option>)}</select></Field>
        {t("nextAppt", "Next appointment", "date")}
        {t("vl", "Latest viral load (copies/mL)", "number", { min: 0 })}{t("cd4", "CD4 count", "number", { min: 0 })}{t("adh", "Self-reported adherence (%)", "number", { min: 0, max: 100 })}
        {t("pickupDate", "Last ART pickup date", "date")}
        <Field label="Days of ART supplied"><select className={inp} value={f.pickupDays} onChange={set("pickupDays")}>{[30, 60, 90, 180].map((d) => <option key={d}>{d}</option>)}</select></Field>
        <div className="flex items-end gap-3 sm:col-span-2 lg:col-span-3"><button className={btn}>Register patient</button>{err && <p role="alert" className="text-sm font-medium text-red-700">{err}</p>}</div>
      </form></Card>
    </>
  );
}