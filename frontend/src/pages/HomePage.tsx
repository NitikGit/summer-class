import { useContext } from "react";
import { AuthContext, type IAuthContext } from "../App";
import AdminHome from "../components/HomePage/AdminHome";
import ProfessionalHome from "../components/HomePage/ProfessionalHome";
import UnAuthHomePage from "../components/HomePage/UnAuthHomePage";

function HomePage() {
  const { isAuth, roleState } = useContext<IAuthContext>(AuthContext);
  if (!isAuth) return <UnAuthHomePage />;
  if (roleState === "admin") return <AdminHome />;
  return <ProfessionalHome />;
}

export default HomePage;
