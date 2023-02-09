import logo from './logo.svg';
import React, { useState, useRef, useEffect, useCallback } from 'react'
import './App.css';
import GamePage from './pages/GamePage';
import {BrowserRouter,Routes,Route} from "react-router-dom";
import MyAccount from './pages/MyAccount';
import Withdraw from './pages/Withdraw';
import BuyTokens from './pages/BuyTokens';
import Rewards from './pages/Rewards';
import GetStarted from './pages/GetStarted';
import Register from './pages/Register';
import Login from './pages/Login';
import StartGame from './pages/StartGame';
export const userContext=React.createContext()

function App() {

  const [user, setUser] = useState(JSON.parse(localStorage.getItem(('user'))));

  const value = React.useMemo(() => {
    return {
      user,
      setUser,

    }
  }, [user]);

  return (
    <userContext.Provider value={value}> 
    <BrowserRouter>
    <Routes>
    <Route exact path="/" element={<GetStarted/>}/>
      <Route exact path="/golive" element={<StartGame/>}/>
      <Route exact path="/register" element={<Register/>}/>
      <Route exact path="/login" element={<Login/>}/>
      <Route exact path="/myaccount" element={<MyAccount/>}/>
      <Route exact path="/withdraw" element={<Withdraw/>}/>
      <Route exact path="/buytokens" element={<BuyTokens/>}/>
      <Route exact path="/rewards" element={<Rewards/>}/>
    
    </Routes>
    </BrowserRouter>
    </userContext.Provider>
  );
}

export default App;
