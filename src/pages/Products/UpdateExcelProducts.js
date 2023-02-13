import React, {useState, useEffect, useRef} from 'react'
import firebase from '../../firebase/config'
import {Link} from 'react-router-dom';
import moment from 'moment';
import * as XLSX from "xlsx";
import { createRef } from 'react';
import Compress from "react-image-file-resizer";

function UpdateExcelProducts() {

    const hiddenFileInput2 = useRef(null);
    const [loadingExcel, setLoadingExcel] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [successMsg, setSuccessMsg] = useState("");
    const [objetos, setObjects] = useState([])
    const [LPID, setLPID] = useState("")
    const [countryInfo, setCountryInfo] = useState({})

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
            setObjects(rowObject.filter((o1) => o1.sku !== undefined))
            
            setTimeout(() => {
              console.log("Lista preparada")
            }, 1000);

            
          })
        }
        fileReader.readAsBinaryString(selectedFile)
        setLoadingExcel(false)
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

    const LoadingComponent = () => {
      return (
          <div className="loading-alert">
              <div class="spinner-border text-primary mr-2" role="status">
                <span class="sr-only">Cargando...</span>
              </div>
              Actualizando productos, puedo tomar unos segundos
              <div onClick={()=>{setUploading(false)}} className="material-icons ml-2 cursor-pointer">close</div>
          </div>
      )
    }

    useEffect(() => {
        firebase.getCurrentUser().then((val)=>{
          setUser(val)
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
                    <p className="page-title bold"><Link className="color-white mr-1 light px-3" to="/configuration">Configuración</Link><Link className="color-white light" to="/configuration/products">Productos</Link> <span>Actualizar inventario</span></p>
                </div>
              </div>
              <div className="col-lg-1 col-sm-1 mb-0">
                <div className="row align-items-center justify-content-space-around">
                  <i className="material-icons color-white display-5">help_outline</i>
                </div>
              </div>
            </div>

              <div className="step-container active">
                <div className="container-excel-main"> 
                  <div>
                      <input ref={hiddenFileInput2} type="file" style={{display: 'none'}} onChange={handleUploadExcel} />
                      <p className="mb-3 color-primary">Rellena las celdas con los campos indicados para actualizar los productos que necesites mediante el excel</p>
                      <div className="excel-products-l">
                          <p className="mb-0 color-primary bold display-5">{objetos.length}</p>
                          <p className="mb-1 color-primary light">Productos por actualizar</p>
                      </div>
                  </div>
                    <div className="row no-gutters align-items-center justify-content-between mt-3">
                        <div>
                            <Link className="btn btn-disabled mr-4" to="/configuration/products">Volver</Link>
                            <a href="/docs/excel-actualizar-productos.xlsx" download className="btn btn-primary">Descargar formato de excel</a>
                        </div>
                      <div className="row no-gutters">
                        <div onClick={handleClick2} className="btn btn-primary">Subir excel</div>
                        { (loadingExcel && objetos.length > 0) && <div onClick={()=> {
                            updateProducts()
                        }}  className="ml-2 btn btn-success">Actualizar</div>}
                      </div>
                    </div> 
                  </div>
              </div>

          </div>
    )
  
    async function updateProducts(){
        setUploading(true)
        let time = 0
        await Promise.all(objetos.map(async (prod, i) => {

            try {
                await firebase.db.collection("Productos").where("sku", "==", prod.sku.toString()).where("aliadoId", "==", user.aliadoId).get().then((val)=>{
                    val.docs.forEach((doc)=>{

                        let d = doc.data()
                        console.log(d)
                        // Entrada, Actualización
                        firebase.db.collection("Productos").doc(d.productoId).update({
                            cantidad: prod.tipoOperacion === "Entrada" ? (parseInt(d.cantidad) + parseInt(prod.cantidad) ) : parseInt(prod.cantidad)
                        })

                    })

                })
                time++
            } catch(error) {
                alert(error)
            }

        }))

        setTimeout(() => {
          setSuccessMsg("Productos actualizados exitosamente")
          setUploading(false)
          setSuccess(true)
          setTimeout(() => {
            window.location.href = "/configuration/products"
          }, 1500);
        }, objetos.length * 1000);
      

    }
    

}

export default UpdateExcelProducts
