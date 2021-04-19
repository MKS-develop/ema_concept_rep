import React, {useState, useEffect} from 'react'
import firebase from '../../firebase/config'
import {Link, useHistory} from 'react-router-dom';

function CreateRole() {

    let history = useHistory()
    const [btnMessage, setBtnMessage] = useState("Crear rol");
    const [user, setUser] = useState({})
    const [emessage, setEmessage] = useState("")
    const [error, setError] = useState(false)
    const [orders, setOrders] = useState(false)
    const [claims, setClaims] = useState(false)
    const [clients, setClients] = useState(false)
    const [message, setMessage] = useState(false)
    const [refereds, setRefereds] = useState(false)
    const [services, setServices] = useState(false)
    const [promotions, setPromotions] = useState(false)
    const [products, setProducts] = useState(false)
    const [number, setNumber] = useState(0)


    const [nameRole, setNameRole] = useState(null)

    useEffect(() => {
        async function fetchData() {
            await firebase.getCurrentUser().then(setUser)
        }
        fetchData()
    })

    return (

        <div className="main-content-container container-fluid px-4">
            {error 
                ? <div className="alert alert-danger alert-dismissible fade show mb-0 mt-2" role="alert">
                        <button onClick={()=>{setError(false)}} className="close" data-dismiss="alert" aria-label="Close">
                        <span aria-hidden="true">×</span>
                        </button>
                        <i className="fa fa-exclamation-triangle mx-2"></i>
                        <strong>Cuidado!</strong> {emessage}
                    </div>
                : <div></div>
                }
            <div className="page-header align-items-center justify-content-spacebetween row no-gutters px-4 my-4">
              <div className="col-12 col-sm-5 text-center text-sm-left mb-0">
                <div className="row align-items-center">
                    <Link to="/employes" className="ml-3 mr-3 page-title">Regresar</Link>
                </div>
              </div>
              <div className="col-12 col-sm-1 mb-0">
                <div className="row align-items-center justify-content-space-around">
                  <i className="material-icons color-white display-5">help_outline</i>
                </div>
              </div>
            </div>
            <p className="lead mb-0">Selecciona las preferencias para el nuevo rol</p>
            <div className="row my-4 align-items-center justify-content-spacebetween">
                <div className="col-lg-6">
                    <div className="form-group mb-0">
                        <input type="text" className="form-control" onChange={(e) => setNameRole(e.target.value)} placeholder="Nombre del rol" value={nameRole} />
                    </div>
                </div>
                <div className="col-lg-4">
                    <button onClick={()=>{
                        !nameRole || number === 0 ? console.log("no permitido") : onRegister()
                    }} className={`btn ${ !nameRole || number === 0 ? "btn-disabled" : "btn-secondary"} btn-block`}>{btnMessage}</button>
                </div>
            </div>
                <div className="row">
                    <div className="col-lg-3 col-sm-12">
                        <div onClick={()=>{setOrders(!orders); if(orders){setNumber(number - 1)}else{setNumber(number + 1)}}} className={orders ? "role-button active" : "role-button"}>
                            <i className="material-icons">inbox</i>
                            <p className="mb-0">Órdenes</p>
                        </div>
                    </div>
                    <div className="col-lg-3 col-sm-12">
                        <div onClick={()=>{setClaims(!claims); setNumber(number + 1); if(claims){setNumber(number - 1)}else{setNumber(number + 1)} }} className={claims ? "role-button active" : "role-button"}>
                            <i className="material-icons">error_outline</i>
                            <p className="mb-0">Reclamos</p>
                        </div>
                    </div>
                    <div className="col-lg-3 col-sm-12">
                        <div onClick={()=>{setClients(!clients); setNumber(number + 1); if(clients){setNumber(number - 1)}else{setNumber(number + 1)} }} className={clients ? "role-button active" : "role-button"}>
                            <i className="material-icons">people</i>
                            <p className="mb-0">Clientes</p>
                        </div>
                    </div>
                    <div className="col-lg-3 col-sm-12">
                        <div onClick={()=>{setMessage(!message); setNumber(number + 1); if(message){setNumber(number - 1)}else{setNumber(number + 1)} }} className={message ? "role-button active" : "role-button"}>
                            <i className="material-icons">chat</i>
                            <p className="mb-0">Mensajes</p>
                        </div>
                    </div>
                    <div className="col-lg-3 col-sm-12">
                        <div onClick={()=>{setRefereds(!refereds); setNumber(number + 1); if(refereds){setNumber(number - 1)}else{setNumber(number + 1)} }} className={refereds ? "role-button active" : "role-button"}>
                            <i className="material-icons">drafts</i>
                            <p className="mb-0">Referidos</p>
                        </div>
                    </div>
                    <div className="col-lg-3 col-sm-12">
                        <div onClick={()=>{setServices(!services); setNumber(number + 1); if(services){setNumber(number - 1)}else{setNumber(number + 1)} }} className={services ? "role-button active" : "role-button"}>
                            <i className="material-icons">work</i>
                            <p className="mb-0">Servicios</p>
                        </div>
                    </div>
                    <div className="col-lg-3 col-sm-12">
                        <div onClick={()=>{setPromotions(!promotions); setNumber(number + 1); if(promotions){setNumber(number - 1)}else{setNumber(number + 1)} }} className={promotions ? "role-button active" : "role-button"}>
                            <i className="material-icons">grade</i>
                            <p className="mb-0">Promociones</p>
                        </div>
                    </div>
                    <div className="col-lg-3 col-sm-12">
                        <div onClick={()=>{setProducts(!products); setNumber(number + 1); if(products){setNumber(number - 1)}else{setNumber(number + 1)} }} className={products ? "role-button active" : "role-button"}>
                            <i className="material-icons">shopping_cart</i>
                            <p className="mb-0">Productos</p>
                        </div>
                    </div>
                </div>

          </div>
    )    

    async function onRegister() {
        setBtnMessage("Cargando...")
        try {
            let roleId = firebase.db.collection("Roles").doc().id;
            await firebase.db.collection("Roles").doc(roleId).set({
                roleId: roleId,
                aliadoId: user.aliadoId,
                roleNombre: nameRole,
                activeOrders: orders,
                activeClaims: claims,
                activeClients: clients,
                activeMessage: message,
                activeRefereds: refereds,
                activeServices: services,
                activePromotions: promotions,
                activeProducts: products,
            }).then((val)=>{
                if(services){
                    history.push({
                        state: {roleId: roleId, products: products},
                        pathname: "/create-role/addservices"
                    })
                }else if(!services && products){
                    history.push({
                        state: {roleId: roleId},
                        pathname: "/create-role/addproducts"
                    })
                }else if(!services && !products){
                    window.location.href = "/employes"
                }
            })
        } catch(e) {
            alert(e)
        }
    }

}

export default CreateRole
