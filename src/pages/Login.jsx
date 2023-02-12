import React, { useContext, useEffect, useState } from 'react'
import firebase, { createUserDocument } from '../external/firebase'
import axios from 'axios'
import { userContext } from '../App'
import { NavLink, useNavigate } from 'react-router-dom'
import jwt_decode from "jwt-decode"
import { Dropdown } from 'primereact/dropdown';
import OtpInput from 'react-otp-input';
import { auth } from '../external/firebase'
import { db } from '../external/firebase'
import { collection, addDoc, Timestamp } from 'firebase/firestore'
import { getDoc, doc } from "https://www.gstatic.com/firebasejs/9.8.4/firebase-firestore.js";

// import './DropdownDemo.css';

const Login = () => {
    const navigate = useNavigate();
    const { user, setUser } = useContext(userContext)
    const [userData, setUserData] = useState([])
    const [login, setLogin] = useState(false);
    const [data, setData] = useState({});
    const [picture, setPicture] = useState('');
    const [showfb, setShowfb] = useState(false);
    const [userGoogle, setuserGoogle] = useState({})
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [final, setfinal] = useState('');
    const [error, setError] = useState({});
    const [sent, setSent] = useState(false);
    const [emailVerified, setemailVerified] = useState(false)
    const google = window.google;

    const [selectedCode, setSelectedCode] = useState(null);
    const cities = [
        { name: 'India', code: '+ 91', value: '91' },
        { name: 'Turkey', code: '+ 90', value: '90' },
        { name: 'England', code: '+ 44', value: '44' },
        { name: 'Australia', code: '+ 61', value: '61' },
        { name: 'USA', code: '+ 1', value: '1' },
        { name: 'Cyprus', code: '+ 357', value: '357' }
    ];

    const onCityChange = async (e) => {
        setSelectedCode(e.value);
        console.log(selectedCode)

    }

    useEffect(() => {
        console.log(selectedCode, 'selectedcode')

    }, [selectedCode])








    // useEffect(() => {
    //     setInterval(() => {
    //         console.log(firebase.auth().currentUser.emailVerified,'verifiedemail')
    //        setemailVerified(firebase.auth().currentUser.emailVerified)
    //        if(emailVerified){
    //         navigate('golive')
    //        }
    //       }, 1000);
    // }, [])



    const loginwithemail = () => {

        // const auth = getAuth();
        firebase.auth().signInWithEmailAndPassword(email, password).then((result) => {
            console.log(result.user)
            db.collection("users").where('email', '==', email).get().then((res) => {
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

        }).catch(alert)

    }

    const checkemailverification = () => {
        setInterval(() => {
            firebase.auth().currentUser.reload()
            console.log(firebase.auth().currentUser)
            console.log(firebase.auth().currentUser.emailVerified, 'verifiedemail')

            if (firebase.auth().currentUser.emailVerified) {



            }

        }, 2000);

    }


    useEffect(() => {
        db.collection("users").onSnapshot((snapshot) => {
            setUserData(
                snapshot.docs.map((doc) => ({
                    id: doc.id,
                    data: doc.data(),
                }))
            );
        });
        console.log(userData);
    }, []);

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
            {
                !sent &&
                <>
                    <div className='inputFlex'>

                        <input type="text" value={email} onChange={(e) => { setEmail(e.target.value) }} placeholder='Email' />
                        <input type="text" value={password} onChange={(e) => { setPassword(e.target.value) }} placeholder='Password' />
                    </div>


                    <div className='columnCenter'>
                        {/* <button onClick={onSignInSubmit} className='getStartedBtn'>
                            Login with Phone
                        </button> */}
                        <button onClick={loginwithemail} className='getStartedBtn'>
                            Login
                        </button>
                        <div className='or'>OR</div>
                        <div id='SignInDiv'></div>
                        {/* <button onClick={onSignInSubmit} className='getStartedBtn'>
        Login with Google
    </button> */}
                        <NavLink to="/register" className="tripicon" >
                            <span>Dont have an Account? Register</span>
                        </NavLink>
                    </div>

                    {/* <div id="recaptcha-container"></div>
                    <div id="sign-in-button"></div> */}
                </>
            }


        </div>
    )
}

export default Login