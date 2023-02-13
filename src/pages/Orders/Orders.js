import React, {useState, useEffect} from 'react'
import firebase from '../../firebase/config'
import {useHistory, Link} from 'react-router-dom';
import moment from 'moment';

import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";

function Orders() {

    const history = useHistory()
    const [nameValue, setNameValue] = useState(null)
    const [nroValue, setNroValue] = useState(null)
    const [iDValue, setIDValue] = useState(null)
    const [localityValue, setLocalityValue] = useState(null)
    const [dateStartValue, setDateStartValue] = useState(null)
    const [dateEndValue, setDateEndValue] = useState(null)
    const [statusValue, setStatusValue] = useState(null);
    const [operatorValue, setOperatorValue] = useState(null);

    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage, setItemsPerPage] = useState(5)
    const [totalItemCount, setTotalItemCount] = useState(0)
    
    let statusValues = ["Status de orden", "Por confirmar", "Confirmada", "Cancelada", "Atendido", "Todas"]
    const [orders, setOrders] = useState([])
    const [mainOrders, setMainOrders] = useState([])
    const [centersList, setCentersList] = useState([])
    const [operatorsList, setOperatorsList] = useState([])

    const [centersLoaded, setCentersLoaded] = useState(false)
    const [operatorsLoaded, setOperatorsLoaded] = useState(false)
    const [loadingOrders, setLoadingOrders] = useState(false)

    const [user, setUser] = useState({})
    const [order, setOrder] = useState({})
    const [orderSell, setOrderSell] = useState({})
    const [role, setRol] = useState({})

    const url = window.location.href;

    const ExportToExcel = ({ apiData, fileName }) => {
      const fileType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
      const fileExtension = ".xlsx";
      
      let today = moment().format('L')

      const exportToCSV = async(d, fileName) => {
        let tipos = []
        await Promise.all(d.map(async(object)=>{

          object["fecha de programacion"] = moment(object["createdOn"].toDate()).format("D MMMM YYYY, h:mm a")
          object["fecha"] = moment(object["fecha"], "ddd, MMM D YYYY").format("DD/MM/YYYY").toString()
          object["cita"] = object["hora"]
          object["tipoOrden"] = "Estudio Mastografía"
          object["CURP"] = object["identificacion"]
          object["paciente"] = object["user"]
          object["unidad médica"] = object["centro"]

          await firebase.db.collection("Dueños").doc(object["uid"]).get().then((v)=>{
            object["sexo"] = v.data()["sexo"] ?? ""
            object["telefono"] = v.data()["telefono"]
            object["edad"] = v.data()["edad"]
            object["apellidos "] = `${(v.data()["dadsLastName"] ?? "") + " " + (v.data()["momsLastName"] ?? "")}`
          })
          object["operatorId"] && await firebase.db.collection("Aliados").doc(object["operatorId"]).get().then((v)=>{
            object["operador"] = v.data()["nombre"]
          })
        }))

        let title = "Secretaria de Salud del Estado de Durango"
        let subtitle = "Dirección de Planeación"
        let subtitle_2 = "Reporte de Citas para estudios de Mastografía"
        let date = "Campo de fecha y hora de generación de reporte"

        await Promise.all(d.map(async (o) => {
          for(let v in o){
            v.toString() === "hora" && delete o[v]
            v.toString() === "titulo" && delete o[v]
            v.toString() === "pais" && delete o[v]
            v.toString() === "videoId" && delete o[v]
            v.toString() === "servicioid" && delete o[v]
            v.toString() === "createdOn" && delete o[v]
            v.toString() === "operatorId" && delete o[v]
            v.toString() === "oid" && delete o[v]
            v.toString() === "tieneDelivery" && delete o[v]
            v.toString() === "mid" && delete o[v]
            v.toString() === "precio" && delete o[v]
            v.toString() === "uid" && delete o[v]
            v.toString() === "aliadoId" && delete o[v]
            v.toString() === "calificacion" && delete o[v]
            v.toString() === "nombreComercial" && delete o[v]
            v.toString() === "localidadId" && delete o[v]
            v.toString() === "culqiOrderId" && delete o[v]
            v.toString() === "atendidoStatus" && delete o[v]
            v.toString() === "delivery" && delete o[v]
            v.toString() === "preference_id" && delete o[v]
            v.toString() === "date" && delete o[v]
            v.toString() === "status" && delete o[v]
            v.toString() === "identificacion" && delete o[v]
            v.toString() === "user" && delete o[v]
            v.toString() === "centro" && delete o[v]
          }
          
        }))
        const ws = XLSX.utils.json_to_sheet(d);
        const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
        const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
        const data = new Blob([excelBuffer], { type: fileType });
        FileSaver.saveAs(data, `citas-${today}` + fileExtension);
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
      let since = moment(from, "YYYY-MM-DD")
      let until = moment(to, "YYYY-MM-DD")
      console.log(from)
      console.log(to)
      let returnedList = [...list].filter((prv)=>( moment(prv["fecha"], "ddd, MMM D YYYY").isBetween(since, until) ))

      return returnedList
    }

    const getOrdersFilteres = async() =>{
      let tipos = [];

      let reference = mainOrders

      let nameFilter = nameValue ? filterData(reference, nameValue, "user") : reference
      let nroFilter = nroValue ? filterData(nameFilter, nroValue, "oid") : nameFilter
      let idFilter = iDValue ? filterData(nroFilter, iDValue, "identificacion") : nroFilter
      let localityFilter = localityValue ? filterData(idFilter, localityValue, "aliadoId") : idFilter
      let statusFilter = statusValue ? filterData(localityFilter, statusValue, "status") : localityFilter 
      let operatorFilter = operatorValue ? filterData(statusFilter, operatorValue, "operatorId") : statusFilter 
      let filteredDates = (dateStartValue && dateEndValue) ? filterDates(operatorFilter, dateStartValue, dateEndValue) : operatorFilter

      setOrders(filteredDates.sort((a, b) => b.createdOn - a.createdOn))
      setTotalItemCount(tipos.length)
    }
    
    const getOrders = async(aliadoId, r) =>{
      setLoadingOrders(true)

      let tipos = [];

      let reference = firebase.db.collection('Ordenes').where("aliadoId", "==", aliadoId)

      if(r["canViewAllCenters"] === true){
        reference = firebase.db.collection('Ordenes')
      }else{
        reference = firebase.db.collection('Ordenes').where("aliadoId", "==", aliadoId)
      }

      await reference.get().then(val => {
        val.docs.forEach(async(item)=>{
          let object = item.data()
          object["operator"] = "-"
          tipos.push(object)
        })
        setOrders(tipos.sort((a, b) => b.createdOn - a.createdOn))
        setMainOrders(tipos.sort((a, b) => b.createdOn - a.createdOn))
        setTotalItemCount(tipos.length)
  
        setLoadingOrders(false)
      })
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
          getOrders(val.masterId, r)
        })
      });
    }, [])

    return (
      <div className="main-content-container container-fluid px-4">
        <div className="page-header align-items-center justify-content-spacebetween row no-gutters px-4 my-4">
          <div className="col-12 col-sm-5 text-center text-sm-left mb-0">
            <div className="row align-items-center">
              <div className="col">
                <p className="page-title">Citas - {orders.length}</p>
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
            <p className='input-label'>Identificación del paciente</p>
            <input type="text" placeholder="Escribir..." className="form-control" onChange={(e)=>{setIDValue(e.target.value)}}/>
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
                <option key={i} value={data.aliadoId}>{data.nombre}</option>
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
          <div className="form-group">
            <p className='input-label'>-</p>
            <select className="form-control" onChange={(e) => {setStatusValue(e.target.value)}}>
              {statusValues.map(data => (
                  <option key={data} value={data}>{data}</option>
              ))}
            </select>
          </div>
          <div className="ml-3 form-group">
            <button className="btn btn-primary" onClick={()=>{getOrdersFilteres()}}>Buscar <i className="material-icons">search</i></button>
          </div>
        </div>
        <div className="form-group ml-3">
          {orders.length > 0 && <ExportToExcel apiData={orders} fileName={"Citas"} />}
          <Link to="/orders/import-orders" className="btn btn-primary ml-2">Importar citas</Link>
        </div>
        <div className="row">
            <div className="col-lg-12 col-md-12 col-sm-12">
              <div className="mb-2 row orders-title">
                <div className="col-md-2 ">
                  <p className="mb-2">Paciente</p>
                </div>
                <div className="col-md-1">
                  <p className="mb-2">CURP</p>
                </div>
                <div className="col-md-2">
                  <p className="mb-2">Fecha</p>
                </div>
                <div className="col-md-1">
                  <p className="mb-2">Hora</p>
                </div>
                <div className="col-md-2">
                  <p className="mb-2">Unidad Médica</p>
                </div>
                <div className="col-md-2">
                  <p className="mb-2">Operador</p>
                </div>
                <div className="col-md-2">
                  <p className="mb-2">Estatus</p>
                </div>
              </div>
            </div>
            <div className="col-lg-12 col-md-12 col-sm-12">
              <div className="orders-container">
                {orders.length > 0 && orders.map(order=>{
                  let oc = moment(order["fecha"], "ddd, MMM D YYYY").format("ddd MMM D YYYY")

                  let operatorName = order["operatorId"] ? getOperator(order["operatorId"]) : "-"

                  return(
                    <div onClick={() => {
                      history.push({
                        pathname: "/orders/order",
                        state: {oid: order?.oid}
                      })
                    }} key={order?.oid} className="mb-2 row order-child">
                      <div className="col-md-2 color-primary">
                        <p className="mb-0 order-p-ellipsis">{order?.user ?? "-"}</p>
                      </div>
                      <div className="col-md-1 ">
                        <p className="mb-0 order-p-ellipsis">{order?.identificacion ?? "-"}</p>
                      </div>
                      <div className="col-md-2 ">
                        <p className="mb-0 order-p-ellipsis">{oc ?? "-"}</p>
                      </div>
                      <div className="col-md-1 ">
                        <p className="mb-0 order-p-ellipsis">{order?.hora ?? "-"}</p>
                      </div>
                      <div className="col-md-2">
                        <p className="mb-0 order-p-ellipsis">{order?.centro ?? "-"}</p>
                      </div>
                      <div className="col-md-2">
                        <p className="mb-0 order-p-ellipsis">{operatorName}</p>
                      </div>
                      <div className={order?.status === "Confirmada" 
                      ? "col-md-2 color-success" : order?.status === "Por Confirmar" ||  order?.status === "Por confirmar" ? "col-md-2 color-secondary" 
                      :"col-md-2 color-danger"}>
                        <p className="mb-0">{order?.status}</p>
                      </div>
                    </div>
                  )
                })}
                {loadingOrders && <div className="text-center"><p>Cargando citas...</p></div> }
                {(orders.length === 0 && !loadingOrders) && <div className="text-center"><p>No hay órdenes</p></div>}
              </div>
            </div>
        </div>
      </div>
    )

}

export default Orders