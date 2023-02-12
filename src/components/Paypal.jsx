import React, { useContext, useEffect, useRef } from 'react'
import Swal from 'sweetalert2';
import { userContext } from '../App';
import emailjs from '@emailjs/browser';
import { db } from '../external/firebase'

const Paypal = (props) => {
  const { user, setUser } = useContext(userContext)
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
                  value: props.tokens / 5,
                },
              },
            ],
          });
        },
        onApprove: async (data, actions) => {
          const order = await actions.order.capture();
          console.log(order);

          const templateParams = {
            email: user.email
          };

          db.collection('users').doc(user.id).update({
            tokens: user.tokens + props.tokens
          }).then(() => {

            user.tokens = user.tokens + props.tokens
            localStorage.setItem('user', JSON.stringify(user))
            Swal.fire({
              text: `${props.tokens} tokens have been added to your account!`,
              icon: 'success',
            })

            emailjs.send('service_z48t3oc', 'template_exmyyrv', templateParams, 'LH5wNxDjsIog4KlcJ')
              .then(function (response) {
                console.log('SUCCESS!', response.status, response.text);
                window.location.reload()
              }, function (err) {
                console.log('FAILED...', err);
              });

          }).catch(alert)

        },
        onError: (err) => {
          console.log(err);
        },
      })
      .render(paypal.current);
  }, []);

  const paypal = useRef()

  return (

    <div ref={paypal}></div>

  )
}

export default Paypal