import React, {useState, useEffect} from 'react'
import firebase from '../../firebase/config'
import {useHistory} from 'react-router-dom';


function Clients() {

    const history = useHistory()
    const [nameValue, setNameValue] = useState(null);
    const [nroValue, setNroValue] = useState(null);
    const [clients, setClients] = useState([])
    const [clientPets, setClientPets] = useState([])
    const [clientsSearch, setClientsSearch] = useState([])
    const [orders, setOrders] = useState([])
    const [user, setUser] = useState({})
    const [client, setClient] = useState({})

    const getOrders = async(aliadoId) =>{
        let tipos = [];
        await firebase.db.collection('Ordenes').where("aliadoId", "==", aliadoId).get().then(val => {
          if(val.docs.length > 0){
            val.docs.forEach(item=>{
                tipos.push(item.data().uid)
            })
            setOrders(tipos)
            getDueños(tipos)
          }
        })
    }

    const getDueños = async(orders) =>{
        let tipos = [];
        await firebase.db.collection('Dueños').get().then(val => {
          val.docs.forEach(item=>{
            tipos.push(item.data().uid)
          })
          getClients(tipos, orders)
        })
    }
        

    const getClients = (dueños, orders) =>{
        let tipos = []
        let ids = []
        for(let i = 0; i < orders.length; i++){
            let a = dueños.indexOf(orders[i])
            tipos.push(a)
        }
        let tipos2 = Array.from(new Set(tipos))
        for(let i = 0; i < tipos2.length; i++){
            let a = dueños[tipos2[i]]
            ids.push(a)
        }
        getDueños2(ids)
    }

    const getDueños2 = async(ids) =>{
        let tipos = [];
        for(let i = 0; i < ids.length; i++){
            await firebase.db.collection('Dueños').doc(ids[i]).get().then(val => {              
                tipos.push(val.data())
                console.log(val.data())
            })
        }
        console.log(tipos)
        setClients(tipos)
    }
    
    const getDueños3 = async(val) =>{
      let tipos = []
      for(let i = 0; i < clients.length; i++){
        let u = clients[i].user.toLowerCase()
        if(u.includes(val.toLowerCase())){
          tipos.push(clients[i])
        }
      }
      setClientsSearch(tipos)
    }

    const getPets = async(mid)=>{
      let tipos = []
      try{
        await firebase.db.collection("Mascotas").where("uid", "==", mid).get().then((val)=>{
          val.docs.forEach((doc)=>{
            tipos.push(doc.data())
          })
          setClientPets(tipos)
        })
      }catch(e){
        console.log(`Error: ${e}`)
      }
    }

    useEffect(() => {
        firebase.getCurrentUser().then((val)=>{
          setUser(val)
          getOrders(val.aliadoId)
        })
    }, [])

    return (

        <div className="main-content-container container-fluid px-4">
          <div>

              <div className="page-header align-items-center justify-content-spacebetween row no-gutters px-4 my-4">
                <div className="col-12 col-sm-5 text-center text-sm-left mb-0">
                  <div className="row align-items-center">
                    <div className="col">
                      <p className="page-title">Clientes</p>
                    </div>
                  </div>
                </div>
                <div className="col-12 col-sm-1 mb-0">
                  <div className="row align-items-center justify-content-space-around">
                    <i className="material-icons color-white display-5">help_outline</i>
                  </div>
                </div>
              </div>
              <div className="form-row align-items-center justify-content-space-between">
                <div className="form-group mr-3">
                  <input type="text" placeholder="Nombre del cliente" className="form-control" onChange={(e)=>{setNameValue(e.target.value)}}/>
                </div>
                <div className="ml-3 form-group">
                  <button className="btn btn-primary" onClick={()=>{getDueños3(nameValue)}}>Buscar <i className="material-icons">search</i></button>
                </div>
              </div>
              <div className="row">
                  <div className="col-lg-12 col-md-12 col-sm-12">
                    <div className="mb-2 row orders-title">
                      <div className="col-md-2 ">
                        <p className="mb-2">Cliente</p>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-12 col-md-12 col-sm-12">
                    <div className="orders-container">
                      {
                        clientsSearch.length > 0 && nameValue ? 
                        clientsSearch.length > 0 ? clientsSearch.map(client=>{
                          return(
                            <div onClick={() => {
                              history.push({
                                pathname: "/clients/client",
                                state: {uid: client.uid}
                              })
                            }} key={client.uid} className="mb-4 row client-child align-items-center">
                              <img className="client-avatar-preview rounded-circle mr-2" src={client.url ?? "cargando"} alt="User Avatar"/>
                              <div className="col-md-2 color-primary">
                                <p className="mb-0">{client.user}</p>
                              </div>
                            </div>
                          )
                        }) : <div className="text-center"><p>No hay clientes</p></div>
                        :
                        clients.length > 0 ? clients.map(client=>{
                          return(
                            <div onClick={() => {
                              history.push({
                                pathname: "/clients/client",
                                state: {uid: client.uid}
                              })
                            }} key={client.uid} className="mb-4 row client-child align-items-center">
                              <img className="client-avatar-preview rounded-circle mr-2" src={client.url ?? "cargando"} alt="User Avatar"/>
                              <div className="col-md-2 color-primary">
                                <p className="mb-0">{client.user}</p>
                              </div>
                            </div>
                          )
                        }) : <div className="text-center"><p>No hay clientes</p></div>
                      }
                    </div>
                  </div>
              </div>
            </div>

          </div>
    )

}

export default Clients