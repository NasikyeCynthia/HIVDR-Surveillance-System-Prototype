import { TODAY, addDays } from "./monitoring.js";

export const FACILITIES = ["Kampala Region", "Gulu Region", "Mbarara Region", "Jinja Region", "Kabale Region"];

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
export const DSD = ["Facility-based individual management", "Fast-track drug refill", "Facility-based group", "Community drug distribution point", "Client-led ART delivery"];

// ROUTINE MONITORING RECORD. No resistance results live here: those belong to the laboratory module (LABS below).
const log = (date, vl, cd4, adh, regimen, by = "Clinic staff") => ({ date, vl, cd4, adh, regimen, by });
// seq(offsetDays, daysSupplied, count, gap): ART pickups starting `offsetDays` from today
const seq = (off, days, n, gap = days) => Array.from({ length: n }, (_, i) => ({ date: addDays(TODAY, off + i * gap), days }));
const mk = (id, name, sex, age, fac, site, o = {}) => ({
  id, name, sex, age, facility: FACILITIES[fac], site, weight: 62, artStart: "2023-01-10", regimen: "TDF/3TC/DTG", regimenStart: "2023-01-10", line: "First",
  regimenChanges: 0, prev: [], who: 1, careStatus: "Alive and on treatment", dsd: DSD[0], eac: 0, missed: 0, stockoutDays: 0, tb: "No", pss: [],
  monitoring: true, awaiting: false, nextAppt: addDays(TODAY, 70), pickups: seq(-178, 90, 2), logs: [log("2026-09-15", 40, 400, 95, "TDF/3TC/DTG")], ...o,
});
const DTG = "TDF/3TC/DTG", EFV = "TDF/3TC/EFV";

