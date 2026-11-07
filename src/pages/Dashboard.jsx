import { Link } from "react-router-dom";
import { Info } from "lucide-react";
import { useApp } from "../store.jsx";
import { Card, PageHead, Banner } from "../ui.jsx";

const RED = "#D9534F", ORANGE = "#F0AD4E", YELLOW = "#FFD700", LIME = "#C3E6CB", GREEN = "#28A745", GREY = "#94A3B8";

// One chart component for both graphs. groups: [{ label, sub?, bars: [{ name, value, color }] }]
function Chart({ groups }) {
  const max = Math.max(1, ...groups.flatMap((g) => g.bars.map((b) => b.value)));
  return (
    <div>
      <div className="flex h-44 items-end justify-around gap-2 border-b border-slate-300 px-2">
        {groups.map((g) => g.bars.map((b) => (
          <div key={g.label + b.name} className="flex flex-1 flex-col items-center justify-end">
            <span className="mb-1 text-sm font-semibold text-slate-700">{b.value}</span>
            <div className="w-full max-w-12 rounded-t border border-black/10" style={{ height: (b.value / max) * 130, backgroundColor: b.color }} title={`${g.label}: ${b.value}`} />
          </div>
        )))}
      </div>
      <div className="flex justify-around gap-2 px-2 pt-2 text-center text-xs font-medium text-slate-600">
        {groups.map((g) => <span key={g.label} className="flex-1">{g.label}{g.sub && <span className="block font-normal text-slate-500">{g.sub}</span>}</span>)}
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { user, role, mine, recs, mothers, scope } = useApp();
  const nav = role.nav;
  const ids = new Set(mine.map((p) => p.id));
  const pending = recs.filter((r) => r.status === "Pending" && ids.has(r.patientId));
  const pregnant = (user.role === "moh" ? mothers : scope(mothers)).filter((m) => m.pregnancy === "Pregnant");

  // [label, value, link, module needed to open the link, hint]
  const stats = [
    ["Patients", mine.length, "/patients", "patients", "all monitored"],
    ["High risk", mine.filter((p) => p.risk === "High").length, "/patients?filter=high", "patients"],
    ["Immediate attention", mine.filter((p) => p.urgent).length, "/patients?filter=urgent", "patients", "very high VL or late refill"],
    ["Resistance to drugs", mine.filter((p) => p.confirmed).length, "/patients?filter=confirmed", "patients", "lab-confirmed"],
    ["Awaiting decision", pending.length, "/review", "review", "clinician review"],
    ["Delayed responses", pending.filter((r) => r.daysWaiting > 14).length, "/review", "review", "waiting over 14 days"],
    ["Pregnant mothers", pregnant.length, "/maternal", "maternal", "all monitored"],
  ];

  // Graph 1: each patient counted once. Lab-tested susceptible first, otherwise by risk level.
  const lv = { High: 0, Moderate: 0, Low: 0, Susceptible: 0 };
  mine.forEach((p) => { if (p.susceptible) lv.Susceptible++; else if (p.risk === "High") lv.High++; else if (p.risk === "Medium") lv.Moderate++; else lv.Low++; });
  const riskGroups = [["High", RED], ["Moderate", ORANGE], ["Low", YELLOW], ["Susceptible", GREEN]]
    .map(([k, c]) => ({ label: k, bars: [{ name: k, value: lv[k], color: c }] }));

  // Graph 2: high-risk patients by laboratory classification, with how many of each have viral load above 1000.
  const high = mine.filter((p) => p.risk === "High");
  const cats = [
    ["High level", RED, (p) => p.confirmed === "High-Level"],
    ["Intermediate", ORANGE, (p) => p.confirmed === "Intermediate"],
    ["Low level", YELLOW, (p) => p.confirmed === "Low-Level"],
    ["Potential low level", LIME, (p) => p.confirmed === "Potential Low-Level"],
    ["Susceptible", GREEN, (p) => p.susceptible],
    ["Not yet tested", GREY, (p) => !p.confirmed && !p.susceptible],
  ];
  const labGroups = cats.map(([label, color, test]) => {
    const list = high.filter(test);
    return { label, sub: `VL above 1000: ${list.filter((p) => p.logs.at(-1).vl > 1000).length}`, bars: [{ name: label, value: list.length, color }] };
  });

  const scopeText = user.role === "moh" ? "all regions, aggregated counts only" : user.role === "sys" ? "system administration" : user.facility;

  return (
    <>
      <PageHead title="Dashboard" sub={`Showing: ${scopeText}`} />
      {user.role === "sys" && <Banner icon={Info}>System administrators manage accounts, permissions and configuration. Patient records are not available to this role.</Banner>}
      {user.role === "moh" && <Banner icon={Info}>Counts cover all regions. Identifiable patient records are not available to this role.</Banner>}
      {user.role !== "sys" && <>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4 xl:grid-cols-7">
          {stats.map(([label, n, to, key, hint]) => {
            const body = <><p className="text-xs font-medium text-slate-600">{label}</p><p className="my-1 text-3xl font-semibold text-brand-900">{n}</p><p className="min-h-4 text-xs text-slate-500">{hint}</p></>;
            const cls = "rounded-xl border border-slate-200 border-l-4 border-l-brand-600 bg-white p-3 shadow-sm";
            return nav.includes(key) ? <Link key={label} to={to} className={`${cls} hover:bg-brand-50`}>{body}</Link> : <div key={label} className={cls}>{body}</div>;
          })}
        </div>
        <div className="mt-6 grid gap-5 lg:grid-cols-2">
          <Card title="Patients by risk level"><Chart groups={riskGroups} /></Card>
          <Card title="High-risk patients by laboratory result" right={<span className="text-xs text-slate-500">latest viral load shown under each bar</span>}><Chart groups={labGroups} /></Card>
        </div>
      </>}
    </>
  );
}