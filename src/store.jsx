import { createContext, useContext, useState } from "react";
import * as D from "./data.js";

const Ctx = createContext(null);
export const useApp = () => useContext(Ctx);

export function AppProvider({ children }) {
  const [user, setUser] = useState(null);
  const [patients, setPatients] = useState(D.PATIENTS);
  const [recs, setRecs] = useState(D.RECS);
  const [labs, setLabs] = useState(D.LABS);
  const [mothers, setMothers] = useState(D.MOTHERS);
  const role = user ? D.ROLES[user.role] : null;
  // Facility scoping: identifiable records only for the user's own facility. MoH gets counts via analytics, sys admin none.
  const scope = (arr, key = "facility") => (!user || D.NO_FACILITY.includes(user.role) ? [] : arr.filter((x) => x[key] === user.facility));
  const mine = user?.role === "moh" ? patients : scope(patients);
  const byId = (id) => patients.find((p) => p.id === id);

  const addPatient = (p) => setPatients((x) => [p, ...x]);
  const addLog = (id, entry) => setPatients((all) => all.map((p) => p.id !== id ? p : { ...p, logs: [...p.logs, entry], regimen: entry.regimen,
    risk: D.quickRisk(entry.vl, entry.adh), urgent: D.quickRisk(entry.vl, entry.adh) === "High" })); // history is appended, never overwritten
  const setRec = (id, patch) => setRecs((all) => all.map((r) => r.id === id ? { ...r, ...patch } : r));
  const addLab = (entry, level) => {
    setLabs((l) => [entry, ...l]);
    setPatients((all) => all.map((p) => p.id === entry.patientId ? { ...p, awaiting: false, confirmed: level === "Susceptible" ? null : level } : p));
  };
  const updateMother = (id, patch) => setMothers((all) => all.map((m) => m.id === id ? { ...m, ...patch } : m));

  return <Ctx.Provider value={{ user, setUser, role, mine, scope, byId, patients, recs, labs, mothers, addPatient, addLog, setRec, addLab, updateMother }}>{children}</Ctx.Provider>;
}
