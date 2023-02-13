import moment from 'moment';
import React, {useEffect, useState, useRef} from 'react'
import {useLocation, Link, useHistory} from 'react-router-dom';
import firebase from '../../firebase/config'
import * as XLSX from "xlsx";

//TODO:
//3er paso: Registrar al usuario y asegurarse de no repetir el registro
//4to paso: Obtener el uid del usuario
//5to paso: Recorrer cada lista y crear el objeto de cita y calendarEvent
//6to paso: Incluir el uid en los objetos y usar el uid para crear los calendarEvents

function ImportOrders() {

  const [services, setServices] = useState([])
  const [listOfExcel, setListOfExcel] = useState([])

  const [service, setService] = useState({})
  const [user, setUser] = useState({})
  const [role, setRol] = useState({})

  const [loadingExcel, setLoadingExcel] = useState(false)
  const [loadedExcel, setLoadedExcel] = useState(false)
  const [loadedServices, setLoadedServices] = useState(false)
  const [serviceRegisterStatus, setServiceRegisterStatus] = useState(true)
  const [selectedServiceStatus, setSelectedServiceStatus] = useState(false)
  const [loadingToDB, setLoadingToDB] = useState(false)
  
  const [excelName, setExcelName] = useState("")
  
  const [file, setFile] = useState(null)
  const hiddenFileInputExcel = useRef(null)
  
  const handleExcelUploadClick = event => {
    hiddenFileInputExcel.current.click();
  };

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
          tipos2.push(o1)
        })
      })

    }))

    setTimeout(() => {
      setServices(tipos2)
      setLoadedServices(true)
    }, 500);

  }

  useEffect(() => {
    firebase.getCurrentUser().then((val)=>{
      setUser(val)
      firebase.getRoleInfo(val.role ?? "Atencion").then((r)=>{
        setRol(r)
        getServices(val.aliadoId, r)
      })
    })
  }, [loadedServices])

  return (
    <div className={`main-content-container container-fluid px-4`}>
      <div className="page-header align-items-center justify-content-spacebetween row no-gutters px-4 my-4">
        <div className="col-12 col-sm-5 text-center text-sm-left mb-0">
          <div className="row align-items-center">
            <div className="col">
              <p className="page-title bold"><Link className="page-title light" to="/orders">Citas</Link> {'>'} Importar citas</p>
            </div>
          </div>
        </div>
        <div className="col-12 col-sm-1 mb-0">
          <div className="row align-items-center justify-content-space-around">
            <i className="material-icons color-white display-5">help_outline</i>
          </div>
        </div>
      </div>
      { serviceRegisterStatus && <div className="container-services-creation-main mb-5">
        <h3>Selecciona el servicio</h3>
        <div className="container-services-creation my-4">
            {services.map((s)=>{
                return (
                    <div onClick={()=>{ service === s ? setService({}) : setService(s) }} className={`cc-modal-card-2 mx-1 mb-3 cursor-pointer ${service === s ? "active" : "" }`}
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
            <Link to="/orders" className={`btn btn-disabled`}>Volver</Link>
            <button onClick={()=>{ setServiceRegisterStatus(false); setSelectedServiceStatus(true) }} className={`btn btn-primary`}>
              Continuar
            </button>
        </div>
      </div> }
      {selectedServiceStatus && <div className="main-component-excel">
        <div style={{textAlign: "center"}}>
          <p className="mb-4 title-component-excel">Cargar excel</p>
          <p className="subtitle-component-excel">Asegurate de que el excel cargado pertenezca a la unidad medica seleccionada</p>
        </div>
        <p className="mb-4 status-component-excel">Citas cargadas: {listOfExcel.length}</p>
        <div style={{textAlign: "center", width: "100%"}}>
          <p className={`${loadingExcel && "mb-4"} number-component-excel`}>{loadingExcel ? "Cargando excel..." : ""}</p>
          <p className={`${loadingToDB && "mb-4"} number-component-excel`}>{loadingToDB ? "Cargando a la base de datos..." : ""}</p>
          {!loadedExcel ? <div onClick={handleExcelUploadClick} className="btn btn-block btn-primary">Cargar</div> :
            <div onClick={()=>{ handleExcelUpload() }} className="btn btn-block btn-primary">Finalizar</div>
          }
          <input ref={hiddenFileInputExcel} type="file" style={{display: 'none'}} onChange={(e)=>{ handleExcelUploadController(e)}} />
        </div>
      </div>
      }
    </div>
  )

  function handleExcelUploadController(e) {
    
    setLoadingExcel(true)   
    var res = handleUploadExcel(e)
    setListOfExcel(res)
    setExcelName(e.target.files[0]["name"])
    setTimeout(() => {
      handleListDividerByUser(res)
      setLoadingExcel(false)
    }, 3000);
    setFile(e)
  }

  function handleUploadExcel(e){
    let list = []
    var selectedFile = e.target.files[0]
    if(selectedFile){
        var fileReader = new FileReader()
        
        fileReader.onload = function(e){
            
            var data = e.target.result
            var workhook = XLSX.read(data, {
                type: "binary"
            })
    
            workhook.SheetNames.forEach((sheet)=>{
                let rowObject = XLSX.utils.sheet_to_json( workhook.Sheets[sheet], {
                    defval: undefined
                } )
                setTimeout(() => {
                    console.log("Lista cargada exitosamente")
                    for(let i = 0; i < rowObject.length; i++){
                        let object = rowObject[i]
                        list.push(object)
                    }
                }, 1000);
            
            })
        }

        fileReader.readAsBinaryString(selectedFile)
        return list

    }

  }

  function handleListDividerByUser(prop){
    let list = [...prop]
    let listOfGroups = []
    let objectOfRepeateds = []
    objectOfRepeateds = list.reduce((r, a)=>{
      r[a["identificacion"]] = r[a["identificacion"]] || [];
      r[a["identificacion"]].push(a);
      return r;
    }, Object.create(null));

    Object.keys(objectOfRepeateds).forEach(function(k) {
      listOfGroups.push(objectOfRepeateds[k])
    });

    setListOfExcel(listOfGroups)
    setLoadedExcel(true)
  }
  
  function handleExcelUpload(){
    setLoadingToDB(true)
    listOfExcel.forEach((prv)=>{
      registerUsers(prv)
    })
    setTimeout(() => {
      window.location.href = "/orders";
    }, 3000);
    setLoadingToDB(false)
  }

  function registerUsers(propUserList){
    //Lista de citas del usuario: propUserList
    //Usuario a registrar: user/clientInfo
    let patient = {...propUserList[0]}
    let password = createPassword()
    let clientInfo = {
      nombreUsuario: patient["nombre"] ?? "",
      dadsLastName: patient["primerApellido"] ?? "",
      momsLastName: patient["segundoApellido"] ?? "",
      identificacion: patient["identificacion"] ?? "",
      telefono: patient["telefono"] ?? "",
      direccion: patient["direccion"] ?? "",
      edad: patient["edad"] ?? 0,
      //password: "emapass",
      password: password,
      email: patient["email"] ?? "",
      uid: "",
      lat: "",
      lon: "",
      codPostal: ""
    }

    let listOfAppointments = [...propUserList].map((prv)=>({
      uid: "",
      operatorId: user.aliadoId,
      localidadId: service.localidadId,
      pais: "México",
      status: "Por confirmar",
      statusCita: "Por confirmar",
      nombreComercial: user.nombreComercial,
      titulo: service.titulo,
      centro: service.nombreLocalidad,
      identificacion: clientInfo["identificacion"],
      oid: moment().valueOf().toString(),
      aliadoId: service.aliadoId,
      servicioid: service.servicioId,
      date: prv["fecha"],
      hora: prv["hora"],
      fecha: prv["fecha"],
      precio: service.precio,
      mid: "",
      user: clientInfo["nombreUsuario"],
      tipoOrden: "Servicio",
      videoId: "",
      createdOn: moment().toDate()
    }))
    
    firebase.createClient(user.masterId, [], clientInfo.email, password, clientInfo.nombreUsuario, "https://firebasestorage.googleapis.com/v0/b/priority-pet.appspot.com/o/947277.png?alt=media&token=6ecdf07c-98ad-4de8-aab3-f82ca64f7f99", clientInfo).then((uid)=>{
      if(uid === "error"){
      }else{
        clientInfo.uid = uid
        listOfAppointments = listOfAppointments.map((prv)=> formatAppointmentToCreation(prv, uid) )
        listOfAppointments.forEach((prv)=>{
          createReservation(prv)
        })
      }
    })
    //axios.get(`https://us-central1-priority-pet.cloudfunctions.net/sendInvitationEmail?dest=${clientInfo.email}&aliado=${user.nombre}&username=${clientInfo.nombreUsuario}`)
  }

  function createPassword(){
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < 9; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    
    return result
  }

  function formatAppointmentToCreation(propData, uid){
    return {
      ...propData,
      hora: excelDateToJSHour(propData["hora"]),
      date: excelDateToJSDate(propData["fecha"]),
      fecha: moment(excelDateToJSDate(propData["fecha"])).format("ddd, MMM D YYYY"),
      uid: uid,
      mid: uid
    }
  }
  
  function excelDateToJSDate(excelDate){
    var date = new Date(Math.round((excelDate - (25567 + 1)) * 86400 * 1000));
    
    let dateTime = date.getUTCHours().toString() + ':' + (date.getUTCMinutes() < 10 ? ("0" + date.getUTCMinutes().toString()): date.getUTCMinutes().toString())
    let hourSplitted = dateTime.split(":")
    let hourSplittedHour = hourSplitted[0]
    let hourSplittedMinute = hourSplitted[1]

    let momentFormatted = moment(date).subtract(1, "d").set({'hour': hourSplittedHour, 'minute': hourSplittedMinute}).utc().toDate()
    var convertedDate = momentFormatted
    return convertedDate;
  }

  function excelDateToJSHour(excelDate){
    var date = new Date(Math.round((excelDate - (25567 + 1)) * 86400 * 1000));
    
    let dateTime = date.getUTCHours().toString() + ':' + (date.getUTCMinutes() < 10 ? ("0" + date.getUTCMinutes().toString()): date.getUTCMinutes().toString())

    return dateTime;
  }

  async function createReservation(appointmentProp){
    try{ 
      const oid = moment().valueOf().toString()
      // console.log(client)
      await firebase.db.collection("Ordenes").doc(oid).set(appointmentProp).then((v)=>{
          firebase.db.collection("Ordenes").doc(oid).collection("Items").doc(service.servicioId).set({
            aliadoId: user.masterId,
            operatorId: user.aliadoId,
            date: appointmentProp["date"],
            delivery: service.delivery,
            domicilio: service.domicilio,
            fecha: appointmentProp["fecha"],
            hora: appointmentProp["hora"],
            mid: appointmentProp["uid"],
            nombre: appointmentProp["user"],
            nombreComercial: user.nombreComercial,
            oid: appointmentProp["oid"],
            petthumbnailUrl: "https://firebasestorage.googleapis.com/v0/b/priority-pet.appspot.com/o/947277.png?alt=media&token=6ecdf07c-98ad-4de8-aab3-f82ca64f7f99",
            precio: service.precio,
            servicioid: service.servicioId,
            tieneDelivery: false,
            tieneDomicilio: false,
            titulo: service.titulo,
            uid: appointmentProp["uid"],
          })
      })
      createClientInCenter(appointmentProp)
      createCalendarEvent(appointmentProp)

    }catch(e){
      console.log("Error: " + e)
    }
  }

  async function createCalendarEvent(appointmentProp){
    let reference = firebase.db.collection("Dueños").doc(appointmentProp["uid"])
    .collection("Calendar")

    let calendarEventId = reference.doc().id

    let calendarEvent = {
        calendarEventId,
        createdOn: moment().toDate(),
        details: `Cita pendiente a las ${appointmentProp["hora"]}`,
        done: false,
        end: appointmentProp["date"],
        start: appointmentProp["date"],
        isAllDay: false,
        uid: appointmentProp["uid"],
        source: "Mastografía",
        sourceId: appointmentProp["oid"],
        title: "Mastografía"
    }

    await reference.doc(calendarEventId).set(calendarEvent)
  }

  async function createClientInCenter(client){
    await firebase.db.collection("Aliados").doc(service.aliadoId).collection("Clients").doc(client.uid).set({
      uid: client["uid"],
      email: client["email"],
      identificacion: client["identificacion"],
      telefono: client["telefono"],
      user: client["user"],
      url: client["url"],
      walkin: true,
    })
  }

}

export default ImportOrders