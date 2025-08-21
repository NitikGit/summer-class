import { NavLink } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="card" style={{ display: "grid", gap: "0.25rem" }}>
      <span className="muted">{label}</span>
      <strong style={{ fontSize: "1.4rem" }}>{value}</strong>
    </div>
  );
}

function AdminHome() {
  const [userCount, setUserCount] = useState<number>(0);

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) return;
    axios
      .get("http://localhost:4000/users/list", {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      .then((res) => {
        const users = res?.data?.users || [];
        setUserCount(users.length);
      })
      .catch(() => {});
  }, []);

  return (
    <div style={{ display: "grid", gap: "1rem" }}>
      <div className="card" style={{ display: "grid", gap: "0.5rem" }}>
        <h2 style={{ margin: 0 }}>Welcome, Admin</h2>
        <p className="muted">Manage quizzes and view activity.</p>
        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
          <NavLink to="/admin/questionset/create"><button>Create Question Set</button></NavLink>
          <NavLink to="/questionset/list"><button className="pill">View Question Sets</button></NavLink>
        </div>
      </div>

      <div style={{ display: "grid", gap: "0.75rem", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))" }}>
        <StatCard label="Total Users" value={userCount} />
        <StatCard label="Question Sets" value={<span className="muted">Browse list</span> as unknown as string} />
      </div>
    </div>
  );
}

export default AdminHome;


