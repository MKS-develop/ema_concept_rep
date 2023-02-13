import React, {useEffect, useState, useRef} from 'react'
import firebase from '../../firebase/config'
import {Link} from 'react-router-dom';
import moment from 'moment';
// import ModalGuide from '../../components/ModalGuide';
import utils from '../../firebase/utils';
import Compress from "react-image-file-resizer";
import {useLocation} from 'react-router-dom';
import { debounce } from '../../utils/debounce';

function UploadProduct() {

    let variantsDefaultList = [
      "Color",
      "Tamaño",
      "Sabor"
    ]

    const [productsTypes, setProductsTypes] = useState([])
    const [palabrasClave, setPalabrasClave] = useState([])
    const [localidades, setLocalidades] = useState([])
    const [species, setSpecies] = useState([])
    const [razas, setRazas] = useState([])
    const [listErrors, setListErrors] = useState([])

    const [titleValue, setTitleValue] = useState("");
    const [successMsg, setSuccessMsg] = useState("");
    const [errorMsg, setErrorMsg] = useState("");
    const [palabra, setPalabra] = useState("")
    const [localidadId, setLocalidad] = useState("")
    const [itemTitulo, setItemTitulo] = useState("")
    const [btnMessage, setBtnMessage] = useState("Subir producto");
    
    const [soles, setSoles] = useState(0)
    const [itemPrecio, setItemPrecio] = useState(0)
    const [margin, setMargin] = useState(0)
    const [ganance, setGanance] = useState(0)
    
    const [countryInfo, setCountryInfo] = useState({})
    const [user, setUser] = useState({})

    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(false);
    const [finalClientStatus, setFinalClientStatus] = useState(true);
    const [aliadoClientStatus, setAliadoClientStatus] = useState(false);
    const [petPointsStatus, setPetPointsStatus] = useState(false);

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

    const [listaPrueba, setListaPrueba] = useState([])
    const [listObjects, setListObjects] = useState([])
    const [listTitle, setListTitle] = useState([])
    const [listCombinations, setListCombinations] = useState([])
    const [listMain, setListMain] = useState( [] )
    const [variantsDefaultListNew, setVariantsDefaultListNew] = useState([])

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

    const [prodInfo, setProdInfo] = useState({
        sku: "",
        status: "",
        titulo: "",
        peso: "",
        pesoUnidad: "",
        codigoBarras: "",
        marca: "",
        precio: "",
        precioComparacion: "",
        precioArticulo: "",
        existenciaMinima: "",
        descripcion: "",
        cantidad: "",
        dirigido: "Selección",
        continuarVendiendo: false,
        categoria: "",
        edad: "",
        tipoMascota: "Selección",
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

    const handleKeyPress = (event) => {
        if(event.key === 'Enter' && palabra !== ""){
            setPalabrasClave([...palabrasClave, palabra])
            inputTag.current.value = ""
        }
    }

    function createList(){
      let list = [...listMain]
      list.push([])
      setListMain(list)
      
      let listT = [...listTitle]
      listT.push(titleValue)
      setListTitle(listT)
      setTitleValue("")
    }
  
    function createListItem(i){
        let o = {
          text: itemTitulo,
          precio: itemPrecio,
          image: srcItem !== "" ? srcItem : ""
        }
  
        let list = [...listMain]
        list[i].push(o)
  
        setListMain(list)
        test(list)
        setImgItem("")
        setURLItem("")
        setFileItem(null)
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

    function changePriceCombo(i, val){
      let lista = [...listCombinations]
      lista[i].price = parseFloat(val)
      setListCombinations(lista)
    }
    
    function changeStockCombo(i, val){
      let lista = [...listCombinations]
      lista[i].stock = parseInt(val)
      setListCombinations(lista)
    }
      
    function changeSkuCombo(i, val){
      let lista = [...listCombinations]
      lista[i].sku = val
      setListCombinations(lista)
    }
    
    function deleteTagFromList(tag, iMain, iSub){
      let lista = [...listMain]
      let newLista = lista[iMain].filter((prv) => prv !== tag)
      lista[iMain] = newLista
      setListMain(lista);
      test(lista)
    }
      
    function test(listMainFromOther){
      new Promise((resolve) => setTimeout(()=>{
        combinationsFunction(listMainFromOther)
      }, 1000));
    }
  
      function deleteVariantFromList(ele, t){
        if(listMain.length !== 0){
          let newLista = listMain.filter((prev) => prev !== ele)
          setListMain(newLista)
          let newListaTitles = listTitle.filter((prev) => prev !== t)
          setListTitle(newListaTitles)
          test(newLista)
        }
      }
      

      const handleKeyPressTag = (event, i) => event.key === 'Enter' && createListItem(i)
      const handleKeyPressNewVariant = (event) => event.key === 'Enter' && createList()
    
      function createItem(iName, iPrice, i){
        let list = listObjects[i].items
        let object = {}
        object["name"] = iName
        object["price"] = iPrice
        
        list.push(object)
        
        listObjects[i].items = list
      }
      
      function deleteItem(object, i, itemList){
        listObjects[itemList].items.filter((itemPrev) => itemPrev !== object)
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

    function calculateMargin(precio, precioArticulo){
        let m = (parseInt(precioArticulo) / parseInt(precio )) * 100
        let g = parseInt(precio) - parseInt(precioArticulo)
        console.log(precio + " - " + precioArticulo)
        setMargin(parseInt(m))
        setGanance(parseInt(g))
    }

    function checkInputs(o){
        let val = 0
        let array = []
        o["img"] = src
        Object.keys(o).forEach(function(key) {
            if(key.toString() !== "continuarVendiendo"){
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
            setListErrors([])
            if(finalClientStatus) uploadProducto()
            if(aliadoClientStatus) uploadProductoToAliados()
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
          getValuePetPoint(val.pais)
          firebase.getCountryInfo(val.pais).then(async (val) => {
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

            <div style={{ ...navbarStyles, top: visible ? '-60px' : '60px' }}>
                <div className="row no-gutters align-items-center justify-content-spacebetween mb-4">
                    <h4 className="color-primary bold mb-0">Nuevo</h4>
                    <div className="row no-gutters">
                        {/* <div className="btn btn-secondary mx-3">Promocionar</div> */}
                        <div 
                        onClick={()=>{ checkInputs(prodInfo) }} 
                        className="btn btn-success">Crear producto</div>
                    </div>
                </div>
            </div>

            <div className="page-header align-items-center justify-content-spacebetween row no-gutters px-4 my-4">
                <div className="col-12 col-sm-5 text-center text-sm-left mb-0">
                    <div className="row align-items-center">
                        <div className="col">
                            <p className="page-title bold"><Link className="color-white mr-3 light" to="/configuration">Configuración</Link> <Link className="color-white light" to="/configuration/products">Productos</Link> <span>Nuevo</span> </p>
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
                            {/* <div className="btn btn-secondary mx-3">Promocionar</div> */}
                            <div 
                            onClick={()=>{ checkInputs(prodInfo) }} 
                            className="btn btn-success">Crear producto</div>
                        </div>
                    </div>

                    <div className="creation-card mb-3">
                        <div className="creation-card-title">Presentación</div>
                        <div className="creation-card-content">
                            
                            <div className="mr-4 creation-input-group mb-3 no-gutters">
                                <div className="col-lg-auto mr-2">
                                    <p className="creation-input-label">Presentación</p>
                                </div>
                                <div className="col-lg-auto mr-2">
                                    <input type="number" min="0" value={prodInfo.peso} onChange={(e)=>{setProdInfo({...prodInfo, peso: e.target.value}); setListErrors(listErrors.filter( prev => prev !== "peso" ) ) }} placeholder="0" className={`form-control col-lg-12 ${ listErrors.includes("peso") && "border-danger" } `}/>
                                </div>
                                <div className="col-lg-auto mr-2">
                                    <select value={prodInfo.pesoUnidad} onChange={(e)=>{setProdInfo({...prodInfo, pesoUnidad: e.target.value}); setListErrors(listErrors.filter( prev => prev !== "pesoUnidad" ) ) }} className={`form-control col-lg-12 ${ listErrors.includes("pesoUnidad") && "border-danger" } `}>
                                        <option value="">Medida</option>
                                        {valores.map((data, i) => (
                                            <option key={i} value={data}>{data}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="creation-errors-container">
                                    {(listErrors.includes("peso") || listErrors.includes("pesoUnidad")) && <p className="creation-errors-span"><i className="material-icons">highlight_off</i> { errorInputMsg } </p>}
                                </div>
                            </div>
                            
                            <div className="mr-4 creation-input-group mb-3 no-gutters">
                                <div className="col-lg-auto mr-2">
                                    <p className="creation-input-label">Estado del producto</p>
                                </div>
                                <div className="col-lg-auto mr-2">
                                    <select value={prodInfo.status} onChange={(e)=>{setProdInfo({...prodInfo, status: e.target.value}); setListErrors(listErrors.filter( prev => prev !== "status" ) )  }} 
                                    className={`form-control col-lg-12 ${ listErrors.includes("status") && "border-danger" } `}>
                                        <option value="">Selección</option>
                                        <option value="Activo">Activo</option>
                                        <option value="Borrador">Borrador</option>
                                    </select>
                                </div>
                                <div className="creation-errors-container">
                                    {listErrors.includes("status") && <p className="creation-errors-span"><i className="material-icons">highlight_off</i> { errorInputMsg } </p>}
                                </div>
                            </div>
                            
                            <div className="mr-4 creation-input-group mb-3 no-gutters">
                                <div className="col-lg-auto mr-2">
                                    <p className="creation-input-label">Marca del producto</p>
                                </div>
                                <div className="col-lg-auto mr-2">
                                    <input value={prodInfo.marca} onChange={(e)=>{setProdInfo({...prodInfo, marca: e.target.value}); setListErrors(listErrors.filter( prev => prev !== "marca" ) )  }} type="text" placeholder="Dog Chow" className={`form-control col-lg-12 ${ listErrors.includes("marca") && "border-danger" } `}/>
                                </div>
                                <div className="creation-errors-container">
                                    {listErrors.includes("marca") && <p className="creation-errors-span"><i className="material-icons">highlight_off</i> { errorInputMsg } </p>}
                                </div>
                            </div>

                            <div className="mr-4 creation-input-group mb-3 no-gutters">
                                <div className="col-lg-auto mr-2">
                                    <p className="creation-input-label">Código de barra</p>
                                </div>
                                <div className="col-lg-auto mr-2">
                                    <input value={prodInfo.codigoBarras} onChange={(e)=>{setProdInfo({...prodInfo, codigoBarras: e.target.value}); setListErrors(listErrors.filter( prev => prev !== "codigoBarras" ) )  }} type="text" placeholder="ISBN" className={`form-control col-lg-12 ${ listErrors.includes("codigoBarras") && "border-danger" } `}/>
                                </div>
                                <div className="creation-errors-container">
                                    {listErrors.includes("codigoBarras") && <p className="creation-errors-span"><i className="material-icons">highlight_off</i> { errorInputMsg } </p>}
                                </div>
                            </div>
                            
                            <div className="mr-4 creation-input-group-words">

                                <div className="creation-input-group no-gutters mr-2">
                                    <div className="col-lg-auto mr-2">
                                        <p className="creation-input-label">Etiquetas</p>
                                    </div>
                                    <div className="col-lg-auto mr-2">
                                        <input ref={inputTag} type="text" onKeyPress={handleKeyPress} onChange={e=>{setPalabra(e.target.value)}}  placeholder="Comida" className="form-control"/>
                                    </div>
                                </div>
                                {palabrasClave.map(p => (
                                    <p className="pill mb-0" key={p}>{p} <span className="cursor-pointer btn-delete" onClick={()=>{ setPalabrasClave(palabrasClave.filter((p1) => p1 !== p)); }} >X</span></p>
                                ))}

                            </div>



                        </div>
                    </div>

                    <div className="creation-card mb-3">
                        <div className="creation-card-title mb-2">Mercado</div>
                        <p className="creation-card-p">Indica a quien está dirigido el producto</p>
                        <div className="creation-card-content">
                            
                            <div className="mb-2 mr-4 creation-input-group no-gutters">
                                <div className="col-lg-auto mr-2 row no-gutters">
                                    <div className="col-lg-1 mr-2">
                                        <input type="checkbox" defaultChecked={finalClientStatus} value={finalClientStatus} onClick={()=>{ setFinalClientStatus(!finalClientStatus) }} />
                                    </div>
                                    <div className="col-lg-6">
                                        <p className="creation-input-label">Pacientes finales</p>
                                    </div>
                                </div>
                                <div className="col-lg-auto mr-2 row no-gutters">
                                    <div className="col-lg-1 mr-2">
                                        <input type="checkbox" defaultChecked={aliadoClientStatus} value={aliadoClientStatus} onClick={()=>{ setAliadoClientStatus(!aliadoClientStatus) }} />
                                    </div>
                                    <div className="col-lg-10">
                                        <p className="creation-input-label">Aliados (Tiendas, Clínicas, etc.)</p>
                                    </div>
                                </div>
                            </div>

                            {/* <div className="mb-2 mr-4 creation-input-group no-gutters">
                                <div className="col-lg-auto mr-2">
                                    <p className="creation-input-label">Edad</p>
                                </div>
                                <div className="col-lg-auto mr-2">
                                    <select value={prodInfo.edad} onChange={(e)=>{setProdInfo({...prodInfo, edad: e.target.value}); setListErrors(listErrors.filter( prev => prev !== "edad" ) )  }} className={`form-control col-lg-12 ${ listErrors.includes("edad") && "border-danger" } `}>
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
                                <select value={prodInfo.size} onChange={(e)=>{setProdInfo({...prodInfo, size: e.target.value}) }} className={`form-control col-lg-12`}>
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
                                    <select value={prodInfo.tipoMascota} onChange={(e)=>{setProdInfo({...prodInfo, tipoMascota: e.target.value}); getRazas(e.target.value); setListErrors(listErrors.filter( prev => prev !== "tipoMascota" ) )    }} className={`form-control col-lg-12 ${ listErrors.includes("tipoMascota") && "border-danger" } `}>
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
                                    <select value={prodInfo.dirigido} onChange={(e)=>{setProdInfo({...prodInfo, dirigido: e.target.value})}} className={`form-control col-lg-12`}>
                                        <option value="">Selección</option>
                                        {razas.map((data, i) => (
                                            <option key={i} value={data}>{data}</option>
                                        ))}
                                        <option value="Todos">Todos</option>
                                    </select>
                                </div>
                            </div> } */}
                            
                        </div>
                    </div>
                    
                    <div className="creation-card mb-3">
                        <div className="creation-card-title">Inventario</div>
                        <div className="creation-card-content">

                            <div className="mr-4 creation-input-group no-gutters">
                                <div className="col-lg-auto mr-2">
                                    <p className="creation-input-label">Cantidad actual</p>
                                </div>
                                <div className="col-lg-auto mr-2">
                                    <input value={prodInfo.cantidad} onChange={(e)=>{setProdInfo({...prodInfo, cantidad: e.target.value}); setListErrors(listErrors.filter( prev => prev !== "cantidad" ) )  }} type="number" min="0" placeholder="0" className={`form-control col-lg-12 ${ listErrors.includes("cantidad") && "border-danger" } `}/>
                                </div>
                                <div className="creation-errors-container">
                                    {listErrors.includes("cantidad") && <p className="creation-errors-span"><i className="material-icons">highlight_off</i> { errorInputMsg } </p>}
                                </div>
                            </div>

                            <div className="mr-4 creation-input-group no-gutters">
                                <div className="col-lg-auto mr-2">
                                    <p className="creation-input-label">Cantidad minima de reorden</p>
                                </div>
                                <div className="col-lg-auto mr-2">
                                    <input value={prodInfo.existenciaMinima} onChange={(e)=>{setProdInfo({...prodInfo, existenciaMinima: e.target.value}); setListErrors(listErrors.filter( prev => prev !== "existenciaMinima" ) )  }} type="number" min="0" placeholder="0" className={`form-control col-lg-12 ${ listErrors.includes("existenciaMinima") && "border-danger" } `}/>
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

                            { finalClientStatus && <div className="mr-4 creation-input-group no-gutters">
                                <div className="col-lg-auto mr-2">
                                    <p className="creation-input-label">Precio</p>
                                </div>
                                <div className="col-lg-auto mr-2">
                                    <input type="number" min="0" value={prodInfo.precio} onChange={(e)=>{setProdInfo({...prodInfo, precio: e.target.value}); setListErrors(listErrors.filter( prev => prev !== "precio" ) ); calculateMargin(e.target.value, prodInfo.precioArticulo)  }} placeholder="0" className={`form-control col-lg-12 ${ listErrors.includes("precio") && "border-danger" } `}/>
                                </div>
                                <div className="creation-errors-container">
                                    {(listErrors.includes("precio") && finalClientStatus) && <p className="creation-errors-span"><i className="material-icons">highlight_off</i> { errorInputMsg } </p>}
                                </div>
                            </div> }
                            { aliadoClientStatus && <div className="mr-4 creation-input-group no-gutters">
                                <div className="col-lg-auto mr-2">
                                    <p className="creation-input-label">Precio aliado</p>
                                </div>
                                <div className="col-lg-auto mr-2">
                                    <input type="number" min="0" value={prodInfo.precioAliado} onChange={(e)=>{setProdInfo({...prodInfo, precioAliado: e.target.value})}} placeholder="0" className="form-control"/>
                                </div>
                                <div className="creation-errors-container">
                                    {(listErrors.includes("precioAliado") && aliadoClientStatus) && <p className="creation-errors-span"><i className="material-icons">highlight_off</i> { errorInputMsg } </p>}
                                </div>
                            </div> }

                            <div className={`mr-4 creation-input-group no-gutters`}>
                                <div className="col-lg-auto mr-2">
                                    <p className="creation-input-label">Costo por artículo</p>
                                </div>
                                <div className="col-lg-auto mr-2">
                                    <input type="number" min="0"  value={prodInfo.precioArticulo} onChange={(e)=>{setProdInfo({...prodInfo, precioArticulo: e.target.value}); calculateMargin(prodInfo.precio, e.target.value) }} placeholder="0" className="form-control"/>
                                </div>
                            </div>

                            {/* <div className={`creation-input-group no-gutters`} no-gutters style={{width: "25%"}}>
                                <div className="col-lg-1">
                                    <input type="checkbox" defaultChecked={petPointsStatus} value={petPointsStatus} onClick={()=>{ setPetPointsStatus(!petPointsStatus) }} />
                                </div>
                                <div className="col-lg-9">
                                    <p className="creation-input-label">Acepta pagos en Pet Points</p>
                                </div>
                            </div> */}

                            <div className={`mr-4 creation-input-group no-gutters ${aliadoClientStatus || finalClientStatus && "mt-4" }`}>
                                <div className="col-lg-auto mr-2">
                                    <p className="creation-input-label">Precio comparación</p>
                                </div>
                                <div className="col-lg-auto mr-2">
                                    <input type="number" min="0" value={prodInfo.precioComparacion} onChange={(e)=>{setProdInfo({...prodInfo, precioComparacion: e.target.value})}} placeholder="0" className="form-control"/>
                                </div>
                            </div>
                        
                            <div className={`mr-4 row no-gutters col-lg-4 ${aliadoClientStatus || finalClientStatus && "mt-4" }`}>
                                <div className="col-lg-auto mr-2">
                                    <p className="color-primary mb-1 ligth">Margen</p>
                                    <p style={{fontSize: "13px", color: "#a3a6af"}} className="color-primary mb-1 ligth">{margin.toString() !== "NaN" ? margin : 0}%</p>
                                </div>
                                <div className="col-lg-auto mr-2">
                                    <p className="color-primary mb-1 ligth">Ganancia</p>
                                    <p style={{fontSize: "13px", color: "#a3a6af"}} className="color-primary mb-1 ligth">{ganance.toString() !== "NaN" ? ganance : 0}</p>
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

                            {listMain.map((ele, i)=>{
                                return(
                                <div className="fadeIn mb-3">
                                    
                                    <div className="row no-gutters mb-2 align-items-center">
                                        <p className="creation-input-label mr-4">{listTitle[i]}</p>
                                        <div className="row no-gutters mb-2 align-items-center justify-content-spacebetween">
                                          <div className="col-lg-9 row no-gutters align-items-center">
                                            <input onChange={(e)=>{ setItemTitulo(e.target.value) }} className="form-control col-lg-4 mr-2" placeholder="Azul" type="text" 
                                            // onKeyPress={(event)=>{ handleKeyPressTag(event, i) }} 
                                            />

                                            <div className="col-lg-3 mr-2">
                                              <div className="input-group">
                                                <div className="input-group-prepend">
                                                  <span className="input-group-text">$</span>
                                                </div>
                                                <input onChange={(e)=>{ setItemPrecio(e.target.value) }} type="number" min="0" className="form-control" placeholder="0.0" />
                                              </div>
                                            </div>

                                            <input type="file" ref={hiddenFileInputItem} onChange={handleChangeItemImg}  style={{display: 'none'}} />
                                            <div onClick={handleClickItemImg} className="btn btn-outline-primary">Cargar imagen</div>

                                          </div>

                                          <div onClick={()=>{ itemTitulo !== "" && createListItem(i)  }} className="btn btn-primary col-lg-2">Nuevo item</div>

                                          {listMain.length > 1 && 
                                          <div onClick={()=>{ deleteVariantFromList(ele)  }} className="btn btn-danger col-lg-1">X</div>
                                          }
                                        </div>
                                    </div>

                                    <div className="row no-gutters">
                                      {ele.map((tag, iTag)=>{
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

                        {listCombinations.length > 0 && <p className="mt-3 mb-4 creation-card-title">Combinaciones</p>}

                        <div style={{width: "100%"}}>

                        {listCombinations.map((com, i)=>{
                            return(
                            <div className="fadeIn row no-gutters align-items-center justify-content-spacebetween mb-3">
                                <div onClick={()=>{ setListCombinations(listCombinations.filter((comPrev) => comPrev !== com)); }} className="btn btn-danger">X</div>
                                <p className="mb-0" key={i}>{com.combo}</p>
                                
                                <div className="col-lg-2">
                                    <div className="input-group">
                                        <div className="input-group-prepend">
                                        <span className="input-group-text">$</span>
                                        </div>
                                        <input type="number" min="0" className="form-control" defaultValue={com.price} onChange={(e)=>{ changePriceCombo(i, e.target.value) }} placeholder="0.0" />
                                    </div>
                                </div>
                                
                                <input type="number" min="0" className="form-control col-lg-2" defaultValue={com.stock} onChange={(e)=>{ changeStockCombo(i, e.target.value) }} placeholder="Cantidad" />
                                <input type="text" className="form-control col-lg-2" defaultValue={com.sku} onChange={(e)=>{ changeSkuCombo(i, e.target.value) }} placeholder="SKU" />
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
                                {src !== "" ? <img src={src} alt="" /> : <div className={`creation-input-photo-inside`}><p className="material-icons icon mb-0">image</p></div>}
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
                                    <input value={prodInfo.titulo} onChange={(e)=>{setProdInfo({...prodInfo, titulo: e.target.value}); setListErrors(listErrors.filter( prev => prev !== "titulo" ) )  }} placeholder="Título del producto" className={`form-control col-lg-12 ${ listErrors.includes("titulo") && "border-danger" } `}/>
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
                                    <input value={prodInfo.sku} onChange={(e)=>{setProdInfo({...prodInfo, sku: e.target.value}); setListErrors(listErrors.filter( prev => prev !== "sku" ) )  }} placeholder="ABC123" className={`form-control col-lg-12 ${ listErrors.includes("sku") && "border-danger" } `}/>
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
                                    <select value={prodInfo.categoria} onChange={(e)=>{setProdInfo({...prodInfo, categoria: e.target.value}); setListErrors(listErrors.filter( prev => prev !== "categoria" ) )  }} className={`form-control col-lg-12 ${ listErrors.includes("categoria") && "border-danger" } `}>
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
                                    <textarea value={prodInfo.descripcion} onChange={(e)=>{setProdInfo({...prodInfo, descripcion: e.target.value}); setListErrors(listErrors.filter( prev => prev !== "descripcion" ) )  }} placeholder="Descripción del producto" className={`form-control col-lg-12 ${ listErrors.includes("descripcion") && "border-danger" } `}/>
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

    async function uploadProductoToAliados() {

        let pInPP = parseFloat(prodInfo.precio) * soles

        setBtnMessage("Subiendo...")
            let id = firebase.db.collection("CanjeContenido").doc().id;
            try {
                await firebase.storage.ref(`/Productos imagenes/${file.name}`).put(file)
                await firebase.storage.ref("Productos imagenes").child(file.name).getDownloadURL().then((url) => {
                    firebase.db.collection("CanjeContenido").doc(id).set({
                        aliadoId: user.aliadoId,
                        isApproved: false,
                        status: prodInfo.status,
                        productoId: id,
                        urlImagen: url,
                        tipoContenido: "Producto",
                        localidadId: localidadId,
                        pais: user.pais,
                        presentacion: prodInfo.peso + " " + prodInfo.pesoUnidad,
                        titulo: prodInfo.titulo,
                        descripcion: prodInfo.descripcion,
                        precioAliado: pInPP,
                        precioComparacion: parseFloat(prodInfo.precioComparacion),
                        peso: prodInfo.peso + " " + prodInfo.pesoUnidad,
                        pesoUnidad: prodInfo.pesoUnidad,
                        pesoValor: prodInfo.peso,
                        marca: prodInfo.marca,
                        codigoBarras: prodInfo.codigoBarras,
                        delivery: null,
                        sku: prodInfo.sku,
                        existenciaMinima: prodInfo.existenciaMinima,
                        continuarVendiendo: prodInfo.continuarVendiendo,
                        palabrasClave: palabrasClave,
                        cantidad: parseInt(prodInfo.cantidad),
                        createdOn: moment().toDate(),
                    })
                })

                setSuccess(true)
                setSuccessMsg("Producto cargado exitosamente")
                setTimeout(() => {
                    setSuccess(false)
                    window.location.href = "/configuration/products"
                }, 4000);
                setBtnMessage("Subir producto")
                window.scrollTo(0, 0)
            } catch (error) {
                alert("Ha ocurrido un error: ", error)
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

    async function uploadProducto() {

        let listaVariantes = createFullVariantsList()
        setBtnMessage("Subiendo...")
        let id = firebase.db.collection("Productos").doc().id;
        try {
            await firebase.storage.ref(`/Productos imagenes/${file.name}`).put(file)
            await firebase.storage.ref("Productos imagenes").child(file.name).getDownloadURL().then((url) => {
                firebase.db.collection("Productos").doc(id).set({
                    aliadoId: user.aliadoId,
                    isApproved: false,
                    status: prodInfo.status,
                    productoId: id,
                    urlImagen: url,
                    localidadId: localidadId,
                    pais: user.pais,
                    presentacion: prodInfo.peso + " " + prodInfo.pesoUnidad,
                    titulo: prodInfo.titulo,
                    edad: prodInfo.edad,
                    descripcion: prodInfo.descripcion,
                    precio: parseFloat(prodInfo.precio),
                    precioAliado: parseFloat(prodInfo.precioAliado),
                    precioComparacion: parseFloat(prodInfo.precioComparacion),
                    peso: prodInfo.peso + " " + prodInfo.pesoUnidad,
                    pesoUnidad: prodInfo.pesoUnidad,
                    pesoValor: prodInfo.peso,
                    marca: prodInfo.marca,
                    codigoBarras: prodInfo.codigoBarras,
                    tipoMascota: prodInfo.tipoMascota,
                    delivery: null,
                    variantes: listaVariantes,
                    sku: prodInfo.sku,
                    existenciaMinima: prodInfo.existenciaMinima,
                    continuarVendiendo: prodInfo.continuarVendiendo,
                    dirigido: prodInfo.dirigido,
                    palabrasClave: palabrasClave,
                    cantidad: parseInt(prodInfo.cantidad),
                    categoria: prodInfo.categoria,
                    createdOn: moment().toDate(),
                })
            })

            // resetAllInputs()

            setSuccess(true)
            setSuccessMsg("Producto cargado exitosamente")
            setTimeout(() => {
                setSuccess(false)
                window.location.href = "/configuration/products"
            }, 1000);
            setBtnMessage("Subir producto")
            window.scrollTo(0, 0)
        } catch (error) {
            alert("Ha ocurrido un error: ", error)
        }
    }

}

export default UploadProduct
