import { useState } from "react";
import { Dna, Info } from "lucide-react";
import { useApp } from "../store.jsx";
import { LEVELS, LEVEL_STYLE, DRUGS, interpret } from "../data.js";
import { Card, PageHead, Badge, Banner, Field, inp, btn, btn2 } from "../ui.jsx";

export default function Resistance() {
  const { mine, labs, role, user, addLab, scope } = useApp();
  const ids = mine.map((p) => p.id);
  const rows = labs.filter((l) => ids.includes(l.patientId));
  const [f, setF] = useState({ patientId: mine[0]?.id || "", date: "", gene: "RT", muts: "" });
  const [card, setCard] = useState(null);
  const [busy, setBusy] = useState(false);
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  const parse = (s) => s.split(",").map((m) => m.trim().toUpperCase()).filter(Boolean);
  const fetchHivdb = (l) => {
    setBusy(true); setCard(null);
    setTimeout(() => { setBusy(false); setCard({ l, res: interpret(labs.filter((x) => x.patientId === l.patientId && x.gene === "RT").flatMap((x) => x.muts)) }); }, 700);
  };
  const save = (e) => {
    e.preventDefault();
    const muts = parse(f.muts), res = interpret(muts), top = Math.max(...Object.values(res));
    addLab({ id: `L${Date.now()}`, patientId: f.patientId, date: f.date, gene: f.gene, muts, lab: user.facility, by: user.name }, LEVELS[top]);
    setF({ ...f, date: "", muts: "" });
  };
  return (
    <>
      <PageHead title="Confirmed resistance classification" sub={`Genetic mutation logs for ${user.facility}.`} />
      <Banner icon={Info}>Interpretation here is simulated. The live version will call the Stanford HIVDB service through the backend, and original laboratory results stay on file.</Banner>
      <div className="grid gap-5 xl:grid-cols-2">
        <Card title="Mutation log">
          <table className="w-full text-left text-sm"><thead className="text-xs text-slate-500"><tr><th className="pb-2">Testing date</th><th>Patient</th><th>Gene</th><th>Detected mutations</th><th /></tr></thead>
            <tbody>{rows.map((l) => <tr key={l.id} className="border-t border-slate-100"><td className="py-2.5">{l.date}</td><td>{l.patientId}</td><td>{l.gene}</td><td>{l.muts.join(", ") || "None"}</td>
              <td className="text-right"><button className={btn2} onClick={() => fetchHivdb(l)}>Fetch Stanford HIVDB Interpretation</button></td></tr>)}</tbody></table>
          {!rows.length && <p className="text-sm text-slate-500">No results on file for this facility.</p>}
        </Card>
        <Card title="Stanford HIVDB interpretation">
          {busy && <p className="text-sm text-slate-500">Fetching interpretation</p>}
          {!busy && !card && <p className="text-sm text-slate-500">Choose a result and fetch its interpretation.</p>}
          {card && <><p className="mb-3 flex items-center gap-2 text-sm"><Dna className="h-4 w-4 text-teal-700" />{card.l.patientId}, tested {card.l.date}. Mutations: {card.l.muts.join(", ") || "none"}</p>
            <div className="divide-y divide-slate-100 rounded-lg border border-slate-200">{DRUGS.map((d) => <div key={d} className="flex items-center justify-between px-4 py-2.5 text-sm"><span className="font-medium">{d}</span><Badge tone={LEVEL_STYLE[card.res[d]]}>{LEVELS[card.res[d]]}</Badge></div>)}</div>
            <p className="mt-2 text-xs text-slate-500">Scores combine every RT result on file for this patient.</p></>}
        </Card>
      </div>
      {role.can.enterLab ? (
        <Card className="mt-5" title="Enter mutation result"><form onSubmit={save} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <Field label="Patient"><select className={inp} value={f.patientId} onChange={set("patientId")}>{mine.map((p) => <option key={p.id} value={p.id}>{p.id}</option>)}</select></Field>
          <Field label="Testing date"><input type="date" className={inp} value={f.date} onChange={set("date")} required /></Field>
          <Field label="Gene section"><select className={inp} value={f.gene} onChange={set("gene")}><option>PR</option><option>RT</option><option>IN</option></select></Field>
          <Field label="Mutations (comma separated)"><input className={inp} value={f.muts} onChange={set("muts")} placeholder="K103N, M184V, K65R" /></Field>
          <div className="flex items-end"><button className={btn}>Save result</button></div></form></Card>
      ) : <p className="mt-4 text-sm text-slate-500">Your role can view results but not enter them.</p>}
    </>
  );
}
