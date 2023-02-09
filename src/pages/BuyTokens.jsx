import React, { useContext, useState } from 'react'
import { userContext } from '../App'
import Bottombar from '../components/Bottombar'
import Paypal from '../components/Paypal'

const BuyTokens = () => {
  const { user, setUser } = useContext(userContext)
  const [checkout, setCheckout] = useState(false)
  return (
    <>
    { checkout ? (
      <Paypal/>
    ) 
    
    : (

      <div className='buyTokens'>
      <div className='columnCenter m-t-20'>
        Buy Tokens <br />

        current tokens : {user.tokens}
      </div>

      <div className='m-t-20 gap20 tokenbtns justifycenter'>
        <button>5€</button>
        <button>10€</button>
        <button>20€</button>
        <button>50€</button>
        <button>100€</button>
      </div>
      <div className='m-t-20 gap20 tokenbtns justifycenter'>
        <button onClick={() => {setCheckout(true)}}>Checkout</button>
      </div>

      </div>
    ) }
   
      <Bottombar />
   
    </>
  )
}

export default BuyTokens