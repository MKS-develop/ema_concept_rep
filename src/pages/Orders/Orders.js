import React, {useState, useEffect} from 'react'
import firebase from '../../firebase/config'
import {useHistory} from 'react-router-dom';


function Orders() {

    const history = useHistory()
    const [nameValue, setNameValue] = useState(null);
    const [nroValue, setNroValue] = useState(null);
    let statusValues = ["Por confirmar", "Confirmada"]
    const [statusValue, setStatusValue] = useState(null);
    const [orders, setOrders] = useState([])
    const [user, setUser] = useState({})
    const [order, setOrder] = useState({})

    const getOrders = async(aliadoId) =>{
      // console.log(statusValue)
      let tipos = [];
      
      const reference = firebase.db.collection('Ordenes').where("aliadoId", "==", aliadoId)
      const nameFilter = nameValue ? reference.where("user", "==", nameValue) : reference
      const nroFilter = nroValue ? nameFilter.where("oid", "==", nroValue) : nameFilter
      const statusFilter = statusValue ? nroFilter.where("status", "==", statusValue) : nroFilter 

      await statusFilter.get().then(val => {
        val.docs.forEach(item=>{
          tipos.push(item.data())
        })
        setOrders(tipos)
      })
    }

    useEffect(() => {
        firebase.getCurrentUser().then((val)=>{
          setUser(val)
          getOrders(val.aliadoId)
        });
    }, [])

    return (

        <div className="main-content-container container-fluid px-4">
          {order.oid === undefined
          ? 
          <div>

              <div className="page-header align-items-center justify-content-spacebetween row no-gutters py-2 px-4 my-4">
                <div className="col-12 col-sm-5 text-center text-sm-left mb-0">
                  <div className="row align-items-center">
                    <div className="col">
                      <p className="page-title">Órdenes</p>
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
                <div className="form-group mr-3">
                  <input type="text" placeholder="Nro. de la órden" className="form-control" onChange={(e)=>{setNroValue(e.target.value)}}/>
                </div>
                <div className="form-group">
                  <select className="form-control" onChange={(e) => {setStatusValue(e.target.value)}}>
                    {statusValues.map(data => (
                        <option key={data} value={data}>{data}</option>
                    ))}
                  </select>
                </div>
                <div className="ml-3 form-group">
                  <button className="btn btn-primary" onClick={()=>{getOrders(user.aliadoId)}}>Buscar <i className="material-icons">search</i></button>
                </div>
              </div>
              <div className="row">
                  <div className="col-lg-12 col-md-12 col-sm-12">
                    <div className="mb-2 row orders-title">
                      <div className="col-md-2 ">
                        <p className="mb-2">Cliente</p>
                      </div>
                      <div className="col-md-2 ">
                        <p className="mb-2">Nro. Orden</p>
                      </div>
                      <div className="col-md-2 ">
                        <p className="mb-2">Tipo</p>
                      </div>
                      <div className="col-md-2 ">
                        <p className="mb-2">Fecha</p>
                      </div>
                      <div className="col-md-2 ">
                        <p className="mb-2">Status</p>
                      </div>
                      <div className="col-md-2 ">
                        <p className="mb-2">Monto</p>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-12 col-md-12 col-sm-12">
                    <div className="orders-container">
                      {
                        orders.length > 0 ? orders.map(order=>{
                          return(
                            <div onClick={() => setOrder(order)} key={order.oid} className="mb-2 row order-child">
                              <div className="col-md-2 color-primary">
                                <p className="mb-0">{order.user}</p>
                              </div>
                              <div className="col-md-2 ">
                                <p className="mb-0">{order.oid}</p>
                              </div>
                              <div className="col-md-2 ">
                                <p className="mb-0">{order.tipoOrden}</p>
                              </div>
                              <div className="col-md-2 ">
                                <p className="mb-0">{order.fecha}</p>
                              </div>
                              <div className={order.status === "Confirmada" 
                              ? "col-md-2 color-success" : order.status === "Por Confirmar" ||  order.status === "Por confirmar" ? "col-md-2 color-secondary" 
                              :"col-md-2 color-danger"}>
                                <p className="mb-0">{order.status}</p>
                              </div>
                              <div className="col-md-2 color-success">
                                <p className="mb-0">S/{order.precio}</p>
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
                      <p onClick={()=>{setOrder({})}} className="page-title"><i className="material-icons">arrow_back</i> Regresar</p>
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
                  <p>{order.user}</p>
                </div>
                <div className="col-lg-4">
                  <p className="mb-0 bold color-primary">Status</p>
                  <p>{order.status}</p>
                </div>
                <div className="col-lg-4">
                  <p className="mb-0 bold color-primary">Fecha</p>
                  <p>{order.fecha}</p>
                </div>
                <div className="col-lg-4">
                  <p className="mb-0 bold color-primary">Monto</p>
                  <p>S/{order.precio}</p>
                </div>
                <div className="col-lg-4">
                  <p className="mb-0 bold color-primary">Nro. de órden</p>
                  <p>{order.oid}</p>
                </div>
                <div className="col-lg-4">
                  <p className="mb-0 bold color-primary">Tipo de órden</p>
                  <p>{order.tipoOrden}</p>
                </div>
              </div>
              <div className="row">
                <div className="col-lg-5">
                  <button onClick={()=>{
                    history.push({
                      pathname: "/orders/client", 
                      state: { clienteId: order.uid }
                    })
                  }} className="btn btn-primary btn-block">Ver la información del cliente</button>
                </div>
              </div>

            </div>}

          </div>
    )

}

export default Orders
