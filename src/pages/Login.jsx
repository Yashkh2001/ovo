import React, { useContext, useEffect, useState } from 'react'
import firebase, { createUserDocument } from '../external/firebase'
import axios from 'axios'
import { userContext } from '../App'
import { useNavigate } from 'react-router-dom'
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
    const [userFacebook, setuserFacebook] = useState({})
    const [number, setNumber] = useState('')
    const [name, setName] = useState('')

    const [otp, setotp] = useState(0);
    const [final, setfinal] = useState('');
    const [error, setError] = useState({});
    const [sent, setSent] = useState(false);
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



    const configureCaptcha = () => {

        window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('sign-in-button', {
            'size': 'invisible',
            'callback': (response) => {
                // reCAPTCHA solved, allow signInWithPhoneNumber.
                this.onSignInSubmit();
                console.log("Recaptca varified")
            },
            defaultCountry: "IN"
        });
    }

    const onSignInSubmit = (e) => {
        e.preventDefault()
        // if ((number.length > 10 || number.length < 10)) {
        //     setError({ number: true });
        //     return;
        // }
        // else {
        //     setError({});
        // }
        if ((name == null || name == '')) {
            setError({ name: true });
            return;
        }
        else {
            setError({});
        }

        if (selectedCode == null) {
            setError({ code: true });
            return;
        } else {
            setError({});
        }



        configureCaptcha()
        const phoneNumber = `+${selectedCode}` + number
        console.log(phoneNumber)
        const appVerifier = window.recaptchaVerifier;
        firebase.auth().signInWithPhoneNumber(phoneNumber, appVerifier)
            .then((confirmationResult) => {
                setfinal(confirmationResult);
                // console.log(final)
                // SMS sent. Prompt user to type the code from the message, then sign the
                // user in with confirmationResult.confirm(code).
                window.confirmationResult = confirmationResult;
                console.log(final)
                console.log(window.confirmationResult)
                alert("OTP has been sent on " + phoneNumber)
                setSent(true)
                // ...
            }).catch((error) => {
                // Error; SMS not sent
                // ...
                console.log("SMS not sent")
            });

    }

    // Validate OTP
    const handleChange = (otp) => setotp(otp);

    const ValidateOtp = () => {
        if (otp === null || final === null)
            return;
        final.confirm(otp).then((result) => {


            db.collection("users").where('phone', '==', number).get().then((res) => {
                if (!res.empty) {
                    db.collection("users").where('phone', '==', number).get().then((res) => {
                        res.docs.forEach((doc) => {
                            let userData=doc.data()
                            userData['id']=doc.id
                            console.log(doc.id, 'data')
                            console.log(doc.data(), 'data')
                            localStorage.setItem('user', JSON.stringify(userData))
                            setUser(userData)
                            navigate('/golive')
                        })
                    })

                } else {
                    db.collection("users").add({
                        name: name,
                        phone: number,
                        countryCode: selectedCode,
                        tokens: 5,
                        loginwith: 'PHONE'
                    }).then((res) => {
                        db.collection("users").where('phone', '==', number).get().then((res) => {
                            res.docs.forEach((doc) => {
                                let userData=doc.data()
                                userData['id']=doc.id
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

            // db.collection("users").add({
            //     name: name,
            //     phone: number,
            //     countryCode: selectedCode,
            //     tokens: 5,
            //     loginwith: 'PHONE'
            // }).then((res) => {
            //     console.log(res)
            // }).catch(alert);

            // axios.post("http://localhost:3001/login", {
            //     number: number,
            //     loginwith: 'PHONE'
            // }).then((response) => {
            //     setUser(response.data)
            //     console.log(response);
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

        }).catch((err) => {
            setError({ otp: true });
        })



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
                        let userData=doc.data()
                        userData['id']=doc.id
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
                    tokens: 5,
                    email: userObject.email,
                    loginwith: 'GOOGLE'
                }).then((res) => {
                    db.collection("users").where('email', '==', userObject.email).get().then((res) => {
                        res.docs.forEach((doc) => {
                            let userData=doc.data()
                            userData['id']=doc.id
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
                        <input type="text" value={name} placeholder='Enter your name' onChange={(e) => { setName(e.target.value) }} />
                        {error.name &&
                            <p className='f-12 color-red bot3'>Please enter a name</p>
                        }
                        <input type="number" value={number} placeholder='Enter mobile number' onChange={(e) => { setNumber(e.target.value) }} />
                        {error.number &&
                            <p className='f-12 color-red bot3'>Please enter a valid mobile number</p>
                        }
                        <input type="text" placeholder='Email' />
                    </div>
                    <div style={{ paddingLeft: '20px', paddingRight: '20px' }} className='m-b-20'>
                        <Dropdown value={selectedCode} options={cities} onChange={onCityChange} optionLabel="code" placeholder="Select Country Code" />
                    </div>
                    <div className='displayCenter'>
                        {error.code &&
                            <p className='f-12 color-red bot3'>Please select code</p>
                        }
                    </div>
                    <div className='columnCenter'>
                        <button onClick={onSignInSubmit} className='getStartedBtn'>
                            Login with Phone
                        </button>
                        <div className='or'>OR</div>
                        <div id='SignInDiv'></div>
                        {/* <button onClick={onSignInSubmit} className='getStartedBtn'>
        Login with Google
    </button> */}
                        {/* <span>Dont have an Account? Register</span> */}
                    </div>

                    <div id="recaptcha-container"></div>
                    <div id="sign-in-button"></div>
                </>
            }
            {
                sent &&
                <>
                    <p className='f-14 m-b-10 padclass f-500 m-t-40 opacity7 pad20'>A 6 digit code has been sent to +{selectedCode} <br /> {number}</p>
                    <div className='otpdiv'>
                        <OtpInput
                            value={otp}
                            onChange={handleChange}
                            numInputs={6}
                        />
                        {error.otp &&
                            <p className='f-12 color-red bot3 f-600'>Invalid Otp</p>
                        }
                    </div>
                    <div className="bluebtn padclass displayCenter">
                        <button className='getStartedBtn m-t-20' onClick={ValidateOtp}>Continue</button>
                    </div>
                </>

            }

        </div>
    )
}

export default Login