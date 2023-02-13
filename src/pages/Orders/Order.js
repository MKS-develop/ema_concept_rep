import moment from 'moment';
import React, {useEffect, useState} from 'react'
import {useLocation, Link, useHistory} from 'react-router-dom';
import firebase from '../../firebase/config'
import Jitsi from 'react-jitsi'

function Order() {

    const data = useLocation()
    const history = useHistory()

    let todayDate = moment().format("ddd, MMM D YYYY, hh:mm").toString()
    let metodosPago = ["Tarjeta de crédito", "Master", "Visa", "American", "Diners", "Efectivo", "Tarjeta de débito", "Otro"]


    const [client, setClient] = useState({})
    const [service, setService] = useState({})
    const [daySelected, setDaySelected] = useState({})
    const [user, setUser] = useState({})
    const [operator, setOperator] = useState({})
    const [orderSell, setOrderSell] = useState({})
    const [order, setOrder] = useState({})
    const [countryInfo, setCountryInfo] = useState({})
    const [role, setRol] = useState({})
    const [infoPago, setInfoPago] = useState({
      metodoPago: "",
      referencia: "",
      monto: 0,
      fecha: todayDate,
    })

    const [services, setServices] = useState([])
    const [agendaDays, setAgendaDays] = useState([])
    const [itemsProducts, setItemsProducts] = useState([])

    const [horaSelected, setHoraSelected] = useState("")
    const [comentario, setComentario] = useState("")
    const [successMsg, setSuccessMsg] = useState("");
    const [displayName, setDisplayName] = useState('')
    const [roomName, setRoomName] = useState('')
    const [password, setPassword] = useState('')

    
    const [activeModal, setActiveModal] = useState(false)
    const [activeModalDays, setActiveModalDays] = useState(false)
    const [activeModalSuccess, setActiveModalSuccess] = useState(false)
    const [modal, setModal] = useState(false)
    const [success, setSuccess] = useState(false);
    const [onCall, setOnCall] = useState(false)
    const [loadingComplete, setLoadingComplete] = useState(false)
    const [modalPago, setModalPago] = useState(false)
    const [successOrderStatus, setSuccessOrderStatus] = useState(false)
    const [cancelDateModal, setCancelDateModal] = useState(false)
    const [successInCancelDate, setSuccessInCancelDate] = useState(false)

    const handleAPI = (JitsiMeetAPI) => {
      setLoadingComplete(true)
      JitsiMeetAPI.executeCommand('toggleVideo')
      setLoadingComplete(false)
    }

    const getServices = async(id, r) =>{
      let tipos = [];
      let tipos2 = [];
      
      if(r["canViewAllCenters"] === true){
        await firebase.db.collection("Localidades").get().then(val=>{
          val.docs.forEach(item=>{
              tipos.push(item.data())
          })
        })
      }else{
        await firebase.db.collection("Localidades").where("aliadoId", "==", id).get().then(val=>{
          val.docs.forEach(item=>{
              tipos.push(item.data())
          })
        })
      }

      Promise.all(tipos.map(async (doc) => {
        
        firebase.db.collection("Localidades").doc(doc.localidadId).collection("Servicios").get().then(val=>{
          val.docs.forEach(item=>{
            let o1 = item.data()
            o1["nombreLocalidad"] = doc.nombreLocalidad
            o1["direccionDetallada"] = doc.direccionDetallada
            tipos2.push(o1)
          })
        })

      }))

      console.log(tipos)
      console.log(tipos2)

      setTimeout(() => {
        setServices(tipos2)
      }, 500);

    }

    const getClientInfo = async(id)=> {
      let object = (await firebase.db.collection("Dueños").doc(id).get()).data()
      setClient(object)
    }

    const getOperatorInfo = async(id)=> {
      let object = (await firebase.db.collection("Aliados").doc(id).get()).data()
      setOperator(object)
    }

    const getOrder = async(oid) =>{
      try {
        await firebase.db.collection("Ordenes").doc(oid).onSnapshot((val)=>{

          let object ={
            ...val.data(),
            fechaCreacion: moment(val.data()["createdOn"].toDate()).format("D MMMM YYYY, h:mm a")
          }

          setOrder(object)
          getOrderInfo(object)
          getClientInfo(val.data()["uid"])
          val.data()["operatorId"] && getOperatorInfo(val.data()["operatorId"])
        })
      } catch (e) {
        console.log(e)
      }
    }
    
    const getOrderInfo = async(orderParam) =>{
      let item = {}
      let tiposList = []
      if(orderParam.tipoOrden === "Servicio" || orderParam.tipoOrden === "Videoconsulta"){
        let reference = (await firebase.db.collection("Ordenes").doc(orderParam.oid).collection("Items").get()).docs
        item = reference[0].data()
        try {
          firebase.db.collection("Localidades").doc(orderParam.localidadId).collection("Servicios").doc(item.servicioid).onSnapshot((doc)=>{
            setOrderSell(doc.data() ?? {})
          })
        }catch(e){
          console.log(e)
        }
      }else if(orderParam.tipoOrden === "Producto"){
        
        await firebase.db.collection("Ordenes").doc(orderParam.oid).collection("Items").get().then((val)=>{
          Promise.all(val.docs.map(async (doc) => {
        
            firebase.db.collection("Productos").doc(doc.data().productoId).get().then((d)=>{
              tiposList.push(d.data() ?? {})
            })
            
          }))
          
        })

        setTimeout(() => {
          setItemsProducts(tiposList)
        }, 500);

      }

    }

    async function getDaysFromService(s){
      let tipos = [];
      
      setService(s)

      await firebase.db.collection("Localidades").doc(s.localidadId)
      .collection("Servicios").doc(s.servicioId).collection("Agenda").orderBy("createdOn", "asc").get().then(val=>{
        val.docs.forEach(item=>{
          let d = moment(item.data().date.toDate())
          let today = moment().subtract(1, "d")
          d.isSameOrAfter(today) && tipos.push(item.data())
        })
        setAgendaDays(tipos)
      })

    }

    const Loader = () => {
      return (
        <div 
        style={{
          position: "absolute",
          zIndex: "-10",
          width: '100%', 
          height: '90vh',
          // top: "0",
          left: "0",
        }}
        className="p404">Cargando, espere un momento...</div>
      )
    }

    const SuccessComponent = ({msg}) => {
      return (
          <div className="success-alert">
              <span className="material-icons mr-2">done</span>
              {msg}
              <div onClick={()=>{setSuccess(false)}} className="material-icons ml-2 cursor-pointer">close</div>
          </div>
      )
    }

    useEffect(() => {
        if(data.state === undefined || data.state === null){
          window.location.href = "/orders"
        }
        firebase.getCurrentUser().then((val)=>{
          setUser(val)
          firebase.getRoleInfo(val.role ?? "Atencion").then((r)=>{
            setRol(r)
            getServices(val.aliadoId, r)
          })
          // firebase.getCountryInfo(val.pais).then((val)=>{
          //   setCountryInfo(val.data())
          // })
        })
        getOrder(data.state.oid)
    }, [])
    
    return (
      <div className={`main-content-container ${ !onCall ? "container-fluid px-4" : ""}`}>
        {cancelDateModal && <div className="cc-modal-wrapper fadeIn">
            <div className="c2-modal">
                <div className="cc-modal-header mb-4">
                  <span className="mb-0 material-icons" style={{color: "var(--danger)", fontSize: "69px"}}>cancel</span>
                </div>
                <div className="c2-modal-body text-center mb-4">
                   <p className="mb-0">
                    {successInCancelDate ? 'Cita cancelada exitosamente' : 'Deseas cancelar esta cita?'}
                   </p>
                </div>
                <div className="cc-modal-footer align-items-center justify-content-spacebetween">
                {successInCancelDate ? 
                  <button onClick={()=>{ 
                    setCancelDateModal(false); setSuccessInCancelDate(false)
                  }} className={`btn btn-default btn-block`}>
                    Continuar
                  </button>
                : 
                  <>
                    <button onClick={()=>{ 
                      handleCancelDate() 
                    }} className={`btn btn-danger mr-3`}>
                      Aceptar
                    </button>
                    <button onClick={()=>{ setCancelDateModal(false) }} className={`btn btn-default ml-3`}>
                      Regresar
                    </button>
                  </>
                }
                </div>
            </div>
        </div>}
        {activeModalSuccess && <div className="cc-modal-wrapper fadeIn">
            <div className="c2-modal">
                <div className="cc-modal-header mb-2">
                  <span className="mb-0 material-icons" style={{color: "var(--success)", fontSize: "69px"}}>check_circle</span>
                </div>
                <div className="c2-modal-body">
                   <p className="mb-0">
                    Cita creada exitosamente
                   </p>
                </div>
                <div className="cc-modal-footer align-items-center justify-content-spacebetween">
                  <button onClick={()=>{ setActiveModalSuccess(false) }} className={`btn btn-success btn-block`}>
                    Aceptar
                  </button>
                </div>
            </div>
        </div>}
        {activeModal && <div className="cc-modal-wrapper fadeIn">
          <div className="cc-modal">
            <div className="cc-modal-header mb-2">
              <div className="no-gutters mb-3 row align-items-center justify-content-spacebetween">
                <h3 className="mb-0">Selecciona el servicio</h3>
              </div>
            </div>
            <div className="cc-modal-body">
              {services.map((s)=>{
                return (
                  <div onClick={()=>{ service === s ? setService({}) : getDaysFromService(s) }} className={`cc-modal-card-2 m-2 cursor-pointer ${service === s ? "active" : "" }`} style={{backgroundImage: `url(${s.urlImagen})`, display: s["estadoServicio"] !== "Borrador" ? "block" : "none" }} key={s.servicioId}>
                    <div className="cc-modal-card-overlay">
                      <p className="mb-0 cc-modal-card-p">
                        {s.direccionDetallada}
                      </p>
                      <p style={{width: "fit-content"}} className="pill-secondary rounded">{s.nombreLocalidad}</p>
                      <p className="mb-0 cc-modal-card-p-strong">
                        {s.titulo}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
            <div className="cc-modal-footer align-items-center justify-content-spacebetween">

              <button onClick={()=>{ setActiveModal(false) }} className={`btn btn-disabled`}>
                Cancelar
              </button>
              <button onClick={()=>{ setActiveModalDays(true); setActiveModal(false) }} className={`btn ${ service.servicioId !== undefined ? "btn-primary" : "btn-disabled"}`}>
                Continuar
              </button>

            </div>
          </div>
        </div>}
        {successOrderStatus && <div className="cc-modal-wrapper fadeIn">
          <div className="c3-modal">
            <div className="cc-modal-header mb-2">
              <div className="no-gutters mb-3 row align-items-center justify-content-spacebetween">
                <h3 className="mb-0">Reservación</h3>
              </div>
            </div>
            <div className="cc-modal-body" style={{padding: "0rem 0rem"}}>

            <div className="container-creation-success py-5" style={{width: "100%", height: "100%"}}>
                <h3 className="mb-2">Reservación creada exitosamente</h3>
                <span className="color-success material-icons">done</span>
                <div className="row no-gutters">
                    <div className="col-lg-12">
                    <button onClick={()=>{ setSuccessOrderStatus(false) }} className={`btn btn-primary`}>
                      Aceptar
                    </button>
                </div>
                </div>
              </div>
            </div>
          </div>
        </div>}
        {activeModalDays && <div className="cc-modal-wrapper fadeIn">
          <div className="c3-modal">
            <div className="cc-modal-header mb-2">
              <div className="no-gutters mb-3 row align-items-center justify-content-spacebetween">
                <h3 className="mb-0">Selecciona el día y la hora</h3>
              </div>
            </div>
            <div className="cc-modal-body">

              <div style={{width: "inherit"}}>
                <div className="agenda-days-slider">
                  {agendaDays.map((d, i)=>{
                    return (
                      <p className={`${daySelected === d && "day-active"} ${(d["horasDia"].length === 0) && "d-none"} mb-0`} onClick={()=>{ setDaySelected(d) }} key={i}>
                        {d.bloqueado && <> <i className="material-icons">lock</i> <br/> </>}
                        {d.fecha}
                      </p>
                    )
                  })}
                </div>
                  
                { (service.tipoAgenda === "Slots" && daySelected.horasDia !== undefined  ) && 
                  <div className="mt-3 slots-day"> 
                    {
                      daySelected.horasDia.map((h, i)=> <div onClick={()=>{ setHoraSelected(h) }} className={`pill-secondary-2 ${horaSelected === h && "active"}`} key={i}>{h}</div>)
                    }
                  </div>
                }

              </div>
            </div>
            <div className="cc-modal-footer align-items-center justify-content-spacebetween">
              <button onClick={()=>{ setActiveModalDays(false); setActiveModal(true); setDaySelected({}); setHoraSelected("") }} className={`btn btn-disabled`}>
                Volver
              </button>
              <button onClick={()=>{ (daySelected["horasDia"] !== undefined && horaSelected !== "") && changeReservation()}} className={`btn btn-primary`}>
                Continuar
              </button>
            </div>
          </div>
        </div>}
        {success && <SuccessComponent msg={successMsg === "" ? "Pago registrado exitosamente" : successMsg}/>}
        {modalPago && <div className="cc-modal-wrapper fadeIn">
          <div className="c2-modal">
              <div className="cc-modal-header mb-2">
                  <h3 className="mb-0">Registro de pago</h3>
              </div>
              <div className="email-box my-3">

                <select onChange={(e)=>{ setInfoPago({...infoPago, metodoPago: e.target.value}) }} className="form-control mb-4">
                  <option value="">Método de pago</option>
                  {metodosPago.map((met, i)=>{
                    return (
                      <option value={met}>{met}</option>
                    )
                  })}
                </select>
                <input placeholder="Referencia" onChange={(e)=>{ setInfoPago({...infoPago, referencia: e.target.value}) }} type="text" className="form-control mb-4"/>
                <div className="input-group mb-4">
                  <div className="input-group-prepend">
                    <span className="input-group-text">{countryInfo.simbolo ?? " "}</span>
                  </div>
                  <input type="number" onChange={(e)=>{ setInfoPago({...infoPago, monto: e.target.value}) }} placeholder="Monto" className="form-control"/>
                </div>

                <p className="mb-2 color-primary">Fecha: {todayDate}</p>

              </div>
              <div className="cc-modal-footer align-items-center justify-content-spacebetween">
                <button onClick={()=>{setModalPago(false)}} className="btn btn-outline-secondary mr-5">
                  Cancelar
                </button>
                <button onClick={()=>{
                  registerPayment()
                }} className="btn btn-primary btn-block">Registrar</button>
              </div>
          </div>
        </div>}
        { onCall
          ? (
            <Jitsi
              containerStyle={{ 
                width: '100%', 
                height: '90vh', 
                display: "block", 
                position: "absolute",
                zIndex: "111",
                // top: "0",
                left: "0",
              }}
              roomName={roomName}
              config={{ startAudioMuted: true, enableClosePage: true, enableWelcomePage: true }}
              interfaceConfig={{ filmStripOnly: false, SHOW_PROMOTIONAL_CLOSE_PAGE: false, SHOW_BRAND_WATERMARK: false, SHOW_POWERED_BY: false, SHOW_JITSI_WATERMARK: false }}
              displayName={user.nombre}
              password={password}
              loadingComponent={Loader}
              onAPILoad={handleAPI}
            />)
          : (
            <>
            { modal
              ?
                <div className="cc-modal-wrapper fadeIn">
                    <div className="c2-modal">
                        <div className="cc-modal-header mb-2">
                            <h3 className="mb-0">Selecciona una opción</h3>
                        </div>
                        <div className="c2-modal-body">
                           <p className="mb-0">
                            ¿Deseas ingresar a la videoconsulta con tu paciente ahora?
                           </p>
                        </div>

                        <div className="cc-modal-footer align-items-center justify-content-spacebetween">
                          <button onClick={()=>{setModal(false)}} className="btn btn-outline-secondary">
                            Cancelar
                          </button>
                          <button onClick={()=>{ setOnCall(true) }} className={`btn btn-primary`}>
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
                  <p className="page-title bold"><Link className="page-title light" to="/orders">Citas</Link> {'>'} Cita</p>
                </div>
              </div>
            </div>
            <div className="col-12 col-sm-1 mb-0">
              <div className="row align-items-center justify-content-space-around">
                <i className="material-icons color-white display-5">help_outline</i>
              </div>
            </div>
          </div>
            <h3 className="mb-5">Detalle de la cita</h3>
            <div className="row no-gutters">
              <div className="row col-lg-8 h-fit-content">
                <div className="col-lg-4">
                  <p className="mb-0 bold color-primary">Nombre del paciente</p>
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
                  <p className="mb-0 bold color-primary">Hora</p>
                  <p>{order.hora}</p>
                </div>
                <div className="col-lg-4">
                  <p className="mb-0 bold color-primary">Operador</p>
                  <p className="max-text-ellipsis">{operator?.nombre ?? "-"}</p>
                </div>
                <div className="col-lg-4">
                  <p className="mb-0 bold color-primary">Nro. de órden</p>
                  <p className="max-text-ellipsis">{order.oid}</p>
                </div>
                <div className="col-lg-4">
                  <p className="mb-0 bold color-primary">Tipo de órden</p>
                  <p>{order.tipoOrden}</p>
                </div>
                <div className="col-lg-4">
                  <p className="mb-0 bold color-primary">Creada el</p>
                  <p>{order.fechaCreacion}</p>
                </div>
                <div className=" col-lg-12 row mb-3 align-items-center">
                  
                  <div className="col-lg-5 mb-2">
                    <button onClick={()=>{
                      history.push({
                        pathname: "/clients/client", 
                        state: { uid: order.uid }
                      })
                    }} className="btn btn-primary btn-block">Información del paciente</button>
                  </div>
                  
                  { ( order.status === "Por confirmar" || order.status === "Por Confirmar" ) && <div className="col-lg-4 mb-2">
                    <button onClick={()=>{ updateOrder() }} className="btn btn-outline-secondary btn-block">Confirmar orden</button>
                  </div> }
                  

                  { ( ( order.tipoOrden === "Servicio" || order.tipoOrden === "Videoconsulta" ) && order.atendidoStatus === undefined) && <div className="col-lg-3 mb-2">
                    <button onClick={()=>{ updateEnAtencionOrder() }} className="btn btn-outline-secondary btn-block btn-no-padding-x">
                      Atender
                    </button>
                  </div> }

                  { ( order.tipoOrden === "Producto" && order.atendidoStatus === undefined ) && <div className="col-lg-3 mb-2">
                    <button onClick={()=>{ updateEnAtencionOrder() }} className="btn btn-outline-secondary btn-block btn-no-padding-x">
                      Despachar
                    </button>
                  </div> }

                  <div className="col-lg-4 mb-2">
                    <div onClick={()=>{ setActiveModal(true) }} className="btn btn-primary btn-block">Reagendar</div>
                  </div>

                  <div className="col-lg-4 mb-2">
                    <div onClick={()=>{ setCancelDateModal(true) }} className="btn btn-danger btn-block">Cancelar cita</div>
                  </div>

                </div>
                <div className="col-lg-12 pr-2 border-top">
                  
                  { order.atendidoStatus === "En atención" && <div className="mt-2">
                    <div className="row">
                      <h3 className="mb-4 col-lg-4">
                      {order.tipoOrden === "Producto" ? "Despachado" : "En atención" }
                      </h3>
                      <div className="mb-4 col-lg-4">

                        <div onClick={()=>{updateAtendioOrder()}} className="btn btn-danger">
                          {order.tipoOrden === "Producto" ? "Entregado" : "Cierre de atención" }
                        </div>

                      </div>
                    </div>
                    <h5 className="mb-2">Usuario que { order.tipoOrden === "Producto" ? "despacho" : "esta atendiendo"}:</h5>
                    <p className="mb-4 color-primary">{user.nombre}</p>
                    <h5 className="mb-2">Desde cuando se { order.tipoOrden === "Producto" ? "despacho" : "esta atendiendo"}:</h5>
                    <p className="mb-4 color-primary capitalize">{todayDate}</p>
                  </div> }

                  { order.atendidoStatus === "Atendido" && <div className="mt-2">
                    <h3 className="mb-4">{order.tipoOrden === "Producto" ? "Entregado" : "Atendido"} por: {order.usuarioAtendio}</h3>
                    <h5 className="mb-2">Usuario que {order.tipoOrden === "Producto" ? "entregó" : "atendió"}:</h5>
                    <p className="mb-4 color-primary">{order.usuarioAtendio}</p>
                    <h5 className="mb-2">Cuando se {order.tipoOrden === "Producto" ? "entregó" : "atendió"}:</h5>
                    <p className="mb-4 color-primary capitalize">{order.horaAtendio ?? todayDate}</p>
                    { order.comentario === "" || order.comentario === undefined ? <></> : <h5 className="mb-2">Comentario adicional</h5>}
                    { order.comentario === "" || order.comentario === undefined ? <div className="pr-5">
                      <textarea className="form-control" value={comentario} placeholder="Escribe un comentario referente a este paciente" onChange={(e)=>{setComentario(e.target.value)}} />
                      <div onClick={()=>{ comentario !== "" ? saveComment() : console.log("Error") }} className="btn btn-outline-primary">
                        Guardar comentario
                      </div>
                    </div> : <p className="mb-4 color-primary capitalize">{order.comentario}</p> }
                  </div> }

                </div>
              </div>
              
              <div className="col-lg-4">
                { (order.tipoOrden === "Servicio" || order.tipoOrden === "Videoconsulta" || order.tipoOrden === "videoconsulta") &&
                  <div className="card mb-4"> 
                    <div className="card-header-img-width">
                      <img src={orderSell.urlImagen} alt=""/>
                    </div>
                    <div className="px-4">
                      <div className="card-claim-box">
                        <p className="card-claim-title">{orderSell.categoria}</p>
                        <p className="card-claim-text">{orderSell.titulo}</p>
                      </div>
                      {/* <div className="card-claim-box">
                        <p className="card-claim-title">Precio del servicio</p>
                        <p className="card-claim-text">{countryInfo.simbolo ?? " "}{orderSell.precio}</p>
                      </div> */}
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
                }
                { order.tipoOrden === "Producto" &&
                  itemsProducts.map((product, i)=>{
                    let precioRounded = Math.round(product.precio * 100) / 100
                    return (
                      <div className="col-md-12 col-sm-12">
                          <div key={product.productId} className="card-product mb-4">
                              <div className="card-body">
                                  <div className="row">
                                      <div className="col-md-5 col-sm-5">
                                          <div className="card-img h-50">
                                              <img src={product.urlImagen} alt={product.urlImagen}/>
                                          </div>
                                      </div>
                                      <div className="col-md-7 col-sm-7">
                                          <div className="card-product-title">
                                              <p className="card-text">{product.titulo}</p>
                                          </div>
                                          <p className="card-text-type">{product.tipoMascota}</p>
                                          <p className="card-text-price">{countryInfo.simbolo ?? " "}{precioRounded}</p>
                                      </div>
                                  </div>   
                              </div>
                          </div>
                      </div>
                    )
                  })
                }
              </div>
            </div>
              
            </>
          )
        }
      </div>
  )

  async function handleCancelDate(){
    await firebase.db.collection("Localidades").doc(orderSell["localidadId"]).collection("Servicios").doc(orderSell["servicioId"]).collection("Agenda").doc(order.fecha).get().then(async(doc)=>{
      if(doc.exists){
        let hours = [...doc.data()["horasDia"]]
        let indexReplacement = 0
  
        for (let i = 0; i < hours.length; i++) {
          const h = hours[i];
          
          let intHourFromAgendaList = h.split(":")
          let intHourFromAgenda = parseFloat(intHourFromAgendaList[0] + intHourFromAgendaList[1])
          let intHourFromOrderList = order["hora"].split(":")
          let intHourFromOrder = parseFloat(intHourFromOrderList[0] + intHourFromOrderList[1])
          
          if(intHourFromAgenda > intHourFromOrder){
            indexReplacement = i
            i = hours.length - 1
          }
        }
          
        hours.splice(indexReplacement, 0, order.hora)
        await doc.ref.update({
          horasDia: hours
        })
      }
    }).then(async()=>{
      setSuccessInCancelDate(true)
      await firebase.db.collection("Ordenes").doc(order["oid"]).update({
        status: "Cancelada",
        statusCita: "Cancelada"
      })
    })
  }

  //a0I68HPNc4dP4dAmkMtHgWZsSsw2
  async function changeReservation(){
    await firebase.db.collection("Localidades").doc(orderSell["localidadId"]).collection("Servicios").doc(orderSell["servicioId"]).collection("Agenda").doc(order.fecha).get().then(async(doc)=>{
      if(doc.exists){
        let hours = [...doc.data()["horasDia"]]
        let indexReplacement = 0
  
        for (let i = 0; i < hours.length; i++) {
          const h = hours[i];
          
          let intHourFromAgendaList = h.split(":")
          let intHourFromAgenda = parseFloat(intHourFromAgendaList[0] + intHourFromAgendaList[1])
          let intHourFromOrderList = order["hora"].split(":")
          let intHourFromOrder = parseFloat(intHourFromOrderList[0] + intHourFromOrderList[1])
          
          if(intHourFromAgenda > intHourFromOrder){
            indexReplacement = i
            i = hours.length - 1
          }
        }
          
        hours.splice(indexReplacement, 0, order.hora)
        await doc.ref.update({
          horasDia: hours
        })
      }
    }).then(async()=>{
      await updateNewOrder()
      await removeHourFromDay()
      await createClientInCenter()
      window.location.reload()
    })

  }

  async function removeHourFromDay(){
    let listOfHours = [...daySelected.horasDia].filter((prv, i)=>( prv !== horaSelected))

    await firebase.db.collection("Localidades").doc(service.localidadId)
    .collection("Servicios").doc(service.servicioId)
    .collection("Agenda").doc(daySelected.fecha).update({
        horasDia: listOfHours
    })
    console.log("removeHourFromDay")

  }

  async function updateNewOrder(){
    console.log(order)
    try{
      await firebase.db.collection("Ordenes").doc(order["oid"]).update({
        servicioid: service["servicioId"],
        localidadId: service["localidadId"],
        aliadoId: service["aliadoId"],
        date: daySelected.date,
        fecha: daySelected.fecha,
        hora: horaSelected,
        centro: service["nombreLocalidad"]
      })
      await firebase.db.collection("Ordenes").doc(order["oid"]).collection("Items").doc(order["servicioid"]).delete()
      await firebase.db.collection("Ordenes").doc(order["oid"]).collection("Items").doc(service["servicioId"]).set({
        aliadoId: user.masterId,
        operatorId: user.aliadoId,
        date: daySelected.date,
        delivery: service.delivery,
        domicilio: service.domicilio,
        fecha: daySelected.fecha,
        hora: horaSelected,
        mid: "",
        nombre: client.user,
        nombreComercial: user.nombreComercial,
        oid: order["oid"],
        petthumbnailUrl: client.url,
        precio: service.precio,
        servicioid: service.servicioId,
        tieneDelivery: false,
        tieneDomicilio: false,
        titulo: service.titulo,
        uid: client["uid"],
      })
    }catch(e){
      console.log(e)
    }
    console.log("updateOrder")
  }
 
  async function createClientInCenter(){
    await firebase.db.collection("Aliados").doc(service.aliadoId).collection("Clients").doc(client["uid"]).set({
      uid: client["uid"],
      email: client["email"],
      identificacion: client["identificacion"],
      telefono: client["telefono"],
      user: client["user"],
      url: client["url"],
      walkin: true,
    })
    console.log("createClientInCenter")
  }

  async function registerPayment(){
    try {
      await firebase.db.collection("Ordenes").doc(order.oid).update({
        status: "Pagada",
        statusCita: "Pagada",
        statusPago: "Pagada",
        informacionPago: infoPago
      })

      setModalPago(false)
      setSuccessMsg("Pago registrado exitosamente")
      setSuccess(true)
      setTimeout(() => {
        setSuccess(false)
      }, 4000);

    }catch (e){
      console.log(e)
    }
  }
    
  async function updateOrder(){
    try {
      await firebase.db.collection("Ordenes").doc(order.oid).update({
        status: "Confirmada",
        statusCita: "Confirmada"
      })

    }catch (e){
      console.log(e)
    }
  }
    
  async function saveComment(){
    try {
      await firebase.db.collection("Ordenes").doc(order.oid).collection("Items").get().then((val)=>{
        firebase.db.collection("Ordenes").doc(order.oid).update({
          comentario: comentario,
        })
        
        Promise.all(val.docs.map(async (doc) => {
          firebase.db.collection("Ordenes").doc(order.oid).collection("Items").doc(doc.data().servicioid).update({
            comentario: comentario,
          })
        }))

      })
      
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

        if( order.tipoOrden === "Producto" ){
          firebase.db.collection("Ordenes").doc(order.oid).update({
            status: "Entregado",
            statusCita: "Entregado"
          })
        }else{
          firebase.db.collection("Ordenes").doc(order.oid).update({
            status: "Atendido",
            statusCita: "Atendido"
          })
        }

        Promise.all(val.docs.map(async (doc) => {
          firebase.db.collection("Ordenes").doc(order.oid).collection("Items").doc(doc.data().servicioid).update({
            atendidoStatus: "Atendido",
            usuarioAtendio: user.nombre,
            comentario: comentario,
            horaAtendio: todayDate,
          })
        }))

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

        if( order.tipoOrden === "Producto" ){
          firebase.db.collection("Ordenes").doc(order.oid).update({
            status: "Despachado",
            statusCita: "Despachado"
          })
        }else{
          firebase.db.collection("Ordenes").doc(order.oid).update({
            status: "En atención",
            statusCita: "En atención"
          })
        }
        
        Promise.all(val.docs.map(async (doc) => {
          firebase.db.collection("Ordenes").doc(order.oid).collection("Items").doc(doc.data().servicioid).update({
            atendidoStatus: "En atención",
            usuarioAtendio: user.nombre,
            comentario: comentario,
            horaAtendio: todayDate,
          })
        })).then((val)=>{
          
          if(order.tipoOrden === "Videoconsulta" || order.tipoOrden === "videoconsulta"){
            setRoomName(order.videoId)
            setModal(true)
          }

        })
      })
      
    }catch (e){
      console.log(e)
    }
  }

}

export default Order