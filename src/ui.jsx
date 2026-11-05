export const inp = "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:border-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-600/30";
export const btn = "inline-flex items-center gap-2 rounded-lg bg-teal-700 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-800 disabled:cursor-not-allowed disabled:opacity-50";
export const btn2 = "inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50";
export const PRI = { High: "bg-red-100 text-red-800", Medium: "bg-amber-100 text-amber-800", Low: "bg-emerald-100 text-emerald-800" };

export const Badge = ({ children, tone = "bg-slate-100 text-slate-700" }) => <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${tone}`}>{children}</span>;
export const Field = ({ label, children }) => <label className="block text-sm font-medium text-slate-700"><span className="mb-1 block">{label}</span>{children}</label>;
export const PageHead = ({ title, sub, right }) => (
  <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
    <div><h1 className="text-2xl font-semibold text-navy-900">{title}</h1>{sub && <p className="mt-1 max-w-3xl text-sm text-slate-600">{sub}</p>}</div>{right}
  </div>
);
export const Card = ({ title, right, children, className = "" }) => (
  <section className={`rounded-xl border border-slate-200 bg-white shadow-sm ${className}`}>
    {(title || right) && <header className="flex items-center justify-between gap-3 border-b border-slate-100 px-5 py-3"><h2 className="font-semibold text-navy-900">{title}</h2>{right}</header>}
    <div className="p-5">{children}</div>
  </section>
);
export const Banner = ({ icon: Icon, tone = "bg-sky-50 border-sky-200 text-sky-900", children }) => (
  <div className={`mb-5 flex items-start gap-3 rounded-lg border px-4 py-3 text-sm ${tone}`}>{Icon && <Icon className="mt-0.5 h-4 w-4 shrink-0" />}<div>{children}</div></div>
);
export const Spark = ({ v }) => {
  const m = Math.max(...v, 1000), y = (x) => 50 - (x / m) * 46;
  const pts = v.map((x, i) => `${(i / Math.max(v.length - 1, 1)) * 200},${y(x)}`).join(" ");
  return <svg viewBox="0 0 200 54" className="h-14 w-full" role="img" aria-label="Viral load trend, dashed line at 1000 copies/mL">
    <line x1="0" x2="200" y1={y(1000)} y2={y(1000)} stroke="#ef4444" strokeDasharray="4" /><polyline points={pts} fill="none" stroke="#0e7c86" strokeWidth="2" /></svg>;
};
