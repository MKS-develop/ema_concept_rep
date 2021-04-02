import moment from 'moment'
import 'moment/locale/es-mx';
import React, {useState, useEffect} from 'react'
import { Calendar, momentLocalizer } from 'react-big-calendar'
import "react-big-calendar/lib/css/react-big-calendar.css";
import firebase from '../firebase/config'

const localizer = momentLocalizer(moment)
moment.locale("es");

function Agenda(){
  // eslint-disable-next-line
  const [orders, setOrders] = useState([])
  // eslint-disable-next-line
  const [items, setItems] = useState([])
  const [myEventsList, setMyEventsList] = useState([])
  // eslint-disable-next-line
  const [user, setUser] = useState({})

  const getOrders = async(id) =>{
    let tipos = [];
    await firebase.db.collection('Ordenes').where("tipoOrden", "==", "Servicio").where("aliadoId", "==", id)
    .get().then(val => {
      val.docs.forEach(item=>{
        tipos.push(item.data())
      })
    })
    setOrders(tipos)
    getItems(tipos)
    // console.log("Ordenes: " + tipos)
  }
  
  const getItems = async(ordenes) =>{
    let tipos = [];
    ordenes.forEach(async(orden)=>{
      await firebase.db.collection('Ordenes').doc(orden.oid).collection("Items")
      .get().then(val => {
        val.docs.forEach(item=>{
          tipos.push(item.data())
        })
      })
      formatEvents(tipos)
      setItems(tipos)
    })
    // console.log("Items: " + tipos)
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
        user: item.uid,
        title: item.titulo + " - " + item.nombre,
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

  useEffect(() => {
    firebase.getCurrentUser().then((val)=>{
      setUser(val)
      getOrders(val.aliadoId)
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  
    return (
      <div className="main-content-container container-fluid px-4">

        <div className="page-header align-items-center justify-content-spacebetween row no-gutters py-2 px-4 my-4">
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
        
        <Calendar
          onSelectEvent={(e)=>{showClient(e.user)}}
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
