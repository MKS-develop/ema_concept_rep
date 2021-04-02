import moment from 'moment'
import 'moment/locale/es-mx';
import React, {useState, useEffect} from 'react'
import firebase from '../firebase/config'

function Prueba(){
    
    const [orders, setOrders] = useState([])
    const [user, setUser] = useState({})
    const [ordersPriceData, setOrdersPriceData] = useState([])
    const [ordersData, setOrdersData] = useState([])

    const getOrders = async() =>{
      let tipos = [];
      await firebase.db.collection('Ordenes')
      .get().then(val => { 
        val.docs.forEach(item=>{ 
          tipos.push(item.data()) 
        })
        setOrders(tipos)
        // filterOrders(tipos)
      })
    }

    

    useEffect(() => {
        firebase.getCurrentUser().then(setUser);
        getOrders();
    }, [])

    return (
      <div className="main-content-container container-fluid px-4">
        <p>{ordersPriceData.join(" ")}</p>
        <p>{ordersData.join(" ")}</p>
      </div>
    )

}

export default Prueba
