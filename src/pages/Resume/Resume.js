import moment from 'moment'
import 'moment/locale/es-mx';
import React, {useState, useEffect} from 'react'
import CardResume from './CardResume';
import firebase from '../../firebase/config'
import { useHistory } from "react-router";

function Resume() {
    const history = useHistory()
    const [tm, setTm] = useState(moment().toDate().getMonth())

    const [cal, setCal] = useState(0)
    const [calT, setCalT] = useState(0)
    const [lengthO, setLengthO] = useState(0)
    
    const [cal2, setCal2] = useState(0)
    const [calT2, setCalT2] = useState(0)
    const [lengthO2, setLengthO2] = useState(0)
    
    const [cal3, setCal3] = useState(0)
    const [calT3, setCalT3] = useState(0)
    const [lengthO3, setLengthO3] = useState(0)
    
    const [cal4, setCal4] = useState(0)
    const [calT4, setCalT4] = useState(0)
    const [lengthO4, setLengthO4] = useState(0)
    
    const [cal5, setCal5] = useState(0)
    const [calT5, setCalT5] = useState(0)
    const [lengthO5, setLengthO5] = useState(0)
    
    const [cal6, setCal6] = useState(0)
    const [calT6, setCalT6] = useState(0)
    const [lengthO6, setLengthO6] = useState(0)
    
    const [user, setUser] = useState({})

    const location = {
      pathname: '/resume',
    }
    
    async function handleOnChange(e){
      setTm(parseInt(e.target.value))
      await getOrders(user.aliadoId)
      pussh(tm)
    }

    const pussh = (tm) =>{
      history.push(location)
    }

    const getOrders = async(id) =>{
      //CLientes
      await firebase.db.collection('Ordenes').where("aliadoId", "==", id)
      .get().then(val => {
        let tipos = []
        val.docs.forEach( item => { 
          tipos.push(item.data())
        })
        setLengthO(tipos.length)
        setCal(filterOrders(tipos)[0])
        setCalT(filterOrders(tipos)[1])
      })
      //Ordenes procesadas
      await firebase.db.collection('Ordenes').where("status", "==", "Confirmada").where("aliadoId", "==", id)
      .get().then(val => {
        let tipos = []
        val.docs.forEach( item => { 
          tipos.push(item.data())
        })
        setLengthO2(tipos.length)
        setCal2(filterOrders(tipos)[0])
        setCalT2(filterOrders(tipos)[1])
      })
      //Monto ordenes
      await firebase.db.collection('Ordenes').where("aliadoId", "==", id)
      .get().then(val => {
        let tipos = []
        val.docs.forEach( item => { 
          tipos.push(item.data())
        })
        setLengthO3(tipos.length)
        setCal3(filterOrdersPrice(tipos)[0])
        setCalT3(filterOrdersPrice(tipos)[1])
      })
      //Promoción
      await firebase.db.collection('Ordenes').where("tipoOrden", "==", "Servicio").where("aliadoId", "==", id)
      .get().then(val => {
        let tipos = []
        val.docs.forEach( item => { 
          tipos.push(item.data())
        })
        setLengthO4(tipos.length)
        setCal4(filterOrdersPrice(tipos)[0])
        setCalT4(filterOrdersPrice(tipos)[1])
      })
      //Servicios
      await firebase.db.collection('Ordenes').where("tipoOrden", "==", "Servicio").where("aliadoId", "==", id)
      .get().then(val => {
        let tipos = []
        val.docs.forEach( item => { 
          tipos.push(item.data())
        })
        setLengthO5(tipos.length)
        setCal5(filterOrdersPrice(tipos)[0])
        setCalT5(filterOrdersPrice(tipos)[1])
      })
      //Productos
      await firebase.db.collection('Ordenes').where("tipoOrden", "==", "Producto").where("aliadoId", "==", id)
      .get().then(val => {
        let tipos = []
        val.docs.forEach( item => { 
          tipos.push(item.data())
        })
        setLengthO6(tipos.length)
        setCal6(filterOrdersPrice(tipos)[0])
        setCalT6(filterOrdersPrice(tipos)[1])
      })
    }

    function getSum(total, num) {
      return total + num;
    }

    const filterOrders = (ordenes) => {
      let calculatePass = []
      let calculateToday = []
      ordenes.forEach((orden)=>{
        let od = orden.createdOn.toDate()
        let odd = moment(od).toDate()
        let lm = odd.getMonth()
        if(tm === (lm + 1)){
          calculatePass.push(orden)
        }
        if(tm === lm){
          calculateToday.push(orden)
        }
      })
      return [calculatePass.length, calculateToday.length]
    }
    
    const filterOrdersPrice = (ordenes) => {
      let calculatePass = []
      let calculateToday = []
      ordenes.forEach((orden)=>{
        let od = orden.createdOn.toDate()
        let odd = moment(od).toDate()
        let lm = odd.getMonth()
        if(tm === (lm + 1)){
          calculatePass.push(orden.precio)
        }
        if(tm === lm){
          calculateToday.push(orden.precio)
        }
      })
      return [calculatePass.reduce(getSum, 0), calculateToday.reduce(getSum, 0)]
    }

    useEffect(() => {
        firebase.getCurrentUser().then(val=>{
          setUser(val)
          getOrders(val.aliadoId)
        })
    }, [getOrders])

    return (
        <div className="main-content-container container-fluid px-4">

            <div className="page-header align-items-center justify-content-spacebetween row no-gutters px-4 my-4">
              <div className="col-12 col-sm-5 text-center text-sm-left mb-0">
                <div className="row align-items-center">
                  <div className="col-md-3 col-sm-12">
                    <p className="page-title">Resumen</p>
                  </div>
                  <div className="col-md-5 col-sm-12">
                    <div className="form-group mb-0">
                      <select className="form-control" value={tm} onChange={(e)=>{handleOnChange(e)}}>
                        <option value="0">Enero</option>
                        <option value="1">Febrero</option>
                        <option value="2">Marzo</option>
                        <option value="3">Abril</option>
                        <option value="4">Mayo</option>
                        <option value="5">Junio</option>
                        <option value="6">Julio</option>
                        <option value="7">Agosto</option>
                        <option value="9">Octubre</option>
                        <option value="8">Septiembre</option>
                        <option value="10">Noviembre</option>
                        <option value="11">Diciembre</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-12 col-sm-1 mb-0">
                <div className="row align-items-center justify-content-space-around">
                  <i className="material-icons color-white display-5">help_outline</i>
                </div>
              </div>
            </div>
            <div className="container row align-items-center">
              <div className="col-md-4 col-sm-12 mb-4">
                <CardResume mesAnterior={cal} mesActual={calT} titulo="Clientes" cantidad={lengthO}/>
              </div>
              <div className="col-md-4 col-sm-12 mb-4">
                <CardResume mesAnterior={cal2} mesActual={calT2} titulo="Órdenes procesadas" cantidad={lengthO2}/>
              </div>
              <div className="col-md-4 col-sm-12 mb-4">
                <CardResume mesAnterior={cal3} mesActual={calT3} titulo="Monto órdenes" cantidad={lengthO3}/>
              </div>
              <div className="col-md-4 col-sm-12 mb-4">
                <CardResume mesAnterior={cal4} mesActual={calT4} titulo="Promoción" cantidad={lengthO4}/>
              </div>
              <div className="col-md-4 col-sm-12 mb-4">
                <CardResume mesAnterior={cal5} mesActual={calT5} titulo="Ventas servicios" cantidad={lengthO5}/>
              </div>
              <div className="col-md-4 col-sm-12 mb-4">
                <CardResume mesAnterior={cal6} mesActual={calT6} titulo="Ventas productos" cantidad={lengthO6}/>
              </div>

            </div>

          </div>
    )
}

export default Resume
