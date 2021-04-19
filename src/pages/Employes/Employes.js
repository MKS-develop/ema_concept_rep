import React, {useState, useEffect} from 'react'
import firebase from '../../firebase/config'
import {useHistory, Link} from 'react-router-dom';


function Employes() {

    const history = useHistory()
    const [aliados, setAliados] = useState([])
    const [user, setUser] = useState({})
    const [aliado, setAliado] = useState({})

    const getAliados = async(aliadoId) =>{
      let tipos = [];
      
      const reference = firebase.db.collection('Aliados').doc(aliadoId).collection("Usuarios")

      await reference.get().then(val => {
        val.docs.forEach(item=>{
          tipos.push(item.data())
        })
        getSubAliados(tipos)
      })
    }
    
    const getSubAliados = async(a) =>{
      let tipos = [];
      
      await Promise.all(a.map(async (ai) => {
        await firebase.db.collection("Aliados").doc(ai.aliadoId).get().then(val=>{
          tipos.push(val.data())
         })
      }))
      setAliados(tipos)

    }

    useEffect(() => {
        firebase.getCurrentUser().then((val)=>{
          setUser(val)
          getAliados(val.aliadoId)
        });
    }, [])

    return (

        <div className="main-content-container container-fluid px-4">
          {aliado.aliadoId === undefined
          ? 
          <div>

              <div className="page-header align-items-center justify-content-spacebetween row no-gutters px-4 my-4">
                <div className="col-12 col-sm-5 text-center text-sm-left mb-0">
                  <div className="row align-items-center">
                    <div className="col">
                      <p className="page-title">Administrador de usuarios</p>
                    </div>
                  </div>
                </div>
                <div className="col-12 col-sm-1 mb-0">
                  <div className="row align-items-center justify-content-space-around">
                    <i className="material-icons color-white display-5">help_outline</i>
                  </div>
                </div>
              </div>
              <div className="form-row align-items-center justify-content-space-between mb-4">
                <Link to="/create-user" className="btn btn-secondary mr-3">Agregar usuario</Link>
                <Link to="/create-role" className="btn btn-outline-secondary">Crear rol</Link>
              </div>
              <div className="row">
                  <div className="col-lg-12 col-md-12 col-sm-12">
                    <div className="mb-2 row orders-title">
                      <div className="col-md-1 ">
                        <p className="mb-2"></p>
                      </div>
                      <div className="col-md-3 ">
                        <p className="mb-2">Nombre del usuario</p>
                      </div>
                      <div className="col-md-3 ">
                        <p className="mb-2">Correo electronico</p>
                      </div>
                      <div className="col-md-2 ">
                        <p className="mb-2"></p>
                      </div>
                      <div className="col-md-2 ">
                        <p className="mb-2">Rol del usuario</p>
                      </div>
                      <div className="col-md-1 ">
                        <p className="mb-2"></p>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-12 col-md-12 col-sm-12">
                    <div className="orders-container">
                      {
                        aliados.length > 0 ? aliados.map(aliado=>{
                          return(
                            <div onClick={() => setAliado(aliado)} key={aliado.aliadoId} className="mb-2 row order-child align-items-center">
                              <div className="col-md-1 color-primary">
                                <img className="client-avatar-preview rounded-circle mr-2" src={aliado.avatar ?? "cargando"} alt="Aliado Avatar"/>
                              </div>
                              <div className="col-md-3 ">
                                <p className="mb-0">{aliado.nombre}</p>
                              </div>
                              <div className="col-md-3 ">
                                <p className="mb-0">{aliado.email}</p>
                              </div>
                              <div className="col-md-2 ">
                                <p className="mb-0"></p>
                              </div>
                              <div className="col-md-2 color-success">
                                <p className="mb-0">{aliado.rol}</p>
                              </div>
                              <div className="col-md-1">
                                <p className="mb-0 material-icons">visibility</p>
                              </div>
                            </div>
                          )
                        }) : <div className="text-center"><p>No hay aliados</p></div>
                      }
                    </div>
                  </div>
              </div>
            </div>
            
            
            : <div>

              <div className="page-header align-items-center justify-content-spacebetween row no-gutters px-4 my-4">
                <div className="col-12 col-sm-5 text-center text-sm-left mb-0">
                  <div className="row align-items-center">
                    <div className="col">
                      <p onClick={()=>{setAliado({})}} className="page-title"><i className="material-icons">arrow_back</i> Regresar</p>
                    </div>
                  </div>
                </div>
                <div className="col-12 col-sm-1 mb-0">
                  <div className="row align-items-center justify-content-space-around">
                    <i className="material-icons color-white display-5">help_outline</i>
                  </div>
                </div>
              </div>
              <h3 className="mb-5">Detalle del usuario</h3>
              <div className="row">
                <div className="col-lg-4">
                  <p className="mb-0 bold color-primary">Nombre del usuario</p>
                  <p>{aliado.nombre}</p>
                </div>
                <div className="col-lg-4">
                  <p className="mb-0 bold color-primary">Status</p>
                  <p>{aliado.status}</p>
                </div>
                <div className="col-lg-4">
                  <p className="mb-0 bold color-primary">email</p>
                  <p>{aliado.email}</p>
                </div>
                <div className="col-lg-4">
                  <p className="mb-0 bold color-primary">Tipo de aliado</p>
                  <p>{aliado.tipoAliado}</p>
                </div>
                <div className="col-lg-4">
                  <p className="mb-0 bold color-primary">Tipo de empresa</p>
                  <p>{aliado.tipoEmpresa}</p>
                </div>
                <div className="col-lg-4">
                  <p className="mb-0 bold color-primary">Teléfono</p>
                  <p>{aliado.telefono}</p>
                </div>
              </div>

            </div>}

          </div>
    )

}

export default Employes
