import { createContext, useContext, useState } from "react";
import * as D from "./data.js";
import { assess } from "./monitoring.js";

const Ctx = createContext(null);
export const useApp = () => useContext(Ctx);

export function AppProvider({ children }) {
  const [user, setUser] = useState(null);
  const [raw, setRaw] = useState(D.PATIENTS);   // routine monitoring records: no resistance data
  const [recs, setRecs] = useState(D.RECS);
  const [labs, setLabs] = useState(D.LABS);     // resistance results live only here
  const [mothers, setMothers] = useState(D.MOTHERS);
  const role = user ? D.ROLES[user.role] : null;

  // Resistance status is derived from the lab module. Risk, factors and urgency are derived from monitoring data.
  const labStatus = (id) => {
    const l = labs.filter((x) => x.patientId === id);
    if (!l.length) return { confirmed: null, susceptible: false };
    const top = Math.max(...Object.values(D.interpret(l.flatMap((x) => x.muts))));
    return { confirmed: top > 0 ? D.LEVELS[top] : null, susceptible: top === 0 };
  };
  const patients = raw.map((p) => ({ ...p, ...assess(p), ...labStatus(p.id) }));

  // Facility scoping: identifiable records only for the user's own facility. MoH gets counts via analytics, sys admin none.
  const scope = (arr, key = "facility") => (!user || D.NO_FACILITY.includes(user.role) ? [] : arr.filter((x) => x[key] === user.facility));
  const mine = user?.role === "moh" ? patients : scope(patients);
  const byId = (id) => patients.find((p) => p.id === id);

  const addPatient = (p) => setRaw((x) => [p, ...x]);
  const addLog = (id, entry) => setRaw((all) => all.map((p) => p.id !== id ? p : { ...p, logs: [...p.logs, entry], // history is appended, never overwritten
    ...(entry.regimen !== p.regimen ? { regimen: entry.regimen, regimenStart: entry.date, regimenChanges: p.regimenChanges + 1, prev: [...p.prev, p.regimen] } : {}) }));
  const addPickup = (id, pk) => setRaw((all) => all.map((p) => p.id === id ? { ...p, pickups: [...p.pickups, pk] } : p));
  const setRec = (id, patch) => setRecs((all) => all.map((r) => r.id === id ? { ...r, ...patch } : r));
  const addLab = (entry) => { setLabs((l) => [entry, ...l]); setRaw((all) => all.map((p) => p.id === entry.patientId ? { ...p, awaiting: false } : p)); };
  const updateMother = (id, patch) => setMothers((all) => all.map((m) => m.id === id ? { ...m, ...patch } : m));

  return <Ctx.Provider value={{ user, setUser, role, mine, scope, byId, patients, recs, labs, mothers, addPatient, addLog, addPickup, setRec, addLab, updateMother }}>{children}</Ctx.Provider>;
}