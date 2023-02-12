import React, { useContext, useEffect, useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom';
import { userContext } from '../App';
import firebase, { createUserDocument } from '../external/firebase'
import { db } from '../external/firebase'
import jwt_decode from "jwt-decode"
import Swal from 'sweetalert2';
import emailjs from '@emailjs/browser';

const Register = () => {

    const navigate = useNavigate();
    const { user, setUser } = useContext(userContext)
    const [userGoogle, setuserGoogle] = useState({})
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const google = window.google;
    const [error, setError] = useState({});




    // useEffect(() => {
    //     window.onbeforeunload = confirmExit;
    //     function confirmExit() {
    //         alert('You might lose the changes you made')
    //         if (firebase.auth().currentUser != null) {
    //             if (firebase.auth().currentUser.emailVerified = false) {
    //                 firebase.auth().currentUser.delete().then((res) => {
    //                     console.log('user deleted')
    //                 })
    //             }

    //         }

    //     }
    //     return () => {
    //         if (firebase.auth().currentUser != null) {
    //             firebase.auth().currentUser.delete().then((res) => {
    //                 console.log('user deleted')
    //             })
    //         }
    //     }
    // }, [])

    const loginwithemail = () => {

        if ((name == null || name == '')) {
            setError({ name: true });
            return;
        }

        if ((password == null || password == '')) {
            setError({ password: true });
            return;
        }

        db.collection("users").where('email', '==', email).get().then((res) => {

            if (!res.empty) {
                setError({ duplicate: true });
            } else {
                setError({ duplicate: false });
                firebase.auth().createUserWithEmailAndPassword(email, password).then((result) => {
                    console.log(result.user)
                    result.user.sendEmailVerification().then((res) => {
                        console.log(res)
                        Swal.fire({
                            text: 'Verification Link has been sent to your email address!',
                            icon: "success",
                        })
                        checkemailverification()


                    }).catch(alert)
                }).catch(alert)
            }
        })
        // const auth = getAuth();


    }

    const checkemailverification = () => {

        const executingFunction = () => {
            firebase.auth().currentUser.reload()
            console.log(firebase.auth().currentUser)
            console.log(firebase.auth().currentUser.emailVerified, 'verifiedemail')

            if (firebase.auth().currentUser.emailVerified) {
                clearInterval(intervalId);
                db.collection("users").add({
                    name: name,
                    tokens: 0,
                    email: email,
                    loginwith: 'EMAIL'
                }).then((res) => {

                    const templateParams = {
                        name: name,
                        email: email
                    };

                    db.collection("users").where('email', '==', email).get().then((res) => {
                        res.docs.forEach((doc) => {
                            let userData = doc.data()
                            userData['id'] = doc.id
                            console.log(doc.id, 'data')
                            console.log(doc.data(), 'data')
                            localStorage.setItem('user', JSON.stringify(userData))
                            setUser(userData)

                            // emailjs.send('service_z48t3oc', 'template_1ermxnu', templateParams, 'LH5wNxDjsIog4KlcJ')
                            //     .then(function (response) {
                            //         console.log('SUCCESS!', response.status, response.text);
                            //         navigate('/golive')
                            //     }, function (err) {
                            //         console.log('FAILED...', err);
                            //     });
                            navigate('/golive')
                        
                        })
                    })
                }).catch(alert);

            }
        }

        const intervalId = setInterval(executingFunction, 2000)




    }


    function handleCallbackResponse(response) {

        const userObject = jwt_decode(response.credential)

        console.log(userObject)
        setuserGoogle(userObject)


        // axios.post("http://localhost:3001/login", {
        //     name: userObject.name,
        //     googleId: userObject.sub,
        //     email: userObject.email,
        //     loginwith: 'GOOGLE'
        // }).then((response) => {
        //     console.log(response.data);
        //     setUser(response.data)
        //     const userdata = response.data

        //     setTimeout(() => {
        //         axios.post("http://localhost:3001/gettoken", {
        //             id: userdata.id
        //         }).then((response) => {

        //             console.log(response);
        //             localStorage.setItem('token', response.data)
        //         });
        //         console.log(userdata, 'data of user')
        //         localStorage.setItem('user', JSON.stringify(userdata))
        //         setUser(userdata)
        //         navigate('/completeprofile')
        //     }, 600);

        // });

        db.collection("users").where('email', '==', userObject.email).get().then((res) => {
            if (!res.empty) {
                db.collection("users").where('email', '==', userObject.email).get().then((res) => {
                    res.docs.forEach((doc) => {
                        let userData = doc.data()
                        userData['id'] = doc.id
                        console.log(doc.id, 'data')
                        console.log(doc.data(), 'data')
                        localStorage.setItem('user', JSON.stringify(userData))
                        setUser(userData)
                        navigate('/golive')
                    })
                })

            } else {
                db.collection("users").add({
                    name: userObject.name,
                    tokens: 0,
                    email: userObject.email,
                    loginwith: 'GOOGLE'
                }).then((res) => {
                    db.collection("users").where('email', '==', userObject.email).get().then((res) => {
                        res.docs.forEach((doc) => {
                            let userData = doc.data()
                            userData['id'] = doc.id
                            console.log(doc.id, 'data')
                            console.log(doc.data(), 'data')
                            localStorage.setItem('user', JSON.stringify(userData))
                            setUser(userData)
                            navigate('/golive')
                        })
                    })
                }).catch(alert);
            }
        })





    }

    useEffect(() => {
        setTimeout(() => {
            google.accounts.id.initialize({
                client_id: "871305342860-rvuntpt7hp575ajksvbfqhcck0hk5evg.apps.googleusercontent.com",
                callback: handleCallbackResponse
            })

            google.accounts.id.renderButton(
                document.getElementById('SignInDiv'),
                { theme: "outline", size: "large", width: '300', height: '80' }
            )
        }, 100);


    }, [])


    return (
        <div className='register'>

            <>
                <div className='inputFlex'>
                    <input type="text" value={name} placeholder='Enter your name' onChange={(e) => { setName(e.target.value) }} />
                    {error.name &&
                        <p className='f-12 color-red bot3'>This enter your name</p>
                    }
                    <input type="text" value={email} onChange={(e) => { setEmail(e.target.value) }} placeholder='Email' />
                    {error.duplicate &&
                        <p className='f-12 color-red bot3'>This email has already been registered</p>
                    }
                    <input type="text" value={password} onChange={(e) => { setPassword(e.target.value) }} placeholder='Password' />
                    {error.password &&
                        <p className='f-12 color-red bot3'>This enter your password</p>
                    }
                </div>


                <div className='columnCenter'>
                    {/* <button onClick={onSignInSubmit} className='getStartedBtn'>
                        Login with Phone
                    </button> */}
                    <button onClick={loginwithemail} className='getStartedBtn'>
                        Register
                    </button>
                    <div className='or'>OR</div>
                    {/* <div id='SignInDiv'></div> */}
                    {/* <button onClick={onSignInSubmit} className='getStartedBtn'>
    Login with Google
</button> */}
                    <NavLink to="/login" className="tripicon" >
                        <span>Dont have an Account? Login</span>
                    </NavLink>
                </div>

                {/* <div id="sign-in-button"></div> */}
            </>



        </div>
    )
}

export default Register