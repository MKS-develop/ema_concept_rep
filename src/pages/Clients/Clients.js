import React, {useState, useEffect} from 'react'
import firebase from '../../firebase/config'
import {useHistory} from 'react-router-dom';


function Clients() {

    const history = useHistory()
    const [nameValue, setNameValue] = useState(null);
    const [nroValue, setNroValue] = useState(null);
    const [clients, setClients] = useState([])
    const [dueños, setDueños] = useState([])
    const [orders, setOrders] = useState([])
    const [user, setUser] = useState({})
    const [client, setClient] = useState({})

    const getOrders = async(aliadoId) =>{
        let tipos = [];
        await firebase.db.collection('Ordenes').where("aliadoId", "==", aliadoId).get().then(val => {
            val.docs.forEach(item=>{
                tipos.push(item.data())
            })
            setOrders(tipos)
            getDueños(tipos)
        })
    }

    const getDueños = async(orders) =>{
        let tipos = [];
        await firebase.db.collection('Dueños').get().then(val => {
          val.docs.forEach(item=>{
            tipos.push(item.data())
          })
          setDueños(tipos)
          getClients(tipos, orders)
        })
    }
        

    const getClients = (dueños, orders) =>{
        for(let i = 0; i < dueños.length; i++){
            if(dueños[i].user === orders[i].user){
                setClients([...clients, dueños[i]])
                console.log(dueños[i])
                console.log(i)
            }else{
                i++
            }
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
          {client.oid === undefined
          ? 
          <div>

              <div className="page-header align-items-center justify-content-spacebetween row no-gutters py-2 px-4 my-4">
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
                  <button className="btn btn-primary" onClick={()=>{getClients(user.aliadoId)}}>Buscar <i className="material-icons">search</i></button>
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
                        clients.length > 0 ? clients.map(client=>{
                          return(
                            <div onClick={() => setClient(client)} key={client.uid} className="mb-2 row client-child">
                              <div className="col-md-2 color-primary">
                                <p className="mb-0">{client.user}</p>
                              </div>
                            </div>
                          )
                        }) : <div className="text-center"><p>No hay órdenes</p></div>
                      }
                    </div>
                  </div>
              </div>
            </div>
            
            
            : <div>

              <div className="page-header align-items-center justify-content-spacebetween row no-gutters py-2 px-4 my-4">
                <div className="col-12 col-sm-5 text-center text-sm-left mb-0">
                  <div className="row align-items-center">
                    <div className="col">
                      <p onClick={()=>{setClient({})}} className="page-title"><i className="material-icons">arrow_back</i> Regresar</p>
                    </div>
                  </div>
                </div>
                <div className="col-12 col-sm-1 mb-0">
                  <div className="row align-items-center justify-content-space-around">
                    <i className="material-icons color-white display-5">help_outline</i>
                  </div>
                </div>
              </div>
              <h3 className="mb-5">Detalle de la órden</h3>
              <div className="row">
                <div className="col-lg-4">
                  <p className="mb-0 bold color-primary">Nombre del cliente</p>
                  <p>{client.user}</p>
                </div>
                <div className="col-lg-4">
                  <p className="mb-0 bold color-primary">Status</p>
                  <p>{client.status}</p>
                </div>
                <div className="col-lg-4">
                  <p className="mb-0 bold color-primary">Fecha</p>
                  <p>{client.fecha}</p>
                </div>
                <div className="col-lg-4">
                  <p className="mb-0 bold color-primary">Monto</p>
                  <p>S/{client.precio}</p>
                </div>
                <div className="col-lg-4">
                  <p className="mb-0 bold color-primary">Nro. de órden</p>
                  <p>{client.oid}</p>
                </div>
                <div className="col-lg-4">
                  <p className="mb-0 bold color-primary">Tipo de órden</p>
                  <p>{client.tipoOrden}</p>
                </div>
              </div>
              <div className="row">
                <div className="col-lg-5">
                  <button onClick={()=>{
                    history.push({
                      pathname: "/clients/client", 
                      state: { clienteId: client.uid }
                    })
                  }} className="btn btn-primary btn-block">Ver la información del cliente</button>
                </div>
              </div>

            </div>}

          </div>
    )

}

export default Clients