export const PATIENTS = [
  // Kampala
  mk("UG-KLA-0412", "Sarah Nakato", "F", 34, 0, "Mengo Hospital", { weight: 58, artStart: "2023-06-01", regimenStart: "2023-06-01", who: 2, missed: 3, stockoutDays: 21, eac: 1,
    pss: ["Non-disclosure", "Stigma & discrimination", "Economic challenges/poverty"], nextAppt: addDays(TODAY, -9), pickups: seq(-158, 30, 3, 40),
    logs: [log("2026-02-10", 4200, 260, 78, DTG), log("2026-06-12", 9800, 230, 66, DTG), log("2026-09-30", 15200, 210, 58, DTG)] }),
  mk("UG-KLA-0377", "Moses Ocen", "M", 45, 0, "Nsambya Home Care", { weight: 66, artStart: "2018-11-01", regimen: "AZT/3TC/LPV/r", regimenStart: "2022-04-01", line: "Second", regimenChanges: 2,
    prev: [EFV, "AZT/3TC/NVP"], who: 2, awaiting: true, eac: 2, missed: 1, pss: ["Dysfunctional family support", "Harmful habits (alcohol/substance)"], pickups: seq(-139, 60, 2),
    logs: [log("2026-03-02", 1800, 170, 74, "AZT/3TC/LPV/r"), log("2026-08-20", 6400, 150, 72, "AZT/3TC/LPV/r")] }),
  mk("UG-KLA-0301", "Peter Kato", "M", 52, 0, "Nsambya Home Care", { weight: 55, artStart: "2016-11-01", regimen: EFV, regimenStart: "2016-11-01", who: 3, eac: 3, missed: 2,
    pss: ["Economic challenges/poverty"], pickups: seq(-124, 60, 2), logs: [log("2026-04-15", 22000, 200, 68, EFV), log("2026-09-01", 31000, 180, 65, EFV)] }),
  mk("UG-KLA-0455", "Ruth Akello", "F", 38, 0, "Mengo Hospital", { weight: 64, artStart: "2024-05-01", missed: 2, nextAppt: addDays(TODAY, 4), pickups: seq(-170, 60, 3), logs: [log("2026-07-01", 300, 400, 80, DTG)] }),
  mk("UG-KLA-0520", "Annet Nabirye", "F", 31, 0, "PIDC (Baylor-Mulago)", { artStart: "2025-09-01", logs: [log("2026-09-10", 40, 520, 95, DTG)] }),
  mk("UG-KLA-0488", "David Mukasa", "M", 36, 0, "PIDC (Baylor-Mulago)", { artStart: "2024-12-01", logs: [log("2026-08-20", 30, 610, 96, DTG)] }),
  // Gulu
  mk("UG-GUL-0108", "Joel Drani", "M", 41, 1, "Gulu RR Hospital", { weight: 52, artStart: "2024-11-01", who: 3, missed: 4, eac: 1, careStatus: "Lost (<90 days)",
    pss: ["Harmful habits (alcohol/substance)", "Economic challenges/poverty"], pickups: seq(-210, 30, 3, 45),
    logs: [log("2026-05-10", 3000, 150, 60, DTG, "Dr. Candiru"), log("2026-08-02", 12000, 120, 50, DTG, "Dr. Candiru")] }),
  mk("UG-GUL-0092", "Grace Atim", "F", 29, 1, "Gulu RR Hospital", { artStart: "2025-05-01", nextAppt: addDays(TODAY, 6), logs: [log("2026-05-04", 40, 520, 94, DTG)] }),
  mk("UG-GUL-0140", "Kevin Okot", "M", 35, 1, "Pader H/C III", { artStart: "2023-11-01", regimen: EFV, regimenStart: "2023-11-01", logs: [log("2026-09-02", 1400, 330, 82, EFV)] }),
  mk("UG-GUL-0151", "Beatrice Lamunu", "F", 44, 1, "TASO Gulu", { artStart: "2022-07-01", stockoutDays: 30, pss: ["Non-disclosure", "Economic challenges/poverty", "Had 1 or no meal/day"], pickups: seq(-158, 60, 2),
    logs: [log("2026-06-10", 1900, 300, 70, DTG), log("2026-09-20", 5200, 280, 62, DTG)] }),
  // Mbarara
  mk("UG-MBR-0072", "Patrick Byaruhanga", "M", 49, 2, "Mbarara RR Hospital (ISS Clinic)", { artStart: "2019-07-01", regimen: EFV, regimenStart: "2019-07-01", eac: 2, missed: 1, pickups: seq(-144, 60, 2, 75),
    logs: [log("2026-05-02", 4000, 220, 72, EFV), log("2026-09-01", 11500, 190, 66, EFV)] }),
  mk("UG-MBR-0061", "Esther Tumwine", "F", 33, 2, "MJAP-MMC H/C IV", { artStart: "2024-09-01", logs: [log("2026-08-15", 700, 420, 79, DTG)] }),
  mk("UG-MBR-0080", "Juliet Ainembabazi", "F", 28, 2, "Mbarara RR Hospital (ISS Clinic)", { artStart: "2025-11-01", nextAppt: addDays(TODAY, 3), logs: [log("2026-07-20", 20, 610, 97, DTG)] }),
  // Jinja
  mk("UG-JIN-0045", "Samuel Wandera", "M", 40, 3, "Jinja RR Hospital", { artStart: "2023-02-01", eac: 1, missed: 2, pickups: seq(-158, 60, 2),
    logs: [log("2026-06-20", 2600, 250, 70, DTG), log("2026-09-25", 4100, 230, 64, DTG)] }),
  mk("UG-JIN-0057", "Isaac Mwesigwa", "M", 37, 3, "TASO Jinja", { artStart: "2022-05-01", regimen: EFV, regimenStart: "2022-05-01", logs: [log("2026-08-05", 600, 350, 78, EFV)] }),
  mk("UG-JIN-0050", "Rose Namugga", "F", 30, 3, "TASO Jinja", { artStart: "2025-03-01", logs: [log("2026-07-12", 25, 640, 98, DTG)] }),
  // Kabale
  mk("UG-KAB-0030", "Emmanuel Turyahebwa", "M", 46, 4, "Kabale RR Hospital", { artStart: "2020-12-01", regimen: EFV, regimenStart: "2020-12-01", who: 2, eac: 2, pickups: seq(-134, 60, 2),
    logs: [log("2026-08-12", 2300, 210, 70, EFV)] }),
  mk("UG-KAB-0022", "Doreen Kyomuhendo", "F", 32, 4, "TASO Rukungiri", { missed: 2, logs: [log("2026-08-18", 500, 380, 81, DTG)] }),
  mk("UG-KAB-0034", "Winnie Natukunda", "F", 26, 4, "Kisoro Hospital", { logs: [log("2026-09-01", 30, 700, 97, DTG)] }),
];

