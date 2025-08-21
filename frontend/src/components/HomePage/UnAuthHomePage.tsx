import { NavLink } from "react-router-dom";

function UnAuthHomePage() {
  return (
    <div className="card" style={{ display: "grid", gap: "0.75rem" }}>
      <h2 style={{ margin: 0 }}>Welcome</h2>
      <p className="muted">Please login or register to continue.</p>
      <div style={{ display: "flex", gap: "0.5rem" }}>
        <NavLink to="/login"><button>Login</button></NavLink>
        <NavLink to="/register"><button className="pill">Register</button></NavLink>
      </div>
    </div>
  );
}

export default UnAuthHomePage;
