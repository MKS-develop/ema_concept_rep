import React, {useState, useEffect} from 'react'
import firebase from '../../firebase/config'
import {useHistory} from 'react-router-dom';
import moment from 'moment';


function Orders() {

    const history = useHistory()
    const [nameValue, setNameValue] = useState(null)
    const [nroValue, setNroValue] = useState(null)
    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage, setItemsPerPage] = useState(5)
    const [totalItemCount, setTotalItemCount] = useState(0)
    let statusValues = ["Por confirmar", "Confirmada"]
    const [statusValue, setStatusValue] = useState(null);
    const [orders, setOrders] = useState([])
    const [user, setUser] = useState({})
    const [order, setOrder] = useState({})
    const [orderSell, setOrderSell] = useState({})

    const getOrders = async(aliadoId) =>{
      let tipos = [];

      const reference = firebase.db.collection('Ordenes').where("aliadoId", "==", aliadoId)
      const nameFilter = nameValue ? reference.where("user", "==", nameValue) : reference
      const nroFilter = nroValue ? nameFilter.where("oid", "==", nroValue) : nameFilter
      const statusFilter = statusValue ? nroFilter.where("status", "==", statusValue) : nroFilter 

      await statusFilter.get().then(val => {
        val.docs.forEach(item=>{
          tipos.push(item.data())
        })
        setOrders(tipos.sort((a, b) => b.createdOn - a.createdOn))
        setTotalItemCount(tipos.length)
      })
    }

    
      // else{
      //   try {
      //     firebase.db.collection("Productos").doc(order.productoId).get().then((doc)=>{
      //       setOrderSell(doc.data())
      //     })
      //   }catch(e){
      //     console.log(e)
      //   }
      // }

    useEffect(() => {
        firebase.getCurrentUser().then((val)=>{
          setUser(val)
          getOrders(val.aliadoId)
        });
    }, [])

    return (
      <div className="main-content-container container-fluid px-4">
              <div className="page-header align-items-center justify-content-spacebetween row no-gutters px-4 my-4">
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
                          let oc = moment(order.createdOn.toDate()).format("ddd, MMM D YYYY")
                          return(
                            <div onClick={() => {
                              history.push({
                                pathname: "/orders/order",
                                state: {oid: order.oid}
                              })
                            }} key={order.oid} className="mb-2 row order-child">
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
                                <p className="mb-0">{oc}</p>
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
    )

}

export default Orders