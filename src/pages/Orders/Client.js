import React, {useEffect, useState} from 'react'
import {useLocation, Link} from 'react-router-dom';
import firebase from '../../firebase/config'

function Client() {

    const data = useLocation()
    const [user, setUser] = useState({})
    const [cliente, setCliente] = useState({})
    const [clientePlan, setClientePlan] = useState({})
    const [clientePetPoints, setClientePP] = useState({})

    async function getClient(clienteId){
        await firebase.db.collection("Dueños").doc(clienteId).get().then((val)=>{
            setCliente(val.data())
        })
        await firebase.db.collection("Dueños").doc(clienteId).collection("Plan").doc(clienteId).get().then((val)=>{
            setClientePlan(val.data())
        })
        await firebase.db.collection("Dueños").doc(clienteId).collection("Petpoints").doc(clienteId).get().then((val)=>{
            setClientePP(val.data())
        })
    }

    useEffect(() => {
        if(data.state === undefined || data.state === null){
          window.location.href = "/orders"
        }
        firebase.getCurrentUser().then((val)=>{
          setUser(val)
        })
        getClient(data.state.clienteId)
    }, [])
    
    return (
        <div className="main-content-container container-fluid px-4">

            <div className="page-header align-items-center justify-content-spacebetween row no-gutters py-2 px-4 my-4">
              <div className="col-12 col-sm-5 text-center text-sm-left mb-0">
                <div className="row align-items-center">
                  <div className="col">
                    <p className="page-title"><Link className="color-white" to="/orders">Órdenes</Link> {'>'} Cliente</p>
                  </div>
                </div>
              </div>
              <div className="col-12 col-sm-1 mb-0">
                <div className="row align-items-center justify-content-space-around">
                  <i className="material-icons color-white display-5">help_outline</i>
                </div>
              </div>
            </div>
            <h3 className="mb-5">Detalles del cliente</h3>
              <div className="row">
                <div className="col-lg-4">
                    <p className="mb-0 bold color-primary">Nombre del cliente</p>
                    <p>{cliente.nombre} {cliente.apellido}</p>
                </div>
                <div className="col-lg-4">
                    <p className="mb-0 bold color-primary">Sexo</p>
                    <p>{cliente.genero}</p>
                </div>
                <div className="col-lg-4">
                    <p className="mb-0 bold color-primary">Dirección</p>
                    <p>{cliente.direccion}</p>
                </div>
                <div className="col-lg-4">
                    <p className="mb-0 bold color-primary">Teléfono</p>
                    <p>{cliente.telefono}</p>
                </div>
                <div className="col-lg-4">
                    <p className="mb-0 bold color-primary">Email</p>
                    <p>{cliente.email}</p>
                </div>
                <div className="col-lg-4">
                    <p className="mb-0 bold color-primary">Afiliado</p>
                    <p>{clientePlan ? clientePlan.tipoPlan : "Cargando"}</p>
                </div>
                <div className="col-lg-4">
                    <p className="mb-0 bold color-primary">Puntos acumulados</p>
                    <p>{clientePlan ? clientePetPoints.ppAcumulados : "Cargando"}</p>
                </div>
                <div className="col-lg-4">
                    <p className="mb-0 bold color-primary">Puntos canjeados</p>
                    <p>{clientePlan ? clientePetPoints.ppCanjeados : "Cargando"}</p>
                </div>
                <div className="col-lg-4">
                    <p className="mb-0 bold color-primary">Puntos generados</p>
                    <p>{clientePlan ? clientePetPoints.ppGenerados : "Cargando"}</p>
                </div>
              </div>

          </div>
    )
}

export default Client
