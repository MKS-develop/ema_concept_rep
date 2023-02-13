import React, {useState, useEffect} from 'react'
import firebase from '../../firebase/config'
import {useHistory, Link} from 'react-router-dom';
import moment from 'moment';
import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";
import axios from 'axios'

function Clients() {

    const history = useHistory()
    const [nameValue, setNameValue] = useState(null);
    const [nroValue, setNroValue] = useState(null);
    const [clients, setClients] = useState([])
    const [clientsSearch, setClientsSearch] = useState([])
    const [user, setUser] = useState({})
    const [client, setClient] = useState({})
    
    const [petInfo, setPetInfo] = useState({
      mid: "",
      especie: "",
      raza: "",
      nombre: "",
    })

    const [services, setServices] = useState([])
    const [service, setService] = useState({})
    
    const [orderState, setOrderState] = useState({})
    const [daySelected, setDaySelected] = useState({})
    const [agendaDays, setAgendaDays] = useState([])
    const [horaSelected, setHoraSelected] = useState("")
    
    const [activeModal, setActiveModal] = useState(false)
    const [activeModalDays, setActiveModalDays] = useState(false)
    const [activeModalSuccess, setActiveModalSuccess] = useState(false)
    const [dayRegisterStatus, setDayRegisterStatus] = useState(false)
    const [successOrderStatus, setSuccessOrderStatus] = useState(false)
    const [hasDateStatus, setHasDateStatus] = useState(false)
    
    const [clientPets, setClientPets] = useState([])
    const [petSelected, setPetSelected] = useState({})
    const [role, setRol] = useState({})

    const handleNewDateToClient = async(id) => {
      let docOfDateAfterToday = {}
      let todayDate = moment()

      await firebase.db.collectionGroup("Items").where("uid", "==", id).get().then((value)=>{
        docOfDateAfterToday = value.docs.find((doc)=>(
          moment(doc.data()["fecha"], "ddd, MMM D YYYY").isAfter(todayDate)
        ))
      })

      if(docOfDateAfterToday !== undefined){
        setOrderState(docOfDateAfterToday.data())
        setHasDateStatus(true)
      }else{
        setActiveModal(true)
      }

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
            tipos2.push(o1)
          })
        })

      }))

      console.log(tipos)
      console.log(tipos2)

      setTimeout(() => {
        setServices(tipos2)
      }, 500);

    }

    const getClients = async(aliadoId, masterId, r) =>{
      let tipos = [];
      if(r["canViewAllCenters"] === true && r["canViewAllCenters"] !== undefined){
        await firebase.db.collectionGroup("Clients").get().then((val)=>{
          val.docs.forEach((pac)=>{ 
            let finded = tipos.some((prv)=> prv["uid"] === pac.data()["uid"])
            !finded && tipos.push(pac.data()) 
          })
        })
        setClients(tipos)
      }else{
        await firebase.db.collection("Aliados").doc(masterId).collection("Clients").get().then((val)=>{
          val.docs.forEach((pac)=>{ 
            tipos.push(pac.data()) 
          })
        })
        setClients(tipos)
      }
    }
    
    const getDueños3 = async(val) =>{
      let tipos = []
      for(let i = 0; i < clients.length; i++){
        let u = clients[i].user.toLowerCase()
        if(u.includes(val.toLowerCase())){
          tipos.push(clients[i])
        }
      }
      setClientsSearch(tipos)
    }
    
    const getDueños4 = async(val) =>{
      let tipos = []
      for(let i = 0; i < clients.length; i++){
        let u = clients[i].welfareStatus
        if(u === val){
          tipos.push(clients[i])
        }
      }
      setClientsSearch(tipos)
    }
    
    const getDueños5 = async(val) =>{
      let tipos = []
      for(let i = 0; i < clients.length; i++){
        let u = clients[i].identificacion
        if(u === val){
          tipos.push(clients[i])
        }
      }
      setClientsSearch(tipos)
    }
    
    async function goToClient(uid){
      history.push({
        pathname: "/clients/client", 
        state: { uid: uid }
      })
    }

    async function getDaysFromService(s){
      let tipos = [];
      
      setService(s)

      await firebase.db.collection("Localidades").doc(s.localidadId)
      .collection("Servicios").doc(s.servicioId).collection("Agenda").orderBy("createdOn", "asc").get().then(val=>{
        val.docs.forEach(item=>{
          let d = moment(item.data().date.toDate())
          let today = moment().subtract(1, "d")
          d.isSameOrAfter(today) && tipos.push(item.data())
        })
        setAgendaDays(tipos)
      })

    }
    
    const ExportToExcel = ({ apiData, fileName }) => {
      const fileType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
      const fileExtension = ".xlsx";
      
      let today = moment().format('L')

      const exportToCSV = async(d, fileName) => {
        await Promise.all(d.map(async (o) => {
          for(let v in o){
            v.toString() === "geolocation" && delete o[v]
            v.toString() === "geoAddress" && delete o[v]
            v.toString() === "url" && delete o[v]
            v.toString() === "tipoDocumento" && delete o[v]
            v.toString() === "fechaNacimiento" && delete o[v]
            v.toString() === "codigoTexto" && delete o[v]
            v.toString() === "token" && delete o[v]
            v.toString() === "docid" && delete o[v]
            v.toString() === "registroCompleto" && delete o[v]
            v.toString() === "location" && delete o[v]
            v.toString() === "id_culqi" && delete o[v]
            v.toString() === "uid" && delete o[v]
            v.toString() === "bienvenida" && delete o[v]
            v.toString() === "userCart" && delete o[v]
          }
          
        }))
        const ws = XLSX.utils.json_to_sheet(d);
        const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
        const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
        const data = new Blob([excelBuffer], { type: fileType });
        FileSaver.saveAs(data, `pacientes-${today}` + fileExtension);
      };
    
      return (
        <button className="btn btn-outline-secondary" onClick={(e) => exportToCSV(apiData, fileName)}>Exportar a Excel <i className="material-icons">save_alt</i></button>
      );
    }
    
    useEffect(() => {
      firebase.getCurrentUser().then((val)=>{
        setUser(val)
        firebase.getRoleInfo(val.role ?? "Atencion").then((r)=>{
          setRol(r)
          getServices(val.aliadoId, r)
          getClients(val.aliadoId, val.masterId, r)
        })
      })
    }, [])

    return (

        <div className="main-content-container container-fluid px-4">
          { activeModalSuccess && <div className="cc-modal-wrapper fadeIn">
              <div className="c2-modal">
                  <div className="cc-modal-header mb-2">
                    <span className="mb-0 material-icons" style={{color: "var(--success)", fontSize: "69px"}}>check_circle</span>
                  </div>
                  <div className="c2-modal-body">
                     <p className="mb-0">
                      Cita creada exitosamente
                     </p>
                  </div>
                  <div className="cc-modal-footer align-items-center justify-content-spacebetween">
                    <button onClick={()=>{ setActiveModalSuccess(false) }} className={`btn btn-success btn-block`}>
                      Aceptar
                    </button>
                  </div>
              </div>
          </div>}
          { activeModal && 
            <div className="cc-modal-wrapper fadeIn">
              <div className="cc-modal">
                <div className="cc-modal-header mb-2">
                  <div className="no-gutters mb-3 row align-items-center justify-content-spacebetween">
                    <h3 className="mb-0">Selecciona el servicio</h3>
                  </div>
                </div>
                <div className="cc-modal-body">
                  {services.map((s)=>{
                    return (
                      <div onClick={()=>{ service === s ? setService({}) : getDaysFromService(s) }} className={`cc-modal-card-2 m-2 cursor-pointer ${service === s ? "active" : "" }`} 
                      style={{backgroundImage: `url(${s.urlImagen})`, display: s["estadoServicio"] !== "Borrador" ? "block" : "none" }}
                      key={s.servicioId}>
                        <div className="cc-modal-card-overlay">
                          <p className="mb-0 cc-modal-card-p">
                            {s.direccionDetallada}
                          </p>
                          <p style={{width: "fit-content"}} className="pill-secondary rounded">{s.nombreLocalidad}</p>
                          <p className="mb-0 cc-modal-card-p-strong">
                            {s.titulo}
                          </p>
                        </div>
                      </div>
                    )
                  })}
                </div>
                <div className="cc-modal-footer align-items-center justify-content-spacebetween">

                  <button onClick={()=>{ setActiveModal(false) }} className={`btn btn-disabled`}>
                    Cancelar
                  </button>
                  <button onClick={()=>{ setActiveModalDays(true); setActiveModal(false) }} className={`btn ${ service.servicioId !== undefined ? "btn-primary" : "btn-disabled"}`}>
                    Continuar
                  </button>

                </div>
              </div>
            </div>
          }

            {hasDateStatus && <div className="cc-modal-wrapper fadeIn">
              <div className="c3-modal" style={{width: "35%"}}>
                <div className="cc-modal-header mb-2">
                  <div className="no-gutters mb-3 row align-items-center justify-content-spacebetween">
                    <h3 className="mb-0">Reservación</h3>
                  </div>
                </div>
                <div className="cc-modal-body" style={{padding: "0rem 0rem"}}>

                <div className="container-creation-success py-5" style={{width: "100%", height: "100%"}}>
                    <h3 className="mb-2">El paciente ya tiene una cita agendada</h3>
                    <span style={{color: "var(--warning)"}} className="material-icons">calendar_today</span>
                    <div className="row no-gutters justify-content-spacebetween col-12">
                      <div className="col-lg-4">
                        <button onClick={()=>{ setHasDateStatus(false) }} className={`btn btn-default btn-block`}>
                          Cerrar
                        </button>
                      </div>
                      <div className="col-lg-4">
                        <button onClick={()=>{ 
                          history.push({
                            pathname: "/orders/order",
                            state: {oid: orderState?.oid}
                          })
                        }} className={`btn btn-primary btn-block`}>
                          Ir a la cita
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div> }

            { successOrderStatus && <div className="cc-modal-wrapper fadeIn">
              <div className="c3-modal">
                <div className="cc-modal-header mb-2">
                  <div className="no-gutters mb-3 row align-items-center justify-content-spacebetween">
                    <h3 className="mb-0">Reservación</h3>
                  </div>
                </div>
                <div className="cc-modal-body" style={{padding: "0rem 0rem"}}>

                <div className="container-creation-success py-5" style={{width: "100%", height: "100%"}}>
                    <h3 className="mb-2">Reservación creada exitosamente</h3>
                    <span className="color-success material-icons">done</span>
                    <div className="row no-gutters">
                        <div className="col-lg-12">
                        <button onClick={()=>{ setSuccessOrderStatus(false) }} className={`btn btn-primary`}>
                          Aceptar
                        </button>
                    </div>
                    </div>
                  </div>
                </div>
              </div>
            </div> }

            { activeModalDays && <div className="cc-modal-wrapper fadeIn">
              <div className="c3-modal">
                <div className="cc-modal-header mb-2">
                  <div className="no-gutters mb-3 row align-items-center justify-content-spacebetween">
                    <h3 className="mb-0">Selecciona el día y la hora</h3>
                  </div>
                </div>
                <div className="cc-modal-body">

                  <div style={{width: "inherit"}}>
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
                </div>
                <div className="cc-modal-footer align-items-center justify-content-spacebetween">
                  <button onClick={()=>{ setActiveModalDays(false); setActiveModal(true); setDaySelected({}); setHoraSelected("") }} className={`btn btn-disabled`}>
                    Volver
                  </button>
                  <button onClick={()=>{ (daySelected["horasDia"] !== undefined && horaSelected !== "") && createReservation() }} className={`btn btn-primary`}>
                    Continuar
                  </button>
                </div>
              </div>
            </div> }

          <div>

              <div className="page-header align-items-center justify-content-spacebetween row no-gutters px-4 my-4">
                <div className="col-12 col-sm-5 text-center text-sm-left mb-0">
                  <div className="row align-items-center">
                    <div className="col">
                      <p className="page-title"><span>Pacientes - {clients.length}</span></p>
                    </div>
                  </div>
                </div>
                <div className="col-12 col-sm-1 mb-0">
                  <div className="row align-items-center justify-content-space-around">
                    {/* <i className="material-icons color-white display-5">help_outline</i> */}
                  </div>
                </div>
              </div>
              <div className="form-row align-items-center justify-content-space-between">
                  <div className="form-group mr-3">
                    <input type="text" placeholder="Nombre del paciente" className="form-control" onChange={(e)=>{getDueños3(e.target.value)}}/>
                  </div>
                  <div className="form-group mr-3">
                    <input type="text" placeholder="CURP" className="form-control" onChange={(e)=>{getDueños5(e.target.value)}}/>
                  </div>
                  { role?.canFilterByStatus && <div className="form-group mr-3">
                    <select className="form-control" onChange={(e)=>{getDueños4(e.target.value)}}>
                      <option value="">Seleccionar</option>
                      <option value={true}>Bien</option>
                      <option value={false}>Mal</option>
                    </select>
                  </div>}
                  <div className="ml-3 form-group">
                    <button className="btn btn-primary" onClick={()=>{
                      //getDueños3(nameValue)
                      test()
                    }}><i className="material-icons">search</i></button>
                  </div>
                <div className="ml-3 form-group">
                  <Link to="/clients/create-client" className="btn btn-outline-secondary">Crear nuevo paciente</Link>              
                </div>
              </div>
              <div className="row">
                  <div className="col-lg-12 col-md-12 col-sm-12">
                    <div className="orders-container">
                      <div className="row orders-title align-items-center">
                        <div style={{width: "50px", height: "50px"}} ></div>
                        <div className="col-md-2 ">
                          <p className="mb-0">Nombre</p>
                        </div>
                        <div className="col-md-1 ">
                          <p className="mb-0">CURP</p>
                        </div>
                        <div className="col-md-2 ">
                          <p className="mb-0">Dirección</p>
                        </div>
                        <div className="col-md-2 ">
                          <p className="mb-0">Telefono</p>
                        </div>
                        <div className="col-md-2 ">
                          <p className="mb-0">Email</p>
                        </div>
                        <div className="col-md-2 ">
                          <p className="mb-0"></p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-12 col-md-12 col-sm-12">
                    <div className="orders-container">
                      {
                        clientsSearch.length > 0 ? clientsSearch.map(client=>{
                          return(
                            <div key={client.uid} className="mb-3 row client-child align-items-center">
                              <img onClick={()=>{goToClient(client.uid)}} className="client-avatar-preview rounded-circle mr-2 cursor-pointer" src={client.url ?? "cargando"} alt="User Avatar"/>
                              <div className="col-md-2 color-primary">
                                <p className="mb-0 order-p-ellipsis">{client.user ?? "-"} {client.dadsLastName ?? ""} {client.momsLastName ?? ""}</p>
                              </div>
                              <div className="col-md-1 color-primary">
                                <p className="mb-0 order-p-ellipsis">{client.identificacion}</p>
                              </div>
                              <div className="col-md-2 color-primary">
                                <p className="mb-0 order-p-ellipsis">{client.direccion}</p>
                              </div>
                              <div className="col-md-2 color-primary">
                                <p className="mb-0 order-p-ellipsis">{client.telefono}</p>
                              </div>
                              <div className="col-md-2 color-primary">
                                <p className="mb-0 order-p-ellipsis">{client.email}</p>
                              </div>
                              { role.canMakeReserves && <div onClick={()=>{ 
                                handleNewDateToClient(client.uid);
                                setClient(client);
                                //setActiveModal(true);
                               }} style={{ textAlign: "end" }} className="row col-md-2 material-icons cursor-pointer color-secondary"> calendar_today </div> }
                            </div>
                          )
                        }) : clientsSearch.length === 0 ? clients.map(client=>{
                            return(
                              <div key={client.uid} className="mb-3 row client-child align-items-center">
                                <img onClick={()=>{goToClient(client.uid)}} className="client-avatar-preview rounded-circle mr-2 cursor-pointer" src={client.url ?? "cargando"} alt="User Avatar"/>
                                <div className="col-md-2 color-primary">
                                  <p className="mb-0 order-p-ellipsis">{client.user ?? "-"} {client.dadsLastName ?? ""} {client.momsLastName ?? ""}</p>
                                </div>
                                <div className="col-md-1 color-primary">
                                  <p className="mb-0 order-p-ellipsis">{client.identificacion ?? "-"}</p>
                                </div>
                                <div className="col-md-2 color-primary">
                                  <p className="mb-0 order-p-ellipsis">{client.direccion ?? "-"}</p>
                                </div>
                                <div className="col-md-2 color-primary">
                                  <p className="mb-0 order-p-ellipsis">{client.telefono ?? "-"}</p>
                                </div>
                                <div className="col-md-2 color-primary">
                                  <p className="mb-0 order-p-ellipsis">{client.email ?? "-"}</p>
                                </div>
                                { role.canMakeReserves && <div onClick={()=>{ 
                                  handleNewDateToClient(client.uid);
                                  setClient(client);
                                  //setActiveModal(true);
                                 }} style={{ textAlign: "end" }} className="row col-md-2 material-icons cursor-pointer color-secondary"> calendar_today </div> }

                              </div>
                            )
                          })
                        : <div className="text-center"><p>No hay pacientes</p></div>
                      }
                    </div>
                  </div>
              </div>
            </div>

          </div>
    )

    function test(){
      let h = "13:00"
      let hourSplitted = h.split(":")
      let hourSplittedHour = hourSplitted[0]
      let hourSplittedMinute = hourSplitted[1]

      //let dateInObject = moment("mié., nov. 2 2022", "ddd, MMM D YYYY").utc("09:00", "HH:mm").set({'hour': hourSplittedHour, 'minute': hourSplittedMinute}).toDate()
      let dateInObject = moment("mié., nov. 2 2022", "ddd, MMM D YYYY").set({'hour': hourSplittedHour, 'minute': hourSplittedMinute}).utc().toDate()
      console.log(dateInObject)

    }

    async function createReservation(){
      try{
        let hourSplitted = horaSelected.split(":")
        let hourSplittedHour = hourSplitted[0]
        let hourSplittedMinute = hourSplitted[1]
        let dateInObject = moment(daySelected.fecha, "ddd, MMM D YYYY").set({'hour': hourSplittedHour, 'minute': hourSplittedMinute}).utc().toDate()
  
        const oid = moment().valueOf().toString()
        // console.log(client)
        await firebase.db.collection("Ordenes").doc(oid).set({
          uid: client.uid,
          operatorId: user.aliadoId,
          localidadId: service.localidadId,
          pais: user.pais,
          status: "Por confirmar",
          statusCita: "Por confirmar",
          nombreComercial: user.nombreComercial,
          titulo: service.titulo,
          centro: service.nombreLocalidad,
          identificacion: client.identificacion,
          oid: oid,
          aliadoId: service.aliadoId,
          servicioid: service.servicioId,
          date: dateInObject,
          hora: horaSelected,
          fecha: daySelected.fecha,
          precio: service.precio,
          mid: petInfo.mid,
          user: client.user,
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
              nombre: client.user,
              nombreComercial: user.nombreComercial,
              oid: oid,
              petthumbnailUrl: client.url,
              precio: service.precio,
              servicioid: service.servicioId,
              tieneDelivery: false,
              tieneDomicilio: false,
              titulo: service.titulo,
              uid: client.uid,
            })
        })
        if(horaSelected !== "") removeHourFromDay()
        createClientInCenter()
        sendEmailReservation()
        createCalendarEvent(oid)
        setDayRegisterStatus(false)
        setActiveModalDays(false)
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

      let reference = firebase.db.collection("Dueños").doc(client.uid)
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
          uid: client.uid,
          source: "Mastografía",
          sourceId: oid,
          title: "Mastografía"
      }

      await reference.doc(calendarEventId).set(calendarEvent)
    }

    async function createClientInCenter(){
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

    async function removeHourFromDay(){
      let listOfHours = [...daySelected.horasDia].filter((prv, i)=>( prv !== horaSelected))

      await firebase.db.collection("Localidades").doc(service.localidadId)
      .collection("Servicios").doc(service.servicioId)
      .collection("Agenda").doc(daySelected.fecha).update({
          horasDia: listOfHours
      })
    }

    function sendEmailReservation(){
        axios.get(`https://us-central1-priority-pet-prod.cloudfunctions.net/sendEmailEMA?dest=${client.email}&username=${client.nombreUsuario}&hour=${horaSelected}&date=${daySelected.fecha}`).catch((e)=>{
            console.log(e)
        })
    }

    async function goToMessages(ownerUid, ownerName){
      try{
        await firebase.db.collection("Chats").where("aliadoId", "==", user.aliadoId).get().then((val)=>{
          let tipos = []
          Promise.all(val.docs.map(async (doc) => {
            tipos.push(doc.data().uid)
          }))
          if(tipos.includes(ownerUid)){
            history.push({
              pathname: "/messages",
              state: {uid: ownerUid, fromClients: true}
            })
          }else{
            let id = firebase.db.collection("Chats").doc().id
            firebase.db.collection("Chats").doc(id).set({
              aliadoId: user.aliadoId,
              uid: ownerUid,
              chatId: id
            }).then(()=>{
              let mid = firebase.db.collection("Chats").doc(id).collection("Mensajes").doc().id
              firebase.db.collection("Chats").doc(id).collection("Mensajes").doc(mid).set({
                aliadoId: user.aliadoId,
                createdOn: moment().toDate(),
                message: `Saludos, ${ownerName}`,
                messageId: mid,
                uid: null,
              }).then(()=>{
                history.push({
                  pathname: "/messages",
                  state: {uid: ownerUid, fromClients: true}
                })
              })
            })
          }
        })
      }catch(e){
        console.log("Error: " + e)
      }
    }

}

export default Clients