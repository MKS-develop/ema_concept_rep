import React, {useState, useEffect } from 'react'
import { Link, useHistory, useLocation } from 'react-router-dom'
import firebase from '../../firebase/config'
import { MuiPickersUtilsProvider, DatePicker } from '@material-ui/pickers';
import moment from 'moment';
import MomentUtils from '@date-io/moment';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import axios from 'axios';

function History() {
    
    const history = useHistory()
    let data = useLocation();
    const [user, setUser] = useState({})

    const ordenesList = [
        "Hemograma completo",
        "Medicina Nuclear",
        "Mastografía",
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
        "ACICLOVIR 400 MG",
        "ADALIMUMAB 40 MG/ 0",
        "AGUA PARA INYECCIÓN 1",
        "AGUA PARA INYECCIÓN 1",
        "ALPRAZOLAM 1 MG",
        "ALPRAZOLAM 2 MG",
        "ALPRAZOLAM 2 MG",
        "AMBROXOL CLORHIDRATO 30MG/ 5 ML",
        "AMOXICILINA (COMO TRIHIDRATO) 500 MG / 5 ML",
        "AMOXICILINA 875 MG",
        "ATENOLOL 100 MG",
        "ATENOLOL 100 MG",
        "ATENOLOL 100 MG",
        "ATENOLOL 100 MG",
        "ATENOLOL 50 MG",
        "ATENOLOL 50 MG",
        "ATENOLOL 50 MG",
        "ATENOLOL 50 MG",
        "ATENOLOL 50 MG",
        "ATORVASTATINA 10 MG",
        "ATORVASTATINA 20 MG",
        "BENDAMUSTINA CLORHIDRATO  25 MG",
        "BENDAMUSTINA CLORHIDRATO 100 MG",
        "BETAMETASONA 17 VALERATO 0",
        "BETAMETASONA 50 MG / 100 ML",
        "BETASONA ACETATO/ BETASONA 21 FOSFATO SODICO 6-7",
        "BOSENTAN 62",
        "BUDESONIDA- FORMOTEROL FUMARATO 200 MCG - 6 MGC",
        "BUDESONIDA- FORMOTEROL FUMARATO 400 MCG - 12 MCG",
        "BUDESONIDA- FORMOTEROL FUMARATO 400 MCG - 12 MCG",
        "BUPROPION CLORHIDRATO  - NALTREXONA 90 MG   -  8 MG",
        "BUPROPION CLORHIDRATO  - NALTREXONA 90 MG   -  8 MG",
        "BUSERELINA 6",
        "CAFEINA ANHIDRA  -  DOMPERIDONA  -  CLORFENIRAMINA MALEATO  -  ERGOTAMINA TARTRATO  -  DIPIRONA 100 MG - 7 MG - 1 MG - 1 MG - 400 MG",
        "CAFEINA ANHIDRA  -  DOMPERIDONA  -  CLORFENIRAMINA MALEATO  -  ERGOTAMINA TARTRATO  -  DIPIRONA 100 MG - 7 MG - 1 MG - 1 MG - 400 MG",
        "CAPECITABINA 500 MG",
        "CARFILZOMIB 60 MG",
        "CARVEDILOL - HIDROCLOROTIAZIDA 25 MG - 12.5 MG",
        "CARVELIDOL  50 MG",
        "CARVELIDOL 3.125 MG",
        "CARVELIDOL 3.125 MG",
        "CARVELIDOL FOSFATO 10 MG",
        "CETIRIZINA DICLORHIDRATO 10 MG",
        "CLARITROMICINA 1000 MG",
        "CLARITROMICINA 1000 MG",
        "CLINDAMICINA FOSFATO 600 MG / 4 ML",
        "CLOFEDIANOL CLORHIDRATO - BROMHEXINA CLORHIDRATO 140 MG - 20 MG / 100 ML",
        "CLOFEDIANOL CLORHIDRATO - BROMHEXINA CLORHIDRATO 250 MG - 40 MG / 100 ML",
        "CLONAZEPAM 2.5 MG/ML",
        "CLORHIDRATO DE BUPIVACAÖNA 5 MG / 1 ML",
        "CLORURO DE POTASIO 1",
        "COLECALCIFEROL  (VITAMINA D3) 2",
        "COLECALCIFEROL  (VITAMINA D3) 2",
        "DAPSONA 7",
        "DASATINIB 100 MG",
        "DASATINIB 70 MG",
        "DEFLAZACORT 30 MG",
        "DEFLAZACORT 6 MG",
        "DEXAMETASONA 0",
        "DEXMEDETOMIDINA (como Dexmedetomidina Clorhidrato) 200 MCG",
        "DEXMEDETOMIDINA 200 MCG",
        "D-GLUCOSA MONOHIDRATO 10 G / 100 ML",
        "DICLOFENAC SODICO 0.05",
        "DICLOFENAC SODICO 75 MG",
        "DICLOFENAC SODICO 75 MG",
        "DICLOFENACO DIETILAMONICO 23.2 MG",
        "DICLOFENACO DIETILAMONICO 23.2 MG",
        "DICLOFENACO POTASICO - PARACETAMOL 50 MG - 400 MG",
        "DOLUTEGRAVIR 50 MG",
        "DORZOLAMIDA CLORHIDRATO –TIMOLOL MALEATO 0",
        "DOXICILINA 100 MG",
        "ELEXACAFTOR - IVACAFTOR - TEZACAFTOR / IVACAFTOR 100 MG - 75 MG - 50 MG / 150 MG",
        "EMTRICITABINA  -  DARUNAVIR  -  COBICISTAT   -   TENOFOVIR ALAFENAMIDA 200 MG  -  800 MG  -  150 MG  -  10 MG",
        "ENOXAPARINA SODICA 40 MG / 0",
        "ENOXAPARINA SODICA 40 MG/0.4 ML",
        "ENOXAPARINA SODICA 60 MG / 0",
        "ENOXAPARINA SODICA 80 MG / 0",
        "ENZALUTAMIDA 40 MG",
        "ERGOTAMINA TARTRATO  -  CAFEINA ANHIDRA  -  CLORFENIRAMINA MALEATO  -  DIPIRONA  -  METOCLOPRAMIDA CLORHIDRATO 1 MG  -  100 MG  -  1 MG  -  400 MG  -  7",
        "ERGOTAMINA TARTRATO  -  CAFEINA ANHIDRA  -  CLORFENIRAMINA MALEATO  -  DIPIRONA  -  METOCLOPRAMIDA CLORHIDRATO 1 MG  -  100 MG  -  1 MG  -  400 MG  -  7",
        "ERGOTAMINA TARTRATO  -  CAFEINA ANHIDRA  -  CLORFENIRAMINA MALEATO  -  DIPIRONA  -  METOCLOPRAMIDA CLORHIDRATO 1 MG  -  100 MG  -  1 MG  -  400 MG  -  7",
        "ERITROMICINA 0",
        "ERITROMICINA 0",
        "ERITROMICINA LACTOBIONATO 0.01",
        "ERITROMICINA LACTOBIONATO 0.01",
        "ERLOTINIB (COMO E. CLORHIDRATO) 100 MG",
        "ERLOTINIB COMO CLORHIDRATO 150 MG",
        "ERTUGLIFLOZINA - METFORMINA  7",
        "ERTUGLIFLOZINA - METFORMINA 2",
        "ETONOGESTREL - ETINILESTRADIOL 11 MG - 3",
        "EVEROLIMUS 10 MG",
        "EVEROLIMUS 2",
        "EVEROLIMUS 5 MG",
        "FACTOR VIII HUMANO DE LA COAGULACION  500 UI",
        "FINASTERIDE 1 MG",
        "FLUMAZENIL 0",
        "FOLITROPINA ALFA 300 UI",
        "FOLITROPINA ALFA 300 UI",
        "FOLITROPINA ALFA 300 UI",
        "FOLITROPINA ALFA 900 UI",
        "FOLITROPINA ALFA 900 UI",
        "FOLITROPINA ALFA 900 UI",
        "FOSFATO SODICO DE DEXAMETASONA  -  SULFATO DE NEOMICINA  -  CLORFERINAMINA MALEATO  -  NAFAZOLINA CLORHIDRATO 5 MG / 100 ML  -  500 MG / 100 ML  -  100 MG / 100 ML  -  100 MG / 100 ML",
        "FUROSEMIDA 40 MG",
        "GEFITINIB 250 MG / DOSIS",
        "GLATIRAMER ACETATO 40 MG / ML",
        "GLICAZIDA 30 MG",
        "GLICAZIDA 60 MG",
        "HIDROCLOROTIAZIDA 25 MG",
        "HIDROCORTISONA-LIDOCAINA CLORHIDRATO- CIPROFLOXACINA  1 G/100 ML - 5 G / 100 ML- 0",
        "IBUPROFENO + PARACETAMOL 200 MG + 500 MG",
        "IBUPROFENO 0.04",
        "IBUPROFENO 2000 MG",
        "IBUPROFENO 4G/100ML",
        "IFOSFAMIDA 1 G",
        "IMATINIB 400 MG",
        "INSULINA GLARGINA 100 UI / ML",
        "INSULINA GLULISINA 3",
        "INSULINA HUMANA ISOFANA 100 UI / ML",
        "ISAVUCONAZOL 100 MG",
        "ISAVUCONAZOL 200 MG",
        "ITRACONAZOL 50 MG",
        "KETOCONAZOL 0",
        "KETOCONAZOL 0",
        "LAMIVUDINA  - TENOFOVIR DISOPROXIL FUMARATO 300 MG - 300 MG",
        "LAPATINIB DITOSILATO MONOHIDRATO (como LAPATINIB) 405 MG",
        "L-ASPARAGINASA RECOMBINANTE 10.000 U",
        "LATANOPROST 0.00005",
        "LENALIDOMIDA 10 MG",
        "LENALIDOMIDA 15 MG",
        "LENALIDOMIDA 25 MG",
        "LENALIDOMIDA 5 MG",
        "LIDOCAINA COMO LIDOCAINA CLORHIDRATO 0.01",
        "LIDOCAINA COMO LIDOCAINA CLORHIDRATO 0.02",
        "LIDOCAÍNA CLORHIDRATO 0.02",
        "LINACLOTIDA 72 MCG",
        "LINACLOTIDA 72 MCG",
        "LORATADINA 1 MG/ML",
        "LORATADINA 10 MG",
        "LORATADINA 10 MG",
        "LORATADINA 100 MG / 100 ML",
        "LOSARTAN POTASICO – AMLODIPINO (COMO BESILATO) 100 MG – 5 MG",
        "LOSARTAN POTASICO – AMLODIPINO (COMO BESILATO) 50 MG – 5 MG",
        "LOSARTAN POTASICO 50 MG",
        "LOSARTAN POTASICO 50 MG",
        "MEPREDNISONA 40 MG",
        "MEPREDNISONA 8 MG",
        "MEROPENEM (COMO TRIHIDRATO) 1 G",
        "MEROPENEM (COMO TRIHIDRATO) 500 MG",
        "MESALAZINA 4 G",
        "MESALAZINA 500 MG",
        "METOCLOPRAMIDA 10 MG",
        "MIDAZOLAM 15 MG/3 ML",
        "MIDAZOLAM 15 MG/3 ML",
        "MIDAZOLAM 15 MG/3 ML",
        "MONTELUKAST (como MONTELUKAST SàDICO)-LEVOCETIRIZINA     DICLORHIDRATO 10 MG - 5 MG",
        "MONTELUKAST 10 MG",
        "MONTELUKAST 5 MG",
        "NIMOTUZUMAB 50 MG",
        "NITISINONA 20 MG",
        "PALBOCICLIB 100 MG",
        "PALBOCICLIB 125 MG",
        "PALBOCICLIB 75 MG",
        "PARACETAMOL 10 G / 100 ML",
        "PARACETAMOL 10 Gÿ/ 100 ML",
        "PARACETAMOL 500 MG",
        "PAZOPANIB 200 MG",
        "PAZOPANIB 400 MG",
        "PIRFENIDONA 200 MG",
        "PIRFENIDONA 200 MG",
        "PIRFENIDONA 801 MG",
        "PIRFENIDONA 801 MG",
        "PIRIDOXINA CLORHIDRATO/ DOXILAMINA SUCCINATO 10 MG /10 MG",
        "PIRIDOXINA CLORHIDRATO/ DOXILAMINA SUCCINATO 10 MG /10 MG",
        "POMALIDOMIDA 1 MG",
        "POMALIDOMIDA 2 MG",
        "POMALIDOMIDA 3 MG",
        "POMALIDOMIDA 4 MG",
        "PREGABALINA 150 MG",
        "PREGABALINA 150 MG",
        "PREGABALINA 150 MG",
        "PREGABALINA 150 MG",
        "PREGABALINA 25 MG",
        "PREGABALINA 25 MG",
        "PREGABALINA 300 MG",
        "PREGABALINA 300 MG",
        "PREGABALINA 50 MG",
        "PREGABALINA 50 MG",
        "PREGABALINA 75 MG",
        "PREGABALINA 75 MG",
        "PREGABALINA 75 MG",
        "PREGABALINA 75 MG",
        "PREGABALINA 75 MG",
        "PREGABALINA 75 MG",
        "RALTEGRAVIR (COMO RALTEGRAVIR POTÁSICO) 100 MG / SOBRE",
        "RANITIDINA - CINITRAPRIDA 150 MG – 1 MG",
        "RANITIDINA 50 MG / 5 ML   -  1500 MG / 5 ML",
        "RIFAMPICINA 100 MG / 5 ML",
        "RITUXIMAB 10 MG/ML",
        "RITUXIMAB 10 MG/ML",
        "RIVAROXABAN 10 MG",
        "RIVAROXABAN 20 MG",
        "RIVAROXABAN 30 MG",
        "ROSUVASTATINA 20 MG",
        "RUCAPARIB 300 MG",
        "SERTRALINA (COMO SERTRALINA CLORHIDRATO) 100 MG",
        "SERTRALINA (COMO SERTRALINA CLORHIDRATO) 100 MG",
        "SERTRALINA (COMO SERTRALINA CLORHIDRATO) 100 MG",
        "SERTRALINA (COMO SERTRALINA CLORHIDRATO) 50 MG",
        "SERTRALINA (COMO SERTRALINA CLORHIDRATO) 50 MG",
        "SERTRALINA (COMO SERTRALINA CLORHIDRATO) 50 MG",
        "TADALAFILO 20 MG",
        "TADALAFILO 20 MG",
        "TALAZOPARIB 0",
        "TALAZOPARIB 1 MG",
        "TELMISARTÁN  -  HIDROCLOROTIAZIDA 80 MG  -  12",
        "TIMOLOL MALEATO - LATANOPROST 5 MG /ML - 50 MCG/ML",
        "TOFACITINIB 5 MG",
        "TROPICAMIDA 0.01",
        "ULIPRISTAL ACETATO 5 MG",
        "UPADACITINIBÿ 30 MG",
        "VACUNA ANTIGRIPAL TETRAVALENTE VS",
        "VALGANCICLOVIR 450 MG",
        "VALSARTAN 160 MG",
        "VALSARTAN 80 MG",
        "VENETOCLAX 10 MG",
        "VENETOCLAX 50 MG",
    ]

    let todayDate = moment().format("ddd, MMM D YYYY").toString()
    const [success, setSuccess] = useState(false)
    const [sucessMessage, setSucessMessage] = useState("")

    const [error, setError] = useState(false)
    const [errorMessage, setErrorMessage] = useState("")

    const [fechaPeso, setFechaPeso] = useState(null)
    const [fechaTemperatura, setFechaTemperatura] = useState(null)
    const [fechaTalla, setFechaTalla] = useState(null)
    const [fechaFrecuenciaResp, setFechaFrecuenciaResp] = useState(null)
    const [fechaFrecuenciaCard, setFechaFrecuenciaCard] = useState(null)
    const [fechaPresionArterial, setFechaPresionArterial] = useState(null)
    
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
    const [tipoEntrega, setTipoEntrega] = useState("")
    const [palabrasClave, setPalabrasClave] = useState([])
    const [ordenesEstudio, setOrdenesEstudio] = useState([])
    const [tratamientos, setTratamientos] = useState([])
    const [tiposPatologiasNew, setTiposPatologiasNew] = useState([])
    const [medicamentosNew, setMedicamentosNew] = useState([])
    const [ordenEstudio, setOrdenEstudio] = useState("")
    const [antecedentes, setAntecedentes] = useState({})
    const [episodios, setEpisodios] = useState([])
    const [episode, setEpisode] = useState({})
    const [docAntecedentes, setDocAntecedentes] = useState({})
    

    const [antecedentesModal, setAntecedentesModal] = useState(false)
    const [episodioStatus, setEpisodioStatus] = useState(true)
    const [eventoStatus, setEventoStatus] = useState(false)
    const [listoConsulta, setListoConsulta] = useState(false)
    const [antecedentesStatus, setAntecedentesStatus] = useState(false)
    const [patient, setPatient] = useState({})
    const [episodioSelected, setEpisodioSelected] = useState(null)
    const [alergias, setAlergias] = useState([])
    const [ordenComentario, setOrdenComentario] = useState("")
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
        notaTratamiento: ""
    })
    
    const [tratamientoExtras, setTratamientoExtras] = useState({
        frecuenciaNumber: null,
        frecuenciaText: null,
        duranteNumber: null,
        duranteText: null,
    })
    
    
    const [anteFisicoValues, setAnteFisicoValues] = useState({
        inspeccionGeneral: "",
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
        detalleConsulta: "",
        diagnosticoConsulta: "",
        comentariosConsulta: "",
        instruccionesAdicionalesConsulta: "",
        ordenEspecialista: "",
    })
    
    const [valores, setValores] = useState({
        talla: "",
        peso: "",
        temperatura: "",
        frecuenciaResp: "",
        frecuenciaCard: "",
        presionArt: "",
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

    const getPatient = async(uid) => {
        let patologias = []
        try {
            firebase.db.collection("Dueños").doc(uid).get().then((val)=>{
                setPatient(val.data())
            })
            firebase.db.collection("Expedientes").doc(uid).collection("Antecedentes").doc(uid).onSnapshot((val)=>{
                setDocAntecedentes(val.data())
            })
            firebase.db.collection("Expedientes").doc(uid).collection("Patologia").onSnapshot((val)=>{
                val.docs.forEach((doc)=>{
                    patologias.push(doc.data())
                })
                setPatologias(patologias)
            })
            firebase.db.collection("Expedientes").doc(uid).collection("Episodios").onSnapshot((val) => {
                let tipos = []
                if (val.docs.length > 0) {
                    setEpisodiosBool(true)
                    Promise.all(val.docs.map(async (doc) => {
                        tipos.push(doc.data())
                    }))
                    setEpisodios(tipos.sort((a, b) => b.fechaConsulta - a.fechaConsulta))
                }
            });
            firebase.db.collection("Expedientes").doc(uid).collection("Antecedentes").doc(uid).get().then((val)=>{
                setAntecedentes(val.data())
            })
        } catch (e) {
            console.log(`Error: ${e}`)
        }
    }

    function createOrden(){

        let orden = {}
        orden["ordenEstudio"] = ordenEstudio
        orden["ordenComentario"] = ordenComentario
        setOrdenesEstudio([...ordenesEstudio, orden])
        setOrdenComentario("")
        setOrdenEstudio("Seleccionar orden:")
    }
    
    function createTreatment(){

        var frecuencia = `${tratamientoExtras.frecuenciaNumber} ${tratamientoExtras.frecuenciaText}`
        var durante = `${tratamientoExtras.duranteNumber} ${tratamientoExtras.duranteText}`
        
        tratamiento.frecuencia = frecuencia
        tratamiento.durante = durante
        tratamiento["frecuenciaNumber"] = tratamientoExtras.frecuenciaNumber
        tratamiento["frecuenciaText"] = tratamientoExtras.frecuenciaText
        tratamiento["duranteNumber"] = tratamientoExtras.duranteNumber
        tratamiento["duranteText"] = tratamientoExtras.duranteText

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

    const SuccessComponent = ({msg}) => {
        return (
            <div className="success-alert">
                <span className="material-icons mr-2">done</span>
                {msg}
                <div onClick={()=>{setSuccess(false)}} className="material-icons ml-2">close</div>
            </div>
        )
    }
    
    const ErrorComponent = ({msg}) => {
        return (
            <div className="error-alert">
                <span className="material-icons mr-2">error</span>
                {msg}
                <div onClick={()=>{setError(false)}} className="material-icons ml-2">close</div>
            </div>
        )
    }

    useEffect(() => {
        firebase.getCurrentUser().then((val)=>{
          setUser(val)
          getPatient(data.state["isOwner"] ? data.state.uid : data.state.mid)
        });
    }, [])

    return (
    <MuiPickersUtilsProvider utils={MomentUtils}>
        <div className="main-content-container container-fluid px-4">
            {success && <SuccessComponent msg={sucessMessage === "" ? "Consulta guardada exitosamente" : sucessMessage}/>}
            {error && <ErrorComponent msg={errorMessage === "" ? "Ha ocurrido un error" : errorMessage}/>}
            { episodeShow && <div className="cc-modal-wrapper fadeIn">
              <div className="cc-modal cc-modal-scroll">
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
                            <p className="color-primary mb-1">{episode.detalleConsulta === "" ? "" : "Detalle de la consulta:"}</p>
                            <p>{episode.detalleConsulta}</p>
                        </div>
                        <div>
                            <p className="color-primary mb-1">{episode.diagnosticoConsulta === "" ? "" : "Diagnostico de la consulta:"}</p>
                            <p>{episode.diagnosticoConsulta}</p>
                        </div>
                        <div>
                            <p className="color-primary mb-1">{episode.instruccionesAdicionalesConsulta === "" ? "" : "Instrucciones adicionales de la consulta:"}</p>
                            <p>{episode.instruccionesAdicionalesConsulta}</p>
                        </div>
                        { episode.ordenesEstudio !== undefined && <div>
                            <p className="color-primary mb-1">{episode.ordenesEstudio.length > 0 && "Órdenes de estudio:"}</p>
                            <div className="row no-gutters">
                                {episode.ordenesEstudio.map((mc, i)=>{
                                    return (
                                        <div className="pill-2 rounded" key={i}>
                                            <p className="mb-1 strong">{mc.ordenEstudio}</p>
                                            <p className="mb-0 light">{mc.ordenComentario} </p>
                                        </div>
                                        )
                                    })}
                            </div>
                        </div>
                        }
                        { episode.signosVitales !== undefined && <div>
                            <p className="color-primary mb-1">{ episode.signosVitales.peso !== "" 
                            && episode.signosVitales.temperatura !== "" 
                            && episode.signosVitales.frecuenciaResp !== "" 
                            && episode.signosVitales.frecuenciaCard !== "" 
                            && episode.signosVitales.presionArt !== "" 
                            ? "Signos vitales:" : ""}</p>
                            {episode.signosVitales.peso && <p className="mb-1" >Peso: {episode.signosVitales.peso} - { moment(episode.signosVitalesFechas[0].toDate()).format("ddd, D MMM YYYY").toString() } </p>}
                            {episode.signosVitales.temperatura && <p className="mb-1" >Temperatura: {episode.signosVitales.temperatura} - { moment(episode.signosVitalesFechas[1].toDate()).format("ddd, MMM D YYYY").toString() } </p>}
                            {episode.signosVitales.frecuenciaResp && <p className="mb-1" >Frecuencia respiratoria: {episode.signosVitales.frecuenciaResp} - { moment(episode.signosVitalesFechas[2].toDate()).format("ddd, D MMM YYYY").toString() } </p>}
                            {episode.signosVitales.frecuenciaCard && <p className="mb-1" >Frecuencia cardiaca: {episode.signosVitales.frecuenciaCard} - { moment(episode.signosVitalesFechas[3].toDate()).format("ddd, D MMM YYYY").toString() } </p>}
                            {episode.signosVitales.presionArt && <p className="mb-1" >Presion arterial: {episode.signosVitales.presionArt} - { moment(episode.signosVitalesFechas[4].toDate()).format("ddd, D MMM YYYY").toString() } </p>}
                        </div> } 
                        { episode.tratamientos !== undefined && <div>
                            <p className="color-primary mt-3 mb-1">{episode.tratamientos.length > 0 && "Tratamientos:"}</p>
                            <div className="row no-gutters">
                                {episode.tratamientos.map((tratamiento, i)=>{
                                    return (
                                        <div className="border-bottom" >                                        
                                            <p className="mb-0">{tratamiento.nombre}</p>
                                            <div className="row col-lg-12" key={i}>
                                                <p className="mb-0 mr-2">Cantidad: {tratamiento.cant}, </p>
                                                <p className="mb-0 mr-2">Durante: {tratamiento.durante}, </p>
                                                <p className="mb-0 mr-2">Frecuencia: {tratamiento.frecuencia}, </p>
                                                <p className="mb-0 mr-2">Unidad: {tratamiento.unidad}, </p>
                                                <p className="mb-0 mr-2">Via: {tratamiento.via}, </p>
                                            </div>
                                            <p className="mb-0">{tratamiento.notaTratamiento}</p>
                                        </div>
                                    )
                                })}
                            </div>
                        </div> }
                    </div>
                </div>
                <div className="cc-modal-footer align-items-center justify-content-spacebetween">
                  {/* <button onClick={()=>{setEpisodeShow(false)}} className={`btn btn-disabled`}>
                    Cancelar
                  </button> */}
                  <button onClick={()=>{setEpisodeShow(false)}} className={`btn btn-primary `}>
                    Volver
                  </button>
                </div>
              </div>
            </div>}
            { listoConsulta && <div className="cc-modal-wrapper fadeIn">
                <div className="c2-modal">
                    <div className="cc-modal-header mb-2">
                        <h3 className="mb-0">Episodio creado exitosamente</h3>
                    </div>
                    <div className="c2-modal-body">
                       <p className="mb-0">
                           ¿Desea cerrar la atención y volver a la agenda?
                       </p>
                    </div>
                    <div className="cc-modal-footer align-items-center justify-content-spacebetween">
                      <button onClick={()=>{setListoConsulta(false)}} className="btn btn-outline-secondary">
                        No
                      </button>
                      <button onClick={()=>{
                          history.push({
                            // state: {roleId: data.state.roleId},
                            pathname: "/clients"
                        })
                      }} className={`btn btn-primary`}>
                        Sí
                      </button>
                    </div>
                </div>
            </div>}
            { antecedentesModal && <div className="cc-modal-wrapper fadeIn">
              <div className="cc-modal cc-modal-scroll">
                <div className="cc-modal-header mb-2">
                  <div className="no-gutters mb-3 row align-items-center justify-content-spacebetween">
                    <h3 className="mb-0">Antecedentes</h3>
                  </div>
                </div>
                <div className="cc-modal-body">
                    <div className="col-lg-12"> 
                        <div className="my-3">
                            <p className="mb-0 color-primary bold ">Realizas ejercicio</p>
                            <p className="mb-0" >{docAntecedentes.realizasEjercicio.si ? "Sí" : "No" }</p>
                            <p className="mb-0" >{docAntecedentes.realizasEjercicio.comentario}</p>
                        </div>
                        <div className="my-3">
                            <p className="mb-0 color-primary bold ">Diabéticos en la familia</p>
                            <p className="mb-0" >{docAntecedentes.diabeticosEnLaFamilia.si ? "Sí" : "No" }</p>
                            <p className="mb-0" >{docAntecedentes.diabeticosEnLaFamilia.comentario}</p>
                        </div>
                        <div className="my-3">
                            <p className="mb-0 color-primary bold ">Cáncer en la familia</p>
                            <p className="mb-0" >{docAntecedentes.cancerEnLaFamilia.si ? "Sí" : "No" }</p>
                            <p className="mb-0" >{docAntecedentes.cancerEnLaFamilia.comentario}</p>
                        </div>
                        <div className="my-3">
                            <p className="mb-0 color-primary bold ">Hipertensión en la familia</p>
                            <p className="mb-0" >{docAntecedentes.hipertensionEnLaFamilia.si ? "Sí" : "No" }</p>
                            <p className="mb-0" >{docAntecedentes.hipertensionEnLaFamilia.comentario}</p>
                        </div>
                        <div className="my-3">
                            <p className="mb-0 color-primary bold ">Ingieres bebidas alcohólicas</p>
                            <p className="mb-0" >{docAntecedentes.ingieresBebidasAlcoholicas.si ? "Sí" : "No" }</p>
                            <p className="mb-0" >{docAntecedentes.ingieresBebidasAlcoholicas.comentario}</p>
                        </div>
                        <div className="my-3">
                            <p className="mb-0 color-primary bold ">Fumas</p>
                            <p className="mb-0" >{docAntecedentes.fumas.si ? "Sí" : "No" }</p>
                            <p className="mb-0" >{docAntecedentes.fumas.comentario}</p>
                        </div>
                        <div className="my-3">
                            <p className="mb-0 color-primary bold ">Te realizas Check Up cada año</p>
                            <p className="mb-0" >{docAntecedentes.checkUpCadaAno.si ? "Sí" : "No" }</p>
                            <p className="mb-0" >{docAntecedentes.checkUpCadaAno.comentario}</p>
                        </div>
                        <div className="my-3">
                            <p className="mb-0 color-primary bold ">Has sido contagiado de COVID</p>
                            <p className="mb-0" >{docAntecedentes.contagiadoDeCOVID.si ? "Sí" : "No" }</p>
                            <p className="mb-0" >{docAntecedentes.contagiadoDeCOVID.comentario}</p>
                        </div>
                        <div className="my-3">
                            <p className="mb-0 color-primary bold ">Hombre mayor de 45 años, te has realizado la prueba de Ántigeno Prostático</p>
                            <p className="mb-0" >{docAntecedentes.pruebaAntigenoProstatico.si ? "Sí" : "No" }</p>
                            <p className="mb-0" >{docAntecedentes.pruebaAntigenoProstatico.comentario}</p>
                        </div>
                        <div className="my-3">
                            <p className="mb-0 color-primary bold ">Dedicas tiempo al esparcimiento</p>
                            <p className="mb-0" >{docAntecedentes.dedicasTiempoEsparcimiento.si ? "Sí" : "No" }</p>
                            <p className="mb-0" >{docAntecedentes.dedicasTiempoEsparcimiento.comentario}</p>
                        </div>
                        <div className="my-3">
                            <p className="mb-0 color-primary bold ">Dedicas tiempo de calidad a la familia</p>
                            <p className="mb-0" >{docAntecedentes.dedicasTiempoFamilia.si ? "Sí" : "No" }</p>
                            <p className="mb-0" >{docAntecedentes.dedicasTiempoFamilia.comentario}</p>
                        </div>
                        <div className="my-3">
                            <p className="mb-0 color-primary bold ">Dedicas tiempo de tu religión</p>
                            <p className="mb-0" >{docAntecedentes.dedicasTiempoReligion.si ? "Sí" : "No" }</p>
                            <p className="mb-0" >{docAntecedentes.dedicasTiempoReligion.comentario}</p>
                        </div>
                        <div className="my-3">
                            <p className="mb-0 color-primary bold ">Te consideras</p>
                            <p className="mb-0" >{docAntecedentes.teConsideras.valor}</p>
                            <p className="mb-0" >{docAntecedentes.teConsideras.comentario}</p>
                        </div>
                        <div className="my-3">
                            <p className="mb-0 color-primary bold ">Cuantas horas duermes por la noche</p>
                            <p className="mb-0" >{docAntecedentes.cuantasHorasDuermes.valor}</p>
                            <p className="mb-0" >{docAntecedentes.cuantasHorasDuermes.comentario}</p>
                        </div>
                        <div className="my-3">
                            <p className="mb-0 color-primary bold ">Que bebida ingieres con más frecuencia</p>
                            <p className="mb-0" >{docAntecedentes.bebidaIngieresFrecuencia.valor}</p>
                            <p className="mb-0" >{docAntecedentes.bebidaIngieresFrecuencia.comentario}</p>
                        </div>
                        <div className="my-3">
                            <p className="mb-0 color-primary bold ">Que típo de bebida alcohólica ingieres con más frecuencia</p>
                            <p className="mb-0" >{docAntecedentes.bebidaAlcoholicaIngieresFrecuencia.valor}</p>
                            <p className="mb-0" >{docAntecedentes.bebidaAlcoholicaIngieresFrecuencia.comentario}</p>
                        </div>
                        <div className="my-3">
                            <p className="mb-0 color-primary bold ">Cómo consideras tu alimentación</p>
                            <p className="mb-0" >{docAntecedentes.considerasTuAlimentacion.valor}</p>
                            <p className="mb-0" >{docAntecedentes.considerasTuAlimentacion.comentario}</p>
                        </div>
                        <div className="my-3">
                            <p className="mb-0 color-primary bold ">Constitución corporal</p>
                            <p className="mb-0" >{docAntecedentes.constitucionCorporal.valor}</p>
                            <p className="mb-0" >{docAntecedentes.constitucionCorporal.comentario}</p>
                        </div>
                        <div className="my-3">
                            <p className="mb-0 color-primary bold ">Nivel de estres laboral, o de estilo de vida</p>
                            <p className="mb-0" >{docAntecedentes.nivelEstresLaboral.valor}</p>
                            <p className="mb-0" >{docAntecedentes.nivelEstresLaboral.comentario}</p>
                        </div>
                        <div className="my-3">
                            <p className="mb-0 color-primary bold ">En una escala del 1 al 10 cómo consideras tu estado de salud en general</p>
                            <p className="mb-0" >{docAntecedentes.estadoSalud.valor}</p>
                            <p className="mb-0" >{docAntecedentes.estadoSalud.comentario}</p>
                        </div>
                        <div className="my-3">
                            <p className="mb-0 color-primary bold ">Cuantas horas trabajas al día</p>
                            <p className="mb-0" >{docAntecedentes.horasTrabajasDia.valor}</p>
                            <p className="mb-0" >{docAntecedentes.horasTrabajasDia.comentario}</p>
                        </div>
                        <div className="my-3">
                            <p className="mb-0 color-primary bold ">Te movilizas en</p>
                            <p className="mb-0" >{docAntecedentes.teMovilizasEn.valor}</p>
                            <p className="mb-0" >{docAntecedentes.teMovilizasEn.comentario}</p>
                        </div>
                    </div>
                </div>
                <div className="cc-modal-footer align-items-center justify-content-spacebetween">
                  <button onClick={()=>{setAntecedentesModal(false)}} className={`btn btn-disabled`}>
                    Cerrar
                  </button>
                </div>
              </div>
            </div>}
            { examFisi && <div className="cc-modal-wrapper fadeIn">
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
                  <button onClick={()=>{setExamFisi(false);}} className={`btn btn-primary`}>
                    Guardar
                  </button>
                </div>
              </div>
            </div>}
            { signosVitalesStatus && <div className="cc-modal-wrapper fadeIn">
              <div className="cc-modal">
                <div className="cc-modal-header mb-2">
                  <div className="no-gutters mb-3 row align-items-center justify-content-spacebetween">
                    <h3 className="mb-0">Signos vitales</h3>
                  </div>
                </div>
                <div className="cc-modal-body">
                    <div className="col-lg-12 px-5">
                        <div className="row mb-4 align-items-center justify-content-spacebetween">
                            <input value={valores.talla} onChange={(e)=>{setValores({...valores, talla: e.target.value})}} type="text" className="form-control  col-lg-4" placeholder="Talla (mts)"/>
                            <div className="col-lg-5 spe-input">
                            <DatePicker
                                className="col-lg-12"
                                format="ddd, MMM D YYYY"
                                placeholder={todayDate}
                                maxDate={moment().toDate()}
                                label=""
                                okLabel="Listo"
                                cancelLabel="Cancelar"
                                value={fechaTalla}
                                onChange={setFechaTalla}
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
                            <input value={valores.frecuenciaResp} onChange={(e)=>{setValores({...valores, frecuenciaResp: e.target.value})}} type="text" className="form-control  col-lg-4" placeholder="Frecuencia respiratoria"/>
                            <div className="col-lg-5 spe-input">
                            <DatePicker
                                className="col-lg-12"
                                format="ddd, MMM D YYYY"
                                placeholder={todayDate}
                                maxDate={moment().toDate()}
                                label=""
                                okLabel="Listo"
                                cancelLabel="Cancelar"
                                value={fechaFrecuenciaResp}
                                onChange={setFechaFrecuenciaResp}
                                animateYearScrolling
                            />
                            </div>
                        </div>
                        <div className="row mb-4 align-items-center justify-content-spacebetween">
                            <input value={valores.frecuenciaCard} onChange={(e)=>{setValores({...valores, frecuenciaCard: e.target.value})}} type="text" className="form-control  col-lg-4" placeholder="Frecuencia cardiaca"/>
                            <div className="col-lg-5 spe-input">
                            <DatePicker
                                className="col-lg-12"
                                format="ddd, MMM D YYYY"
                                placeholder={todayDate}
                                maxDate={moment().toDate()}
                                label=""
                                okLabel="Listo"
                                cancelLabel="Cancelar"
                                value={fechaFrecuenciaCard}
                                onChange={setFechaFrecuenciaCard}
                                animateYearScrolling
                            />
                            </div>
                        </div>
                        <div className="row mb-4 align-items-center justify-content-spacebetween">
                            <input value={valores.presionArt} onChange={(e)=>{setValores({...valores, presionArt: e.target.value})}} type="text" className="form-control  col-lg-4" placeholder="Presión arterial"/>
                            <div className="col-lg-5 spe-input">
                            <DatePicker
                                className="col-lg-12"
                                format="ddd, MMM D YYYY"
                                placeholder={todayDate}
                                maxDate={moment().toDate()}
                                label=""
                                okLabel="Listo"
                                cancelLabel="Cancelar"
                                value={fechaPresionArterial}
                                onChange={setFechaPresionArterial}
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
            </div>}
            <div className="page-header align-items-center justify-content-spacebetween row no-gutters px-4 my-4">
                <div className="col-12 col-sm-5 text-center text-sm-left mb-0">
                    <div className="row align-items-center">
                        <div className="col">
                            <p className="page-title bold row"><Link className="color-white mr-3 light" to="/clients">Pacientes</Link> <p className="color-white light mb-0 cursor-pointer" onClick={()=>{
                                history.push({
                                  pathname: "/clients/client",
                                  state: {uid: data.state.uid}
                                })
                            }}
                            >Paciente</p> <span>Expediente médico</span> </p>
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
                {/* <div className="row box-info-wrapper align-items-center justify-content-spacebetween">
                    <div className="col-lg-4">
                        <div className="box-info text-center">
                            <img src={patient.url} className="box-info-img"/>
                        </div>
                    </div>
                    <div className="col-lg-4">
                        <div className="box-info">
                            <p className="mb-0 box-info-p strong">{patient.nombre}</p>
                        </div>
                    </div>
                </div> */}
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
                                <div className="creation-card mb-2 border py-1 row align-items-center justify-content-spacebetween">
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
                                <div className="creation-card mb-2 border py-1 row align-items-center justify-content-spacebetween">
                                    <p className="col-lg-4 mb-0">Motivo de la consulta</p>
                                    <div className="form-group col-lg-4 mt-3">
                                      <input value={palabra} type="text" onChange={e=>{setPalabra(e.target.value)}} placeholder="Dolor de cabeza" className="form-control"/>
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
                                <div className="creation-card mb-2 border py-1 row align-items-center justify-content-spacebetween">
                                    <p className="col-lg-4 mb-0">Detalle</p>
                                    <textarea placeholder="Detalle de la consulta" value={episodioValues.detalleConsulta}
                                        onChange={(e) => setEpisodioValues({...episodioValues, detalleConsulta: e.target.value})} className="mt-3 form-control col-lg-8"/>
                                </div>
                                <div className="creation-card mb-2 border py-1 row align-items-center justify-content-spacebetween">
                                    <p className="col-lg-7 mb-0">Examen físico</p>
                                    <div onClick={()=>{setExamFisi(true)}} className="mt-3 btn btn-secondary col-lg-3">Ver</div>
                                </div>
                                <div className="creation-card mb-2 border py-1 row align-items-center justify-content-spacebetween">
                                    <p className="col-lg-7 mb-0">Signos vitales</p>
                                    <div onClick={()=>{setSignosVitalesStatus(true)}} className="mt-3 btn btn-secondary col-lg-3">Ver</div>
                                </div>
                                <div className="creation-card mb-2 border py-1 row align-items-center justify-content-spacebetween">
                                    <p className="col-lg-7 mb-0">Diagnostico</p>
                                    <div className="mt-3 col-lg-4 custom-dropdown">
                                      <input value={episodioValues.diagnosticoConsulta} onChange={(e)=>{ setEpisodioValues({...episodioValues, diagnosticoConsulta: e.target.value}) }} className="form-control"/>
                                    </div>
                                </div>
                                <div className="creation-card mb-2 border py-1 row align-items-center justify-content-spacebetween">
                                    <p className="col-lg-4 mb-0">Comentarios</p>
                                    <textarea placeholder="Comentarios adicionales de la consulta" value={episodioValues.comentariosConsulta} onChange={(e) => setEpisodioValues({...episodioValues, comentariosConsulta: e.target.value})} className="mt-3 form-control col-lg-8"/>
                                </div>
                                <div className="creation-card mb-2 border py-1 row align-items-center justify-content-spacebetween">
                                    <p className="col-lg-4 mb-0">Órdenes para estudios</p>
                                    <select id="ordenEstudioInput" onChange={(e)=>{setOrdenEstudio(e.target.value)}} value={ordenEstudio} className="mt-3 form-control col-lg-4">
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
                                        <span onClick={()=>{ (ordenEstudio !== "" && ordenEstudio !== "Seleccionar orden:") ? createOrden() : console.log("Error")}} className={(ordenEstudio !== "" && ordenEstudio !== "Seleccionar orden:")? "btn btn-primary btn-block" : "btn btn-disabled btn-block" }>Añadir</span>
                                    </div>
                                </div>
                                {ordenEstudio !== "" && ordenEstudio !== "Seleccionar orden:" ?
                                    <textarea id="ordenComentarioInput" placeholder="Nota de la órden" value={ordenComentario} onChange={(e)=>{ setOrdenComentario(e.target.value) }} className="mt-3 form-control col-lg-8"/>
                                : <div></div>
                                }
                                <div className="px-3 mt-3 row">
                                  {ordenesEstudio.map((p, i) => (
                                      <div className="pill" key={i}>
                                        <p className="mb-1 strong">{p.ordenEstudio} <span className="cursor-pointer btn-delete" onClick={()=>{ setOrdenesEstudio(ordenesEstudio.filter((p1) => p1 !== p)); }} >X</span></p>
                                        {p.ordenComentario !== "" && <p className="mb-0 light">{p.ordenComentario} </p>}
                                      </div>
                                  ))}
                                </div>
                                <div className="creation-card mb-2 border py-1 row align-items-center justify-content-spacebetween">
                                    <p className="col-lg-4 mb-0">Tratamiento</p>
                                    {/* <select onChange={(e)=>{setTratamiento({...tratamiento, nombre: e.target.value})}} value={tratamiento.nombre} className="mt-3 form-control col-lg-4"  placeholder="W">
                                        {medicamentos.map((v, i) =>{
                                            return (
                                                <option key={i} value={v}>{v}</option>
                                            )
                                        })}
                                    </select> */}

                                    <div className="mt-0 col-lg-4 custom-dropdown">
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
                                    <span onClick={()=>{ 
                                        if(tratamiento.via && tratamiento.cant && tratamiento.unidad && tratamientoExtras.duranteText && tratamientoExtras.duranteNumber){
                                            createTreatment();
                                            setTratamiento({...tratamiento, nombre: ""});
                                        }else{
                                            console.log("Error")
                                        }
                                        }} 
                                    className={tratamiento.via && tratamiento.cant && tratamiento.unidad && tratamientoExtras.frecuenciaNumber && tratamientoExtras.duranteNumber ? "btn btn-primary btn-block col-lg-4 " : "btn btn-disabled btn-block col-lg-4 "}>Añadir</span>
                                        
                                </div>
                                <div className="px-3 pt-3 row">
                                  {tratamientos.map((p, i) => (
                                    <p className="pill" key={i}>
                                        <p className="mb-1 strong">{p.nombre} <span className="cursor-pointer btn-delete" onClick={()=>{ setTratamientos(tratamientos.filter((p1) => p1 !== p)); }} >X</span></p>
                                        <p className="mb-0 light">{p.notaTratamiento}</p>
                                    </p>
                                  ))}
                                </div>
                                {tratamiento.nombre ? <>
                                    <div className="">
                                        <div className="row no-gutters">
                                            <div className="col-lg-6">
                                                <div className="treatment-header">Dosis</div>
                                                <div className="treatment-body row">
                                                    <div className="col-lg-4">
                                                        <div className="mb-2">Via</div>
                                                        <select onChange={(e)=>{setTratamiento({...tratamiento, via: e.target.value})}} value={tratamiento.via} className="form-control">
                                                            <option value=""></option>
                                                            <option value="Anal">Anal</option>
                                                            <option value="Auditiva">Auditiva</option>
                                                            <option value="Nasal">Nasal</option>
                                                            <option value="Oral">Oral</option>
                                                            <option value="Ocular">Ocular</option>
                                                            <option value="Intravenosa">Intravenosa</option>
                                                            <option value="Implante">Implante</option>
                                                            <option value="Intramuscular">Intramuscular</option>
                                                            <option value="Intradérmico">Intradérmico</option>
                                                        </select>
                                                    </div>
                                                    <div className="col-lg-3">
                                                        <div className="mb-2">Cantidad</div>
                                                        <input placeholder="0" type="number" onChange={(e)=>{setTratamiento({...tratamiento, cant: e.target.value})}} value={tratamiento.cant} className="form-control"/>
                                                    </div>
                                                    <div className="col-lg-4">
                                                        <div className="mb-2">Unidad</div>
                                                        <select onChange={(e)=>{setTratamiento({...tratamiento, unidad: e.target.value})}} value={tratamiento.unidad} className="form-control">
                                                            <option value=""></option>
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
                                                    <div className="col-lg-6 items-center">
                                                        <div className="mb-2">Frecuencia</div>
                                                        <div className="row no-gutters items-center">
                                                            <input placeholder="0" type="number" onChange={(e)=>{setTratamientoExtras({...tratamientoExtras, frecuenciaNumber: e.target.value})}} value={tratamientoExtras.nombre} className="form-control col-lg-3"/>
                                                            <select onChange={(e)=>{setTratamientoExtras({...tratamientoExtras, frecuenciaText: e.target.value})}} value={tratamientoExtras.nombre} className="form-control col-lg-7">
                                                                <option value=""></option>
                                                                <option value="Horas">Horas</option>
                                                                <option value="Dias">Días</option>
                                                                <option value="Semanas">Semanas</option>
                                                                <option value="Meses">Meses</option>
                                                                <option value="Años">Años</option>
                                                                {/* <option value="Minutos">Minutos</option>
                                                                <option value="Horas">Horas</option>
                                                                <option value="Dias">Dias</option> */}
                                                                {/* <option value="Interdiaria">Interdiaria</option>
                                                                <option value="Semanas">Semanas</option>
                                                                <option value="Meses">Meses</option> */}
{/*                                                                 <option value="Años">Años</option>
                                                                <option value="Dia">Dia</option> */}
                                                                {/* <option value="Diaria">Diaria</option>
                                                                <option value="Mañanas">Mañanas</option>
                                                                <option value="Noches">Noches</option>
                                                                <option value="Mañana y noche">Mañana y noche</option>
                                                                <option value="Después de cada comida">Después de cada comida</option> */}
                                                            </select>
                                                        </div>
                                                    </div>
                                                    <div className="col-lg-6 items-center">
                                                        <div className="mb-2">Durante</div>
                                                        <div className="row no-gutters items-center">
                                                            <input placeholder="0" type="number" onChange={(e)=>{setTratamientoExtras({...tratamientoExtras, duranteNumber: e.target.value})}} value={tratamientoExtras.nombre} className="form-control col-lg-3"/>
                                                            <select onChange={(e)=>{setTratamientoExtras({...tratamientoExtras, duranteText: e.target.value})}} value={tratamientoExtras.nombre} className="form-control col-lg-7">
                                                                <option value=""></option>
                                                                <option value="Horas">Horas</option>
                                                                <option value="Dias">Días</option>
                                                                <option value="Semanas">Semanas</option>
                                                                <option value="Meses">Meses</option>
                                                                <option value="Años">Años</option>
                                                            </select>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <textarea onChange={(e)=>{setTratamiento({...tratamiento, notaTratamiento: e.target.value})}} value={tratamiento.notaTratamiento} placeholder="Nota del tratamiento" className="my-2 form-control col-lg-12"/> </>
                                : <div></div>}
                                <div className="creation-card mb-2 border py-1 row align-items-center justify-content-spacebetween">
                                    <p className="col-lg-4 mb-0">Instrucciones adicionales</p>
                                    <textarea placeholder="Instrucciones adicionales de la consulta" value={episodioValues.instruccionesAdicionalesConsulta} onChange={(e) => setEpisodioValues({...episodioValues, instruccionesAdicionalesConsulta: e.target.value})} className="mt-3 form-control col-lg-8"/>
                                </div>
                                <div className="creation-card mb-2 border py-1 row align-items-center justify-content-spacebetween">
                                    <p className="col-lg-4 mb-0">Órden especialista</p>
                                    <input placeholder="Nombre de la especialidad" value={episodioValues.ordenEspecialista} onChange={(e) => setEpisodioValues({...episodioValues, ordenEspecialista: e.target.value})} className="mt-3 form-control col-lg-8"/>
                                </div>
                                <div className="creation-card mb-2 border py-1 row align-items-center justify-content-spacebetween">
                                    <p className="col-lg-4 mb-0">Tipo de entrega</p>
                                    <select onChange={(e) => setTipoEntrega(e.target.value)} className="mt-3 form-control col-lg-8">
                                        <option value=""></option>
                                        <option value="Completo">Completo</option>
                                        <option value="Parcial">Parcial</option>
                                        <option value="No entregado">No entregado</option>
                                    </select>
                                </div>
                                {/* <div onClick={()=>{ tratamientos.length > 0 ? saveEpisode() : console.log()}} className={`btn ${ tratamientos.length > 0 ? "btn-primary" : "btn-disabled"}`}> */}
                                <div onClick={()=>{ saveEpisode() }} className={`btn btn-primary`}>
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

                            <div className="row mt-3 no-gutters align-items-center justify-content-spacebetween">
                                { docAntecedentes ? 
                                    <div onClick={()=>{setAntecedentesModal(true)}} className="btn btn-primary">
                                        Ver antecedentes
                                    </div>
                                : <div></div> }
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
                        <div className="antecedentes-box">
                            <div className="antecedentes-box-title">
                                Información del paciente
                            </div>
                            <div className="mx-2">
                                <div className="box-info text-center mb-3">
                                    <img src={patient.url ?? patient.petthumbnailUrl} className="box-info-img"/>
                                </div>
                                <div className="mb-3 border-bottom">
                                    <div className="expedient-label-text">
                                        Nombre del paciente
                                    </div>
                                    {data.state["isOwner"] ? 
                                        <div className="expedient-value-text">
                                            {patient?.user} {patient?.dadsLastName ?? ""} {patient?.momsLastName ?? ""}
                                        </div>
                                    : 
                                        <div className="expedient-value-text">
                                            {patient?.nombre} {patient?.apellido ?? ""}
                                        </div>
                                    }
                                </div>
                                <div className="mb-3 border-bottom">
                                    <div className="expedient-label-text">
                                        Edad
                                    </div>
                                    <div className="expedient-value-text">
                                        {patient?.edad}
                                    </div>
                                </div>
                                <div className="mb-3">
                                    <div className="expedient-label-text">
                                        Sexo
                                    </div>
                                    <div className="expedient-value-text">
                                        {patient?.sexo ?? "Mujer"}
                                    </div>
                                </div>
                            </div>

                        </div>
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

    function findEnglishTranslation(value){
        let translated = ""

        let traductions = [
            {ESP:"Horas", ENG: "hours"},
            {ESP:"Dias", ENG: "days"},
            {ESP:"Semanas", ENG: "days"},
            {ESP:"Meses", ENG: "months"},
            {ESP:"Años", ENG: "years"},
        ]

        translated = traductions.find((prv)=>( prv["ESP"] === value ))["ENG"]

        return translated
    }
    
    function findComplexWord(value){
        let translated = ""

        let traductions = [
            {propWord:"Anal", complexWord: "aplicarte"},
            {propWord:"Auditiva", complexWord: "aplicarte"},
            {propWord:"Nasal", complexWord: "aplicarte"},
            {propWord:"Oral", complexWord: "tomar"},
            {propWord:"Ocular", complexWord: "aplicarte"},
        ]

        translated = traductions.find((prv)=>( prv["propWord"] === value ))["complexWord"]

        return translated
    }

    function convertWeeksInDays(propValue){
        let number = parseInt(propValue) * 7
        return number
    }

    function formatTreatmentToList(propList){
        let list = []
        list = [...propList].map((prv, i)=>({
            title: `Tomar ${prv["nombre"]}`,
            description: `Tomar ${prv["nombre"]}`,
            index: i,
            is_critique: true,
            type: 2,
            start_trigger: 3,
            trigger_measure: findEnglishTranslation(prv["frecuenciaText"]),
            trigger_value: prv["frecuenciaText"] !== "Semanas" ? prv["frecuenciaNumber"] : convertWeeksInDays(prv["frecuenciaNumber"]),
            until_trigger: 1,
            until_trigger_measure: findEnglishTranslation(prv["duranteText"]),
            until_trigger_value: prv["duranteText"] !== "Semanas" ? prv["duranteNumber"] : convertWeeksInDays(prv["duranteNumber"]),
            gamification_points: 0,
            market_points: 0,
            video_url: "",
            meta_data: [
                {key: "dose", value: `${prv["cant"]} ${prv["unidad"]}`, lang: "ES"},
                {key: "medicine", value: prv["nombre"], lang: "ES"},
                {key: "frequency", value: prv["frecuencia"], lang: "ES"}
            ],
            notifications: [
                {
                    message: `Recuerda que en 5 minutos debes ${findComplexWord(prv["via"])} ${prv["cant"] + " " + prv["unidad"]} de ${prv["nombre"]}`,
                    trigger: "before",
                    type: "push",
                    trigger_measure: "minutes",
                    trigger_value: 5
                }
            ]
        }))
        return list
    }
    
    async function createProgram(){
        
        let programObject = {
            name: `Tratamiento para ${episodioValues.diagnosticoConsulta}`,
            description: episodioValues.detalleConsulta ?? "",
            is_default: false,
            contract_type: 1,
            type: 2,
            subject_id: data.state.mid,
            provider_id: user.aliadoId,
            activities: formatTreatmentToList(tratamientos)
        }

        let url = "https://xentralyapi.com/ema/program"

        let fetchConfig = {
            method: 'POST', 
            mode:'cors',
            crossDomain: true,
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify(programObject) 
        };

        //let res = await axios.post(url, programObject)
        let res = await fetch(url, fetchConfig)
        
        if(!res.ok){
            return "2"
        }

        let r = await res.json()
        return r["programId"]

    }

    async function saveEpisode(){
        let programId = ""
        
        if(tratamientos.length > 0){
            programId = await createProgram()
            if(programId === "2"){
                setErrorMessage("Ha ocurrido un error")
                setError(true)
            }else{
                handleNewEpisode(programId)
            }
        }else{
            handleNewEpisode("")
        }
    }

    function handleNewEpisode(programId){
        let id = Date.now().toString()
        try{
            firebase.db.collection("Expedientes").doc(data.state.mid).collection("Episodios").doc(id).set({
                unidadMedica: "",
                beneficiario: data.state["isOwner"] ? "Titular" : patient?.parentesco,
                user: data.state["isOwner"] ? patient?.user : patient?.nombre,
                dadsLastName: data.state["isOwner"] ? patient?.dadsLastName : patient?.apellido,
                momsLastName: data.state["isOwner"] ? patient?.momsLastName : "",
                identificacion: patient?.identificacion ?? "",
                edad: patient?.edad ?? "",
                sexo: patient?.sexo ?? "",
                telefono: patient?.telefono ?? "",
                tipoEntrega: tipoEntrega ?? "",
                operatorId: user.aliadoId ?? "",
                uid: data.state.mid,
                idConsulta: id,
                fechaConsulta: fechaConsulta ? fechaConsulta.toDate() : moment().toDate(),
                signosVitales: valores,
                signosVitalesFechas: [ 
                    fechaTalla ?? moment().toDate(),
                    fechaPeso ?? moment().toDate(),
                    fechaTemperatura ?? moment().toDate(),
                    fechaFrecuenciaResp ?? moment().toDate(),
                    fechaFrecuenciaCard ?? moment().toDate(),
                    fechaPresionArterial ?? moment().toDate(),
                ],
                motivoConsulta: palabrasClave,
                anteFisicoValues,
                anteAparatosValues,
                ordenesEstudio,
                tratamientos,
                programId: programId,
                detalleConsulta: episodioValues.detalleConsulta,
                diagnosticoConsulta: episodioValues.diagnosticoConsulta,
                comentariosConsulta: episodioValues.comentariosConsulta,
                instruccionesAdicionalesConsulta: episodioValues.instruccionesAdicionalesConsulta
            }).then((val)=>{
                setListoConsulta(true)
            })
        }catch(e){
            console.log(e)
        }
        setSucessMessage("Consulta guardada exitosamente")
        setSuccess(true)
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