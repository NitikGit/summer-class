import { NavLink } from "react-router-dom";
import { useContext } from "react";
import { AuthContext, type IAuthContext } from "../App";

function AboutUsPage() {
  const { isAuth, roleState } = useContext<IAuthContext>(AuthContext);

  if (isAuth && roleState === "admin") {
    return (
      <div className="stack">
        <section className="card">
          <h1 style={{ margin: 0 }}>About This Admin Console</h1>
          <p className="muted">Design, publish, and monitor quizzes with a clean, efficient workflow.</p>
          <div className="row">
            <NavLink to="/admin/questionset/create"><button className="btn btn-primary btn-lg">Create Question Set</button></NavLink>
            <NavLink to="/questionset/list"><button className="btn btn-outline btn-lg">Manage Question Sets</button></NavLink>
          </div>
        </section>

        <section style={{ display: "grid", gap: "1rem", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))" }}>
          <div className="card">
            <h3 style={{ margin: 0 }}>Structured Authoring</h3>
            <p className="muted">Craft questions with clarity and maintain a consistent experience.</p>
          </div>
          <div className="card">
            <h3 style={{ margin: 0 }}>Reliable Grading</h3>
            <p className="muted">Single-answer grading ensures transparent, predictable outcomes.</p>
          </div>
          <div className="card">
            <h3 style={{ margin: 0 }}>Minimalist UI</h3>
            <p className="muted">Reduce friction for authors and participants alike.</p>
          </div>
        </section>
      </div>
    );
  }

  if (isAuth && roleState === "professional") {
    return (
      <div className="stack">
        <section className="card">
          <h1 style={{ margin: 0 }}>About This Platform</h1>
          <p className="muted">A focused place to practice, assess, and grow with clarity.</p>
          <div className="row">
            <NavLink to="/questionset/list"><button className="btn btn-primary btn-lg">Find a Quiz</button></NavLink>
            <NavLink to="/profile"><button className="btn btn-outline btn-lg">View Profile</button></NavLink>
          </div>
        </section>

        <section style={{ display: "grid", gap: "1rem", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))" }}>
          <div className="card">
            <h3 style={{ margin: 0 }}>Stay Focused</h3>
            <p className="muted">Minimal UI so you can concentrate on the question at hand.</p>
          </div>
          <div className="card">
            <h3 style={{ margin: 0 }}>Instant Results</h3>
            <p className="muted">Clear scoring and immediate feedback after submission.</p>
          </div>
          <div className="card">
            <h3 style={{ margin: 0 }}>Keep Improving</h3>
            <p className="muted">Track your progress from your profile.</p>
          </div>
        </section>
      </div>
    );
  }

  // Guest/default
  return (
    <div className="stack">
      <section className="card">
        <h1 style={{ margin: 0 }}>About Us</h1>
        <p className="muted">Create question sets and attempt quizzes with a clean, focused experience.</p>
        <div className="row">
          <NavLink to="/register"><button className="btn btn-primary btn-lg">Get Started</button></NavLink>
          <NavLink to="/questionset/list"><button className="btn btn-outline btn-lg">Browse Quizzes</button></NavLink>
        </div>
      </section>
      <section style={{ display: "grid", gap: "1rem", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))" }}>
        <div className="card">
          <h3 style={{ margin: 0 }}>Create Questions</h3>
          <p className="muted">Admins can craft clear, well-structured question sets.</p>
        </div>
        <div className="card">
          <h3 style={{ margin: 0 }}>Attempt Quizzes</h3>
          <p className="muted">Professionals can focus on the task with a minimal UI.</p>
        </div>
        <div className="card">
          <h3 style={{ margin: 0 }}>Fair Scoring</h3>
          <p className="muted">Accurate evaluation and instant results.</p>
        </div>
      </section>
    </div>
  );
}

export default AboutUsPage;
