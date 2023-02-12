import React, { useContext, useEffect, useState } from 'react'
import Bottombar from '../components/Bottombar'
import BlankProfile from '../assets/user.png'
import { userContext } from '../App'

const MyAccount = () => {
  const { user, setUser } = useContext(userContext)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")

  const uploadImage = () => {

  }

  useEffect(() => {
    setName(user.name)
  }, [])


  const changeName = event => {
    setName(event.target.value)
  }


  return (
    <>
      <div className='myaccount'>
        <p style={{ textAlign: 'center', marginBottom: '20px' }}>My Account</p>
        <div className='justifyspace'>
          <div>
            <div>
              <p>Name</p> <input onChange={changeName} value={name} /> <br />
            </div>
            <div>
              <p className='m-t-10'>Email</p> <input readOnly value={user.email} /> <br />
            </div>
            <span>{user?.phone}</span>
          </div>

          <div>
            <div onClick={uploadImage} className='profilepic'>
              <img src={BlankProfile} alt="" />
              <i className='fas fa-edit'></i>
            </div>
          </div>
        </div>
        <div>

        </div>
        <Bottombar />
      </div>
    </>
  )
}

export default MyAccount