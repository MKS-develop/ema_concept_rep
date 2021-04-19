import React, {useState, useEffect} from 'react'
import {Link, useLocation} from 'react-router-dom';
import firebase from '../../firebase/config'
import moment from 'moment';

function AddServices() {

    const [user, setUser] = useState({})
    let data = useLocation()
    const [selectedServices, setSelectedServices] = useState([])
    let selectedIds = []
    const [LPID, setLPID] = useState("");
    const [services, setServices] = useState([])

    const getLPID = async(id) =>{
      await firebase.db.collection("Localidades").where("lc", "==", "Localidad Principal")
      .where("aliadoId", "==", id).get().then(val=>{
        val.docs.forEach(item=>{
          setLPID(item.data().localidadId)
          getServices(item.data().localidadId)
        })
      })

    }

    const getServices = async(id) =>{
        let tipos = [];
        await firebase.db.collection("Localidades").doc(id).collection("Servicios").get().then(val=>{
          val.docs.forEach(item=>{
            tipos.push(item.data())
          })
          setServices(tipos)
        })
      }
      
      function addService(service){
        setSelectedServices([service, ...selectedServices])
        console.log("Lo tiene")
      }
      function removeService(service){
        setSelectedServices(selectedServices.filter((service1) => service1 !== service))
        console.log("No lo tiene")
      }

      useEffect(() => {
        if(data.state === undefined || data.state === null){
          window.location.href = "/configuration/localitys"
        }
        firebase.getCurrentUser().then((val)=>{
          getLPID(val.aliadoId)
          setUser(val)
        })
      }, [])

    return (
        <div className="main-content-container container-fluid px-4">

            <div className="page-header align-items-center justify-content-spacebetween row no-gutters px-4 my-4">
              <div className="col-12 col-sm-5 text-center text-sm-left mb-0">
                <div className="row align-items-center">
                  <div className="col">
                    <p className="page-title">Agregar servicios a la localidad</p>
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
              {/* <p onClick={()=>{console.log(selectedServices)}}>mostrar</p> */}
                <button onClick={()=>{uploadServices()}} className="btn btn-primary btn-block">Agregar servicios a la localidad</button>
                <div className="row">
                  {
                    services.length > 0 ? services.map(service=>{
                    return(
                      <div className="col-md-4 col-sm-12">
                        <div  onClick={() => { selectedServices.includes(service) ? removeService(service) : addService(service) }} key={service} className={`card card-small ${selectedServices.includes(service) ? "card-selected" : "" } card-post mb-4`}>
                          <div className="card-post__image" style={{backgroundImage: `url(${service.urlImagen})` }}></div>
                          <div className="card-body">
                            <h5 className="card-title">
                              <p className="text-fiord-blue mb-2">{service.titulo}</p>
                            </h5>
                            <p className="card-text-type mb-2">{service.categoria}</p>
                            <p className="card-text mb-2">{service.descripcion}</p>
                            <p className="card-text-price">S/{service.precio}</p>
                          </div>
                        </div>
                      </div>                     
                    )
                    }) : <div className="text-center col-lg-12"><p>No hay servicios</p></div>
                  }
                </div>
            </div>

          </div>
    )

  async function uploadServices(){
    try {
      selectedServices.forEach((service)=>{
        firebase.db.collection("Localidades").doc(data.state.localidadId).collection("Servicios").doc(service.servicioId).set({
          activo: true,
          agendaContiene: true,
          aliadoId: user.aliadoId,
          tipoAgenda: service.tipoAgenda,
          cantidadDias: service.cantidadDias,
          categoria: service.categoria,
          condiciones: service.condiciones,
          descripcion: service.descripcion,
          precio: service.precio,
          localidadId: data.state.localidadId,
          servicioId: service.servicioId,
          urlImagen: service.urlImagen,
          titulo: service.titulo,
          capacidad: service.capacidad,
          unidad: service.unidad,
          domicilio: service.domicilio,
          delivery: service.delivery,
          createdOn: moment().toDate(),
        }).then((val)=>{
          firebase.db.collection("Localidades").doc(LPID).collection("Servicios").doc(service.servicioId).collection("Agenda").get().then((dias)=>{
            dias.docs.forEach((doc)=>{
              let dia = doc.data()
              firebase.db.collection("Localidades").doc(data.state.localidadId).collection("Servicios")
              .doc(service.servicioId).collection("Agenda").doc(dia.fecha).set({
                bloqueado: false,
                servicioId: service.servicioId,
                fecha: dia.fecha,
                date: dia.date,
                horasDia: dia.horasDia, 
                capacidadDia: dia.capacidadDia,
                createdOn: moment().toDate(),
              })
            })
          })
        })
      })
      window.location.href = "/configuration/localitys"
    }catch(e){
      console.log(e)
    }
  }

}

export default AddServices
