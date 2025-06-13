import React from 'react';
import Right from './home/right/Right';
import Left from './home/left/Left';
import Logout from './home/left1/Logout';
import Signup from "./components/Signup";
import Login from './components/Login';
import { useAuth } from './context/AuthProvider';

function App() {
  const [authUser, setAuthUser] = useAuth();
  console.log(authUser);

  return (
    <>
     
      
      {/* Uncomment one of these depending on the state */}
      {/* <Login /> */}
      <Signup />
    </>
  );
}

export default App;
