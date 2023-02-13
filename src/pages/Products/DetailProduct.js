import React, {useEffect, useState, useRef} from 'react'
import firebase from '../../firebase/config'
import {Link} from 'react-router-dom';
import moment from 'moment';
// import ModalGuide from '../../components/ModalGuide';
import utils from '../../firebase/utils';
import Compress from "react-image-file-resizer";
import {useLocation} from 'react-router-dom';

function DetailProduct() {

    let variantsDefaultList = [
      "Color",
      "Tamaño",
      "Sabor"
    ]

    const data = useLocation()

    const [productsTypes, setProductsTypes] = useState([])
    const [palabrasClave, setPalabrasClave] = useState([])
    const [localidades, setLocalidades] = useState([])
    const [species, setSpecies] = useState([])
    const [razas, setRazas] = useState([])
    const [listErrors, setListErrors] = useState([])
    const [variantsDefaultListNew, setVariantsDefaultListNew] = useState([])
    
    const [successMsg, setSuccessMsg] = useState("");
    const [errorMsg, setErrorMsg] = useState("");
    const [palabra, setPalabra] = useState("")
    const [localidadId, setLocalidad] = useState("")
    const [titleValue, setTitleValue] = useState("");

    const [btnMessage, setBtnMessage] = useState("Subir producto");
    
    const [countryInfo, setCountryInfo] = useState({})
    const [user, setUser] = useState({})

    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(false);
    const [finalClientStatus, setFinalClientStatus] = useState(true);
    const [aliadoClientStatus, setAliadoClientStatus] = useState(false);
    const [petPointsStatus, setPetPointsStatus] = useState(false);

    const [soles, setSoles] = useState(0)
    const [changeNumber, setChangeNumber] = useState(0)

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

    const valores = [
      "Unidad",
      "Gramo",
      "Kilo",
      "Mililitro",
      "Litro",
      "Cápsula",
      "Galones",
      "Cajas",
      "Paquetes",
      "Docenas",
      "Libras",
      "Onzas",
    ]

    let errorInputMsg = "Campo requerido"

    const [producto, setProducto] = useState({
        productoId: "",
        sku: "",
        status: "",
        titulo: "",
        peso: "",
        pesoValor: "",
        pesoUnidad: "",
        codigoBarras: "",
        marca: "",
        precio: 0,
        precioComparacion: 0,
        existenciaMinima: 0,
        descripcion: "",
        cantidad: 0,
        dirigido: "Selección",
        categoria: "",
        edad: "",
        /* variantes: [], */
        tipoMascota: "Selección",
    })

    const [file, setFile] = useState(null);
    const [url, setURL] = useState("");
    const [src, setImg] = useState('');

    const handleClick = event => {
        hiddenFileInput.current.click();
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

    
    const getLocalidades = async(aliadoId) =>{
        let tipos = [];
        await firebase.db.collection('Localidades').where("aliadoId", "==", aliadoId).get().then(val => {
            val.docs.forEach(item=>{
                tipos.push(item.data())
                tipos.sort()
            })
            setLocalidades(tipos)
        })
    }

    const getProductsTypes = async() =>{
        let tipos = [];
        await firebase.db.collection('tipoProductos').get().then(val => {
            val.docs.forEach(item=>{
                tipos.push(item.id)
                tipos.sort()
            })
            tipos.pop("Todas")
            setProductsTypes(tipos)
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

    function checkInputs(o){
        
        console.log(o)
        let val = 0
        let array = []

        Object.keys(o).forEach(function(key) {
            if(key !== "palabrasClave"){
                if (o[key] === '' || o[key] <= 0) {
                    val++
                    array.push(key)
                }
            }
        });
        if(val > 0){
            setListErrors(array)
            window.scrollTo(0, 0)
        }else{
            uploadProducto()
            setListErrors([])
            console.log("Todo bien")
        }
    }
        
    async function getValuePetPoint(pais){
        try {
            await firebase.db.collection("Ciudades").doc(pais).get().then((v)=>{
                let precioPP =  parseInt(v.data().valorPunto)
                setSoles(precioPP)
            })
        }catch(e){

        }

    }

    async function getProductData(pid){
        try {
            await firebase.db.collection("Productos").doc(pid).onSnapshot((val)=>{
                setProducto({
                    productoId: val.data()["productoId"] ?? data.state.productoId,
                    urlImagen: val.data()["urlImagen"] ?? "",
                    sku: val.data()["sku"] ?? "",
                    palabrasClave: val.data()["palabrasClave"] ?? [],
                    status: val.data()["status"] ?? "",
                    titulo: val.data()["titulo"] ?? "",
                    peso: val.data()["peso"] ?? "",
                    pesoValor: val.data()["pesoValor"] ?? 0,
                    pesoUnidad: val.data()["pesoUnidad"] ?? "",
                    codigoBarras: val.data()["codigoBarras"] ?? "",
                    marca: val.data()["marca"] ?? "",
                    precio: val.data()["precio"] ?? 0,
                    precioComparacion: val.data()["precioComparacion"] ?? 0,
                    existenciaMinima: val.data()["existenciaMinima"] ?? 0,
                    descripcion: val.data()["descripcion"] ?? "",
                    cantidad: val.data()["cantidad"] ?? 0,
                    dirigido: val.data()["dirigido"] ?? "",
                    categoria: val.data()["categoria"] ?? "",
                    /* variantes: val.data()["variantes"] ?? [], */
                    edad: val.data()["edad"] ?? "",
                    tipoMascota: val.data()["tipoMascota"] ?? "",
                })
            })
        } catch (e) {
            console.log(e)
        }
    }

    function deleteVariantFromList(ele, t){
        let newLista = producto.variantes.filter((prev) => prev !== ele)
        setProducto({...producto, variantes: newLista})
    }

    function deleteTagFromList(tag, iMain, iSub){
        let lista = [...producto.variantes]
        let newLista = lista[iMain].filter((prv) => prv !== tag)
        lista[iMain] = newLista

        setProducto({...producto, variantes: newLista})
    }

    function createList(){
        // let list = [...listMain]
        // list.push([])
        // setListMain(list)
        
        // let listT = [...listTitle]
        // listT.push(titleValue)
        // setListTitle(listT)
        // setTitleValue("")
    }

    function createVariantFromList(palabra){
      let tipos = []
      if(palabra !== ""){
        for(let i = 0; i < variantsDefaultList.length; i++){
          let w = variantsDefaultList[i]
          if(w.toLowerCase().includes(palabra.toLowerCase())){
            tipos.push(w)
          }else{
            setVariantsDefaultListNew([])
            setTitleValue(palabra)
          }
        }
        setVariantsDefaultListNew(tipos)
      }else{
        setTitleValue("")
        setVariantsDefaultListNew([])
      }
    }

    useEffect(() => {
        firebase.getCurrentUser().then((val)=>{
          setUser(val)
          getLocalidades(val.aliadoId)
          getValuePetPoint(val.pais)
          firebase.getCountryInfo(val.pais).then(async (val) => {
            setCountryInfo(val.data()) 
          })
        });
        getProductsTypes()
        getPets()

        getProductData(data.state.productoId)

    }, [])

    return (
        <div className="main-content-container container-fluid px-4">
            {error && <ErrorComponent msg={errorMsg === "" ? "Todos los campos son requeridos" : errorMsg}/>}
            {success && <SuccessComponent msg={successMsg === "" ? "Producto cargado exitosamente" : successMsg}/>}

            <div className="page-header align-items-center justify-content-spacebetween row no-gutters px-4 my-4">
                <div className="col-12 col-sm-5 text-center text-sm-left mb-0">
                    <div className="row align-items-center">
                        <div className="col">
                            <p className="page-title bold"><Link className="color-white mr-3 light" to="/configuration">Configuración</Link> <Link className="color-white light" to="/configuration/products">Productos</Link> <span>Producto</span> </p>
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
                        <h4 className="color-primary bold mb-0">Editar</h4>
                        <div className="row no-gutters">
                            <div onClick={()=>{ checkInputs(producto) }}  className="btn btn-success mr-3">Actualizar producto</div>
                            <div onClick={()=>{ deleteProducto() }}  className="btn btn-danger mr-3">Eliminar producto</div>
                            <div onClick={()=>{updateActive()}} className={`btn ${producto.status === "Activo" ? "btn-outline-danger" : "btn-outline-success"}`}>{producto.status === "Activo" ? "Desactivar" : "Activar"} <span className="d-none">{changeNumber}</span> </div>
                        </div>
                    </div>

                    <div className="creation-card mb-3">
                        <div className="creation-card-title">Presentación</div>
                        <div className="creation-card-content">
                            
                            <div className="creation-input-group mr-4 mb-3 no-gutters">
                                <div className="col-lg-auto mr-2">
                                    <p className="creation-input-label">Presentación</p>
                                </div>
                                <div className="col-lg-auto mr-2">
                                    <input type="number" min="0" value={producto.pesoValor} onChange={(e)=>{setProducto({...producto, pesoValor: e.target.value}); setListErrors(listErrors.filter( prev => prev !== "pesoValor" ) ) }} placeholder="0" className={`form-control col-lg-12 ${ listErrors.includes("pesoValor") && "border-danger" } `}/>
                                </div>
                                <div className="col-lg-auto mr-2">
                                    <select value={producto.pesoUnidad} onChange={(e)=>{setProducto({...producto, pesoUnidad: e.target.value}); setListErrors(listErrors.filter( prev => prev !== "pesoUnidad" ) ) }} className={`form-control col-lg-12 ${ listErrors.includes("pesoUnidad") && "border-danger" } `}>
                                        <option value="">Medida</option>
                                        {valores.map((data, i) => (
                                            <option key={i} value={data}>{data}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="creation-errors-container">
                                    {(listErrors.includes("pesoValor") || listErrors.includes("pesoUnidad")) && <p className="creation-errors-span"><i className="material-icons">highlight_off</i> { errorInputMsg } </p>}
                                </div>
                            </div>
                            
                            <div className="creation-input-group mr-4 mb-3 no-gutters">
                                <div className="col-lg-auto mr-2">
                                    <p className="creation-input-label">Marca del producto</p>
                                </div>
                                <div className="col-lg-auto mr-2">
                                    <input value={producto.marca} onChange={(e)=>{setProducto({...producto, marca: e.target.value}); setListErrors(listErrors.filter( prev => prev !== "marca" ) )  }} type="text" placeholder="Dog Chow" className={`form-control col-lg-12 ${ listErrors.includes("marca") && "border-danger" } `}/>
                                </div>
                                <div className="creation-errors-container">
                                    {listErrors.includes("marca") && <p className="creation-errors-span"><i className="material-icons">highlight_off</i> { errorInputMsg } </p>}
                                </div>
                            </div>

                            <div className="creation-input-group mr-4 mb-3 no-gutters">
                                <div className="col-lg-auto mr-2">
                                    <p className="creation-input-label">Código de barra</p>
                                </div>
                                <div className="col-lg-auto mr-2">
                                    <input value={producto.codigoBarras} onChange={(e)=>{setProducto({...producto, codigoBarras: e.target.value}); setListErrors(listErrors.filter( prev => prev !== "codigoBarras" ) )  }} type="text" placeholder="ISBN" className={`form-control col-lg-12 ${ listErrors.includes("codigoBarras") && "border-danger" } `}/>
                                </div>
                                <div className="creation-errors-container">
                                    {listErrors.includes("codigoBarras") && <p className="creation-errors-span"><i className="material-icons">highlight_off</i> { errorInputMsg } </p>}
                                </div>
                            </div>
                            
                            <div className="creation-input-group mr-4-words">

                                <div className="creation-input-group mr-4 no-gutters mr-2">
                                    <div className="col-lg-auto mr-2">
                                        <p className="creation-input-label">Etiquetas</p>
                                    </div>
                                    <div className="col-lg-auto mr-2">
                                        <input ref={inputTag} type="text" onChange={e=>{setPalabra(e.target.value)}}  placeholder="Comida" className="form-control"/>
                                    </div>
                                </div>
                                {producto.palabrasClave !== undefined && producto.palabrasClave.map(p => (
                                    <p className="pill mb-0" key={p}>{p} <span className="cursor-pointer btn-delete" onClick={()=>{ setPalabrasClave(palabrasClave.filter((p1) => p1 !== p)); }} >X</span></p>
                                ))}

                            </div>



                        </div>
                    </div>
                    
                    <div className="creation-card mb-3">
                        <div className="creation-card-title">Inventario</div>
                        <div className="creation-card-content">

                            <div className="creation-input-group mr-4 no-gutters">
                                <div className="col-lg-auto mr-2">
                                    <p className="creation-input-label">Cantidad actual</p>
                                </div>
                                <div className="col-lg-auto mr-2">
                                    <input value={producto.cantidad} onChange={(e)=>{setProducto({...producto, cantidad: e.target.value}); setListErrors(listErrors.filter( prev => prev !== "cantidad" ) )  }} type="number" min="0" placeholder="0" className={`form-control col-lg-12 ${ listErrors.includes("cantidad") && "border-danger" } `}/>
                                </div>
                                <div className="creation-errors-container">
                                    {listErrors.includes("cantidad") && <p className="creation-errors-span"><i className="material-icons">highlight_off</i> { errorInputMsg } </p>}
                                </div>
                            </div>

                            <div className="creation-input-group mr-4 no-gutters">
                                <div className="col-lg-auto mr-2">
                                    <p className="creation-input-label">Cantidad minima de reorden</p>
                                </div>
                                <div className="col-lg-auto mr-2">
                                    <input value={producto.existenciaMinima} onChange={(e)=>{setProducto({...producto, existenciaMinima: e.target.value}); setListErrors(listErrors.filter( prev => prev !== "existenciaMinima" ) )  }} type="number" min="0" placeholder="0" className={`form-control col-lg-12 ${ listErrors.includes("existenciaMinima") && "border-danger" } `}/>
                                </div>
                                <div className="creation-errors-container">
                                    {listErrors.includes("existenciaMinima") && <p className="creation-errors-span"><i className="material-icons">highlight_off</i> { errorInputMsg } </p>}
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div className="creation-card mb-3">
                        <div className="creation-card-title">Precio</div>
                        <div className="creation-card-content">

                            { finalClientStatus && <div className="creation-input-group mr-4 no-gutters">
                                <div className="col-lg-auto mr-2">
                                    <p className="creation-input-label">Precio paciente final</p>
                                </div>
                                <div className="col-lg-auto mr-2">
                                    <input type="number" min="0" value={producto.precio} onChange={(e)=>{setProducto({...producto, precio: e.target.value}); setListErrors(listErrors.filter( prev => prev !== "precio" ) )  }} placeholder="0" className={`form-control col-lg-12 ${ listErrors.includes("precio") && "border-danger" } `}/>
                                </div>
                                <div className="creation-errors-container">
                                    {(listErrors.includes("precio") && finalClientStatus) && <p className="creation-errors-span"><i className="material-icons">highlight_off</i> { errorInputMsg } </p>}
                                </div>
                            </div> }
                            { aliadoClientStatus && <div className="creation-input-group mr-4 no-gutters">
                                <div className="col-lg-auto mr-2">
                                    <p className="creation-input-label">Precio aliado</p>
                                </div>
                                <div className="col-lg-auto mr-2">
                                    <input type="number" min="0" value={producto.precioAliado} onChange={(e)=>{setProducto({...producto, precioAliado: e.target.value})}} placeholder="0" className="form-control"/>
                                </div>
                                <div className="creation-errors-container">
                                    {(listErrors.includes("precioAliado") && aliadoClientStatus) && <p className="creation-errors-span"><i className="material-icons">highlight_off</i> { errorInputMsg } </p>}
                                </div>
                            </div> }

                            <div className={`creation-input-group mr-4 no-gutters`}>
                                <div className="col-lg-auto mr-2">
                                    <p className="creation-input-label">Precio comparación</p>
                                </div>
                                <div className="col-lg-auto mr-2">
                                    <input type="number" min="0" value={producto.precioComparacion} onChange={(e)=>{setProducto({...producto, precioComparacion: e.target.value}); setListErrors(listErrors.filter( prev => prev !== "precioComparacion" )); }} placeholder="0" className={`form-control  ${ listErrors.includes("precioComparacion") && "border-danger" } `}/>
                                </div>
                            </div>
                        
                        </div>
                    </div>
                    
                    <div className="creation-card mb-5">
                        <div className="creation-card-title mb-2">Mercado</div>
                        <p className="creation-card-p">Indica a quien está dirigido el producto</p>
                        <div className="creation-card-content">

                            <div className="creation-input-group mr-4 no-gutters">
                                <div className="col-lg-auto mr-2">
                                    <p className="creation-input-label">Especie</p>
                                </div>
                                <div className="col-lg-auto mr-2">
                                    <select value={producto.tipoMascota} onChange={(e)=>{setProducto({...producto, tipoMascota: e.target.value}); getRazas(e.target.value); setListErrors(listErrors.filter( prev => prev !== "tipoMascota" ) )    }} className={`form-control col-lg-12 ${ listErrors.includes("tipoMascota") && "border-danger" } `}>
                                        <option value="">Selección</option>
                                            {species.map(data => (
                                                <option key={data} value={data}>{data}</option>
                                            ))}
                                        <option value="Todos">Todos</option>
                                    </select>
                                </div>
                                <div className="creation-errors-container">
                                    {listErrors.includes("tipoMascota") && <p className="creation-errors-span"><i className="material-icons">highlight_off</i> { errorInputMsg } </p>}
                                </div>
                            </div>
                            
                            { razas.length > 0 && <div className="creation-input-group mr-4 no-gutters">
                                <div className="col-lg-auto mr-2">
                                    <p className="creation-input-label">Raza</p>
                                </div>
                                <div className="col-lg-auto mr-2">
                                    <select value={producto.dirigido} onChange={(e)=>{setProducto({...producto, dirigido: e.target.value})}} className={`form-control col-lg-12`}>
                                        <option value="">Selección</option>
                                        {razas.map((data, i) => (
                                            <option key={i} value={data}>{data}</option>
                                        ))}
                                    </select>
                                </div>
                            </div> }
                            
                            <div className="creation-input-group mr-4 no-gutters">
                                <div className="col-lg-auto mr-2">
                                    <p className="creation-input-label">Edad</p>
                                </div>
                                <div className="col-lg-auto mr-2">
                                    <select value={producto.edad} onChange={(e)=>{setProducto({...producto, edad: e.target.value}); setListErrors(listErrors.filter( prev => prev !== "edad" ) )  }} className={`form-control col-lg-12 ${ listErrors.includes("edad") && "border-danger" } `}>
                                        <option value="">Selección</option>
                                        <option value="Cachorro">Cachorro</option>
                                        <option value="Adulto">Adulto</option>
                                    </select>
                                </div>
                                <div className="creation-errors-container">
                                    {listErrors.includes("edad") && <p className="creation-errors-span"><i className="material-icons">highlight_off</i> { errorInputMsg } </p>}
                                </div>
                            </div>
                            
                        </div>
                    </div>

                    {/* <div className="creation-card mb-3">
                        <div className="row no-gutters align-items-center justify-content-spacebetween">
                            <div className="creation-card-title">Variantes</div>
                            
                            <div className="row">
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
                            </div>
                        </div>

                        <div className="mt-3">
                            <p className="mb-0 creation-input-label">Ingresa el titulo de la variante para luego crear los items de la misma</p>
                        </div>

                        <div className="creation-card-content">

                        <div style={{width: "100%"}}>
                            <div className="row no-gutters align-items-center justify-content-spacebetween mb-3">
                            </div>

                            {producto.variantes.map((ele, i)=>{
                                return(
                                <div className="fadeIn mb-3">
                                    
                                    <div className="row no-gutters mb-2 align-items-center">
                                        <p className="creation-input-label mr-4">{ele["titulo"]}</p>
                                        <div className="row no-gutters mb-2 align-items-center justify-content-spacebetween" style={{width: "10%"}}>
                                          <div onClick={()=>{ deleteVariantFromList(ele)  }} className="btn btn-danger col-lg-12">X</div>
                                        </div>
                                    </div>

                                    <div className="row no-gutters">
                                      {ele["items"].map((tag, iTag)=>{
                                        return(
                                          <div className="fadeIn variant-item" key={iTag}>
                                            <span className="cursor-pointer variant-item-delete" onClick={()=>{ deleteTagFromList( tag, i, iTag ) }} >X</span>
                                            <div className="variant-item-row">
                                              { tag.image !== "" && <div className="variant-item-img-col">
                                                <img src={tag.image} className=""/>
                                              </div> }
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
                        </div>
                    </div> */}

                </div>
                <div className="col-lg-4 pl-4">
                    
                    <div className="creation-card mb-5 p-3">
                        <div className="creation-card-content">
                            <div className="position-relative">
                                <input type="file" ref={hiddenFileInput} onChange={handleChange}  style={{display: 'none'}} />
                                <div onClick={handleClick} className={`creation-input-photo-product ${ listErrors.includes("img") && "border-danger" }`}>
                                {src !== "" ? <img src={src} alt="" /> : <img src={producto.urlImagen} alt="" />}
                                </div>
                                <div style={{textAlign: "center", width: "100%"}}>
                                    <p style={{fontSize: "13px", color: "#a3a6af"}} className="my-3">Dimensiones recomendadas (200 x 300)</p>
                                </div>
                            </div>
                            
                            <div className="creation-input-group-grid no-gutters mb-3">
                                <div className="col-lg-12">
                                    <p className="creation-input-label mb-2">Título</p>
                                </div>
                                <div className="col-lg-12">
                                    <input value={producto.titulo} onChange={(e)=>{setProducto({...producto, titulo: e.target.value}); setListErrors(listErrors.filter( prev => prev !== "titulo" ) )  }} placeholder="Título del producto" className={`form-control col-lg-12 ${ listErrors.includes("titulo") && "border-danger" } `}/>
                                </div>
                                 <div className="creation-errors-container">
                                    {listErrors.includes("titulo") && <p className="creation-errors-span"><i className="material-icons">highlight_off</i> { errorInputMsg } </p>}
                                </div>
                            </div>
                            
                            <div className="creation-input-group-grid no-gutters mb-3">
                                <div className="col-lg-12">
                                    <p className="creation-input-label mb-2">SKU</p>
                                </div>
                                <div className="col-lg-12">
                                    <input value={producto.sku} onChange={(e)=>{setProducto({...producto, sku: e.target.value}); setListErrors(listErrors.filter( prev => prev !== "sku" ) )  }} placeholder="ABC123" className={`form-control col-lg-12 ${ listErrors.includes("sku") && "border-danger" } `}/>
                                </div>
                                 <div className="creation-errors-container">
                                    {listErrors.includes("sku") && <p className="creation-errors-span"><i className="material-icons">highlight_off</i> { errorInputMsg } </p>}
                                </div>
                            </div>
                            
                            <div className="creation-input-group-grid no-gutters mb-3">
                                <div className="col-lg-12">
                                    <p className="creation-input-label mb-2">Categoría</p>
                                </div>
                                <div className="col-lg-12">
                                    <select value={producto.categoria} onChange={(e)=>{setProducto({...producto, categoria: e.target.value}); setListErrors(listErrors.filter( prev => prev !== "categoria" ) )  }} className={`form-control col-lg-12 ${ listErrors.includes("categoria") && "border-danger" } `}>
                                        <option value="">Categoría</option>
                                        {productsTypes.map(data => (
                                            <option key={data} value={data}>{data}</option>
                                        ))}
                                    </select>
                                </div>
                                 <div className="creation-errors-container">
                                    {listErrors.includes("categoria") && <p className="creation-errors-span"><i className="material-icons">highlight_off</i> { errorInputMsg } </p>}
                                </div>
                            </div>

                            <div className="creation-input-group-grid no-gutters">
                                <div className="col-lg-12">
                                    <p className="creation-input-label mb-2">Descripción</p>
                                </div>
                                <div className="col-lg-12">
                                    <textarea value={producto.descripcion} onChange={(e)=>{setProducto({...producto, descripcion: e.target.value}); setListErrors(listErrors.filter( prev => prev !== "descripcion" ) )  }} placeholder="Descripción del producto" className={`form-control col-lg-12 ${ listErrors.includes("descripcion") && "border-danger" } `}/>
                                </div>
                                 <div className="creation-errors-container">
                                    {listErrors.includes("descripcion") && <p className="creation-errors-span"><i className="material-icons">highlight_off</i> { errorInputMsg } </p>}
                                </div>
                            </div>
                            
                        </div>
                    </div>

                </div>
            </div>

        </div>
    )

    async function updateActive(){
        try{
          await firebase.db.collection("Productos").doc(producto.productoId).update({
            status: producto.status === "Activo" ? "Borrador" : "Activo"
          })
          producto.status = producto.status === "Activo" ? "Borrador" : "Activo"
          setTimeout(() => {
            setChangeNumber( changeNumber + 1 )
          }, 100);
        }catch(e){
          console.log(`Error: ${e}`)
        }
    }

    async function deleteProducto(){
        try {
            await firebase.db.collection("Productos").doc(producto.productoId).delete()
            setSuccess(true)
            setSuccessMsg("Producto eliminado exitosamente")
            setTimeout(() => {
                setSuccess(false)
                window.location.href = "/configuration/products"
            }, 1000);
        } catch (e) {
            console.log(e)
        }
    }

    async function uploadProducto() {

        setBtnMessage("Subiendo...")
        
        if(file){
            try {
                await firebase.storage.ref(`/Productos imagenes/${file.name}`).put(file)
                await firebase.storage.ref("Productos imagenes").child(file.name).getDownloadURL().then((url) => {
                    firebase.db.collection("Productos").doc(producto.productoId).update({                    
                        status: producto.status,
                        urlImagen: url,
                        titulo: producto.titulo,
                        edad: producto.edad,
                        descripcion: producto.descripcion,
                        precio: parseFloat(producto.precio),
                        presentacion: producto.peso + " " + producto.pesoUnidad,
                        peso: producto.peso + " " + producto.pesoUnidad,
                        pesoUnidad: producto.pesoUnidad,
                        pesoValor: producto.peso,
                        marca: producto.marca,
                        codigoBarras: producto.codigoBarras,
                        tipoMascota: producto.tipoMascota,
                        sku: producto.sku,
                        existenciaMinima: producto.existenciaMinima,
                        dirigido: producto.dirigido,
                        cantidad: parseInt(producto.cantidad),
                        categoria: producto.categoria,
                    })
                })
                setSuccess(true)
                setSuccessMsg("Producto actualizado exitosamente")
                setTimeout(() => {
                    setSuccess(false)
                    window.location.href = "/configuration/products"
                }, 1000);
                setBtnMessage("Actualizar producto")
                window.scrollTo(0, 0)
            } catch (error) {
                alert("Ha ocurrido un error: ", error)
            }
            
        }else{
            try {
                await firebase.db.collection("Productos").doc(producto.productoId).update({
                    status: producto.status,
                    titulo: producto.titulo,
                    edad: producto.edad,
                    descripcion: producto.descripcion,
                    precio: parseFloat(producto.precio),
                    presentacion: producto.peso + " " + producto.pesoUnidad,
                    peso: producto.peso + " " + producto.pesoUnidad,
                    pesoUnidad: producto.pesoUnidad,
                    pesoValor: producto.peso,
                    marca: producto.marca,
                    codigoBarras: producto.codigoBarras,
                    tipoMascota: producto.tipoMascota,
                    sku: producto.sku,
                    existenciaMinima: producto.existenciaMinima,
                    dirigido: producto.dirigido,
                    cantidad: parseInt(producto.cantidad),
                    categoria: producto.categoria,
                })
                setSuccess(true)
                setSuccessMsg("Producto actualizado exitosamente")
                setTimeout(() => {
                    setSuccess(false)
                    window.location.href = "/configuration/products"
                }, 4000);
                setBtnMessage("Actualizar producto")
                window.scrollTo(0, 0)
            } catch (error) {
                alert("Ha ocurrido un error: ", error)
            }

        }


    }

}

export default DetailProduct
