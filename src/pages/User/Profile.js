import React, {useState, useEffect} from 'react'
import firebase from '../../firebase/config'
import {Link} from 'react-router-dom';

function Profile() {

  const [user, setUser] = useState({})
  const [userInfo, setUserInfo] = useState({
    nombre: "",
    nombreComercial: "",
    email: "",
    direccion: "",
    identificacion: "",
    tipoEmpresa: "",
    tipoAliado: "",
    pais: "",
  })

	useEffect(() => {
    firebase.getCurrentUser().then(setUser)
	}, [])

    return (

        <div className="main-content-container container-fluid px-4">

            <div className="page-header align-items-center justify-content-spacebetween row no-gutters py-2 px-4 my-4">
              <div className="col-12 col-sm-5 text-center text-sm-left mb-0">
                <div className="row align-items-center">
                  <Link to="/profile" className="ml-3 mr-3 page-title">Mi cuenta</Link>
                  <Link to="/bank" className="mr-3 page-title">Datos Bancarios</Link>
                  <Link to="/petpoints" className="mr-3 page-title">Puntos</Link>
                </div>
              </div>
              <div className="col-12 col-sm-1 mb-0">
                <div className="row align-items-center justify-content-space-around">
                  <i className="material-icons color-white display-5">help_outline</i>
                </div>
              </div>
            </div>
            {user ?
            <div className="container">
              <div className="row">
                <div className="col-md-2 col-sm-12">
                <img src={user.avatar} width="150" height="150" alt=""/>
                </div>
                <div className="col-md-10 col-sm-12">

                  <div className="row align-items-center mb-4">
                    <div className="col-sm-12 col-md-3">
                      <p className="my-0">Nombre completo</p>
                    </div>
                    <div className="col-sm-12 col-md-9">
                      <input value={userInfo.nombre} placeholder={user.nombre} onChange={(e)=>{setUserInfo({...userInfo, nombre: e.target.value})}} type="text" className="form-control"/>
                    </div>
                  </div>
                  <div className="row align-items-center mb-4">
                    <div className="col-sm-12 col-md-3">
                      <p className="my-0">Nombre comercial</p>
                    </div>
                    <div className="col-sm-12 col-md-9">
                      <input value={userInfo.nombreComercial} placeholder={user.nombreComercial} onChange={(e)=>{setUserInfo({...userInfo, nombreComercial: e.target.value})}} type="text" className="form-control"/>
                    </div>
                  </div>
                  <div className="row align-items-center mb-4">
                    <div className="col-sm-12 col-md-3">
                      <p className="my-0">Correo electrónico</p>
                    </div>
                    <div className="col-sm-12 col-md-9">
                      <p className="my-0">{user.email}</p>
                    </div>
                  </div>
                  <div className="row align-items-center mb-4">
                    <div className="col-sm-12 col-md-3">
                      <p className="my-0">Dirección</p>
                    </div>
                    <div className="col-sm-12 col-md-9">
                      <input value={userInfo.direccion} placeholder={user.direccion} onChange={(e)=>{setUserInfo({...userInfo, direccion: e.target.value})}} type="text" className="form-control"/>
                    </div>
                  </div>
                  <div className="row align-items-center mb-4">
                    <div className="col-sm-12 col-md-3">
                      <p className="my-0">Identificación</p>
                    </div>
                    <div className="col-sm-12 col-md-9">
                      <input value={userInfo.identificacion} placeholder={user.identificacion} onChange={(e)=>{setUserInfo({...userInfo, identificacion: e.target.value})}} type="text" className="form-control"/>
                    </div>
                  </div>
                  <div className="row align-items-center mb-4">
                    <div className="col-sm-12 col-md-3">
                      <p className="my-0">Tipo empresa</p>
                    </div>
                    <div className="col-sm-12 col-md-9">
                      <input value={userInfo.tipoEmpresa} placeholder={user.tipoEmpresa} onChange={(e)=>{setUserInfo({...userInfo, tipoEmpresa: e.target.value})}} type="text" className="form-control"/>
                    </div>
                  </div>
                  <div className="row align-items-center mb-4">
                    <div className="col-sm-12 col-md-3">
                      <p className="my-0">Tipo de aliado</p>
                    </div>
                    <div className="col-sm-12 col-md-9">
                      <p className="my-0">{user.tipoAliado}</p>                    
                    </div>
                  </div>
                  <div className="row align-items-center mb-4">
                    <div className="col-sm-12 col-md-3">
                      <p className="my-0">País</p>
                    </div>
                    <div className="col-sm-12 col-md-9">
                      <p className="my-0">{user.pais}</p>
                    </div>
                  </div>
                  <div className="row align-items-center mb-4">
                    <div className="col-sm-12 col-md-3">
                      <p className="my-0"></p>
                    </div>
                    <div className="col-sm-12 col-md-9">                      
                      <button onClick={updateProfile} className="btn btn-primary btn-block">Actualizar</button>
                    </div>
                  </div>

                </div>
              </div>
            </div>
            : <p>Cargando</p> 
            }

          </div>
    )

    async function updateProfile(){
      await firebase.db.collection("Aliados").doc(user.aliadoId).update({
        nombre: userInfo.nombre === "" ? user.nombre : userInfo.nombre ,
        nombreComercial: userInfo.nombreComercial === "" ? user.nombreComercial : userInfo.nombreComercial,
        direccion: userInfo.direccion === "" ? user.direccion : userInfo.direccion,
        identificacion: userInfo.identificacion === "" ? user.identificacion : userInfo.identificacion,
        tipoEmpresa: userInfo.tipoEmpresa === "" ? user.tipoEmpresa : userInfo.tipoEmpresa,
      })
    }

}

export default Profile
