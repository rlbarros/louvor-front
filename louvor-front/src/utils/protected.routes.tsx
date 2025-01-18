import { constants } from "@/constants";
import { AuthService } from "@/services/auth/auth.service";
import { Outlet, Navigate } from "react-router-dom";

const ProtectedRoutes = () => {
  const authService = new AuthService();
  const isUserLogged = authService.isUserLogged();
  return isUserLogged ? <Outlet /> : <Navigate to={constants.routes.login} />;
};

export default ProtectedRoutes;
