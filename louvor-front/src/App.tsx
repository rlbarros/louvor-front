import "./App.css";
import "./mock/db";
import { LoginForm } from "./LoginForm";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { constants } from "./constants";
import ProtectedRoutes from "./utils/protected.routes";
import { Styles } from "./Styles";
import { AuthService } from "./services/auth/auth.service";
import AuthContext from "./utils/constants";

function App() {
  const authService = new AuthService();
  const currentUser = authService.user();
  return (
    <AuthContext.Provider value={currentUser}>
      <BrowserRouter>
        <Routes>
          <Route element={<LoginForm />} path={constants.routes.login} />

          <Route element={<ProtectedRoutes />}>
            <Route element={<Styles />} path={constants.routes.home} />
            <Route element={<Styles />} path={constants.routes.styles} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthContext.Provider>
  );
  //return <Styles />;
}

export default App;
