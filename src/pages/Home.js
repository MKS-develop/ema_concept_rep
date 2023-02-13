import moment from 'moment'
import 'moment/locale/es-mx';
import React, {useState, useEffect} from 'react'
import firebase from '../firebase/config'
import { Line } from '@reactchartjs/react-chart.js'
import {Link} from 'react-router-dom';
import AgendaConfig from './AgendaConfig';

function Home() {
  const [user, setUser] = useState({})
  const [ordersPrice, setOrdersPrice] = useState(0)
  const [nno, setNno] = useState(0)
  const [orders, setOrders] = useState([])
  const [labelsList, setLabelsList] = useState([])

  const [ordersPriceData, setOrdersPriceData] = useState([])
  const [ordersData, setOrdersData] = useState([])

  const [servicesData, setServicesData] = useState([])
  const [productsData, setProductsData] = useState([])

  const getOrders = async(id) =>{
    let orders = [];
    let tipos = [];
    let nno = [];
    await firebase.db.collection('Ordenes').where("aliadoId", "==", id)
    .get().then(val => {
      val.docs.forEach(item=>{
        orders.push(item.data().precio)
        tipos.push(item.data())
      })
    })
    await firebase.db.collection('Ordenes').where("aliadoId", "==", id).where("status", "==", "Por confirmar")
    .get().then(val => {
      val.docs.forEach(item=>{
        nno.push(item.data())
      })
    })
    filterOrders(tipos)
    setOrders(orders)
    setNno(nno.length)
    setOrdersPrice(orders.reduce(getSum, 0))

  }
  
  const getPS = async(id) =>{
    let products = [];
    let services = [];
    await firebase.db.collection('Localidades').where("aliadoId", "==", id).where("lc", "==", "Localidad Principal")
    .get().then(val => {
      val.docs.forEach(item=>{
        firebase.db.collection('Localidades').doc(item.id).collection("Servicios").get().then((val2)=>{
          val2.docs.forEach(i=>{
            services.push(i.data())
          })
        })
      })
    })
    await firebase.db.collection('Productos').where("aliadoId", "==", id)
    .get().then(val => {
      val.docs.forEach(item=>{
        products.push(item.data())
      })
    })
    filterPS(products, services)

  }

  function getSum(total, num) {
    return total + num;
  }

  function filterOrders(tipos){
    let dates = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']
    let datesList = []
    let monthsO = {
      0: [],
      1: [],
      2: [],
      3: [],
      4: [],
      5: [],
      6: [],
      7: [],
      8: [],
      9: [],
      10: [],
      11: [],
    }
    let totalList = []
    let totalListLength = []
    tipos.forEach(order => {
      switch (order.createdOn.toDate().getMonth()) {
        case 0:
          monthsO[0].push(order.precio)
          break;
        case 1:
          monthsO[1].push(order.precio)
          break;
        case 2:
          monthsO[2].push(order.precio)
          break;
        case 3:
          monthsO[3].push(order.precio)
          break;
        case 4:
          monthsO[4].push(order.precio)
          break;
        case 5:
          monthsO[5].push(order.precio)
          break;
        case 6:
          monthsO[6].push(order.precio)
          break;
        case 7:
          monthsO[7].push(order.precio)
          break;
        case 8:
          monthsO[8].push(order.precio)
          break;
        case 9:
          monthsO[9].push(order.precio)
          break;
        case 10:
          monthsO[10].push(order.precio)
          break;
        case 11:
          monthsO[11].push(order.precio)
          break;
        default:
          break;
      }
    })
    for(let i = 0; i <= moment().toDate().getMonth(); i++ ){
      totalList.push(monthsO[i].reduce(getSum, 0))
      totalListLength.push(monthsO[i].length)
      datesList.push(dates[i])
    }
    setLabelsList(datesList)
    setOrdersPriceData(totalList)
    setOrdersData(totalListLength)
  }

  function filterPS(productos, servicios){
    let monthsO = {
      0: [],
      1: [],
      2: [],
      3: [],
      4: [],
      5: [],
      6: [],
      7: [],
      8: [],
      9: [],
      10: [],
      11: [],
    }
    let monthsO2 = {
      0: [],
      1: [],
      2: [],
      3: [],
      4: [],
      5: [],
      6: [],
      7: [],
      8: [],
      9: [],
      10: [],
      11: [],
    }
    let servicesList = []
    let productsList = []
    productos.forEach(product => {
      switch (product.createdOn.toDate().getMonth()) {
        case 0:
          monthsO[0].push(product)
          break;
        case 1:
          monthsO[1].push(product)
          break;
        case 2:
          monthsO[2].push(product)
          break;
        case 3:
          monthsO[3].push(product)
          break;
        case 4:
          monthsO[4].push(product)
          break;
        case 5:
          monthsO[5].push(product)
          break;
        case 6:
          monthsO[6].push(product)
          break;
        case 7:
          monthsO[7].push(product)
          break;
        case 8:
          monthsO[8].push(product)
          break;
        case 9:
          monthsO[9].push(product)
          break;
        case 10:
          monthsO[10].push(product)
          break;
        case 11:
          monthsO[11].push(product)
          break;
        default:
          break;
      }
    })
    servicios.forEach(service => {
      switch (service.createdOn.toDate().getMonth()) {
        case 0:
          monthsO2[0].push(service)
          break;
        case 1:
          monthsO2[1].push(service)
          break;
        case 2:
          monthsO2[2].push(service)
          break;
        case 3:
          monthsO2[3].push(service)
          break;
        case 4:
          monthsO2[4].push(service)
          break;
        case 5:
          monthsO2[5].push(service)
          break;
        case 6:
          monthsO2[6].push(service)
          break;
        case 7:
          monthsO2[7].push(service)
          break;
        case 8:
          monthsO2[8].push(service)
          break;
        case 9:
          monthsO2[9].push(service)
          break;
        case 10:
          monthsO2[10].push(service)
          break;
        case 11:
          monthsO2[11].push(service)
          break;
        default:
          break;
      }
    })
    for(let i = 0; i <= moment().toDate().getMonth(); i++ ){
      productsList.push(monthsO[i].length)
      servicesList.push(monthsO2[i].length)
    }
    setProductsData(productsList)
    setServicesData(servicesList)
  }

  const data = {
    labels: labelsList,
    datasets: [
      {
        label: 'Ordenes',
        data: ordersData,
        fill: true,
        backgroundColor: 'rgb(91, 97, 143, 0.3)',
        borderColor: 'rgb(91, 97, 143)',
        borderWidth: 1,
        lineTension: 0.5,
        steppedLine: false
      },
    ],
  }
  const data3 = {
    labels: labelsList,
    datasets: [
      {
        label: 'Ingresos',
        data: ordersPriceData,
        fill: true,
        backgroundColor: 'rgb(91, 97, 143, 0.3)',
        borderColor: 'rgb(91, 97, 143)',
        borderWidth: 1,
        lineTension: 0.5,
        steppedLine: false
      },
    ],
  }
  
  const data2 = {
    labels: labelsList,
    datasets: [
      {
        label: 'Productos',
        data: productsData,
        fill: true,
        backgroundColor: 'rgb(102, 204, 153, 0.2)',
        borderColor: 'rgb(102, 204, 153)',
        yAxisID: 'productos',
        borderWidth: 1,
        lineTension: 0.5,
      },
      {
        label: 'Servicios',
        data: servicesData,
        fill: true,
        backgroundColor: 'rgb(91, 97, 143, 0.2)',
        borderColor: 'rgb(91, 97, 143)',
        yAxisID: 'servicios',
        borderWidth: 1,
        lineTension: 0.5,
      },
    ],
  }
  
  const options2 = {
    scales: {
      yAxes: [
        {
          type: 'linear',
          display: false,
          position: 'left',
          id: 'productos',
        },
        {
          type: 'linear',
          display: false,
          position: 'right',
          id: 'servicios',
          gridLines: {
            drawOnArea: false,
          },
        },
      ],
    },
  }
  
  const options = {
    scales: {
      xAxes: [
        {
          display: true,
        }
      ],
      yAxes: [
        {
          display: true,
          ticks: {
            beginAtZero: true,
          },
        },
      ],
    },
  }  

  async function updateAgendas(aliadoId){

    try{
      await firebase.db.collection("Localidades").where("aliadoId", "==", aliadoId).where("lc", "==", "Localidad Principal").get().then((loc)=>{
        let lid = loc.docs[0].data().localidadId
        
        firebase.db.collection("Localidades").doc(lid).collection("Servicios").get().then((servs)=>{
          servs.docs.forEach((serv)=>{
            firebase.db.collection("Localidades").doc(lid).collection("Servicios").doc(serv.data().servicioId).collection("Agenda").orderBy("date", "asc").get().then((days)=>{
              
              let spreadedData = days.docs[days.docs.length - 1] ? {...days.docs[days.docs.length - 1].data()} : {}
              
              let object = {
                localidadId: lid,
                ...spreadedData
              }

              let fecha = object.fecha ? object.fecha : ""
              let dateFormatted
              
              let listaText = fecha.split(" ")

              if( isNaN(parseInt( listaText[1] )) ){
                let newFecha = `${listaText[0]} ${listaText[2]} ${listaText[1]} ${listaText[3]}`
                dateFormatted = moment(newFecha, "ddd, D MMM YYYY")
              }else{
                let newFecha = `${listaText[0]} ${listaText[1]} ${listaText[2]} ${listaText[3]}`
                dateFormatted = moment(newFecha, "ddd, D MMM YYYY")
              }
              // console.log(dateFormatted)
              if(dateFormatted.isBefore(moment())){
                console.log("Si se tiene que actualizar: " )
                console.log(object)
                const dates = AgendaConfig.getDates()
                createNewUpgradedAgenda(dates, object, dateFormatted)
                // console.log(dates)

              }else{
                // console.log("No se tiene que actualizar: " )
                // console.log(object)
              }

            })
          })
        })

      })
    }catch(e){
      console.log("Error: ", e)
    }


  }

  async function createNewUpgradedAgenda(fechas, objeto, date){
    
    for(let i = 0; i < fechas.length; i++){
      let fecha = fechas[i]
      await firebase.db.collection("Localidades").doc(objeto.localidadId).collection('Servicios').doc(objeto.servicioId).collection("Agenda").doc(fecha).set({
        bloqueado: false,
        agendaId: firebase.db.collection("Localidades").doc(objeto.localidadId).collection('Servicios').doc(objeto.servicioId).collection("Agenda").doc().id,
        servicioId: objeto.servicioId,
        fecha: fecha,
        date: date.toDate(),
        horasDia: objeto.horasDia, 
        capacidadDia: objeto.capacidadDia,
        createdOn: moment().toDate(),
      });
    }

  }

  useEffect(() => {
    firebase.getCurrentUser().then((val)=>{
      setUser(val)
    });
	}, [])

  return (
        <div className="main-content-container container-fluid px-4">

            <div className="page-header align-items-center justify-content-spacebetween row no-gutters px-4 my-4">
              <div className="col-12 col-sm-5 text-center text-sm-left mb-0">
                <div className="row align-items-center">
                  <div className="col">
                    <p className="page-title">Ejecución mes actual</p>
                  </div>
                </div>
              </div>
              <div className="col-12 col-sm-3 mb-0">
                <div className="row align-items-center justify-content-space-around">
                  <Link to="/resume" className="btn btn-secondary">Ver todos</Link>
                  <i className="material-icons color-white display-5">help_outline</i>
                </div>
              </div>
            </div>
            
            <div className="row">
             
              <div className="col-lg col-md-6 col-sm-6 mb-4">
                <div className="stats-small stats-small--1 card card-small">
                  <div className="card-body p-0 d-flex">
                    <div className="d-flex flex-column m-auto">
                      <div className="stats-small__data text-center">
                        <span className="stats-small__label text-uppercase">Ingresos por órdenes</span>
                        <h6 className="stats-small__value count my-3">S/{ordersPrice}</h6>
                      </div>
                    </div>
                    <Line data={data3} options={options} />
                  </div>
                </div>
              </div>
              <div className="col-lg col-md-4 col-sm-6 mb-4">
                <div className="stats-small stats-small--1 card card-small">
                  <div className="card-body p-0 d-flex">
                    <div className="d-flex flex-column m-auto">
                      <div className="stats-small__data text-center">
                        <span className="stats-small__label text-uppercase">Órdenes</span>
                        <h6 className="stats-small__value count my-3">{orders.length}</h6>
                      </div>
                    </div>
                    <Line data={data} options={options} />
                  </div>
                </div>
              </div>
              <div className="col-lg col-md-4 col-sm-6 mb-4">
                <div className="stats-small card card-small">
                  <div className="card-body p-0 d-flex">
                    <Line data={data2} options={options2} />
                  </div>
                </div>
              </div>
              
            </div>

            <div className="row">
              <div className="col-lg-8 col-md-12 col-sm-12 mb-4">
                <div className="card card-small">
                  <div className="card-header border-bottom">
                    <h6 className="m-0">Pacientes</h6>
                  </div>
                  <div className="card-body pt-0">
                    <Line data={data} options={options} />
                  </div>
                </div>
              </div>
              
              <div className="col-lg-4 col-md-6 col-sm-12 mb-4">
                <div className="card card-small pending-events">
                  <div className="card-header border-bottom">
                    <div className="row py-2 bg-light">
                      <div className="col-12 col-sm-8">
                        <h6 className="m-0">Eventos pendientes</h6>
                      </div>
                      <div className="col-12 col-sm-4 d-flex mb-2 mb-sm-0">
                        <a href="/" className="sub-link ml-auto mr-auto ml-sm-auto mr-sm-0 mt-3 mt-sm-0">Ver todo &rarr;</a>
                      </div>
                    </div>
                  </div>
                  <div className="card-body p-0">
                    
                    <div className="pending-events__item d-flex p-3">
                      <p className="pending-events__p mb-0"><span className="pending-events__counte">{nno}</span>Nuevas órdenes</p>
                    </div>
                    <div className="pending-events__item d-flex p-3">
                      <p className="pending-events__p mb-0"><span className="pending-events__counte">{nno}</span>Órdenes por confirmar</p>
                    </div>
                    <div className="pending-events__item d-flex p-3">
                      <p className="pending-events__p mb-0"><span className="pending-events__counte">0</span>Mensajes</p>
                    </div>
                  </div>
                </div>
              </div>
            
            </div>
          </div>
    )
}

export default Home
