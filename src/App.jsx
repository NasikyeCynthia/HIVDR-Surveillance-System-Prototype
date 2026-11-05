import { Routes, Route, Navigate } from "react-router-dom";
import { useApp } from "./store.jsx";
import Login from "./pages/Login.jsx";
import Shell from "./Shell.jsx";

export default function App() {
  const { user } = useApp();
  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/" replace /> : <Login />} />
      <Route path="*" element={user ? <Shell /> : <Navigate to="/login" replace />} />
    </Routes>
  );
}
