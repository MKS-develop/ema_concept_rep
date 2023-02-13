import React, {useState, useEffect, useRef} from 'react'
import firebase from '../../firebase/config'
import {Link} from 'react-router-dom';
import moment from 'moment';
import * as XLSX from "xlsx";
import { createRef } from 'react';
import Compress from "react-image-file-resizer";

function UploadExcelProducts() {

    const hiddenFileInput2 = useRef(null);
    const [loadingExcel, setLoadingExcel] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [successMsg, setSuccessMsg] = useState("");
    const [objetos, setObjects] = useState([])
    const [LPID, setLPID] = useState("")
    const [activeList, setActiveList] = useState([])
    const [countryInfo, setCountryInfo] = useState({})
    
    const [error, setError] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    
    let [steps, setSteps] = useState([
      false,
    ])

    let maxProdNumber = 100

    const [user, setUser] = useState({})

    const [file, setFile] = useState(null);
    const [src, setImg] = useState('');
    const url2 = window.location.href;
    
    const handleClick2 = event => {
      hiddenFileInput2.current.click();
    };

    const handleClick3 = (i) => {
      document.getElementById(i.toString()).click()
    };

    function handleChange2(e, i) {
      let object = objetos[i]
      var file = e.target.files[0]
      object["img"] = URL.createObjectURL(e.target.files[0])
      Compress.imageFileResizer(
        file,
        300,
        600,
        "JPEG",
        10,
        0,
        (uri) => {
          object["file"] = uri
        },
        "file",
        600,
        300
      )

      setObjects([...objetos, object])
      setObjects(Array.from(new Set(objetos)))

    }

    const changeActive = (status, i) =>{
      let newArr = [...activeList];
      newArr[i] = status;
      setActiveList(newArr);
    }

    let categoriaList = [
      "Accesorios",
      "Alimento",
      "Farmacia",
      "Juguetes",
      "Tiendas"
    ]
    
    let pesoUnidadList = [
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
      "Onzas"
    ]
    
    let edadList = [
      "Sénior", 
      "Adulto", 
      "Cachorro"
    ]

    function capitalize(text) {
      return text.replace(/\b\w/g , function(m){ return m.toUpperCase(); } );
    }

    function handleUploadExcel(e) {
      var selectedFile = e.target.files[0]
      if(selectedFile){
        var fileReader = new FileReader()
        
        fileReader.onload = function(e){
          setLoadingExcel(true)
          console.log("FileReader listo")
          var data = e.target.result
          var workhook = XLSX.read(data, {
            type: "binary"
          })
  
          workhook.SheetNames.forEach((sheet)=>{
            let rowObject = XLSX.utils.sheet_to_json( workhook.Sheets[sheet], {
              defval: undefined
            } )
            // let jsonObject = JSON.stringify(rowObject)
            // console.log(jsonObject)
            // setObjects(rowObject)
            setObjects(rowObject.filter((o1) => o1["nombreProducto*"] !== undefined))
            
            setTimeout(() => {
              console.log("Lista preparada")
              for(let i = 0; i < objetos.length; i++){
                let a = false
                activeList.push(a)
  
                let object = objetos[i]
  
                if( categoriaList.includes(object.categoria) && edadList.includes(object.edad) && pesoUnidadList.includes(object.pesoUnidad) ){
                  setError(false)
                  setErrorMsg("")
                }else{
                  // let cate2 = object.categoria ? capitalize(object.categoria) : "nada"
                  setError(true)
                  setErrorMsg("Tu excel contiene valores que no corresponden a las listas predefinidas")
                  console.log(object.categoria + " - " + object.edad + " - " + object.pesoUnidad)
                }
  
              }
            }, 1000);

            
          })
        }
        fileReader.readAsBinaryString(selectedFile)
        setLoadingExcel(false)
      }

    }

    const deleteObject = (o) => {
      setObjects(objetos.filter((o1) => o1 !== o))
    }

    function changeActiveStep(status, i){
      let newArr = [...steps];
      newArr[i] = !status;
      setSteps(newArr);
    }

    const getLPID = async(id) =>{
      await firebase.db.collection("Localidades").where("lc", "==", "Localidad Principal")
      .where("aliadoId", "==", id).get().then(val=>{
        val.docs.forEach(item=>{
          setLPID(item.data().localidadId)
        })
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

    const LoadingComponent = () => {
      return (
          <div className="loading-alert">
              <div class="spinner-border text-primary mr-2" role="status">
                <span class="sr-only">Cargando...</span>
              </div>
              Subiendo productos, puedo tomar unos segundos
              <div onClick={()=>{setUploading(false)}} className="material-icons ml-2 cursor-pointer">close</div>
          </div>
      )
    }

    useEffect(() => {
        firebase.getCurrentUser().then((val)=>{
          setUser(val)
          getLPID(val.aliadoId)
          firebase.getCountryInfo(val.pais).then((val)=>{
            setCountryInfo(val.data())
          })
        });
    }, [])

    return (
        <div className="main-content-container container-fluid px-4">
          {uploading && <LoadingComponent/>}
          {success && <SuccessComponent msg={successMsg === "" ? "Productos cargado exitosamente" : successMsg}/>}
            <div className="page-header align-items-center justify-content-spacebetween row no-gutters px-4 my-4">
              <div className="col-lg-10 col-sm-5 text-center text-sm-left mb-0">
                <div className="row align-items-center">
                    <p className="page-title bold"><Link className="color-white mr-1 light px-3" to="/configuration">Configuración</Link><Link className="color-white light" to="/configuration/products">Productos</Link> <span>Cargar archivo de excel</span></p>
                </div>
              </div>
              <div className="col-lg-1 col-sm-1 mb-0">
                <div className="row align-items-center justify-content-space-around">
                  <i className="material-icons color-white display-5">help_outline</i>
                </div>
              </div>
            </div>

              <div className="step-container active">
                <div className="step-container-header">
                  <div className="step-number">1</div>
                  <p className="step-text">Carga el excel con los productos que desear subir a la plataforma</p>
                </div>
                <div className="container-excel-main"> 
                  <div>
                      <input ref={hiddenFileInput2} type="file" style={{display: 'none'}} onChange={handleUploadExcel} />
                      <p className="mb-3 color-primary">Recuerda utilizar los valores predefinidos de las listas que existen en la plataforma (Ver PDF para los valores necesarios)</p>
                      <div className="excel-products-l">
                          <p className="mb-0 color-primary bold display-5">{objetos.length} </p>
                          <p className="mb-1 color-primary light">Productos cargados</p>
                      </div>
                      {objetos.length > maxProdNumber && <p className="mt-3 color-danger">Tienes un maximo de {maxProdNumber} productos para poder subir a la plataforma</p> }
                      {error && <p className="mt-3 color-danger">{errorMsg}</p> }
                  </div>
                    <div className="row no-gutters align-items-center justify-content-between mt-3">
                      <Link className="btn btn-disabled" to="/configuration/products">Volver</Link>
                      <div className="row no-gutters">
                        <div onClick={handleClick2} className="btn btn-primary">Subir excel</div>
                        { (loadingExcel && objetos.length > 0 && objetos.length < maxProdNumber && errorMsg === "") && <div onClick={()=> { changeActiveStep(steps[0], 0) }}  className="ml-2 btn btn-success">Continuar</div>}
                      </div>
                    </div> 
                  </div>
              </div>
              
              <div className={`step-container ${steps[0] ? "active" : ""}`}>
                <div className="step-container-header">
                  <div className="step-number">2</div>
                  <p className="step-text">Para completar el proceso debes cargar las imagenes de los productos</p>
                </div>
                
                <div className="row no-gutters align-items-center products-excel-container">
                  {objetos.map((p, i)=>{
                    return (
                      <>
                        <div className={`product-excel-preview ${ (p.nombreProducto === undefined && p.pais === undefined) && "d-none" }`} key={i}>
                          <div onClick={()=>{deleteObject(p); changeActive(  !activeList[i], i )}} className={`delete-box ${activeList[i] && "active"}`}>
                            <p className="delete-box-p">Eliminar<span className="material-icons">delete</span></p>
                          </div>
                          <div className="product-excel-preview-body">
                            <div onClick={()=>{handleClick3(i)}} className="product-excel-preview-img">
                              {p.urlImage !== undefined && <img src={p.urlImage} alt="" />}
                              {p.img !== undefined && p.urlImage === undefined ? <img src={p.img} alt="" /> : <p className="product-excel-preview-p">
                              <span className="material-icons">add_photo_alternate</span></p>}
                            </div>
                            <p className="mb-1 material-icons more-btn" onClick={()=>{ changeActive(  !activeList[i], i ) }} >more_vert</p>
                            <input style={{display: 'none'}} id={i} type="file" onChange={(e)=>{handleChange2(e, i)}}/>
                            <p className="mb-1">{p["nombreProducto*"]}</p>
                            <p className="product-excel-preview-price">{countryInfo.simbolo ?? " "}{p["precio*"]}</p>
                            <p className="product-excel-preview-desc">{p.descripcion}</p>
                          </div>
                        </div>
                      </>
                    )
                  })}
                </div>
                  
                <div className="row no-gutters align-items-center justify-content-between">
                  <p className="mb-0 color-primary"></p>
                  <div className="row no-gutters">
                    
                    <div className="btn btn-disabled" onClick={()=>{
                      setSuccess(false); setObjects([])
                    }} >Volver</div>

                    <div className="btn btn-primary ml-2" onClick={()=>{
                      uploadProducts()
                    }} >Continuar</div>

                  </div>
                </div>
              </div>


          </div>
    )
  
  async function uploadProducts(){
    setUploading(true)
    let time = 0
    await Promise.all(objetos.map(async (prod, i) => {
      try {
        let id = firebase.db.collection("Productos").doc().id;
        if(prod["nombreProducto*"] !== undefined && prod.pais !== undefined){

          if(prod.urlImage !== undefined){
            
            firebase.db.collection("Productos").doc(id).set({
              aliadoId: user.aliadoId,
              isApproved: false,
              urlImagen: prod.urlImage,
              productoId: id,
              localidadId: LPID,
              pais: prod.pais !== undefined ? prod.pais.toString() : "",
              presentacion: ( prod.pesoValor !== undefined ? prod.pesoValor.toString() : "" ) + " " + ( prod.pesoUnidad !== undefined ? prod.pesoUnidad.toString() : "" ),
              titulo: prod["nombreProducto*"] !== undefined ? prod["nombreProducto*"].toString() : "",
              categoria: prod.categoria !== undefined ? prod.categoria.toString() : "",
              marcaProducto: prod.marcaProducto !== undefined ? prod.marcaProducto.toString() : "",
              descripcion: prod.descripcion !== undefined ? prod.descripcion.toString() : "",
              precio: parseFloat(prod["precio*"]),
              peso: ( prod.pesoValor !== undefined ? prod.pesoValor.toString() : "" ) + " " + ( prod.pesoUnidad !== undefined ? prod.pesoUnidad.toString() : "" ),
              pesoUnidad: prod.pesoUnidad !== undefined ? prod.pesoUnidad.toString() : "",
              pesoValor: prod.pesoValor !== undefined ? prod.pesoValor.toString() : "",
              tipoMascota: prod.tipoMascota !== undefined ? prod.tipoMascota.toString() : "",
              delivery: null,
              sku: prod["sku*"] !== undefined ? prod["sku*"].toString() : "",
              existenciaMinima: prod.existenciaMinima !== undefined ? prod.existenciaMinima : 0,
              continuarVendiendo: false,
              dirigido: prod.edad !== undefined ? prod.edad.toString() : "",
              palabrasClave: [],
              cantidad: prod["stock*"] !== undefined ? parseInt(prod["stock*"]) : 10,
              createdOn: moment().toDate(),
            })

          }else{
            await firebase.storage.ref(`/Productos imagenes/${id}`).put(prod.file)
            await firebase.storage.ref("Productos imagenes").child(id).getDownloadURL().then((url) => {
              firebase.db.collection("Productos").doc(id).set({
                aliadoId: user.aliadoId,
                isApproved: false,
                productoId: id,
                urlImagen: url,
                localidadId: LPID,
                pais: prod.pais !== undefined ? prod.pais.toString() : "",
                presentacion: ( prod.pesoValor !== undefined ? prod.pesoValor.toString() : "" ) + " " + ( prod.pesoUnidad !== undefined ? prod.pesoUnidad.toString() : "" ),
                titulo: prod["nombreProducto*"] !== undefined ? prod["nombreProducto*"].toString() : "",
                categoria: prod.categoria !== undefined ? prod.categoria.toString() : "",
                marcaProducto: prod.marcaProducto !== undefined ? prod.marcaProducto.toString() : "",
                descripcion: prod.descripcion !== undefined ? prod.descripcion.toString() : "",
                precio: parseFloat(prod["precio*"]),
                peso: ( prod.pesoValor !== undefined ? prod.pesoValor.toString() : "" ) + " " + ( prod.pesoUnidad !== undefined ? prod.pesoUnidad.toString() : "" ),
                pesoUnidad: prod.pesoUnidad !== undefined ? prod.pesoUnidad.toString() : "",
                pesoValor: prod.pesoValor !== undefined ? prod.pesoValor.toString() : "",
                tipoMascota: prod.tipoMascota !== undefined ? prod.tipoMascota.toString() : "",
                delivery: null,
                sku: prod["sku*"] !== undefined ? prod["sku*"].toString() : "",
                existenciaMinima: prod.existenciaMinima !== undefined ? prod.existenciaMinima : 0,
                continuarVendiendo: false,
                dirigido: prod.edad !== undefined ? prod.edad.toString() : "",
                palabrasClave: [],
                cantidad: prod["stock*"] !== undefined ? parseInt(prod["stock*"]) : 10,
                createdOn: moment().toDate(),
              })
            })
          }
          
        }
        time++
        
        // getProducts(user.aliadoId)
        // setProduct({})
        // setTimeout(() => {
        //   setSuccess(false)
        // }, 4000);
        // setBtnMessage("Subir producto")
        // window.scrollTo(0, 0)

        } catch(error) {
          alert(error)
        }
      }))

      // await Promise(resolve => setTimeout(resolve, 1000));
      
      setTimeout(() => {
        setSuccessMsg("Productos cargados exitosamente")
        setUploading(false)
        setSuccess(true)
        setTimeout(() => {
          window.location.href = "/configuration/products"
        }, 1000);
      }, objetos.length * 1000);
      

  }
    

}

export default UploadExcelProducts
