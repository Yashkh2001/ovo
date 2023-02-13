import React, { useContext, useEffect, useRef, useState } from 'react'
import Bottombar from '../components/Bottombar'
import BlankProfile from '../assets/user.png'
import { userContext } from '../App'
import { InputText } from 'primereact/inputtext';
import firebase, { storage } from '../external/firebase'
import { getStorage, ref, uploadBytes } from "firebase/storage";
import { db } from '../external/firebase'
import { v4 } from 'uuid'

const MyAccount = () => {
  const myImage = useRef(null);
  const myImage1 = useRef(null);
  const { user, setUser } = useContext(userContext)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [idDocument, setIdDocument] = useState([])
  const [phone, setPhone] = useState("")
  const [username, setUsername] = useState("")

  useEffect(() => {
    console.log(user.addressdoc, 'addressdoc')
  }, [])


  const clickImage = () => {
    console.log(myImage)
    myImage.current.click()
  }

  const clickImage1 = () => {
    console.log(myImage1)
    myImage1.current.click()
  }

  const imageOnchange = async (e) => {
    e.preventDefault()
    console.log(e.target.files[0])
    const fileRef = firebase.storage().ref().child(`/users/images/${e.target.files[0].name}`)
    const uploadTask = fileRef.put(e.target.files[0])
    uploadTask.on('state_changed',
      (snapshot) => {

        var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        if (progress == '100') alert('uploaded')
      },
      (error) => {
        console.log(error)
      },
      () => {

        uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
          console.log('File available at', downloadURL);
          // document.querySelector('#proimg').src = downloadURL
          user.addressdoc = downloadURL
          db.collection('users').doc(user.id).update({
            addressdoc: downloadURL
          }).then(() => {
            e.target.value = ''
            localStorage.setItem('user', JSON.stringify(user))
            window.location.reload()
          }).catch(alert)
        });
      }
    );
  }


  const imageOnchange1 = async (e) => {
    e.preventDefault()
    console.log(e.target.files[0])
    const fileRef = firebase.storage().ref().child(`/users/images/${e.target.files[0].name}`)
    const uploadTask = fileRef.put(e.target.files[0])
    uploadTask.on('state_changed',
      (snapshot) => {

        var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        if (progress == '100') alert('uploaded')
      },
      (error) => {
        console.log(error)
      },
      () => {

        uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
          console.log('File available at', downloadURL);
          // firebase.auth().currentUser.updateProfile({
          //   photoURL: downloadURL
          // })
          user.addressdoc1 = downloadURL
          db.collection('users').doc(user.id).update({
            addressdoc1: downloadURL
          }).then(() => {
            e.target.value = ''
            localStorage.setItem('user', JSON.stringify(user))
            window.location.reload()
          }).catch(alert)


        });
      }
    );
  }

  useEffect(() => {
    setName(user.name)
    setPhone(user.phone)
    setUsername(user.username)
  }, [])




  const changeName = event => {
    setName(event.target.value)
  }

  const changePhone = event => {
    setPhone(event.target.value)
  }

  const changeUsername = event => {
    setUsername(event.target.value)
  }

  return (
    <>
      <div className='myaccount'>
        <div className='justifycenter m-t-10'>
          <div>
            <div className='profilepic'>
              <img src={BlankProfile} alt="" />
              <i className='fas fa-edit'></i>
            </div>
          </div>

        </div>
        <p className='color-greenlight' style={{ textAlign: 'center', marginBottom: '10px', marginTop: '10px', fontSize: '12px' }}>Upload Profile Picture</p>
        <div>
          <div>
            <span className="p-float-label m-t-25">
              <InputText id="name" onChange={changeName} value={name} />
              <label htmlFor="name">Name</label>
            </span>
            <span className="p-float-label m-t-35">
              <InputText id="username" onChange={changeUsername} value={username} />
              <label htmlFor="username">Username</label>
            </span>
            <span className="p-float-label m-t-35">
              <InputText id="email" readOnly value={user.email} />
              <label htmlFor="email">Email</label>
            </span>
            <span className="p-float-label m-t-35">
              <InputText id="phone" onChange={changePhone} value={phone} />
              <label htmlFor="phone">Phone</label>
            </span>

            {/* <p className='color-greenlight m-t-20 f-13'>Upload Documents</p> */}

            <div className='justifyspace m-t-20 gap20'>
              <div className='wid-100'>
                <input style={{ display: 'none' }} type="file" ref={myImage} id="imageUpload" accept="image/*" onChange={imageOnchange} />
                <p className='m-b-10 f-13 color-greenlight'>Id proof (front side)</p>
                {
                  user?.addressdoc == null || user?.addressdoc == undefined ?
                    (
                      <div onClick={clickImage} className='documentdiv'>

                        <i class="fa-solid fa-cloud-arrow-up"></i>
                      </div>
                    ) :
                    (
                      <>
                        <div className='addressImage wid-100 m-t-5'>
                          <img onClick={clickImage} src={user.addressdoc} alt="" />
                        </div>
                      </>
                    )
                }

              </div>

              <div className='wid-100'>
                <input style={{ display: 'none' }} type="file" ref={myImage1} id="imageUpload" accept="image/*" onChange={imageOnchange1} />
                <p className='m-b-10 f-13 color-greenlight'>Id proof (back side)</p>
                {
                  user?.addressdoc1 == null || user?.addressdoc1 == undefined ?
                    (
                      <div onClick={clickImage1} className='documentdiv'>

                        <i class="fa-solid fa-cloud-arrow-up"></i>
                      </div>
                    ) :
                    (
                      <>
                        <div className='addressImage wid-100 m-t-5'>
                          <img onClick={clickImage1} src={user.addressdoc1} alt="" />
                        </div>
                      </>
                    )
                }
              </div>
            </div>
            <div className='justifycenter m-t-20'>
              <button className='savechangesbtn'>
                Save Changes
              </button>
            </div>
          </div>
        </div>

      </div>
      <Bottombar />
    </>
  )
}

export default MyAccount