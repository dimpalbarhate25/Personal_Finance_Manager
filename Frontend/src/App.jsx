import React from "react";
import Dashboard from "./components/Dashboard";
import Signup from "./components/Signup";
import Login from "./components/Login";
import { useAuth } from "./context/AuthProvider";
import { Navigate, Route, Routes } from "react-router-dom";

function App() {
  const [authUser, setAuthUser] = useAuth();
  console.log(authUser);

  return (
    <Routes>
      <Route
        path="/"
        element={
          authUser ? (
            <div className="w-screen h-screen">
              <Dashboard />
            </div>
          ) : (
            <Navigate to="/login" />
          )
        }
      />
      <Route
        path="/login"
        element={authUser ? <Navigate to="/" /> : <Login />}
      />
      <Route
        path="/signup"
        element={authUser ? <Navigate to="/" /> : <Signup />}
      />
    </Routes>
  );
}

export default App;
