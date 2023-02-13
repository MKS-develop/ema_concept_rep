import React, {useEffect, useState} from 'react'
import {useLocation, Link} from 'react-router-dom';
import firebase from '../firebase/config'

function Client() {

    const data = useLocation()
    const [user, setUser] = useState({})
    const [paciente, setCliente] = useState({})
    const [pacientePlan, setClientePlan] = useState({})
    const [pacientePetPoints, setClientePP] = useState({})
    const [role, setRole] = useState({})

    async function getClient(pacienteId){
        await firebase.db.collection("Dueños").doc(pacienteId).get().then((val)=>{
            setCliente(val.data())
        })
    }

    useEffect(() => {
      if(data.state === undefined || data.state === null){
        window.location.href = "/agenda"
      }
      firebase.getCurrentUser().then((val)=>{
        setUser(val)
        firebase.getRoleInfo(val.role ?? "Administrador").then((r)=>{
          setRole(r)
        })
      })
      getClient(data.state.pacienteId)
    }, [])
    
    return (
      <div className="main-content-container container-fluid px-4">

        <div className="page-header align-items-center justify-content-spacebetween row no-gutters px-4 my-4">
          <div className="col-12 col-sm-5 text-center text-sm-left mb-0">
            <div className="row align-items-center">
              <div className="col">
                <p className="page-title bold"><Link className="page-title light" to="/agenda">Agenda</Link> {'>'} Cliente</p>
              </div>
            </div>
          </div>
          <div className="col-12 col-sm-1 mb-0">
            <div className="row align-items-center justify-content-space-around">
              <i className="material-icons color-white display-5">help_outline</i>
            </div>
          </div>
        </div>
        <h3 className="mb-5">Detalles del paciente</h3>
        <div className="row">
          <div className="col-lg-4">
              <p className="mb-0 bold color-primary">Nombre del paciente</p>
              <p>{paciente.nombre} {paciente.apellido}</p>
          </div>
          <div className="col-lg-4">
              <p className="mb-0 bold color-primary">Sexo</p>
              <p>{paciente.genero}</p>
          </div>
          <div className="col-lg-4">
              <p className="mb-0 bold color-primary">Dirección</p>
              <p>{paciente.direccion}</p>
          </div>
          <div className="col-lg-4">
              <p className="mb-0 bold color-primary">Teléfono</p>
              <p>{paciente.telefono}</p>
          </div>
          <div className="col-lg-4">
              <p className="mb-0 bold color-primary">Email</p>
              <p>{paciente.email}</p>
          </div>
          <div className="col-lg-4">
              <p className="mb-0 bold color-primary">Afiliado</p>
              <p>{pacientePlan ? pacientePlan.tipoPlan : "Cargando"}</p>
          </div>
          <div className="col-lg-4">
              <p className="mb-0 bold color-primary">Puntos acumulados</p>
              <p>{pacientePlan ? pacientePetPoints.ppAcumulados : "Cargando"}</p>
          </div>
          <div className="col-lg-4">
              <p className="mb-0 bold color-primary">Puntos canjeados</p>
              <p>{pacientePlan ? pacientePetPoints.ppCanjeados : "Cargando"}</p>
          </div>
          <div className="col-lg-4">
              <p className="mb-0 bold color-primary">Puntos generados</p>
              <p>{pacientePlan ? pacientePetPoints.ppGenerados : "Cargando"}</p>
          </div>
        </div>
      </div>
    )
}

export default Client