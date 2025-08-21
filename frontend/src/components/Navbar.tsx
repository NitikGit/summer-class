import { NavLink } from "react-router-dom";
import { AuthContext, type IAuthContext } from "../App";
import { useContext } from "react";

function Navbar() {
  const { isAuth, roleState, setAuthState } = useContext<IAuthContext>(AuthContext);

  const logoutHandler = () => {
    localStorage.removeItem("accessToken");
    window.location.reload();
  };

  return (
    <div style={{ 
      display: "flex", 
      justifyContent: "center", 
      padding: "1rem",
      background: "rgba(0,0,0,0.05)",
      borderBottom: "1px solid rgba(255,255,255,0.1)"
    }}>
      <nav style={{ 
        display: "flex", 
        gap: "0.75rem", 
        alignItems: "center", 
        background: "rgba(0,0,0,0.1)",
        padding: "0.75rem 1.5rem", 
        borderRadius: "var(--radius-md)",
        backdropFilter: "blur(6px)",
        maxWidth: "100%",
        flexWrap: "wrap",
        justifyContent: "center"
      }}>
        <NavLink to="/">Home</NavLink>
        <NavLink to="/about">About Us</NavLink>
        {isAuth ? (
          <>
            <NavLink to="/profile">Profile</NavLink>
            <NavLink to="/questionset/list">QuestionSet</NavLink>
            {roleState === "admin" && (
              <NavLink to="/admin/questionset/create">Create Question</NavLink>
            )}
            <button onClick={logoutHandler} className="btn btn-outline btn-sm">Logout</button>
          </>
        ) : (
          <>
            <NavLink to="/register">Register</NavLink>
            <NavLink to="/login">Login</NavLink>
          </>
        )}
      </nav>
    </div>
  );
}

export default Navbar;