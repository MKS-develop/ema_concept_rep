import React, {useEffect, useState} from 'react'
import {Link} from 'react-router-dom';
import firebase from '../firebase/config'


function Configuration() {
  const [user, setUser] = useState({})

  useEffect(() => {
    firebase.getCurrentUser().then(setUser);
	}, [])

    return (
        <div className="main-content-container container-fluid px-4">

            <div className="page-header align-items-center justify-content-spacebetween row no-gutters py-2 px-4 my-4">
              <div className="col-12 col-sm-5 text-center text-sm-left mb-0">
                <div className="row align-items-center">
                  <div className="col">
                    <p className="page-title">Configuración</p>
                  </div>
                </div>
              </div>
              <div className="col-12 col-sm-1 mb-0">
                <div className="row align-items-center justify-content-space-around">
                  <i className="material-icons color-white display-5">help_outline</i>
                </div>
              </div>
            </div>
            
            <div className="container row">
              <div className="col-md-4 col-sm-12 mb-4">
                <Link className="card" to="/configuration/services">
                  <div className="card-body">
                    <div className="row align-items-center">
                      <div className="col-md-4 col-sm-12 card-config-img">
                        <img src="../images/icons/servicios.svg" alt="" width="60" height="60"/>
                      </div>
                      <div className="col-md-8 col-sm-12">
                        <p className="card-config-p mb-0">Servicios</p>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
              <div className="col-md-4 col-sm-12 mb-4">
                <Link className="card" to="/configuration/products">
                  <div className="card-body">
                    <div className="row align-items-center">
                      <div className="col-md-4 col-sm-12 card-config-img">
                        <img src="../images/icons/productos.svg" alt="" width="60" height="60"/>
                      </div>
                      <div className="col-md-8 col-sm-12">
                        <p className="card-config-p mb-0">Productos</p>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
              <div className="col-md-4 col-sm-12 mb-4">
                <Link className="card" to="/configuration/localitys">
                  <div className="card-body">
                    <div className="row align-items-center">
                      <div className="col-md-4 col-sm-12 card-config-img">
                        <img src="../images/icons/localidades.svg" alt="" width="60" height="60"/>
                      </div>
                      <div className="col-md-8 col-sm-12">
                        <p className="card-config-p mb-0">Localidades</p>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
              <div className="col-md-4 col-sm-12 mb-4">
                <Link className="card" to="/profile">
                  <div className="card-body">
                    <div className="row align-items-center">
                      <div className="col-md-4 col-sm-12 card-config-img">
                        <img src="../images/icons/cuenta.svg" alt="" width="60" height="60"/>
                      </div>
                      <div className="col-md-8 col-sm-12">
                        <p className="card-config-p mb-0">Mi cuenta</p>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
              {user.tipoAliado === "Médico" ?
              <div className="col-md-4 col-sm-12 mb-4">
                <Link className="card" to="/configuration/specialitys">
                  <div className="card-body">
                    <div className="row align-items-center">
                      <div className="col-md-4 col-sm-12 card-config-img">
                        <img src="../images/icons/especialidades.svg" alt="" width="60" height="60"/>
                      </div>
                      <div className="col-md-8 col-sm-12">
                        <p className="card-config-p mb-0">Especialidades</p>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
              : <div></div>
              }
            </div>

          </div>
    )
}

export default Configuration
