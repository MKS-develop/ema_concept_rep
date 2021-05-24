import React, {useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import firebase from '../../firebase/config'
import { MuiPickersUtilsProvider, DatePicker } from '@material-ui/pickers';
import moment from 'moment';
import MomentUtils from '@date-io/moment';

function Proceedings() {
    
    let data = useLocation();
    const [user, setUser] = useState({})
    const [success, setSuccess] = useState(false)
    const [sucessMessage, setSucessMessage] = useState("")
    const [fechaPeso, setFechaPeso] = useState(null)
    const [fechaTemperatura, setFechaTemperatura] = useState(null)
    const [fechaCastrado, setFechaCastrado] = useState(null)
    const [fechaDesparacitacion, setFechaDesparacitacion] = useState(null)
    const [fechaVacunas, setFechaVacunas] = useState(null)
    const [fechaAlergias, setFechaAlergias] = useState(null)
    const [fechaPatologia, setFechaPatologia] = useState(null)

    const [valores, setValores] = useState({
        peso: "",
        temperatura: "",
        castrado: "",
        desparacitado: "",
        vacuna: "",
        alergia: "",
        patologia: "",
    })

    useEffect(() => {
        firebase.getCurrentUser().then((val)=>{
          setUser(val)
        });
    }, [])

    return (
    <MuiPickersUtilsProvider utils={MomentUtils}>
        <div className="main-content-container container-fluid px-4">
            {success 
                ? <div className="alert alert-success fadeIn alert-dismissible fade show mb-0 mt-2" role="alert">
                        <button onClick={()=>{setSuccess(false)}} className="close" data-dismiss="alert" aria-label="Close">
                        <span aria-hidden="true">×</span>
                        </button>
                        <i className="fa fa-check mx-2"></i>
                        <strong>Excelente!</strong> {sucessMessage}
                    </div>
                : <div></div>
            }
            <div className="page-header align-items-center justify-content-spacebetween row no-gutters px-4 my-4">
                <div className="col-12 col-sm-5 text-center text-sm-left mb-0">
                    <div className="row align-items-center">
                        <div className="col">
                            <p className="page-title bold"><Link to="/adoption" className="page-title light">Adopción y apadrinamiento </Link> {'>'} Expediente</p>
                        </div>
                    </div>
                </div>
                <div className="col-12 col-sm-1 mb-0">
                    <div className="row align-items-center justify-content-space-around">
                        <i className="material-icons color-white display-5">help_outline</i>
                    </div>
                </div>
            </div>
            <p className="my-4 light px-4">Rellena los campos con la información necesaria para completar el expediente médico de la mascota</p>
            <div className="row px-5 justify-content-spacebetween">
                <div className="col-lg-5 ">
                    <div className="row mb-5 align-items-center justify-content-spacebetween">
                        <input onChange={(e)=>{setValores({...valores, peso: e.target.value})}} type="text" className="form-control  col-lg-4" placeholder="Peso (Kg)"/>
                        <div className="col-lg-5 spe-input">
                          <DatePicker
                            className="col-lg-12"
                            format="ddd, MMM D YYYY"
                            placeholder="Fecha"
                            maxDate={moment().toDate()}
                            label=""
                            okLabel="Listo"
                            cancelLabel="Cancelar"
                            value={fechaPeso}
                            onChange={setFechaPeso}
                            animateYearScrolling
                          />
                        </div>
                        <p onClick={()=>{fechaPeso === null || valores.peso === "" ? console.log("Error") : save("a")}} className={`btn ${fechaPeso === null || valores.peso === "" ? "btn-disabled" : "btn-outline-primary"} col-lg-3 mb-0`}>
                            <i className="material-icons">save</i>
                        </p>
                    </div>
                    <div className="row mb-5 align-items-center justify-content-spacebetween">
                        <input onChange={(e)=>{setValores({...valores, temperatura: e.target.value})}} type="text" className="form-control  col-lg-4" placeholder="Temperatura (ºC)"/>
                        <div className="col-lg-5 spe-input">
                          <DatePicker
                            className="col-lg-12"
                            format="ddd, MMM D YYYY"
                            placeholder="Fecha"
                            maxDate={moment().toDate()}
                            label=""
                            okLabel="Listo"
                            cancelLabel="Cancelar"
                            value={fechaTemperatura}
                            onChange={setFechaTemperatura}
                            animateYearScrolling
                          />
                        </div>
                        <p onClick={()=>{fechaTemperatura === null || valores.temperatura === "" ? console.log("Error") : save("b")}} className={`btn ${fechaTemperatura === null || valores.temperatura === "" ? "btn-disabled" : "btn-outline-primary"} col-lg-3 mb-0`}>
                            <i className="material-icons">save</i>
                        </p>
                    </div>
                    <div className="row mb-5 align-items-center justify-content-spacebetween">
                        <input onChange={(e)=>{setValores({...valores, castrado: e.target.value})}} type="text" className="form-control  col-lg-4" placeholder="Esterilizado/Castrado"/>
                        <div className="col-lg-5 spe-input">
                          <DatePicker
                            className="col-lg-12"
                            format="ddd, MMM D YYYY"
                            placeholder="Fecha"
                            maxDate={moment().toDate()}
                            label=""
                            okLabel="Listo"
                            cancelLabel="Cancelar"
                            value={fechaCastrado}
                            onChange={setFechaCastrado}
                            animateYearScrolling
                          />
                        </div>
                        <p onClick={()=>{fechaCastrado === null || valores.castrado === "" ? console.log("Error") : save("c")}} className={`btn ${fechaCastrado === null || valores.castrado === "" ? "btn-disabled" : "btn-outline-primary"} col-lg-3 mb-0`}>
                            <i className="material-icons">save</i>
                        </p>
                    </div>
                    <div className="row mb-5 align-items-center justify-content-spacebetween">
                        <input onChange={(e)=>{setValores({...valores, desparacitado: e.target.value})}} type="text" className="form-control  col-lg-4" placeholder="Desparacitación"/>
                        <div className="col-lg-5 spe-input">
                          <DatePicker
                            className="col-lg-12"
                            format="ddd, MMM D YYYY"
                            placeholder="Fecha"
                            maxDate={moment().toDate()}
                            label=""
                            okLabel="Listo"
                            cancelLabel="Cancelar"
                            value={fechaDesparacitacion}
                            onChange={setFechaDesparacitacion}
                            animateYearScrolling
                          />
                        </div>
                        <p onClick={()=>{fechaDesparacitacion === null || valores.desparacitado === "" ? console.log("Error") : save("d")}} className={`btn ${fechaDesparacitacion === null || valores.desparacitado === "" ? "btn-disabled" : "btn-outline-primary"} col-lg-3 mb-0`}>
                            <i className="material-icons">save</i>
                        </p>
                    </div>
                </div>
                <div className="col-lg-5 ">
                    <div className="row mb-5 align-items-center justify-content-spacebetween">
                        <input onChange={(e)=>{setValores({...valores, vacuna: e.target.value})}} type="text" className="form-control  col-lg-4" placeholder="Vacunas"/>
                        <div className="col-lg-5 spe-input">
                          <DatePicker
                            className="col-lg-12"
                            format="ddd, MMM D YYYY"
                            placeholder="Fecha"
                            maxDate={moment().toDate()}
                            label=""
                            okLabel="Listo"
                            cancelLabel="Cancelar"
                            value={fechaVacunas}
                            onChange={setFechaVacunas}
                            animateYearScrolling
                          />
                        </div>
                        <p onClick={()=>{fechaVacunas === null || valores.vacuna === "" ? console.log("Error") : save("e")}} className={`btn ${fechaVacunas === null || valores.vacuna === "" ? "btn-disabled" : "btn-outline-primary"} col-lg-3 mb-0`}>
                            <i className="material-icons">save</i>
                        </p>
                    </div>
                    <div className="row mb-5 align-items-center justify-content-spacebetween">
                        <input onChange={(e)=>{setValores({...valores, alergia: e.target.value})}} type="text" className="form-control  col-lg-4" placeholder="Alergias"/>
                        <div className="col-lg-5 spe-input">
                          <DatePicker
                            className="col-lg-12"
                            format="ddd, MMM D YYYY"
                            placeholder="Fecha"
                            maxDate={moment().toDate()}
                            label=""
                            okLabel="Listo"
                            cancelLabel="Cancelar"
                            value={fechaAlergias}
                            onChange={setFechaAlergias}
                            animateYearScrolling
                          />
                        </div>
                        <p onClick={()=>{fechaAlergias === null || valores.alergia === "" ? console.log("Error") : save("f")}} className={`btn ${fechaAlergias === null || valores.alergia === "" ? "btn-disabled" : "btn-outline-primary"} col-lg-3 mb-0`}>                        
                            <i className="material-icons">save</i>
                        </p>
                    </div>
                    <div className="row mb-5 align-items-center justify-content-spacebetween">
                        <input onChange={(e)=>{setValores({...valores, patologia: e.target.value})}} type="text" className="form-control  col-lg-4" placeholder="Patología"/>
                        <div className="col-lg-5 spe-input">
                          <DatePicker
                            className="col-lg-12"
                            format="ddd, MMM D YYYY"
                            placeholder="Fecha"
                            maxDate={moment().toDate()}
                            label=""
                            okLabel="Listo"
                            cancelLabel="Cancelar"
                            value={fechaPatologia}
                            onChange={setFechaPatologia}
                            animateYearScrolling
                          />
                        </div>
                        <p onClick={()=>{fechaPatologia === null || valores.patologia === "" ? console.log("Error") : save("g")}} className={`btn ${fechaPatologia === null || valores.patologia === "" ? "btn-disabled" : "btn-outline-primary"} col-lg-3 mb-0`}>
                            <i className="material-icons">save</i>
                        </p>
                    </div>
                </div>
            </div>

        </div>
    </MuiPickersUtilsProvider>
    )

    async function save(type){
        let id = Date.now().toString()
        try {
            switch (type) {
                case "a":
                    await firebase.db.collection("Expedientes").doc(data.state.mid).collection("Peso").doc(id).set({
                        eid: id,
                        fechaPeso: fechaPeso.toDate(),
                        peso: parseInt(valores.peso),
                        mid: data.state.mid,
                    }).then((val)=>{
                        setSucessMessage("Peso guardado exitosamente")
                        setSuccess(true)
                    })
                    break;
                case "b":
                    await firebase.db.collection("Expedientes").doc(data.state.mid).collection("Temperatura").doc(id).set({
                        eid: id,
                        fechaTemperatura: fechaTemperatura.toDate(),
                        temperatura: parseInt(valores.temperatura),
                        mid: data.state.mid,
                    }).then((val)=>{
                        setSucessMessage("Temperatura guardada exitosamente")
                        setSuccess(true)
                    })
                    break;
                case "c":
                    await firebase.db.collection("Expedientes").doc(data.state.mid).collection("Esterilizacion").doc(id).set({
                        eid: id,
                        fechaEsteril: fechaCastrado.toDate(),
                        esteril: valores.castrado,
                        mid: data.state.mid,
                    }).then((val)=>{
                        setSucessMessage("Esterilización guardada exitosamente")
                        setSuccess(true)
                    })
                    break;
                case "d":
                    await firebase.db.collection("Expedientes").doc(data.state.mid).collection("Desparasitacion").doc(id).set({
                        eid: id,
                        fechaDesparasitacion: fechaDesparacitacion.toDate(),
                        mid: data.state.mid,
                    }).then((val)=>{
                        setSucessMessage("Desparasitación guardada exitosamente")
                        setSuccess(true)
                    })
                    break;
                case "e":
                    await firebase.db.collection("Expedientes").doc(data.state.mid).collection("Vacunas").doc(id).set({
                        eid: id,
                        fechaVacuna: fechaVacunas.toDate(),
                        vacuna: valores.vacuna,
                        mid: data.state.mid,
                    }).then((val)=>{
                        setSucessMessage("Vacuna guardada exitosamente")
                        setSuccess(true)
                    })
                    break;
                case "f":
                    await firebase.db.collection("Expedientes").doc(data.state.mid).collection("Alergias").doc(id).set({
                        eid: id,
                        fechaAlergia: fechaAlergias.toDate(),
                        alergia: valores.alergia,
                        mid: data.state.mid,
                    }).then((val)=>{
                        setSucessMessage("Alergia guardada exitosamente")
                        setSuccess(true)
                    })
                    break;
                case "g":
                    await firebase.db.collection("Expedientes").doc(data.state.mid).collection("Patologia").doc(id).set({
                        eid: id,
                        fechaPatologia: fechaPatologia.toDate(),
                        patologia: valores.patologia,
                        mid: data.state.mid,
                    }).then((val)=>{
                        setSucessMessage("Patología guardada exitosamente")
                        setSuccess(true)
                    })
                    break;
                default:
                    break;
            }
        } catch (e) {
            console.log(`Error: ${e}`)
        }
    }

}

export default Proceedings