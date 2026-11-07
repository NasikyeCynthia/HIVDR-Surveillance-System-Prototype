// Routine-monitoring logic. Risk, factors, urgency and refill adherence are DERIVED from raw patient data,
// never typed in by hand. These transparent rules stand in for the ML model until one is trained.
export const TODAY = new Date().toISOString().slice(0, 10);
const dn = (s) => Date.parse(`${s}T00:00:00Z`) / 86400000;
export const daysBetween = (a, b) => Math.round(dn(b) - dn(a));
export const addDays = (s, n) => new Date((dn(s) + n) * 86400000).toISOString().slice(0, 10);

// Refill-based adherence (approximate medication possession ratio over the last 180 days).
export function refillStats(p) {
  const pk = [...(p.pickups || [])].sort((a, b) => a.date.localeCompare(b.date));
  if (!pk.length) return { last: null, coveredUntil: null, overdue: 0, mpr: null };
  const last = pk.at(-1), coveredUntil = addDays(last.date, last.days);
  const supplied = pk.filter((x) => daysBetween(x.date, TODAY) <= 180).reduce((s, x) => s + x.days, 0);
  const denom = Math.min(180, Math.max(daysBetween(pk[0].date, TODAY), last.days));
  return { last, coveredUntil, overdue: Math.max(0, daysBetween(coveredUntil, TODAY)), mpr: Math.min(100, Math.round((supplied / denom) * 100)) };
}

export function assess(p) {
  const l = p.logs.at(-1), r = refillStats(p), f = [];
  const months = Math.round(daysBetween(p.artStart, TODAY) / 30.44);
  let pts = 0;
  const add = (n, text) => { pts += n; f.push(text); };
  const recent = p.logs.slice(-3), high = recent.filter((x) => x.vl > 1000).length;

  if (l.vl > 1000) {
    add(high >= 2 ? 40 : 30, high >= 2 ? `Viral load above 1000 copies/mL on ${high} of the last ${recent.length} tests` : "Latest viral load above 1000 copies/mL");
    if (months >= 84) add(5, `Long cumulative treatment exposure (${months} months)`);
    if (p.regimenChanges >= 2) add(5, `${p.regimenChanges} regimen changes so far`);
    if (p.eac < 3) add(5, `Enhanced adherence counselling incomplete (${p.eac} of 3 sessions)`);
  } else if (l.vl >= 200) add(10, "Low-level viraemia (200 to 999 copies/mL)");

  const a = l.adh < 70 ? 20 : l.adh < 80 ? 15 : l.adh < 90 ? 5 : 0;
  if (a) add(a, `Self-reported adherence ${l.adh}%`);
  if (r.mpr !== null && r.mpr < 90) add(r.mpr < 70 ? 15 : 8, `ART refills cover only ${r.mpr}% of recent days`);
  if (r.overdue >= 8) add(r.overdue >= 28 ? 15 : 8, `ART refill ${r.overdue} days overdue`);
  if (p.missed >= 2) add(p.missed >= 3 ? 10 : 6, `${p.missed} missed appointments in 6 months`);
  if (p.stockoutDays > 14) add(5, `Facility ART stockout (${p.stockoutDays} days)`);
  if (p.careStatus !== "Alive and on treatment") add(10, `Care status: ${p.careStatus}`);
  if (p.pss.length >= 3) add(5, `Several psychosocial barriers (${p.pss.length})`);
  if (p.awaiting) f.push("Resistance test ordered, awaiting result");

  const risk = pts >= 60 || (l.vl > 1000 && pts >= 50) ? "High" : pts >= 20 ? "Medium" : "Low";
  return { risk, score: Math.min(100, pts), factors: f, months, refill: r,
    urgent: risk === "High" && (l.vl >= 10000 || r.overdue >= 28), due: daysBetween(TODAY, p.nextAppt) <= 7 };
}