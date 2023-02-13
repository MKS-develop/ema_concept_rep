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
                {/* <Link to="/create-role" className="btn btn-outline-secondary">Crear rol</Link> */}
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
                            <div onClick={() => setAliado(aliado)} key={aliado.aliadoId} style={{padding: "8px 12px"}} className="mb-2 row order-child align-items-center">
                              <div className="col-md-1 color-primary">
                                <img className="client-avatar-preview rounded-circle mr-2" src={aliado.avatar ?? "https://toppng.com/uploads/preview/free-icons-png-call-center-icon-circle-11563051028y6ypidiusb.png "} alt="avatar"/>
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
                                <p className="mb-0">{aliado.role}</p>
                              </div>
                              <div className="col-md-1">
                                <p className="mb-0 material-icons"></p>
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
              <div className="row mb-5 container">
                <h3 className="mb-0">Empleado</h3>
                <div onClick={()=>{ updateUser() }} className={`btn ml-5 btn-outline-primary`}>
                  Actualizar
                </div>
              </div>
              <h3 className="mb-5">Detalle del usuario</h3>
              <div className="row">
                <div className="col-lg-4 mb-4">
                  <p className="mb-2 bold color-primary">Nombre del usuario</p>
                  <input className='form-control' defaultValue={aliado?.nombre} onChange={(e)=>{ setAliado({...aliado, nombre: e.target.value}) }} />
                </div>
                <div className="col-lg-4 mb-4">
                  <p className="mb-2 bold color-primary">Dirección</p>
                  <input className='form-control' defaultValue={aliado?.direccion} onChange={(e)=>{ setAliado({...aliado, direccion: e.target.value}) }} />
                </div>
                <div className="col-lg-4 mb-4">
                  <p className="mb-2 bold color-primary">email</p>
                  <p>{aliado?.email}</p>
                </div>
                <div className="col-lg-4 mb-4">
                  <p className="mb-2 bold color-primary">Tipo de aliado</p>
                  <input className='form-control' defaultValue={aliado?.tipoAliado} onChange={(e)=>{ setAliado({...aliado, tipoAliado: e.target.value}) }} />
                </div>
                <div className="col-lg-4 mb-4">
                  <p className="mb-2 bold color-primary">Tipo de empresa</p>
                  <input className='form-control' defaultValue={aliado?.tipoEmpresa} onChange={(e)=>{ setAliado({...aliado, tipoEmpresa: e.target.value}) }} />
                </div>
                <div className="col-lg-4 mb-4">
                  <p className="mb-2 bold color-primary">Teléfono</p>
                  <input className='form-control' defaultValue={aliado?.telefono} onChange={(e)=>{ setAliado({...aliado, telefono: e.target.value}) }} />
                </div>
              </div>

            </div>}

          </div>
    )

  async function updateUser(){
    try {
      await firebase.db.collection("Aliados").doc(aliado["aliadoId"]).update(aliado)
    } catch (e) {
      console.log(e)
    }
  }

}

export default Employes
