import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { userContext } from '../App'
import Bottombar from '../components/Bottombar'
import Paypal from '../components/Paypal'
import { SelectButton } from 'primereact/selectbutton';
import Swal from 'sweetalert2'

const BuyTokens = () => {
  const navigate = useNavigate();
  const { user, setUser } = useContext(userContext)
  const [checkout, setCheckout] = useState(false)

  const options = [5, 10, 20, 50, 100];
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (user == null) {
      navigate('/login')
    }
  }, [])


  useEffect(() => {
    console.log(value,'value')
  }, [value])

  const gotocheckoutpage=()=>{
    if(value==null || value==0){
      Swal.fire({
        icon:'warning',
        text:'Please select your token range'
      })
    }else{
      setCheckout(true)
    }
   
  }

  return (
    <>
      {checkout ? (
        <div className='m-t-20'>
        <Paypal tokens={value} />
        </div>
      )

        : (

          <div className='buyTokens'>
            <div className='columnCenter m-t-20'>

              Buy Tokens   {
                user?.tokens == 0 &&
                <> to get started!</>
              }  <br />

              current tokens : {user?.tokens}
            </div>

            <div className='m-t-20 gap20 tokenbtns justifycenter'>
            <SelectButton value={value} onChange={(e) => setValue(e.value)} options={options} />
              {/* <button>5€</button>
              <button>10€</button>
              <button>20€</button>
              <button>50€</button>
              <button>100€</button> */}
            </div>
            <div className='m-t-20 gap20 tokenbtns justifycenter'>
            <button >Custom</button>
              <button onClick={gotocheckoutpage}>Checkout</button>
            </div>

          </div>
        )}

      <Bottombar />

    </>
  )
}

export default BuyTokens