// Laboratory module: resistance results live here only. Patient status (confirmed / susceptible) is derived from these.
export const LABS = [
  { id: "L1", patientId: "UG-KLA-0301", date: "2026-09-12", gene: "RT", muts: ["K103N", "M184V"], lab: "CPHL Kampala", by: "Lab Tech Mugisha" },
  { id: "L2", patientId: "UG-GUL-0108", date: "2026-10-20", gene: "RT", muts: ["K65R"], lab: "Gulu Regional Lab", by: "Lab Tech Anyama" },
  { id: "L3", patientId: "UG-MBR-0072", date: "2026-10-02", gene: "RT", muts: ["K103N"], lab: "Mbarara Regional Lab", by: "Lab Tech Kiiza" },
  { id: "L4", patientId: "UG-KAB-0030", date: "2026-10-15", gene: "RT", muts: ["M41L"], lab: "Kabale Regional Lab", by: "Lab Tech Kabagambe" },
  { id: "L5", patientId: "UG-KLA-0488", date: "2026-10-05", gene: "RT", muts: [], lab: "CPHL Kampala", by: "Lab Tech Mugisha" },
  { id: "L6", patientId: "UG-JIN-0050", date: "2026-10-08", gene: "RT", muts: [], lab: "Jinja Regional Lab", by: "Lab Tech Wanyama" },
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

// daysWaiting = days since the recommendation was generated. Over 14 counts as a delayed response.
export const RECS = [
  { id: "r1", patientId: "UG-KLA-0412", text: "Order HIV genotype resistance test and start intensive adherence counselling.", status: "Pending", daysWaiting: 5 },
  { id: "r2", patientId: "UG-KLA-0301", text: "Confirmed NNRTI and 3TC/FTC mutations: review regimen against national guidelines.", status: "Pending", daysWaiting: 18 },
  { id: "r3", patientId: "UG-KLA-0377", text: "Follow up pending genotype result; reinforce adherence support.", status: "Pending", daysWaiting: 9 },
  { id: "r4", patientId: "UG-GUL-0108", text: "K65R detected: discuss TDF-containing regimen change with regional clinician.", status: "Pending", daysWaiting: 21 },
  { id: "r5", patientId: "UG-GUL-0151", text: "Order resistance test; check ART stock before next visit.", status: "Pending", daysWaiting: 3 },
  { id: "r6", patientId: "UG-MBR-0072", text: "K103N detected: review NNRTI-based regimen per national guidelines.", status: "Pending", daysWaiting: 16 },
  { id: "r7", patientId: "UG-JIN-0045", text: "Order resistance test and intensive adherence counselling.", status: "Pending", daysWaiting: 6 },
  { id: "r8", patientId: "UG-KAB-0030", text: "Review regimen given TDF-related mutation and rising viral load.", status: "Pending", daysWaiting: 11 },
];

export const MOTHERS = [
  { id: "M-01", name: "Ruth Akello", facility: FACILITIES[0], pregnancy: "Pregnant", edd: "2026-12-10", vl: [{ date: "2026-09-01", v: 40 }], adh: [{ date: "2026-08-15", v: 96 }, { date: "2026-09-15", v: 91 }], infantId: null },
  { id: "M-02", name: "Mary Adong", facility: FACILITIES[0], pregnancy: "Delivered", edd: "2026-08-20", vl: [{ date: "2026-07-10", v: 1500 }], adh: [{ date: "2026-07-10", v: 72 }], infantId: "I-01" },
  { id: "M-03", name: "Sandra Namata", facility: FACILITIES[0], pregnancy: "Pregnant", edd: "2027-01-22", vl: [{ date: "2026-10-05", v: 90 }], adh: [{ date: "2026-10-05", v: 88 }], infantId: null },
  { id: "M-04", name: "Lydia Acan", facility: FACILITIES[1], pregnancy: "Pregnant", edd: "2027-01-05", vl: [{ date: "2026-10-01", v: 20 }], adh: [{ date: "2026-10-01", v: 98 }], infantId: null },
  { id: "M-05", name: "Prossy Atuhaire", facility: FACILITIES[2], pregnancy: "Pregnant", edd: "2026-12-28", vl: [{ date: "2026-09-20", v: 1900 }], adh: [{ date: "2026-09-20", v: 70 }], infantId: null },
  { id: "M-06", name: "Harriet Nakato", facility: FACILITIES[3], pregnancy: "Pregnant", edd: "2027-02-14", vl: [{ date: "2026-10-12", v: 60 }], adh: [{ date: "2026-10-12", v: 92 }], infantId: null },
  { id: "M-07", name: "Scovia Mbabazi", facility: FACILITIES[4], pregnancy: "Pregnant", edd: "2026-12-02", vl: [{ date: "2026-09-28", v: 35 }], adh: [{ date: "2026-09-28", v: 95 }], infantId: null },
];
export const INFANTS = [
  { id: "I-01", name: "Baby Adong", facility: FACILITIES[0], dob: "2026-08-18", pcr: [{ label: "6-week PCR", due: "2026-09-29", status: "Overdue" }, { label: "6-month PCR", due: "2027-02-18", status: "Scheduled" }, { label: "18-month antibody test", due: "2028-02-18", status: "Scheduled" }] },
  { id: "I-02", name: "Baby Ojok", facility: FACILITIES[0], dob: "2026-10-28", pcr: [{ label: "Birth PCR", due: "2026-10-28", status: "Done: negative" }, { label: "6-week PCR", due: "2026-12-09", status: "Scheduled" }] },
  { id: "I-03", name: "Baby Acan (pending birth record)", facility: FACILITIES[1], dob: "Not yet born", pcr: [{ label: "Birth PCR", due: "At delivery", status: "Scheduled" }] },
];

// Aggregated only: no identifiers. Resistance prevalence (%) by quarter, 2026. Sample figures.
export const ANALYTICS = [
  { facility: FACILITIES[0], patients: 1840, highRisk: 14.2, trend: [4.1, 4.8, 5.2, 6.0], cls: { NNRTI: 9.4, NRTI: 4.1, PI: 1.2, INSTI: 0.4 }, stockoutDays: 21 },
  { facility: FACILITIES[1], patients: 1215, highRisk: 18.9, trend: [6.2, 6.9, 7.4, 8.1], cls: { NNRTI: 12.8, NRTI: 6.0, PI: 1.9, INSTI: 0.6 }, stockoutDays: 44 },
  { facility: FACILITIES[2], patients: 1130, highRisk: 12.4, trend: [4.6, 4.9, 5.1, 5.5], cls: { NNRTI: 8.6, NRTI: 3.9, PI: 1.1, INSTI: 0.3 }, stockoutDays: 14 },
  { facility: FACILITIES[3], patients: 1020, highRisk: 11.8, trend: [3.9, 4.4, 4.3, 4.8], cls: { NNRTI: 7.5, NRTI: 3.5, PI: 0.9, INSTI: 0.3 }, stockoutDays: 6 },
  { facility: FACILITIES[4], patients: 640, highRisk: 9.7, trend: [3.1, 3.4, 3.3, 3.8], cls: { NNRTI: 6.2, NRTI: 2.8, PI: 0.7, INSTI: 0.2 }, stockoutDays: 0 },
];