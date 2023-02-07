import React, { useContext, useEffect } from 'react'
import { Link, withRouter, NavLink, useNavigate } from "react-router-dom";
import { userContext } from '../App';
const GetStarted = () => {
  const navigate = useNavigate();
  const {user,setUser}=useContext(userContext)
  useEffect(() => {
    if(user!=null && user!=undefined){
  navigate('buytokens')
}

}, [])

  return (
    <div className='getstarted'>
     <NavLink to="/login"  >
    <button className='getStartedBtn'>Get Started</button>
    </NavLink>
    </div>
  )
}

export default GetStarted;