import moment from 'moment'
import 'moment/locale/es-mx';
import React, {useState, useEffect, useRef} from 'react'
import { useHistory } from 'react-router';
import firebase from '../firebase/config'
import utils from '../firebase/utils';

function Agenda(){
        
    const history = useHistory()
    
    let todayDate = moment().format("ddd, MMM D YYYY, hh:mm").toString()

    let monthNameToday = moment().format("MMMM").toString()
    let monthYearToday = moment().format("YYYY").toString()
    
    let monthYearTodayName = monthNameToday + monthYearToday
    const [todayDayState, setTodayDayState] = useState(moment())

    const [user, setUser] = useState({})
    const [appointment, setAppointment] = useState({})
    const [clientInfo, setClientInfo] = useState({})
    
    const [comentario, setComentario] = useState("")

    const [loadingDay, setLoadingDay] = useState(false)
    const [loadingList, setLoadingList] = useState(false)
    const [loadingCalendar, setLoadingCalendar] = useState(false)
    const [loadingImg, setLoadingImg] = useState(false)
    const [loadingAppointment, setLoadingAppointment] = useState(false)
    const [showClient, setShowClient] = useState(false)
    const [loadedLocality, setLoadedLocality] = useState(false)

    
    const [listMonths, setListMonths] = useState([])
    const [listAppointmentsStatus, setListAppointmentsStatus] = useState([])
    const [appointmentsList, setAppointmentsList] = useState([])
    const [mascotas, setMascotas] = useState([])

    const calendarScrollRef = useRef(null)
    const calendarScrollRef2 = useRef(null)

    async function getOrders(id, r){

        setLoadingCalendar(true)

        let tipos = [];
        
        const referenceWithId = firebase.db.collection('Ordenes').where("tipoOrden", "==", "Servicio").where("aliadoId", "==", id)
        const referenceWithoutId = firebase.db.collection('Ordenes').where("tipoOrden", "==", "Servicio")
        if(r["canViewAllCenters"] === true){
            await referenceWithoutId.get().then(val => {
              val.docs.forEach(item=>{
                tipos.push(item.data())
              })
            })
        }else{
            await referenceWithId.get().then(val => {
              val.docs.forEach(item=>{
                tipos.push(item.data())
              })
            })
        }
        
        getItems(tipos)

    }
      
    async function getItems(ordenes){
        let tipos = [];
        if(ordenes.length > 0){
            ordenes.forEach(async(orden)=>{
                // const serviceFilter = serv ? reference.where("titulo", "==", serv) : reference
        
                await firebase.db.collection('Ordenes').doc(orden.oid).collection("Items").get().then(val => {
                    val.docs.forEach(item=>{
                        let ordenData = item.data()
                        
                        ordenData["comentario"] = orden.comentario
                        // ordenData["status"] = orden.status
    
                        tipos.push(ordenData)
                    })
                })
                // setItems(tipos)
                // formatEvents([])
                // console.log(tipos.sort((a, b) => b.date - a.date))
                formatEvents(tipos)
            })
        }else{
            formatEvents([])
        }


    }
    
    async function formatEvents(items){
        let tipos = [];
        if(items.length > 0){
            items.forEach(async(item)=>{
            
                let date = item.date === null ? moment() : moment(item.date.toDate())
                const hn = "12:00"
                let hour = item.hora === null ? hn : item.hora
                
                let fecha = item.fecha
                let dateFormatted
                
                let listaText = fecha.split(" ")

                if( isNaN(parseInt( listaText[1] )) ){
                    let newFecha = `${listaText[0]} ${listaText[2]} ${listaText[1]} ${listaText[3]}`
                    dateFormatted = moment(newFecha, "ddd, D MMM YYYY")
                }else{
                    let newFecha = `${listaText[0]} ${listaText[1]} ${listaText[2]} ${listaText[3]}`
                    dateFormatted = moment(newFecha, "ddd, D MMM YYYY")
                }

                var event = {
                    id: item.oid,
                    mid: item.mid,
                    uid: item.uid,
                    fecha: fecha,
                    fechaFormattedHere: dateFormatted.format("DD MM YYYY"),
                    dateMoment: dateFormatted,
                    date: dateFormatted === null ? moment().format("DD MM YYYY").toString() : dateFormatted.format("DD MM YYYY"),
                    hour: hour !== "" ? hour : "12:00",
                    status: item.atendidoStatus ?? "Por atender",
                    service: item.titulo,
                    serviceId: item.servicioid,
                    desc: "Consulta integral",
                    client: item.nombre,
                    petImg: item.url,
                    usuarioAtendio: item.usuarioAtendio,
                    horaAtendio: item.horaAtendio,
                    comentario: item.comentario,
                    localidad: "-"
                }
    
                tipos.push(event)
            })
        }

        setAppointmentsList(tipos)
        
        getCalcMonths(tipos)
        
        setTimeout(() => {
            setLoadingCalendar(false)
        }, 0);

    }

    let daysOfTheWeek = [
        "Lun", "Mar", "Miér", "Jue", "Vie", "Sáb", "Dom"
    ]

    let widthList = [
        "0%", "14.28%", "28.57%", "42.85%", "57.14%", "71.42%", "85.71%"
    ]

    function checkFirstDay(){
        //Si el día es mayor al primero del mes 
        //entonces se resta el día menos 1 de manera que sea el primero del mes
        //Ejemplo: 20 de septiembre - (20 de septiembre - 1) = 1 de septiembre
        let day = moment().date() > 1 ? moment().subtract( ( moment().date() - 1 ) , "day") : moment()
        return day
    }

    function changeDaySubstract(){
        setLoadingDay(true)
        setTodayDayState(todayDayState.subtract(1, "day"));
        getAppointments()
        setTimeout(() => {
            setLoadingDay(false)
        }, 0.0);
    }
    
    function changeDayInCalendar(d){
        setLoadingList(true)
        new Promise(resolve => setTimeout(()=>{
            getAppointments(d)
            setLoadingList(false)
        }, 1000));
    }
    
    function changeDayAdd(){
        setLoadingDay(true)
        setTodayDayState(todayDayState.add(1, "day"));
        getAppointments()
        setTimeout(() => {
            setLoadingDay(false)
        }, 0.0);
    }
    
    async function getClientInfo(uid){
        try{
            await firebase.db.collection("Dueños").doc(uid).get().then((v)=>{
                let cinfo = v.data()
                cinfo["nombreDueño"] = v.user
                setClientInfo(cinfo)
            })
        }catch(e){
            console.log("Error: " + e)
        }
    }

    function getCalcMonths( listTipos ){

        let list = []
        
        let months = [
            checkFirstDay().subtract(6, "month"),
            checkFirstDay().subtract(5, "month"),
            checkFirstDay().subtract(4, "month"),
            checkFirstDay().subtract(3, "month"),
            checkFirstDay().subtract(2, "month"),
            checkFirstDay().subtract(1, "month"),
            checkFirstDay(),
            checkFirstDay().add(1, "month"),
            checkFirstDay().add(2, "month"),
            checkFirstDay().add(3, "month"),
            checkFirstDay().add(4, "month"),
            checkFirstDay().add(5, "month"),
            checkFirstDay().add(6, "month"),
        ]

        for(let i = 0; i < months.length; i++ ){
            const month = months[i]
            let monthFormatted = month.format("DD-MM-YYYY").toString()

            let valueBoolDayActual = false
            
            listTipos.forEach((app)=>{
                if(app.dateMoment.format("DD MM YYYY").toString() === month.format("DD MM YYYY").toString()) valueBoolDayActual = true
            })

            let dayActual = {
                hasAppointments: valueBoolDayActual,
                dayMoment: month,
                dayString: month.format("DD").toString(),
                dayStringComplete: month.format("DD MM YYYY").toString(),
            }
            
            let object = {
                month: month,
                firstDayNumnber: 0,
                monthFormatted: monthFormatted,
                days: [dayActual],
            }

            do{
                let d = month.add(1, "day")
                let dF = d.format("DD").toString()
                let dF2 = d.format("DD MM YYYY").toString()
                
                let valueBool = false

                listTipos.forEach((app)=>{
                    if(app.dateMoment.format("DD MM YYYY").toString() === dF2) valueBool = true
                })

                let day = {
                    hasAppointments: valueBool,
                    dayMoment: d,
                    dayString: dF,
                    dayStringComplete: dF2,
                }

                object.days.push(day)
            
            }while ( month.date() < month.daysInMonth() )
            
            object.firstDayNumnber = object.days[0].dayMoment.day()
            
            list.push(object)
        
        }
        
        setListMonths(list)
        
        setTimeout(() => {
            calendarScrollRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }, 1000);
        
        setTimeout(() => {
            getAppointments()
        }, 2000);
    
    }

    async function getCenterInfo(value){
        getClientInfo(value.uid)

        await firebase.db.collectionGroup("Servicios").where("servicioId", "==", value['serviceId']).get().then((serv)=>{
            let servDoc = serv.docs[0].data()
            firebase.db.collection("Localidades").doc(servDoc["localidadId"]).get().then((loc)=>{
                let cinfo = loc.data()
                value["localidad"] = cinfo.nombreLocalidad
            })
        })

        setTimeout(() => {
            setShowClient(false) 
            setAppointment(value)
            setLoadedLocality(true)
        }, 200);
    }

    function getAppointments(d){
        setLoadingDay(true)
        setListAppointmentsStatus(appointmentsList.filter((app1)=> app1.dateMoment.format("DD MM YYYY").toString() === ( d !== undefined ? d.format("DD MM YYYY").toString() : todayDayState.format("DD MM YYYY").toString() )))
        setTimeout(() => {
            setLoadingDay(false)
        }, 0.0);
    }

    useEffect(() => {
        firebase.getCurrentUser().then((val)=>{
            setUser(val)
            firebase.getRoleInfo(val.role ?? "Atencion").then((r)=>{
                getOrders(val.masterId, r)
            })
        })
    }, [])

    return (
        <div className="main-content-container container-fluid px-0">

            <div className="calendar-component-main">

                {/* Calendar picker */}
                <div className="calendar-component-left">
                    { loadingCalendar ? 
                        <div className="calendar-components-center">
                            <div class="spinner-border text-primary mr-2" role="status">
                                <span class="sr-only">Cargando...</span>
                            </div>
                        </div>
                    : listMonths.map((m, i)=>{
                        
                        let monthName = m.month.format("MMMM").toString()
                        let monthYear = m.month.format("YYYY").toString()
                        
                        let monthYearName = monthName + monthYear

                        return(
                         <div ref={ monthYearTodayName === monthYearName ? calendarScrollRef : calendarScrollRef2 } key={i}>
                             <p className="mb-3 mt-3 text-capitalize calendar-component-left-component-calendar-title">{monthName} <b>{monthYear}</b> <span className="calendar-component-appointment-card-title">{monthYearTodayName === monthYearName && " - Mes actual"}</span> </p>
                             <div style={{ display: "flex", flexWrap: "wrap", }} className="calendar-component-left-component-calendar">
                                {daysOfTheWeek.map((dw, i)=>{
                                    return(
                                        <p className="text-center mb-3 bold" key={i} style={{ fontSize: "13px", color: "var(--primary)", width: "14.28%" }}>{dw}</p>
                                    )
                                })}
                                <p style={{width: `${widthList[ moment( m.days[0].dayStringComplete, "DD MM YYYY" ).day() - 1 ]}` }} ></p>
                                {m.days.map((day, i)=>{
                                    return(
                                        <p className={`text-center calendar-single-day-component cursor-pointer mb-3 ${todayDayState.format("DD MM YYYY").toString() === day.dayStringComplete.toString() && "active" } `} 
                                        onClick={()=>{ setTodayDayState( moment( day.dayStringComplete, "DD MM YYYY" )); changeDayInCalendar(moment( day.dayStringComplete, "DD MM YYYY" )) }} 
                                        style={{ fontSize: "10px", color: "var(--primary)", width: "14.28%" }} 
                                        key={i}>
                                            
                                            <span className="calendar-single-day-component-span-day">
                                                {day.dayString}
                                            </span>

                                            { day.hasAppointments && <span className="calendar-single-day-component-span-circle"></span> }
                                            
                                        </p>
                                    )
                                })}
                             </div>
                         </div>
                        )
                    }) }
                </div>
                {/* End Calendar picker */}

                {/* All orders */}
                <div className="calendar-component-center">
                    <div className="calendar-components-all-cards-main">
                        
                        <div className="px-4 mt-3 d-none">
                            <div className="form-group">
                              <select className="form-control">
                                <option value="">Selecciona la categoría:</option>
                                <option value="">Selecciona la categoría 2:</option>
                                <option value="">Selecciona la categoría 3:</option>
                                <option value="">Selecciona la categoría 4:</option>
                              </select>
                            </div>
                        </div>

                        <div className="calendar-components-all-cards-header">


                            { loadingDay ? <p>{todayDayState.format("DD MMMM YYYY").toString()}</p>
                            : <p>{todayDayState.format("DD MMMM YYYY").toString()}</p> }
                            <div className="calendar-components-all-cards-header-btns">
                                <div onClick={()=>{ changeDaySubstract() }} className="calendar-components-all-cards-header-btn">{"<"}</div>
                                <div onClick={()=>{ changeDayAdd() }} className="calendar-components-all-cards-header-btn">{">"}</div>
                            </div>
                        </div>
                        <div className="calendar-components-all-cards-body">
                            { loadingList ?
                                <div className="calendar-components-center">
                                    <div class="spinner-border text-primary mr-2" role="status">
                                        <span class="sr-only">Cargando...</span>
                                    </div>
                                </div>
                            : listAppointmentsStatus.length > 0 
                            ? listAppointmentsStatus.map((values, i) => {
                                // getPetImg(values)
                                return (
                                    <div onClick={()=>{  getCenterInfo(values)}} key={i} className={`calendar-component-appointment-card fadeInTop ${ appointment.id === values.id && "active"} `}>
                                        <div className="calendar-component-appointment-card-header">
                                            <p className="calendar-component-appointment-card-hour mb-0">{values.hour}</p>
                                            <span style={{ fontSize: "2px" }}>{i}</span>
                                            <p className={`calendar-component-appointment-card-status ${
                                                values.status === "Atendido" ? "atendido" : values.status === "En atención" ? "en-atencion" : "por-atender"
                                            } mb-0`}>{values.status}</p>
                                        </div>
                                        <div className="calendar-component-appointment-card-body">
                                            <div className="calendar-component-appointment-card-body-info-text">
                                                <p className="calendar-component-appointment-card-title mb-0">{values.service}</p>
                                                {/* <p className="calendar-component-appointment-card-title mb-0">Item: {values.fecha} - De aquí: {values.fechaFormattedHere}</p> */}
                                                <p className="calendar-component-appointment-card-client mb-0">{values.client}</p>
                                            </div>
                                            <img src={values.petImg} className="calendar-component-appointment-card-body-client-img" />
                                        </div>
                                    </div>
                                )
                            }) 
                            : 
                            <div className="calendar-components-center">
                                <p className="mb-0 color-primary light">No hay citas para este día</p>
                            </div>
                            }
                        </div>
                    </div>
                </div>
                {/* End All orders */}

                {/* Info order */}
                <div className="calendar-component-right">
                    {(appointment.service !== undefined && !showClient) && 
                        <div className="animeted fadeIn calendar-component-right-info-appointment-main">
                            <div className="calendar-component-right-info-appointment-header">
                                <div className="calendar-component-right-info-appointment-header-dates">
                                    <p onClick={()=>{ setAppointment({}) }} className="calendar-component-right-info-appointment-header-dates-date mb-0 material-icons cursor-pointer">close</p>
                                    <p className="calendar-component-right-info-appointment-header-dates-hour mb-0">{appointment.hour}</p>
                                </div>
                                <img src={appointment.petImg} className="calendar-component-right-info-appointment-header-img" />
                            </div>
                            <div className="calendar-component-right-info-appointment-body">
                                <p className="calendar-component-right-info-appointment-body-client">{appointment.client}</p>
                                <p className="calendar-component-right-info-appointment-body-service">{appointment.service}</p>
                                <p className="calendar-component-right-info-appointment-body-desc">{loadedLocality ? appointment["localidad"] : "-"}</p>

                                { loadingAppointment ?
                                    <div className="calendar-components-center">
                                        <div class="spinner-border text-primary mr-2" role="status">
                                            <span class="sr-only">Cargando...</span>
                                        </div>
                                    </div>
                                : 
                                    <>
                                        <p style={{ fontSize: "14px", width: "fit-content" }}  className={`calendar-component-appointment-card-status mb-4 ${
                                            appointment.status === "Atendido" ? "atendido" : appointment.status === "En atención" ? "en-atencion" : "por-atender"
                                        } mb-0`}>{appointment.status}</p>
                                        
                                        { appointment.status === "En atención" && <div onClick={()=>{ updateAtendioOrder() }} className="btn btn-primary mb-3">Finalizar atención</div> }
                                        { appointment.status === "Por atender" && <div onClick={()=>{ updateEnAtencionOrder() }} className="btn btn-primary mb-3">Atender</div> }

                                        {/* { ( appointment.status === "Por confirmar" || appointment.status === "Por Confirmar" ) && <div className="col-lg-4">
                                        <button onClick={()=>{ updateOrder() }} className="btn btn-outline-secondary btn-block">Confirmar orden</button>
                                        </div> } */}

                                        <div className="btn btn-primary mb-3" onClick={()=>{ setShowClient(true) }}>Información del paciente</div>

                                        { appointment.status === "En atención" && <div className="mt-2">
                                            <p className="mb-1 calendar-component-appointment-card-title">Usuario que esta atendiendo:</p>
                                            <p className="mb-3 color-primary">{appointment.usuarioAtendio}</p>
                                            <p className="mb-1 calendar-component-appointment-card-title">Desde cuando se esta atendiendo:</p>
                                            <p className="mb-3 color-primary capitalize">{appointment.horaAtendio}</p>
                                        </div> }
                                        
                                        { appointment.status === "Atendido" && <div className="mt-2">
                                            <p className="mb-1 calendar-component-appointment-card-title">Usuario que atendió:</p>
                                            <p className="mb-3 color-primary">{appointment.usuarioAtendio}</p>
                                            <p className="mb-1 calendar-component-appointment-card-title">Cuando se atendio:</p>
                                            <p className="mb-3 color-primary capitalize">{appointment.horaAtendio}</p>
                                        </div> }

                                        { appointment.status === "Atendido" && <>
                                        
                                            { appointment.comentario === "" || appointment.comentario === undefined ? <></> : <p className="mb-1 calendar-component-appointment-card-title">Comentario adicional</p>}

                                            { appointment.comentario === "" || appointment.comentario === undefined ? <div>
                                                <textarea className="form-control mb-3" value={comentario} placeholder="Escribe un comentario referente a este paciente" onChange={(e)=>{setComentario(e.target.value)}} />
                                                <div onClick={()=>{ comentario !== "" ? saveComment() : console.log("Error") }} className="btn btn-block btn-outline-primary">
                                                    Guardar comentario
                                                </div>
                                            </div> : <p className="mb-4 color-primary capitalize">{appointment.comentario}</p> }
                                        
                                        </> }
                                    </>
                                }



                            </div>
                        </div>
                    }
                    {appointment.service === undefined && 
                        <div className="calendar-component-right-info-appointment-main">
                            <div className="calendar-components-center">
                                <span className="material-icons" style={{ color: "var(--secondary)", fontSize: "3rem" }}>bookmark</span>
                                <p className="mb-0 mt-2 color-primary light">Selecciona una cita para así mostrar su detalle completo</p>
                            </div>
                        </div>
                    }
                    {showClient && 
                        <div className="animeted fadeIn calendar-component-right-info-appointment-main">
                            <div className="calendar-component-right-info-appointment-header">
                                <div className="calendar-component-right-info-appointment-header-dates">
                                    <p onClick={()=>{ setShowClient(false) }} className="calendar-component-right-info-appointment-header-dates-date mb-0 material-icons cursor-pointer">west</p>
                                </div>
                                <img src={clientInfo.url} className="calendar-component-right-info-appointment-header-img" />
                            </div>
                            <div className="calendar-component-right-info-appointment-body">

                                <p className="calendar-component-right-info-appointment-body-client">{clientInfo.user ?? "-"}</p>
                                <p className="mb-1 calendar-component-appointment-card-title">Dirección del paciente:</p>
                                <p className="mb-3 color-primary capitalize">{clientInfo.direccion ?? "-"}</p>
                                <p className="mb-1 calendar-component-appointment-card-title">Teléfono del paciente:</p>
                                <p className="mb-3 color-primary capitalize">{clientInfo.telefono ?? "-"}</p>
                                <p className="mb-1 calendar-component-appointment-card-title">Email del paciente:</p>
                                <p className="mb-3 color-primary capitalize">{clientInfo.email ?? "-"}</p>
                                <p className="mb-1 calendar-component-appointment-card-title">CURP del paciente:</p>
                                <p className="mb-3 color-primary capitalize">{clientInfo.identificacion ?? "-"}</p>


                            </div>
                        </div>
                    }
                    
                </div>
                {/* End Info order */}
            </div>

        </div>
    )

    async function saveComment(){

        setLoadingAppointment(true)
        
        try {
            await firebase.db.collection("Ordenes").doc(appointment.id).collection("Items").get().then((val)=>{
                firebase.db.collection("Ordenes").doc(appointment.id).update({
                    comentario: comentario,
                })

                Promise.all(val.docs.map(async (doc) => {
                    firebase.db.collection("Ordenes").doc(appointment.id).collection("Items").doc(doc.data().servicioid).update({
                        comentario: comentario,
                    })
                }))
  
            })

        }catch (e){
          console.log(e)
        }
        
        appointment["comentario"] = comentario
        setComentario("")

        setLoadingAppointment(false)

    }

    async function updateAtendioOrder(){

        setLoadingAppointment(true)

        try {
          await firebase.db.collection("Ordenes").doc(appointment.id).collection("Items").get().then((val)=>{
            firebase.db.collection("Ordenes").doc(appointment.id).update({
              atendidoStatus: "Atendido",
              usuarioAtendio: user.nombre,
              comentario: comentario,
              horaAtendio: todayDate,
            })
  
            firebase.db.collection("Ordenes").doc(appointment.id).update({
              status: "Atendido",
              statusCita: "Atendido"
            })
  
            Promise.all(val.docs.map(async (doc) => {
              firebase.db.collection("Ordenes").doc(appointment.id).collection("Items").doc(doc.data().servicioid).update({
                atendidoStatus: "Atendido",
                usuarioAtendio: user.nombre,
                comentario: comentario,
                horaAtendio: todayDate,
              })
            }))
  
          })
          
        }catch (e){
          console.log(e)
        }

        appointment["status"] = "Atendido"
        appointment["usuarioAtendio"] = user.nombre
        appointment["horaAtendio"] = todayDate
        
        setLoadingAppointment(false)

      }

      async function updateEnAtencionOrder(){

        setLoadingAppointment(true)

        try {
          await firebase.db.collection("Ordenes").doc(appointment.id).collection("Items").get().then((val)=>{
            firebase.db.collection("Ordenes").doc(appointment.id).update({
              atendidoStatus: "En atención",
              usuarioAtendio: user.nombre,
              comentario: comentario,
              horaAtendio: todayDate,
            })
  
            firebase.db.collection("Ordenes").doc(appointment.id).update({
              status: "En atención",
              statusCita: "En atención"
            })
            
            Promise.all(val.docs.map(async (doc) => {
              firebase.db.collection("Ordenes").doc(appointment.id).collection("Items").doc(doc.data().servicioid).update({
                atendidoStatus: "En atención",
                usuarioAtendio: user.nombre,
                comentario: comentario,
                horaAtendio: todayDate,
              })
            }))
          })
          
        }catch (e){
          console.log(e)
        }

        appointment["status"] = "En atención"
        appointment["usuarioAtendio"] = user.nombre
        appointment["horaAtendio"] = todayDate
 
        setLoadingAppointment(false)

        setTimeout(() => {
            if(appointment.service === "Consulta veterinaria" && user.tipoAliado === "Médico"){
                history.push({
                  pathname: "/client/pet/history",
                  state: {mid: appointment.mid, uid: appointment.uid}
                })
            }
        }, 500);



      }

}

export default Agenda
