import React, {useEffect, useState, useRef} from 'react'
import firebase from '../../firebase/config'
import {Link, Redirect, useHistory, useLocation} from 'react-router-dom';
import moment from 'moment';
import utils from '../../firebase/utils';
import Compress from "react-image-file-resizer";

function DetailService() {
    
    const history = useHistory()  
    const data = useLocation()
    const [tiposCate, setTiposCate] = useState([])
    const [tipoServicios, setTipoServicios] = useState([])
    const [palabrasClave, setPalabrasClave] = useState([])
    const [localidades, setLocalidades] = useState([])
    const [localidadesVarias, setLocalidadesVarias] = useState([])
    const [listErrors, setListErrors] = useState([])
    const [agendaDays, setAgendaDays] = useState([])
    const [species, setSpecies] = useState([])
    const [razas, setRazas] = useState([])

    const [successMsg, setSuccessMsg] = useState("");
    const [errorMsg, setErrorMsg] = useState("");
    const [palabra, setPalabra] = useState("")
    const [localidadId, setLocalidad] = useState("")
    const [LPID, setLPID] = useState("");
    const [btnMessage, setBtnMessage] = useState("Subir servicio");
    const [agendaPopupDescription, setAgendaPopupDescription] = useState("A este servicio le falta la agenda");
    const [agendaPopupTitle, setAgendaPopupTitle] = useState("Advertencia");

    const [countryInfo, setCountryInfo] = useState({})
    const [user, setUser] = useState({})
    const [day, setDay] = useState({})

    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(false);
    const [finalClientStatus, setFinalClientStatus] = useState(true);
    const [aliadoClientStatus, setAliadoClientStatus] = useState(false);
    const [petPointsStatus, setPetPointsStatus] = useState(false);
    const [contieneAgenda, setContieneAgenda] = useState(false);
    const [showLocalidadesModal, setShowLocalidadesModal] = useState(false);
    const [agendaPopUp, setAgendaPopUp] = useState(false);

    const [changeNumber, setChangeNumber] = useState(0)
    const [soles, setSoles] = useState(0)

    const inputTag = useRef(null)
    const inputSku = useRef(null)
    const inputName = useRef(null)
    const inputDesc = useRef(null)
    const inputWord = useRef(null)
    const inputPeso = useRef(null)
    const inputPrice = useRef(null)
    const inputCantidad = useRef(null)
    const inputMinima = useRef(null)
    const hiddenFileInput = useRef(null);
    
    let errorInputMsg = "Campo requerido"
    
    const [servInfo, setServInfo] = useState({
        activo: true,
        titulo: "",
        categoria: "",
        condiciones: "",
        descripcion: "",
        precio: 0,
        palabrasClave: [],
        urlImagen: "",
        localidadId: "",
        unidad: "",
    })

    const [file, setFile] = useState(null);
    const [url, setURL] = useState("");
    const [src, setImg] = useState('');

    const handleClick = event => {
        hiddenFileInput.current.click();
    };

    async function handleChange(e) {
        var file = e.target.files[0]
        Compress.imageFileResizer(
          file,
          600,
          300,
          "JPEG",
          10,
          0,
          (uri) => {
            setFile(uri)
            console.log(uri)
          },
          "file",
          600,
          300
        )
        setImg(URL.createObjectURL(file))
        setListErrors(listErrors.filter( prev => prev !== "img" ))
    }

    const handleKeyPress = (event) => {
        if(event.key === 'Enter' && palabra !== ""){
            setPalabrasClave([...palabrasClave, palabra])
            inputTag.current.value = ""
        }
    }
      
    const SuccessComponent = ({msg}) => {
        return (
            <div className="success-alert">
                <span className="material-icons mr-2">done</span>
                {msg}
                <div onClick={()=>{setSuccess(false)}} className="material-icons ml-2 cursor-pointer">close</div>
            </div>
        )
    }

    const ErrorComponent = ({msg}) => {
      return (
          <div className="error-alert">
              <span className="material-icons mr-2">error</span>
              {msg}
              <div onClick={()=>{setError(false)}} className="material-icons ml-2 cursor-pointer">close</div>
          </div>
      )
    }

    const AgendaComponentPopUp = ({title, description}) => {
        return (
          <div className="cc-modal-wrapper fadeIn">
            <div className="c2-modal">
              <div className="cc-modal-header mb-2">
                  <h3 className="mb-0">{title}</h3>
              </div>
              <div className="c2-modal-body">
                <p className="mb-0">
                  {description}
                </p>
              </div>
              <div className="cc-modal-footer align-items-center justify-content-spacebetween">
                <button onClick={()=>{
                  setAgendaPopUp(false)
                }} className="btn btn-outline-secondary mx-1">
                  Realizar luego
                </button>
                <button onClick={()=>{
                  history.push({
                    pathname: '/configuration/services/agenda',
                    state: { all: false, serviceId: servInfo.servicioId, localidadId: servInfo.localidadId}
                  })
                }} className={`btn btn-primary mx-1`}>
                  Crear agenda
                </button>
              </div>
            </div>
          </div>
        )
    }

    function checkInputs(o){
        let val = 0
        let array = []
        Object.keys(o).forEach(function(key) {
            if (o[key] === '') {
                val++
                array.push(key)
            }
        });
        if(val > 0){
            setListErrors(array)
            window.scrollTo(0, 0)
        }else{
            setListErrors([])
            saveUpdatePromo()
            console.log("Todo bien")
        }
    }

    async function getServiceData(sid, lid){
        try {
            await firebase.db.collection("Localidades").doc(lid).collection("Servicios").doc(sid).onSnapshot((val)=>{
                setServInfo({
                    servicioId: sid,
                    titulo: val.data()["titulo"] ?? "",
                    categoria: val.data()["categoria"] ?? "",
                    localidadId: val.data()["localidadId"] ?? "",
                    condiciones: val.data()["condiciones"] ?? "",
                    descripcion: val.data()["descripcion"] ?? "",
                    precio: val.data()["precio"] ?? 0,
                    palabrasClave: val.data()["palabrasClave"] ?? [],
                    urlImagen: val.data()["urlImagen"] ?? "",
                    unidad: val.data()["unidad"] ?? "",
                    agendaContiene: val.data()["agendaContiene"] ?? false,
                    activo: val.data()["activo"] ?? false,
                    tipoAgenda: val.data()["tipoAgenda"] ?? "",

                })
                setAgendaPopUp(val.data()["agendaContiene"] === false ? true : false)
            })
        } catch (e) {
            console.log(e)
        }
    }

    const getServiceDays = async(sId, lId) =>{
      let tipos = [];
      await firebase.db.collection("Localidades").doc(lId)
      .collection("Servicios").doc(sId).collection("Agenda").orderBy("createdOn", "asc").get().then(val=>{
        val.docs.forEach(item=>{
          let d = moment(item.data().date.toDate())
          let today = moment()
          d.isSameOrAfter(today) && tipos.push(item.data())
        })
        setAgendaDays(tipos)
      })
    }

    const getPets = async() =>{
        let tipos = [];
        await firebase.db.collection('Especies').get().then(val => {
            val.docs.forEach(item=>{
                tipos.push(item.id)
                tipos.sort()
            })
            setSpecies(tipos)
        })
      }
    
      const getRazas = async(tipoM) =>{
        let tipos = [];
        await firebase.db.collection('Especies').doc(tipoM).collection("Razas").get().then(val => {
            val.docs.forEach(item=>{
                tipos.push(item.id)
                tipos.sort()
            })
            setRazas(tipos)
        })
      }

    useEffect(() => {
        firebase.getCurrentUser().then((val)=>{
          setUser(val)
          firebase.getCountryInfo(val.pais).then(async (val) => {
            setCountryInfo(val.data()) 
          })
        });
        getServiceData(data.state.servicioId, data.state.localidadId)
        getServiceDays(data.state.servicioId, data.state.localidadId)
    }, [])

    return (
        <div className="main-content-container container-fluid px-4">
            {error && <ErrorComponent msg={errorMsg === "" ? "Todos los campos son requeridos" : errorMsg}/>}
            {success && <SuccessComponent msg={successMsg === "" ? "Servicio actualizado exitosamente" : successMsg}/>}
            {agendaPopUp && <AgendaComponentPopUp title={agendaPopupTitle} description={agendaPopupDescription} />}

            <div className="page-header align-items-center justify-content-spacebetween row no-gutters px-4 my-4">
                <div className="col-12 col-sm-5 text-center text-sm-left mb-0">
                    <div className="row align-items-center">
                        <div className="col">
                            <p className="page-title bold"><Link className="color-white mr-3 light" to="/configuration">Configuración</Link> <Link className="color-white light" to="/configuration/services">Servicios</Link> <span>Nuevo</span> </p>
                        </div>
                    </div>
                </div>
                <div className="col-12 col-sm-1 mb-0 level-1">
                    <div className="row align-items-center justify-content-space-around level-2">
                        <i onClick={()=>{}} className="material-icons color-white display-5 cursor-pointer">help_outline</i>
                    </div>
                </div>
            </div>

            <div className="row no-gutters">
                <div className="col-lg-8">
                    
                    <div className="row no-gutters align-items-center justify-content-spacebetween mb-4">
                        <h4 className="color-primary bold mb-0">Editar</h4>
                        <div className="row no-gutters">
                            <div onClick={()=>{ checkInputs(servInfo) }}  className="btn btn-success mr-3">Actualizar servicio</div>
                            <div onClick={()=>{ }}  className="btn btn-danger mr-3">Eliminar servicio</div>
                            <div onClick={()=>{updateActive()}} className={`btn ${servInfo.activo ? "btn-outline-danger" : "btn-outline-success"}`}>{servInfo.activo ? "Desactivar" : "Activar"} <span className="d-none">{changeNumber}</span> </div>
                        </div>
                    </div>

                    <div className="creation-card mb-3">
                        <div className="creation-card-title">Detalles adicionales</div>
                        <div className="creation-card-content">

                            <div className={`creation-input-group no-gutters mr-4 ${ palabrasClave.length > 3 && "mb-4" }`}>
                                <div className="col-lg-auto mr-2">
                                    <p className="creation-input-label">Etiquetas</p>
                                </div>
                                <div className="col-lg-auto">
                                    <input ref={inputTag} type="text" onKeyPress={handleKeyPress} onChange={e=>{setPalabra(e.target.value)}}  placeholder="Mastografía" className="form-control"/>
                                </div>
                            </div> 

                            <div className="creation-input-group-words">
                                {servInfo.palabrasClave.map(p => (
                                    <p className="pill mb-0" key={p}>{p} <span className="cursor-pointer btn-delete" onClick={()=>{ setPalabrasClave(palabrasClave.filter((p1) => p1 !== p)); }} >X</span></p>
                                ))}
                            </div>



                        </div>
                    </div>
                    
                    <div className="creation-card mb-3">
                        <div className="creation-card-title">Precio</div>
                        <div className="creation-card-content">

                            <div className="mr-4 creation-input-group no-gutters mb-4">
                                <div className="col-lg-auto mr-2">
                                    <p className="creation-input-label">Precio</p>
                                </div>
                                <div className="col-lg-auto">
                                    <input type="number" min="0" value={servInfo.precio} onChange={(e)=>{setServInfo({...servInfo, precio: e.target.value}); setListErrors(listErrors.filter( prev => prev !== "precio" ) )  }} placeholder="0" className={`form-control col-lg-12 ${ listErrors.includes("precio") && "border-danger" } `}/>
                                </div>
                                <div className="creation-errors-container">
                                    {(listErrors.includes("precio") && finalClientStatus) && <p className="creation-errors-span"><i className="material-icons">highlight_off</i> { errorInputMsg } </p>}
                                </div>
                            </div>
                        
                            <div className="mr-4 creation-input-group mb-3 no-gutters">
                                <div className="col-lg-auto mr-2">
                                    <p className="creation-input-label">El servicio se cobra por</p>
                                </div>
                                <div className="col-lg-auto">
                                    <select value={servInfo.unidad} onChange={(e)=>{setServInfo({...servInfo, unidad: e.target.value}); setListErrors(listErrors.filter( prev => prev !== "unidad" ) )  }} 
                                    className={`form-control col-lg-12 ${ listErrors.includes("unidad") && "border-danger" } `}>
                                        <option value="">Selección</option>
                                        <option value="Monto del servicio">Monto del servicio</option>
                                        <option value="Hora">Hora</option>
                                        <option value="Noche">Noche</option>
                                        <option value="Día">Día</option>
                                    </select>
                                </div>
                                <div className="creation-errors-container">
                                    {listErrors.includes("unidad") && <p className="creation-errors-span"><i className="material-icons">highlight_off</i> { errorInputMsg } </p>}
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    { servInfo.agendaContiene && <div className="creation-card mb-3">
                        <div className="creation-card-title">Agenda</div>
                        <div className="creation-card-content">
                        <div className="agenda-days-slider">
                            {agendaDays.map((d, i)=>{
                                return (
                                  <p className={`${day === d && "day-active"} mb-0`} onClick={()=>{ setDay(d) }} key={i}>
                                    {d.bloqueado && <> <i className="material-icons">lock</i> <br/> </>}
                                    {d.fecha}
                                  </p>
                                )
                              })}
                            </div>
                        </div>
                    </div> }

                    { (servInfo.tipoAgenda === "Slots" && day.horasDia !== undefined  ) && 
                        <div className="mt-3 slots-day"> { day.horasDia.map((h, i)=> <div className="pill" key={i}>{h}</div>) } </div> 
                    }

                </div>
                <div className="col-lg-4 pl-4">
                    
                    <div className="creation-card mb-5 p-3">
                        <div className="creation-card-content">
                            <div className="position-relative"  style={{width: "100%"}}>
                                <input type="file" ref={hiddenFileInput} onChange={handleChange}  style={{display: 'none'}} />
                                <div onClick={handleClick} className={`creation-input-photo ${ listErrors.includes("img") && "border-danger" }`}>
                                    {src !== "" ? <img src={src} alt="" /> : <img src={servInfo.urlImagen} alt="" />}
                                </div>
                                <div style={{textAlign: "center", width: "100%"}}>
                                    <p style={{fontSize: "13px", color: "#a3a6af"}} className="my-3">Dimensiones recomendadas (200px x 300px)</p>
                                </div>
                            </div>
                            
                            <div className="creation-input-group-grid no-gutters mb-3">
                                <div className="col-lg-12">
                                    <p className="creation-input-title mb-2">Categoría</p>
                                </div>
                                <p className="creation-input-label mb-2">{servInfo.categoria}</p>
                            </div>

                            <div className="creation-input-group-grid no-gutters mb-3">
                                <div className="col-lg-12">
                                    <p className="creation-input-title mb-2">Servicio</p>
                                </div>
                                <p className="creation-input-label mb-2">{servInfo.titulo}</p>
                            </div>

                            <div className="creation-input-group-grid no-gutters mb-3">
                                <div className="col-lg-12">
                                    <p className="creation-input-label mb-2">Descripción</p>
                                </div>
                                <div className="col-lg-12">
                                    <textarea value={servInfo.descripcion} onChange={(e)=>{setServInfo({...servInfo, descripcion: e.target.value}); setListErrors(listErrors.filter( prev => prev !== "descripcion" ) )  }} placeholder="Descripción del servicio" className={`form-control col-lg-12 ${ listErrors.includes("descripcion") && "border-danger" } `}/>
                                </div>
                                 <div className="creation-errors-container">
                                    {listErrors.includes("descripcion") && <p className="creation-errors-span"><i className="material-icons">highlight_off</i> { errorInputMsg } </p>}
                                </div>
                            </div>
                            
                            <div className="creation-input-group-grid no-gutters">
                                <div className="col-lg-12">
                                    <p className="creation-input-label mb-2">Condiciones del servicio</p>
                                </div>
                                <div className="col-lg-12">
                                    <textarea value={servInfo.condiciones} onChange={(e)=>{setServInfo({...servInfo, condiciones: e.target.value}); setListErrors(listErrors.filter( prev => prev !== "condiciones" ) )  }} placeholder="Condiciones del servicio" className={`form-control col-lg-12 ${ listErrors.includes("condiciones") && "border-danger" } `}/>
                                </div>
                                 <div className="creation-errors-container">
                                    {listErrors.includes("condiciones") && <p className="creation-errors-span"><i className="material-icons">highlight_off</i> { errorInputMsg } </p>}
                                </div>
                            </div>
                            
                        </div>
                    </div>

                </div>
            </div>

        </div>
    )   
    
    async function deleteService(){
        try{

            await firebase.db.collection('Localidades').doc(servInfo.localidadId).collection("Servicios").doc(servInfo.servicioId).collection("Agenda").get().then((value)=>{
                value.docs.forEach(async(doc)=>{
                    let id = doc.id
                    await firebase.db.collection('Localidades').doc(servInfo.localidadId).collection("Servicios").doc(servInfo.servicioId).collection("Agenda").doc(id).delete()
                })
            })
            await firebase.db.collection('Localidades').doc(servInfo.localidadId).collection("Servicios").doc(servInfo.servicioId).delete()
            
        } catch (e) {
            alert(e.message)
        }
    }

    async function updateActive(){
        try{
          await firebase.db.collection("Localidades").doc(servInfo.localidadId).collection("Servicios").doc(servInfo.servicioId).update({
            activo: servInfo.activo ? false : true
          })
          servInfo.activo = servInfo.activo ? false : true
          setTimeout(() => {
            setChangeNumber( changeNumber + 1 )
          }, 100);
        }catch(e){
          console.log(`Error: ${e}`)
        }
    }
    
    async function saveUpdatePromo(){
      if(file){
        try {
          await firebase.storage.ref(`/Servicios imagenes/${file.name}`).put(file)
          firebase.storage.ref("Servicios imagenes").child(file.name).getDownloadURL().then((urlI) => {
            firebase.db.collection('Localidades').doc(servInfo.localidadId).collection("Servicios").doc(servInfo.servicioId).update({
                urlImagen: urlI,
                condiciones: servInfo.condiciones,
                descripcion: servInfo.descripcion,
                precio: parseFloat(servInfo.precio),
                unidad: servInfo.unidad,
            })
          })
        } catch (e) {
          alert(e.message)
        }
      }else{
        await firebase.db.collection('Localidades').doc(servInfo.localidadId).collection("Servicios").doc(servInfo.servicioId).update({
            condiciones: servInfo.condiciones,
            descripcion: servInfo.descripcion,
            precio: parseFloat(servInfo.precio),
            unidad: servInfo.unidad,
        })
      }
      setSuccessMsg("Servicio actualizado exitosamente")
      setSuccess(true)
      setTimeout(() => {
        setSuccess(false)
      }, 4000);
    }

}

export default DetailService