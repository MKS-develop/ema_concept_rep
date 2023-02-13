import React, {useState, useEffect} from 'react'
import firebase from '../../firebase/config'
import {useHistory, Link} from 'react-router-dom';
import moment from 'moment';

import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";

function TreatmentExport() {

    const history = useHistory()
    const [nameValue, setNameValue] = useState(null)
    const [nroValue, setNroValue] = useState(null)
    const [iDValue, setIDValue] = useState(null)
    const [localityValue, setLocalityValue] = useState(null)
    const [dateStartValue, setDateStartValue] = useState(null)
    const [dateEndValue, setDateEndValue] = useState(null)
    const [statusValue, setStatusValue] = useState(null);
    const [operatorValue, setOperatorValue] = useState(null);
    const [diagnosticoValue, setDiagnosticoValue] = useState(null);
    const [typeOfPatientValue, setTypeOfPatientValue] = useState(null);

    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage, setItemsPerPage] = useState(5)
    const [totalItemCount, setTotalItemCount] = useState(0)
    
    const [treatments, setTreatments] = useState([])
    const [mainTreatments, setMainTreatments] = useState([])
    const [centersList, setCentersList] = useState([])
    const [operatorsList, setOperatorsList] = useState([])

    const [centersLoaded, setCentersLoaded] = useState(false)
    const [operatorsLoaded, setOperatorsLoaded] = useState(false)
    const [loadingTreatments, setLoadingTreatments] = useState(false)

    const [user, setUser] = useState({})
    const [order, setOrder] = useState({})
    const [orderSell, setOrderSell] = useState({})
    const [role, setRol] = useState({})

    const ExportToExcel = ({ apiData, fileName }) => {
      const fileType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
      const fileExtension = ".xlsx";
      
      let today = moment().format('L')

      const exportToCSV = async(d, fileName) => {
        const ws = XLSX.utils.json_to_sheet(d);
        const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
        const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
        const data = new Blob([excelBuffer], { type: fileType });
        FileSaver.saveAs(data, `reportes-ema-${today}` + fileExtension);
      };
    
      return (
        <button className="btn btn-outline-secondary" onClick={(e) => exportToCSV(apiData, fileName)}>Exportar a Excel <i className="material-icons">save_alt</i></button>
      );
    }

    function filterData(list, val, type) {
      let listReturned = []
      list.forEach((data)=>{
        if(data[type]){
          if(type === "user" || type === "identificacion"){
            let t = data[type].toString().toLowerCase()
            if(t.includes(val.toLowerCase())) listReturned.push(data)
          }else{
            let t = data[type].toString()
            if(t.includes(val)) listReturned.push(data)
          }
        }
      })
      return listReturned
    }
  
    function filterDates(list, from, to){
      let since = moment(from, "YYYY-MM-DD").subtract("d", 1)
      let until = moment(to, "YYYY-MM-DD").add("d", 1)
      console.log(from)
      console.log(to)
      let returnedList = [...list].filter((prv)=>( moment(prv["fecha_evento"], "ddd, MMM D YYYY").isBetween(since, until) ))

      return returnedList
    }

    const getTreatmentsFilteres = async() =>{
      let tipos = [];

      let reference = mainTreatments

      let nameFilter = nameValue ? filterData(reference, nameValue, "nombre_y_apellidos") : reference
      let diagnosticoFilter = diagnosticoValue ? filterData(nameFilter, diagnosticoValue, "diagnostico") : nameFilter
      let beneficiarioFilter = typeOfPatientValue ? filterData(diagnosticoFilter, typeOfPatientValue, "beneficiario") : diagnosticoFilter
      let localityFilter = localityValue ? filterData(beneficiarioFilter, localityValue, "unidad") : beneficiarioFilter
      let operatorFilter = operatorValue ? filterData(localityFilter, operatorValue, "operador") : localityFilter 
      let filteredDates = (dateStartValue && dateEndValue) ? filterDates(operatorFilter, dateStartValue, dateEndValue) : operatorFilter

      setTreatments(filteredDates.sort((a, b) => b.createdOn - a.createdOn))
      setTotalItemCount(tipos.length)
    }
    
    const getTreatments = async(aliadoId, r) =>{
      setLoadingTreatments(true)

      let tipos = [];

      let reference = firebase.db.collectionGroup('Episodios')

      await reference.get().then(val => {
        val.docs.forEach(async(item)=>{
            let completeName = `${item.data()["user"] ?? ""} ${item.data()["dadsLastName"] ?? ""} ${item.data()["momsLastName"] ?? ""}`
            let object = {
                unidad: item.data()["unidadMedica"] ?? "-",
                beneficiario: item.data()["beneficiario"] ?? "-",
                nombre_y_apellidos: completeName === "  " ? "-" : completeName,
                curp: item.data()["identificacion"] ?? "-",
                edad: item.data()["edad"] ?? "-",
                sexo: item.data()["sexo"] ?? "-",
                telefono: item.data()["telefono"] ?? "-",
                fecha_evento: moment(item.data()["fechaConsulta"].toDate()).format("ddd, MMM D YYYY").toString() ?? "-",
                diagnostico: item.data()["diagnosticoConsulta"] ?? "-",
                tratamiento: getMultipleTreatments(item.data()["tratamientos"]),
                entrega: item.data()["tipoEntrega"] ?? "-",
                notas: item.data()["comentariosConsulta"] ?? "-",
                operador: item.data()["operatorId"] !== undefined ? getOperator(item.data()["operatorId"]) : "-",
            }
            tipos.push(object)
        })
        setTreatments(tipos.sort((a, b) => b.createdOn - a.createdOn))
        setMainTreatments(tipos.sort((a, b) => b.createdOn - a.createdOn))
        setTotalItemCount(tipos.length)
  
        setLoadingTreatments(false)
      })
    }

    function getMultipleTreatments(propList){
        let list = [...propList]
        let returnedText = ""
        let listOfNames = list.map((t)=> t["nombre"])
        returnedText = list.length > 0 ? listOfNames.join(", ") : "-"
        return returnedText
    }

    function getOperator(id){
      return operatorsList.find((prv)=>( prv["aliadoId"] === id)) !== undefined ? operatorsList.find((prv)=>( prv["aliadoId"] === id))["nombre"] : "-"
    }

    async function getOperators(){
      let tipos = []
      await firebase.db.collection("Aliados").where("role", "==", "Operador").get().then((v)=>{
        v.docs.forEach((doc)=>{
          tipos.push(doc.data())
        })
      })
      await firebase.db.collection("Aliados").where("role", "==", "CallCenter").get().then((v)=>{
        v.docs.forEach((doc)=>{
          tipos.push(doc.data())
        })
      })
      setOperatorsList(tipos)
      setOperatorsLoaded(true)
    }

    async function getCenters(){
      let tipos = []
      await firebase.db.collection("Localidades").get().then((v)=>{
        v.docs.forEach((doc)=>{
          tipos.push(doc.data())
        })
      })
      setCentersList(tipos)
      setCentersLoaded(true)
    }

    useEffect(() => {
      getOperators()
    }, [operatorsLoaded])

    useEffect(() => {
      getCenters()
    }, [centersLoaded])
    
    
    useEffect(() => {
      firebase.getCurrentUser().then((val)=>{
        setUser(val)
        firebase.getRoleInfo(val.role ?? "Atencion").then((r)=>{
          setRol(r)
          getTreatments(val.masterId, r)
        })
      });
    }, [])

  return (
    <div className="main-content-container container-fluid px-4">
        <div className="page-header align-items-center justify-content-spacebetween row no-gutters px-4 my-4">
          <div className="col-12 col-sm-5 text-center text-sm-left mb-0">
            <div className="row align-items-center">
              <div className="col">
                <p className="page-title">Reportes</p>
              </div>
            </div>
          </div>
          <div className="col-12 col-sm-1 mb-0">
            <div className="row align-items-center justify-content-space-around">
              <i className="material-icons color-white display-5">help_outline</i>
            </div>
          </div>
        </div>
        <div className="form-row align-items-center justify-content-space-between">
            <div className="form-group mr-3">
                <p className='input-label'>Nombre del paciente</p>
                <input type="text" placeholder="Escribir..." className="form-control" onChange={(e)=>{setNameValue(e.target.value)}}/>
            </div>
            <div className="form-group mr-3">
                <p className='input-label'>Diagnóstico</p>
                <input type="text" placeholder="Escribir..." className="form-control" onChange={(e)=>{setDiagnosticoValue(e.target.value)}}/>
            </div>
            <div className="form-group mr-3">
                <p className='input-label'>Tipo de paciente</p>
                <select className="form-control" onChange={(e) => {setTypeOfPatientValue(e.target.value)}}>
                <option value="">Todos</option>
                <option value="Titulares">Titulares</option>
                <option value="Pediatricos">Pediatricos</option>
                </select>
            </div>
            <div className="form-group mr-3">
                <p className='input-label'>Unidad Médica</p>
                <select className="form-control" onChange={(e) => {setLocalityValue(e.target.value)}}>
                <option value="">Todas</option>
                {centersList.map((data, i) => (
                    <option key={i} value={data.aliadoId}>{data.nombreLocalidad}</option>
                ))}
                </select>
            </div>
            <div className="form-group mr-3">
                <p className='input-label'>Operador</p>
                <select className="form-control" onChange={(e) => {setOperatorValue(e.target.value)}}>
                <option value="">Todos</option>
                {operatorsList.map((data, i) => (
                    <option key={i} value={data.nombre}>{data.nombre}</option>
                ))}
                </select>
            </div>
            <div className="form-group mr-3">
                <p className='input-label'>Fecha desde</p>
                <input type="date" placeholder="Fecha inicio" className="form-control" onChange={(e)=>{setDateStartValue(e.target.value)}}/>
            </div>
            <div className="form-group mr-3">
                <p className='input-label'>Fecha hasta</p>
                <input type="date" placeholder="Fecha final" className="form-control" onChange={(e)=>{setDateEndValue(e.target.value)}}/>
            </div>
            <div className="ml-3 form-group">
              <button className="btn btn-primary" onClick={()=>{getTreatmentsFilteres()}}>Buscar <i className="material-icons">search</i></button>
            </div>
        </div>
        <div className="form-group ml-3">
          {treatments.length > 0 && <ExportToExcel apiData={treatments} fileName={"Reportes"} />}
        </div>
        <div className="row">
            <div className="col-lg-12 col-md-12 col-sm-12">
              <div className="mb-2 row orders-title">
                <div className="col-md-2 ">
                  <p className="mb-2">Beneficiario</p>
                </div>
                <div className="col-md-2 ">
                  <p className="mb-2">Nombre</p>
                </div>
                <div className="col-md-2 ">
                  <p className="mb-2">CURP</p>
                </div>
                <div className="col-md-2 ">
                  <p className="mb-2">Tratamiento</p>
                </div>
                <div className="col-md-2 ">
                  <p className="mb-2">Operador</p>
                </div>
                <div className="col-md-2 ">
                  <p className="mb-2">Fecha</p>
                </div>
              </div>
            </div>
            <div className="col-lg-12 col-md-12 col-sm-12">
                <div className="orders-container">
                    {treatments.length > 0 && treatments.map(treatment=>{

                    let operatorName = treatment["operatorId"] ? getOperator(treatment["operatorId"]) : "-"

                    return(
                        <div key={treatment?.oid} className="mb-2 row order-child">
                            <div className="col-md-2 ">
                                <p className="mb-0 order-p-ellipsis">{treatment?.beneficiario}</p>
                            </div>
                            <div className="col-md-2 ">
                                <p className="mb-0 order-p-ellipsis">{treatment?.nombre_y_apellidos}</p>
                            </div>
                            <div className="col-md-2 ">
                                <p className="mb-0 order-p-ellipsis">{treatment?.curp}</p>
                            </div>
                            <div className="col-md-2">
                                <p className="mb-0 order-p-ellipsis">{treatment?.tratamiento}</p>
                            </div>
                            <div className="col-md-2">
                                <p className="mb-0 order-p-ellipsis">{operatorName}</p>
                            </div>
                            <div className="col-md-2">
                                <p className="mb-0 order-p-ellipsis">{treatment?.fecha_evento}</p>
                            </div>
                        </div>
                    )
                    })}
                    {loadingTreatments && <div className="text-center"><p>Cargando tratamientos...</p></div> }
                    {(treatments.length === 0 && !loadingTreatments) && <div className="text-center"><p>No hay tratamientos</p></div>}
                </div>
            </div>
        </div>
      </div>
  )

}

export default TreatmentExport