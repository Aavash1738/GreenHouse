import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomePage from "./Pages/HomePage";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import ProtectedRoutes from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";
import { useSelector } from "react-redux";
import Spinner from "./components/spinner";
import Users from "./Pages/adminview/Users";

function App() {
  const { loading } = useSelector((state) => state.alerts);
  return (
    <>
      <BrowserRouter>
        {loading ? (
          <Spinner />
        ) : (
          <Routes>
            <Route
              path="/"
              element={
                <ProtectedRoutes>
                  <HomePage />
                </ProtectedRoutes>
              }
            />
            <Route
              path="/admin/users"
              element={
                <ProtectedRoutes>
                  <Users />
                </ProtectedRoutes>
              }
            />
            <Route
              path="/login"
              element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              }
            />
            <Route
              path="/register"
              element={
                <PublicRoute>
                  <Register />
                </PublicRoute>
              }
            />
          </Routes>
        )}
      </BrowserRouter>
    </>
  );
}

export default App;
