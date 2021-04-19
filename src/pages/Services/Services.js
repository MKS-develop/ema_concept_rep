import React, {useState, useEffect} from 'react'
import firebase from '../../firebase/config'
import {Link, Redirect, useHistory} from 'react-router-dom';
import moment from 'moment';

function Services() {

    const history = useHistory()
    const hiddenFileInput = React.useRef(null);
    const [btnMessage, setBtnMessage] = useState("Crear servicio");
    const [LPID, setLPID] = useState("");
    const [localidadId, setLocalidadId] = useState("");
    const [services, setServices] = useState([])
    const [localidades, setLocalidades] = useState([])
    const [localidadesVarias, setLocalidadesVarias] = useState([])
    const [user, setUser] = useState({})
    const [delivery, setDelivery] = useState(false)
    const [allLocalidades, setAllLocalidades] = useState(false)
    const [domicilio, setDomicilio] = useState(false)
    const [tipoServicios, setTipoServicios] = useState([])
    const [tiposCate, setTiposCate] = useState([])
    const [service, setService] = useState({})
    const tipoUnidad = ["Servicio", "Semana", "Día", "Hora", "Minuto"]
    const [update, setUpdate] = useState(false);
    const [showLocalidadesModal, setShowLocalidadesModal] = useState(false);
    const [servInfo, setServInfo] = useState({
      categoria: "",
      titulo: "",
      unidad: "",
      descripcion: "",
      condiciones: "",
      precio: 0,
      capacidad: 0,
      precioDomicilio: 0,
      precioDelivery: 0,
    })
    
    const [servUInfo, setServUInfo] = useState({
      condiciones: null,
      descripcion: null,
      precio: null,
      urlImagen: null,
      capacidad: null,
      unidad: null,
      domicilio: null,
      delivery: null,
    })

    const [file, setFile] = useState(null);
    const [url, setURL] = useState("");
    const [src, setImg] = useState('');
  
    const handleClick = event => {
      hiddenFileInput.current.click();
    };

    function handleChange(e) {
      setImg(URL.createObjectURL(e.target.files[0]))
      setFile(e.target.files[0])
    }
    
    function getCategories(){
      let tipos = []
      firebase.db.collection('CategoriasServicios').get().then(data=>{  
        data.forEach(tipo=>{
          tipos.push(tipo.id)
          tipos.sort()
        })
        // tipos.pop("Todas")
        setTiposCate(tipos)
      });
    }

    function getServicesCategories(cate){
      let tipos = [];
      firebase.db.collection('CategoriasServicios').doc(cate).collection("Servicios").get().then(data=>{
        data.docs.forEach(item=>{
          tipos.push(item.id)
        })
        setTipoServicios(tipos)
      });
    }

    const getServices = async(id) =>{
      let tipos = [];
      await firebase.db.collection("Localidades").where("lc", "==", "Localidad Principal")
      .where("aliadoId", "==", id).get().then(val=>{
        val.docs.forEach(item=>{
          firebase.db.collection("Localidades").doc(item.data().localidadId).collection("Servicios").get().then(val=>{
            val.docs.forEach(item=>{
              tipos.push(item.data())
            })
            setServices(tipos)
          })
        })
      })
    }
    
    const getLocalidades = async(id) =>{
      let tipos = [];
      await firebase.db.collection("Localidades")
      .where("aliadoId", "==", id).get().then(val=>{
        val.docs.forEach(item=>{
          tipos.push(item.data())
        })
        setLocalidades(tipos)    
      })
    }

    const getLPID = async(id) =>{
      await firebase.db.collection("Localidades").where("lc", "==", "Localidad Principal")
      .where("aliadoId", "==", id).get().then(val=>{
        val.docs.forEach(item=>{
          setLPID(item.data().localidadId)
        })
      })

    }
    
    const setterLocalidades = () =>{
      setLocalidadesVarias(localidades)
    }
    
    useEffect(() => {
      firebase.getCurrentUser().then((val)=>{
        getLPID(val.aliadoId)
        getServices(val.aliadoId)
        getLocalidades(val.aliadoId)
        setUser(val)
      })
      getCategories()
    }, [])

    return (
        <div className="main-content-container container-fluid px-4">
          { showLocalidadesModal
          ? <div className="cc-modal-wrapper fadeIn">
              <div className="cc-modal">
                <div className="cc-modal-header mb-2">
                  <div className="no-gutters mb-3 row align-items-center justify-content-spacebetween">
                    <h3 className="mb-0">Localidades</h3>
                    <div className="row no-gutters position-relative custom-control custom-checkbox">
                      <input onClick={()=>{ setterLocalidades() }} type="checkbox" className="custom-control-input" id="formsCheckboxDefault"/>
                      <label className="custom-control-label" for="formsCheckboxDefault">Todas las localidades</label>
                    </div>
                  </div>
                </div>
                <div className="cc-modal-body">
                  {localidades.map((l)=>{
                    return (
                      <div onClick={()=>{ localidadesVarias.includes(l) ? 
                        setLocalidadesVarias(localidadesVarias.filter((l1) => l1 !== l))
                      : setLocalidadesVarias([l, ...localidadesVarias]) }} className={`cc-modal-card mx-1 cursor-pointer ${localidadesVarias.includes(l) ? "active" : "" }`} style={{backgroundImage: `url(${l.locacionImg})` }} key={l.localidadId}>
                        <div className="cc-modal-card-overlay">
                          <p className="mb-0 cc-modal-card-p">
                            {l.direccionLocalidad}
                          </p>
                          <p className="mb-0 cc-modal-card-p-strong">
                            {l.nombreLocalidad}
                          </p>
                        </div>
                      </div>
                    )
                  })}
                </div>
                <div className="cc-modal-footer align-items-center justify-content-spacebetween">
                  {/* <div className={`btn ${"btn-primary"}`}> */}
                  <button onClick={()=>{setShowLocalidadesModal(false)}} className={`btn btn-disabled`}>
                    Cancelar
                  </button>
                  <button onClick={()=>{setShowLocalidadesModal(false)}} className={`btn btn-primary`}>
                    Guardar
                  </button>
                </div>
              </div>
            </div>
          : <div></div>
          }
            <div className="page-header align-items-center justify-content-spacebetween row no-gutters px-4 my-4">
              <div className="col-12 col-sm-5 text-center text-sm-left mb-0">
                <div className="row align-items-center">
                  <div className="ml-2 col row">
                    <p className="page-title bold"><Link className="page-title light" to="/configuration">Configuración</Link> {'>'} Servicios</p>
                  </div>
                </div>
              </div>
              <div className="col-12 col-sm-1 mb-0">
                <div className="row align-items-center justify-content-space-around">
                  <i className="material-icons color-white display-5">help_outline</i>
                </div>
              </div>
            </div>

            <div className="row">
                <div className="col-lg-7 col-md-7 col-sm-12">
                    <div className="row">
                      {
                        services.length > 0 ? services.map(service=>{
                        return(
                          <div className="col-md-6 col-sm-12">
                            <div  onClick={() => setService(service)} key={service.serviceId}  className="card card-small card-post mb-4">
                              <div className="card-post__image" style={{backgroundImage: `url(${service.urlImagen})` }}></div>
                              <div className="card-body">
                                <h5 className="card-title">
                                  <p className="text-fiord-blue mb-2">{service.titulo}</p>
                                </h5>
                                <p className="card-text-type mb-2">{service.categoria}</p>
                                <p className="card-text mb-2">{service.descripcion}</p>
                                <p className="card-text-price">S/{service.precio}</p>
                              </div>
                            </div>
                          </div>
                          // <div className="col-md-6 col-sm-12">

                          //   <div  onClick={() => setService(service)} key={service.serviceId} style={{backgroundImage: `url(${service.urlImagen})` }} className="custom-card mb-4">
                          //     <div className="custom-card-body">
                          //       <h5 className="custom-card-title">
                          //         <p className="text-fiord-blue mb-2">{service.titulo}</p>
                          //       </h5>
                          //       <p className="custom-card-text-type mb-2">{service.categoria}</p>
                          //       <p className="custom-card-text mb-2">{service.descripcion}</p>
                          //       <p className="custom-card-text-price">S/{service.precio}</p>
                          //     </div>
                          //   </div>

                          // </div>
                        )
                        }) : <div className="text-center col-lg-12"><p>No hay servicios</p></div>
                      }
                    </div>
                </div>
                <div className="col-lg-5 col-md-5 col-sm-12">
                    { service.titulo != null && !update ? 
                    <div className="card">
                      <div className="card-header-img-width">
                        <img src={service.urlImagen} alt=""/>
                      </div>
                      <div onClick={()=>setService({})} className="card-close-btn">
                        <span>X</span>
                      </div>
                      <div className="px-4">
                        <div className="card-claim-box">
                          <p className="card-claim-title">{service.categoria}</p>
                          <p className="card-claim-text">{service.titulo}</p>
                        </div>
                        <div className="card-claim-box">
                          <p className="card-claim-title">Precio del servicio</p>
                          <p className="card-claim-text">S/{service.precio}</p>
                        </div>
                        <div className="card-claim-box">
                          <p className="card-claim-title">Descripción del servicio</p>
                          <p className="card-claim-text">{service.descripcion}</p>
                        </div>
                        <div className="card-claim-box">
                          <p className="card-claim-title">Condiciones del servicio</p>
                          <p className="card-claim-text">{service.condiciones}</p>
                            </div>

                      </div>
                      <div className="card-footer">
                        <div className="row">
                          <div className="col-md-6 col-sm-12">
                            <button onClick={deleteService} className="btn btn-outline-danger">Eliminar servicio</button>
                          </div>
                          <div className="col-md-6 col-sm-12">
                            <button onClick={()=>{setUpdate(true); }} className="btn btn-primary">Editar servicio</button>
                          </div>
                        </div>
                      </div>
                    </div>
                    : update ?
                    <form onSubmit={e => e.preventDefault() && false }>
                      <div className="card">
                        <div className="card-header text-center">
                          <h4>Actualizar servicio</h4>
                        </div>
                        <div onClick={()=>{ setUpdate(false); setService({});} } className="card-close-btn">
                          <span>X</span>
                        </div>
                        <div className="px-4">

                          <input type="file"
                            ref={hiddenFileInput}
                            onChange={handleChange} 
                            style={{display: 'none'}}
                          />
                          <div onClick={handleClick} className="card-update-product-img-fwidth">
                            {src !== "" ? <img src={src} alt="" /> : <img src={service.urlImagen} alt="" />}
                          </div>
                          <div className="form-group">
                            <select className="form-control" placeholder={service.unidad} value={servInfo.unidad} onChange={e => setServUInfo({...servInfo, unidad: e.target.value})}>
                              {tipoUnidad.map(data => (
                                  <option key={data} value={data}>{data}</option>
                              ))}
                            </select>
                          </div>
                          <div className="form-group">
                            <input type="text" onChange={e => setServUInfo({...servInfo, descripcion: e.target.value})} placeholder={service.descripcion} className="form-control"/>
                          </div>
                          <div className="form-group">
                            <input type="text" onChange={e => setServUInfo({...servInfo, condiciones: e.target.value})} placeholder={service.condiciones} className="form-control"/>
                          </div>
                          <div className="input-group mb-3">
                            <div className="input-group-prepend">
                              <span className="input-group-text">S/</span>
                            </div>
                            <input type="text" className="form-control" placeholder={service.precio} onChange={(e)=>{setServUInfo({...servInfo, precio: e.target.value})}}/>
                          </div>
                        </div>
                        <div className="card-footer">
                          <button onClick={()=>{saveUpdatePromo()}} className="btn btn-primary btn-block">Actualizar servicio</button>
                        </div>
                      </div>
                    </form>
                    :<form onSubmit={e => e.preventDefault() && false }>
                      <div className="card">
                        <div className="card-header text-center">
                          <h4>Subir servicio</h4>
                        </div>
                        <div className="px-4">

                          <input type="file"
                            ref={hiddenFileInput}
                            onChange={handleChange} 
                            style={{display: 'none'}}
                          />
                          <div onClick={handleClick} className="card-update-product-img-fwidth">
                            {src !== "" ? <img src={src} alt="" /> : <div className="card-header-img-upload"><p className="material-icons icon">add</p><p className="mb-0">Cargar imagen</p></div>}
                          </div>
                          <div className="form-group my-4">
                            <button onClick={()=>{setShowLocalidadesModal(true)}} className="btn btn-primary btn-block">Mostrar localidades</button>
                          </div>
                          {/* <div className="form-group">
                            <div className="custom-control custom-checkbox mb-1">
                              <input onClick={()=>{setAllLocalidades(!allLocalidades) }} type="checkbox" className="custom-control-input" id="formsCheckboxDefault" />
                              <label className="custom-control-label" htmlFor="formsCheckboxDefault">Agregar a todas las localidades</label>
                            </div>
                          </div>
                          {!allLocalidades ? <div className="form-group">
                            <select className="form-control" value={localidadId} onChange={(e) =>{ setLocalidadId(e.target.value) } }>
                              <option>Seleccione la localidad</option>
                              {localidades.map(data => (
                                <option key={data} value={data.localidadId}>{data.nombreLocalidad}</option>
                              ))}
                            </select>
                          </div> : <div></div>} */}
                          <div className="form-group">
                            <select className="form-control" value={servInfo.categoria} onChange={(e) =>{ setServInfo({...servInfo, categoria: e.target.value}); getServicesCategories(e.target.value) } }>
                              {tiposCate.map(data => (
                                  <option key={data} value={data}>{data}</option>
                              ))}
                            </select>
                          </div>
                          {servInfo.categoria === "" ? <div></div> : <div className="form-group">
                            <select className="form-control" value={servInfo.titulo} onChange={e => setServInfo({...servInfo, titulo: e.target.value})}>
                              {tipoServicios.map(data => (
                                  <option key={data} value={data}>{data}</option>
                              ))}
                            </select>
                          </div>}
                          <div className="form-group">
                            <select className="form-control" value={servInfo.unidad} onChange={e => setServInfo({...servInfo, unidad: e.target.value})}>
                              {tipoUnidad.map(data => (
                                  <option key={data} value={data}>{data}</option>
                              ))}
                            </select>
                          </div>
                          <div className="form-group">
                            <input type="text" onChange={e => setServInfo({...servInfo, descripcion: e.target.value})} placeholder="Descripción del servicio" className="form-control"/>
                          </div>
                          <div className="form-group">
                            <input type="text" onChange={e => setServInfo({...servInfo, condiciones: e.target.value})} placeholder="Condiciones del servicio" className="form-control"/>
                          </div>
                          <div className="input-group mb-3">
                            <div className="input-group-prepend">
                              <span className="input-group-text">S/</span>
                            </div>
                            <input type="text" className="form-control" placeholder="Precio del servicio" onChange={(e)=>{setServInfo({...servInfo, precio: e.target.value})}}  value={servInfo.precio} />
                          </div>
                        </div>
                        <div className="card-footer">
                          <button onClick={()=>{uploadService()}} className="btn btn-primary btn-block">{btnMessage}</button>
                        </div>
                      </div>
                    </form>}
                </div>
            </div>

          </div>
    )

    function print(){
      console.log(localidadId)
    }

    async function uploadService() {
      setBtnMessage("Subiendo...")
      let date = moment().toDate().toUTCString()
      let id = firebase.db.collection("Localidades").doc(LPID).collection("Servicios").doc().id
      try {
        await firebase.storage.ref(`/Servicios imagenes/${file.name}`).put(file)
        firebase.storage.ref("Servicios imagenes").child(file.name).getDownloadURL().then((urlI) => {
          if(localidadesVarias.length > 0){
            localidadesVarias.forEach(localidad=>{
              uploadPart(id, localidad.localidadId, urlI)
            })
            setBtnMessage("Listo");
            history.push({
              pathname: "/configuration/services/agenda", 
              state: { all: true, serviceId: id}
            })
          }else{
            if(LPID === localidadId){
              uploadPart(id, LPID, urlI).then((val)=>{
                setBtnMessage("Listo");
                history.push({
                  pathname: '/configuration/services/agenda',
                  state: { all: false, serviceId: id, localidadId: LPID}
                })
              })
            }else{
              uploadPart(id, localidadId, urlI)
              uploadPart(id, LPID, urlI).then((val)=>{
                setBtnMessage("Listo");
                history.push({
                  pathname: "/configuration/services/agenda", 
                  state: { all: false, serviceId: id, listLocalidades: [LPID, localidadId], noPrincipal: true}
                })
              })
            }
  
          }
        })
      } catch(error) {
        alert(error.message)
      }
    }

    async function uploadPart(id, lid, urlImagen){
      await firebase.db.collection("Localidades").doc(lid).collection("Servicios").doc(id).set({
        activo: true,
        agendaContiene: false,
        aliadoId: user.aliadoId,
        categoria: servInfo.categoria,
        condiciones: servInfo.condiciones,
        descripcion: servInfo.descripcion,
        precio: parseInt(servInfo.precio),
        localidadId: lid,
        servicioId: id,
        urlImagen: urlImagen,
        titulo: servInfo.titulo,
        capacidad:  parseInt(servInfo.capacidad),
        unidad: servInfo.unidad,
        domicilio: !domicilio ? null : parseInt(servInfo.precioDomicilio),
        delivery: !delivery ? null : parseInt(servInfo.precioDelivery),
        createdOn: moment().toDate(),
      })
      console.log("Listo")
    }
      
    async function saveUpdatePromo(){
      if(file){
        try {
          await firebase.storage.ref(`/Servicios imagenes/${file.name}`).put(file)
          firebase.storage.ref("Servicios imagenes").child(file.name).getDownloadURL().then((urlI) => {
            firebase.db.collection('Localidades').doc(service.localidadId).collection("Servicios").doc(service.servicioId).update({
              condiciones: servInfo.condiciones,
              descripcion: servInfo.descripcion,
              precio: servUInfo.precio !== null ? parseInt(servUInfo.precio) : service.precio,
              urlImagen: urlI,
              capacidad:  servUInfo.capacidad ?? service.capacidad,
              unidad: servUInfo.unidad ?? service.unidad,
              domicilio: servUInfo.domicilio ??service.domicilio,
              delivery: servUInfo.delivery ?? service.delivery,
            })
          })
        } catch (e) {
          alert(e.message)
        }
      }else{
        await firebase.db.collection('Localidades').doc(service.localidadId).collection("Servicios").doc(service.servicioId).update({
          condiciones: servUInfo.condiciones ?? service.condiciones,
          descripcion: servUInfo.descripcion ?? service.descripcion,
          precio: servUInfo.precio !== null ? parseInt(servUInfo.precio) : service.precio,
          urlImagen: service.urlImagen,
          capacidad:  servUInfo.capacidad ?? service.capacidad,
          unidad: servUInfo.unidad ?? service.unidad,
          domicilio: servUInfo.domicilio ??service.domicilio,
          delivery: servUInfo.delivery ??service.delivery,
        })
      }
    }

    async function deleteService(){      
      try{
        await firebase.db.collection('Localidades').doc(service.localidadId).collection("Servicios").doc(service.servicioId).collection("Agenda").get().then((val)=>{
          let data = []
          val.docs.forEach((ds)=>{
            data.push(ds.data().fecha)
          })
          data.forEach((d) => {
            firebase.db.collection('Localidades').doc(service.localidadId).collection("Servicios").doc(service.servicioId).collection("Agenda").doc(d).delete().then((val)=>{
              console.log("Eliminado: " + d)
            })
          })
        })
        await firebase.db.collection('Localidades').doc(service.localidadId).collection("Servicios").doc(service.servicioId).delete().then((val)=>{
          window.location.href = "/configuration/services"
        })
      }catch(e){
        console.log("Error: " + e);
      }
    }

}

export default Services
