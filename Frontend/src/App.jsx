import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Signup from "./components/Signup";
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import { useAuth } from './context/AuthProvider';

function App() {
  const [authUser, setAuthUser] = useAuth();
  const [showLogin, setShowLogin] = useState(false); // 🔁 state to toggle

  const handleSwitch = () => {
    setShowLogin(prev => !prev); // toggle between login and signup
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <>
              {showLogin ? <Login /> : <Signup />}
              <div style={{ textAlign: 'center', marginTop: '1rem' }}>
                {showLogin ? (
                  <p>
                    Don’t have an account?{" "}
                    <button onClick={handleSwitch} style={{ color: 'blue' }}>Sign Up</button>
                  </p>
                ) : (
                  <p>
                    Already have an account?{" "}
                    <button onClick={handleSwitch} style={{ color: 'blue' }}>Login</button>
                  </p>
                )}
              </div>
            </>
          }
        />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
