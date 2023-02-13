import React, {useState, useEffect} from 'react'
import firebase from '../../firebase/config'
import {Link, useHistory, useLocation} from 'react-router-dom';
// import moment from 'moment';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import AgendaConfig from '../AgendaConfig';
import MomentUtils from '@date-io/moment';
import { MuiPickersUtilsProvider, TimePicker } from '@material-ui/pickers';
import moment from 'moment';
import { useDateInput } from 'react-nice-dates'
import { es } from 'date-fns/locale'
import 'react-nice-dates/build/style.css'

function AgendaServiceCreation() {
    const [btnMessage, setBtnMessage] = useState("Crear servicio");
    let data = useLocation();
    let history = useHistory()

    const [error, setError] = useState(false)
    const [agendaLibre, setAgendaLibre] = useState(false)
    const [agendaEspacios, setAgendaEspacios] = useState(true)
    const [emessage, setEmessage] = useState("")
    const [desdea, setDesdea] = useState("")
    const [hastaa, setHastaa] = useState("")
    const [fh, setFH] = useState(0)
    const [user, setUser] = useState({})
    let weekDays = ["lun", "mar", "mié", "jue", "vie", "sáb", "dom"];

    const [descansoDesde, setDescansoDesde] = useState(new Date(2021,6,28,0,0,0))
    const [descansoHasta, setDescansoHasta] = useState(new Date(2021,6,28,0,0,0))
    
    const date = new Date(2021,6,28,0,0,0)
    const [duracion, setDuracion] = useState(new Date(2021,6,28,0,0,0))
    const [aDesde, setADesde] = useState(new Date(2021,6,28,0,0,0))
    const [aHasta, setAHasta] = useState(new Date(2021,6,28,0,0,0))
    const [lDesde, setLDesde] = useState(new Date(2021,6,28,0,0,0))
    const [lHasta, setLHasta] = useState(new Date(2021,6,28,0,0,0))
    const [maDesde, setMaDesde] = useState(new Date(2021,6,28,0,0,0))
    const [maHasta, setMaHasta] = useState(new Date(2021,6,28,0,0,0))
    const [miDesde, setMiDesde] = useState(new Date(2021,6,28,0,0,0))
    const [miHasta, setMiHasta] = useState(new Date(2021,6,28,0,0,0))
    const [jDesde, setJDesde] = useState(new Date(2021,6,28,0,0,0))
    const [jHasta, setJHasta] = useState(new Date(2021,6,28,0,0,0))
    const [vDesde, setVDesde] = useState(new Date(2021,6,28,0,0,0))
    const [vHasta, setVHasta] = useState(new Date(2021,6,28,0,0,0))
    const [sDesde, setSDesde] = useState(new Date(2021,6,28,0,0,0))
    const [sHasta, setSHasta] = useState(new Date(2021,6,28,0,0,0))
    const [dDesde, setDDesde] = useState(new Date(2021,6,28,0,0,0))
    const [dHasta, setDHasta] = useState(new Date(2021,6,28,0,0,0))
    const [allHoras, setAllHoras] = useState({
        horas: [],
        horasLunes: [],
        horasMartes: [],
        horasMiercoles: [],
        horasJueves: [],
        horasViernes: [],
        horasSabado: [],
        horasDomingo: [],
    })
    const [allStatus, setAllStatus] = useState({        
        statusLunes: true,
        statusMartes: true,
        statusMiercoles: true,
        statusJueves: true,
        statusViernes: true,
        statusSabado: true,
        statusDomingo: true,
    })
    const [allCapacidad, setAllCapacidad] = useState({
        capacidad: 0,
        capacidadLunes: 0,
        capacidadMartes: 0,
        capacidadMiercoles: 0,
        capacidadJueves: 0,
        capacidadViernes: 0,
        capacidadSabado: 0,
        capacidadDomingo: 0,
    })    

    let [steps, setSteps] = useState([
      false,
      false,
      false,
      false,
    ])

    function changeActiveStep(status, i){
      let newArr = [...steps];
      newArr[i] = !status;
      setSteps(newArr);
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

    let help = [
        "Si tu horario de atención no es el mismo todos los días,  lo puedes personalizar haciendo clic en el día que quieras modificar e ingresando el nuevo rango de horas"
    ]

    const durationInputProps = useDateInput({ date: duracion, format: 'HH:mm', locale: es, onDateChange: setDuracion })
    const desdeInputProps = useDateInput({ date: aDesde, format: 'HH:mm', locale: es, onDateChange: setADesde })
    const hastaInputProps = useDateInput({ date: aHasta, format: 'HH:mm', locale: es, onDateChange: setAHasta })
    const desdeDescansoInputProps = useDateInput({ date: descansoDesde, format: 'HH:mm', locale: es, onDateChange: setDescansoDesde })
    const hastaDescansoInputProps = useDateInput({ date: descansoHasta, format: 'HH:mm', locale: es, onDateChange: setDescansoHasta })

    const desdeLInputProps = useDateInput({ date: lDesde, format: 'HH:mm', locale: es, onDateChange: setLDesde })
    const hastaLInputProps = useDateInput({ date: lHasta, format: 'HH:mm', locale: es, onDateChange: setLHasta })
    
    const desdeMaInputProps = useDateInput({ date: maDesde, format: 'HH:mm', locale: es, onDateChange: setMaDesde })
    const hastaMaInputProps = useDateInput({ date: maHasta, format: 'HH:mm', locale: es, onDateChange: setMaHasta })
    
    const desdeMiInputProps = useDateInput({ date: miDesde, format: 'HH:mm', locale: es, onDateChange: setMiDesde })
    const hastaMiInputProps = useDateInput({ date: miHasta, format: 'HH:mm', locale: es, onDateChange: setMiHasta })
    
    const desdeJInputProps = useDateInput({ date: jDesde, format: 'HH:mm', locale: es, onDateChange: setJDesde })
    const hastaJInputProps = useDateInput({ date: jHasta, format: 'HH:mm', locale: es, onDateChange: setJHasta })
    
    const desdeVInputProps = useDateInput({ date: vDesde, format: 'HH:mm', locale: es, onDateChange: setVDesde })
    const hastaVInputProps = useDateInput({ date: vHasta, format: 'HH:mm', locale: es, onDateChange: setVHasta })
    
    const desdeSInputProps = useDateInput({ date: sDesde, format: 'HH:mm', locale: es, onDateChange: setSDesde })
    const hastaSInputProps = useDateInput({ date: sHasta, format: 'HH:mm', locale: es, onDateChange: setSHasta })
    
    const desdeDInputProps = useDateInput({ date: dDesde, format: 'HH:mm', locale: es, onDateChange: setDDesde })
    const hastaDInputProps = useDateInput({ date: dHasta, format: 'HH:mm', locale: es, onDateChange: setDHasta })

    useEffect(() => {
        // if(data.state === undefined || data.state === null){
        //   window.location.href = "/configuration/services"
        // }
        firebase.getCurrentUser().then((val)=>{
          setUser(val)
        })
    }, [])

    return (
        <MuiPickersUtilsProvider utils={MomentUtils}>
        <div className="main-content-container container-fluid px-4">
            {error && <ErrorComponent msg={emessage === "" ? "" : emessage}/>}
            <div className="page-header align-items-center justify-content-spacebetween row no-gutters px-4 my-4">
              <div className="col-12 col-sm-5 text-center text-sm-left mb-0">
                <div className="row align-items-center">
                  <div className="col">
                    <p className="page-title"><span> Creación de la agenda </span></p>
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
            <div className="col-lg-8 col-md-8 col-sm-12">
                
                <div className="step-container active">
                    <div className="step-container-header">
                    <div className="step-number">1</div>
                    <p className="step-text">selecciona el tipo de agenda que aplica para tu servicio</p>
                    </div>
                    
                    <div className="align-items-center row no-gutters mt-3">
                        <div onClick={()=>{setAgendaEspacios(true); setAgendaLibre(false);}} className={`"mb-0 mr-5 light cursor-pointer ${ agendaEspacios ? "agenda-lock-btn" : "agenda-title"} "`} ><b>Agenda por espacios</b><br/>(Día y hora)</div>
                        <div onClick={()=>{setAgendaLibre(true); setAgendaEspacios(false); }} className={`"mb-0 mr-2 light cursor-pointer ${ agendaLibre ? "agenda-lock-btn" : "agenda-title"} "`} ><b>Agenda libre</b><br/>(Día)</div>
                    </div>
                    <div className="mt-3">
                        <div onClick={()=> { changeActiveStep(steps[0], 0) }} className="btn btn-primary cursor-pointer">
                            Continuar
                        </div>
                    </div>               
                </div>
                
                <div className={`step-container ${steps[0] ? "active" : ""}`}>
                    <div className="step-container-header">
                        <div className="step-number">2</div>
                        <p className="step-text">Ingresa el tiempo promedio de duración del servicio</p>
                    </div>
                    
                    <div className="row align-items-center justify-content-spacebetween no-gutters mt-3">
                        { agendaLibre ? <p className="mb-0 agenda-title">Pacientes por días</p> : <p className="mb-0 agenda-title">Tiempo promedio de duración del servicio que brindas</p>}
                        { agendaLibre ? <input type="text" value={allCapacidad.capacidad} onChange={(e)=>{setAllCapacidad({...allCapacidad, capacidad: e.target.value})}} placeholder="0" className="col-lg-3 px-2 form-control"/> 
                            : <input className='input-hour' style={{ marginLeft: 16, width: 90 }} {...durationInputProps} />
                            // : <TimePicker clearable placeholder="00:00" ampm={false} label="" value={duracion} onChange={setDuracion}/>
                        }
                    </div>

                    { (duracion.getTime() === date.getTime() && agendaEspacios) || (agendaLibre && allCapacidad.capacidad == 0) ? <></> : <div className="mt-3">
                        <div onClick={()=> { changeActiveStep(steps[1], 1) }} className="btn btn-primary cursor-pointer">
                            Continuar
                        </div>
                    </div> }       
                </div>
                
                <div className={`step-container ${steps[1] ? "active" : ""}`}>
                    <div className="step-container-header">
                        <div className="step-number">3</div>
                        <p className="step-text">Ingresa el horario de atención en el que se presta el servicio</p>
                    </div>
                    
                    <div className="mt-3">
                        <p className="mb-2 agenda-title">Horario de atención diario</p>
                        <div className="row align-items-center">
                            <div className="col">
                                <div className="row align-items-center">
                                    <div className="col">
                                        <p className="mb-0">Desde</p>
                                    </div>
                                    <div className="col">
                                        <input className='input-hour' style={{ marginLeft: 16, width: 90 }} {...desdeInputProps} />
                                    </div>
                                </div>
                            </div>
                            <div className="col">
                                <div className="row align-items-center">
                                    <div className="col">
                                        <p className="mb-0">Hasta</p>
                                    </div>
                                    <div className="col">
                                        <input className='input-hour' style={{ marginLeft: 16, width: 90 }} {...hastaInputProps} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    { ( aDesde.getTime() === date.getTime() || aHasta.getTime() === date.getTime() ) ||
                        ( aDesde.getTime() > aHasta.getTime() ) ||
                        (duracion.getTime() === date.getTime() && agendaEspacios) ? <></> : <div className="mt-3">
                        <div onClick={()=> {
                            if( aDesde.getTime() === date.getTime() || aHasta.getTime() === date.getTime() ){
                                    setEmessage("Debes ingresar las horas correctas")
                                    setError(true)
                                }else if(aDesde.getTime() > aHasta.getTime() && agendaEspacios){
                                    setEmessage("La hora inicial deber ser menor a la final")
                                    setError(true)
                                }else if(duracion.getTime() === date.getTime()  && agendaEspacios){
                                    setEmessage("Debes iniciar el tiempo promedio de atención cuando tu agenda es por espacios de tiempo")
                                    setError(true)
                                }else if(agendaLibre){
                                    changeActiveStep(steps[2], 2) 
                                }else{
                                    let desde = moment(aDesde).toDate().getHours() +  ":" + moment(aDesde).toDate().getMinutes()
                                    let hasta = moment(aHasta).toDate().getHours() +  ":" + moment(aHasta).toDate().getMinutes()
                                    let duration = moment(duracion).toDate().getHours() +  ":" + moment(duracion).toDate().getMinutes()
                                    setDesdea(desde)
                                    setHastaa(hasta)

                                    setLDesde(aDesde)
                                    setLHasta(aHasta)
                                    setMaDesde(aDesde)
                                    setMaHasta(aHasta)
                                    setMiDesde(aDesde)
                                    setMiHasta(aHasta)
                                    setJDesde(aDesde)
                                    setJHasta(aHasta)
                                    setVDesde(aDesde)
                                    setVHasta(aHasta)
                                    setSDesde(aDesde)
                                    setSHasta(aHasta)
                                    setDDesde(aDesde)
                                    setDHasta(aHasta)

                                    setAllHoras({
                                        ...allHoras, 
                                        horas: AgendaConfig.getTimes(desde, hasta, duration),
                                        horasLunes: AgendaConfig.getTimes(desde, hasta, duration),
                                        horasMartes: AgendaConfig.getTimes(desde, hasta, duration),
                                        horasMiercoles: AgendaConfig.getTimes(desde, hasta, duration),
                                        horasJueves: AgendaConfig.getTimes(desde, hasta, duration),
                                        horasViernes: AgendaConfig.getTimes(desde, hasta, duration),
                                        horasSabado: AgendaConfig.getTimes(desde, hasta, duration),
                                        horasDomingo: AgendaConfig.getTimes(desde, hasta, duration),
                                    })
                                    changeActiveStep(steps[2], 2) 
                                } 
                            }} 
                            className="btn btn-primary cursor-pointer">
                            Continuar
                        </div>
                    </div>}       
                </div>
                
                <div className={`step-container ${steps[2] ? "active" : ""}`}>
                    <div className="step-container-header">
                        <div className="step-number">4</div>
                        <p className="step-text">Ingresa el horario de descanso (si aplica)</p>
                    </div>
                    
                    <div className="mt-3">
                        <p className="mb-2 agenda-title">Horario de descanso</p>
                        <div className="row align-items-center">
                            <div className="col">
                                <div className="row">
                                    <div className="col">
                                        <p className="mb-0">Desde</p>
                                    </div>
                                    <div className="col">    
                                        <input className='input-hour' style={{ marginLeft: 16, width: 90 }} {...desdeDescansoInputProps} />
                                    </div>
                                </div>
                            </div>
                            <div className="col">
                                <div className="row">
                                    <div className="col">
                                        <p className="mb-0">Hasta</p>
                                    </div>
                                    <div className="col">
                                        <input className='input-hour' style={{ marginLeft: 16, width: 90 }} {...hastaDescansoInputProps} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    { (descansoDesde.getTime() === date.getTime() || descansoHasta.getTime() === date.getTime() ) 
                    || (descansoDesde.getTime() > descansoHasta.getTime()) || (duracion.getTime() === date.getTime() && agendaEspacios) ? <></> : <div className="mt-3">
                        <div onClick={()=> {
                                if(descansoDesde.getTime() === date.getTime() || descansoHasta.getTime() === date.getTime()){
                                    setEmessage("Debes ingresar las horas correctas")
                                    setError(true)
                                }else if(descansoDesde.getTime() > descansoHasta.getTime()){
                                    setEmessage("La hora inicial deber ser menor a la final")
                                    setError(true)
                                }else if(fh === allHoras.horas.length){
                                    setEmessage("Horario de descanso implementado, intenta ingresar un nuevo horario de atención")
                                    setError(true)
                                }else if(duracion.getTime() === date.getTime()){
                                    setEmessage("Debes iniciar el tiempo promedio de atención cuando tu agenda es por espacios de tiempo")
                                    setError(true)
                                }else if(agendaLibre){
                                    changeActiveStep(steps[2], 2)
                                }else{
                                    let desde = moment(descansoDesde).toDate().getHours() +  ":" + (moment(descansoDesde).toDate().getMinutes() === 0 ? moment(descansoDesde).toDate().getMinutes() + "0" : moment(descansoDesde).toDate().getMinutes() )
                                    let hasta = moment(descansoHasta).toDate().getHours() +  ":" + (moment(descansoHasta).toDate().getMinutes() === 0 ? moment(descansoHasta).toDate().getMinutes() + "0" : moment(descansoHasta).toDate().getMinutes() )
                                    let duration = moment(duracion).toDate().getHours() +  ":" + moment(duracion).toDate().getMinutes()
                                    setAllHoras({
                                        ...allHoras, 
                                        horas: AgendaConfig.restHoursFrom(allHoras.horas, desde, hasta, duration),
                                        horasLunes: AgendaConfig.restHoursFrom(allHoras.horasLunes, desde, hasta, duration),
                                        horasMartes: AgendaConfig.restHoursFrom(allHoras.horasMartes, desde, hasta, duration),
                                        horasMiercoles: AgendaConfig.restHoursFrom(allHoras.horasMiercoles, desde, hasta, duration),
                                        horasJueves: AgendaConfig.restHoursFrom(allHoras.horasJueves, desde, hasta, duration),
                                        horasViernes: AgendaConfig.restHoursFrom(allHoras.horasViernes, desde, hasta, duration),
                                        horasSabado: AgendaConfig.restHoursFrom(allHoras.horasSabado, desde, hasta, duration),
                                        horasDomingo: AgendaConfig.restHoursFrom(allHoras.horasDomingo, desde, hasta, duration),
                                    })
                                    setFH(allHoras.horas.length)
                                    // changeActiveStep(steps[3], 3) 
                                }
                            }}
                            className="btn btn-primary cursor-pointer">
                            {agendaLibre ? "Guardar horario de descanso" : "Aplicar horario de descanso"}
                        </div>
                    </div> }
                </div>

                 <div className={`step-container ${steps[2] ? "active" : ""}`} style={{ height: `${steps[2] ? "37vh" : "10vh"}` }}>
                    <div className="step-container-header">
                        <div className="step-number" style={{width: "55px"}}>5</div>
                        <p className="step-text">Bloquea los días de la semana en los que no se presta el servicio. Selecciona el día y luego haz clic en "Bloquear día" (si aplica) 
                            <i className="ml-1 tooltip-btn material-icons display-6">help_outline</i>
                            <span className="tooltip">{help[0]}</span>
                        </p>
                    </div>
                    <div className="mt-3">
                    <Tabs className="mb-5">
                      <TabList>
                        {allStatus.statusLunes ? <Tab>Lunes</Tab>
                        : <Tab>Lunes <i className="material-icons">lock_outline</i></Tab>
                        }
                        {allStatus.statusMartes ? <Tab>Martes</Tab>
                        : <Tab>Martes <i className="material-icons">lock_outline</i></Tab>
                        }
                        {allStatus.statusMiercoles ? <Tab>Miercoles</Tab>
                        : <Tab>Miercoles <i className="material-icons">lock_outline</i></Tab>
                        }
                        {allStatus.statusJueves ? <Tab>Jueves</Tab>
                        : <Tab>Jueves <i className="material-icons">lock_outline</i></Tab>
                        }
                        {allStatus.statusViernes ? <Tab>Viernes</Tab> 
                        : <Tab>Viernes <i className="material-icons">lock_outline</i></Tab>
                        }
                        {allStatus.statusSabado ? <Tab>Sabado</Tab>
                        : <Tab>Sabado <i className="material-icons">lock_outline</i></Tab>
                        }
                        {allStatus.statusDomingo ? <Tab>Domingo</Tab>
                        : <Tab>Domingo <i className="material-icons">lock_outline</i></Tab>
                        }
                      </TabList>

                      <TabPanel >
                        <div className="row align-items-center mb-4">
                            <div className="col">
                                {agendaLibre ? <div className="row no-gutters align-items-center"> <p className="mb-0 mr-4">Pacientes por día</p> <input value={allCapacidad.capacidadLunes ? allCapacidad.capacidadLunes : allCapacidad.capacidad } type="text" onChange={(e)=>{setAllCapacidad({...allCapacidad, capacidadLunes: e.target.value})}} placeholder="0" className="col-lg-3 px-2 form-control"/> </div> 
                                : <p className="mb-0">Pacientes por día {allHoras.horasLunes && allHoras.horasLunes.length}</p> }
                            </div>
                            <div className="col">
                                {allStatus.statusLunes 
                                ? <p onClick={()=>{setAllStatus({...allStatus, statusLunes: !allStatus.statusLunes})}} className="mb-0 agenda-lock-btn">Bloquear día <i className="material-icons mb-0">lock_outline</i></p>
                                : <p onClick={()=>{setAllStatus({...allStatus, statusLunes: !allStatus.statusLunes})}} className="mb-0 agenda-lock-btn">Desbloquear  día <i className="material-icons mb-0">lock_open</i></p>}
                            </div>
                        </div>
                        { !agendaLibre && <div className="row align-items-center">
                            <div className="col">
                                <div className="row align-items-center">
                                    <div className="col">
                                        <p className="mb-0">Desde</p>
                                    </div>
                                    <div className="col">    
                                        <input className='input-hour' style={{ marginLeft: 16, width: 90 }} {...desdeLInputProps} />
                                    </div>
                                </div>
                            </div>
                            <div className="col">
                                <div className="row align-items-center">
                                    <div className="col">
                                        <p className="mb-0">Hasta</p>
                                    </div>
                                    <div className="col">
                                        <input className='input-hour' style={{ marginLeft: 16, width: 90 }} {...hastaLInputProps} />
                                    </div>
                                </div>
                            </div>
                            <div className="col">
                                <button className="btn btn-success" onClick={()=>{
                                    if(lDesde.getTime() === date.getTime() || lHasta.getTime() === date.getTime()){
                                        setEmessage("Debes ingresar las horas correctas")
                                        setError(true)
                                    }else if(lDesde > lHasta){
                                        setEmessage("La hora inicial deber ser menor a la final")
                                        setError(true)
                                    }else if(duracion.getTime() === date.getTime()){
                                        setEmessage("El tiempo promedio de atención es requerido")
                                        setError(true)
                                    }else{
                                        let desde = moment(lDesde).toDate().getHours() +  ":" + moment(lDesde).toDate().getMinutes()
                                        let hasta = moment(lHasta).toDate().getHours() +  ":" + moment(lHasta).toDate().getMinutes()
                                        let duration = moment(duracion).toDate().getHours() +  ":" + moment(duracion).toDate().getMinutes()

                                        setAllHoras({
                                            ...allHoras, 
                                            horasLunes: AgendaConfig.getTimes(desde, hasta, duration),
                                        })
                                    }
                                }}><i className="material-icons">save</i> Guardar</button>
                            </div>
                        </div> }
                      </TabPanel>
                      <TabPanel>
                        <div className="row align-items-center mb-4">
                            <div className="col">
                            {agendaLibre ? <div className="row no-gutters align-items-center"> <p className="mb-0 mr-4">Pacientes por día</p> <input type="text" value={allCapacidad.capacidadMartes ? allCapacidad.capacidadMartes : allCapacidad.capacidad } onChange={(e)=>{setAllCapacidad({...allCapacidad, capacidadMartes: e.target.value})}} placeholder="0" className="col-lg-3 px-2 form-control"/> </div> : <p className="mb-0">Pacientes por día {allHoras.horasMartes && allHoras.horasMartes.length}</p>}
                            </div>
                            <div className="col">
                                {allStatus.statusMartes 
                                ? <p onClick={()=>{setAllStatus({...allStatus, statusMartes: !allStatus.statusMartes})}} className="mb-0 agenda-lock-btn">Bloquear día <i className="material-icons mb-0">lock_outline</i></p>
                                : <p onClick={()=>{setAllStatus({...allStatus, statusMartes: !allStatus.statusMartes})}} className="mb-0 agenda-lock-btn">Desbloquear  día <i className="material-icons mb-0">lock_open</i></p>}
                            </div>
                        </div>
                        { !agendaLibre && <div className="row align-items-center">
                            <div className="col">
                                <div className="row align-items-center">
                                    <div className="col">
                                        <p className="mb-0">Desde</p>
                                    </div>
                                    <div className="col">    
                                        <input className='input-hour' style={{ marginLeft: 16, width: 90 }} {...desdeMaInputProps} />
                                    </div>
                                </div>
                            </div>
                            <div className="col">
                                <div className="row align-items-center">
                                    <div className="col">
                                        <p className="mb-0">Hasta</p>
                                    </div>
                                    <div className="col">
                                        <input className='input-hour' style={{ marginLeft: 16, width: 90 }} {...hastaMaInputProps} />
                                    </div>
                                </div>
                            </div>
                            <div className="col">
                                <button className="btn btn-success" onClick={()=>{
                                    if(maDesde.getTime() === date.getTime() || maHasta.getTime() === date.getTime()){
                                        setEmessage("Debes ingresar las horas correctas")
                                        setError(true)
                                    }else if(maDesde > maHasta){
                                        setEmessage("La hora inicial deber ser menor a la final")
                                        setError(true)
                                    }else if(duracion.getTime() === date.getTime()){
                                        setEmessage("El tiempo promedio de atención es requerido")
                                        setError(true)
                                    }else{
                                        let desde = moment(maDesde).toDate().getHours() +  ":" + moment(maDesde).toDate().getMinutes()
                                        let hasta = moment(maHasta).toDate().getHours() +  ":" + moment(maHasta).toDate().getMinutes()
                                        let duration = moment(duracion).toDate().getHours() +  ":" + moment(duracion).toDate().getMinutes()

                                        setAllHoras({
                                            ...allHoras, 
                                            horasMartes: AgendaConfig.getTimes(desde, hasta, duration),
                                        })
                                    }
                                }}><i className="material-icons">save</i> Guardar</button>
                            </div>
                        </div> }
                      </TabPanel>
                      <TabPanel>
                      <div className="row align-items-center mb-4">
                            <div className="col">
                            {agendaLibre ? <div className="row no-gutters align-items-center"> <p className="mb-0 mr-4">Pacientes por día</p> <input type="text" value={allCapacidad.capacidadMiercoles ? allCapacidad.capacidadMiercoles : allCapacidad.capacidad } onChange={(e)=>{setAllCapacidad({...allCapacidad, capacidadMiercoles: e.target.value})}} placeholder="0" className="col-lg-3 px-2 form-control"/> </div> : <p className="mb-0">Pacientes por día {allHoras.horasMiercoles && allHoras.horasMiercoles.length}</p> }
                            </div>
                            <div className="col">
                                {allStatus.statusMiercoles 
                                ? <p onClick={()=>{setAllStatus({...allStatus, statusMiercoles: !allStatus.statusMiercoles})}} className="mb-0 agenda-lock-btn">Bloquear día <i className="material-icons mb-0">lock_outline</i></p>
                                : <p onClick={()=>{setAllStatus({...allStatus, statusMiercoles: !allStatus.statusMiercoles})}} className="mb-0 agenda-lock-btn">Desbloquear  día <i className="material-icons mb-0">lock_open</i></p>}
                            </div>
                        </div>
                        {!agendaLibre && <div className="row align-items-center">
                            <div className="col">
                                <div className="row align-items-center">
                                    <div className="col">
                                        <p className="mb-0">Desde</p>
                                    </div>
                                    <div className="col">    
                                        <input className='input-hour' style={{ marginLeft: 16, width: 90 }} {...desdeMiInputProps} />
                                    </div>
                                </div>
                            </div>
                            <div className="col">
                                <div className="row align-items-center">
                                    <div className="col">
                                        <p className="mb-0">Hasta</p>
                                    </div>
                                    <div className="col">
                                        <input className='input-hour' style={{ marginLeft: 16, width: 90 }} {...hastaMiInputProps} />
                                    </div>
                                </div>
                            </div>
                            <div className="col">
                                <button className="btn btn-success" onClick={()=>{
                                    if(miDesde.getTime() === date.getTime() || miHasta.getTime() === date.getTime()){
                                        setEmessage("Debes ingresar las horas correctas")
                                        setError(true)
                                    }else if(miDesde > miHasta){
                                        setEmessage("La hora inicial deber ser menor a la final")
                                        setError(true)
                                    }else if(duracion.getTime() === date.getTime()){
                                        setEmessage("El tiempo promedio de atención es requerido")
                                        setError(true)
                                    }else{
                                        let desde = moment(miDesde).toDate().getHours() +  ":" + moment(miDesde).toDate().getMinutes()
                                        let hasta = moment(miHasta).toDate().getHours() +  ":" + moment(miHasta).toDate().getMinutes()
                                        let duration = moment(duracion).toDate().getHours() +  ":" + moment(duracion).toDate().getMinutes()

                                        setAllHoras({
                                            ...allHoras, 
                                            horasMiercoles: AgendaConfig.getTimes(desde, hasta, duration),
                                        })
                                    }
                                }}><i className="material-icons">save</i> Guardar</button>
                            </div>
                        </div> }
                      </TabPanel>
                      <TabPanel>
                        <div className="row align-items-center mb-4">
                            <div className="col">
                            {agendaLibre ? <div className="row no-gutters align-items-center"> <p className="mb-0 mr-4">Pacientes por día</p> <input type="text" value={allCapacidad.capacidadJueves ? allCapacidad.capacidadJueves : allCapacidad.capacidad } onChange={(e)=>{setAllCapacidad({...allCapacidad, capacidadJueves: e.target.value})}} placeholder="0" className="col-lg-3 px-2 form-control"/> </div> : <p className="mb-0">Pacientes por día {allHoras.horasJueves && allHoras.horasJueves.length}</p> }
                            </div>
                            <div className="col">
                                {allStatus.statusJueves 
                                ? <p onClick={()=>{setAllStatus({...allStatus, statusJueves: !allStatus.statusJueves})}} className="mb-0 agenda-lock-btn">Bloquear día <i className="material-icons mb-0">lock_outline</i></p>
                                : <p onClick={()=>{setAllStatus({...allStatus, statusJueves: !allStatus.statusJueves})}} className="mb-0 agenda-lock-btn">Desbloquear  día <i className="material-icons mb-0">lock_open</i></p>}
                            </div>
                        </div>
                        {!agendaLibre && <div className="row align-items-center">
                            <div className="col">
                                <div className="row align-items-center">
                                    <div className="col">
                                        <p className="mb-0">Desde</p>
                                    </div>
                                    <div className="col">    
                                        <input className='input-hour' style={{ marginLeft: 16, width: 90 }} {...desdeJInputProps} />
                                    </div>
                                </div>
                            </div>
                            <div className="col">
                                <div className="row align-items-center">
                                    <div className="col">
                                        <p className="mb-0">Hasta</p>
                                    </div>
                                    <div className="col">
                                        <input className='input-hour' style={{ marginLeft: 16, width: 90 }} {...hastaJInputProps} />
                                    </div>
                                </div>
                            </div>
                            <div className="col">
                                <button className="btn btn-success" onClick={()=>{
                                    if(jDesde.getTime() === date.getTime() || jHasta.getTime() === date.getTime()){
                                        setEmessage("Debes ingresar las horas correctas")
                                        setError(true)
                                    }else if(jDesde > jHasta){
                                        setEmessage("La hora inicial deber ser menor a la final")
                                        setError(true)
                                    }else if(duracion.getTime() === date.getTime()){
                                        setEmessage("El tiempo promedio de atención es requerido")
                                        setError(true)
                                    }else{
                                        let desde = moment(jDesde).toDate().getHours() +  ":" + moment(jDesde).toDate().getMinutes()
                                        let hasta = moment(jHasta).toDate().getHours() +  ":" + moment(jHasta).toDate().getMinutes()
                                        let duration = moment(duracion).toDate().getHours() +  ":" + moment(duracion).toDate().getMinutes()

                                        setAllHoras({
                                            ...allHoras, 
                                            horasJueves: AgendaConfig.getTimes(desde, hasta, duration),
                                        })
                                    }
                                }}><i className="material-icons">save</i> Guardar</button>
                            </div>
                        </div> }
                      </TabPanel>
                      <TabPanel>
                        <div className="row align-items-center mb-4">
                            <div className="col">
                            {agendaLibre ? <div className="row no-gutters align-items-center"> <p className="mb-0 mr-4">Pacientes por día</p> <input type="text" value={allCapacidad.capacidadViernes ? allCapacidad.capacidadViernes : allCapacidad.capacidad } onChange={(e)=>{setAllCapacidad({...allCapacidad, capacidadViernes: e.target.value})}} placeholder="0" className="col-lg-3 px-2 form-control"/> </div> : <p className="mb-0">Pacientes por día {allHoras.horasViernes && allHoras.horasViernes.length}</p> }
                            </div>
                            <div className="col">
                                {allStatus.statusViernes 
                                ? <p onClick={()=>{setAllStatus({...allStatus, statusViernes: !allStatus.statusViernes})}} className="mb-0 agenda-lock-btn">Bloquear día <i className="material-icons mb-0">lock_outline</i></p>
                                : <p onClick={()=>{setAllStatus({...allStatus, statusViernes: !allStatus.statusViernes})}} className="mb-0 agenda-lock-btn">Desbloquear  día <i className="material-icons mb-0">lock_open</i></p>}
                            </div>
                        </div>
                        { !agendaLibre && <div className="row align-items-center">
                            <div className="col">
                                <div className="row align-items-center">
                                    <div className="col">
                                        <p className="mb-0">Desde</p>
                                    </div>
                                    <div className="col">    
                                        <input className='input-hour' style={{ marginLeft: 16, width: 90 }} {...desdeVInputProps} />
                                    </div>
                                </div>
                            </div>
                            <div className="col">
                                <div className="row align-items-center">
                                    <div className="col">
                                        <p className="mb-0">Hasta</p>
                                    </div>
                                    <div className="col">
                                        <input className='input-hour' style={{ marginLeft: 16, width: 90 }} {...hastaVInputProps} />
                                    </div>
                                </div>
                            </div>
                            <div className="col">
                                <button className="btn btn-success" onClick={()=>{
                                    if(vDesde.getTime() === date.getTime() || vHasta.getTime() === date.getTime()){
                                        setEmessage("Debes ingresar las horas correctas")
                                        setError(true)
                                    }else if(vDesde > vHasta){
                                        setEmessage("La hora inicial deber ser menor a la final")
                                        setError(true)
                                    }else if(duracion.getTime() === date.getTime()){
                                        setEmessage("El tiempo promedio de atención es requerido")
                                        setError(true)
                                    }else{
                                        let desde = moment(vDesde).toDate().getHours() +  ":" + moment(vDesde).toDate().getMinutes()
                                        let hasta = moment(vHasta).toDate().getHours() +  ":" + moment(vHasta).toDate().getMinutes()
                                        let duration = moment(duracion).toDate().getHours() +  ":" + moment(duracion).toDate().getMinutes()

                                        setAllHoras({
                                            ...allHoras, 
                                            horasViernes: AgendaConfig.getTimes(desde, hasta, duration),
                                        })
                                    }
                                }}><i className="material-icons">save</i> Guardar</button>
                            </div>
                        </div> }
                      </TabPanel>
                      <TabPanel>
                        <div className="row align-items-center mb-4">
                            <div className="col">
                            {agendaLibre ? <div className="row no-gutters align-items-center"> <p className="mb-0 mr-4">Pacientes por día</p> <input type="text" value={allCapacidad.capacidadSabado ? allCapacidad.capacidadSabado : allCapacidad.capacidad } onChange={(e)=>{setAllCapacidad({...allCapacidad, capacidadSabado: e.target.value})}} placeholder="0" className="col-lg-3 px-2 form-control"/> </div> : <p className="mb-0">Pacientes por día {allHoras.horasSabado && allHoras.horasSabado.length}</p> }
                            </div>
                            <div className="col">
                                {allStatus.statusSabado 
                                ? <p onClick={()=>{setAllStatus({...allStatus, statusSabado: !allStatus.statusSabado})}} className="mb-0 agenda-lock-btn">Bloquear día <i className="material-icons mb-0">lock_outline</i></p>
                                : <p onClick={()=>{setAllStatus({...allStatus, statusSabado: !allStatus.statusSabado})}} className="mb-0 agenda-lock-btn">Desbloquear  día <i className="material-icons mb-0">lock_open</i></p>}
                            </div>
                        </div>
                        { !agendaLibre && <div className="row align-items-center">
                            <div className="col">
                                <div className="row align-items-center">
                                    <div className="col">
                                        <p className="mb-0">Desde</p>
                                    </div>
                                    <div className="col">    
                                        <input className='input-hour' style={{ marginLeft: 16, width: 90 }} {...desdeSInputProps} />
                                    </div>
                                </div>
                            </div>
                            <div className="col">
                                <div className="row align-items-center">
                                    <div className="col">
                                        <p className="mb-0">Hasta</p>
                                    </div>
                                    <div className="col">
                                        <input className='input-hour' style={{ marginLeft: 16, width: 90 }} {...hastaSInputProps} />
                                    </div>
                                </div>
                            </div>
                            <div className="col">
                                <button className="btn btn-success" onClick={()=>{
                                    if(sDesde.getTime() === date.getTime() || sHasta.getTime() === date.getTime()){
                                        setEmessage("Debes ingresar las horas correctas")
                                        setError(true)
                                    }else if(sDesde > sHasta){
                                        setEmessage("La hora inicial deber ser menor a la final")
                                        setError(true)
                                    }else if(duracion.getTime() === date.getTime()){
                                        setEmessage("El tiempo promedio de atención es requerido")
                                        setError(true)
                                    }else{
                                        let desde = moment(sDesde).toDate().getHours() +  ":" + moment(sDesde).toDate().getMinutes()
                                        let hasta = moment(sHasta).toDate().getHours() +  ":" + moment(sHasta).toDate().getMinutes()
                                        let duration = moment(duracion).toDate().getHours() +  ":" + moment(duracion).toDate().getMinutes()

                                        setAllHoras({
                                            ...allHoras, 
                                            horasSabado: AgendaConfig.getTimes(desde, hasta, duration),
                                        })
                                    }
                                }}><i className="material-icons">save</i> Guardar</button>
                            </div>
                        </div> }
                      </TabPanel>
                      <TabPanel>
                        <div className="row align-items-center mb-4">
                            <div className="col">
                            {agendaLibre ? <div className="row no-gutters align-items-center"> <p className="mb-0 mr-4">Pacientes por día</p> <input type="text" value={allCapacidad.capacidadDomingo ? allCapacidad.capacidadDomingo : allCapacidad.capacidad }  onChange={(e)=>{setAllCapacidad({...allCapacidad, capacidadDomingo: e.target.value})}} placeholder="0" className="col-lg-3 px-2 form-control"/> </div> : <p className="mb-0">Pacientes por día {allHoras.horasDomingo && allHoras.horasDomingo.length}</p> }
                            </div>
                            <div className="col">
                                {allStatus.statusDomingo 
                                ? <p onClick={()=>{setAllStatus({...allStatus, statusDomingo: !allStatus.statusDomingo})}} className="mb-0 agenda-lock-btn">Bloquear día <i className="material-icons mb-0">lock_outline</i></p>
                                : <p onClick={()=>{setAllStatus({...allStatus, statusDomingo: !allStatus.statusDomingo})}} className="mb-0 agenda-lock-btn">Desbloquear  día <i className="material-icons mb-0">lock_open</i></p>}
                            </div>
                        </div>
                        { !agendaLibre && <div className="row align-items-center">
                            <div className="col">
                                <div className="row align-items-center">
                                    <div className="col">
                                        <p className="mb-0">Desde</p>
                                    </div>
                                    <div className="col">    
                                        <input className='input-hour' style={{ marginLeft: 16, width: 90 }} {...desdeDInputProps} />
                                    </div>
                                </div>
                            </div>
                            <div className="col">
                                <div className="row align-items-center">
                                    <div className="col">
                                        <p className="mb-0">Hasta</p>
                                    </div>
                                    <div className="col">
                                        <input className='input-hour' style={{ marginLeft: 16, width: 90 }} {...hastaDInputProps} />
                                    </div>
                                </div>
                            </div>
                            <div className="col">
                                <button className="btn btn-success" onClick={()=>{
                                    if(dDesde.getTime() === date.getTime() || dHasta.getTime() === date.getTime()){
                                        setEmessage("Debes ingresar las horas correctas")
                                        setError(true)
                                    }else if(dDesde > dHasta){
                                        setEmessage("La hora inicial deber ser menor a la final")
                                        setError(true)
                                    }else if(duracion.getTime() === date.getTime()){
                                        setEmessage("El tiempo promedio de atención es requerido")
                                        setError(true)
                                    }else{
                                        let desde = moment(dDesde).toDate().getHours() +  ":" + moment(dDesde).toDate().getMinutes()
                                        let hasta = moment(dHasta).toDate().getHours() +  ":" + moment(dHasta).toDate().getMinutes()
                                        let duration = moment(duracion).toDate().getHours() +  ":" + moment(duracion).toDate().getMinutes()

                                        setAllHoras({
                                            ...allHoras, 
                                            horasDomingo: AgendaConfig.getTimes(desde, hasta, duration),
                                        })
                                    }
                                }}><i className="material-icons">save</i> Guardar</button>
                            </div>
                        </div> }
                      </TabPanel>
                    </Tabs>
                    </div>
                    </div>
                    {agendaEspacios && allHoras.horas.length > 0 || agendaLibre && allCapacidad.capacidad > 0
                    ? <button className="my-3 btn btn-success" onClick={()=>{uploadAgenda()}}>Crear agenda</button>
                    : <div></div>
                    }
                </div>
                { !agendaLibre && <div className="col-lg-4 col-md-4 col-sm-12">
                    <div className="sticky-position">
                        <p>Este sería tu promedio de pacientes por atender al día</p>
                        <div className="row">
                            {allHoras.horas.map(hora => (
                                <p className="col hour-pill" key={hora}>{hora}</p>
                            ))}
                        </div>
                    </div>
                </div> }
            </div>
          </div>
        </MuiPickersUtilsProvider>
    )

    async function uploadAgenda(){
        const dates = AgendaConfig.getDates()
        if(data.state.all){
            let tipos = [];
            await firebase.db.collection("Localidades")
            .where("aliadoId", "==", user.aliadoId).get().then(val=>{
              val.docs.forEach(item=>{
                tipos.push(item.data().localidadId)
              })
            }).then(val=>{
                agendaLibre ? allFree(tipos, dates) : allSlots(tipos, dates)
                history.push({
                    pathname: "/configuration/services"
                })
            })
        }else if(data.state.noPrincipal){
            agendaLibre ? allFree(data.state.listLocalidades, dates) : allSlots(data.state.listLocalidades, dates)
            history.push({
                pathname: "/configuration/services"
            })
        }else{
            agendaLibre ? free(dates, data.state.localidadId) : slots(dates, data.state.localidadId)
            history.push({
                pathname: "/configuration/services"
            })
        }
    }

    async function allSlots(localidadesId, dates){
        localidadesId.forEach(localidadesId => {
            firebase.db.collection("Localidades").doc(localidadesId).collection("Servicios").doc(data.state.serviceId).update({
                agendaContiene: true,
                tipoAgenda: "Slots",
                cantidadDias: dates.length,
            })
            for(let i = 0; i < dates.length; i++){
                if(dates[i].includes(weekDays[0]) && allStatus.statusLunes){
                    slotUpCode(dates[i], allHoras.horasLunes, localidadesId, moment(dates[i], 'ddd, MMM D YYYY').toDate())
                }else if(dates[i].includes(weekDays[1]) && allStatus.statusMartes){
                    slotUpCode(dates[i], allHoras.horasMartes, localidadesId, moment(dates[i], 'ddd, MMM D YYYY').toDate())
                }else if(dates[i].includes(weekDays[2]) && allStatus.statusMiercoles){
                    slotUpCode(dates[i], allHoras.horasMiercoles, localidadesId, moment(dates[i], 'ddd, MMM D YYYY').toDate())
                }else if(dates[i].includes(weekDays[3]) && allStatus.statusJueves){
                    slotUpCode(dates[i], allHoras.horasJueves, localidadesId, moment(dates[i], 'ddd, MMM D YYYY').toDate())
                }else if(dates[i].includes(weekDays[4]) && allStatus.statusViernes){
                    slotUpCode(dates[i], allHoras.horasViernes, localidadesId, moment(dates[i], 'ddd, MMM D YYYY').toDate())
                }else if(dates[i].includes(weekDays[5]) && allStatus.statusSabado){
                    slotUpCode(dates[i], allHoras.horasSabado, localidadesId, moment(dates[i], 'ddd, MMM D YYYY').toDate())
                }else if(dates[i].includes(weekDays[6]) && allStatus.statusDomingo){
                    slotUpCode(dates[i], allHoras.horasDomingo, localidadesId, moment(dates[i], 'ddd, MMM D YYYY').toDate())
                }
            }
        })
    }
    
    async function slots(dates, localidadId){

        await firebase.db.collection("Localidades").doc(localidadId).collection("Servicios").doc(data.state.serviceId).update({
            agendaContiene: true,
            tipoAgenda: "Slots",
            cantidadDias: dates.length,
        })

        for(let i = 0; i < dates.length; i++){
            if(dates[i].includes(weekDays[0]) && allStatus.statusLunes){
                slotUpCode(dates[i], allHoras.horasLunes, localidadId, moment(dates[i], 'ddd, MMM D YYYY').toDate())
            }else if(dates[i].includes(weekDays[1]) && allStatus.statusMartes){
                slotUpCode(dates[i], allHoras.horasMartes, localidadId, moment(dates[i], 'ddd, MMM D YYYY').toDate())
            }else if(dates[i].includes(weekDays[2]) && allStatus.statusMiercoles){
                slotUpCode(dates[i], allHoras.horasMiercoles, localidadId, moment(dates[i], 'ddd, MMM D YYYY').toDate())
            }else if(dates[i].includes(weekDays[3]) && allStatus.statusJueves){
                slotUpCode(dates[i], allHoras.horasJueves, localidadId, moment(dates[i], 'ddd, MMM D YYYY').toDate())
            }else if(dates[i].includes(weekDays[4]) && allStatus.statusViernes){
                slotUpCode(dates[i], allHoras.horasViernes, localidadId, moment(dates[i], 'ddd, MMM D YYYY').toDate())
            }else if(dates[i].includes(weekDays[5]) && allStatus.statusSabado){
                slotUpCode(dates[i], allHoras.horasSabado, localidadId, moment(dates[i], 'ddd, MMM D YYYY').toDate())
            }else if(dates[i].includes(weekDays[6]) && allStatus.statusDomingo){
                slotUpCode(dates[i], allHoras.horasDomingo, localidadId, moment(dates[i], 'ddd, MMM D YYYY').toDate())
            }
        }
    }
    
    async function allFree(localidadesId, dates){
        localidadesId.forEach(localidadesId => {
            firebase.db.collection("Localidades").doc(localidadesId).collection("Servicios").doc(data.state.serviceId).update({
                agendaContiene: true,
                tipoAgenda: "Free",
                cantidadDias: dates.length,
            })
            for(let i = 0; i < dates.length; i++){
                if(dates[i].includes(weekDays[0]) && allStatus.statusLunes){
                    freeUpCode(dates[i], allCapacidad.capacidadLunes ? allCapacidad.capacidadLunes : allCapacidad.capacidad, localidadesId, moment(dates[i], 'ddd, MMM D YYYY').toDate())
                }else if(dates[i].includes(weekDays[1]) && allStatus.statusMartes){
                    freeUpCode(dates[i], allCapacidad.capacidadMartes ? allCapacidad.capacidadMartes : allCapacidad.capacidad, localidadesId, moment(dates[i], 'ddd, MMM D YYYY').toDate())
                }else if(dates[i].includes(weekDays[2]) && allStatus.statusMiercoles){
                    freeUpCode(dates[i], allCapacidad.capacidadMiercoles ? allCapacidad.capacidadMiercoles : allCapacidad.capacidad, localidadesId, moment(dates[i], 'ddd, MMM D YYYY').toDate())
                }else if(dates[i].includes(weekDays[3]) && allStatus.statusJueves){
                    freeUpCode(dates[i], allCapacidad.capacidadJueves ? allCapacidad.capacidadJueves : allCapacidad.capacidad, localidadesId, moment(dates[i], 'ddd, MMM D YYYY').toDate())
                }else if(dates[i].includes(weekDays[4]) && allStatus.statusViernes){
                    freeUpCode(dates[i], allCapacidad.capacidadViernes ? allCapacidad.capacidadViernes : allCapacidad.capacidad, localidadesId, moment(dates[i], 'ddd, MMM D YYYY').toDate())
                }else if(dates[i].includes(weekDays[5]) && allStatus.statusSabado){
                    freeUpCode(dates[i], allCapacidad.capacidadSabado ? allCapacidad.capacidadSabado : allCapacidad.capacidad, localidadesId, moment(dates[i], 'ddd, MMM D YYYY').toDate())
                }else if(dates[i].includes(weekDays[6]) && allStatus.statusDomingo){
                    freeUpCode(dates[i], allCapacidad.capacidadDomingo ? allCapacidad.capacidadDomingo : allCapacidad.capacidad, localidadesId, moment(dates[i], 'ddd, MMM D YYYY').toDate())
                }
            }
        })
    }
    
    async function free(dates, localidadId){
        await firebase.db.collection("Localidades").doc(localidadId).collection("Servicios").doc(data.state.serviceId).update({
            agendaContiene: true,
            tipoAgenda: "Free",
            cantidadDias: dates.length,
        })

        for(let i = 0; i < dates.length; i++){
            if(dates[i].includes(weekDays[0]) && allStatus.statusLunes){
                freeUpCode(dates[i], allCapacidad.capacidadLunes ? allCapacidad.capacidadLunes : allCapacidad.capacidad, localidadId, moment(dates[i], 'ddd, MMM D YYYY').toDate())
            }else if(dates[i].includes(weekDays[1]) && allStatus.statusMartes){
                freeUpCode(dates[i], allCapacidad.capacidadMartes ? allCapacidad.capacidadMartes : allCapacidad.capacidad, localidadId, moment(dates[i], 'ddd, MMM D YYYY').toDate())
            }else if(dates[i].includes(weekDays[2]) && allStatus.statusMiercoles){
                freeUpCode(dates[i], allCapacidad.capacidadMiercoles ? allCapacidad.capacidadMiercoles : allCapacidad.capacidad, localidadId, moment(dates[i], 'ddd, MMM D YYYY').toDate())
            }else if(dates[i].includes(weekDays[3]) && allStatus.statusJueves){
                freeUpCode(dates[i], allCapacidad.capacidadJueves ? allCapacidad.capacidadJueves : allCapacidad.capacidad, localidadId, moment(dates[i], 'ddd, MMM D YYYY').toDate())
            }else if(dates[i].includes(weekDays[4]) && allStatus.statusViernes){
                freeUpCode(dates[i], allCapacidad.capacidadViernes ? allCapacidad.capacidadViernes : allCapacidad.capacidad, localidadId, moment(dates[i], 'ddd, MMM D YYYY').toDate())
            }else if(dates[i].includes(weekDays[5]) && allStatus.statusSabado){
                freeUpCode(dates[i], allCapacidad.capacidadSabado ? allCapacidad.capacidadSabado : allCapacidad.capacidad, localidadId, moment(dates[i], 'ddd, MMM D YYYY').toDate())
            }else if(dates[i].includes(weekDays[6]) && allStatus.statusDomingo){
                freeUpCode(dates[i], allCapacidad.capacidadDomingo ? allCapacidad.capacidadDomingo : allCapacidad.capacidad, localidadId, moment(dates[i], 'ddd, MMM D YYYY').toDate())
            }
        }
    }

    async function slotUpCode(fecha, horasList, localidadId, date){
        await firebase.db.collection("Localidades").doc(localidadId)
        .collection('Servicios').doc(data.state.serviceId).collection("Agenda").doc(fecha).set({
          bloqueado: false,
          agendaId: firebase.db.collection("Localidades").doc(localidadId).collection('Servicios').doc(data.state.serviceId).collection("Agenda").doc().id,
          servicioId: data.state.serviceId,
          fecha: fecha,
          date: date,
          horasDia: horasList, 
          capacidadDia: 0,
          createdOn: moment().toDate(),
        });
    }
    
    async function freeUpCode(fecha, capacidadDia, localidadId, date){
        await firebase.db.collection("Localidades").doc(localidadId).collection('Servicios').doc(data.state.serviceId).collection("Agenda").doc(fecha).set({
          bloqueado: false,
          agendaId: firebase.db.collection("Localidades").doc(localidadId).collection('Servicios').doc(data.state.serviceId).collection("Agenda").doc().id,
          servicioId: data.state.serviceId,
          fecha: fecha,
          date: date,
          horasDia: [], 
          capacidadDia: capacidadDia,
          createdOn: moment().toDate(),
        });
    }
    
}

export default AgendaServiceCreation