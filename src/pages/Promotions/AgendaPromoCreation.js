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

function AgendaPromoCreation() {
    const [btnMessage, setBtnMessage] = useState("Crear servicio");
    let data = useLocation();
    let history = useHistory()
    const [error, setError] = useState(false)
    const [emessage, setEmessage] = useState("")
    const [desdea, setDesdea] = useState("")
    const [hastaa, setHastaa] = useState("")
    const [fh, setFH] = useState(0)
    const [user, setUser] = useState({})
    let weekDays = ["lun", "mar", "mié", "jue", "vie", "sáb", "dom"];

    const [desansoDesde, setDescansoDesde] = useState(null)
    const [desansoHasta, setDescansoHasta] = useState(null)
    
    const [aDesde, setADesde] = useState(null)
    const [aHasta, setAHasta] = useState(null)
    const [lDesde, setLDesde] = useState(null)
    const [lHasta, setLHasta] = useState(null)
    const [maDesde, setMaDesde] = useState(null)
    const [maHasta, setMaHasta] = useState(null)
    const [miDesde, setMiDesde] = useState(null)
    const [miHasta, setMiHasta] = useState(null)
    const [jDesde, setJDesde] = useState(null)
    const [jHasta, setJHasta] = useState(null)
    const [vDesde, setVDesde] = useState(null)
    const [vHasta, setVHasta] = useState(null)
    const [sDesde, setSDesde] = useState(null)
    const [sHasta, setSHasta] = useState(null)
    const [dDesde, setDDesde] = useState(null)
    const [dHasta, setDHasta] = useState(null)
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

    useEffect(() => {
        if(data.state === undefined || data.state === null){
          window.location.href = "/promotions"
        }
      firebase.getCurrentUser().then((val)=>{
        setUser(val)
      })
    }, [])

    return (
        <MuiPickersUtilsProvider utils={MomentUtils}>
        <div className="main-content-container container-fluid px-4">
            {error 
            ? <div className="alert alert-danger alert-dismissible fade show mb-0 mt-2" role="alert">
                    <button onClick={()=>{setError(false)}} className="close" data-dismiss="alert" aria-label="Close">
                    <span aria-hidden="true">×</span>
                    </button>
                    <i className="fa fa-exclamation-triangle mx-2"></i>
                    <strong>Cuidado!</strong> {emessage}
                </div>
            : <div></div>
            }
            <div className="page-header align-items-center justify-content-spacebetween row no-gutters py-2 px-4 my-4">
              <div className="col-12 col-sm-5 text-center text-sm-left mb-0">
                <div className="row align-items-center">
                  <div className="col">
                    <p className="page-title">Creación de la agenda</p>
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
                <div className="agenda-container">
                    <p className="mb-2 agenda-title">Horario de atención</p>
                    <div className="row align-items-center">
                        <div className="col">
                            <div className="row">
                                <div className="col">
                                    <p className="mb-0">Desde</p>
                                </div>
                                <div className="col">    
                                    <TimePicker clearable placeholder="00:00" ampm={false} label="" value={aDesde} onChange={setADesde}/>
                                </div>
                            </div>
                        </div>
                        <div className="col">
                            <div className="row">
                                <div className="col">
                                    <p className="mb-0">Hasta</p>
                                </div>
                                <div className="col">
                                    <TimePicker placeholder="00:00" clearable ampm={false} label="" value={aHasta} onChange={setAHasta}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="col">
                            <button className="btn btn-success" onClick={()=>{
                                if(aDesde === null || aHasta === null){
                                    setEmessage("Debes ingresar las horas correctas")
                                    setError(true)
                                }else if(aDesde > aHasta){
                                    setEmessage("La hora inicial deber ser menor a la final")
                                    setError(true)
                                }else{
                                    let desde = moment(aDesde).toDate().getHours() +  ":" + moment(aDesde).toDate().getMinutes()
                                    let hasta = moment(aHasta).toDate().getHours() +  ":" + moment(aHasta).toDate().getMinutes()
                                    setDesdea(desde)
                                    setHastaa(hasta)
                                    setAllHoras({
                                        ...allHoras, 
                                        horas: AgendaConfig.getTimes(desde, hasta),
                                        horasLunes: AgendaConfig.getTimes(desde, hasta),
                                        horasMartes: AgendaConfig.getTimes(desde, hasta),
                                        horasMiercoles: AgendaConfig.getTimes(desde, hasta),
                                        horasJueves: AgendaConfig.getTimes(desde, hasta),
                                        horasViernes: AgendaConfig.getTimes(desde, hasta),
                                        horasSabado: AgendaConfig.getTimes(desde, hasta),
                                        horasDomingo: AgendaConfig.getTimes(desde, hasta),
                                    })
                                }
                            }}><i className="material-icons">save</i> Guardar</button>
                        </div>
                    </div>
                </div>
                <div className="agenda-container">
                    <p className="mb-2 agenda-title">Horario de descanso</p>
                    <div className="row align-items-center">
                        <div className="col">
                            <div className="row">
                                <div className="col">
                                    <p className="mb-0">Desde</p>
                                </div>
                                <div className="col">    
                                    <TimePicker
                                    clearable
                                    placeholder={"00:00"}
                                    ampm={false}
                                    label=""
                                    value={desansoDesde}
                                    onChange={setDescansoDesde}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="col">
                            <div className="row">
                                <div className="col">
                                    <p className="mb-0">Hasta</p>
                                </div>
                                <div className="col">
                                    <TimePicker
                                    clearable
                                    placeholder={"00:00"}
                                    ampm={false}
                                    label=""
                                    value={desansoHasta}
                                    onChange={setDescansoHasta}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="col">
                            <button className="btn btn-success" onClick={()=>{
                                if(desansoDesde === null || desansoHasta === null){
                                    setEmessage("Debes ingresar las horas correctas")
                                    setError(true)
                                }else if(desansoDesde > desansoHasta){
                                    setEmessage("La hora inicial deber ser menor a la final")
                                    setError(true)
                                }else if(fh === allHoras.horas.length){
                                    setEmessage("Horario de descanso implementado, intenta ingresar un nuevo horario de atención")
                                    setError(true)
                                }else{
                                    let desde = moment(desansoDesde).toDate().getHours() +  ":" + (moment(desansoDesde).toDate().getMinutes() === 0 ? moment(desansoDesde).toDate().getMinutes() + "0" : moment(desansoDesde).toDate().getMinutes() )
                                    let hasta = moment(desansoHasta).toDate().getHours() +  ":" + (moment(desansoHasta).toDate().getMinutes() === 0 ? moment(desansoHasta).toDate().getMinutes() + "0" : moment(desansoHasta).toDate().getMinutes() )
                                    setAllHoras({
                                        ...allHoras, 
                                        horas: AgendaConfig.restHoursFrom(allHoras.horas, desde, hasta),
                                        horasLunes: AgendaConfig.restHoursFrom(allHoras.horasLunes, desde, hasta),
                                        horasMartes: AgendaConfig.restHoursFrom(allHoras.horasMartes, desde, hasta),
                                        horasMiercoles: AgendaConfig.restHoursFrom(allHoras.horasMiercoles, desde, hasta),
                                        horasJueves: AgendaConfig.restHoursFrom(allHoras.horasJueves, desde, hasta),
                                        horasViernes: AgendaConfig.restHoursFrom(allHoras.horasViernes, desde, hasta),
                                        horasSabado: AgendaConfig.restHoursFrom(allHoras.horasSabado, desde, hasta),
                                        horasDomingo: AgendaConfig.restHoursFrom(allHoras.horasDomingo, desde, hasta),
                                    })
                                    setFH(allHoras.horas.length)
                                    console.log("Cantidad de horas: " + allHoras.horas.length)
                                }
                            }}><i className="material-icons">save</i> Guardar</button>
                        </div>
                    </div>
                </div>
                    <Tabs>
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

                      <TabPanel>
                        <div className="row">
                            <div className="col">
                                <p>Clientes por día {allHoras.horasLunes.length}</p>
                            </div>
                            <div className="col">
                                {allStatus.statusLunes 
                                ? <p onClick={()=>{setAllStatus({...allStatus, statusLunes: !allStatus.statusLunes})}} className="mb-0 agenda-lock-btn">Bloquear día <i className="material-icons mb-0">lock_outline</i></p>
                                : <p onClick={()=>{setAllStatus({...allStatus, statusLunes: !allStatus.statusLunes})}} className="mb-0 agenda-lock-btn">Desbloquear  día <i className="material-icons mb-0">lock_open</i></p>}
                            </div>
                        </div>
                        <div className="row align-items-center">
                            <div className="col">
                                <div className="row">
                                    <div className="col">
                                        <p className="mb-0">Desde</p>
                                    </div>
                                    <div className="col">    
                                        <TimePicker
                                        clearable
                                        placeholder={desdea === "" ? "00:00" : desdea}
                                        ampm={false}
                                        label=""
                                        value={lDesde}
                                        onChange={setLDesde}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="col">
                                <div className="row">
                                    <div className="col">
                                        <p className="mb-0">Hasta</p>
                                    </div>
                                    <div className="col">
                                        <TimePicker
                                        clearable
                                        placeholder={hastaa === "" ? "00:00" : hastaa}
                                        ampm={false}
                                        label=""
                                        value={lHasta}
                                        onChange={setLHasta}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="col">
                                <button className="btn btn-success" onClick={()=>{
                                    if(lDesde === null || lHasta === null){
                                        setEmessage("Debes ingresar las horas correctas")
                                        setError(true)
                                    }else if(lDesde > lHasta){
                                        setEmessage("La hora inicial deber ser menor a la final")
                                        setError(true)
                                    }else{
                                        let desde = moment(lDesde).toDate().getHours() +  ":" + moment(lDesde).toDate().getMinutes()
                                        let hasta = moment(lHasta).toDate().getHours() +  ":" + moment(lHasta).toDate().getMinutes()                                
                                        setAllHoras({
                                            ...allHoras, 
                                            horasLunes: AgendaConfig.getTimes(desde, hasta),
                                        })
                                    }
                                }}><i className="material-icons">save</i> Guardar</button>
                            </div>
                        </div>
                      </TabPanel>
                      <TabPanel>
                        <div className="row">
                            <div className="col">
                                <p>Clientes por día {allHoras.horasMartes.length}</p>
                            </div>
                            <div className="col">
                                {allStatus.statusMartes 
                                ? <p onClick={()=>{setAllStatus({...allStatus, statusMartes: !allStatus.statusMartes})}} className="mb-0 agenda-lock-btn">Bloquear día <i className="material-icons mb-0">lock_outline</i></p>
                                : <p onClick={()=>{setAllStatus({...allStatus, statusMartes: !allStatus.statusMartes})}} className="mb-0 agenda-lock-btn">Desbloquear  día <i className="material-icons mb-0">lock_open</i></p>}
                            </div>
                        </div>
                        <div className="row align-items-center">
                            <div className="col">
                                <div className="row">
                                    <div className="col">
                                        <p className="mb-0">Desde</p>
                                    </div>
                                    <div className="col">    
                                        <TimePicker
                                        clearable
                                        placeholder={desdea === "" ? "00:00" : desdea}
                                        ampm={false}
                                        label=""
                                        value={maDesde}
                                        onChange={setMaDesde}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="col">
                                <div className="row">
                                    <div className="col">
                                        <p className="mb-0">Hasta</p>
                                    </div>
                                    <div className="col">
                                        <TimePicker
                                        clearable
                                        placeholder={hastaa === "" ? "00:00" : hastaa}
                                        ampm={false}
                                        label=""
                                        value={maHasta}
                                        onChange={setMaHasta}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="col">
                                <button className="btn btn-success" onClick={()=>{
                                    if(maDesde === null || maHasta === null){
                                        setEmessage("Debes ingresar las horas correctas")
                                        setError(true)
                                    }else if(maDesde > maHasta){
                                        setEmessage("La hora inicial deber ser menor a la final")
                                        setError(true)
                                    }else{
                                        let desde = moment(maDesde).toDate().getHours() +  ":" + moment(maDesde).toDate().getMinutes()
                                        let hasta = moment(maHasta).toDate().getHours() +  ":" + moment(maHasta).toDate().getMinutes()                                
                                        setAllHoras({
                                            ...allHoras, 
                                            horasMartes: AgendaConfig.getTimes(desde, hasta),
                                        })
                                    }
                                }}><i className="material-icons">save</i> Guardar</button>
                            </div>
                        </div>
                      </TabPanel>
                      <TabPanel>
                      <div className="row">
                            <div className="col">
                                <p>Clientes por día {allHoras.horasMiercoles.length}</p>
                            </div>
                            <div className="col">
                                {allStatus.statusMiercoles 
                                ? <p onClick={()=>{setAllStatus({...allStatus, statusMiercoles: !allStatus.statusMiercoles})}} className="mb-0 agenda-lock-btn">Bloquear día <i className="material-icons mb-0">lock_outline</i></p>
                                : <p onClick={()=>{setAllStatus({...allStatus, statusMiercoles: !allStatus.statusMiercoles})}} className="mb-0 agenda-lock-btn">Desbloquear  día <i className="material-icons mb-0">lock_open</i></p>}
                            </div>
                        </div>
                        <div className="row align-items-center">
                            <div className="col">
                                <div className="row">
                                    <div className="col">
                                        <p className="mb-0">Desde</p>
                                    </div>
                                    <div className="col">    
                                        <TimePicker
                                        clearable
                                        placeholder={desdea === "" ? "00:00" : desdea}
                                        ampm={false}
                                        label=""
                                        value={miDesde}
                                        onChange={setMiDesde}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="col">
                                <div className="row">
                                    <div className="col">
                                        <p className="mb-0">Hasta</p>
                                    </div>
                                    <div className="col">
                                        <TimePicker
                                        clearable
                                        placeholder={hastaa === "" ? "00:00" : hastaa}
                                        ampm={false}
                                        label=""
                                        value={miHasta}
                                        onChange={setMiHasta}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="col">
                                <button className="btn btn-success" onClick={()=>{
                                    if(miDesde === null || miHasta === null){
                                        setEmessage("Debes ingresar las horas correctas")
                                        setError(true)
                                    }else if(miDesde > miHasta){
                                        setEmessage("La hora inicial deber ser menor a la final")
                                        setError(true)
                                    }else{
                                        let desde = moment(miDesde).toDate().getHours() +  ":" + moment(miDesde).toDate().getMinutes()
                                        let hasta = moment(miHasta).toDate().getHours() +  ":" + moment(miHasta).toDate().getMinutes()                                
                                        setAllHoras({
                                            ...allHoras, 
                                            horasMiercoles: AgendaConfig.getTimes(desde, hasta),
                                        })
                                    }
                                }}><i className="material-icons">save</i> Guardar</button>
                            </div>
                        </div>
                      </TabPanel>
                      <TabPanel>
                        <div className="row">
                            <div className="col">
                                <p>Clientes por día {allHoras.horasJueves.length}</p>
                            </div>
                            <div className="col">
                                {allStatus.statusJueves 
                                ? <p onClick={()=>{setAllStatus({...allStatus, statusJueves: !allStatus.statusJueves})}} className="mb-0 agenda-lock-btn">Bloquear día <i className="material-icons mb-0">lock_outline</i></p>
                                : <p onClick={()=>{setAllStatus({...allStatus, statusJueves: !allStatus.statusJueves})}} className="mb-0 agenda-lock-btn">Desbloquear  día <i className="material-icons mb-0">lock_open</i></p>}
                            </div>
                        </div>
                        <div className="row align-items-center">
                            <div className="col">
                                <div className="row">
                                    <div className="col">
                                        <p className="mb-0">Desde</p>
                                    </div>
                                    <div className="col">    
                                        <TimePicker
                                        clearable
                                        placeholder={desdea === "" ? "00:00" : desdea}
                                        ampm={false}
                                        label=""
                                        value={jDesde}
                                        onChange={setJDesde}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="col">
                                <div className="row">
                                    <div className="col">
                                        <p className="mb-0">Hasta</p>
                                    </div>
                                    <div className="col">
                                        <TimePicker
                                        clearable
                                        placeholder={hastaa === "" ? "00:00" : hastaa}
                                        ampm={false}
                                        label=""
                                        value={jHasta}
                                        onChange={setJHasta}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="col">
                                <button className="btn btn-success" onClick={()=>{
                                    if(jDesde === null || jHasta === null){
                                        setEmessage("Debes ingresar las horas correctas")
                                        setError(true)
                                    }else if(jDesde > jHasta){
                                        setEmessage("La hora inicial deber ser menor a la final")
                                        setError(true)
                                    }else{
                                        let desde = moment(jDesde).toDate().getHours() +  ":" + moment(jDesde).toDate().getMinutes()
                                        let hasta = moment(jHasta).toDate().getHours() +  ":" + moment(jHasta).toDate().getMinutes()                                
                                        setAllHoras({
                                            ...allHoras, 
                                            horasJueves: AgendaConfig.getTimes(desde, hasta),
                                        })
                                    }
                                }}><i className="material-icons">save</i> Guardar</button>
                            </div>
                        </div>
                      </TabPanel>
                      <TabPanel>
                        <div className="row">
                            <div className="col">
                                <p>Clientes por día {allHoras.horasViernes.length}</p>
                            </div>
                            <div className="col">
                                {allStatus.statusViernes 
                                ? <p onClick={()=>{setAllStatus({...allStatus, statusViernes: !allStatus.statusViernes})}} className="mb-0 agenda-lock-btn">Bloquear día <i className="material-icons mb-0">lock_outline</i></p>
                                : <p onClick={()=>{setAllStatus({...allStatus, statusViernes: !allStatus.statusViernes})}} className="mb-0 agenda-lock-btn">Desbloquear  día <i className="material-icons mb-0">lock_open</i></p>}
                            </div>
                        </div>
                        <div className="row align-items-center">
                            <div className="col">
                                <div className="row">
                                    <div className="col">
                                        <p className="mb-0">Desde</p>
                                    </div>
                                    <div className="col">    
                                        <TimePicker
                                        clearable
                                        placeholder={desdea === "" ? "00:00" : desdea}
                                        ampm={false}
                                        label=""
                                        value={vDesde}
                                        onChange={setVDesde}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="col">
                                <div className="row">
                                    <div className="col">
                                        <p className="mb-0">Hasta</p>
                                    </div>
                                    <div className="col">
                                        <TimePicker
                                        clearable
                                        placeholder={hastaa === "" ? "00:00" : hastaa}
                                        ampm={false}
                                        label=""
                                        value={vHasta}
                                        onChange={setVHasta}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="col">
                                <button className="btn btn-success" onClick={()=>{
                                    if(vDesde === null || vHasta === null){
                                        setEmessage("Debes ingresar las horas correctas")
                                        setError(true)
                                    }else if(vDesde > vHasta){
                                        setEmessage("La hora inicial deber ser menor a la final")
                                        setError(true)
                                    }else{
                                        let desde = moment(vDesde).toDate().getHours() +  ":" + moment(vDesde).toDate().getMinutes()
                                        let hasta = moment(vHasta).toDate().getHours() +  ":" + moment(vHasta).toDate().getMinutes()                                
                                        setAllHoras({
                                            ...allHoras, 
                                            horasViernes: AgendaConfig.getTimes(desde, hasta),
                                        })
                                    }
                                }}><i className="material-icons">save</i> Guardar</button>
                            </div>
                        </div>
                      </TabPanel>
                      <TabPanel>
                        <div className="row">
                            <div className="col">
                                <p>Clientes por día {allHoras.horasSabado.length}</p>
                            </div>
                            <div className="col">
                                {allStatus.statusSabado 
                                ? <p onClick={()=>{setAllStatus({...allStatus, statusSabado: !allStatus.statusSabado})}} className="mb-0 agenda-lock-btn">Bloquear día <i className="material-icons mb-0">lock_outline</i></p>
                                : <p onClick={()=>{setAllStatus({...allStatus, statusSabado: !allStatus.statusSabado})}} className="mb-0 agenda-lock-btn">Desbloquear  día <i className="material-icons mb-0">lock_open</i></p>}
                            </div>
                        </div>
                        <div className="row align-items-center">
                            <div className="col">
                                <div className="row">
                                    <div className="col">
                                        <p className="mb-0">Desde</p>
                                    </div>
                                    <div className="col">    
                                        <TimePicker
                                        clearable
                                        placeholder={desdea === "" ? "00:00" : desdea}
                                        ampm={false}
                                        label=""
                                        value={sDesde}
                                        onChange={setSDesde}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="col">
                                <div className="row">
                                    <div className="col">
                                        <p className="mb-0">Hasta</p>
                                    </div>
                                    <div className="col">
                                        <TimePicker
                                        clearable
                                        placeholder={hastaa === "" ? "00:00" : hastaa}
                                        ampm={false}
                                        label=""
                                        value={sHasta}
                                        onChange={setSHasta}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="col">
                                <button className="btn btn-success" onClick={()=>{
                                    if(sDesde === null || sHasta === null){
                                        setEmessage("Debes ingresar las horas correctas")
                                        setError(true)
                                    }else if(sDesde > sHasta){
                                        setEmessage("La hora inicial deber ser menor a la final")
                                        setError(true)
                                    }else{
                                        let desde = moment(sDesde).toDate().getHours() +  ":" + moment(sDesde).toDate().getMinutes()
                                        let hasta = moment(sHasta).toDate().getHours() +  ":" + moment(sHasta).toDate().getMinutes()                                
                                        setAllHoras({
                                            ...allHoras, 
                                            horasSabado: AgendaConfig.getTimes(desde, hasta),
                                        })
                                    }
                                }}><i className="material-icons">save</i> Guardar</button>
                            </div>
                        </div>
                      </TabPanel>
                      <TabPanel>
                        <div className="row">
                            <div className="col">
                                <p>Clientes por día {allHoras.horasDomingo.length}</p>
                            </div>
                            <div className="col">
                                {allStatus.statusDomingo 
                                ? <p onClick={()=>{setAllStatus({...allStatus, statusDomingo: !allStatus.statusDomingo})}} className="mb-0 agenda-lock-btn">Bloquear día <i className="material-icons mb-0">lock_outline</i></p>
                                : <p onClick={()=>{setAllStatus({...allStatus, statusDomingo: !allStatus.statusDomingo})}} className="mb-0 agenda-lock-btn">Desbloquear  día <i className="material-icons mb-0">lock_open</i></p>}
                            </div>
                        </div>
                        <div className="row align-items-center">
                            <div className="col">
                                <div className="row">
                                    <div className="col">
                                        <p className="mb-0">Desde</p>
                                    </div>
                                    <div className="col">    
                                        <TimePicker
                                        clearable
                                        placeholder={desdea === "" ? "00:00" : desdea}
                                        ampm={false}
                                        label=""
                                        value={dDesde}
                                        onChange={setDDesde}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="col">
                                <div className="row">
                                    <div className="col">
                                        <p className="mb-0">Hasta</p>
                                    </div>
                                    <div className="col">
                                        <TimePicker
                                        clearable
                                        placeholder={hastaa === "" ? "00:00" : hastaa}
                                        ampm={false}
                                        label=""
                                        value={dHasta}
                                        onChange={setDHasta}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="col">
                                <button className="btn btn-success" onClick={()=>{
                                    if(dDesde === null || dHasta === null){
                                        setEmessage("Debes ingresar las horas correctas")
                                        setError(true)
                                    }else if(dDesde > dHasta){
                                        setEmessage("La hora inicial deber ser menor a la final")
                                        setError(true)
                                    }else{
                                        let desde = moment(dDesde).toDate().getHours() +  ":" + moment(dDesde).toDate().getMinutes()
                                        let hasta = moment(dHasta).toDate().getHours() +  ":" + moment(dHasta).toDate().getMinutes()                                
                                        setAllHoras({
                                            ...allHoras, 
                                            horasDomingo: AgendaConfig.getTimes(desde, hasta),
                                        })
                                    }
                                }}><i className="material-icons">save</i> Guardar</button>
                            </div>
                        </div>
                      </TabPanel>
                    </Tabs>
                    {allHoras.horas.length > 0 
                    ? <button className="mt-5 btn btn-success" onClick={()=>{uploadAgenda()}}>Crear agenda</button>
                    : <div></div>
                    }
                </div>
            <div className="col-lg-4 col-md-4 col-sm-12">
                <p>Este sería tu promedio de clientes por atender al día</p>
                <div className="row">
                    {allHoras.horas.map(hora => (
                        <p className="col hour-pill" key={hora}>{hora}</p>
                    ))}
                </div>
            </div>
            </div>
          </div>
        </MuiPickersUtilsProvider>
    )

    async function uploadAgenda(){
        const dates = AgendaConfig.getDates()
        const datesWF = AgendaConfig.getDatesWFormatted()
        // console.log(.toLocaleString + " " + AgendaConfig.getDatesWFormatted().toLocaleString)
        slots(dates, datesWF)
        history.push({
            pathname: "/promotions"
        })
    }
    
    function slots(dates, datesWF){
        try{
            for(let i = 0; i < dates.length; i++){
                if(dates[i].includes(weekDays[0]) && allStatus.statusLunes){
                    slotUpCode(dates[i], allHoras.horasLunes, moment(dates[i], 'ddd, MMM D YYYY').toDate())
                }else if(dates[i].includes(weekDays[1]) && allStatus.statusMartes){
                    slotUpCode(dates[i], allHoras.horasMartes, moment(dates[i], 'ddd, MMM D YYYY').toDate())
                }else if(dates[i].includes(weekDays[2]) && allStatus.statusMiercoles){
                    slotUpCode(dates[i], allHoras.horasMiercoles, moment(dates[i], 'ddd, MMM D YYYY').toDate())
                }else if(dates[i].includes(weekDays[3]) && allStatus.statusJueves){
                    slotUpCode(dates[i], allHoras.horasJueves, moment(dates[i], 'ddd, MMM D YYYY').toDate())
                }else if(dates[i].includes(weekDays[4]) && allStatus.statusViernes){
                    slotUpCode(dates[i], allHoras.horasViernes, moment(dates[i], 'ddd, MMM D YYYY').toDate())
                }else if(dates[i].includes(weekDays[5]) && allStatus.statusSabado){
                    slotUpCode(dates[i], allHoras.horasSabado, moment(dates[i], 'ddd, MMM D YYYY').toDate())
                }else if(dates[i].includes(weekDays[6]) && allStatus.statusDomingo){
                    slotUpCode(dates[i], allHoras.horasDomingo, moment(dates[i], 'ddd, MMM D YYYY').toDate())
                }
            }

        }catch(e){
            console.log(e)
        }
    }

    async function slotUpCode(fecha, horasList, date){
        await firebase.db.collection('Promociones').doc(data.state.promoId).collection("Agenda").doc(fecha).set({
          bloqueado: false,
          servicioId: data.state.promoId,
          fecha: fecha,
          date: date,
          horasDia: horasList, 
          capacidadDia: 0,
          createdOn: moment().toDate(),
        });
    }
    
}

export default AgendaPromoCreation
