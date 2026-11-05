import { Link } from "react-router-dom";
import { BrainCircuit, AlertTriangle } from "lucide-react";
import { useApp } from "../store.jsx";
import { Card, PageHead, Badge, Banner, PRI } from "../ui.jsx";

export default function Risk() {
  const { mine, user } = useApp();
  const rows = [...mine].sort((a, b) => b.score - a.score);
  return (
    <>
      <PageHead title="Risk assessment" sub={`Machine learning sandbox for ${user.facility}. Scores come from routine adherence, viral load, regimen duration and supply data.`} />
      <Banner icon={BrainCircuit} tone="bg-sky-50 border-sky-200 text-sky-900"><b>Risk Identification (Unconfirmed Resistance).</b> A high-risk flag means a patient needs review. It does not mean resistance is present. Only a laboratory test confirms resistance.</Banner>
      <Banner icon={AlertTriangle} tone="bg-amber-50 border-amber-200 text-amber-900">Prototype scores are illustrative sample values, not output from a trained model.</Banner>
      <Card title="Patients under routine monitoring">
        <table className="w-full text-left text-sm"><thead className="text-xs text-slate-500"><tr><th className="pb-2">Patient</th><th>Risk level</th><th>Model score</th><th>Contributing factors</th><th>Lab status</th></tr></thead>
          <tbody>{rows.map((p) => (
            <tr key={p.id} className="border-t border-slate-100 align-top"><td className="py-3"><Link className="font-medium text-teal-700 hover:underline" to={`/patients/${p.id}`}>{p.id}</Link><br /><span className="text-xs text-slate-500">{p.regimen}, {p.months} months</span></td>
              <td><Badge tone={PRI[p.risk]}>{p.risk}</Badge></td>
              <td className="w-40"><div className="h-2 rounded bg-slate-200"><div className={`h-2 rounded ${p.score > 70 ? "bg-red-500" : p.score > 40 ? "bg-amber-500" : "bg-emerald-500"}`} style={{ width: `${p.score}%` }} /></div><span className="text-xs text-slate-500">{p.score}/100</span></td>
              <td className="pr-3 text-slate-700">{p.factors.join("; ") || "None"}</td>
              <td>{p.confirmed ? <Badge tone="bg-violet-100 text-violet-800">Confirmed: {p.confirmed}</Badge> : p.awaiting ? <Badge tone="bg-amber-100 text-amber-800">Awaiting result</Badge> : <Badge>Not tested</Badge>}</td></tr>))}</tbody></table>
      </Card>
    </>
  );
}
