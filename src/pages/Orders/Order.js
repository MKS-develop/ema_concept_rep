import moment from 'moment';
import React, {useEffect, useState} from 'react'
import {useLocation, Link, useHistory} from 'react-router-dom';
import firebase from '../../firebase/config'
import Jitsi from 'react-jitsi'

function Order() {

    const data = useLocation()
    const history = useHistory()

    let todayDate = moment().format("ddd, MMM D YYYY, hh:mm").toString()

    const [user, setUser] = useState({})
    const [orderSell, setOrderSell] = useState({})
    const [order, setOrder] = useState({})
    const [comentario, setComentario] = useState("")
    const [modal, setModal] = useState(false)
    
    const [displayName, setDisplayName] = useState('')
    const [roomName, setRoomName] = useState('')
    const [password, setPassword] = useState('')
    const [onCall, setOnCall] = useState(false)

    const handleAPI = (JitsiMeetAPI) => {
      JitsiMeetAPI.executeCommand('toggleVideo')
    }

    const getOrder = async(oid) =>{
      try {
        await firebase.db.collection("Ordenes").doc(oid).get().then((val)=>{
          setOrder(val.data())
          getOrderInfo(val.data())
        })
      } catch (e) {
        console.log(e)
      }
    }
    
    const getOrderInfo = async(order) =>{
      let item = {}
      if(order.tipoOrden === "Servicio" || order.tipoOrden === "Videoconsulta" || order.localidadId === undefined ){
        let reference = (await firebase.db.collection("Ordenes").doc(order.oid).collection("Items").get()).docs
        item = reference[0].data()
        try {
          firebase.db.collection("Localidades").doc(order.localidadId).collection("Servicios").doc(item.servicioid).get().then((doc)=>{
            setOrderSell(doc.data())
          })
        }catch(e){
          console.log(e)
        }
      }
    }

    useEffect(() => {
        if(data.state === undefined || data.state === null){
          window.location.href = "/orders"
        }
        firebase.getCurrentUser().then((val)=>{
          setUser(val)
        })
        getOrder(data.state.oid)
    }, [])
    
    return (
      <div className={`main-content-container ${ !onCall ? "container-fluid px-4" : ""}`}>
        { onCall
          ? (
            <Jitsi
              containerStyle={{ width: '100%', height: '90vh' }}
              roomName={roomName}
              config={{ startAudioMuted: true, enableClosePage: false, enableWelcomePage: false }}
              interfaceConfig={{ filmStripOnly: false, SHOW_PROMOTIONAL_CLOSE_PAGE: false, SHOW_BRAND_WATERMARK: false, SHOW_POWERED_BY: false, SHOW_JITSI_WATERMARK: false }}
              displayName={user.nombre}
              password={password}
              loadingComponent={Loader}
              onAPILoad={handleAPI}
            />)
          : (
            <>
            { modal
              ? <div className="cc-modal-wrapper fadeIn">
                  <div className="cc-modal">
                    <div className="cc-modal-header mb-2">
                        <h3 className="mb-0">Selecciona una opción</h3>
                    </div>
                    <div className="cc-modal-body">
                      <p>¿Deseas ingresar a la videoconsulta con tu paciente ahora?</p>
                    </div>
                    <div className="cc-modal-footer align-items-center justify-content-spacebetween">
                      {/* <div className={`btn ${"btn-primary"}`}> */}
                      <button onClick={()=>{setModal(false)}} className={`btn btn-disabled`}>
                        Cancelar
                      </button>
                      <button onClick={()=>{setOnCall(true)}} className={`btn btn-primary`}>
                        Ir a la videoconsulta
                      </button>
                    </div>
                  </div>
                </div>
              : <div></div>
              }
            <div className="page-header align-items-center justify-content-spacebetween row no-gutters px-4 my-4">
              <div className="col-12 col-sm-5 text-center text-sm-left mb-0">
                <div className="row align-items-center">
                  <div className="col">
                    <p className="page-title bold"><Link className="page-title light" to="/orders">Órdenes</Link> {'>'} Órden</p>
                  </div>
                </div>
              </div>
              <div className="col-12 col-sm-1 mb-0">
                <div className="row align-items-center justify-content-space-around">
                  <i className="material-icons color-white display-5">help_outline</i>
                </div>
              </div>
            </div>
            <h3 className="mb-5">Detalle de la órden</h3>
            <div className="row no-gutters">
              <div className="row col-lg-8 h-fit-content">
                <div className="col-lg-4">
                  <p className="mb-0 bold color-primary">Nombre del cliente</p>
                  <p>{order.user}</p>
                </div>
                <div className="col-lg-4">
                  <p className="mb-0 bold color-primary">Status</p>
                  <p>{order.status}</p>
                </div>
                <div className="col-lg-4">
                  <p className="mb-0 bold color-primary">{order.tipoOrden === "Producto" ? "" : "Fecha" }</p>
                  <p>{order.fecha}</p>
                </div>
                <div className="col-lg-4">
                  <p className="mb-0 bold color-primary">Monto</p>
                  <p>S/{order.precio}</p>
                </div>
                <div className="col-lg-4">
                  <p className="mb-0 bold color-primary">Nro. de órden</p>
                  <p>{order.oid}</p>
                </div>
                <div className="col-lg-4">
                  <p className="mb-0 bold color-primary">Tipo de órden</p>
                  <p>{order.tipoOrden}</p>
                </div>
                <div className=" col-lg-12 row mb-3 align-items-center justify-content-space-around">
                  <div className="col-lg-5">
                    <button onClick={()=>{
                      history.push({
                        pathname: "/clients/client", 
                        state: { uid: order.uid }
                      })
                    }} className="btn btn-primary btn-block">Ver la información del cliente</button>
                  </div>
                  { order.status === "Por confirmar" || order.status === "Por Confirmar" ? <div className="col-lg-4">
                    <button onClick={()=>{ updateOrder() }} className="btn btn-outline-secondary btn-block">Confirmar orden</button>
                  </div> : <div></div> }
                  { order.atendidoStatus === undefined  ? <div className="col-lg-3">
                    <button onClick={()=>{ updateEnAtencionOrder() }} className="btn btn-outline-secondary btn-block btn-no-padding-x">
                      {order.tipoOrden === "Producto" ? "Pedido Recibido" : "Atender" }
                    </button>
                  </div> : <div></div> }
                </div>
                <div className="col-lg-12 pr-2 border-top">
                  { order.atendidoStatus === "En atención" ? <div className="mt-2">
                    <div className="row">
                      <h3 className="mb-4 col-lg-4">
                      {order.tipoOrden === "Producto" ? "Atendido" : "En atención" }
                      </h3>
                      <div className="mb-4 col-lg-4">
                        <div onClick={()=>{updateAtendioOrder()}} className="btn btn-danger">
                          {order.tipoOrden === "Producto" ? "Despachado" : "Cierre de atención" }
                        </div>
                      </div>
                    </div>
                    <h5 className="mb-2">Usuario que esta atendiendo:</h5>
                    <p className="mb-4 color-primary">{user.nombre}</p>
                    <h5 className="mb-2">Desde cuando se esta atendiendo:</h5>
                    <p className="mb-4 color-primary capitalize">{todayDate}</p>
                    <h5 className="mb-2">Comentario adicional</h5>
                    <div className="pr-5">
                      <textarea className="form-control" value={comentario} placeholder="Escribe un comentario referente a este cliente" onChange={(e)=>{setComentario(e.target.value)}} />
                    </div>
                  </div> : <div></div> }
                  { order.atendidoStatus === "Atendido" ? <div className="mt-2">
                    <h3 className="mb-4">Atendido por: {order.usuarioAtendio}</h3>
                    <h5 className="mb-2">Usuario que atendió:</h5>
                    <p className="mb-4 color-primary">{order.usuarioAtendio}</p>
                    <h5 className="mb-2">Cuando se atendió:</h5>
                    <p className="mb-4 color-primary capitalize">{todayDate}</p>
                    <h5 className="mb-2">Comentario adicional</h5>
                    <div className="pr-5">
                      <textarea className="form-control" value={comentario} placeholder="Escribe un comentario referente a este cliente" onChange={(e)=>{setComentario(e.target.value)}} />
                    </div>
                  </div> : <div></div> }
                </div>
              </div>
              
              <div className="col-lg-4">
              { order.tipoOrden === "Servicio" || order.tipoOrden === "Videoconsulta" || orderSell !== undefined ? 
                <div className="card mb-4"> 
                  <div className="card-header-img-width">
                    <img src={orderSell.urlImagen} alt=""/>
                  </div>
                  <div className="px-4">
                    <div className="card-claim-box">
                      <p className="card-claim-title">{orderSell.categoria}</p>
                      <p className="card-claim-text">{orderSell.titulo}</p>
                    </div>
                    <div className="card-claim-box">
                      <p className="card-claim-title">Precio del servicio</p>
                      <p className="card-claim-text">S/{orderSell.precio}</p>
                    </div>
                    <div className="card-claim-box">
                      <p className="card-claim-title">Descripción del servicio</p>
                      <p className="card-claim-text">{orderSell.descripcion}</p>
                    </div>
                    <div className="card-claim-box">
                      <p className="card-claim-title">Condiciones del servicio</p>
                      <p className="card-claim-text">{orderSell.condiciones}</p>
                    </div>
                  </div>
                </div> 
                :  
                // <div className="card">
                //     <div className="card-header-img">
                //       <img src={orderSell.urlImagen} alt=""/>
                //     </div>
                //     <div className="px-4">
                //       <div className="card-claim-box">
                //         <p className="card-claim-text">{orderSell.titulo}</p>
                //       </div>
                //       <div className="card-claim-box">
                //         <p className="card-claim-title">Precio del producto</p>
                //         <p className="card-claim-text">S/{orderSell.precio}</p>
                //       </div>
                //       <div className="card-claim-box">
                //         <p className="card-claim-title">Cantidad del producto</p>
                //         <p className="card-claim-text">{orderSell.cantidad}</p>
                //       </div>
                //     </div>
                //   </div>
                <div></div>
                }
              </div>
            </div>
              
            </>
          )
        }
      </div>
    )

    async function updateOrder(){
      try {
        await firebase.db.collection("Ordenes").doc(order.oid).update({
          status: "Confirmada",
          statusCita: "Confirmada"
        })
        window.location.href = "/orders"

      }catch (e){
        console.log(e)
      }
    }
    
    async function updateAtendioOrder(){
      try {
        await firebase.db.collection("Ordenes").doc(order.oid).collection("Items").get().then((val)=>{
          firebase.db.collection("Ordenes").doc(order.oid).update({
            atendidoStatus: "Atendido",
            usuarioAtendio: user.nombre,
            comentario: comentario,
            horaAtendio: todayDate,
          })
          Promise.all(val.docs.map(async (doc) => {
            firebase.db.collection("Ordenes").doc(order.oid).collection("Items").doc(doc.data().servicioid).update({
              atendidoStatus: "Atendido",
              usuarioAtendio: user.nombre,
              comentario: comentario,
              horaAtendio: todayDate,
            })
          })).then((val)=>{
            // history.push({
            //   pathname: "/client/pet/history",
            //   state: {mid: order.mid, uid: order.uid}
            // })
            window.location.href = "/agenda"
          })
        })
        
      }catch (e){
        console.log(e)
      }
    }

    async function updateEnAtencionOrder(){
      try {
        await firebase.db.collection("Ordenes").doc(order.oid).collection("Items").get().then((val)=>{
          firebase.db.collection("Ordenes").doc(order.oid).update({
            atendidoStatus: "En atención",
            usuarioAtendio: user.nombre,
            comentario: comentario,
            horaAtendio: todayDate,
          })
          Promise.all(val.docs.map(async (doc) => {
            firebase.db.collection("Ordenes").doc(order.oid).collection("Items").doc(doc.data().servicioid).update({
              atendidoStatus: "En atención",
              usuarioAtendio: user.nombre,
              comentario: comentario,
              horaAtendio: todayDate,
            })
          })).then((val)=>{
            // history.push({
            //   pathname: "/client/pet/history",
            //   state: {mid: order.mid, uid: order.uid}
            // })
            if(order.tipoOrden === "Videoconsulta" ){
              setRoomName(order.videoId)
              setModal(true)
            }else{
              window.location.href = "/agenda"
            }
          })
        })
        
      }catch (e){
        console.log(e)
      }
    }

}

const Loader = () => {
  return (
    <div></div>
  )
}

export default Order