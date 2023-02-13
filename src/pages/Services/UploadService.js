import React, {useEffect, useState, useRef} from 'react'
import firebase from '../../firebase/config'
import {Link, Redirect, useHistory} from 'react-router-dom';
import moment from 'moment';
import utils from '../../firebase/utils';
import Compress from "react-image-file-resizer";

import { EditorState, convertToRaw } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import { debounce } from '../../utils/debounce';

function UploadService() {

  let variantsDefaultList = [
    "Edad",
    "Tamaño"
  ]
    
    const history = useHistory()  
    const [tiposCate, setTiposCate] = useState([])
    const [tipoServicios, setTipoServicios] = useState([])
    const [palabrasClave, setPalabrasClave] = useState([])
    const [localidades, setLocalidades] = useState([])
    const [localidadesVarias, setLocalidadesVarias] = useState([])
    const [listErrors, setListErrors] = useState([])

    const [listaPrueba, setListaPrueba] = useState([])
    const [listObjects, setListObjects] = useState([])
    const [listTitle, setListTitle] = useState([])
    const [listCombinations, setListCombinations] = useState([])
    const [listMain, setListMain] = useState( [] )
    const [variantsDefaultListNew, setVariantsDefaultListNew] = useState([])
    const [chargesList, setChargesList] = useState([])
    const [variantesServicioFullList, setVariantesServicioFullList] = useState([])
    const [species, setSpecies] = useState([])
    const [razas, setRazas] = useState([])
    //Correos
    const [statusCorreoInicial, setStatusCorreoInicial] = useState(false);
    const [statusCorreoFinal, setStatusCorreoFinal] = useState(false);
    const [editorStateInitial, onEditorStateChangeInitial] = React.useState(
      () => EditorState.createEmpty(),
    );
    const [editorStateFinal, onEditorStateChangeFinal] = React.useState(
      () => EditorState.createEmpty(),
    );
    //Correos

    const [agendaPopupDescription, setAgendaPopupDescription] = useState("El servicio quedará en estatus borrador y no será visible por los pacientes");
    const [agendaPopupTitle, setAgendaPopupTitle] = useState("Deseas crear la agenda para este servicio?");
    const [tituloCustom, setTituloCustom] = useState("");
    const [successMsg, setSuccessMsg] = useState("");
    const [errorMsg, setErrorMsg] = useState("");
    const [palabra, setPalabra] = useState("")
    const [localidadId, setLocalidad] = useState("")
    const [LPID, setLPID] = useState("");
    const [chargeTitulo, setChargeTitulo] = useState("");
    const [btnMessage, setBtnMessage] = useState("Subir servicio");
    
    const [countryInfo, setCountryInfo] = useState({})
    const [user, setUser] = useState({})
    const [chargeObject, setChargeObject] = useState({
      nombre: "",
      precio: 0
    })
    
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(false);
    const [finalClientStatus, setFinalClientStatus] = useState(true);
    const [aliadoClientStatus, setAliadoClientStatus] = useState(false);
    const [petPointsStatus, setPetPointsStatus] = useState(false);
    const [contieneAgenda, setContieneAgenda] = useState(true);
    const [showLocalidadesModal, setShowLocalidadesModal] = useState(false);
    const [statusVariantes, setStatusVariantes] = useState(false);
    const [uniqueLocality, setUniqueLocality] = useState(false);
    const [agendaPopUp, setAgendaPopUp] = useState(false);
    
    const [chargePrecio, setChargePrecio] = useState(0);
    const [soles, setSoles] = useState(0)
    const [itemPrecio, setItemPrecio] = useState(0)
    const [itemTitulo, setItemTitulo] = useState("")
    const [titleValue, setTitleValue] = useState("")

    const inputTag = useRef(null)
    const inputSku = useRef(null)
    const inputName = useRef(null)
    const inputDesc = useRef(null)
    const inputWord = useRef(null)
    const inputPeso = useRef(null)
    const inputPrice = useRef(null)
    const inputCantidad = useRef(null)
    const inputMinima = useRef(null)
    const hiddenFileInput = useRef(null);
    const hiddenFileInputItem = useRef(null);
    
    let errorInputMsg = "Campo requerido"
    
    const [servInfo, setServInfo] = useState({
        estadoServicio: "",
        categoria: "",
        titulo: "",
        unidad: "",
        descripcion: "",
        condiciones: "",
        tipoMascota: "-",
        dirigido: "-",
        edad: "-",
        precio: 0,
    })

    const [file, setFile] = useState(null);
    const [url, setURL] = useState("");
    const [src, setImg] = useState('');

    const [fileItem, setFileItem] = useState(null);
    const [urlItem, setURLItem] = useState("");
    const [srcItem, setImgItem] = useState('');

    const handleClick = event => {
        hiddenFileInput.current.click();
    };
    
    const handleClickItemImg = event => {
        hiddenFileInputItem.current.click();
    };

    async function handleChange(e) {
        var file = e.target.files[0]
        Compress.imageFileResizer(
          file,
          600,
          300,
          "JPEG",
          10,
          0,
          (uri) => {
            setFile(uri)
            console.log(uri)
          },
          "file",
          600,
          300
        )
        setImg(URL.createObjectURL(file))
        setListErrors(listErrors.filter( prev => prev !== "img" ))
    }
    
    async function handleChangeItemImg(e) {
        var file = e.target.files[0]
        Compress.imageFileResizer(
          file,
          600,
          300,
          "JPEG",
          10,
          0,
          (uri) => {
            setFileItem(uri)
            console.log(uri)
          },
          "file",
          600,
          300
        )
        setImgItem(URL.createObjectURL(file))
    }

    function createListCharge() {
      let list = [...chargesList]
      let o = {
        nombre: chargeTitulo,
        precio: chargePrecio,
      }
      list.push(o)
      setChargesList(list)
    }
    
    function deleteChargeFromList(o) {
      let list = [...chargesList]
      let newLista = list.filter((prv) => prv !== o)
      setChargesList(newLista)
    }

    function createList() {
      let list = [...listMain]
      list.push([])
      setListMain(list)

      let listT = [...listTitle]
      listT.push(titleValue)
      setListTitle(listT)
      setTitleValue("")
    }

    function createListItem(i) {
      let o = {
        text: itemTitulo,
        precio: parseFloat(itemPrecio),
        image: src !== "" ? src : ""
      }

      let list = [...listMain]
      list[i].push(o)

      setListMain(list)
      test(list)
      setImgItem("")
      setURLItem("")
      setFileItem(null)
    }

    function createVariantFromList(palabra) {
      let tipos = []
      if (palabra !== "") {
        for (let i = 0; i < variantsDefaultList.length; i++) {
          let w = variantsDefaultList[i]
          if (w.toLowerCase().includes(palabra.toLowerCase())) {
            tipos.push(w)
          } else {
            setVariantsDefaultListNew([])
            setTitleValue(palabra)
          }
        }
        setVariantsDefaultListNew(tipos)
      } else {
        setTitleValue("")
        setVariantsDefaultListNew([])
      }
    }

    function changePriceCombo(i, val) {
      let lista = [...listCombinations]
      lista[i].price = parseFloat(val)
      setListCombinations(lista)
    }

    function changeStockCombo(i, val) {
      let lista = [...listCombinations]
      lista[i].stock = parseInt(val)
      setListCombinations(lista)
    }

    function changeSkuCombo(i, val) {
      let lista = [...listCombinations]
      lista[i].sku = val
      setListCombinations(lista)
    }

    function deleteTagFromList(tag, iMain, iSub) {
      let lista = [...listMain]
      let newLista = lista[iMain].filter((prv) => prv !== tag)
      lista[iMain] = newLista
      setListMain(lista);

      test(lista)
    }

    function test(listMainFromOther) {
      new Promise((resolve) => setTimeout(() => {
        combinationsFunction(listMainFromOther)
      }, 1000));
    }

    function deleteVariantFromList(ele, t) {
      if (listMain.length !== 0) {
        let newLista = listMain.filter((prev) => prev !== ele)
        let newListaTitles = listTitle.filter((prev) => prev !== t)
        setListMain(newLista)
        setListTitle(newListaTitles)
        test(newLista)
      }
    }
    
    const getLocalidades = async(aliadoId) =>{
        let tipos = [];
        await firebase.db.collection('Localidades').where("aliadoId", "==", aliadoId).get().then(val => {
            val.docs.forEach(item=>{
                tipos.push(item.data())
                tipos.sort()
                if(val.docs.length === 1){
                  setLocalidadesVarias([...localidadesVarias, item.data()])
                  setUniqueLocality(true)
                }
            })
            setLocalidades(tipos)
        })
    }

    function getCategories(){
      let tipos = []
      firebase.db.collection('CategoriasServicios').get().then(data=>{  
        data.forEach(tipo=>{
          tipos.push(tipo.id)
          tipos.sort()
        })
      })
      console.log(tipos)
      setTiposCate(tipos)
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

    const getLPID = async(id) =>{
        await firebase.db.collection("Localidades").where("lc", "==", "Localidad Principal")
        .where("aliadoId", "==", id).get().then(val=>{
            val.docs.forEach(item=>{
              setLPID(item.data().localidadId)
            })
        })
  
    }

    
    const getPets = async() =>{
      let tipos = [];
      await firebase.db.collection('Especies').get().then(val => {
          val.docs.forEach(item=>{
              tipos.push(item.id)
              tipos.sort()
          })
          setSpecies(tipos)
      })
    }
  
    const getRazas = async(tipoM) =>{
      let tipos = [];
      await firebase.db.collection('Especies').doc(tipoM).collection("Razas").get().then(val => {
          val.docs.forEach(item=>{
              tipos.push(item.id)
              tipos.sort()
          })
          setRazas(tipos)
      })
    }

    const handleKeyPress = (event) => {
        if(event.key === 'Enter' && palabra !== ""){
            setPalabrasClave([...palabrasClave, palabra])
            inputTag.current.value = ""
        }
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

    const AgendaComponentPopUp = ({title, description}) => {
      return (
        <div className="cc-modal-wrapper fadeIn">
          <div className="c2-modal">
            <div className="cc-modal-header mb-2">
                <h3 className="mb-0">{title}</h3>
            </div>
            <div className="c2-modal-body">
              <p className="mb-0">
                {description}
              </p>
            </div>
            <div className="cc-modal-footer align-items-center justify-content-spacebetween">
              <button onClick={()=>{
                setAgendaPopUp(false)
                setContieneAgenda(false)
                if(finalClientStatus) uploadService()
                if(aliadoClientStatus) uploadServiceB2B()
              }} className="btn btn-outline-secondary">
                Realizar luego
              </button>
              <button onClick={()=>{
                setAgendaPopUp(false)
                setContieneAgenda(true)
                if(finalClientStatus) uploadService()
                if(aliadoClientStatus) uploadServiceB2B()
              }} className={`btn btn-primary`}>
                Crear agenda
              </button>
            </div>
          </div>
        </div>
      )
    }

    function checkInputs(o){
      let val = 0
      let array = []
      o["img"] = src
      Object.keys(o).forEach(function(k) {
        if (o[k] === '' || o[k] < 0) {
          val++
          array.push(k)
        }
      });
      if(val > 0){
        setListErrors(array)
        window.scrollTo(0, 0)
      }else{
        setListErrors([])
        setAgendaPopUp(true)
        console.log("Todo bien")
      }
    }

    const setterLocalidades = () => setLocalidadesVarias(localidades)

    async function getValuePetPoint(pais){
        try {
            await firebase.db.collection("Ciudades").doc(pais).get().then((v)=>{
                let precioPP =  parseInt(v.data().valorPunto)
                setSoles(precioPP)
            })
        }catch(e){

        }
    }

    const [prevScrollPos, setPrevScrollPos] = useState(0);
    const [visible, setVisible] = useState(true);
  
    const handleScroll = debounce(() => {
      const currentScrollPos = window.pageYOffset;
  
      setVisible((prevScrollPos > currentScrollPos && prevScrollPos - currentScrollPos > 70) || currentScrollPos < 10);
  
      setPrevScrollPos(currentScrollPos);
    }, 100);
  
    useEffect(() => {
      window.addEventListener('scroll', handleScroll);
  
      return () => window.removeEventListener('scroll', handleScroll);
  
    }, [prevScrollPos, visible, handleScroll]);
  
    const navbarStyles = {
      position: 'fixed',
      height: '65px',
      width: '83.3%',
      backgroundColor: 'white',
      zIndex: "11",
      textAlign: 'center',
      transition: 'top 0.6s',
      padding: "1% 2%",
      right: "0px",
      boxShadow: "0 0.125rem 0.625rem rgb(90 97 105 / 12%)"
    }

    useEffect(() => {
        firebase.getCurrentUser().then((val)=>{
          setUser(val)
          getLocalidades(val.aliadoId)
          getLPID(val.aliadoId)
          getValuePetPoint(val.pais)
          firebase.getCountryInfo(val.pais).then(async (val) => {
            setCountryInfo(val.data()) 
          })
        });
        getCategories()
        getPets()

    }, [])

    return (
        <div className="main-content-container container-fluid px-4">
            {error && <ErrorComponent msg={errorMsg === "" ? "Todos los campos son requeridos" : errorMsg}/>}
            {success && <SuccessComponent msg={successMsg === "" ? "Servicio cargado exitosamente" : successMsg}/>}
            {agendaPopUp && <AgendaComponentPopUp title={agendaPopupTitle} description={agendaPopupDescription} />}

            <div style={{ ...navbarStyles, top: visible ? '-60px' : '60px' }}>
              <div className="row no-gutters align-items-center justify-content-spacebetween mb-4">
                  <h4 className="color-primary bold mb-0">Nuevo</h4>
                  <div className="row no-gutters">
                      <div 
                      onClick={()=>{ checkInputs(servInfo) }} 
                      className="btn btn-success">Crear servicio</div>
                  </div>
              </div>
            </div>

            { showLocalidadesModal && <div className="cc-modal-wrapper fadeIn">
              <div className="cc-modal">
                <div className="cc-modal-header mb-2">
                  <div className="no-gutters mb-3 row align-items-center justify-content-spacebetween">
                    <h3 className="mb-0">Localidades</h3>
                    <div className="row no-gutters position-relative custom-control custom-checkbox">
                      <input onClick={()=>{ setterLocalidades() }} type="checkbox" className="custom-control-input" id="formsCheckboxDefault"/>
                      <label className="custom-control-label" for="formsCheckboxDefault">Todas las localidades</label>
                    </div>
                  </div>
                </div>
                <div className="cc-modal-body">
                  {localidades.map((l)=>{
                    return (
                      <div onClick={()=>{ localidadesVarias.includes(l) ? 
                        setLocalidadesVarias(localidadesVarias.filter((l1) => l1 !== l))
                      : setLocalidadesVarias([l, ...localidadesVarias]) }} className={`cc-modal-card mx-1 cursor-pointer ${localidadesVarias.includes(l) ? "active" : "" }`} style={{backgroundImage: `url(${l.locacionImg})` }} key={l.localidadId}>
                        <div className="cc-modal-card-overlay">
                          <p className="mb-0 cc-modal-card-p">
                            {l.direccionLocalidad}
                          </p>
                          <p className="mb-0 cc-modal-card-p-strong">
                            {l.nombreLocalidad}
                          </p>
                        </div>
                      </div>
                    )
                  })}
                </div>
                <div className="cc-modal-footer align-items-center justify-content-spacebetween">
                  {/* <div className={`btn ${"btn-primary"}`}> */}
                  <button onClick={()=>{setShowLocalidadesModal(false)}} className={`btn btn-disabled`}>
                    Cancelar
                  </button>
                  <button onClick={()=>{setShowLocalidadesModal(false)}} className={`btn btn-primary`}>
                    Guardar
                  </button>
                </div>
              </div>
            </div> }

            <div className="page-header align-items-center justify-content-spacebetween row no-gutters px-4 my-4">
                <div className="col-12 col-sm-5 text-center text-sm-left mb-0">
                    <div className="row align-items-center">
                        <div className="col">
                            <p className="page-title bold"><Link className="color-white mr-3 light" to="/configuration">Configuración</Link> <Link className="color-white light" to="/configuration/services">Servicios</Link> <span>Nuevo</span> </p>
                        </div>
                    </div>
                </div>
                <div className="col-12 col-sm-1 mb-0 level-1">
                    <div className="row align-items-center justify-content-space-around level-2">
                        <i onClick={()=>{}} className="material-icons color-white display-5 cursor-pointer">help_outline</i>
                    </div>
                </div>
            </div>

            <div className="row no-gutters">
                <div className="col-lg-8">
                    
                    <div className="row no-gutters align-items-center justify-content-spacebetween mb-4">
                        <h4 className="color-primary bold mb-0">Nuevo</h4>
                        <div className="row no-gutters">
                            <div 
                            onClick={()=>{ checkInputs(servInfo) }} 
                            className="btn btn-success">Crear servicio</div>
                        </div>
                    </div>

                    <div className="creation-card mb-3">
                        <div className="creation-card-title">Detalles adicionales</div>
                        <div className="creation-card-content">
                            
                            <div className="mb-2 mr-4 creation-input-group no-gutters">
                                <div className="col-lg-auto mr-2">
                                    <p className="creation-input-label">Estado del servicio</p>
                                </div>
                                <div className="col-lg-auto mr-2">
                                    <select value={servInfo.estadoServicio} onChange={(e)=>{setServInfo({...servInfo, estadoServicio: e.target.value}); setListErrors(listErrors.filter( prev => prev !== "estadoServicio" ) )  }} 
                                    className={`form-control col-lg-12 ${ listErrors.includes("estadoServicio") && "border-danger" } `}>
                                        <option value="">Selección</option>
                                        <option value="Activo">Activo</option>
                                        <option value="Borrador">Borrador</option>
                                    </select>
                                </div>
                                <div className="creation-errors-container">
                                    {listErrors.includes("estadoServicio") && <p className="creation-errors-span"><i className="material-icons">highlight_off</i> { errorInputMsg } </p>}
                                </div>
                            </div>
                            
                            {/* <div className="creation-input-group mb-3 no-gutters" style={{width: "35%"}}>
                                <div className="col-lg-9">
                                    <p className="creation-input-label">¿El servicio contiene agenda?</p>
                                </div>
                                <div className="col-lg-2">
                                    <input type="checkbox" onClick={()=>{setContieneAgenda(!contieneAgenda)}} name="ad"/>
                                </div>
                            </div> */}
                            
                            <div className="mb-2 creation-input-group no-gutters">
                                { !uniqueLocality && <button onClick={()=>{setShowLocalidadesModal(true)}} className="btn btn-primary mr-3">Seleccionar localidad</button> }
                                { localidadesVarias.length > 0 && <div className="row no-gutters">
                                    
                                    <p className="creation-input-label mr-2"> Localidades seleccionadas: </p>
                                    {localidadesVarias.map((loc, i) => {
                                        return (
                                            <p key={i} className="creation-input-label-pill">
                                                {loc.nombreLocalidad}
                                            </p>
                                        )
                                    })}
                                </div> }
                                <div className="creation-errors-container" style={{width: "100%"}}>
                                    {(listErrors.length > 0 && localidadesVarias.length === 0) && <p className="creation-errors-span"><i className="material-icons">highlight_off</i> Debes seleccionar al menos una localidad </p>}
                                </div>
                            </div>

                            <div className={`mb-2 creation-input-group no-gutters mr-2 ${ palabrasClave.length > 3 && "mb-4" }`}>
                                <div className="col-lg-auto mr-2">
                                    <p className="creation-input-label">Etiquetas</p>
                                </div>
                                <div className="col-lg-auto mr-2">
                                    <input ref={inputTag} type="text" onKeyPress={handleKeyPress} onChange={e=>{setPalabra(e.target.value)}}  placeholder="Mastografía" className="form-control"/>
                                </div>
                            </div>

                            <div className="mb-2 creation-input-group-words">
                                {palabrasClave.map(p => (
                                    <p className="pill mb-0" key={p}>{p} <span className="cursor-pointer btn-delete" onClick={()=>{ setPalabrasClave(palabrasClave.filter((p1) => p1 !== p)); }} >X</span></p>
                                ))}
                            </div>

                        </div>
                    </div>

                    {/* <div className="creation-card mb-3">
                      <div className="creation-card-title mb-2">Mercado</div>
                      <p className="creation-card-p">Indica a quien está dirigido el servicio</p>
                      <div className="creation-card-content">
                        
                        <div className="mb-2 mr-4 creation-input-group no-gutters">
                          <div className="col-lg-auto mr-2">
                            <p className="creation-input-label">Edad</p>
                          </div>
                          <div className="col-lg-auto mr-2">
                            <select value={servInfo.edad} onChange={(e)=>{setServInfo({...servInfo, edad: e.target.value}); setListErrors(listErrors.filter( prev => prev !== "edad" ) )  }} className={`form-control col-lg-12 ${ listErrors.includes("edad") && "border-danger" } `}>
                              <option value="">Selección</option>
                              <option value="Cachorro">Cachorro</option>
                              <option value="Sénior">Sénior</option>
                              <option value="Adulto">Adulto</option>
                              <option value="Todos">Todos</option>
                            </select>
                          </div>
                          <div className="creation-errors-container">
                            {listErrors.includes("edad") && <p className="creation-errors-span"><i className="material-icons">highlight_off</i> { errorInputMsg } </p>}
                          </div>
                        </div>
                        
                        <div className="mb-2 mr-4 creation-input-group no-gutters">
                          <div className="col-lg-auto mr-2">
                            <p className="creation-input-label">Tamaño</p>
                          </div>
                          <div className="col-lg-auto mr-2">
                            <select value={servInfo.size} onChange={(e)=>{setServInfo({...servInfo, size: e.target.value}) }} className={`form-control col-lg-12`}>
                              <option value="">Selección</option>
                              <option value="Toy">Toy</option>
                              <option value="Pequeño">Pequeño</option>
                              <option value="Mediano">Mediano</option>
                              <option value="Grande ">Grande </option>
                              <option value="Gigante">Gigante</option>
                              
                              <option value="Todos">Todos</option>
                            </select>
                          </div>
                        </div>
                        <div className="mb-2 mr-4 creation-input-group no-gutters">
                          <div className="col-lg-auto mr-2">
                            <p className="creation-input-label">Especie</p>
                          </div>
                          <div className="col-lg-auto mr-2">
                            <select value={servInfo.tipoMascota} onChange={(e)=>{setServInfo({...servInfo, tipoMascota: e.target.value}); getRazas(e.target.value); setListErrors(listErrors.filter( prev => prev !== "tipoMascota" ) )    }} className={`form-control col-lg-12 ${ listErrors.includes("tipoMascota") && "border-danger" } `}>
                              <option value="">Selección</option>
                              {species.map(data => (
                                <option key={data} value={data}>{data}</option>
                              ))}
                            </select>
                          </div>
                          <div className="creation-errors-container">
                            {listErrors.includes("tipoMascota") && <p className="creation-errors-span"><i className="material-icons">highlight_off</i> { errorInputMsg } </p>}
                          </div>
                        </div>
                          
                        { razas.length > 0 && <div className="mb-2 mr-4 creation-input-group no-gutters">
                          <div className="col-lg-auto mr-2">
                              <p className="creation-input-label">Raza</p>
                          </div>
                          <div className="col-lg-auto mr-2">
                            <select value={servInfo.dirigido} onChange={(e)=>{setServInfo({...servInfo, dirigido: e.target.value})}} className={`form-control col-lg-12`}>
                              <option value="">Selección</option>
                              {razas.map((data, i) => (
                                <option key={i} value={data}>{data}</option>
                              ))}
                              <option value="Todos">Todos</option>
                            </select>
                          </div>
                        </div> }
                        
                      </div>
                    </div> */}
                    
                    <div className="creation-card mb-3">
                        <div className="creation-card-title">Precio</div>
                        <div className="creation-card-content">

                            { finalClientStatus && <div className="mr-4 creation-input-group no-gutters">
                                <div className="col-lg-auto mr-2">
                                    <p className="creation-input-label">Precio</p>
                                </div>
                                <div className="col-lg-auto mr-2">
                                    <input type="number" min="0" value={servInfo.precio} onChange={(e)=>{setServInfo({...servInfo, precio: e.target.value}); setListErrors(listErrors.filter( prev => prev !== "precio" ) )  }} placeholder="0" className={`form-control col-lg-12 ${ listErrors.includes("precio") && "border-danger" } `}/>
                                </div>
                                <div className="creation-errors-container">
                                    {(listErrors.includes("precio") && finalClientStatus) && <p className="creation-errors-span"><i className="material-icons">highlight_off</i> { errorInputMsg } </p>}
                                </div>
                            </div> }
                            { aliadoClientStatus && <div className="creation-input-group no-gutters">
                                <div className="col-lg-auto mr-2">
                                    <p className="creation-input-label">Precio aliado</p>
                                </div>
                                <div className="col-lg-auto mr-2">
                                    <input type="number" min="0" value={servInfo.precioAliado} onChange={(e)=>{setServInfo({...servInfo, precioAliado: e.target.value})}} placeholder="0" className="form-control"/>
                                </div>
                                <div className="creation-errors-container">
                                    {(listErrors.includes("precioAliado") && aliadoClientStatus) && <p className="creation-errors-span"><i className="material-icons">highlight_off</i> { errorInputMsg } </p>}
                                </div>
                            </div> }


                            {/* <div className={`creation-input-group no-gutters`} style={{width: "35%"}}>
                                <div className="col-lg-1">
                                    <input type="checkbox" defaultChecked={petPointsStatus} value={petPointsStatus} onClick={()=>{ setPetPointsStatus(!petPointsStatus) }} />
                                </div>
                                <div className="col-lg-9">
                                    <p className="creation-input-label">Acepta pagos en Pet Points</p>
                                </div>
                            </div> */}
                        
                            <div className="creation-input-group no-gutters">
                                <div className="col-lg-auto mr-2">
                                    <p className="creation-input-label">El servicio se cobra por</p>
                                </div>
                                <div className="col-lg-auto mr-2">
                                    <select value={servInfo.unidad} onChange={(e)=>{setServInfo({...servInfo, unidad: e.target.value}); setListErrors(listErrors.filter( prev => prev !== "unidad" ) )  }} 
                                    className={`form-control col-lg-12 ${ listErrors.includes("unidad") && "border-danger" } `}>
                                        <option value="">Selección</option>
                                        <option value="Monto del servicio">Monto del servicio</option>
                                        <option value="Hora">Hora</option>
                                        <option value="Noche">Noche</option>
                                        <option value="Día">Día</option>
                                    </select>
                                </div>
                                <div className="creation-errors-container">
                                    {listErrors.includes("unidad") && <p className="creation-errors-span"><i className="material-icons">highlight_off</i> { errorInputMsg } </p>}
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div className="creation-card mb-3">
                        <div className="creation-card-title">Mensajes</div>
                        <div className="creation-card-content">
                          
                          <div className="col-lg-12 no-gutters">
                            <p className="creation-input-label mb-2">Mensaje inicial</p>
                            <div className="col-lg-12 row no-gutters">
                              <div style={{width: "25px"}}>
                                <input type="checkbox" value={statusCorreoInicial} onClick={()=>{ setStatusCorreoInicial(!statusCorreoInicial) }} />
                              </div>
                              <div className="col-lg-11">
                                <p className="creation-input-label">¿Deseas enviar un correo al paciente una vez contratado el servicio?</p>
                              </div>
                            </div>
                            {statusCorreoInicial && <Editor
                              editorState={editorStateInitial}
                              toolbarClassName="toolbarClassName"
                              wrapperClassName="wrapperClassName"
                              editorClassName="editorClassName"
                              onEditorStateChange={onEditorStateChangeInitial}
                            /> }
                          </div>

                          <div className="col-lg-12 no-gutters">
                            <p className="creation-input-label mb-2">Mensaje final</p>
                            <div className="col-lg-12 row no-gutters">
                              <div style={{width: "25px"}}>
                                <input type="checkbox" defaultChecked={statusCorreoFinal} value={statusCorreoFinal} onClick={()=>{ setStatusCorreoFinal(!statusCorreoFinal) }} />
                              </div>
                              <div className="col-lg-11">
                                <p className="creation-input-label">¿Deseas enviar un correo al paciente una vez finalizado el servicio?</p>
                              </div>
                            </div>
                            {statusCorreoFinal && <Editor
                              editorState={editorStateFinal}
                              toolbarClassName="toolbarClassName"
                              wrapperClassName="wrapperClassName"
                              editorClassName="editorClassName"
                              onEditorStateChange={onEditorStateChangeFinal}
                            />}
                          </div>

                        </div>
                    </div>

                    {/* <div className="creation-card mb-3">
                        
                      <div className="col-lg-12 row no-gutters">
                        <div style={{width: "25px"}}>
                          <input type="checkbox" value={statusVariantes} onClick={()=>{ setStatusVariantes(!statusVariantes) }} />
                        </div>
                        <div className="col-lg-11">
                          <p className="creation-input-label">Este servicio se presta de distintas formas</p>
                        </div>
                      </div>

                      <div className="row no-gutters align-items-center justify-content-spacebetween">
                          <div className="creation-card-title">Variantes</div>
                            
                          {statusVariantes && <div className="row">
                              <div className="mr-1 col-lg-5 custom-dropdown">
                                <input placeholder={variantsDefaultList[0]} value={titleValue} onChange={(e)=>{ createVariantFromList(e.target.value) }} className="form-control"/>
                                <div className="custom-dropdown-box" style={{width: "190px"}} >
                                  {variantsDefaultListNew.map((val, i)=>{
                                      return (
                                      <div className="custom-dropdown-option cursor-pointer" onClick={()=>{ setTitleValue(val);  setVariantsDefaultListNew([]) } } key={i}>
                                          {val}
                                      </div>
                                      )
                                  })}
                                </div>
                              </div>
                              <div onClick={()=>{ titleValue !== "" && createList() }} className={`btn ${ titleValue === "" ? "btn-disabled" : "btn-primary"} col-lg-6`}>Nueva variante</div>
                          </div> }
                      </div>

                      { statusVariantes && <div className="mt-3">
                          <p className="mb-0 creation-input-label">Ingresa el titulo de la variante para luego crear los items de la misma</p>
                      </div> }

                      { statusVariantes && <div className="creation-card-content">

                        <div style={{width: "100%"}}>
                          <div className="row no-gutters align-items-center justify-content-spacebetween mb-3">
                            </div>

                            {listMain.map((ele, i)=>{
                                return(
                                <div className="fadeIn mb-3">
                                    
                                    <div className="row no-gutters mb-2 align-items-center">
                                      <p className="creation-input-label mr-4">{listTitle[i]}</p>
                                      <div className="row no-gutters mb-2 align-items-center justify-content-spacebetween">
                                        <div className="col-lg-9 row no-gutters align-items-center">
                                          <input onChange={(e)=>{ setItemTitulo(e.target.value) }} className="form-control col-lg-4 mr-2" placeholder="Nombre" type="text" />

                                          <div className="col-lg-3 mr-2">
                                            <div className="input-group">
                                              <div className="input-group-prepend">
                                                <span className="input-group-text">$</span>
                                              </div>
                                              <input onChange={(e)=>{ setItemPrecio(e.target.value) }} type="number" min="0" className="form-control" placeholder="0.0" />
                                            </div>
                                          </div>

                                        </div>

                                        <div onClick={()=>{ itemTitulo !== "" && createListItem(i)  }} className="btn btn-primary col-lg-2">Nuevo item</div>

                                        {listMain.length > 1 && 
                                        <div onClick={()=>{ deleteVariantFromList(ele, listTitle[i])  }} className="btn btn-danger col-lg-1">X</div>
                                        }
                                      </div>
                                    </div>

                                    <div className="row no-gutters">
                                      {ele.map((tag, iTag)=>{
                                        return(
                                          <div className="fadeIn variant-item" key={iTag}>
                                            <span className="cursor-pointer variant-item-delete" onClick={()=>{ deleteTagFromList( tag, i, iTag ) }} >X</span>
                                            <div className="variant-item-row">
                                              <div className="variant-item-p-col">
                                                <p className="variant-item-p-title">
                                                  {tag.text} 
                                                </p>
                                                <p className="variant-item-p-price">
                                                  ${tag.precio} 
                                                </p>
                                              </div>
                                            </div>
                                          </div>
                                        )
                                      })}
                                    </div>

                                </div>
                                )
                            })}
                        </div>
                        
                      </div> }
                    </div>
                    
                    <div className="creation-card mb-3">
                        <div className="row no-gutters align-items-center justify-content-spacebetween">
                            <div className="creation-card-title">Cargos adicionales</div>
                            
                            <div className="row no-gutters mb-2 align-items-center justify-content-spacebetween">
                              
                              <div className="col-lg-9 row no-gutters align-items-center">
                                <input value={chargeTitulo} onChange={(e)=>{ setChargeTitulo(e.target.value) }} className="form-control col-lg-4 mr-2" placeholder="Nombre" type="text" />

                                <div className="col-lg-3 mr-2">
                                  <div className="input-group">
                                    <div className="input-group-prepend">
                                      <span className="input-group-text">$</span>
                                    </div>
                                    <input value={chargePrecio} onChange={(e)=>{ setChargePrecio(e.target.value) }} type="number" min="0" className="form-control" placeholder="0.0" />
                                  </div>
                                </div>
                              </div>

                              <div onClick={()=>{ chargeTitulo !== "" && createListCharge()  }} className="btn btn-primary col-lg-3">Nuevo cargo</div>

                            </div>
                        </div>

                        <div className="mt-3">
                            <p className="mb-0 creation-input-label">Ingresa un cargo adicional para este servicio si es necesario</p>
                        </div>

                        <div className="creation-card-content">

                        <div style={{width: "100%"}}>
                          {chargesList.map((charge, i)=>{
                            return(
                              <div className="fadeIn variant-item" key={i}>
                                <span className="cursor-pointer variant-item-delete" onClick={()=>{ deleteChargeFromList( charge ) }} >X</span>
                                <div className="variant-item-row">
                                  <div className="variant-item-p-col">
                                    <p className="variant-item-p-title">
                                      {charge.nombre} 
                                    </p>
                                    <p className="variant-item-p-price">
                                      ${charge.precio} 
                                    </p>
                                  </div>
                                </div>
                              </div>
                            )
                          })}
                        </div>
                        
                      </div>
                    </div> */}

                </div>
                <div className="col-lg-4 pl-4">
                    
                    <div className="creation-card mb-5 p-3">
                        <div className="creation-card-content">
                            <div className="position-relative"  style={{width: "100%"}}>
                                <input type="file" ref={hiddenFileInput} onChange={handleChange}  style={{display: 'none'}} />
                                <div onClick={handleClick} className={`creation-input-photo ${ listErrors.includes("img") && "border-danger" }`}>
                                  {src !== "" ? <img src={src} alt="" /> : <div className={`creation-input-photo-inside`}><p className="material-icons icon mb-0">image</p></div>}
                                </div>
                                <div style={{textAlign: "center", width: "100%"}}>
                                    <p style={{fontSize: "13px", color: "#a3a6af"}} className="my-3">Dimensiones recomendadas (200px x 300px)</p>
                                </div>
                            </div>
                            
                            <div className="creation-input-group-grid no-gutters mb-3">
                                <div className="col-lg-12">
                                    <p className="creation-input-label mb-2">Categoría</p>
                                </div>
                                <div className="col-lg-12">
                                    <select value={servInfo.categoria} onChange={(e)=>{setServInfo({...servInfo, categoria: e.target.value}); setListErrors(listErrors.filter( prev => prev !== "categoria" ) ); getServicesCategories(e.target.value)  }} className={`form-control col-lg-12 ${ listErrors.includes("categoria") && "border-danger" } `}>
                                        <option value="">Categoría</option>
                                        {tiposCate.map(data => (
                                            <option key={data} value={data}>{data}</option>
                                        ))}
                                    </select>
                                </div>
                                 <div className="creation-errors-container">
                                    {listErrors.includes("categoria") && <p className="creation-errors-span"><i className="material-icons">highlight_off</i> { errorInputMsg } </p>}
                                </div>
                            </div>

                            {servInfo.categoria !== "" && <div className="creation-input-group-grid no-gutters mb-3">
                                <div className="col-lg-12">
                                    <p className="creation-input-label mb-2">Servicio</p>
                                </div>
                                <div className="col-lg-12">
                                    <select className="form-control" value={servInfo.titulo} onChange={e => setServInfo({...servInfo, titulo: e.target.value})}>
                                      <option>Selecciona el servicio:</option>
                                      {tipoServicios.map(data => (
                                        <option key={data} value={data}>{data}</option>
                                        ))}
                                    </select>
                                </div>
                                 <div className="creation-errors-container">
                                    {listErrors.includes("titulo") && <p className="creation-errors-span"><i className="material-icons">highlight_off</i> { errorInputMsg } </p>}
                                </div>
                            </div> }

                            { aliadoClientStatus && <div className="creation-input-group-grid no-gutters mb-3">
                                <div className="col-lg-12">
                                    <p className="creation-input-label mb-2">Titulo del servicio para aliados</p>
                                </div>
                                <div className="col-lg-12">
                                    <textarea value={tituloCustom} onChange={(e)=>{setTituloCustom(e.target.value); }} placeholder="Descripción del servicio" className={`form-control col-lg-12 `}/>
                                </div>
                            </div> }

                            <div className="creation-input-group-grid no-gutters mb-3">
                                <div className="col-lg-12">
                                    <p className="creation-input-label mb-2">Descripción</p>
                                </div>
                                <div className="col-lg-12">
                                    <textarea value={servInfo.descripcion} onChange={(e)=>{setServInfo({...servInfo, descripcion: e.target.value}); setListErrors(listErrors.filter( prev => prev !== "descripcion" ) )  }} placeholder="Descripción del servicio" className={`form-control col-lg-12 ${ listErrors.includes("descripcion") && "border-danger" } `}/>
                                </div>
                                 <div className="creation-errors-container">
                                    {listErrors.includes("descripcion") && <p className="creation-errors-span"><i className="material-icons">highlight_off</i> { errorInputMsg } </p>}
                                </div>
                            </div>
                            
                            <div className="creation-input-group-grid no-gutters">
                                <div className="col-lg-12">
                                    <p className="creation-input-label mb-2">Condiciones del servicio</p>
                                </div>
                                <div className="col-lg-12">
                                    <textarea value={servInfo.condiciones} onChange={(e)=>{setServInfo({...servInfo, condiciones: e.target.value}); setListErrors(listErrors.filter( prev => prev !== "condiciones" ) )  }} placeholder="Condiciones del servicio" className={`form-control col-lg-12 ${ listErrors.includes("condiciones") && "border-danger" } `}/>
                                </div>
                                 <div className="creation-errors-container">
                                    {listErrors.includes("condiciones") && <p className="creation-errors-span"><i className="material-icons">highlight_off</i> { errorInputMsg } </p>}
                                </div>
                            </div>
                            
                        </div>
                    </div>

                </div>
            </div>

        </div>
    )

    function concatObjects(obj) {
      let l = []
      obj.forEach(element => {
        l.push(element.text)
      });
      return l
    }

    function combinationsFunction(lista) {
      let l = lista !== undefined ? lista : listMain
      let combos = cartesian(...l)
      let list = []
      for (let i = 0; i < combos.length; i++) {
        let obj = {
          combo: concatObjects(combos[i]).join(' - '),
          // price: sumObjects(combos[i]),
          price: 0,
          stock: 0
        }
        console.log(combos[i])
        list.push(obj)
      }
      setListCombinations(list)
    }

    function cartesian(...args) {
      var r = []
      var max = args.length - 1;
      function helper(arr, i) {
        for (var j = 0, l = args[i].length; j < l; j++) {
          var a = arr.slice(0);
          a.push(args[i][j]);
          if (i == max)
            r.push(a);
          else
            helper(a, i + 1);
        }
      }
      helper([], 0);
      return r;
    }

    async function uploadServiceB2B(){
      let pInPP = parseFloat(servInfo.precio) * soles
      let id = firebase.db.collection("CanjeContenido").doc().id;
      setBtnMessage("Subiendo...")

      try{
        await firebase.storage.ref(`/Productos imagenes/${file.name}`).put(file)
        await firebase.storage.ref("Productos imagenes").child(file.name).getDownloadURL().then((url)=>{
          firebase.db.collection("CanjeContenido").set({
            aliadoId: user.aliadoId,
            isApproved: false,
            status: servInfo.status,
            servicioId: id,
            urlImagen: url,
            tipoContenido: "Servicio",
            localidadId: localidadId,
            pais: user.pais,
            titulo: tituloCustom,
            descripcion: servInfo.descripcion,
            precioAliado: pInPP,
            palabrasClave: palabrasClave,
            createdOn: moment().toDate(),
          })
        })
        setSuccess(true)
        setSuccessMsg("Servicio cargado exitosamente")
        setTimeout(() => {
            setSuccess(false)
            window.location.href = "/configuration/services"
        }, 4000);
        setBtnMessage("Subir producto")
        window.scrollTo(0, 0)
      }catch(e){
        console.log("Error: ", e )
      }
    }
    
    function createFullVariantsList(){

      let tipo = []

      listMain.forEach((v, i) => {
        let o = {
          titulo: listTitle[i],
          items: v
        }

        tipo.push(o)
      });

      return tipo

    }

    async function uploadService() {
        setBtnMessage("Subiendo...")

        let listaVariantes = createFullVariantsList()

        let date = moment().toDate().toUTCString()
        let id = firebase.db.collection("Localidades").doc(LPID).collection("Servicios").doc().id
        try {
          await firebase.storage.ref(`/Servicios imagenes/${file.name}`).put(file)
          firebase.storage.ref("Servicios imagenes").child(file.name).getDownloadURL().then((urlI) => {
            if(localidadesVarias.length > 0){
              localidadesVarias.forEach(localidad=>{
                uploadPart(id, localidad.localidadId, urlI, listaVariantes)
  
                firebase.db.collection("Localidades").doc(localidad.localidadId).update({
                  serviciosContiene: true
                })
  
              })
              setSuccess(true)
              setSuccessMsg("Servicio cargado exitosamente")
              setBtnMessage("Listo");
              if(!contieneAgenda){
                setTimeout(() => {
                  setSuccess(false)
                  window.location.href = "/configuration/services/new-services"
                }, 3500);
              }else{
                history.push({
                  pathname: "/configuration/services/agenda", 
                  state: { all: true, serviceId: id}
                })
              }
            }else{
              if(LPID === localidadId){
                uploadPart(id, LPID, urlI, listaVariantes).then((val)=>{
                  firebase.db.collection("Localidades").doc(LPID).update({
                    serviciosContiene: true
                  })
                  setSuccess(true)
                  setSuccessMsg("Servicio cargado exitosamente")
                  setBtnMessage("Listo");
                  if(!contieneAgenda){
                    setTimeout(() => {
                      setSuccess(false)
                      window.location.href = "/configuration/services/new-services"
                    }, 3500);
                  }else{
                    history.push({
                      pathname: '/configuration/services/agenda',
                      state: { all: false, serviceId: id, localidadId: LPID}
                    })
                  }
                })
              }else{
                firebase.db.collection("Localidades").doc(localidadId).update({
                  serviciosContiene: true
                })
                firebase.db.collection("Localidades").doc(LPID).update({
                  serviciosContiene: true
                })
                uploadPart(id, localidadId, urlI, listaVariantes)
                uploadPart(id, LPID, urlI, listaVariantes).then((val)=>{
                setSuccess(true)
                setSuccessMsg("Servicio cargado exitosamente")
                  setBtnMessage("Listo");
                  if(!contieneAgenda){
                    setTimeout(() => {
                      setSuccess(false)
                      window.location.href = "/configuration/services/new-services"
                    }, 3500);
                  }else{
                    history.push({
                      pathname: "/configuration/services/agenda", 
                      state: { all: false, serviceId: id, listLocalidades: [LPID, localidadId], noPrincipal: true}
                    })
                  }
                })
              }
    
            }
          })
        } catch(error) {
          alert(error.message)
        }
      }
  
      async function uploadPart(id, lid, urlImagen, listaVariantes){
        await firebase.db.collection("Localidades").doc(lid).collection("Servicios").doc(id).set({
          isApproved: false,
          agendaContiene: false,
          estadoServicio: servInfo.estadoServicio,
          aliadoId: user.masterId,
          categoria: servInfo.categoria,
          condiciones: servInfo.condiciones,
          descripcion: servInfo.descripcion,
          precio: parseFloat(servInfo.precio),
          localidadId: lid,
          servicioId: id,
          palabrasClave: palabrasClave,
          urlImagen: urlImagen,
          titulo: servInfo.titulo,
          capacidad: 0,
          unidad: servInfo.unidad,
          tipoMascota: servInfo.tipoMascota,
          dirigido: servInfo.dirigido,
          edad: servInfo.edad,
          domicilio: null,
          delivery: null,
          variantes: listaVariantes,
          cargos: chargesList,
          statusCorreoInicial: statusCorreoInicial,
          statusCorreoFinal: statusCorreoFinal,
          mensajeInicial: statusCorreoInicial ? draftToHtml(convertToRaw(editorStateInitial.getCurrentContent())) : null,
          mensajeFinal: statusCorreoFinal ? draftToHtml(convertToRaw(editorStateFinal.getCurrentContent())) : null,
          createdOn: moment().toDate(),
        })
        console.log("Listo")
      }
        

}

export default UploadService