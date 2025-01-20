import "./App.css";
import "./mock/db";
import { LoginForm } from "./login-form";
import { constants } from "./constants";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ProtectedRoutes from "./utils/protected.routes";
import { AuthService } from "./services/auth/auth.service";
import AuthContext from "./utils/contexts";
import { ThemeProvider } from "@/components/theme-provider";

import Page from "./app/dashboard/page";

function App() {
  const authService = new AuthService();
  const currentUser = authService.user();

  return (
    <AuthContext.Provider value={currentUser}>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <BrowserRouter>
          <Routes>
            <Route element={<LoginForm />} path={constants.routes.login} />
            <Route element={<ProtectedRoutes />}>
              <Route element={<Page />} path={"*"} />
            </Route>
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </AuthContext.Provider>
  );
}

export default App;
