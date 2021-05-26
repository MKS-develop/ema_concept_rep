import moment from 'moment'
import 'moment/locale/es-mx';
import React, {useState, useEffect} from 'react'
import { Calendar, momentLocalizer } from 'react-big-calendar'
import "react-big-calendar/lib/css/react-big-calendar.css";
import firebase from '../firebase/config'
import {useHistory} from 'react-router-dom';

const localizer = momentLocalizer(moment)
moment.locale("es");

function Agenda(){
  const history = useHistory()
  // eslint-disable-next-line
  const [orders, setOrders] = useState([])
  const [tiposCate, setTiposCate] = useState([])
  const [cate, setCate] = useState("")
  const [tipoServicios, setTipoServicios] = useState([])
  const [serv, setServ] = useState("")
  // eslint-disable-next-line
  const [items, setItems] = useState([])
  const [myEventsList, setMyEventsList] = useState([])
  // eslint-disable-next-line
  const [user, setUser] = useState({})

  const getOrders = async(id) =>{
    let tipos = [];
    
    const reference = firebase.db.collection('Ordenes').where("tipoOrden", "==", "Servicio").where("aliadoId", "==", id)
    const reference2 = firebase.db.collection('Ordenes').where("tipoOrden", "==", "Videoconsulta").where("aliadoId", "==", id)

    await reference.get().then(val => {
      val.docs.forEach(item=>{
        tipos.push(item.data())
      })
    })
    await reference2.get().then(val => {
      val.docs.forEach(item=>{
        tipos.push(item.data())
      })
    })
    setOrders(tipos)
    getItems(tipos)
  }
  
  const getItems = async(ordenes) =>{
    let tipos = [];
    ordenes.forEach(async(orden)=>{
      
    const reference = firebase.db.collection('Ordenes').doc(orden.oid).collection("Items")
    const serviceFilter = serv ? reference.where("titulo", "==", serv) : reference

      await serviceFilter
      .get().then(val => {
        val.docs.forEach(item=>{
          tipos.push(item.data())
          console.log(item.data())
        })
      })

      //Filtrar las ordenes que solo estan disponibles
      //Dependiendo del rol
      // for(let i = 0; i < tipos.length; i++){
      //   for(let i = 0; i < ser.length; i++){
      //     if(ser[i] === tipos[i].titulo){
      //       tipos2.push(tipos[i])
      //     }
      //   }
      // }
      
      //Filtrar el rol del usuario y obtener todos los servicios
      //para asi filtrar las ordenes principales sin filtro
      // await firebase.db.collection("Aliados").doc(user.superAliadoId).collection("Roles").doc(user.rol).collection("Categorias").get().then((val)=>{
      //   val.docs.forEach((doc)=>{
      //     firebase.db.collection("Aliados").doc(user.superAliadoId).collection("Roles").doc(user.rol).collection("Categorias").doc(doc.id).collection("Servicios").get().then((val2)=>{
      //       val2.docs.forEach((doc2)=>{
      //         tipos.push(doc.id)
      //       })
      //     })
      //   })
      // })

      formatEvents(tipos)
      setItems(tipos)
    })
    console.log("Items: " + tipos)
  }
  
  const showClient = async(user) =>{
    await firebase.db.collection('Dueños').doc(user)
    .get().then(val => {
      // console.log(user)
      alert(val.data().user)
    })
  }
  
  const formatEvents = async(items) =>{
    let tipos = [];
    items.forEach(async(item)=>{

      var date = item.date === null ? moment().toDate() : item.date.toDate()
      const hn = "12:00"
      var hourL = item.hora === null ? hn.split(":") : item.hora.split(":") 
      date.setHours(hourL[0])
      date.setMinutes(hourL[1])
      var event = {
        oid: item.oid,
        title: `${item.titulo} - ${item.nombre} - ${item.atendidoStatus}`,
        start: item.date === null ? moment().toDate() : date,
        end: item.date === null ? moment().toDate() : moment(date).add(30, "minutes").toDate(),
        allDay: false
      }
      tipos.push(event)
    })
    setMyEventsList(tipos)
    // console.log("Eventos: " + tipos)
  }

  const messages = {
    next: "Siguiente",
    previous: "Anterior",
    today: "Hoy",
    month: "Mes",
    week: "Semana",
    day: "Día",
  }

  function getCategories(){
    let tipos = []
    firebase.db.collection('CategoriasServicios').get().then(data=>{  
      data.forEach(tipo=>{
        tipos.push(tipo.id)
        tipos.sort()
      })
      // tipos.pop("Todas")
      setTiposCate(tipos)
    });
  }

  function getServicesCategories(cate){
    let tipos = [];
    firebase.db.collection('CategoriasServicios').doc(cate).collection("Servicios").get().then(data=>{
      data.docs.forEach(item=>{
        tipos.push(item.id)
      })
      setTipoServicios(tipos)
    });
  }

  useEffect(() => {
    firebase.getCurrentUser().then((val)=>{
      setUser(val)
      getOrders(val.aliadoId)
      getCategories()
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  
    return (
      <div className="main-content-container container-fluid px-4">

        <div className="page-header align-items-center justify-content-spacebetween row no-gutters px-4 my-4">
          <div className="col-12 col-sm-5 text-center text-sm-left mb-0">
            <div className="row align-items-center">
              <div className="col">
                <p className="page-title">Agenda</p>
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
              <select className="form-control" value={cate} onChange={(e) =>{ setCate(e.target.value); getServicesCategories(e.target.value) } }>
                {tiposCate.map(data => (
                    <option key={data} value={data}>{data}</option>
                ))}
              </select>
            </div>
            {cate === "" ? <div></div> : <div className="form-group">
              <select className="form-control" value={serv} onChange={e => setServ(e.target.value)}>
                {tipoServicios.map(data => (
                    <option key={data} value={data}>{data}</option>
                ))}
              </select>
            </div>}
          <div className="ml-3 form-group">
            <button className="btn btn-primary" onClick={()=>{getOrders(user.aliadoId)}}>Buscar <i className="material-icons">search</i></button>
          </div>
        </div>
        <Calendar
          onSelectEvent={(e)=>{
            history.push({
              pathname: "/orders/order", 
              state: { oid: e.oid }
            })
          }}
          views={{month: true, week: true, day: true}}
          localizer={localizer}
          events={myEventsList}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 500 }}
          messages={messages}
        />
      </div>
    )

}

export default Agenda