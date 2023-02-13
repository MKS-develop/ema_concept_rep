import React, {useState, useEffect} from 'react'
import firebase from '../firebase/config'
import moment from 'moment';
import { useDateInput } from 'react-nice-dates'
import { es } from 'date-fns/locale'
import 'react-nice-dates/build/style.css'
import AgendaConfig from '././AgendaConfig';

function Prueba(){
  
  const [user, setUser] = useState({})

  const [descansoDesde, setDescansoDesde] = useState(new Date(2021,6,28,0,0,0))
  const [descansoHasta, setDescansoHasta] = useState(new Date(2021,6,28,0,0,0))

  const date = new Date(2021,6,28,0,0,0)
  const [duracion, setDuracion] = useState(new Date(2021,6,28,0,0,0))
  const [aDesde, setADesde] = useState(new Date(2021,6,28,0,0,0))
  const [aHasta, setAHasta] = useState(new Date(2021,6,28,0,0,0))

  const [fh, setFH] = useState(0)
  
  const [hourBlocked, setHourBlocked] = useState([])
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

  const [error, setError] = useState(false)
  const [agendaLibre, setAgendaLibre] = useState(false)

  let [steps, setSteps] = useState([
    false,
    false,
    false,
    false,
  ])

  const [agendaEspacios, setAgendaEspacios] = useState(true)
  const [emessage, setEmessage] = useState("")
  const [desdea, setDesdea] = useState("")
  const [hastaa, setHastaa] = useState("")

  function changeActiveStep(status, i){
    let newArr = [...steps];
    newArr[i] = !status;
    setSteps(newArr);
  }

  const durationInputProps = useDateInput({ date: duracion, format: 'HH:mm', locale: es, onDateChange: setDuracion })
  const desdeInputProps = useDateInput({ date: aDesde, format: 'HH:mm', locale: es, onDateChange: setADesde })
  const hastaInputProps = useDateInput({ date: aHasta, format: 'HH:mm', locale: es, onDateChange: setAHasta })
  const desdeDescansoInputProps = useDateInput({ date: descansoDesde, format: 'HH:mm', locale: es, onDateChange: setDescansoDesde })
  const hastaDescansoInputProps = useDateInput({ date: descansoHasta, format: 'HH:mm', locale: es, onDateChange: setDescansoHasta })

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
    });
  }, [])

  return (
    <div className="main-content-container">
      <div className="row no-gutters">
        <div className="col-lg-6">
          <div className={`step-container active`}>
            <div className="step-container-header">
                <div className="step-number">2</div>
                <p className="step-text">Ingresa el tiempo promedio de duración del servicio</p>
            </div>
            
            <div className="row align-items-center justify-content-spacebetween no-gutters mt-3">
              <input className='input-hour' style={{ marginLeft: 16, width: 90 }} {...durationInputProps} />
            </div>
            <div className="mt-3">
                <div onClick={()=> { changeActiveStep(steps[1], 1) }} className="btn btn-primary cursor-pointer">
                    Continuar
                </div>
            </div>
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

                            setAllHoras({
                                ...allHoras, 
                                horas: AgendaConfig.getTimes(desde, hasta, duration),
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
        </div>
        <div className="col-lg-6">
          <div className="row">
            {allHoras.horas.map(hora => (
              <p onClick={()=>{ hourBlocked.includes(hora, 0) ? removeHour(hora, "DELETE") : removeHour(hora, "ADD") }} className={`col ${hourBlocked.includes(hora, 0) ? "hour-pill-blocked" : "hour-pill"}`} key={hora}>{hora}</p>
            ))}
          </div>
          {/* <div onClick={()=>{ deleteHoursFromAgenda() }} className="btn btn-primary">Eliminar</div> */}
        </div>
      </div>
    </div>
  )

  function removeHour(h, type){
    let listOfHours = hourBlocked
    switch (type) {
      case "ADD":
        listOfHours = [...listOfHours, h]
        break;
      case "DELETE":
        listOfHours = listOfHours.filter((prv)=>( prv !== h ))
        break;
      default:
        break;
    }
    setHourBlocked(listOfHours)
  }

    async function deleteHoursFromAgenda(){
        await firebase.db.collection("Localidades").doc("GkeTuGMJrKSApt8F8qEb").collection("Servicios").doc("TA1x11RLknWOjoPQjU7f").collection("Agenda").get().then((value)=>{
            value.docs.forEach(async(doc)=>{

                let newHours = [...doc.data()["horasDia"]]
                newHours = newHours.filter((prv)=>( prv !== "17:00" ))

                await doc.ref.update({
                    horasDia: newHours
                })

            })
        })
    }

    
}
export default Prueba
