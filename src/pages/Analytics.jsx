import { Lock } from "lucide-react";
import { ANALYTICS } from "../data.js";
import { Card, PageHead, Banner } from "../ui.jsx";

const heat = (v, max) => { const a = Math.min(v / max, 1); return { backgroundColor: `rgba(14,124,134,${0.1 + a * 0.75})`, color: a > 0.5 ? "#fff" : "#0a2540" }; };
export default function Analytics() {
  const classes = ["NNRTI", "NRTI", "PI", "INSTI"];
  return (
    <>
      <PageHead title="Multi-facility analytics" sub="Comparison of resistance patterns across Kampala, Arua and Lira." />
      <Banner icon={Lock} tone="bg-teal-50 border-teal-200 text-teal-900">Aggregated figures only. No identifiable patient records are shown or accessible to this role. Sample figures for the prototype.</Banner>
      <Card title="Resistance prevalence by quarter, 2026 (%)">
        <div className="overflow-x-auto"><table className="w-full text-center text-sm"><thead className="text-xs text-slate-500"><tr><th className="pb-2 text-left">Facility</th>{["Q1", "Q2", "Q3", "Q4"].map((q) => <th key={q}>{q}</th>)}</tr></thead>
          <tbody>{ANALYTICS.map((a) => <tr key={a.facility}><td className="py-1 text-left font-medium">{a.facility}</td>{a.trend.map((v, i) => <td key={i} className="p-1"><div className="rounded py-2" style={heat(v, 9)}>{v}</div></td>)}</tr>)}</tbody></table></div>
      </Card>
      <Card className="mt-5" title="Resistance by drug class (%)">
        <table className="w-full text-center text-sm"><thead className="text-xs text-slate-500"><tr><th className="pb-2 text-left">Facility</th>{classes.map((c) => <th key={c}>{c}</th>)}</tr></thead>
          <tbody>{ANALYTICS.map((a) => <tr key={a.facility}><td className="py-1 text-left font-medium">{a.facility}</td>{classes.map((c) => <td key={c} className="p-1"><div className="rounded py-2" style={heat(a.cls[c], 14)}>{a.cls[c]}</div></td>)}</tr>)}</tbody></table>
      </Card>
      <Card className="mt-5" title="Facility context">
        <table className="w-full text-left text-sm"><thead className="text-xs text-slate-500"><tr><th className="pb-2">Facility</th><th>Patients in care</th><th>High-risk share</th><th>ART stockout days (year to date)</th></tr></thead>
          <tbody>{ANALYTICS.map((a) => <tr key={a.facility} className="border-t border-slate-100"><td className="py-2 font-medium">{a.facility}</td><td>{a.patients.toLocaleString()}</td><td>{a.highRisk}%</td><td>{a.stockoutDays}</td></tr>)}</tbody></table>
      </Card>
    </>
  );
}
