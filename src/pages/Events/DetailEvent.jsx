import React, {useEffect, useState, useRef} from 'react'
import firebase from '../../firebase/config'
import {Link, Redirect, useHistory, useLocation} from 'react-router-dom';
import moment from 'moment';
import utils from '../../firebase/utils';
import Compress from "react-image-file-resizer";
import { debounce } from '../../utils/debounce';

function DetailEvent() {
    
    const data = useLocation()
    let updateEventState = data.state["update"]

    const history = useHistory()  
    const [palabrasClave, setPalabrasClave] = useState([])
    const [listErrors, setListErrors] = useState([])
    const [petSpecies, setPetSpecies] = useState([])
    const [petBreed, setPetBreed] = useState([])
    const [listOfGroups, setListOfGroups] = useState([])

    const [successMsg, setSuccessMsg] = useState("");
    const [errorMsg, setErrorMsg] = useState("");
    const [palabra, setPalabra] = useState("")
    const [btnMessage, setBtnMessage] = useState("Subir evento");

    const [countryInfo, setCountryInfo] = useState({})
    const [user, setUser] = useState({})
    const [day, setDay] = useState({})

    const [chargedEventFromState, setChargedEventFromState] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(false);
    const[sidebarStatus, setSidebarStatus] = useState(false)

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

    let listCategories = [
        "Mastografía",
        "Salud",
        "Cuidados",
        "Consejos",
    ]

    const [event, setEvent] = useState({
        subjectId: "",
        title: "",
        categorie: "",
        description: "",
        urlImage: "",
        paymentNeeded: false,
        price: 0,
        date: "",
        publicationHour: "",
        hour: "",
        from: "",
        to: "",
        registeredSubjects: [],
        media: [
            {
                url: "",
                type: "photo",
                index: 0
            }
        ],
        where: "",
        conditions: "",
        registerNeeded: false,
        presential: false,
        virtual: false,
        tags: palabrasClave,
        status: "approved",
        code: "",
        features: {
            breed: "",
            species: "",
        },
        givesGamificationPoints: false,
        gamificationPoints: 0,
    })

    const [selectedListOfGroups, setSelectedListOfGroups] = useState([])

    const [file, setFile] = useState(null);
    const [url, setURL] = useState("");
    const [src, setImg] = useState('');

    const [changeNumber, setChangeNumber] = useState(0);
    
    const [prevScrollPos, setPrevScrollPos] = useState(0);
    const [visible, setVisible] = useState(true);
  
    const handleScroll = debounce(() => {
      const currentScrollPos = window.pageYOffset;
  
      setVisible((prevScrollPos > currentScrollPos && prevScrollPos - currentScrollPos > 70) || currentScrollPos < 10);
  
      setPrevScrollPos(currentScrollPos);
    }, 100);
  
    useEffect(() => {
      window.addEventListener('scroll', handleScroll);
  
      return () => window.removeEventListener('scroll', handleScroll);
  
    }, [prevScrollPos, visible, handleScroll]);
  
    const navbarStyles = {
      position: 'fixed',
      height: '65px',
      width: '83.3%',
      backgroundColor: 'white',
      zIndex: "11",
      textAlign: 'center',
      transition: 'top 0.6s',
      padding: "1% 2%",
      right: "0px",
      boxShadow: "0 0.125rem 0.625rem rgb(90 97 105 / 12%)"
    }

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

    async function manageTypePetSpecie(type){
        let list = []
        setEvent({...event, features: {...event["features"], species: type}})
        await firebase.db.collection("Especies").doc(type).collection("Razas").get().then((v)=>{
          v.docs.forEach(doc=>{
            list.push(doc.id)
            list.sort()
          })
          setPetBreed(list)
        })
    }

    function checkInputs(){
        let val = 0
        let array = []

        let o = {
            img: data.state["update"] ? event.media[0]["url"] : src,
            title: event["title"],
            categorie: event["categorie"],
            description: event["description"],
            status: event["status"],
            date: event["date"],
            publicationHour: event["publicationHour"],
            hour: event["hour"],
            from: event["from"],
            to: event["to"],
            where: event["where"],
            conditions: event["conditions"],
        }

        Object.keys(o).forEach(function(key) {
            if (o[key] === '' || o[key] === undefined) {
                val++
                array.push(key)
            }
        });
        if(val > 0){
            setListErrors(array)
            setError(true)
            setSuccess(false)
            window.scrollTo(0, 0)
        }else{
            setError(false)
            setSuccess(true)
            setListErrors([])
            if(data.state["update"]){
                setSuccessMsg("Evento editado exitosamente")
                updateEvent()
            }else{
                setSuccessMsg("Evento creado exitosamente")
                createEvent()
            }
            console.log("Todo bien")
        }
    }

    const getPetsSpecies = async() =>{
        let tipos = [];
        await firebase.db.collection('Especies')
        .get().then(val => {
          val.docs.forEach(item=>{
            tipos.push(item.id)
            tipos.sort()
          })
          setPetSpecies(tipos)
        })
    }

    async function getUserCommunities(id){
        await firebase.db.collection("CommunityGroups").where("creatorId", "==", "A" + id).get().then((v)=>{
          setListOfGroups(v.docs.map((doc) => doc.data() ))
        })
    }
    
    function manageAddedGroup(g){
        let list = [...selectedListOfGroups]

        if(selectedListOfGroups.includes(g)){
            list = list.filter((prv)=> prv !== g ) 
        }else{
            list.push(g)
        }

        setSelectedListOfGroups(list)
    }

    const CommunitiesGroupCard = ({g}) => {
        return (
            <div style={{cursor: "pointer"}} onClick={()=>{ manageAddedGroup(g) }} className={`communities-recomended-group-card ${selectedListOfGroups.includes(g) && "active"} `}>
            <img src={g["urlImage"]} />
  
            <div className="communities-recomended-group-overlay-container">
              <p className="communities-recomended-group-card-title mb-2">{g["title"]}</p>
              <p style={{color: "white"}} className="communities-recomended-group-card-cat">{"Miembros: " + g["members"].length}</p>
            </div>
  
          </div>
        )
    }

    async function getCommunitiesFromEvent(){
        let list = []
        data.state["event"]["communities"].forEach((gId)=>{
            let object = listOfGroups.find((prv)=> prv["communityId"] === gId )
            list.push(object)
        })
        setSelectedListOfGroups(list)
    }

    useEffect(() => {
        firebase.getCurrentUser().then((val)=>{
          setUser(val)
          getUserCommunities(val.aliadoId)
          getPetsSpecies()
        });
    }, [])
  
    useEffect(() => {
        if(data.state["update"]){
            setEvent({
                ...data.state["event"]
            })
            getCommunitiesFromEvent()
        }
        console.log(selectedListOfGroups)
        setChargedEventFromState(true)
    }, [chargedEventFromState])

    return (
        <div className="main-content-container container-fluid px-4">
            <div className={`sidebar-activation ${sidebarStatus && "active"}`}>
                <div className="sidebar-activation-wrapper">
                    <div className="sidebar-activation-header">
                        <div onClick={() => { setSidebarStatus(false) }} className="sidebar-activation-header-btn cursor-pointer">
                            <i className="material-icons">close</i>
                        </div>
                        <div className="right-side-info-title">
                            Grupos
                        </div>
                    </div>

                    <div className="sidebar-exchange-body fadeIn">
                        <div className="sidebar-exchange-body-grid">

                            <div className="sidebar-exchange-body-start" style={{width: "100%"}}>
                                {listOfGroups.length > 0 ? listOfGroups.map(g => <CommunitiesGroupCard g={g}/>) : <p>No hay grupos todavía</p> }
                            </div>

                        </div>
                    </div>

                    <div className="sidebar-activation-footer">
                        {/* <div className="btn btn-block btn-dark" onClick={()=>{ checkInputs(tourInfo) }}>{btnMessage}</div> */}
                    </div>
                </div>
            </div>
            {error && <ErrorComponent msg={errorMsg === "" ? "Todos los campos son requeridos" : errorMsg}/>}
            {success && <SuccessComponent msg={successMsg === "" ? "Evento editado exitosamente" : successMsg}/>}

            <div style={{ ...navbarStyles, top: visible ? '-60px' : '60px' }}>
                <div className="row no-gutters align-items-center justify-content-spacebetween mb-4">
                    <h4 className="color-primary bold mb-0">{updateEventState ? "Editar" : "Nuevo"}</h4>
                    {
                        updateEventState ?
                            <div className="row no-gutters">
                                <div onClick={()=>{ checkInputs() }}  className="btn btn-success mr-3">Actualizar evento</div>
                                <div onClick={()=>{ deleteEvent() }} className="btn btn-danger mr-3">Eliminar evento</div>
                                <div onClick={()=>{updateActive()}} className={`btn ${event.status === "Activo" ? "btn-outline-danger" : "btn-outline-success"}`}>{event.status === "Activo" ? "Desactivar" : "Activar"} <span className="d-none">{changeNumber}</span> </div>
                            </div> 
                        : 
                            <div className="row no-gutters">
                                <div onClick={()=>{ checkInputs() }}  className="btn btn-success mr-3">Crear evento</div>
                            </div> 
                    }
                </div>
            </div>

            <div className="page-header align-items-center justify-content-spacebetween row no-gutters px-4 my-4">
                <div className="col-12 col-sm-5 text-center text-sm-left mb-0">
                    <div className="row align-items-center">
                        <div className="col">
                            <p className="page-title bold"><Link className="color-white light" to="/events">Eventos</Link> <span>Evento</span> </p>
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
                        <h4 className="color-primary bold mb-0">{updateEventState ? "Editar" : "Nuevo"}</h4>
                        {
                            updateEventState ?
                                <div className="row no-gutters">
                                    <div onClick={()=>{ checkInputs() }}  className="btn btn-success mr-3">Actualizar evento</div>
                                    <div onClick={()=>{ deleteEvent() }} className="btn btn-danger mr-3">Eliminar evento</div>
                                    <div onClick={()=>{updateActive()}} className={`btn ${event.status === "approved" ? "btn-outline-danger" : "btn-outline-success"}`}>{event.status === "approved" ? "Desactivar" : "Activar"} <span className="d-none">{changeNumber}</span> </div>
                                </div> 
                            : 
                                <div className="row no-gutters">
                                    <div onClick={()=>{ checkInputs() }}  className="btn btn-success mr-3">Crear evento</div>
                                </div> 
                        }
                    </div>

                    <div className="creation-card mb-3">
                        <div className="creation-card-title">Detalles adicionales</div>
                        <div className="creation-card-content">
                            
                            {!updateEventState && <div className="creation-input-group mr-4 no-gutters">
                                <div className="col-lg-auto mr-2">
                                    <p className="creation-input-label">Estado del evento</p>
                                </div>
                                <div className="col-lg-auto">
                                    <select value={event.status} onChange={(e)=>{setEvent({...event, status: e.target.value}); setListErrors(listErrors.filter( prev => prev !== "status" ) )  }} 
                                    className={`form-control col-lg-12 ${ listErrors.includes("status") && "border-danger" } `}>
                                        <option value="">Selección</option>
                                        <option value="active">Activo</option>
                                        <option value="draft">Borrador</option>
                                    </select>
                                </div>
                                <div className="creation-errors-container">
                                    {listErrors.includes("status") && <p className="creation-errors-span"><i className="material-icons">highlight_off</i> { errorInputMsg } </p>}
                                </div>
                            </div>}

                            <div className={`creation-input-group no-gutters mr-2 ${ palabrasClave.length > 3 && "mb-4" }`}>
                                <div className="col-lg-auto mr-2">
                                    <p className="creation-input-label">Etiquetas</p>
                                </div>
                                <div className="col-lg-auto">
                                    <input ref={inputTag} type="text" onKeyPress={handleKeyPress} onChange={e=>{setPalabra(e.target.value)}}  placeholder="Ayuda" className="form-control"/>
                                </div>
                            </div> 

                            <div className="creation-input-group-words">
                                {palabrasClave.map(p => (
                                    <p className="pill mb-0" key={p}>{p} <span className="cursor-pointer btn-delete" onClick={()=>{ setPalabrasClave(palabrasClave.filter((p1) => p1 !== p)); }} >X</span></p>
                                ))}
                            </div>

                            <div className={`creation-input-group no-gutters mr-4`} >
                                <div className="col-lg-auto mr-2">
                                    <input type="checkbox" checked={event.registerNeeded} onClick={()=>{setEvent({...event, registerNeeded: !event.registerNeeded});}} className="form-control"/>
                                </div>
                                <div className="col-lg-auto">
                                    <p className="creation-input-label">Quieres incluir registro ?</p>
                                </div>
                            </div> 
                            
                            {/* <div className={`creation-input-group no-gutters mr-4`} >
                                <div className="col-lg-auto mr-2">
                                    <input type="checkbox" checked={event.givesGamificationPoints} onClick={()=>{setEvent({...event, givesGamificationPoints: !event.givesGamificationPoints});}} className="form-control"/>
                                </div>
                                <div className="col-lg-auto mr-2">
                                    <p className="creation-input-label">Otorga puntos gamificación</p>
                                </div>
                                <div className="col-lg-auto">
                                    <input type="number" disabled={!event.givesGamificationPoints} value={event.gamificationPoints} onChange={(e)=>{setEvent({...event, gamificationPoints: parseInt(e.target.value)});}} className="form-control"/>
                                </div>
                            </div> */}



                        </div>
                    </div>
                    
                    <div className="creation-card mb-3">
                        <div className="creation-card-title">Precio</div>
                        <div className="creation-card-content">

                            <div className="creation-input-group no-gutters mb-4">
                                <div className="col-lg-auto mr-2">
                                    <input type="checkbox" checked={event.paymentNeeded} onClick={()=>{setEvent({...event, paymentNeeded: !event.paymentNeeded}); }} className={`form-control col-lg-12 `}/>
                                </div>
                                <div className="col-lg-auto mr-2">
                                    <p className="creation-input-label">Es pago</p>
                                </div>
                                <div className="col-lg-auto">
                                    <input disabled={!event.paymentNeeded} type="number" min="0" value={event.price} onChange={(e)=>{setEvent({...event, price: parseFloat(e.target.value)});  }} placeholder="Precio" className={`form-control col-lg-12`}/>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div className="creation-card mb-3">
                        <div className="creation-card-title">Modalidad</div>
                        <div className="creation-card-content">

                            <div className="creation-input-group no-gutters mb-4 mr-5">
                                <div className="col-lg-auto mr-2">
                                    <input type="checkbox" checked={event.presential} onClick={()=>{setEvent({...event, presential: !event.presential}); }} className={`form-control col-lg-12 `}/>
                                </div>
                                <div className="col-lg-auto">
                                    <p className="creation-input-label">Presencial</p>
                                </div>
                            </div>
                            <div className="creation-input-group no-gutters mb-4">
                                <div className="col-lg-auto mr-2">
                                    <input type="checkbox" checked={event.virtual} onClick={()=>{setEvent({...event, virtual: !event.virtual}); }} className={`form-control col-lg-12 `}/>
                                </div>
                                <div className="col-lg-auto">
                                    <p className="creation-input-label">Virtual</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div className="creation-card mb-3">
                        <div className="creation-card-title">Fechas</div>
                        <div className="creation-card-content">

                            <div className="creation-input-group no-gutters mb-4 mr-4" >
                                <div className="col-lg-auto mr-2">
                                    <p className="creation-input-label">Desde</p>
                                </div>
                                <div className="col-lg-auto">
                                    <input type="date" value={event.from} onChange={(e)=>{setEvent({...event, from: e.target.value}); }} className={`form-control col-lg-12 `}/>
                                </div>
                            </div>
                            <div className="creation-input-group no-gutters mb-4 mr-4">
                                <div className="col-lg-auto mr-2">
                                    <p className="creation-input-label">Hasta</p>
                                </div>
                                <div className="col-lg-auto">
                                    <input type="date" value={event.to} onChange={(e)=>{setEvent({...event, to: e.target.value}); }} className={`form-control col-lg-12 `}/>
                                </div>
                            </div>
                            <div className="creation-input-group no-gutters mb-4">
                                <div className="col-lg-auto mr-2">
                                    <p className="creation-input-label">Hora</p>
                                </div>
                                <div className="col-lg-auto">
                                    <input type="time" value={event.hour} onChange={(e)=>{setEvent({...event, hour: e.target.value}); }} className={`form-control col-lg-12 `}/>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div className="creation-card mb-3">
                        <div className="creation-card-title">Mercado</div>
                        <div className="creation-card-content">
                            <div className="mb-2 creation-input-group no-gutters">
                                <div className="col-lg-auto mr-2">
                                    <p className="creation-input-label">Grupos</p>
                                </div>
                                <div className="col-lg-auto mr-2">
                                    <div onClick={()=>{ setSidebarStatus(true) }} className="btn btn-primary">Seleccionar</div>
                                </div>
                                <div className="col-lg-auto">
                                    <p className="creation-input-label">Grupos seleccionados: {selectedListOfGroups.length}</p>
                                </div>
                            </div>


                        </div>
                    </div>
                    
                </div>
                <div className="col-lg-4 pl-4">
                    
                    <div className="creation-card mb-5 p-3">
                        <div className="creation-card-content">
                            <div className="position-relative"  style={{width: "100%"}}>
                                <input type="file" ref={hiddenFileInput} onChange={handleChange}  style={{display: 'none'}} />
                                <div onClick={handleClick} className={`creation-input-photo ${ listErrors.includes("img") && "border-danger" }`}>
                                    {src !== "" ? <img src={src} alt="" /> : (
                                        data.state["update"] ? 
                                            <img src={event.media[0]["url"]} alt="" /> 
                                        :  <div className="card-header-img-upload"><p className="material-icons icon">add</p><p className="mb-0">Cargar imagen</p></div>
                                    )}
                                </div>
                                <div style={{textAlign: "center", width: "100%"}}>
                                    <p style={{fontSize: "13px", color: "#a3a6af"}} className="my-3">Dimensiones recomendadas (200px x 300px)</p>
                                </div>
                            </div>
                            
                            <div className="creation-input-group-grid no-gutters mb-3">
                                <div className="col-lg-12">
                                    <p className="creation-input-label mb-2">Categoría</p>
                                </div>
                                <select onChange={(e)=>{setEvent({...event, categorie: e.target.value}); setListErrors(listErrors.filter( prev => prev !== "categorie" ) )  }}
                                value={event.categorie} type="text" className={`form-control col-lg-12 ${ listErrors.includes("categorie") && "border-danger" } `}>
                                    <option value="">Seleccionar</option>
                                    {listCategories.map((cat)=> <option value={cat}>{cat}</option> )}
                                </select>
                            </div>

                            <div className="creation-input-group-grid no-gutters mb-3">
                                <div className="col-lg-12">
                                    <p className="creation-input-label mb-2">Titulo</p>
                                </div>
                                <input onChange={(e)=>{setEvent({...event, title: e.target.value}); setListErrors(listErrors.filter( prev => prev !== "title" ) )  }} 
                                value={event.title} ype="text" className={`form-control col-lg-12 ${ listErrors.includes("title") && "border-danger" } `} />
                            </div>
                            

                            <div className="creation-input-group-grid no-gutters mb-3">
                                <div className="col-lg-12">
                                    <p className="creation-input-label mb-2">Descripción</p>
                                </div>
                                <div className="col-lg-12">
                                    <textarea value={event.description} onChange={(e)=>{setEvent({...event, description: e.target.value}); setListErrors(listErrors.filter( prev => prev !== "description" ) )  }} 
                                    placeholder="Descripción del evento" className={`form-control col-lg-12 ${ listErrors.includes("description") && "border-danger" } `}/>
                                </div>
                                <div className="creation-errors-container">
                                    {listErrors.includes("descripcion") && <p className="creation-errors-span"><i className="material-icons">highlight_off</i> { errorInputMsg } </p>}
                                </div>
                            </div>
                            
                            <div className="creation-input-group-grid no-gutters mb-3">
                                <div className="col-lg-12">
                                    <p className="creation-input-label mb-2">Lugar o enlace</p>
                                </div>
                                <input onChange={(e)=>{setEvent({...event, where: e.target.value}); setListErrors(listErrors.filter( prev => prev !== "where" ) )  }} 
                                value={event.where} ype="text" className={`form-control col-lg-12 ${ listErrors.includes("where") && "border-danger" } `} />
                            </div>
                           
                            <div className="creation-input-group-grid no-gutters mb-3">
                                <div className="col-lg-12">
                                    <p className="creation-input-label mb-2">Fecha publicación</p>
                                </div>
                                <div className="row no-gutters">
                                    <div className="col-lg-auto mr-4">
                                        <input type="date" value={event.date} onChange={(e)=>{setEvent({...event, date: e.target.value}); }} className={`form-control col-lg-12 `}/>
                                    </div>
                                    <div className="col-lg-auto">
                                        <input type="time" value={event.publicationHour} onChange={(e)=>{setEvent({...event, publicationHour: e.target.value}); }} className={`form-control col-lg-12 `}/>
                                    </div>
                                </div>
                            </div>

                            <div className="creation-input-group-grid no-gutters">
                                <div className="col-lg-12">
                                    <p className="creation-input-label mb-2">Condiciones del evento</p>
                                </div>
                                <div className="col-lg-12">
                                    <textarea value={event.conditions} onChange={(e)=>{setEvent({...event, conditions: e.target.value}); setListErrors(listErrors.filter( prev => prev !== "conditions" ) )  }} placeholder="Condiciones del evento" className={`form-control col-lg-12 ${ listErrors.includes("conditions") && "border-danger" } `}/>
                                </div>
                                 <div className="creation-errors-container">
                                    {listErrors.includes("conditions") && <p className="creation-errors-span"><i className="material-icons">highlight_off</i> { errorInputMsg } </p>}
                                </div>
                            </div>
                            
                        </div>
                    </div>

                </div>
            </div>

        </div>
    )

    async function updateActive(){
        try{
          await firebase.db.collection("Events").doc(event.eventId).update({
            status: event.status === "approved" ? "Borrador" : "approved"
          })
          event.status = event.status === "approved" ? "Borrador" : "approved"
          setTimeout(() => {
            setChangeNumber( changeNumber + 1 )
          }, 100);
        }catch(e){
          console.log(`Error: ${e}`)
        }
    }

    async function deleteEvent(){

        if(event["communities"].length > 0){
            await firebase.db.collectionGroup("CommunityEvents").where("eventId", "==", event.eventId).get().then(async(docs)=>{
                docs.docs.forEach(async(doc)=>{
                    await firebase.db.collection("CommunityEvents").doc(event.eventId).delete()
                })
            })
        }else{
            await firebase.db.collection("Events").doc(event.eventId).delete()
        }

        window.location.href = "/events"
    }
    
    async function updateEvent(){

        if(file){
            await firebase.storage.ref(`/Events imagenes/${file.name}`).put(file)
            await firebase.storage.ref("Events imagenes").child(file.name).getDownloadURL().then(async (url)=>{
                
                event["media"][0]["url"] = url
    
                if(event["communities"].length > 0){
                    await firebase.db.collectionGroup("CommunityEvents").where("eventId", "==", event.eventId).get().then(async(val)=>{
                        val.docs.forEach(async(snashot)=>{
                            await snashot.ref.update(event)
                        })
                    })
                    await firebase.db.collection("Events").doc(event.eventId).update(event)
        
                }else{
                    await firebase.db.collection("Events").doc(event.eventId).update(event)
                }
    
            })
        }else{
            if(event["communities"].length > 0){
                await firebase.db.collectionGroup("CommunityEvents").where("eventId", "==", event.eventId).get().then(async(val)=>{
                    val.docs.forEach(async(snashot)=>{
                        await snashot.ref.update(event)
                    })
                })
            }else{
                await firebase.db.collection("Events").doc(event.eventId).update(event)
            }
            
        }

        window.location.href = "/events"
    }
    
    async function createEvent(){
        let id = firebase.db.collection("Events").doc().id
        event["subjectId"] = "A" + user.aliadoId
        
        await firebase.storage.ref(`/Events imagenes/${file.name}`).put(file)
        await firebase.storage.ref("Events imagenes").child(file.name).getDownloadURL().then(async (url)=>{
            
            event["media"][0]["url"] = url

            if(selectedListOfGroups.length > 0){
                await firebase.db.collection("Events").doc(id).set({
                    ...event,
                    eventId: id,
                    communities: selectedListOfGroups.map( c  => c["communityId"]),
                })
                selectedListOfGroups.forEach(async (g)=>{
                    await firebase.db.collection("CommunityGroups").doc(g["communityId"]).collection("CommunityEvents").doc(id).set({
                        ...event,
                        eventId: id,
                    })
                })
            }else{
                await firebase.db.collection("Events").doc(id).set({
                    ...event,
                    eventId: id,
                    communities: [],
                })
            }

        })

        window.location.href = "/events"
    }

}

export default DetailEvent