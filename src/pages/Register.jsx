import React from 'react'

const Register = () => {
    return (
        <div className='register'>
            <div className='inputFlex'>
                <input type="text" placeholder='Name' />
                <input type="text" placeholder='Mobile Number' />
                <input type="text" placeholder='Email' />
            </div>
            <div className='columnCenter'>
                <button className='getStartedBtn'>
                    Register
                </button>
                {/* <span>Already have an Account? Login</span> */}
            </div>
        </div>
    )
}

export default Register