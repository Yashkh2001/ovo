import React, { useEffect, useRef } from 'react'

const Paypal = () => {

    useEffect(() => {
        window.paypal
          .Buttons({
            createOrder: (data, actions, err) => {
              return actions.order.create({
                intent: "CAPTURE",
                purchase_units: [
                  {
                    description: "Tokens",
                    amount: {
                      currency_code: "USD",
                      value: 20,
                    },
                  },
                ],
              });
            },
            onApprove: async (data, actions) => {
              const order = await actions.order.capture();
              console.log(order);
            },
            onError: (err) => {
              console.log(err);
            },
          })
          .render(paypal.current);
      }, []);

    const paypal=useRef()

  return (

        <div className='m-t-20' ref={paypal}></div>
    
  )
}

export default Paypal