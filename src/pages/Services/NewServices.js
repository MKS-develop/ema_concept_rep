import React, {useState, useEffect, useRef} from 'react'
import firebase from '../../firebase/config'
import {Link, useHistory} from 'react-router-dom';
import moment from 'moment';
import * as XLSX from "xlsx";
import { createRef } from 'react';
import utils from '../../firebase/utils';
import Compress from "react-image-file-resizer";
import {useLocation} from 'react-router-dom';

function NewServices() {

  const history = useHistory()  
  const data = useLocation()
  
  const [services, setServices] = useState([])
  const [tiposCate, setTiposCate] = useState([])
  const [tipoServicios, setTipoServicios] = useState([])
  const [palabrasClave, setPalabrasClave] = useState([])
  const [localidades, setLocalidades] = useState([])
  const [species, setSpecies] = useState([])
  const [selectedServices, setSelectedServices] = useState([])
  
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [palabra, setPalabra] = useState("")
  const [localidadId, setLocalidad] = useState("")
  const [btnMessage, setBtnMessage] = useState("Subir producto");
  
  const [countryInfo, setCountryInfo] = useState({})
  const [user, setUser] = useState({})

  const [update, setUpdate] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [deliveryAplica, setDeliveryAplica] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [walkinModal, setWalkinModal] = useState(false);
  
  const hiddenFileInput = useRef(null);
  const [searchService, setSearchService] = useState(null)
  const [searchCategorie, setSearchCategorie] = useState(null)
  const [searchStatus, setSearchStatus] = useState(null)

    const [step1, setStep1] = useState(false);
    const [step2, setStep2] = useState(false);
    const [step3, setStep3] = useState(false);
    const [step4, setStep4] = useState(false);
    const url2 = window.location.href;
    
    const getServices = async(id) =>{
        let tipos = [];
        let tipos2 = [];

        await firebase.db.collection("Localidades").where("aliadoId", "==", id).get().then(val => {
            val.docs.forEach(item => {
                tipos.push(item.data())
            })
        })

        Promise.all(tipos.map(async (doc) => {
            firebase.db.collection("Localidades").doc(doc.localidadId).collection("Servicios").get().then(val => {
                val.docs.forEach(item => {
                    let o1 = item.data()
                    o1["nombreLocalidad"] = doc.nombreLocalidad
                    o1["activeDrop"] = false
                    tipos2.push(o1)
                })
            })

        }))
  
        console.log(tipos)
        console.log(tipos2)
  
        let allList = tipos2
        let filteredStatus = searchStatus ? filterStatus(tipos2, searchStatus) : allList
        let filteredService = searchService ? filterService(filteredStatus, searchService) : filteredStatus
        let filteredCategorie = searchCategorie ? filterCategorie(filteredService, searchCategorie) : filteredService

        setTimeout(() => {
            setServices(filteredCategorie.sort((a, b) => b.createdOn - a.createdOn))
        }, 500);
  
    }

    function filterCategorie(list, val) {
      let tipos = []
      for(let i = 0; i < list.length; i++){
        let u = list[i].categoria
        if(u === val){
          tipos.push(list[i])
        }
      }
      return tipos
    }

    function filterService(list, val) {
      let tipos = []
      for(let i = 0; i < list.length; i++){
        let u = list[i].titulo
        if(u === val){
          tipos.push(list[i])
        }
      }
      return tipos
    }
    
    function filterStatus(list, val) {
      let tipos = []
      for(let i = 0; i < list.length; i++){
        let u = list[i].estatusActivo
        if(u === val){
          tipos.push(list[i])
        }
      }
      return tipos
    }

    const wrapperRef = useRef(null);

    useOutsideAlerter(wrapperRef);

    function useOutsideAlerter(ref) {
      useEffect(() => {

        function handleClickOutside(event) {
            if (ref.current && !ref.current.contains(event.target)) {
              step1 && setStep1(false)
              step2 && setStep2(false)
              step3 && setStep3(false)
              step4 && setStep4(false)
            }
        }
      
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
      }, [ref]);
    }
    
    function getCategories() {
        let tipos = []
        let reference = firebase.db.collection("CategoriasServicios")
        reference.get().then(data => {
            data.forEach(tipo => {
                tipos.push(tipo.id)
                tipos.sort()
            })
            // tipos.pop("Todas")
            setTiposCate(tipos)
        });
    }

    function getServicesCategories(cate) {
        let tipos = [];
        let reference = firebase.db.collection("CategoriasServicios").doc(cate).collection("Servicios")
            firebase.db.collection('Roles').doc(user.role).collection("CategoriasServicios").doc(cate).collection("Servicios")

        reference.get().then(data => {
            data.docs.forEach(item => {
                tipos.push(item.id)
            })
            setTipoServicios(tipos)
        });
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

    const ErrorComponent = ({msg}) => {
      return (
          <div className="error-alert">
              <span className="material-icons mr-2">error</span>
              {msg}
              <div onClick={()=>{setError(false)}} className="material-icons ml-2 cursor-pointer">close</div>
          </div>
      )
    }
    
    useEffect(() => {
        firebase.getCurrentUser().then((val)=>{
          setUser(val)
          getServices(val.aliadoId)
          firebase.getCountryInfo(val.pais).then((val)=>{
            setCountryInfo(val.data()) 
          })
        });
        getCategories()

    }, [])


    return (
      
        <div className="main-content-container container-fluid px-4">
          {error && <ErrorComponent msg={errorMsg === "" ? "Todos los campos son requeridos" : errorMsg}/>}
          {success && <SuccessComponent msg={successMsg === "" ? "Producto cargado exitosamente" : successMsg}/>}
        
          
            <div className="page-header align-items-center justify-content-spacebetween row no-gutters px-4 my-4">
              <div className="col-12 col-sm-5 text-center text-sm-left mb-0">
                <div className="row align-items-center">
                  <div className="col">
                    <p className="page-title bold"><Link className="color-white light" to="/configuration">Configuración</Link> <span>Servicios</span> <span className="page-title-counter">Total: {services.length}</span> </p>
                  </div>
                </div>
              </div>
              <div className="col-12 col-sm-1 mb-0 level-1">
                <div className="row align-items-center justify-content-space-around level-2">
                  {/* <i onClick={()=>{setStepStart(true)}} className="material-icons color-white display-5 cursor-pointer">help_outline</i> */}
                </div>
              </div>
            </div>

            <div className="my-3 row no-gutters align-items-center">

                <div className="form-group mr-3 mb-0 col-lg-2">
                    <select className="form-control" value={searchCategorie} onChange={(e) => { setSearchCategorie(e.target.value); getServicesCategories(e.target.value) }}>
                        <option value="">Categoría</option>
                        {tiposCate.map(data => (
                            <option key={data} value={data}>{data}</option>
                        ))}
                    </select>
                </div>
                
                { searchCategorie && <div className="form-group mr-3 mb-0 col-lg-2">
                    <select className="form-control" value={searchService} onChange={(e) => { setSearchService(e.target.value); }}>
                        <option value="">Servicio</option>
                        {tipoServicios.map(data => (
                            <option key={data} value={data}>{data}</option>
                        ))}
                    </select>
                </div> }

                <div className="form-group mr-3 mb-0 col-lg-2">
                    <select className="form-control" value={searchStatus} onChange={(e) => { setSearchStatus(e.target.value); }}>
                        <option value="">Estatus</option>
                        <option value="Activo">Activo</option>
                        <option value="Borrador">Borrador</option>
                        <option value="Todos">Todos</option>
                    </select>
                </div>

                <button className="btn btn-primary mr-3 col-lg-1" onClick={()=>{ getServices(user.aliadoId) }}><i className="material-icons">search</i></button>

                <Link to="/configuration/services/new-service" className="btn btn-primary mr-3">
                    Agregar nuevo servicio<i className="material-icons ml-2">add</i>
                </Link>
                
                { selectedServices.length > 0 && <div onClick={()=>{ deleteServices() }} className="btn btn-danger">
                    Eliminar servicio<i className="material-icons ml-2">delete</i>
                </div> }

            </div>
            
            <div className="position-relative">

                <div className="row-products-container-title">
                    <div className="row-products-container-img"></div>
                    <div className="row-products-container-img"></div>
                    <div className="row-products-container-body">
                        <p style={{ width: "200px" }} className="row-products-container-title-title">Servicio</p>
                        <p style={{ width: "200px" }} className="row-products-container-title-cat">Categoría</p>
                        <p style={{ width: "200px" }} className="row-products-container-title-price">Estatus</p>
                        <p className="row-products-container-title-price">Precio</p>
                        <p className="row-products-container-title-stock">Localidad</p>
                    </div>
                </div>
                
                { services.length > 0 ? services.map((serv, i) => {
                    let precioRounded = Math.round(serv.precio * 100) / 100
                    return(
                    <div className="row-products-container" key={i}>
                        <div className="row-products-container-checkbox">
                            <input onClick={()=>{ selectedServices.includes( serv ) ? 
                              setSelectedServices(selectedServices.filter((prv)=>( prv !== serv )))
                              : setSelectedServices([...selectedServices, serv]) }} 
                              type="checkbox" className="" />
                        </div>
                        <div className="row-products-container-content" onClick={()=>{ 
                           history.push({
                             pathname: "/configuration/services/detail", 
                             state: { servicioId: serv.servicioId, localidadId: serv.localidadId}
                           })
                          }}>
                          <img src={serv.urlImagen} alt="" className="row-products-container-img" />
                          <div className="row-products-container-body">
                            <p style={{ width: "200px" }} className="row-products-container-p-title">{serv.titulo}</p>
                            <p style={{ width: "200px" }} className="row-products-container-p-cat">{serv.categoria}</p>
                            <p style={{width: "200px"}} className="row-products-container-p-cat">{serv.status}</p>
                            <p className="row-products-container-p-price">{countryInfo.simbolo ?? " "}{precioRounded}</p>
                            <p style={{width: "fit-content"}} className="pill-2 rounded mb-2">{serv.nombreLocalidad}</p>
                          </div>
                        </div>
                        {/* <div className="row-products-container-checkbox">
                            <span onClick={} className="material-icons color-primary">more_horiz</span>
                        </div> */}
                      </div>
                    )
                    }) : <div className="text-center"><p>No hay servicios</p></div> 
                }
                
            </div>

          </div>
    )
  
  function deleteServices(){
    selectedServices.forEach(async(s)=>{
      await firebase.db.collectionGroup("Servicios").where("servicioId", "==", s["servicioId"]).get().then((val)=>{
        val.docs.forEach(async (snapshot)=>{
          await snapshot.ref.delete()
        })
      })
    })
    setSelectedServices([])
    getServices(user.aliadoId)
  }

}

export default NewServices
