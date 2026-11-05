import { useState } from "react";
import { DatabaseZap, FileSpreadsheet, FlaskConical, CheckCircle2, AlertTriangle, Circle } from "lucide-react";
import { Card, PageHead, Badge, Banner, btn } from "../ui.jsx";

const SOURCES = [["UgandaEMR / OpenMRS", "Pull patient and visit data through a secure API", DatabaseZap], ["Central laboratory database", "Retrieve viral load and genotype results", FlaskConical], ["CSV / Excel upload", "Import an exported facility register", FileSpreadsheet]];
const STEPS = ["Fetch records from source", "Validate required fields and formats", "Match to patients and check duplicates", "Review and save"];
const ROWS = [
  ["UG-KLA-0620", "Annet Nabirye", "Valid", "bg-emerald-100 text-emerald-800", "New patient: will be created"],
  ["UG-KLA-0412", "Sarah Nakato", "Possible duplicate", "bg-amber-100 text-amber-800", "Matches existing record: merge or skip"],
  ["UG-KLA-0633", "(name missing)", "Validation error", "bg-red-100 text-red-800", "Missing name and date of birth: fix before saving"],
];

export default function Integration() {
  const [src, setSrc] = useState(0);
  const [step, setStep] = useState(-1);
  const run = () => { setStep(0); [1, 2, 3].forEach((s) => setTimeout(() => setStep(s), s * 700)); };
  return (
    <>
      <PageHead title="Data integration" sub="Import existing records so health workers don't re-enter them. Nothing is saved until validation and duplicate checks are reviewed." />
      <Banner icon={AlertTriangle} tone="bg-amber-50 border-amber-200 text-amber-900">Mockup: no real connection is made. Live integration needs the backend and approvals from each data owner.</Banner>
      <div className="grid gap-4 md:grid-cols-3">
        {SOURCES.map(([t, d, Icon], i) => <button key={t} onClick={() => { setSrc(i); setStep(-1); }} className={`rounded-xl border p-5 text-left shadow-sm ${src === i ? "border-teal-600 bg-teal-50" : "border-slate-200 bg-white hover:bg-slate-50"}`}><Icon className="mb-2 h-6 w-6 text-teal-700" /><p className="font-semibold text-navy-900">{t}</p><p className="text-sm text-slate-600">{d}</p></button>)}
      </div>
      <Card className="mt-5" title={`Simulated import from ${SOURCES[src][0]}`} right={<button className={btn} onClick={run}>Run simulated import</button>}>
        <ol className="mb-5 grid gap-3 md:grid-cols-4">{STEPS.map((s, i) => <li key={s} className="flex items-center gap-2 text-sm">{step >= i ? <CheckCircle2 className="h-5 w-5 text-teal-600" /> : <Circle className="h-5 w-5 text-slate-300" />}<span className={step >= i ? "font-medium text-navy-900" : "text-slate-500"}>{s}</span></li>)}</ol>
        {step >= 3 ? <table className="w-full text-left text-sm"><thead className="text-xs text-slate-500"><tr><th className="pb-2">Incoming ID</th><th>Name</th><th>Check result</th><th>Proposed action</th></tr></thead>
          <tbody>{ROWS.map((r) => <tr key={r[0]} className="border-t border-slate-100"><td className="py-2">{r[0]}</td><td>{r[1]}</td><td><Badge tone={r[3]}>{r[2]}</Badge></td><td className="text-slate-600">{r[4]}</td></tr>)}</tbody></table>
          : <p className="text-sm text-slate-500">Run the simulated import to see the validation and duplicate checks.</p>}
      </Card>
    </>
  );
}
