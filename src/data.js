export const FACILITIES = ["Kampala Clinic", "Arua Regional Referral Hospital", "Lira Hospital"];

// nav = which modules a role sees; can = what it may change (view never implies edit)
export const ROLES = {
  doctor: { label: "Doctor / Clinician", person: "Dr. Namutebi", nav: ["dashboard", "patients", "risk", "resistance", "review", "maternal"], can: { approve: true, edit: true } },
  nurse: { label: "Nurse / Clinical Officer", person: "Nurse Okello", nav: ["dashboard", "patients", "register", "integration", "risk", "review", "maternal"], can: { register: true, edit: true } },
  lab: { label: "Laboratory Personnel", person: "Lab Tech Mugisha", nav: ["dashboard", "resistance"], can: { enterLab: true } },
  facility_admin: { label: "Facility Administrator", person: "Admin Achieng", nav: ["dashboard", "patients", "integration", "risk", "maternal"], can: {} },
  moh: { label: "Ministry of Health Administrator", person: "MoH Analyst", nav: ["dashboard", "analytics"], can: {} },
  sys: { label: "System Administrator", person: "System Admin", nav: ["dashboard"], can: {} },
};
export const NO_FACILITY = ["moh", "sys"];
export const keyOf = (p) => p === "/" ? "dashboard" : p.startsWith("/patients/new") ? "register" : p.startsWith("/patients") ? "patients" : p.slice(1).split("/")[0];

export const FILTERS = {
  all: () => true, monitoring: (p) => p.monitoring, urgent: (p) => p.urgent, high: (p) => p.risk === "High",
  confirmed: (p) => !!p.confirmed, awaiting: (p) => p.awaiting, due: (p) => p.due,
};
export const quickRisk = (vl, adh) => (vl > 1000 && adh < 80 ? "High" : vl > 1000 || adh < 85 ? "Medium" : "Low");

const log = (date, vl, cd4, adh, regimen, by = "Nurse Okello") => ({ date, vl, cd4, adh, regimen, by });
export const PATIENTS = [
  { id: "UG-KLA-0412", name: "Sarah Nakato", sex: "F", age: 34, facility: FACILITIES[0], regimen: "TDF/3TC/DTG", line: "First", months: 41, monitoring: true, urgent: true, awaiting: false, due: false, risk: "High", score: 91, confirmed: null,
    factors: ["Persistently elevated viral load >1000 copies/mL (3 tests)", "3 missed appointments in 6 months", "Local TDF stockout (21 days)"],
    logs: [log("2026-02-10", 4200, 260, 78, "TDF/3TC/DTG"), log("2026-06-12", 9800, 230, 66, "TDF/3TC/DTG"), log("2026-09-30", 15200, 210, 58, "TDF/3TC/DTG")] },
  { id: "UG-KLA-0377", name: "Moses Ocen", sex: "M", age: 45, facility: FACILITIES[0], regimen: "AZT/3TC/LPV/r", line: "Second", months: 96, monitoring: true, urgent: false, awaiting: true, due: false, risk: "High", score: 78, confirmed: null,
    factors: ["Rising viral load on second-line regimen", "Long cumulative treatment exposure (96 months)", "Resistance test sent, awaiting result"],
    logs: [log("2026-03-02", 1800, 170, 74, "AZT/3TC/LPV/r"), log("2026-08-20", 6400, 150, 72, "AZT/3TC/LPV/r")] },
  { id: "UG-KLA-0301", name: "Peter Kato", sex: "M", age: 52, facility: FACILITIES[0], regimen: "TDF/3TC/EFV", line: "First", months: 120, monitoring: true, urgent: false, awaiting: false, due: false, risk: "High", score: 95, confirmed: "High-Level",
    factors: ["Persistent viraemia", "Adherence below 70%", "Lab-confirmed NNRTI and 3TC/FTC mutations"],
    logs: [log("2026-04-15", 22000, 200, 68, "TDF/3TC/EFV"), log("2026-09-01", 31000, 180, 65, "TDF/3TC/EFV")] },
  { id: "UG-ARU-0108", name: "Joel Drani", sex: "M", age: 41, facility: FACILITIES[1], regimen: "TDF/3TC/DTG", line: "First", months: 24, monitoring: true, urgent: true, awaiting: false, due: false, risk: "High", score: 84, confirmed: "Intermediate",
    factors: ["Viral load >1000 copies/mL", "4 missed appointments", "Treatment interruption of 6 weeks"],
    logs: [log("2026-05-10", 3000, 150, 60, "TDF/3TC/DTG", "Dr. Candiru"), log("2026-08-02", 12000, 120, 50, "TDF/3TC/DTG", "Dr. Candiru")] },
  { id: "UG-ARU-0092", name: "Grace Atim", sex: "F", age: 29, facility: FACILITIES[1], regimen: "TDF/3TC/DTG", line: "First", months: 18, monitoring: true, urgent: false, awaiting: false, due: true, risk: "Low", score: 14, confirmed: null,
    factors: [], logs: [log("2026-05-04", 40, 520, 94, "TDF/3TC/DTG", "Dr. Candiru")] },
  { id: "UG-LIR-0033", name: "Esther Apio", sex: "F", age: 27, facility: FACILITIES[2], regimen: "AZT/3TC/EFV", line: "First", months: 30, monitoring: true, urgent: false, awaiting: false, due: true, risk: "Medium", score: 52, confirmed: null,
    factors: ["Adherence at 80%", "Local AZT/3TC stockout (9 days)", "Viral load test overdue"],
    logs: [log("2026-04-01", 300, 400, 80, "AZT/3TC/EFV", "Nurse Opio")] },
];

