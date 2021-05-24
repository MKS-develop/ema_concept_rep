import React, {useState, useEffect } from 'react'
import { Link, useHistory, useLocation } from 'react-router-dom'
import firebase from '../../firebase/config'
import { MuiPickersUtilsProvider, DatePicker } from '@material-ui/pickers';
import moment from 'moment';
import MomentUtils from '@date-io/moment';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';

function History() {
    
    const history = useHistory()
    let data = useLocation();
    const [user, setUser] = useState({})

    const ordenesList = [
        "Hemograma completo",
        "Medicina Nuclear",
        "PET",
        "Panel básico metabólico: Electrolitos, glucosa, nitrógeno de urea, creatinina",
        "Perfil hepático: Bilirrubina, total y directa, AST, LDH",
        "Perfil lipídico: Colesterol, LDL, HDL, Triglicérido",
        "Perfil renal: Nitrógeno de urea, creatinina, ácido úrico, proteína total, albúmina-globulina calcio, glucosa",
        "Perfil triode: TSH, T3, T4",
        "Rayos X (Radiología)",
        "Resonancia Magnética",
        "Seleccionar",
        "Tomografía",
        "Ultrasonido",
        "Urinálisis completo"
    ]

    let medicamentos = [
        "ABACAVIR",
        "ABAMUNE",
        "ACETAMINOFEN GOTAS",
        "ALKA SELTZER",
        "AMANTADINA",
        "AMANTIX",
        "AMIGDAL",
        "AMINOPLASMAL",
        "AMVAL",
        "ARCENAMIDE",
        "ARSENAMIDE",
        "BEXON",
        "BICARBONATO DE SODIO",
        "BIONOVA",
        "BIOTINIB",
        "BONDIGEST",
        "BRILINTA",
        "BUCAL   V",
        "BUSCAPINA",
        "CALLICIDA AUDAZ",
        "CARBAMAZEPINA",
        "CARDIOLITE",
        "CARDIOMAX PLUS",
        "CARNISIN",
        "CASANTRANOL",
        "CEFOPERAZONA",
        "CELSENTRI",
        "CHALVER",
        "CILOSTAZOL",
        "CIMZIA ",
        "CLOLAR",
        "CLORURO DE POTASIO",
        "CLORURO DE SODIO",
        "COLLOPLUS",
        "COMPLEJO B",
        "CONDILINA",
        "CONDIVER",
        "CROTAMIT",
        "CURAFLEX",
        "CUYDERM",
        "CUYDERM",
        "DACOGEN  ",
        "DEPORTBYAL",
        "DIALISIS",
        "DIANEAL",
        "DICLOFENACO",
        "DIGESAL",
        "DIPIRONA",
        "DISLEP",
        "DULSAR",
        "EFFIENT",
        "EMULSION DE SCOTT",
        "EPOYET",
        "ERITINA",
        "ERITROPOYETINA",
        "ESCOMED",
        "ESMERON",
        "ESPASMOBIL",
        "ESTAVUDINA",
        "EUMOTRIX PLUS",
        "EXFORGE",
        "FALMONOX",
        "FERANIN",
        "FERROPROTINA",
        "FITOSTIMOLINE",
        "FLEXTRIL",
        "FRIXODOL",
        "GALAC",
        "FEPA",
        "HIDROCORTISONA",
        "HYDROCORTISONE100",
        "SOLU CORTEF",
        "ADRENALINA",
        "GASTRUM",
        "GASTRUM FAST",
        "ULFADIN",
        "CYTIL",
        "CYTOTEC",
        "INDUSTOL",
        "ZETEC",
        "ZETEC",
        "ALIVIEX LUA",
        "BUSCASAN",
        "CIPLAPRAZOL",
        "ZINC",
        "OMNIPAQUE",
        "HEXABRIX",
        "IOPA",
        "IOPAMIDOL",
        "IOPAMIRON",
        "ONCO",
        "ULTRAVIST",
        "OPTIRAY",
        "OCTREOSCAN",
        "INDIMACIS",
        "META",
        "MIBG",
        "METASTRON ",
        "CAPSION ",
        "SODIUM",
        "THERACAPSODIUM",
        "YODURO DE SODIO",
        "MIBG",
        "ZEVAMAB ",
    ]

    let todayDate = moment().format("ddd, MMM D YYYY").toString()
    const [success, setSuccess] = useState(false)
    const [sucessMessage, setSucessMessage] = useState("")
    const [fechaPeso, setFechaPeso] = useState(null)
    const [fechaTemperatura, setFechaTemperatura] = useState(null)
    const [fechaCastrado, setFechaCastrado] = useState(null)
    const [fechaDesparacitacion, setFechaDesparacitacion] = useState(null)
    const [fechaVacunas, setFechaVacunas] = useState(null)
    const [fechaAlergias, setFechaAlergias] = useState(null)
    const [fechaPatologia, setFechaPatologia] = useState(null)
    const [fechaConsulta, setFechaConsulta] = useState(null)
    const [episodiosBool, setEpisodiosBool] = useState(false)
    const [examFisi, setExamFisi ] = useState(false)
    const [episodeShow, setEpisodeShow ] = useState(false)
    const [signosVitalesStatus, setSignosVitalesStatus ] = useState(false)
    const [palabra, setPalabra] = useState("")
    const [fechaNac, setFechaNac] = useState("")
    const [text, setText] = useState("")
    const [palabrasClave, setPalabrasClave] = useState([])
    const [ordenesEstudio, setOrdenesEstudio] = useState([])
    const [tratamientos, setTratamientos] = useState([])
    const [tiposPatologiasNew, setTiposPatologiasNew] = useState([])
    const [medicamentosNew, setMedicamentosNew] = useState([])
    const [ordenEstudio, setOrdenEstudio] = useState("")
    const [antecedentes, setAntecedentes] = useState({})
    const [episodios, setEpisodios] = useState([])
    const [episode, setEpisode] = useState({})
    

    const [episodioStatus, setEpisodioStatus] = useState(false)
    const [eventoStatus, setEventoStatus] = useState(false)
    const [antecedentesStatus, setAntecedentesStatus] = useState(false)
    const [pet, setPet] = useState({})
    const [episodioSelected, setEpisodioSelected] = useState(null)
    const [alergias, setAlergias] = useState([])
    const [tiposAlergias, setTiposAlergias] = useState([])
    const [tiposVacunas, setTiposVacunas] = useState([])
    const [tiposPatologias, setTiposPatologias] = useState([])
    const [vacunas, setVacunas] = useState([])
    const [patologias, setPatologias] = useState([])
    const [desparacitaciones, setDesparacitaciones] = useState([])

    const [tratamiento, setTratamiento] = useState({
        via: null,
        cant: null,
        unidad: null,
        frecuencia: null,
        durante: null,
        notaTratamiento: null
    })
    
    const [tratamientoExtras, setTratamientoExtras] = useState({
        frecuenciaNumber: null,
        frecuenciaText: null,
        duranteNumber: null,
        duranteText: null,
    })
    
    
    const [anteFisicoValues, setAnteFisicoValues] = useState({
        inspeccionGeneral: "",
        mucosas: "",
        tiempoLlenadoCapilar: "",
        exploracionLinfonodulosSuperficiales: "",
        estadoHidratacion: "",
    })
    
    const [anteAparatosValues, setAnteAparatosValues] = useState({
        aparatoRespiratorio: "",
        aparatoCardiovascular: "",
        aparatoDigestivo: "",
        aparatoUrinario: "",
        aparatoReproductor: "",
        aparatoLocomotor: "",
        examenOjos: "",
        examenOidos: "",
        examenPiel: "",
        examenNeurologico: "",
    })

    const [episodioValues, setEpisodioValues] = useState({
        datalleConsulta: "",
        diagnosticoConsulta: "",
        comentariosConsulta: "",
        instruccionesAdicionalesConsulta: "",
        ordenEspecialista: "",
    })
    
    const [valores, setValores] = useState({
        peso: "",
        temperatura: "",
        castrado: "",
        desparacitado: "",
        vacuna: "",
        alergia: "",
        patologia: "",
    })

    const [antecedentesValues, setAntecedentesValues] = useState({
        realizasEjercicio:{
            si: false,
            comentario: "",
        },
        diabeticosEnLaFamilia:{
            si: false,
            comentario: "",
        },
        cancerEnLaFamilia:{
            si: false,
            comentario: "",
        },
        hipertensionEnLaFamilia:{
            si: false,
            comentario: "",
        },
        ingieresBebidasAlcoholicas:{
            si: false,
            comentario: "",
        },
        fumas:{
            si: false,
            comentario: "",
        },
        checkUpCadaAno:{
            si: false,
            comentario: "",
        },
        contagiadoDeCOVID:{
            si: false,
            comentario: "",
        },
        pruebaAntigenoProstatico:{
            si: false,
            comentario: "",
        },
        dedicasTiempoEsparcimiento:{
            si: false,
            comentario: "",
        },
        dedicasTiempoFamilia:{
            si: false,
            comentario: "",
        },
        dedicasTiempoReligion:{
            si: false,
            comentario: "",
        },
        teConsideras:{
            valor: "",
            comentario: "",
        },
        cuantasHorasDuermes:{
            valor: "",
            comentario: "",
        },
        bebidaIngieresFrecuencia:{
            valor: "",
            comentario: "",
        },
        bebidaAlcoholicaIngieresFrecuencia:{
            valor: "",
            comentario: "",
        },
        considerasTuAlimentacion:{
            valor: "",
            comentario: "",
        },
        constitucionCorporal:{
            valor: "",
            comentario: "",
        },
        nivelEstresLaboral:{
            valor: "",
            comentario: "",
        },
        estadoSalud:{
            valor: "",
            comentario: "",
        },
        horasTrabajasDia:{
            valor: "",
            comentario: "",
        },
        teMovilizasEn:{
            valor: "",
            comentario: "",
        },
    })

    const getPet = async(mid) => {
        let alergias = []
        let vacunas = []
        let patologias = []
        let desparacitaciones = []
        try {
            firebase.db.collection("Mascotas").doc(mid).get().then((val)=>{
                setPet(val.data())
                setFechaNac(moment(val.data().fechanac.toDate()).format(`D MMMM, YYYY`).toString())
                let tiposVacunas = []
                let tiposAlergias = []
                let tiposPatologias = []
                firebase.db.collection("Especies").doc(val.data().especie).collection("Vacunas").get().then((val)=>{
                    Promise.all(val.docs.map(async (doc) => {
                        tiposVacunas.push(doc.id)
                    }))
                    setTiposVacunas(tiposVacunas)
                })
                firebase.db.collection("Especies").doc(val.data().especie).collection("Alergias").get().then((val)=>{
                    Promise.all(val.docs.map(async (doc) => {
                        tiposAlergias.push(doc.id)
                    }))
                    setTiposAlergias(tiposAlergias)
                })
                firebase.db.collection("Especies").doc(val.data().especie).collection("Patologias").get().then((val)=>{
                    Promise.all(val.docs.map(async (doc) => {
                        tiposPatologias.push(doc.id)
                    }))
                    setTiposPatologias(tiposPatologias)
                })
            })
            firebase.db.collection("Expedientes").doc(mid).collection("Alergias").onSnapshot((val)=>{
                val.docs.forEach((doc)=>{
                    alergias.push(doc.data())
                })
                setAlergias(alergias)
            })
            firebase.db.collection("Expedientes").doc(mid).collection("Vacunas").onSnapshot((val)=>{
                val.docs.forEach((doc)=>{
                    vacunas.push(doc.data())
                })
                setVacunas(vacunas)
            })
            firebase.db.collection("Expedientes").doc(mid).collection("Patologia").onSnapshot((val)=>{
                val.docs.forEach((doc)=>{
                    patologias.push(doc.data())
                })
                setPatologias(patologias)
            })
            firebase.db.collection("Expedientes").doc(mid).collection("Desparasitacion").onSnapshot((val)=>{
                val.docs.forEach((doc)=>{
                    desparacitaciones.push(doc.data())
                })
                setDesparacitaciones(desparacitaciones)
            })
            firebase.db.collection("Expedientes").doc(mid).collection("Episodios").onSnapshot((val) => {
                let tipos = []
                if (val.docs.length > 0) {
                    setEpisodiosBool(true)
                    Promise.all(val.docs.map(async (doc) => {
                        tipos.push(doc.data())
                    }))
                    setEpisodios(tipos.sort((a, b) => b.fechaConsulta - a.fechaConsulta))
                }
            });
            // firebase.db.collection("Expedientes").doc(mid).collection("Episodios").get().then((val)=>{
            //     let tipos = []
            //     if (val.docs.length > 0) {
            //         setEpisodiosBool(true)
            //         Promise.all(val.docs.map(async (doc) => {
            //             tipos.push(doc.data())
            //         }))
            //         setEpisodios(tipos)
            //     }
            // })
            firebase.db.collection("Expedientes").doc(mid).collection("Antecedentes").doc(mid).get().then((val)=>{
                setAntecedentes(val.data())
            })
        } catch (e) {
            console.log(`Error: ${e}`)
        }
    }

    function createOrden(){
        console.log(ordenEstudio)
    }
    
    function createTreatment(){

        var frecuencia = `${tratamientoExtras.frecuenciaNumber} ${tratamientoExtras.frecuenciaText}`
        var durante = `${tratamientoExtras.duranteNumber} ${tratamientoExtras.duranteText}`
        
        tratamiento.frecuencia = frecuencia
        tratamiento.durante = durante

        setTratamientos([...tratamientos, tratamiento])
        console.log(tratamientos)

    }

    // function removeEtiquetaDiagnostico(p){
    //     setWordss(wordss.filter((p1) => p1 !== p))
    //   }
  
    function createEtiquetaDiagnostico(palabra){
      let tipos = []
      if(palabra !== ""){
        for(let i = 0; i < tiposPatologias.length; i++){
          let w = tiposPatologias[i]
          if(w.toLowerCase().includes(palabra.toLowerCase())){
            tipos.push(w)
          }else{
            setTiposPatologiasNew([])
            setEpisodioValues({...episodioValues, diagnosticoConsulta: palabra})
          }
        }
        setTiposPatologiasNew(tipos)
      }else{
        setEpisodioValues({...episodioValues, diagnosticoConsulta: ""})
        setTiposPatologiasNew([])
      }
    }
    
    function createEtiquetaMedicamentos(palabra){
      let tipos = []
      if(palabra !== ""){
        for(let i = 0; i < medicamentos.length; i++){
          let w = medicamentos[i]
          if(w.toLowerCase().includes(palabra.toLowerCase())){
            tipos.push(w)
          }else{
            setMedicamentosNew([])
            setTratamiento({...tratamiento, nombre: palabra})
          }
        }
        setMedicamentosNew(tipos)
      }else{
        setTratamiento({...tratamiento, nombre: ""})
        setMedicamentosNew([])
      }
    }
  
    // const handleKeyPress = (event) => {
    //   if(event.key === 'Enter' && wordd !== ""){
    //     setWordss([...wordss, wordd])
    //   }
    // }

    useEffect(() => {
        firebase.getCurrentUser().then((val)=>{
          setUser(val)
          getPet(data.state.mid)
        });
    }, [])

    return (
    <MuiPickersUtilsProvider utils={MomentUtils}>
        <div className="main-content-container container-fluid px-4">
            { episodeShow ? <div className="cc-modal-wrapper fadeIn">
              <div className="cc-modal">
                <div className="cc-modal-header mb-2">
                  <div className="no-gutters mb-3 row align-items-center justify-content-spacebetween">
                    <h3 className="mb-0">Información de la consulta</h3>
                  </div>
                </div>
                <div className="cc-modal-body">
                    <div className="col-lg-12">
                        <div>
                            <p className="color-primary mb-1">{episode.motivoConsulta === "" ? "" : "Motivo de la consulta:"}</p>
                            <div className="row no-gutters">
                                {episode.motivoConsulta.map((mc)=>{
                                    return (
                                        <p className="pill-2">{mc}</p>
                                    )
                                })}
                            </div>
                        </div>
                        <div>
                            <p className="color-primary mb-1">{episode.comentariosConsulta === "" ? "" : "Comentarios de la consulta:"}</p>
                            <p>{episode.comentariosConsulta}</p>
                        </div>
                        <div>
                            <p className="color-primary mb-1">{episode.datalleConsulta === "" ? "" : "Detalle de la consulta:"}</p>
                            <p>{episode.datalleConsulta}</p>
                        </div>
                        <div>
                            <p className="color-primary mb-1">{episode.diagnosticoConsulta === "" ? "" : "Diagnostico de la consulta:"}</p>
                            <p>{episode.diagnosticoConsulta}</p>
                        </div>
                        <div>
                            <p className="color-primary mb-1">{episode.instruccionesAdicionalesConsulta === "" ? "" : "Instrucciones adicionales de la consulta:"}</p>
                            <p>{episode.instruccionesAdicionalesConsulta}</p>
                        </div>
                    </div>
                </div>
                <div className="cc-modal-footer align-items-center justify-content-spacebetween">
                  <button onClick={()=>{setEpisodeShow(false)}} className={`btn btn-disabled`}>
                    Cancelar
                  </button>
                  <button onClick={()=>{setEpisodeShow(false)}} className={`btn btn-primary`}>
                    Guardar
                  </button>
                </div>
              </div>
            </div> : <div></div> }
            { examFisi ? <div className="cc-modal-wrapper fadeIn">
              <div className="cc-modal cc-modal-scroll">
                <div className="cc-modal-header mb-2">
                  <div className="no-gutters mb-3 row align-items-center justify-content-spacebetween">
                    <h3 className="mb-0">Examen físico</h3>
                  </div>
                </div>
                <div className="cc-modal-body">
                    <div className="row">
                        <div className="col-lg-6">
                            <h4 className="my-3">Examen físico</h4>
                            <div className="row no-gutters align-items-center my-3">
                                <p className="mb-0 col-lg-6">Inspección general</p>
                                <input value={anteFisicoValues.inspeccionGeneral} onChange={(e)=>setAnteFisicoValues({...anteFisicoValues, inspeccionGeneral: e.target.value})} className="form-control col-lg-6"/>
                            </div>
                            {/* <div className="row no-gutters align-items-center my-3">
                                <p className="mb-0 col-lg-6">Mucosas</p>
                                <input value={anteFisicoValues.mucosas} onChange={(e)=>setAnteFisicoValues({...anteFisicoValues, mucosas: e.target.value})} className="form-control col-lg-6"/>
                            </div>
                            <div className="row no-gutters align-items-center my-3">
                                <p className="mb-0 col-lg-6">Tiempo de llenado capilar</p>
                                <input value={anteFisicoValues.tiempoLlenadoCapilar} onChange={(e)=>setAnteFisicoValues({...anteFisicoValues, tiempoLlenadoCapilar: e.target.value})} className="form-control col-lg-6"/>
                            </div>
                            <div className="row no-gutters align-items-center my-3">
                                <p className="mb-0 col-lg-6">Exploración de ganglios linfáticos superficiales</p>
                                <input value={anteFisicoValues.exploracionLinfonodulosSuperficiales} onChange={(e)=>setAnteFisicoValues({...anteFisicoValues, exploracionLinfonodulosSuperficiales: e.target.value})} className="form-control col-lg-6"/>
                            </div>
                            <div className="row no-gutters align-items-center my-3">
                                <p className="mb-0 col-lg-6">Estado de hidratación</p>
                                <input value={anteFisicoValues.estadoHidratacion} onChange={(e)=>setAnteFisicoValues({...anteFisicoValues, estadoHidratacion: e.target.value})} className="form-control col-lg-6"/>
                            </div> */}

                            

                        </div>
                        <div className="col-lg-6">
                            <h4 className="my-3">Sistemas</h4>
                            <div className="row no-gutters align-items-center my-3">
                                <p className="col-lg-6 mb-0">Aparato respiratorio</p>
                                <input value={anteAparatosValues.aparatoRespiratorio} onChange={(e)=>setAnteAparatosValues({...anteAparatosValues, aparatoRespiratorio: e.target.value})} className="form-control col-lg-6"/>
                            </div>
                            <div className="row no-gutters align-items-center my-3">
                                <p className="col-lg-6 mb-0">Aparato cardiovascular</p>
                                <input value={anteAparatosValues.aparatoCardiovascular} onChange={(e)=>setAnteAparatosValues({...anteAparatosValues, aparatoCardiovascular: e.target.value})} className="form-control col-lg-6"/>
                            </div>
                            <div className="row no-gutters align-items-center my-3">
                                <p className="col-lg-6 mb-0">Aparato digestivo</p>
                                <input value={anteAparatosValues.aparatoDigestivo} onChange={(e)=>setAnteAparatosValues({...anteAparatosValues, aparatoDigestivo: e.target.value})} className="form-control col-lg-6"/>
                            </div>
                            <div className="row no-gutters align-items-center my-3">
                                <p className="col-lg-6 mb-0">Aparato urinario</p>
                                <input value={anteAparatosValues.aparatoUrinario} onChange={(e)=>setAnteAparatosValues({...anteAparatosValues, aparatoUrinario: e.target.value})} className="form-control col-lg-6"/>
                            </div>
                            <div className="row no-gutters align-items-center my-3">
                                <p className="col-lg-6 mb-0">Aparato reproductor</p>
                                <input value={anteAparatosValues.aparatoReproductor} onChange={(e)=>setAnteAparatosValues({...anteAparatosValues, aparatoReproductor: e.target.value})} className="form-control col-lg-6"/>
                            </div>
                            <div className="row no-gutters align-items-center my-3">
                                <p className="col-lg-6 mb-0">Aparato locomotor</p>
                                <input value={anteAparatosValues.aparatoLocomotor} onChange={(e)=>setAnteAparatosValues({...anteAparatosValues, aparatoLocomotor: e.target.value})} className="form-control col-lg-6"/>
                            </div>
                            <div className="row no-gutters align-items-center my-3">
                                <p className="col-lg-6 mb-0">Inspección oftálmica</p>
                                <input value={anteAparatosValues.examenOjos} onChange={(e)=>setAnteAparatosValues({...anteAparatosValues, examenOjos: e.target.value})} className="form-control col-lg-6"/>
                            </div>
                            <div className="row no-gutters align-items-center my-3">
                                <p className="col-lg-6 mb-0">Inspección oidos</p>
                                <input value={anteAparatosValues.examenOidos} onChange={(e)=>setAnteAparatosValues({...anteAparatosValues, examenOidos: e.target.value})} className="form-control col-lg-6"/>
                            </div>
                            <div className="row no-gutters align-items-center my-3">
                                <p className="col-lg-6 mb-0">Inspección piel</p>
                                <input value={anteAparatosValues.examenPiel} onChange={(e)=>setAnteAparatosValues({...anteAparatosValues, examenPiel: e.target.value})} className="form-control col-lg-6"/>
                            </div>
                            <div className="row no-gutters align-items-center my-3">
                                <p className="col-lg-6 mb-0">Inspección neurológica</p>
                                <input value={anteAparatosValues.examenNeurologico} onChange={(e)=>setAnteAparatosValues({...anteAparatosValues, examenNeurologico: e.target.value})} className="form-control col-lg-6"/>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="cc-modal-footer align-items-center justify-content-spacebetween">
                  <button onClick={()=>{setExamFisi(false)}} className={`btn btn-disabled`}>
                    Cancelar
                  </button>
                  <button onClick={()=>{updateAntecedentes(); setExamFisi(false);}} className={`btn btn-primary`}>
                    Guardar
                  </button>
                </div>
              </div>
            </div> : <div></div> }
            { signosVitalesStatus ? <div className="cc-modal-wrapper fadeIn">
              <div className="cc-modal">
                <div className="cc-modal-header mb-2">
                  <div className="no-gutters mb-3 row align-items-center justify-content-spacebetween">
                    <h3 className="mb-0">Signos vitales</h3>
                  </div>
                </div>
                <div className="cc-modal-body">
                    <div className="col-lg-12 px-5">
                        <div className="row mb-4 align-items-center justify-content-spacebetween">
                            <input onChange={(e)=>{setValores({...valores, peso: e.target.value})}} type="text" className="form-control  col-lg-4" placeholder="Talla (mts)"/>
                            <div className="col-lg-5 spe-input">
                            <DatePicker
                                className="col-lg-12"
                                format="ddd, MMM D YYYY"
                                placeholder={todayDate}
                                maxDate={moment().toDate()}
                                label=""
                                okLabel="Listo"
                                cancelLabel="Cancelar"
                                value={fechaPeso}
                                onChange={setFechaPeso}
                                animateYearScrolling
                            />
                            </div>
                        </div>
                        <div className="row mb-4 align-items-center justify-content-spacebetween">
                            <input onChange={(e)=>{setValores({...valores, peso: e.target.value})}} type="text" className="form-control  col-lg-4" placeholder="Peso (Kg)"/>
                            <div className="col-lg-5 spe-input">
                            <DatePicker
                                className="col-lg-12"
                                format="ddd, MMM D YYYY"
                                placeholder={todayDate}
                                maxDate={moment().toDate()}
                                label=""
                                okLabel="Listo"
                                cancelLabel="Cancelar"
                                value={fechaPeso}
                                onChange={setFechaPeso}
                                animateYearScrolling
                            />
                            </div>
                        </div>
                        <div className="row mb-4 align-items-center justify-content-spacebetween">
                            <input onChange={(e)=>{setValores({...valores, temperatura: e.target.value})}} type="text" className="form-control  col-lg-4" placeholder="Temperatura (ºC)"/>
                            <div className="col-lg-5 spe-input">
                            <DatePicker
                                className="col-lg-12"
                                format="ddd, MMM D YYYY"
                                placeholder={todayDate}
                                maxDate={moment().toDate()}
                                label=""
                                okLabel="Listo"
                                cancelLabel="Cancelar"
                                value={fechaTemperatura}
                                onChange={setFechaTemperatura}
                                animateYearScrolling
                            />
                            </div>
                        </div>
                        <div className="row mb-4 align-items-center justify-content-spacebetween">
                            <input onChange={(e)=>{setValores({...valores, peso: e.target.value})}} type="text" className="form-control  col-lg-4" placeholder="Frecuencia respiratoria"/>
                            <div className="col-lg-5 spe-input">
                            <DatePicker
                                className="col-lg-12"
                                format="ddd, MMM D YYYY"
                                placeholder={todayDate}
                                maxDate={moment().toDate()}
                                label=""
                                okLabel="Listo"
                                cancelLabel="Cancelar"
                                value={fechaPeso}
                                onChange={setFechaPeso}
                                animateYearScrolling
                            />
                            </div>
                        </div>
                        <div className="row mb-4 align-items-center justify-content-spacebetween">
                            <input onChange={(e)=>{setValores({...valores, temperatura: e.target.value})}} type="text" className="form-control  col-lg-4" placeholder="Frecuencia cardiaca"/>
                            <div className="col-lg-5 spe-input">
                            <DatePicker
                                className="col-lg-12"
                                format="ddd, MMM D YYYY"
                                placeholder={todayDate}
                                maxDate={moment().toDate()}
                                label=""
                                okLabel="Listo"
                                cancelLabel="Cancelar"
                                value={fechaTemperatura}
                                onChange={setFechaTemperatura}
                                animateYearScrolling
                            />
                            </div>
                        </div>
                        <div className="row mb-4 align-items-center justify-content-spacebetween">
                            <input onChange={(e)=>{setValores({...valores, temperatura: e.target.value})}} type="text" className="form-control  col-lg-4" placeholder="Presión arterial"/>
                            <div className="col-lg-5 spe-input">
                            <DatePicker
                                className="col-lg-12"
                                format="ddd, MMM D YYYY"
                                placeholder={todayDate}
                                maxDate={moment().toDate()}
                                label=""
                                okLabel="Listo"
                                cancelLabel="Cancelar"
                                value={fechaTemperatura}
                                onChange={setFechaTemperatura}
                                animateYearScrolling
                            />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="cc-modal-footer align-items-center justify-content-spacebetween">
                  <button onClick={()=>{setSignosVitalesStatus(false)}} className={`btn btn-disabled`}>
                    Cancelar
                  </button>
                  <button onClick={()=>{setSignosVitalesStatus(false)}} className={`btn btn-primary`}>
                    Guardar
                  </button>
                </div>
              </div>
            </div> : <div></div> }
            <div className="page-header align-items-center justify-content-spacebetween row no-gutters px-4 my-4">
                <div className="col-12 col-sm-5 text-center text-sm-left mb-0">
                    <div className="row align-items-center">
                        <div className="col">
                            <p className="page-title bold">
                                <Link to="/clients" className="page-title light">Clientes</Link>{' > '}
                                <span onClick={()=>{
                                    history.push({
                                      pathname: "/clients/client",
                                      state: {uid: data.state.uid}
                                    })
                                }} className="page-title light">Cliente</span>{' > '}Historia de la mascota</p>
                        </div>
                    </div>
                </div>
                <div className="col-12 col-sm-1 mb-0">
                    <div className="row align-items-center justify-content-space-around">
                        <i className="material-icons color-white display-5">help_outline</i>
                    </div>
                </div>
            </div>
            
            <div className="container">
                {/* Informacion mascota */}
                <div className="row box-info-wrapper align-items-center justify-content-spacebetween">
                    <div className="col-lg-4">
                        <div className="box-info text-center">
                            <img src={pet.petthumbnailUrl} className="box-info-img"/>
                        </div>
                    </div>
                    <div className="col-lg-4">
                        <div className="box-info">
                            <p className="mb-0 box-info-p strong">{pet.nombre}</p>
                        </div>
                        <div className="box-info">
                            <p className="mb-0 box-info-p">Fecha de nacimiento: {fechaNac}</p>
                            {/* <p className="mb-0 box-info-p">Fecha de nacimiento:{ pet.fechanac ? pet.fechanac.toDate() : "26 de Mayo, 2016"}</p> */}
                        </div>
                    </div>
                    <div className="col-lg-4">
                        <div className="box-info">
                            <p className="mb-0 box-info-p">Edad: 3 años y 5 meses</p>
                        </div>
                    </div>
                </div>
                {/* End informacion mascota */}
                <div className="row mt-4">
                    {/* General */}
                    <div className={ antecedentesStatus ? "col-lg-12 mb-5" : "col-lg-8 mb-5"}>
                        <div className="row">
                            <div className="col-lg-3">
                                <p onClick={()=>{setEpisodioStatus(true); setEventoStatus(false); setAntecedentesStatus(false)}} className={`btn btn-no-padding-x btn-block ${episodioStatus ? "btn-primary" : "btn-outline-primary"}`}>
                                    Nuevo evento
                                </p>
                            </div>
                            <div className="col-lg-3">
                                <p onClick={()=>{setEpisodioStatus(false); setEventoStatus(false); setAntecedentesStatus(false)}} className={`btn btn-no-padding-x btn-block ${!eventoStatus && !episodioStatus & !antecedentesStatus ? "btn-primary" : "btn-outline-primary"}`}>
                                    Control
                                </p>
                            </div>
                            <div className="col-lg-3">
                                <p onClick={()=>{setEpisodioStatus(false); setEventoStatus(false); setAntecedentesStatus(true)}} className={`btn btn-no-padding-x btn-block ${antecedentesStatus ? "btn-primary" : "btn-outline-primary"}`}>
                                    Antecedentes
                                </p>
                            </div>
                        </div>
                        { !episodioStatus && !eventoStatus & !antecedentesStatus ?
                            <Tabs>
                                <TabList>
                                    <Tab>Vacunas</Tab>
                                    <Tab>Alergias</Tab>

                                </TabList>
                                <TabPanel>
                                    {vacunas.map((val)=>{
                                        let oc = moment(val.fechaVacuna.toDate()).format("ddd, MMM D YYYY")
                                        return (
                                            <div key={val.eid} className="mb-2 row align-items-center justify-content-spacebetween border-bottom">
                                                <div className="mb-1 col-lg-6">{val.vacuna}</div>
                                                <div className="mb-1 col-lg-6">{oc}</div>
                                            </div>  
                                        )
                                    })}
                                    <div className="row align-items-center justify-content-spacebetween">
                                        <select value={valores.vacuna} placeholder="Vacuna" onChange={(e)=>setValores({...valores, vacuna: e.target.value})} className="mt-3 form-control col-lg-4">
                                            {tiposVacunas.map((a)=>{
                                                return (
                                                    <option key={a} value={a}>{a}</option>
                                                )
                                            })}
                                        </select>
                                        <div className="mt-3 col-lg-5 spe-input">
                                          <DatePicker
                                            className="col-lg-12"
                                            format="ddd, MMM D YYYY"
                                            placeholder={todayDate}
                                            maxDate={moment().toDate()}
                                            label=""
                                            okLabel="Listo"
                                            cancelLabel="Cancelar"
                                            value={fechaVacunas}
                                            onChange={setFechaVacunas}
                                            animateYearScrolling
                                          />
                                        </div>
                                        <div  onClick={()=>{fechaVacunas === null || valores.vacuna === "" ? console.log("Error") : saveGeneral("e")}} className="mt-3 btn btn-outline-secondary col-lg-3">Nueva vacuna</div>
                                    </div>
                                </TabPanel>
                                <TabPanel>
                                    {alergias.map((val)=>{
                                        let oc = moment(val.fechaAlergia.toDate()).format("ddd, MMM D YYYY")
                                        return (
                                            <div key={val.eid} className="mb-2 row align-items-center justify-content-spacebetween border-bottom">
                                                <div className="mb-1 col-lg-6">{val.alergia}</div>
                                                <div className="mb-1 col-lg-6">{oc}</div>
                                            </div>  
                                        )
                                    })}
                                    <div className="row align-items-center justify-content-spacebetween">
                                        <select value={valores.alergia} placeholder="Alergia" onChange={(e)=>setValores({...valores, alergia: e.target.value})} className="mt-3 form-control col-lg-4">
                                            {tiposAlergias.map((a)=>{
                                                return (
                                                    <option key={a} value={a}>{a}</option>
                                                )
                                            })}
                                        </select>
                                        <div className="mt-3 col-lg-5 spe-input">
                                          <DatePicker
                                            className="col-lg-12"
                                            format="ddd, MMM D YYYY"
                                            placeholder={todayDate}
                                            maxDate={moment().toDate()}
                                            label=""
                                            okLabel="Listo"
                                            cancelLabel="Cancelar"
                                            value={fechaAlergias}
                                            onChange={setFechaAlergias}
                                            animateYearScrolling
                                          />
                                        </div>
                                        <div onClick={()=>{fechaAlergias === null || valores.alergia === "" ? console.log("Error") : saveGeneral("f")}} className="mt-3 btn btn-outline-secondary col-lg-3">Nueva alergia</div>
                                    </div>
                                </TabPanel>
                            </Tabs>
                        : episodioStatus ? 
                            <div>
                                <div className="row align-items-center justify-content-spacebetween">
                                    <p className="col-lg-7 mb-0">Fecha de consulta</p>
                                    <div className="mt-3 col-lg-5 spe-input">
                                      <DatePicker
                                        className="col-lg-12"
                                        format="ddd, MMM D YYYY"
                                        placeholder={todayDate}
                                        maxDate={moment().toDate()}
                                        label=""
                                        okLabel="Listo"
                                        cancelLabel="Cancelar"
                                        value={fechaConsulta}
                                        onChange={setFechaConsulta}
                                        animateYearScrolling
                                      />
                                    </div>
                                </div>
                                <div className="row align-items-center justify-content-spacebetween">
                                    <p className="col-lg-4 mb-0">Motivo de la consulta</p>
                                    <div className="form-group col-lg-4 mt-3">
                                      <input type="text" onChange={e=>{setPalabra(e.target.value)}} placeholder="Dolor de cabeza" className="form-control"/>
                                    </div>
                                    <div className="form-group col-lg-4 mt-3">
                                        <span onClick={()=>{ palabra === "" ? console.log("Error") : setPalabrasClave([...palabrasClave, palabra]) }} className={palabra === "" ? "btn btn-disabled btn-block" : "btn btn-primary btn-block"}>Añadir</span>
                                    </div>
                                </div>
                                <div className="px-3 row">
                                  {palabrasClave.map(p => (
                                    <p className="pill" key={p}>{p}</p>
                                  ))}
                                </div>
                                <div className="row align-items-center justify-content-spacebetween">
                                    <p className="col-lg-4 mb-0">Detalle</p>
                                    <textarea placeholder="Detalle de la consulta" value={episodioValues.detalleConsulta}
                                        onChange={(e) => setEpisodioValues({...episodioValues, detalleConsulta: e.target.value})} className="mt-3 form-control col-lg-8"/>
                                </div>
                                <div className="row align-items-center justify-content-spacebetween">
                                    <p className="col-lg-7 mb-0">Examen físico</p>
                                    <div onClick={()=>{setExamFisi(true)}} className="mt-3 btn btn-secondary col-lg-3">Ver</div>
                                </div>
                                <div className="row align-items-center justify-content-spacebetween">
                                    <p className="col-lg-7 mb-0">Signos vitales</p>
                                    <div onClick={()=>{setSignosVitalesStatus(true)}} className="mt-3 btn btn-secondary col-lg-3">Ver</div>
                                </div>
                                <div className="row align-items-center justify-content-spacebetween">
                                    <p className="col-lg-7 mb-0">Diagnostico</p>
                                    <div className="mt-3 col-lg-4 custom-dropdown">
                                      <input placeholder={tiposPatologias[0]} value={episodioValues.diagnosticoConsulta} onChange={(e)=>{ createEtiquetaDiagnostico(e.target.value) }} className="form-control"/>
                                      <div className="custom-dropdown-box">
                                        {tiposPatologiasNew.map((val, i)=>{
                                            return (
                                            <div className="custom-dropdown-option cursor-pointer" onClick={()=>{ setEpisodioValues({...episodioValues, diagnosticoConsulta: val});  setTiposPatologiasNew([]) } } key={i}>
                                                {val}
                                            </div>
                                            )
                                        })}
                                      </div>
                                    </div>
                                </div>
                                <div className="row align-items-center justify-content-spacebetween">
                                    <p className="col-lg-4 mb-0">Comentarios</p>
                                    <textarea placeholder="Comentarios adicionales de la consulta" value={episodioValues.comentariosConsulta} onChange={(e) => setEpisodioValues({...episodioValues, comentariosConsulta: e.target.value})} className="mt-3 form-control col-lg-8"/>
                                </div>
                                <div className="row align-items-center justify-content-spacebetween">
                                    <p className="col-lg-4 mb-0">Órdenes para estudios</p>
                                    <select onChange={(e)=>{setOrdenEstudio(e.target.value)}} value={ordenEstudio} className="mt-3 form-control col-lg-4">
                                        {ordenesList.map((v, i) =>{
                                            return (
                                                <option key={i} value={v}>{v}</option>
                                            )
                                        })}
                                    </select>

                                    {/* <div className="mt-3 col-lg-4 custom-dropdown">
                                      <input placeholder={tiposPatologias[0]} value={episodioValues.diagnosticoConsulta} onChange={(e)=>{ createEtiquetaDiagnostico(e.target.value) }} className="form-control"/>
                                      <div className="custom-dropdown-box">
                                        {tiposPatologiasNew.map((val, i)=>{
                                            return (
                                            <div className="custom-dropdown-option cursor-pointer" onClick={()=>{ setEpisodioValues({...episodioValues, diagnosticoConsulta: val});  setTiposPatologiasNew([]) } } key={i}>
                                                {val}
                                            </div>
                                            )
                                        })}
                                      </div>
                                    </div> */}

                                    <div className="form-group col-lg-4 mt-3">
                                        <span onClick={()=>{ ordenEstudio === "" ? console.log("Error") : setOrdenesEstudio([...ordenesEstudio, ordenEstudio]) }} className={ordenEstudio === "" ? "btn btn-disabled btn-block" : "btn btn-primary btn-block"}>Añadir</span>
                                    </div>
                                </div>
                                {ordenEstudio !== "" ?
                                    <textarea placeholder="Nota de la órden" className="mt-3 form-control col-lg-8"/>
                                : <div></div>
                                }
                                <div className="px-3 row">
                                  {ordenesEstudio.map(p => (
                                    <p className="pill" key={p}>{p}</p>
                                  ))}
                                </div>
                                <div className="row align-items-center justify-content-spacebetween">
                                    <p className="col-lg-7 mb-0">Tratamiento</p>
                                    {/* <select onChange={(e)=>{setTratamiento({...tratamiento, nombre: e.target.value})}} value={tratamiento.nombre} className="mt-3 form-control col-lg-4"  placeholder="W">
                                        {medicamentos.map((v, i) =>{
                                            return (
                                                <option key={i} value={v}>{v}</option>
                                            )
                                        })}
                                    </select> */}

                                    <div className="mt-3 col-lg-4 custom-dropdown">
                                      <input placeholder={medicamentos[0]} value={tratamiento.nombre} onChange={(e)=>{ createEtiquetaMedicamentos(e.target.value) }} className="form-control"/>
                                      <div className="custom-dropdown-box">
                                        {medicamentosNew.map((val, i)=>{
                                            return (
                                            <div className="custom-dropdown-option cursor-pointer" onClick={()=>{ setTratamiento({...tratamiento, nombre: val});  setMedicamentosNew([]) } } key={i}>
                                                {val}
                                            </div>
                                            )
                                        })}
                                      </div>
                                    </div>
                                        
                                </div>
                                <div className="px-3 row">
                                  {tratamientos.map((p, i) => (
                                    <p className="pill" key={i}>
                                        {p.notaTratamiento}
                                        <br/>
                                        {p.nombre}
                                    </p>
                                  ))}
                                </div>
                                {tratamiento.nombre ? 
                                
                                <>
                                    <div className="">
                                        <div className="row no-gutters">
                                            <div className="col-lg-6">
                                                <div className="treatment-header">Dosis</div>
                                                <div className="treatment-body row">
                                                    <div className="col-lg-4">
                                                        <div className="mb-2">Via</div>
                                                        <select onChange={(e)=>{setTratamiento({...tratamiento, via: e.target.value})}} value={tratamiento.via} className="form-control">
                                                            <option value="Anal">Anal</option>
                                                            <option value="Auditiva">Auditiva</option>
                                                            <option value="Nasal">Nasal</option>
                                                            <option value="Oral">Oral</option>
                                                            <option value="Ocular">Ocular</option>
                                                        </select>
                                                    </div>
                                                    <div className="col-lg-4">
                                                        <div className="mb-2">Cantidad</div>
                                                        <input onChange={(e)=>{setTratamiento({...tratamiento, cant: e.target.value})}} value={tratamiento.cant} className="form-control"/>
                                                    </div>
                                                    <div className="col-lg-4">
                                                        <div className="mb-2">Unidad</div>
                                                        <select onChange={(e)=>{setTratamiento({...tratamiento, unidad: e.target.value})}} value={tratamiento.unidad} className="form-control">
                                                            <option value="Capsulas">Cápsulas</option>
                                                            <option value="Gotas">Gotas</option>
                                                            <option value="Ampollas">Ampollas</option>
                                                            <option value="Uncion">Unción</option>
                                                            <option value="Tableta">Tableta</option>
                                                        </select>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-lg-6">
                                                <div className="treatment-header">Duración</div>
                                                <div className="treatment-body row">
                                                    <div className="col-lg-6">
                                                        <div className="mb-2">Frecuencia</div>
                                                        <div className="row no-gutters">
                                                            <input onChange={(e)=>{setTratamientoExtras({...tratamientoExtras, frecuenciaNumber: e.target.value})}} value={tratamientoExtras.nombre} className="form-control col-lg-6"/>
                                                            <select onChange={(e)=>{setTratamientoExtras({...tratamientoExtras, frecuenciaText: e.target.value})}} value={tratamientoExtras.nombre} className="form-control col-lg-6">
                                                                <option value="Minutos">Minutos</option>
                                                                <option value="Horas">Horas</option>
                                                                <option value="Dias">Dias</option>
                                                                <option value="Interdiaria">Interdiaria</option>
                                                                <option value="Semanas">Semanas</option>
                                                                <option value="Meses">Meses</option>
                                                                <option value="Años">Años</option>
                                                            </select>
                                                        </div>
                                                    </div>
                                                    <div className="col-lg-6">
                                                        <div className="mb-2">Durante</div>
                                                        <div className="row no-gutters">
                                                            <input onChange={(e)=>{setTratamientoExtras({...tratamientoExtras, duranteNumber: e.target.value})}} value={tratamientoExtras.nombre} className="form-control col-lg-6"/>
                                                            <select onChange={(e)=>{setTratamientoExtras({...tratamientoExtras, duranteText: e.target.value})}} value={tratamientoExtras.nombre} className="form-control col-lg-6">
                                                                <option value="Horas">Horas</option>
                                                                <option value="Dias">Días</option>
                                                                <option value="Semanas">Semanas</option>
                                                                <option value="Meses">Meses</option>
                                                                <option value="Anos">Años</option>
                                                            </select>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <textarea onChange={(e)=>{setTratamiento({...tratamiento, notaTratamiento: e.target.value})}} value={tratamiento.notaTratamiento} placeholder="Nota del tratamiento" className="my-2 form-control col-lg-12"/>
                                    <div className="form-group mt-3">
                                        <span onClick={()=>{ tratamiento.via && tratamiento.cant && tratamiento.unidad && tratamientoExtras.frecuenciaNumber && tratamientoExtras.duranteNumber ? createTreatment() : console.log("Error") }} 
                                        className={tratamiento.via && tratamiento.cant && tratamiento.unidad && tratamientoExtras.frecuenciaNumber && tratamientoExtras.duranteNumber ? "btn btn-primary btn-block" : "btn btn-disabled btn-block"}>Cargar tratamiento</span>
                                    </div>
                                </>

                                : <div></div>}
                                <div className="row align-items-center justify-content-spacebetween">
                                    <p className="col-lg-4 mb-0">Instrucciones adicionales</p>
                                    <textarea placeholder="Instrucciones adicionales de la consulta" value={episodioValues.instruccionesAdicionalesConsulta} onChange={(e) => setEpisodioValues({...episodioValues, instruccionesAdicionalesConsulta: e.target.value})} className="mt-3 form-control col-lg-8"/>
                                </div>
                                <div className="row align-items-center justify-content-spacebetween">
                                    <p className="col-lg-4 mb-0">Órden especialista</p>
                                    <input placeholder="Nombre de la especialidad" value={episodioValues.ordenEspecialista} onChange={(e) => setEpisodioValues({...episodioValues, ordenEspecialista: e.target.value})} className="mt-3 form-control col-lg-8"/>
                                </div>
                                <div onClick={()=>{ palabrasClave.length > 0 ? saveEpisode() : console.log()}} className={`btn ${ palabrasClave.length > 0 ? "btn-primary" : "btn-disabled"}`}>
                                    Guardar
                                </div>
                            </div>
                        :
                        /* Antecedentes*/
                        <div>

                            <div className="row align-items-center">
                                <div className="col-lg-6">
                                    <h4 className="my-2 col-lg-12">Cuestionario antecedentes</h4>
                                </div>
                                <div className="col-lg-1">
                                    <p className="mb-0 ml-4">Sí</p>
                                </div>
                                <div className="col-lg-4">
                                    <p className="mb-0">Comentario</p>
                                </div>
                            </div>
                            <div className="row align-items-center">
                                <div className="col-lg-6">
                                    <p className="my-2 col-lg-12">Realizas ejercicio</p>
                                </div>
                                <div className="col-lg-1">
                                    <input type="checkbox" value={antecedentesValues.realizasEjercicio.si} onClick={()=>{setAntecedentesValues({...antecedentesValues, realizasEjercicio: {...antecedentesValues.realizasEjercicio, si: !antecedentesValues.realizasEjercicio.si} })}} className="my-4 form-control" />
                                </div>
                                <div className="col-lg-4">
                                    <input value={antecedentesValues.realizasEjercicio.comentario} onChange={(e)=>{setAntecedentesValues({...antecedentesValues, realizasEjercicio: {...antecedentesValues.realizasEjercicio, comentario: e.target.value} })}} className="form-control col-lg-12"/>
                                </div>
                            </div>
                            <div className="row align-items-center">
                                <div className="col-lg-6">
                                    <p className="my-2 col-lg-12">Diabéticos en la familia</p>
                                </div>
                                <div className="col-lg-1">
                                    <input type="checkbox" value={antecedentesValues.diabeticosEnLaFamilia.si} onClick={()=>{setAntecedentesValues({...antecedentesValues, diabeticosEnLaFamilia: {...antecedentesValues.diabeticosEnLaFamilia, si: !antecedentesValues.diabeticosEnLaFamilia.si} })}} className="my-4 form-control" />
                                </div>
                                <div className="col-lg-4">
                                    <input value={antecedentesValues.diabeticosEnLaFamilia.comentario} onChange={(e)=>{setAntecedentesValues({...antecedentesValues, diabeticosEnLaFamilia: {...antecedentesValues.diabeticosEnLaFamilia, comentario: e.target.value} })}} className="form-control col-lg-12"/>
                                </div>
                            </div>
                            <div className="row align-items-center">
                                <div className="col-lg-6">
                                    <p className="my-2 col-lg-12">Cáncer en la familia</p>
                                </div>
                                <div className="col-lg-1">
                                    <input type="checkbox" value={antecedentesValues.cancerEnLaFamilia.si} onClick={()=>{setAntecedentesValues({...antecedentesValues, cancerEnLaFamilia: {...antecedentesValues.cancerEnLaFamilia, si: !antecedentesValues.cancerEnLaFamilia.si} })}} className="my-4 form-control" />
                                </div>
                                <div className="col-lg-4">
                                    <input value={antecedentesValues.cancerEnLaFamilia.comentario} onChange={(e)=>{setAntecedentesValues({...antecedentesValues, cancerEnLaFamilia: {...antecedentesValues.cancerEnLaFamilia, comentario: e.target.value} })}} className="form-control col-lg-12"/>
                                </div>
                            </div>
                            <div className="row align-items-center">
                                <div className="col-lg-6">
                                    <p className="my-2 col-lg-12">Hipertensión en la familia</p>
                                </div>
                                <div className="col-lg-1">
                                    <input type="checkbox" value={antecedentesValues.hipertensionEnLaFamilia.si} onClick={()=>{setAntecedentesValues({...antecedentesValues, hipertensionEnLaFamilia: {...antecedentesValues.hipertensionEnLaFamilia, si: !antecedentesValues.hipertensionEnLaFamilia.si} })}} className="my-4 form-control" />
                                </div>
                                <div className="col-lg-4">
                                    <input value={antecedentesValues.hipertensionEnLaFamilia.comentario} onChange={(e)=>{setAntecedentesValues({...antecedentesValues, hipertensionEnLaFamilia: {...antecedentesValues.hipertensionEnLaFamilia, comentario: e.target.value} })}} className="form-control col-lg-12"/>
                                </div>
                            </div>
                            <div className="row align-items-center">
                                <div className="col-lg-6">
                                    <p className="my-2 col-lg-12">Ingieres bebidas alcohólicas</p>
                                </div>
                                <div className="col-lg-1">
                                    <input type="checkbox" value={antecedentesValues.ingieresBebidasAlcoholicas.si} onClick={()=>{setAntecedentesValues({...antecedentesValues, ingieresBebidasAlcoholicas: {...antecedentesValues.ingieresBebidasAlcoholicas, si: !antecedentesValues.ingieresBebidasAlcoholicas.si} })}} className="my-4 form-control" />
                                </div>
                                <div className="col-lg-4">
                                    <input value={antecedentesValues.ingieresBebidasAlcoholicas.comentario} onChange={(e)=>{setAntecedentesValues({...antecedentesValues, ingieresBebidasAlcoholicas: {...antecedentesValues.ingieresBebidasAlcoholicas, comentario: e.target.value} })}} className="form-control col-lg-12"/>
                                </div>
                            </div>
                            <div className="row align-items-center">
                                <div className="col-lg-6">
                                    <p className="my-2 col-lg-12">Fumas</p>
                                </div>
                                <div className="col-lg-1">
                                    <input type="checkbox" value={antecedentesValues.fumas.si} onClick={()=>{setAntecedentesValues({...antecedentesValues, fumas: {...antecedentesValues.fumas, si: !antecedentesValues.fumas.si} })}} className="my-4 form-control" />
                                </div>
                                <div className="col-lg-4">
                                    <input value={antecedentesValues.fumas.comentario} onChange={(e)=>{setAntecedentesValues({...antecedentesValues, fumas: {...antecedentesValues.fumas, comentario: e.target.value} })}} className="form-control col-lg-12"/>
                                </div>
                            </div>
                            <div className="row align-items-center">
                                <div className="col-lg-6">
                                    <p className="my-2 col-lg-12">Te realizas Check Up cada año</p>
                                </div>
                                <div className="col-lg-1">
                                    <input type="checkbox" value={antecedentesValues.checkUpCadaAno.si} onClick={()=>{setAntecedentesValues({...antecedentesValues, checkUpCadaAno: {...antecedentesValues.checkUpCadaAno, si: !antecedentesValues.checkUpCadaAno.si} })}} className="my-4 form-control" />
                                </div>
                                <div className="col-lg-4">
                                    <input value={antecedentesValues.checkUpCadaAno.comentario} onChange={(e)=>{setAntecedentesValues({...antecedentesValues, checkUpCadaAno: {...antecedentesValues.checkUpCadaAno, comentario: e.target.value} })}} className="form-control col-lg-12"/>
                                </div>
                            </div>
                            <div className="row align-items-center">
                                <div className="col-lg-6">
                                    <p className="my-2 col-lg-12">Has sido contagiado de COVID</p>
                                </div>
                                <div className="col-lg-1">
                                    <input type="checkbox" value={antecedentesValues.contagiadoDeCOVID.si} onClick={()=>{setAntecedentesValues({...antecedentesValues, contagiadoDeCOVID: {...antecedentesValues.contagiadoDeCOVID, si: !antecedentesValues.contagiadoDeCOVID.si} })}} className="my-4 form-control" />
                                </div>
                                <div className="col-lg-4">
                                    <input value={antecedentesValues.contagiadoDeCOVID.comentario} onChange={(e)=>{setAntecedentesValues({...antecedentesValues, contagiadoDeCOVID: {...antecedentesValues.contagiadoDeCOVID, comentario: e.target.value} })}} className="form-control col-lg-12"/>
                                </div>
                            </div>
                            <div className="row align-items-center">
                                <div className="col-lg-6">
                                    <p className="my-2 col-lg-12">Hombre mayor de 45 años, te has realizado la prueba de Ántigeno Prostático</p>
                                </div>
                                <div className="col-lg-1">
                                    <input type="checkbox" value={antecedentesValues.pruebaAntigenoProstatico.si} onClick={()=>{setAntecedentesValues({...antecedentesValues, pruebaAntigenoProstatico: {...antecedentesValues.pruebaAntigenoProstatico, si: !antecedentesValues.pruebaAntigenoProstatico.si} })}} className="my-4 form-control" />
                                </div>
                                <div className="col-lg-4">
                                    <input value={antecedentesValues.pruebaAntigenoProstatico.comentario} onChange={(e)=>{setAntecedentesValues({...antecedentesValues, pruebaAntigenoProstatico: {...antecedentesValues.pruebaAntigenoProstatico, comentario: e.target.value} })}} className="form-control col-lg-12"/>
                                </div>
                            </div>
                            <div className="row align-items-center">
                                <div className="col-lg-6">
                                    <p className="my-2 col-lg-12">Dedicas tiempo al esparcimiento</p>
                                </div>
                                <div className="col-lg-1">
                                    <input type="checkbox" value={antecedentesValues.dedicasTiempoEsparcimiento.si} onClick={()=>{setAntecedentesValues({...antecedentesValues, dedicasTiempoEsparcimiento: {...antecedentesValues.dedicasTiempoEsparcimiento, si: !antecedentesValues.dedicasTiempoEsparcimiento.si} })}} className="my-4 form-control" />
                                </div>
                                <div className="col-lg-4">
                                    <input value={antecedentesValues.dedicasTiempoEsparcimiento.comentario} onChange={(e)=>{setAntecedentesValues({...antecedentesValues, dedicasTiempoEsparcimiento: {...antecedentesValues.dedicasTiempoEsparcimiento, comentario: e.target.value} })}} className="form-control col-lg-12"/>
                                </div>
                            </div>
                            <div className="row align-items-center">
                                <div className="col-lg-6">
                                    <p className="my-2 col-lg-12">Dedicas tiempo de calidad a la familia</p>
                                </div>
                                <div className="col-lg-1">
                                    <input type="checkbox" value={antecedentesValues.dedicasTiempoFamilia.si} onClick={()=>{setAntecedentesValues({...antecedentesValues, dedicasTiempoFamilia: {...antecedentesValues.dedicasTiempoFamilia, si: !antecedentesValues.dedicasTiempoFamilia.si} })}} className="my-4 form-control" />
                                </div>
                                <div className="col-lg-4">
                                    <input value={antecedentesValues.dedicasTiempoFamilia.comentario} onChange={(e)=>{setAntecedentesValues({...antecedentesValues, dedicasTiempoFamilia: {...antecedentesValues.dedicasTiempoFamilia, comentario: e.target.value} })}} className="form-control col-lg-12"/>
                                </div>
                            </div>
                            <div className="row align-items-center">
                                <div className="col-lg-6">
                                    <p className="my-2 col-lg-12">Dedicas tiempo de tu religión</p>
                                </div>
                                <div className="col-lg-1">
                                    <input type="checkbox" value={antecedentesValues.dedicasTiempoReligion.si} onClick={()=>{setAntecedentesValues({...antecedentesValues, dedicasTiempoReligion: {...antecedentesValues.dedicasTiempoReligion, si: !antecedentesValues.dedicasTiempoReligion.si} })}} className="my-4 form-control" />
                                </div>
                                <div className="col-lg-4">
                                    <input value={antecedentesValues.dedicasTiempoReligion.comentario} onChange={(e)=>{setAntecedentesValues({...antecedentesValues, dedicasTiempoReligion: {...antecedentesValues.dedicasTiempoReligion, comentario: e.target.value} })}} className="form-control col-lg-12"/>
                                </div>
                            </div>
                            <div className="row align-items-center">
                                <div className="col-lg-6">
                                    <p className="my-2 col-lg-12">Te consideras</p>
                                </div>
                                <div className="col-lg-2">
                                    <select value={antecedentesValues.teConsideras.valor} onChange={(e)=>{setAntecedentesValues({...antecedentesValues, teConsideras: {...antecedentesValues.teConsideras, valor: e.target.value} })}} className="form-control col-lg-12">
                                        <option value="Vegetariano">Vegetariano</option>
                                        <option value="Carnivoro">Carnívoro</option>
                                    </select>
                                </div>
                                <div className="col-lg-4">
                                    <input value={antecedentesValues.teConsideras.comentario} onChange={(e)=>{setAntecedentesValues({...antecedentesValues, teConsideras: {...antecedentesValues.teConsideras, comentario: e.target.value} })}} className="form-control col-lg-12"/>
                                </div>
                            </div>
                            <div className="row align-items-center">
                                <div className="col-lg-6">
                                    <p className="my-2 col-lg-12">Cuantas horas duermes por la noche</p>
                                </div>
                                <div className="col-lg-2">
                                    <input value={antecedentesValues.cuantasHorasDuermes.valor} onChange={(e)=>{setAntecedentesValues({...antecedentesValues, cuantasHorasDuermes: {...antecedentesValues.cuantasHorasDuermes, valor: e.target.value} })}} className="form-control col-lg-12"/>
                                </div>
                                <div className="col-lg-4">
                                    <input value={antecedentesValues.cuantasHorasDuermes.comentario} onChange={(e)=>{setAntecedentesValues({...antecedentesValues, cuantasHorasDuermes: {...antecedentesValues.cuantasHorasDuermes, comentario: e.target.value} })}} className="form-control col-lg-12"/>
                                </div>
                            </div>
                            <div className="row align-items-center">
                                <div className="col-lg-6">
                                    <p className="my-2 col-lg-12">Que bebida ingieres con más frecuencia</p>
                                </div>
                                <div className="col-lg-2">
                                    <select value={antecedentesValues.bebidaIngieresFrecuencia.valor} onChange={(e)=>{setAntecedentesValues({...antecedentesValues, bebidaIngieresFrecuencia: {...antecedentesValues.bebidaIngieresFrecuencia, valor: e.target.value} })}} className="form-control col-lg-12">
                                        <option value="Agua">Agua</option>
                                        <option value="Refresco">Refresco</option>
                                    </select>
                                </div>
                                <div className="col-lg-4">
                                    <input value={antecedentesValues.bebidaIngieresFrecuencia.comentario} onChange={(e)=>{setAntecedentesValues({...antecedentesValues, bebidaIngieresFrecuencia: {...antecedentesValues.bebidaIngieresFrecuencia, comentario: e.target.value} })}} className="form-control col-lg-12"/>
                                </div>
                            </div>
                            <div className="row align-items-center">
                                <div className="col-lg-6">
                                    <p className="my-2 col-lg-12">Que típo de bebida alcohólica ingieres con más frecuencia</p>
                                </div>
                                <div className="col-lg-2">
                                    <select value={antecedentesValues.bebidaAlcoholicaIngieresFrecuencia.valor} onChange={(e)=>{setAntecedentesValues({...antecedentesValues, bebidaAlcoholicaIngieresFrecuencia: {...antecedentesValues.bebidaAlcoholicaIngieresFrecuencia, valor: e.target.value} })}} className="form-control col-lg-12">
                                        <option value="Alcohol">Alcohol</option>
                                        <option value="Cerveza">Cerveza</option>
                                        <option value="Ambas">Ambas</option>
                                    </select>
                                </div>
                                <div className="col-lg-4">
                                    <input value={antecedentesValues.bebidaAlcoholicaIngieresFrecuencia.comentario} onChange={(e)=>{setAntecedentesValues({...antecedentesValues, bebidaAlcoholicaIngieresFrecuencia: {...antecedentesValues.bebidaAlcoholicaIngieresFrecuencia, comentario: e.target.value} })}} className="form-control col-lg-12"/>
                                </div>
                            </div>
                            <div className="row align-items-center">
                                <div className="col-lg-6">
                                    <p className="my-2 col-lg-12">Cómo consideras tu alimentación</p>
                                </div>
                                <div className="col-lg-2">
                                    <select value={antecedentesValues.considerasTuAlimentacion.valor} onChange={(e)=>{setAntecedentesValues({...antecedentesValues, considerasTuAlimentacion: {...antecedentesValues.considerasTuAlimentacion, valor: e.target.value} })}} className="form-control col-lg-12">
                                        <option value="Buena en cantidad">Buena en cantidad</option>
                                        <option value="Buena en calidad">Buena en calidad</option>
                                    </select>
                                </div>
                                <div className="col-lg-4">
                                    <input value={antecedentesValues.considerasTuAlimentacion.comentario} onChange={(e)=>{setAntecedentesValues({...antecedentesValues, considerasTuAlimentacion: {...antecedentesValues.considerasTuAlimentacion, comentario: e.target.value} })}} className="form-control col-lg-12"/>
                                </div>
                            </div>
                            <div className="row align-items-center">
                                <div className="col-lg-6">
                                    <p className="my-2 col-lg-12">Constitución corporal</p>
                                </div>
                                <div className="col-lg-2">
                                    <select value={antecedentesValues.constitucionCorporal.valor} onChange={(e)=>{setAntecedentesValues({...antecedentesValues, constitucionCorporal: {...antecedentesValues.constitucionCorporal, valor: e.target.value} })}} className="form-control col-lg-12">
                                        <option value="Obesidad">Obesidad</option>
                                        <option value="Sobre peso">Sobre peso</option>
                                        <option value="Normal">Normal</option>
                                    </select>
                                </div>
                                <div className="col-lg-4">
                                    <input value={antecedentesValues.constitucionCorporal.comentario} onChange={(e)=>{setAntecedentesValues({...antecedentesValues, constitucionCorporal: {...antecedentesValues.constitucionCorporal, comentario: e.target.value} })}} className="form-control col-lg-12"/>
                                </div>
                            </div>
                            <div className="row align-items-center">
                                <div className="col-lg-6">
                                    <p className="my-2 col-lg-12">Nivel de estres laboral, o de estilo de vida</p>
                                </div>
                                <div className="col-lg-2">
                                    <select value={antecedentesValues.nivelEstresLaboral.valor} onChange={(e)=>{setAntecedentesValues({...antecedentesValues, nivelEstresLaboral: {...antecedentesValues.nivelEstresLaboral, valor: e.target.value} })}} className="form-control col-lg-12">
                                        <option value="Alto">Alto</option>
                                        <option value="Medio">Medio</option>
                                        <option value="Bajo">Bajo</option>
                                    </select>
                                </div>
                                <div className="col-lg-4">
                                    <input value={antecedentesValues.nivelEstresLaboral.comentario} onChange={(e)=>{setAntecedentesValues({...antecedentesValues, nivelEstresLaboral: {...antecedentesValues.nivelEstresLaboral, comentario: e.target.value} })}} className="form-control col-lg-12"/>
                                </div>
                            </div>
                            <div className="row align-items-center">
                                <div className="col-lg-6">
                                    <p className="my-2 col-lg-12">En una escala del 1 al 10 cómo consideras tu estado de salud en general</p>
                                </div>
                                <div className="col-lg-2">
                                    <input value={antecedentesValues.estadoSalud.valor} onChange={(e)=>{setAntecedentesValues({...antecedentesValues, estadoSalud: {...antecedentesValues.estadoSalud, valor: e.target.value} })}} className="form-control col-lg-12"/>
                                </div>
                                <div className="col-lg-4">
                                    <input value={antecedentesValues.estadoSalud.comentario} onChange={(e)=>{setAntecedentesValues({...antecedentesValues, estadoSalud: {...antecedentesValues.estadoSalud, comentario: e.target.value} })}} className="form-control col-lg-12"/>
                                </div>
                            </div>
                            <div className="row align-items-center">
                                <div className="col-lg-6">
                                    <p className="my-2 col-lg-12">Cuantas horas trabajas al día</p>
                                </div>
                                <div className="col-lg-2">
                                    <input value={antecedentesValues.horasTrabajasDia.valor} onChange={(e)=>{setAntecedentesValues({...antecedentesValues, horasTrabajasDia: {...antecedentesValues.horasTrabajasDia, valor: e.target.value} })}} className="form-control col-lg-12"/>
                                </div>
                                <div className="col-lg-4">
                                    <input value={antecedentesValues.horasTrabajasDia.comentario} onChange={(e)=>{setAntecedentesValues({...antecedentesValues, horasTrabajasDia: {...antecedentesValues.horasTrabajasDia, comentario: e.target.value} })}} className="form-control col-lg-12"/>
                                </div>
                            </div>
                            <div className="row align-items-center">
                                <div className="col-lg-6">
                                    <p className="my-2 col-lg-12">Te movilizas en</p>
                                </div>
                                <div className="col-lg-2">
                                    <select value={antecedentesValues.teMovilizasEn.valor} onChange={(e)=>{setAntecedentesValues({...antecedentesValues, teMovilizasEn: {...antecedentesValues.teMovilizasEn, valor: e.target.value} })}} className="form-control col-lg-12">
                                        <option value="Auto">Auto</option>
                                        <option value="Transporte">Transporte</option>
                                        <option value="Público">Público</option>
                                        <option value="Bicicleta">Bicicleta</option>
                                        <option value="Motocicleta">Motocicleta</option>
                                    </select>
                                </div>
                                <div className="col-lg-4">
                                    <input value={antecedentesValues.teMovilizasEn.comentario} onChange={(e)=>{setAntecedentesValues({...antecedentesValues, teMovilizasEn: {...antecedentesValues.teMovilizasEn, comentario: e.target.value} })}} className="form-control col-lg-12"/>
                                </div>
                            </div>

                            <div className="row no-gutters align-items-center justify-content-spacebetween">
                                <div onClick={()=>{updateAntecedentes()}} className="btn btn-primary">
                                    Actualizar antecedentes
                                </div>
                            </div>
                        </div>
                        /* End Antecedentes*/
                        }
                    </div>
                    {/* End General */}
                    {/* Antecedentes y otros episodios */}
                    <div className="col-lg-4">
                        <div className={antecedentesStatus || antecedentes === undefined ? "d-none" : "antecedentes-box"}>
                            <div className="antecedentes-box-title">
                                Antecedentes
                            </div>
                            <div className="antecedentes-box-p">
                                Lugar de nacimiento: {antecedentes !== undefined ? antecedentes.lugarNacimiento : ""}
                            </div>
                            {/* <div className="antecedentes-box-p">
                                Ha vivido con único dueño
                            </div> */}
                            <div className="antecedentes-box-p">
                                {antecedentes !== undefined ? antecedentes.tipoVivienda : ""}
                            </div>
                            <div className="antecedentes-box-p">
                                {antecedentes !== undefined ? antecedentes.convivenciaAnimales : ""}
                            </div>
                            <div className="antecedentes-box-p">
                                {antecedentes !== undefined ? antecedentes.actividadFisica : ""}
                            </div>
                        </div>
                        { episodios.length > 0 && !antecedentesStatus ? <div className="mt-4 episodes-scroll-wrapper">
                            {episodios.map((epi)=>{
                                let date = moment(epi.fechaConsulta.toDate()).format("ddd, MMM D YYYY").toString()
                                return(
                                    <div className="episodes-container" key={epi.idConsulta}>
                                        <div className="episode-header">{date}</div>
                                        <div className="episode-body">
                                            <p className="episode-title">Motivo de la consulta:</p>
                                            <div className="row no-gutters">
                                                {epi.motivoConsulta.map((mc)=>{
                                                    return (
                                                        <p className="pill-2">{mc}</p>
                                                    )
                                                })}
                                            </div>
                                            <p className="episode-title">Recomendaciones:</p>
                                            <p className="episode-text">{epi.instruccionesAdicionalesConsulta}</p>
                                            <div onClick={()=>{setEpisodeShow(true); setEpisode(epi)}} className="btn btn-block btn-outline-primary">
                                                Ver
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div> : <div></div> }
                    </div>
                    {/* End antecedentes y otros episodios */}
                </div>
            </div>

        </div>
    </MuiPickersUtilsProvider>
    )
    
    async function saveEpisode(){
        let id = Date.now().toString()
        try{
            await firebase.db.collection("Expedientes").doc(data.state.mid).collection("Episodios").doc(id).set({
                idConsulta: id,
                fechaConsulta: fechaConsulta ? fechaConsulta.toDate() : moment().toDate(),
                motivoConsulta: palabrasClave,
                datalleConsulta: episodioValues.datalleConsulta,
                diagnosticoConsulta: episodioValues.diagnosticoConsulta,
                comentariosConsulta: episodioValues.comentariosConsulta,
                instruccionesAdicionalesConsulta: episodioValues.instruccionesAdicionalesConsulta
            }).then((val)=>{
                updateAntecedentes()
            })
        }catch(e){
            console.log(e)
        }
    }
    
    async function updateAntecedentes(){
        let id = Date.now().toString()
        try{
            await firebase.db.collection("Expedientes").doc(data.state.mid).collection("Antecedentes").doc(data.state.mid).set(antecedentesValues)
        }catch(e){
            console.log(e)
        }
    }

    async function saveGeneral(type){
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

export default History