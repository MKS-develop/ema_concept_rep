import React, {useState, useEffect} from 'react'
import firebase from '../../firebase/config'
import {Link, useHistory} from 'react-router-dom';

function CreateRole() {

    let history = useHistory()
    const [btnMessage, setBtnMessage] = useState("Crear rol");
    const [user, setUser] = useState({})
    const [emessage, setEmessage] = useState("")
    const [error, setError] = useState(false)
    const [canMakeReserves, setCanMakeReserves] = useState(false)
    const [canAccessAgenda, setCanAccessAgenda] = useState(false)
    const [canViewClients, setCanViewClients] = useState(false)
    const [canChargeFile, setCanChargeFile] = useState(false)
    const [canViewAllCenters, setCanViewAllCenters] = useState(false)
    const [canFilterByStatus, setCanFilterByStatus] = useState(false)

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
                        <div onClick={()=>{setCanMakeReserves(!canMakeReserves); if(canMakeReserves){setNumber(number - 1)}else{setNumber(number + 1)}}} className={canMakeReserves ? "role-button active" : "role-button"}>
                            <i className="material-icons">inbox</i>
                            <p className="mb-0">canMakeReserves</p>
                        </div>
                    </div>
                    <div className="col-lg-3 col-sm-12">
                        <div onClick={()=>{setCanAccessAgenda(!canAccessAgenda); if(canAccessAgenda){setNumber(number - 1)}else{setNumber(number + 1)}}} className={canAccessAgenda ? "role-button active" : "role-button"}>
                            <i className="material-icons">inbox</i>
                            <p className="mb-0">canAccessAgenda</p>
                        </div>
                    </div>
                    <div className="col-lg-3 col-sm-12">
                        <div onClick={()=>{setCanViewClients(!canViewClients); if(canViewClients){setNumber(number - 1)}else{setNumber(number + 1)}}} className={canViewClients ? "role-button active" : "role-button"}>
                            <i className="material-icons">inbox</i>
                            <p className="mb-0">canViewClients</p>
                        </div>
                    </div>
                    <div className="col-lg-3 col-sm-12">
                        <div onClick={()=>{setCanChargeFile(!canChargeFile); if(canChargeFile){setNumber(number - 1)}else{setNumber(number + 1)}}} className={canChargeFile ? "role-button active" : "role-button"}>
                            <i className="material-icons">inbox</i>
                            <p className="mb-0">canChargeFile</p>
                        </div>
                    </div>
                    <div className="col-lg-3 col-sm-12">
                        <div onClick={()=>{setCanViewAllCenters(!canViewAllCenters); if(canViewAllCenters){setNumber(number - 1)}else{setNumber(number + 1)}}} className={canViewAllCenters ? "role-button active" : "role-button"}>
                            <i className="material-icons">inbox</i>
                            <p className="mb-0">canViewAllCenters</p>
                        </div>
                    </div>
                    <div className="col-lg-3 col-sm-12">
                        <div onClick={()=>{setCanFilterByStatus(!canFilterByStatus); if(canFilterByStatus){setNumber(number - 1)}else{setNumber(number + 1)}}} className={canFilterByStatus ? "role-button active" : "role-button"}>
                            <i className="material-icons">inbox</i>
                            <p className="mb-0">canFilterByStatus</p>
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
                canMakeReserves,
                canAccessAgenda,
                canViewClients,
                canChargeFile,
                canViewAllCenters,
                canFilterByStatus
            }).then((val)=>{
                window.location.href = "/employes"
            })
        } catch(e) {
            alert(e)
        }
    }

}

export default CreateRole
