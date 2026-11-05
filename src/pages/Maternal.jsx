import { useState } from "react";
import { Link2, Baby } from "lucide-react";
import { useApp } from "../store.jsx";
import { INFANTS } from "../data.js";
import { Card, PageHead, Badge, Field, Banner, inp, btn, btn2 } from "../ui.jsx";

function Mother({ m, infants }) {
  const { role, updateMother } = useApp();
  const [sel, setSel] = useState("");
  const [f, setF] = useState({ vl: "", adh: "" });
  const infant = INFANTS.find((i) => i.id === m.infantId);
  const free = infants.filter((i) => !mothersLinked.has(i.id));
  const today = new Date().toISOString().slice(0, 10);
  const add = (e) => { e.preventDefault(); updateMother(m.id, { vl: [...m.vl, { date: today, v: +f.vl }], adh: [...m.adh, { date: today, v: +f.adh }] }); setF({ vl: "", adh: "" }); };
  return (
    <Card title={`${m.name} (${m.id})`} right={<Badge tone={m.pregnancy === "Pregnant" ? "bg-sky-100 text-sky-800" : "bg-slate-100 text-slate-700"}>{m.pregnancy}</Badge>}>
      <div className="grid gap-5 md:grid-cols-2">
        <div className="space-y-2 text-sm">
          <p><span className="text-slate-500">Expected delivery date:</span> {m.edd}</p>
          <p><span className="text-slate-500">Maternal viral load:</span> {m.vl.map((x) => `${x.v} (${x.date})`).join(", ")}</p>
          <p><span className="text-slate-500">Adherence log:</span> {m.adh.map((x) => `${x.v}% (${x.date})`).join(", ")}</p>
          {role.can.edit && <form onSubmit={add} className="flex items-end gap-2 pt-2"><Field label="Viral load"><input type="number" min="0" className={inp} value={f.vl} onChange={(e) => setF({ ...f, vl: e.target.value })} required /></Field>
            <Field label="Adherence %"><input type="number" min="0" max="100" className={inp} value={f.adh} onChange={(e) => setF({ ...f, adh: e.target.value })} required /></Field><button className={btn}>Log</button></form>}
        </div>
        <div className="rounded-lg bg-slate-50 p-4 text-sm">
          <p className="mb-2 flex items-center gap-2 font-semibold text-navy-900"><Baby className="h-4 w-4" />Infant record (separate, linked)</p>
          {infant ? <><p className="font-medium">{infant.name} <span className="text-slate-500">{infant.id}, born {infant.dob}</span></p>
            <ul className="mt-2 space-y-1">{infant.pcr.map((t) => <li key={t.label} className="flex items-center justify-between"><span>{t.label} (due {t.due})</span><Badge tone={t.status === "Overdue" ? "bg-red-100 text-red-800" : "bg-slate-200 text-slate-700"}>{t.status}</Badge></li>)}</ul></>
            : <div><p className="mb-2 text-slate-500">No infant linked yet.</p>
              {role.can.edit && <div className="flex gap-2"><select className={inp} value={sel} onChange={(e) => setSel(e.target.value)}><option value="">Select infant record</option>{free.map((i) => <option key={i.id} value={i.id}>{i.id} {i.name}</option>)}</select>
                <button className={btn2} disabled={!sel} onClick={() => updateMother(m.id, { infantId: sel })}><Link2 className="h-4 w-4" />Link</button></div>}</div>}
        </div>
      </div>
    </Card>
  );
}
let mothersLinked = new Set();
export default function Maternal() {
  const { mothers, scope, user } = useApp();
  const list = scope(mothers), infants = scope(INFANTS);
  mothersLinked = new Set(mothers.map((m) => m.infantId).filter(Boolean));
  return (
    <>
      <PageHead title="Maternal and infant monitoring" sub={`HIV-positive pregnant mothers at ${user.facility}.`} />
      <Banner icon={Baby}>Mother and infant keep separate records. Linking connects them without merging the records.</Banner>
      <div className="space-y-5">{list.map((m) => <Mother key={m.id} m={m} infants={infants} />)}</div>
      {!list.length && <p className="text-sm text-slate-500">No mothers registered at this facility.</p>}
    </>
  );
}
