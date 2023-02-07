
import React, { useState, useRef, useEffect, useCallback, useContext } from 'react'
import { useNavigate } from 'react-router-dom';
import { userContext } from '../App';
import Bottombar from '../components/Bottombar';
import { db } from '../external/firebase'


const GamePage = () => {
  const navigate = useNavigate();
  const Ref = useRef(null);
  // const [users, setUsers] = useState([1, 2, 3, 4, 5])
  const [selectedUser, setSelectedUser] = useState(0)
  const [winners, setWinners] = useState([])
  const [array1, setArray1] = useState([])
  const [array2, setArray2] = useState([])
  const [total, setTotal] = useState(null)
  const { user, setUser } = useContext(userContext)
  // The state for our timer
  const [timer, setTimer] = useState('40');
  const [count, setCount] = useState(0);
  const [activeUsers, setActiveUsers] = useState([]);
  // useEffect(() => {

  // }, [])

  useEffect(() => {

    db.collection('activeusers').onSnapshot((doc) => {
      setCount(doc.docs.length)
      const usrs = doc.docs.map(element => ({
        data: element.data()
      }))
      setActiveUsers(usrs)
      console.log(activeUsers, 'activeusers')
    })



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
    // console.log('Hello World');
    window.onbeforeunload = confirmExit;
    function confirmExit() {
      db.collection("activeusers").doc(user.id).delete()
    }
    return () => {
      db.collection("activeusers").doc(user.id).delete()
      db.collection("usersa").doc(user.id).delete()
      db.collection("usersb").doc(user.id).delete()
    }
  }, [])

  const getTimeRemaining = (e) => {
    const totalTemp = Date.parse(e) - Date.parse(new Date());
    setTotal(totalTemp);
    const seconds = Math.floor((totalTemp / 1000) % 60);
    // const minutes = Math.floor((totalTemp / 1000 / 60) % 60);
    // const hours = Math.floor((totalTemp / 1000 / 60 / 60) % 24);
    return {
      totalTemp, seconds
    };
  }


  const startTimer = (e, id) => {
    let { totalTemp, seconds }
      = getTimeRemaining(e);
    setTotal(totalTemp);
    if (totalTemp >= 0) {

      // update the timer
      // check if less than 10 then we need to 
      // add '0' at the beginning of the variable
      setTimer(
        // (hours > 9 ? hours : '0' + hours) + ':' +
        // (minutes > 9 ? minutes : '0' + minutes) + ':'
        (seconds > 9 ? seconds : '0' + seconds)
      )


    }

  }


  const clearTimer = (e) => {

    // If you adjust it you should also need to
    // adjust the Endtime formula we are about
    // to code next    
    // setTimer('100');

    // If you try to remove this line the 
    // updating of timer Variable will be
    // after 1000ms or 1sec
    if (Ref.current) clearInterval(Ref.current);

    const id = setInterval(() => {
      startTimer(e, id);

    }, 1000)
    Ref.current = id;




  }

  const getDeadTime = () => {
    let deadline = new Date();

    // This is where you need to adjust if 
    // you entend to add more time
    deadline.setSeconds(deadline.getSeconds() + 40);
    return deadline;


  }

  // We can use useEffect so that when the component
  // mount the timer will start as soon as possible

  // We put empty array to act as componentDid
  // mount only
  useEffect(() => {
    clearTimer(getDeadTime());

  }, []);

  // Another way to call the clearTimer() to start
  // the countdown is via action event from the
  // button first we create function to be called
  // by the button
  const onClickReset = () => {
    clearTimer(getDeadTime());
  }

  const select = (data) => {
    setSelectedUser(data)
  }
  // useEffect(() => {
  //   setArray1(array1.push(selectedUser))
  //   setArray1([...new Set(array1)]);


  // }, [array1])

  // useCallback(() => {
  //   setArray1((arr)=>array1.push(selectedUser))
  //   setArray1([...new Set(array1)]);
  // }, []);

  useEffect(() => {
    console.log(array1, 'array1')
    console.log(array2, 'array2')
  }, [array1, array2])

  useEffect(() => {
    if (total < 1) {

      db.collection('usersa').onSnapshot((doc) => {
        const usrsa = doc.docs.map(element => ({
          data: element.data()

        }))
        setArray1(usrsa)
        console.log(array1, 'array1')
      })

      db.collection('usersb').onSnapshot((doc) => {
        const usrsb = doc.docs.map(element => ({
          data: element.data()
        }))
        setArray2(usrsb)
        console.log(array2, 'array2')
      })

      if (array1.length > array2.length) {

        if (array2.some(data => data.data.id === user.id)) {
          alert(`You win`)
        } else {
          alert(`You lose`)
        }

        // alert(`winners are ${array2.length}`)
        // alert(`winners are ${array2.toString()}`)
        // console.log(`winners are ${array2.length}`)
        clearTimer();

      } else if (array2.length > array1.length) {

        if (array1.some(data => data.data.id === user.id)) {
          alert(`You win`)
        } else {
          alert(`You lose`)
        }

        // alert(`winners are ${array1.length}`)
        // console.log(`winners are ${array1.length}`)
        clearTimer();
      }
    }
  }, [total])


  const selectArray1 = () => {
    // setArray1(array1.push(user.id))
    // setArray1([...new Set(array1)]);

    db.collection("usersa").doc(user.id).set({
      ...user
    }).then((res) => {



      // db.collection("users").where('email', '==', userObject.email).get().then((res) => {
      //     res.docs.forEach((doc) => {
      //         let userData=doc.data()
      //         userData['id']=doc.id
      //         console.log(doc.id, 'data')
      //         console.log(doc.data(), 'data')
      //         localStorage.setItem('user', JSON.stringify(userData))
      //         setUser(userData)
      //         navigate('/golive')
      //     })
      // })
    }).catch(alert);



    // debugger;

    setTimeout(() => {
      // setArray2(array2.filter(function (item) {
      //   return item !== selectedUser
      // }))
      db.collection("usersb").doc(user.id).delete()


    }, 500);


  }
  const selectArray2 = () => {
    // setArray2(array2.push(selectedUser))


    // setArray2([...new Set(array2)]);


    db.collection("usersb").doc(user.id).set({
      ...user
    }).then((res) => {


      // db.collection("users").where('email', '==', userObject.email).get().then((res) => {
      //     res.docs.forEach((doc) => {
      //         let userData=doc.data()
      //         userData['id']=doc.id
      //         console.log(doc.id, 'data')
      //         console.log(doc.data(), 'data')
      //         localStorage.setItem('user', JSON.stringify(userData))
      //         setUser(userData)
      //         navigate('/golive')
      //     })
      // })
    }).catch(alert);


    setTimeout(() => {
      // setArray1(array1.filter(function (item) {
      //   return item !== selectedUser
      // }))

      db.collection("usersa").doc(user.id).delete()

    }, 500);

  }

  return (
    <div className="App">
      <div className="timer">
        {timer}
      </div>

      <div style={{ marginTop: '20px' }} className="timer">
        {count}
      </div>

      <div onClick={selectArray1} className='button1'>
      </div>
      {/* <div className='users'>
        {
          users.map((data) => {
            return (
              <div onClick={(e) => { select(data) }} className={selectedUser == data ? 'selecteduser' : 'user'}>{data}</div>
            )
          })
        }

      </div> */}
      <div onClick={selectArray2} className='button2'>
      </div>


      <Bottombar />
    </div>


  );

}


export default GamePage