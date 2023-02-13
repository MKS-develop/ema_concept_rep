import React, {useState, useEffect, useRef} from 'react'
import firebase from '../../firebase/config'
import {Link, useHistory} from 'react-router-dom';
import moment from 'moment';
import * as XLSX from "xlsx";
import { createRef } from 'react';
//import ModalGuide from '../../components/ModalGuide';
import utils from '../../firebase/utils';
import Compress from "react-image-file-resizer";
import {useLocation} from 'react-router-dom';

function NewProducts() {

  const history = useHistory()  
  const data = useLocation()
  
  const [products, setProducts] = useState([])
  const [productsTypes, setProductsTypes] = useState([])
  const [palabrasClave, setPalabrasClave] = useState([])
  const [localidades, setLocalidades] = useState([])
  const [species, setSpecies] = useState([])
  const [selectedProducts, setSelectedProducts] = useState([])
  
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [palabra, setPalabra] = useState("")
  const [localidadId, setLocalidad] = useState("")
  const [btnMessage, setBtnMessage] = useState("Subir producto");
  
  const [countryInfo, setCountryInfo] = useState({})
  const [user, setUser] = useState({})
  const [product, setProduct] = useState({})

  const [update, setUpdate] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [deliveryAplica, setDeliveryAplica] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [walkinModal, setWalkinModal] = useState(false);
  
  const inputSku = useRef(null)
  const inputName = useRef(null)
  const inputDesc = useRef(null)
  const inputWord = useRef(null)
  const inputPeso = useRef(null)
  const inputPrice = useRef(null)
  const inputCantidad = useRef(null)
  const inputMinima = useRef(null)
  
  const hiddenFileInput = useRef(null);
  const [searchName, setSearchName] = useState(null)
  const [searchSku, setSearchSku] = useState(null)
  const [searchCategorie, setSearchCategorie] = useState(null)
  const [searchStatus, setSearchStatus] = useState(null)

  const razas = [
    "Sénior",
    "Adulto",
    "Cachorro",
    "Todos",
  ]

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

    const [prodInfo, setProdInfo] = useState({
      sku: "",
      titulo: "",
      peso: "",
      pesoUnidad: "",
      precio: "",
      existenciaMinima: "",
      descripcion: "",
      cantidad: "",
      dirigido: "Valor",
      continuarVendiendo: false,
      categoria: "",
      tipoMascota: "Valor",
    })
    const [prodUInfo, setProdUInfo] = useState({
      sku: null,
      titulo: null,
      precio: null,
      pesoValor: null,
      pesoUnidad: null,
      existenciaMinima: null,
      descripcion: null,
      cantidad: null,
      dirigido: null,
      continuarVendiendo: null,
      categoria: null,
      tipoMascota: null,
    })

    const [step1, setStep1] = useState(false);
    const [step2, setStep2] = useState(false);
    const [step3, setStep3] = useState(false);
    const [step4, setStep4] = useState(false);
    const [step5, setStep5] = useState(false);
    const [step6, setStep6] = useState(false);
    const [step7, setStep7] = useState(false);
    const [step8, setStep8] = useState(false);
    const [step9, setStep9] = useState(false);
    const [step10, setStep10] = useState(false);
    const [step11, setStep11] = useState(false);
    const [step12, setStep12] = useState(false);
    const [step13, setStep13] = useState(false);
    const [stepStart, setStepStart] = useState(false);

    const [file, setFile] = useState(null);
    const [url, setURL] = useState("");
    const [src, setImg] = useState('');
    const url2 = window.location.href;
    


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
    }
    
    const getLocalidades = async(aliadoId) =>{
      let tipos = [];
      await firebase.db.collection('Localidades').where("aliadoId", "==", aliadoId)
      .get().then(val => {
        val.docs.forEach(item=>{
          tipos.push(item.data())
          tipos.sort()
        })
        setLocalidades(tipos)
      })
    }
    
    function filterName(list, val) {
      let tipos = []
      for(let i = 0; i < list.length; i++){
        
        let u = list[i].titulo
        let uLower = u.toLowerCase()

        if( uLower.includes(val.toLowerCase()) ){
          tipos.push(list[i])
        }
      }
      return tipos
    }
    
    function filterSku(list, val) {
      let tipos = []
      for(let i = 0; i < list.length; i++){
        
        let u = list[i].sku !== undefined ? list[i].sku.toString() : ""

        if( u.includes(val) ){
          tipos.push(list[i])
        }
      }
      return tipos
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

    const getProducts = async(aliadoId) =>{
      let tipos = [];
      await firebase.db.collection('Productos').where("aliadoId", "==", aliadoId).get().then(val => {
        val.docs.forEach(item=>{
          let a = {
            ...item.data(),
            countedItems: 0
          }
          tipos.push(a)
          tipos.sort()
        })

        let allList = tipos
        let filteredName = searchName ? filterName(tipos, searchName) : allList
        let filteredSku = searchSku ? filterSku(filteredName, searchSku) : filteredName
        let filteredCategorie = searchCategorie !== "Todas" && searchCategorie ? filterCategorie(filteredSku, searchCategorie) : filteredSku

        setProducts(filteredCategorie.sort((a, b) => b.createdOn - a.createdOn))

      })
    }
    
    const getProductsTypes = async() =>{
      let tipos = [];
      await firebase.db.collection('tipoProductos')
      .get().then(val => {
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
      await firebase.db.collection('Especies')
      .get().then(val => {
        val.docs.forEach(item=>{
          tipos.push(item.id)
          tipos.sort()
        })
        setSpecies(tipos)
      })
    }

    const wrapperRef = useRef(null);
    const excelBtn = useRef(null);
    const pdfBtn = useRef(null);

    function handleDownload(){
      excelBtn.current.click();
      pdfBtn.current.click();
    }

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

    let help = [
      "Haz clic en el signo + para insertar la foto que corresponda al producto que estés ingresando",
      "LOCALIDAD – Selecciona la Localidad en donde se vende el producto",
      "CODIGO DEL PRODUCTO – Ingresa el código del producto",
      "NOMBRE – Ingresa el nombre del producto",
      "DESCRIPCIÓN – Escribe de que se trata el producto",
      "ETIQUETAS – Ingresa palabras claves relacionadas con el producto que puedan facilitar su búsqueda a los Dueños de las Mascotas.",
      "TIPO DE MASCOTA – Selecciona el tipo de mascota a la que va dirigido el producto",
      "A QUIEN VA DIRIGIDO – Selecciona a quien va dirigido el producto",
      "CATEGORIA – Selecciona la categoría del producto que estas ingresando.",
      "CANTIDAD / UNIDAD - Indica la unidad de medida y la cantidad que corresponda a la presentación del producto",
      "PRECIO – Ingresa costo del producto. El Costo debe estar alineado con la unidad seleccionada.",
      "CANTIDAD ACTUAL DISPONIBLE / UNIDAD – Ingresa la cantidad total que tienes disponible para este producto al momento del ingreso de la información.",
      "CANTIDAD MINIMA DE REORDEN – Ingresa la cantidad mínima de existencia en la que el producto debe reordenarse",
      "¿CONTINUAR VENDIENDO CUANDO SE HAYA AGOTADO? – Indicar en el check box si desea habilitar esta opción.",
      "OPCIONES DE ENTREGA – Indicar si este producto debe recogerse en tienda o si para este producto prestan servicio de Delivery.",
      "Paso 1: Indica si cuentas con servicio de Delivery, e ingresa el costo. \n Paso 2: Ingresa cada uno de tus productos en la opción “Subir Producto” y completa cada uno de los campos solicitados.",
    ]

    let styleSticky = {
      position: "sticky",
      top: "70px"
    }
    
    useEffect(() => {
        firebase.getCurrentUser().then((val)=>{
          setUser(val)
          getProducts(val.aliadoId)
          getLocalidades(val.aliadoId)
          setDeliveryAplica(val.delivery > 0 && val.delivery !== null ? true : false)
          firebase.getCountryInfo(val.pais).then((val)=>{
            setCountryInfo(val.data()) 
          })
        });
        getProductsTypes()
        getPets()

    }, [])


    return (
      
        <div className="main-content-container container-fluid px-4">
          {error && <ErrorComponent msg={errorMsg === "" ? "Todos los campos son requeridos" : errorMsg}/>}
          {success && <SuccessComponent msg={successMsg === "" ? "Producto cargado exitosamente" : successMsg}/>}
        
          
            <div className="page-header align-items-center justify-content-spacebetween row no-gutters px-4 my-4">
              <div className="col-12 col-sm-5 text-center text-sm-left mb-0">
                <div className="row align-items-center">
                  <div className="col">
                    <p className="page-title bold"><Link className="color-white light" to="/configuration">Configuración</Link> <span>Productos</span> <span className="page-title-counter">Total: {products.length}</span> </p>
                  </div>
                </div>
              </div>
              <div className="col-12 col-sm-1 mb-0 level-1">
                <div className="row align-items-center justify-content-space-around level-2">
                  <i onClick={()=>{setStepStart(true)}} className="material-icons color-white display-5 cursor-pointer">help_outline</i>
                </div>
              </div>
            </div>

            <div className="my-3 row no-gutters align-items-center">
                <div className="form-group mr-3 mb-0 col-lg-2">
                    <input type="text" placeholder="Nombre del producto" className="form-control" onChange={(e)=>{ setSearchName(e.target.value) }}/>
                </div>
                <div className="form-group mr-3 mb-0 col-lg-2">
                    <input type="text" placeholder="SKU del producto" className="form-control" onChange={(e)=>{ setSearchSku(e.target.value) }}/>
                </div>
                <div className="form-group mr-3 mb-0 col-lg-2">
                    <select className="form-control" onChange={(e) => { setSearchCategorie(e.target.value) }}>
                        <option value="">Categoría</option>
                        {productsTypes.map(data => (
                            <option key={data} value={data}>{data}</option>
                        ))}
                        <option value="Todas">Todas</option>
                    </select>
                </div>
                <div className="form-group mr-3 mb-0 col-lg-2">
                    <select className="form-control" onChange={(e) => { setSearchStatus(e.target.value) }}>
                        <option value="">Estatus</option>
                        <option value="Activo">Activo</option>
                        <option value="Borrador">Borrador</option>
                        <option value="Todos">Todos</option>
                    </select>
                </div>

                <button className="btn btn-primary mr-3 col-lg-1" onClick={()=>{getProducts( user.aliadoId )}}><i className="material-icons">search</i></button>

                <Link to="/configuration/products/new-product" className="btn btn-primary mr-3">
                    Agregar nuevo producto<i className="material-icons ml-2">add</i>
                </Link>


                { ( url2.includes("localhost") || url2.includes("prioritypet-aliados") ) && 
                  <Link to="/configuration/products/update-excel" className="btn btn-primary mt-3 mr-3 mb-3">
                    Actualizar inventario
                  </Link>
                }

                

                <div className="mt-3 mb-3 row no-gutters">
                  <div onClick={()=>{ handleDownload() }} className="special-button cursor-pointer">
                    <img src="/images/icons/excel.png" alt="" />
                    <p className="mb-0">Descargar formato de excel</p>
                  </div>

                  <a ref={excelBtn} href="../docs/excel-formato.xlsx" download className="special-button d-none">
                  </a>
                  <a ref={pdfBtn} href="../docs/Carga de productos.pdf" download className="special-button d-none">
                  </a>
                  
                  <Link to="/configuration/products/upload-excel" className="special-button cursor-pointer">
                    <img src="/images/icons/upload.png" alt="" />
                    <p className="mb-0">Cargar archivo de excel</p>
                  </Link>


                </div>

                { selectedProducts.length > 0 && <div onClick={()=>{ deleteProducts() }} className="btn btn-danger">
                    Eliminar producto<i className="material-icons ml-2">delete</i>
                </div> }

            </div>
            
            <div className="position-relative">

                <div className="row-products-container-title">
                    <div className="row-products-container-img"></div>
                    <div className="row-products-container-img"></div>
                    <div className="row-products-container-body">
                        <p className="row-products-container-title-title">Nombre del producto</p>
                        <p className="row-products-container-title-cat">Categoría</p>
                        <p className="row-products-container-title-price">Precio</p>
                        <p className="row-products-container-title-stock">Cantidad</p>
                    </div>
                </div>
                
                { products.length > 0 ? products.map((prod) => {
                    let precioRounded = Math.round(prod.precio * 100) / 100
                    return(
                    <div className="row-products-container" key={prod.productoId}>
                      <div className="row-products-container-checkbox">
                          <input onClick={()=>{ selectedProducts.includes( prod ) ? 
                            setSelectedProducts(selectedProducts.filter((prv)=>( prv !== prod )))
                            : setSelectedProducts([...selectedProducts, prod]) }} 
                            type="checkbox" className="" />
                      </div>
                      <img src={prod.urlImagen} alt="" className="row-products-container-img" />
                      <div className="row-products-container-body" onClick={()=>{ 
                          history.push({
                            pathname: "/configuration/products/detail", 
                            state: { productoId: prod.productoId}
                          })
                        }}>
                        <p className="row-products-container-p-title">{prod.titulo}</p>
                        <p className="row-products-container-p-cat">{prod.categoria}</p>
                        <p className="row-products-container-p-price">{countryInfo.simbolo ?? " "}{precioRounded}</p>
                        <p className="row-products-container-p-stock">{prod.cantidad}</p>
                      </div>
                    </div>
                    )
                    }) : <div className="text-center"><p>No hay productos</p></div> 
                }
                
            </div>

          </div>
    )

    function deleteProducts(){
      selectedProducts.forEach(async(p)=>{
        await firebase.db.collection("Productos").doc(p.productoId).delete()
      })
      setSelectedProducts([])
      getProducts(user.aliadoId)
    }

}

export default NewProducts
