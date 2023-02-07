import React, { useContext } from 'react'
import { userContext } from '../App'
import Bottombar from '../components/Bottombar'

const BuyTokens = () => {
  const {user,setUser}=useContext(userContext)
  return (
    <div>BuyTokens
    current tokens : {user.tokens}
     <Bottombar/>
    </div>
  )
}

export default BuyTokens