import React from 'react'
import { Link, withRouter, NavLink } from "react-router-dom";
const GetStarted = () => {
  return (
    <div className='getstarted'>
     <NavLink to="/login"  >
    <button className='getStartedBtn'>Get Started</button>
    </NavLink>
    </div>
  )
}

export default GetStarted;