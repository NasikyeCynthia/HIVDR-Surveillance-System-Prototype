import { useState } from "react";
import { Link } from "react-router-dom";
import { ShieldAlert, PenLine } from "lucide-react";
import { useApp } from "../store.jsx";
import { Card, PageHead, Badge, PRI, inp, btn, btn2 } from "../ui.jsx";

const TONE = { Pending: "bg-amber-100 text-amber-800", Approved: "bg-emerald-100 text-emerald-800", Modified: "bg-sky-100 text-sky-800", Rejected: "bg-red-100 text-red-800" };

function Rec({ r, p }) {
  const { role, setRec } = useApp();
  const [sig, setSig] = useState("");
  const [edit, setEdit] = useState(false);
  const [text, setText] = useState(r.text);
  const act = (status, extra = {}) => { setRec(r.id, { status, signedBy: sig, at: new Date().toLocaleString(), ...extra }); setEdit(false); };
  const done = r.status !== "Pending", can = role.can.approve;
  return (
    <Card>
      <div className="flex flex-wrap items-center gap-2"><Link to={`/patients/${p.id}`} className="font-semibold text-teal-700 hover:underline">{p.id}</Link><span className="text-sm text-slate-600">{p.name}</span>
        <Badge tone={PRI[p.risk]}>{p.risk} risk</Badge>{p.confirmed && <Badge tone="bg-violet-100 text-violet-800">Confirmed: {p.confirmed}</Badge>}<span className="ml-auto"><Badge tone={TONE[r.status]}>{r.status}</Badge></span></div>
      <p className="mt-2 text-xs text-slate-500">Why: {p.factors.join("; ") || "No risk factors"}</p>
      {edit ? <textarea className={`${inp} mt-3`} rows={2} value={text} onChange={(e) => setText(e.target.value)} /> : <p className="mt-3 text-slate-800">{r.text}</p>}
      {done ? <p className="mt-3 text-sm text-slate-600">Signed by {r.signedBy} on {r.at}</p> : (
        <div className="mt-4 flex flex-wrap items-end gap-3">
          <label className="min-w-56 flex-1 text-sm font-medium text-slate-700"><span className="mb-1 flex items-center gap-1"><PenLine className="h-3 w-3" />Clinician e-signature</span>
            <input className={inp} value={sig} onChange={(e) => setSig(e.target.value)} placeholder="Type full name to sign" disabled={!can} /></label>
          <button className={btn} disabled={!can || !sig.trim()} onClick={() => act("Approved")}>Approve</button>
          <button className={btn2} disabled={!can || !sig.trim()} onClick={() => edit ? act("Modified", { text }) : setEdit(true)}>{edit ? "Save modification" : "Modify"}</button>
          <button className={btn2} disabled={!can || !sig.trim()} onClick={() => act("Rejected")}>Reject</button>
        </div>)}
      {!can && !done && <p className="mt-2 text-xs text-slate-500">Only clinicians can approve, modify or reject.</p>}
    </Card>
  );
}

export default function Review() {
  const { recs, mine } = useApp();
  const items = recs.map((r) => [r, mine.find((p) => p.id === r.patientId)]).filter(([, p]) => p);
  return (
    <>
      <PageHead title="Clinical review and decision support" sub="Review system recommendations built from risk assessments and confirmed resistance." />
      <div className="mb-5 flex items-center gap-3 rounded-lg border-2 border-amber-500 bg-amber-50 px-4 py-3 font-semibold text-amber-900"><ShieldAlert className="h-5 w-5 shrink-0" />Read-Only / Decision Support: System cannot automatically prescribe or alter ART treatment.</div>
      <div className="space-y-4">{items.map(([r, p]) => <Rec key={r.id} r={r} p={p} />)}</div>
      {!items.length && <p className="text-sm text-slate-500">No recommendations for your facility.</p>}
    </>
  );
}