export const LABS = [
  { id: "L1", patientId: "UG-KLA-0301", date: "2026-09-12", gene: "RT", muts: ["K103N", "M184V"], lab: "CPHL Kampala", by: "Lab Tech Mugisha" },
  { id: "L2", patientId: "UG-ARU-0108", date: "2026-10-20", gene: "RT", muts: ["K65R"], lab: "Arua Regional Lab", by: "Lab Tech Anyama" },
];

export const LEVELS = ["Susceptible", "Potential Low-Level", "Low-Level", "Intermediate", "High-Level"];
export const LEVEL_STYLE = ["bg-emerald-100 text-emerald-800", "bg-lime-100 text-lime-800", "bg-amber-100 text-amber-800", "bg-orange-100 text-orange-800", "bg-red-100 text-red-800"];
export const DRUGS = ["EFV", "NVP", "FTC", "3TC", "TDF"];
// Simulated lookup, standing in for Stanford HIVDB (Sierra web service).
const MUT = {
  K103N: { EFV: 4, NVP: 4 }, Y181C: { NVP: 4, EFV: 2 }, G190A: { NVP: 4, EFV: 3 },
  M184V: { "3TC": 4, FTC: 4 }, K65R: { TDF: 4, "3TC": 3, FTC: 3 }, M41L: { TDF: 2 },
};
export function interpret(muts) {
  const out = Object.fromEntries(DRUGS.map((d) => [d, 0]));
  muts.forEach((m) => Object.entries(MUT[m.toUpperCase()] || {}).forEach(([d, l]) => { out[d] = Math.max(out[d], l); }));
  return out;
}

export const RECS = [
  { id: "r1", patientId: "UG-KLA-0412", text: "Order HIV genotype resistance test and start intensive adherence counselling.", status: "Pending" },
  { id: "r2", patientId: "UG-KLA-0301", text: "Confirmed NNRTI and 3TC/FTC mutations: review regimen against national guidelines.", status: "Pending" },
  { id: "r3", patientId: "UG-KLA-0377", text: "Follow up pending genotype result; reinforce adherence support.", status: "Pending" },
  { id: "r4", patientId: "UG-ARU-0108", text: "K65R detected: discuss TDF-containing regimen change with regional clinician.", status: "Pending" },
];

export const MOTHERS = [
  { id: "M-01", name: "Ruth Akello", facility: FACILITIES[0], pregnancy: "Pregnant", edd: "2026-12-10", vl: [{ date: "2026-09-01", v: 40 }], adh: [{ date: "2026-08-15", v: 96 }, { date: "2026-09-15", v: 91 }], infantId: null },
  { id: "M-02", name: "Mary Adong", facility: FACILITIES[0], pregnancy: "Delivered", edd: "2026-08-20", vl: [{ date: "2026-07-10", v: 1500 }], adh: [{ date: "2026-07-10", v: 72 }], infantId: "I-01" },
  { id: "M-03", name: "Lydia Acan", facility: FACILITIES[1], pregnancy: "Pregnant", edd: "2027-01-05", vl: [{ date: "2026-10-01", v: 20 }], adh: [{ date: "2026-10-01", v: 98 }], infantId: null },
];
export const INFANTS = [
  { id: "I-01", name: "Baby Adong", facility: FACILITIES[0], dob: "2026-08-18", pcr: [{ label: "6-week PCR", due: "2026-09-29", status: "Overdue" }, { label: "6-month PCR", due: "2027-02-18", status: "Scheduled" }, { label: "18-month antibody test", due: "2028-02-18", status: "Scheduled" }] },
  { id: "I-02", name: "Baby Ojok", facility: FACILITIES[0], dob: "2026-10-28", pcr: [{ label: "Birth PCR", due: "2026-10-28", status: "Done: negative" }, { label: "6-week PCR", due: "2026-12-09", status: "Scheduled" }] },
  { id: "I-03", name: "Baby Acan (pending birth record)", facility: FACILITIES[1], dob: "Not yet born", pcr: [{ label: "Birth PCR", due: "At delivery", status: "Scheduled" }] },
];

// Aggregated only: no identifiers. Resistance prevalence (%) by quarter, 2026.
export const ANALYTICS = [
  { facility: FACILITIES[0], patients: 1840, highRisk: 14.2, trend: [4.1, 4.8, 5.2, 6.0], cls: { NNRTI: 9.4, NRTI: 4.1, PI: 1.2, INSTI: 0.4 }, stockoutDays: 21 },
  { facility: FACILITIES[1], patients: 1215, highRisk: 18.9, trend: [6.2, 6.9, 7.4, 8.1], cls: { NNRTI: 12.8, NRTI: 6.0, PI: 1.9, INSTI: 0.6 }, stockoutDays: 44 },
  { facility: FACILITIES[2], patients: 960, highRisk: 10.1, trend: [3.5, 3.6, 4.0, 3.9], cls: { NNRTI: 6.7, NRTI: 3.2, PI: 0.8, INSTI: 0.2 }, stockoutDays: 9 },
];
