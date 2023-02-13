import React, {useState, useEffect} from 'react'
import firebase from '../../firebase/config'
import {Link} from 'react-router-dom';
import moment from 'moment';
import axios from 'axios';

function CreateClient() {

    const [btnMessage, setBtnMessage] = useState("Crear paciente");
    const [user, setUser] = useState({})
    
    const [error, setError] = useState(false)
    const [sp, setShowPassword] = useState(false)
    const [emessage, setEmessage] = useState("")
    const hiddenFileInput = React.useRef(null);
    
    const [services, setServices] = useState([])
    const [service, setService] = useState({})

    const [file, setFile] = useState(null);
    const [url, setURL] = useState("");
    const [src, setImg] = useState('');
    
    const [userRegisterStatus, setUserRegisterStatus] = useState(true)
    const [petRegisterStatus, setPetRegisterStatus] = useState(false)
    const [successStatus, setSuccessStatus] = useState(false)
    const [serviceRegisterStatus, setServiceRegisterStatus] = useState(false)
    const [dayRegisterStatus, setDayRegisterStatus] = useState(false)
    const [successOrderStatus, setSuccessOrderStatus] = useState(false)

    const [daySelected, setDaySelected] = useState({})
    const [role, setRole] = useState({})

    const [agendaDays, setAgendaDays] = useState([])
    const [horaSelected, setHoraSelected] = useState("")

    const [passwordState, setPasswordState] = useState("")    

    const [clientInfo, setClientInfo] = useState({
        nombreUsuario: "",
        dadsLastName: "",
        momsLastName: "",
        identificacion: "",
        telefono: "",
        direccion: "",
        edad: "",
        //password: "emapass",
        password: passwordState,
        email: "",
        uid: "",
        lat: "",
        lon: "",
        codPostal: ""
    })

    const [petInfo, setPetInfo] = useState({
        mid: "",
        especie: "",
        raza: "",
        nombre: "",
    })

    const handleClick = event => {
        hiddenFileInput.current.click();
    };

    function handleChange(e) {
        setImg(URL.createObjectURL(e.target.files[0]));    
        setFile(e.target.files[0]);
    }

    const createPassword = () =>{
        var result = '';
        var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;
        for ( var i = 0; i < 9; i++ ) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        
        setPasswordState(result)
    }

    const getServices = async(id, r) =>{

        let tipos = [];
        let tipos2 = [];
        
        if(r["canViewAllCenters"] === true){
            await firebase.db.collection("Localidades").get().then(val=>{
                val.docs.forEach(item=>{
                    tipos.push(item.data())
                })
            })
        }else{
            await firebase.db.collection("Localidades").where("aliadoId", "==", id).get().then(val=>{
                val.docs.forEach(item=>{
                    tipos.push(item.data())
                })
            })
        }
        
    
        Promise.all(tipos.map(async (doc) => {
            
            firebase.db.collection("Localidades").doc(doc.localidadId).collection("Servicios").get().then(val=>{
            val.docs.forEach(item=>{
                let o1 = item.data()
                o1["nombreLocalidad"] = doc.nombreLocalidad
                o1["direccionDetallada"] = doc.direccionDetallada
                o1["estadoServicio"] !== "Borrador" && tipos2.push(o1)
            })
            })
    
        }))
    
        setTimeout(() => {
            setServices(tipos2)
        }, 500);
  
    }

    async function getDaysFromService(s){
        let tipos = [];
        
        setService(s)
  
        await firebase.db.collection("Localidades").doc(s.localidadId)
        .collection("Servicios").doc(s.servicioId).collection("Agenda").orderBy("createdOn", "asc").get().then(val=>{
          val.docs.forEach(item=>{
            let d = moment(item.data().date.toDate())
            let today = moment()
            d.isSameOrAfter(today) && tipos.push(item.data())
          })
          setAgendaDays(tipos)
        })
  
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

    useEffect(() => {
        firebase.getCurrentUser().then((val)=>{
            setUser(val)
            createPassword()
            firebase.getRoleInfo(val.role ?? "Atencion").then((r)=>{
                setRole(r)
                getServices(val.masterId, r)
            })
        })
    }, [])

    return (

        <div className="main-content-container container-fluid px-4">
            {error && <ErrorComponent msg={emessage === "" ? "Todos los campos son requeridos" : emessage}/>}

            <div className="page-header align-items-center justify-content-spacebetween row no-gutters px-4 my-4">
                <div className="col-12 col-sm-5 text-center text-sm-left mb-0">
                    <div className="row align-items-center">
                        <div className="ml-2 col row">
                          <p className="page-title bold"><Link className="page-title light" to="/clients">Pacientes</Link> <span>Crear nuevo paciente</span></p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="row">

                <div className="col-lg-6 mx-auto my-0">

                    { userRegisterStatus && <>
                        <h3 className="mb-2">Crear nuevo paciente</h3>
                        <p className="color-primary light">Crea el paciente con solo los datos basicos para guardarlo dentro de tus pacientes en la plataforma</p>
                        <div className="py-2">
                            <div className="form-group row no-gutters" style={{justifyContent: "space-between"}}>
                                <input type="text" style={{width: "31%", textTransform: "capitalize"}} className="form-control" onChange={(e) => setClientInfo({...clientInfo, nombreUsuario: e.target.value})} placeholder="Nombre" value={clientInfo.nombreUsuario} />
                                <input type="text" style={{width: "31%", textTransform: "capitalize"}} className="form-control" onChange={(e) => setClientInfo({...clientInfo, dadsLastName: e.target.value})} placeholder="Primer apellido" value={clientInfo.dadsLastName} />
                                <input type="text" style={{width: "31%", textTransform: "capitalize"}} className="form-control" onChange={(e) => setClientInfo({...clientInfo, momsLastName: e.target.value})} placeholder="Segundo apellido" value={clientInfo.momsLastName} />
                            </div>
                            <div className="form-group row no-gutters" style={{justifyContent: "space-between"}}>
                                <input type="text" style={{textTransform: "capitalize"}} className="form-control col-lg-5" onChange={(e) => setClientInfo({...clientInfo, identificacion: e.target.value})} placeholder="CURP" value={clientInfo.identificacion} />
                                <input type="text" className="form-control col-lg-5" onChange={(e) => setClientInfo({...clientInfo, codPostal: e.target.value})} placeholder="Código postal" />
                            </div>
                            <div className="form-group">
                                <input type="number" min="0" max="100" className="form-control" onChange={(e) => setClientInfo({...clientInfo, edad: e.target.value})} placeholder="Edad del paciente" value={clientInfo.edad} />
                            </div>
                            <div className="form-group">
                                <select className="form-control" onChange={(e) => setClientInfo({...clientInfo, sexo: e.target.value})} value={clientInfo.sexo}>
                                    <option value="">Sexo</option>
                                    <option value="Mujer">Mujer</option>
                                    <option value="Hombre">Hombre</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <input type="text" maxlength="10" className="form-control" onChange={(e) => setClientInfo({...clientInfo, telefono: e.target.value})} placeholder="Teléfono" value={clientInfo.telefono} />
                            </div>
                            <div className="form-group">
                                <input type="text" className="form-control" onChange={(e) => setClientInfo({...clientInfo, direccion: e.target.value})} placeholder="Dirección" value={clientInfo.direccion} />
                            </div>
                            <div className="form-group">
                                <input type="email" className="form-control" onChange={(e) => setClientInfo({...clientInfo, email: e.target.value})} placeholder="Email" value={clientInfo.email} />
                            </div>
                           <button onClick={()=>{ 
                                 (clientInfo.nombreUsuario !== "" && clientInfo.email !== "") && onRegister() 
                            }} className={`btn ${clientInfo.nombreUsuario !== "" && clientInfo.email !== ""? "btn-primary" : "btn-disabled"} btn-block`}>{btnMessage}</button>
                        </div> 
                    </>}
                    
                    {successStatus && <div className="container-creation-success">
                        <h3 className="mb-2">Paciente creado exitosamente</h3>
                        <span className="color-success material-icons">done</span>
                        <div className="row">
                            <div className="col-lg-6">
                                <Link to="/clients" className={`btn btn-outline-primary btn-block`}>Regresar a pacientes</Link>
                            </div>
                            <div className="col-lg-6">
                                <button onClick={()=>{
                                    setServiceRegisterStatus(true); setUserRegisterStatus(false); setSuccessStatus(false)
                                }} className={`btn btn-success btn-block`}>Agendar cita</button>
                            </div>
                        </div>
                    </div>}
                    
                    {successOrderStatus && <div className="container-creation-success">
                        <h3 className="mb-2">Reservación creada exitosamente</h3>
                        <span className="color-success material-icons">done</span>
                        <div className="row">
                            <div className="col-lg-12">
                                <Link to="/clients" className={`btn btn-outline-primary btn-block`}>Regresar a pacientes</Link>
                            </div>
                        </div>
                    </div>}
                        

                </div>

            </div>

            {/* Services and days */}
            { serviceRegisterStatus && <div className="container-services-creation-main">
                <h3>Selecciona el servicio</h3>
                <div className="container-services-creation my-4">
                    {services.map((s)=>{
                        return (
                            <div onClick={()=>{ service === s ? setService({}) : getDaysFromService(s) }} className={`cc-modal-card-2 mx-1 mb-3 cursor-pointer ${service === s ? "active" : "" }`}
                            style={{backgroundImage: `url(${s.urlImagen})`, display: s["estadoServicio"] !== "Borrador" ? "block" : "none" }}
                            key={s.servicioId}>
                                <div className="cc-modal-card-overlay">
                                    <p style={{width: "fit-content"}} className="pill-secondary rounded">{s.nombreLocalidad}</p>
                                    <p className="mb-0 cc-modal-card-p-strong">
                                    {s.titulo}
                                    </p>
                                </div>
                            </div>
                        )
                    })}
                </div>
                <div className="row justify-content-spacebetween no-gutters">
                    <Link to="/clients" className={`btn btn-disabled`}>Volver</Link>
                    <button onClick={()=>{ setServiceRegisterStatus(false); setDayRegisterStatus(true) }} className={`btn btn-primary`}>
                        Continuar
                    </button>
                </div>
            </div> }
            
            { dayRegisterStatus && <div className="container-services-creation-main">
                <h3 className="mb-0">Selecciona el día y la hora</h3>
                
                <div style={{width: "inherit"}} className="my-4">
                    <div className="agenda-days-slider">
                        {agendaDays.map((d, i)=>{
                        return (
                            <p className={`${daySelected === d && "day-active"} mb-0`} onClick={()=>{ setDaySelected(d) }} key={i}>
                            {d.bloqueado && <> <i className="material-icons">lock</i> <br/> </>}
                            {d.fecha}
                            </p>
                        )
                        })}
                    </div>
                    
                  { (service.tipoAgenda === "Slots" && daySelected.horasDia !== undefined  ) && 
                    <div className="mt-3 slots-day"> 
                      {
                        daySelected.horasDia.map((h, i)=> <div onClick={()=>{ setHoraSelected(h) }} className={`pill-secondary-2 ${horaSelected === h && "active"}`} key={i}>{h}</div>)
                      }
                    </div>
                  }
                </div>
                
                <div className="row justify-content-spacebetween no-gutters">
                    <button onClick={()=>{ setServiceRegisterStatus(true); setDayRegisterStatus(false); setDaySelected({}); setHoraSelected("") }} className={`btn btn-disabled`}>
                    Volver
                    </button>
                    <button onClick={()=>{
                        (daySelected["horasDia"] !== undefined && horaSelected !== "") && createReservation()
                    }} className={`btn btn-primary`}>
                    Continuar
                    </button>
                </div>
            </div> }

            {/* End Services and days */}

          </div>
    )

    async function onRegister() {
        setBtnMessage("Cargando...")
        let id = Date.now().toString()

        clientInfo["nombreUsuario"] = clientInfo["nombreUsuario"].toString().charAt(0).toUpperCase() + clientInfo["nombreUsuario"].toString().slice(1)
        clientInfo["dadsLastName"] = clientInfo["dadsLastName"].toString().charAt(0).toUpperCase() + clientInfo["dadsLastName"].toString().slice(1)
        clientInfo["momsLastName"] = clientInfo["momsLastName"].toString().charAt(0).toUpperCase() + clientInfo["momsLastName"].toString().slice(1)
        clientInfo["identificacion"] = clientInfo["identificacion"].toString().charAt(0).toUpperCase() + clientInfo["identificacion"].toString().slice(1)

        try {
            firebase.createClient(user.masterId, user.clientes, clientInfo.email, passwordState, clientInfo.nombreUsuario, "https://firebasestorage.googleapis.com/v0/b/priority-pet.appspot.com/o/947277.png?alt=media&token=6ecdf07c-98ad-4de8-aab3-f82ca64f7f99", clientInfo).then((uid)=>{
                if(uid === "error"){
                    setEmessage("Debes ingresar un email correcto");
                    setBtnMessage("Crear paciente")
                    setError(true)
                }else{
                    setClientInfo({...clientInfo, uid: uid})
                    axios.get(`https://us-central1-priority-pet.cloudfunctions.net/sendInvitationEmail?dest=${clientInfo.email}&aliado=${user.nombre}&username=${clientInfo.nombreUsuario}`)
                    setBtnMessage("Crear paciente")
                    setUserRegisterStatus(false)
                    setSuccessStatus(true)
                }
            })
        } catch(e) {
            setBtnMessage("Crear paciente")
            switch(e.message) {
                case "The email address is badly formatted.":
                    setError(true)
                    setTimeout(() => {
      				  setError(false)
      				}, 4000);
                    setEmessage("Debes ingresar un email correcto");
                break;
                case "The email address is already in use by another account.":
                    setError(true)
                    setTimeout(() => {
      				  setError(false)
      				}, 4000);
                    setEmessage("Tu cuenta ya está registrada con nosotros, si deseas hacer algún cambio o una compra descarga nuestra aplicación.");
                break;
                case "Password should be at least 6 characters":
                    setError(true)
                    setTimeout(() => {
      				  setError(false)
      				}, 4000);
                    setEmessage("La contraseña debe ser mayor a 5 caracteres");
                break;
                default:
                    setError(true)
                    setTimeout(() => {
      				  setError(false)
      				}, 4000);
                    setEmessage(e.message);
                break;
            }
        }
    }

    async function createReservation(){
        let hourSplitted = horaSelected.split(":")
        let hourSplittedHour = hourSplitted[0]
        let hourSplittedMinute = hourSplitted[1]

        try{
            const oid = moment().valueOf().toString()
            let dateInObject = moment(daySelected.fecha, "ddd, MMM D YYYY").set({'hour': hourSplittedHour, 'minute': hourSplittedMinute}).utc().toDate()

            // console.log(client)
            await firebase.db.collection("Ordenes").doc(oid).set({
                uid: clientInfo.uid,
                operatorId: user.aliadoId,
                localidadId: service.localidadId,
                pais: user.pais,
                status: "Por confirmar",
                statusCita: "Por confirmar",
                nombreComercial: user.nombreComercial,
                titulo: service.titulo,
                centro: service.nombreLocalidad,
                identificacion: clientInfo.identificacion,
                oid: oid,
                aliadoId: service.aliadoId,
                servicioid: service.servicioId,
                date: dateInObject,
                hora: horaSelected,
                fecha: daySelected.fecha,
                precio: service.precio,
                mid: petInfo.mid,
                user: clientInfo.nombreUsuario,
                tipoOrden: "Servicio",
                videoId: "",
                createdOn: moment().toDate()
            }).then((v)=>{
                firebase.db.collection("Ordenes").doc(oid).collection("Items").doc(service.servicioId).set({
                    aliadoId: user.masterId,
                    operatorId: user.aliadoId,
                    date: dateInObject,
                    delivery: service.delivery,
                    domicilio: service.domicilio,
                    fecha: daySelected.fecha,
                    hora: horaSelected,
                    mid: petInfo.mid,
                    nombre: clientInfo.nombreUsuario,
                    nombreComercial: user.nombreComercial,
                    oid: oid,
                    petthumbnailUrl: "https://firebasestorage.googleapis.com/v0/b/priority-pet.appspot.com/o/947277.png?alt=media&token=6ecdf07c-98ad-4de8-aab3-f82ca64f7f99",
                    precio: service.precio,
                    servicioid: service.servicioId,
                    tieneDelivery: false,
                    tieneDomicilio: false,
                    titulo: service.titulo,
                    uid: clientInfo.uid,
                })
            })
            if(horaSelected !== "") removeHourFromDay()
            createCalendarEvent(oid)
            sendEmailReservation()
            setDayRegisterStatus(false)
            setSuccessOrderStatus(true)

        }catch(e){
            console.log("Error: " + e)
        }
    }

    async function createCalendarEvent(oid){
        let hourSplitted = horaSelected.split(":")
        let hourSplittedHour = hourSplitted[0]
        let hourSplittedMinute = hourSplitted[1]
        let dateCalendarEvent = moment(daySelected.fecha, "ddd, MMM D YYYY").set({'hour': hourSplittedHour, 'minute': hourSplittedMinute}).utc().toDate()

        let reference = firebase.db.collection("Dueños").doc(clientInfo.uid)
        .collection("Calendar")

        let calendarEventId = reference.doc().id

        let calendarEvent = {
            calendarEventId,
            createdOn: moment().toDate(),
            details: `Cita pendiente a las ${horaSelected}`,
            done: false,
            end: dateCalendarEvent,
            start: dateCalendarEvent,
            isAllDay: false,
            uid: clientInfo.uid,
            source: "Mastografía",
            sourceId: oid,
            title: "Mastografía"
        }

        await reference.doc(calendarEventId).set(calendarEvent)
    }

    async function removeHourFromDay(){
        let listOfHours = [...daySelected.horasDia].filter((prv, i)=>( prv !== horaSelected))

        await firebase.db.collection("Localidades").doc(service.localidadId)
        .collection("Servicios").doc(service.servicioId)
        .collection("Agenda").doc(daySelected.fecha).update({
            horasDia: listOfHours
        })
    }

    function sendEmailReservation(){
        axios.get(`https://us-central1-priority-pet-prod.cloudfunctions.net/sendEmailEMA?dest=${clientInfo.email}&username=${clientInfo.nombreUsuario}&hour=${horaSelected}&date=${daySelected.fecha}`).catch((e)=>{
            console.log(e)
        })
    }

}

export default CreateClient