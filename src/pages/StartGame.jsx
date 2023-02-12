import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { userContext } from '../App';
import Loader from '../components/Loader';
import { db } from '../external/firebase'
import GamePage from './GamePage';


const StartGame = () => {
  const navigate = useNavigate();
    const { user, setUser } = useContext(userContext)
    const [gameStart, setGameStart] = useState(false)
    const [activeUsers, setActiveUsers] = useState([]);
    const [count, setCount] = useState(0);
   


    useEffect(() => {

      if (user == null) {
        navigate('/login')
      }else{
        if (user.tokens==0) {
          navigate('/buytokens')
        }
      }

      
  
   
        // console.log('Hello World');
        window.onbeforeunload = confirmExit;
        function confirmExit() {
          db.collection("activeusers").doc(user?.id).delete()
          db.collection("usersa").doc(user?.id).delete()
          db.collection("usersb").doc(user?.id).delete()
        }
        return () => {
          db.collection("activeusers").doc(user?.id).delete()
          db.collection("usersa").doc(user?.id).delete()
          db.collection("usersb").doc(user?.id).delete()
        }
      }, [])


    useEffect(() => {
        console.log(user, 'gotuser')
    
    
    
        if (user != null) {
          db.collection("activeusers").doc(user.id).set({
            ...user
          }).then((res) => {
    
          })
        }
      }, [])

    useEffect(() => {

        db.collection('activeusers').onSnapshot((doc) => {
            setCount(doc.docs.length)
            console.log(count,'count')
            const usrs = doc.docs.map(element => ({
                data: element.data()
            }))
         
            setActiveUsers(usrs)
            console.log(activeUsers, 'activeusers')
        })

    }, [])

    useEffect(() => {
        if (count > 2) {
            setTimeout(() => {
                setGameStart(true)
            }, 2000);
            
        } else {
            setGameStart(false)
        }
      
    }, [count])
    

    return (
        <>
            {
                gameStart ?
                    (<GamePage count={count} />) :

                    (<Loader />)
            }
        </>
    )
}

export default StartGame