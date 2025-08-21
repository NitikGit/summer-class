import { NavLink } from "react-router-dom";

function ProfessionalHome() {
  return (
    <div className="card" style={{ display: "grid", gap: "0.75rem" }}>
      <h2 style={{ margin: 0 }}>Welcome</h2>
      <p className="muted">Attempt available quizzes and view your profile.</p>
      <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
        <NavLink to="/questionset/list"><button>Attempt Quiz</button></NavLink>
        <NavLink to="/profile"><button className="pill">Profile</button></NavLink>
      </div>
    </div>
  );
}

export default ProfessionalHome;


