import React, { useContext } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";
import { AuthContext, AuthProvider } from "./Context/AuthContext";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import UserList from "./pages/UserList";
import UserForm from "./pages/UserForm";
import UserDetails from "./pages/UserDetails";
import EditUser from "./pages/EditUser";
import NavBar from "./components/NavBar1";
import AuthCallback from "./pages/AuthCallback";
import UserCsvPage from "./pages/UserCsvPage";

const NavbarWrapper = () => (
  <>
    <NavBar />
    <Outlet />
  </>
);

const ProtectedRoute = ({ children }) => {
  const { accessToken } = useContext(AuthContext);

  if (!accessToken) return <Navigate to="/login" replace />;

  return children;
};

const PublicRoute = ({ children }) => {
  const { accessToken } = useContext(AuthContext);
  return accessToken ? <Navigate to="/home" replace /> : children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route
            path="/login"
            element={
              <PublicRoute>
                <LoginPage />
              </PublicRoute>
            }
          />

          <Route
            path="/auth/callback"
            element={
              <PublicRoute>
                <AuthCallback />
              </PublicRoute>
            }
          />

          <Route path="/" element={<LoginPage />} />

          <Route
            element={
              <ProtectedRoute>
                <NavbarWrapper />
              </ProtectedRoute>
            }
          >
            <Route path="/home" element={<HomePage />} />
            <Route path="/users" element={<UserList />} />
            <Route path="/users/:id" element={<UserDetails />} />
            <Route path="/users/edit/:id" element={<EditUser mode="edit" />} />
            <Route path="/new" element={<UserForm />} />
            <Route path="/users/csv" element={<UserCsvPage/>} />
          </Route>

          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
