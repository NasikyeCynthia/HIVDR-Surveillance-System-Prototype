import { useState } from "react";
import { Link } from "react-router-dom";
import { Info, Lightbulb } from "lucide-react";
import { useApp } from "../store.jsx";
import { FILTERS } from "../data.js";
import { Card, PageHead, Badge, Banner, PRI, btn2 } from "../ui.jsx";

const nextSteps = (p) => [
  ...(p.awaiting ? ["Follow up pending resistance test result"] : []),
  ...(p.risk === "High" && !p.confirmed && !p.awaiting ? ["Order resistance test"] : []),
  ...(p.logs.at(-1).adh < 80 ? ["Intensive adherence counselling"] : []),
  ...(p.factors.some((f) => /stockout/i.test(f)) ? ["Check drug supply or refer to a facility with stock"] : []),
  ...(p.confirmed ? ["Clinician review of regimen against national guidelines"] : []),
  ...(p.due ? ["Schedule follow-up visit"] : []),
];

export default function Dashboard() {
  const { user, role, mine } = useApp();
  const [open, setOpen] = useState(null);
  const nav = role.nav;
  const stats = [["Total registered", "all"], ["Under monitoring", "monitoring"], ["Urgent attention", "urgent"], ["High risk", "high"], ["Confirmed resistance", "confirmed"], ["Awaiting lab results", "awaiting"], ["Due for follow-up", "due"]];
  const target = (f) => nav.includes("patients") ? `/patients?filter=${f}` : nav.includes("resistance") && ["confirmed", "awaiting"].includes(f) ? "/resistance" : nav.includes("analytics") ? "/analytics" : null;
  const order = { High: 0, Medium: 1, Low: 2 };
  const priority = mine.filter((p) => p.risk !== "Low" || p.urgent).sort((a, b) => order[a.risk] - order[b.risk]);
  const scopeText = user.role === "moh" ? "all facilities, aggregated counts only" : user.role === "sys" ? "system administration" : user.facility;

  return (
    <>
      <PageHead title="Dashboard" sub={`Showing: ${scopeText}`} />
      {user.role === "sys" && <Banner icon={Info}>System administrators manage accounts, permissions and configuration. Patient records are not available to this role.</Banner>}
      {user.role === "moh" && <Banner icon={Info}>Counts cover all facilities. Identifiable patient records are not available to this role.</Banner>}
      {user.role !== "sys" && <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 xl:grid-cols-7">
        {stats.map(([label, f]) => {
          const n = mine.filter(FILTERS[f]).length, to = target(f);
          const body = <><p className="text-3xl font-semibold text-navy-900">{n}</p><p className="text-xs text-slate-600">{label}</p></>;
          const cls = "rounded-xl border border-slate-200 border-l-4 border-l-teal-600 bg-white p-4 shadow-sm";
          return to ? <Link key={f} to={to} className={`${cls} hover:bg-teal-50`}>{body}</Link> : <div key={f} className={cls}>{body}</div>;
        })}
      </div>}
      {nav.includes("risk") && (
        <Card className="mt-6" title="Patient prioritisation" right={<span className="text-xs text-slate-500">Risk flags are not confirmed resistance</span>}>
          <div className="overflow-x-auto"><table className="w-full text-left text-sm">
            <thead className="text-xs text-slate-500"><tr><th className="pb-2">Patient ID</th><th>Priority</th><th>Explaining factors</th><th className="text-right">Action</th></tr></thead>
            <tbody>{priority.map((p) => (
              <tr key={p.id} className="border-t border-slate-100 align-top">
                <td className="py-3 pr-3"><Link className="font-medium text-teal-700 hover:underline" to={`/patients/${p.id}`}>{p.id}</Link><br /><span className="text-xs text-slate-500">{p.name}</span></td>
                <td className="pr-3"><Badge tone={PRI[p.risk]}>{p.risk}</Badge>{p.confirmed && <><br /><Badge tone="bg-violet-100 text-violet-800">Confirmed: {p.confirmed}</Badge></>}</td>
                <td className="pr-3 text-slate-700">{p.factors.join(" + ")}
                  {open === p.id && <div className="mt-2 rounded-lg bg-teal-50 p-3 text-teal-900"><p className="mb-1 flex items-center gap-1 text-xs font-semibold"><Lightbulb className="h-3 w-3" />Suggested next steps (for clinician review)</p>
                    <ul className="list-disc pl-5">{nextSteps(p).map((s) => <li key={s}>{s}</li>)}</ul></div>}</td>
                <td className="text-right"><button className={btn2} onClick={() => setOpen(open === p.id ? null : p.id)}>Suggest next steps</button></td>
              </tr>))}</tbody></table></div>
          {!priority.length && <p className="text-sm text-slate-500">No flagged patients in this facility.</p>}
        </Card>
      )}
    </>
  );
}
