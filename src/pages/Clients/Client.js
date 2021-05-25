import React, {useState, useEffect} from 'react'
import firebase from '../../firebase/config'
import {Link, useHistory, useLocation} from 'react-router-dom';


function ClientInfo() {

    const history = useHistory()
    let data = useLocation()
    const [clientPets, setClientPets] = useState([])
    const [user, setUser] = useState({})
    const [client, setClient] = useState({})
    const [clientePlan, setClientePlan] = useState({})
    const [clientePetPoints, setClientePP] = useState({})

    const getClient = async(uid)=>{
      try{
        await firebase.db.collection("Dueños").doc(uid).get().then((val)=>{
            setClient(val.data())
        })
        firebase.db.collection("Dueños").doc(uid).collection("Plan").doc(uid).get().then((val)=>{
            setClientePlan(val.data())
        })
        firebase.db.collection("Dueños").doc(uid).collection("Petpoints").doc(uid).get().then((val)=>{
            setClientePP(val.data())
        })
      }catch(e){
        console.log(`Error: ${e}`)
      }
    }
    const getPets = async(uid)=>{
      let tipos = []
      try{
        await firebase.db.collection("Mascotas").where("uid", "==", uid).get().then((val)=>{
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
          
        })
        if(data.state !== undefined){
            getClient(data.state.uid)
            getPets(data.state.uid)
        }
    }, [])

    return (
        <div className="main-content-container container-fluid px-4">
            <div>

            <div className="page-header align-items-center justify-content-spacebetween row no-gutters px-4 my-4">
                <div className="col-12 col-sm-5 text-center text-sm-left mb-0">
                  <div className="row align-items-center">
                    <div className="col">
                      <p className="page-title bold"><Link className="page-title light" to="/clients">Clientes</Link> {'>'} Cliente</p>
                    </div>
                  </div>
                </div>
                <div className="col-12 col-sm-1 mb-0">
                  <div className="row align-items-center justify-content-space-around">
                    <i className="material-icons color-white display-5">help_outline</i>
                  </div>
                </div>
              </div>
              <div className="row mb-5">
                <h3 className="mb-0">Cliente</h3>
                <div onClick={
                  ()=>{
                    history.push({
                      pathname: "/client/pet/history",
                      state: {mid: data.state.uid, uid: data.state.uid, isOwner: true }
                    })
                  }
                } className="btn ml-5 btn-outline-primary">
                  Atender
                </div>
              </div>
              <div className="row">
                <div className="col-lg-4">
                    <p className="mb-0 bold color-primary">Nombre del cliente</p>
                    <p>{client.nombre} {client.apellido}</p>
                </div>
                <div className="col-lg-4">
                    <p className="mb-0 bold color-primary">Sexo</p>
                    <p>{client.genero}</p>
                </div>
                <div className="col-lg-4">
                    <p className="mb-0 bold color-primary">Dirección</p>
                    <p>{client.direccion}</p>
                </div>
                <div className="col-lg-4">
                    <p className="mb-0 bold color-primary">Teléfono</p>
                    <p>{client.telefono}</p>
                </div>
                <div className="col-lg-4">
                    <p className="mb-0 bold color-primary">Email</p>
                    <p>{client.email}</p>
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
              <div className="my-3 lead">
                Grupo familiar
              </div>
              <div className="row align-items-center ">
                {
                  clientPets.map(pet=>{
                    return(
                      <div onClick={() =>{
                        history.push({
                          pathname: "/client/pet/history",
                          state: {mid: pet.mid, uid: data.state.uid}
                        })
                      }} key={pet.mid} className="pet-client-card mx-2 col-lg-3">
                          <p className="mb-0">{pet.nombre}</p>
                      </div>
                    )
                  })
                }
            </div>

        </div>
    </div>
    )

}

export default ClientInfo