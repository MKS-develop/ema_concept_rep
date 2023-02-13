import React, {useState, useEffect} from 'react'
import firebase from '../../firebase/config'
import {Link, useHistory} from 'react-router-dom';
import moment from 'moment';

function Localitys() {
    let history = useHistory()
    const [update, setUpdate] = useState(false);
    const hiddenFileInput = React.useRef(null);
    const [btnMessage, setBtnMessage] = useState("Crear localidad");
    const [localitys, setLocalitys] = useState([])
    const [user, setUser] = useState({})
    const [cities, setCities] = useState([])
    const [locality, setLocality] = useState({})
    const [localityInfo, setLocalityInfo] = useState({
      nombreLocalidad: "",
      direccionLocalidad: "",
      direccionDetallada: "",
      ciudad: "",
      telefono: "",
      otroTelefono: "",
    })
    
    const [localityUpdateInfo, setLocalityUpdateInfo] = useState({
      nombreLocalidad: null,
      direccionLocalidad: null,
      direccionDetallada: null,
      ciudad: null,
      telefono: null,
      otroTelefono: null,
    })

    const [error, setError] = useState(false) 
    const [emessage, setEmessage] = useState("")
    const [success, setSuccess] = useState(false);
    const [successMsg, setSuccessMsg] = useState("");
    const [deleteModal, setDeleteModal] = useState(false);

    const [file, setFile] = useState(null);
    const [url, setURL] = useState("");
    const [src, setImg] = useState('');
  
    const handleClick = event => {
      hiddenFileInput.current.click();
    };

    function handleChange(e) {
      setImg(URL.createObjectURL(e.target.files[0]));    
      setFile(e.target.files[0]);
    }

    const getLocalitys = async(id) =>{
      let tipos = [];
      await firebase.db.collection('Localidades').where("aliadoId", "==", id)
      .get().then(val => {
        val.docs.forEach(item=>{
          tipos.push(item.data())
        })
        setLocalitys(tipos)
      })
    }

    const getCityes = async(pais) =>{
      let tipos = [];
      await firebase.db.collection('Ciudades').doc(pais)
      .get().then(val => {
        setCities(val.data().ciudades)
      })
    }

    function checkInputs(object){
      let val = 0
      let array = []
      object["file"] = file
      Object.keys(object).forEach(function(key) {
        if (object[key] === '' || object[key] === null) {
          val++
          array.push(key)
        }
      });
      if(val > 0){
        setError(true)
        setEmessage("Todos los campos son requeridos")
        setTimeout(() => {
          setError(false)
        }, 4000);
        setBtnMessage("Crear localidad")
      }else{
        uploadLocality()
        // alert("Todos los inputs estan llenos")
      }
      return val > 0 ? true : false
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
        firebase.getCurrentUser().then((val)=>{
          setUser(val)
          getLocalitys(val.masterId)
          getCityes(val.pais)
        })
    }, [])

    return (
        <div className="main-content-container container-fluid px-4">
            {error && <ErrorComponent msg={emessage === "" ? "Todos los campos son requeridos" : emessage}/>}
            {success && <SuccessComponent msg={successMsg === "" ? "Localidad actualizada exitosamente" : successMsg}/>}
            { deleteModal && <div className="cc-modal-wrapper fadeIn">
              <div className="c2-modal">
                  <div className="cc-modal-header">
                      <span className="mb-0 material-icons" style={{color: "var(--danger)", fontSize: "69px"}}>cancel</span>
                  </div>
                  <div className="c2-modal-body">
                     <p className="mb-0">
                         ¿Desea eliminar esta localidad?
                     </p>
                  </div>
                  <div className="cc-modal-footer align-items-center justify-content-spacebetween">
                    <button onClick={()=>{setDeleteModal(false)}} className="mr-2 btn btn-outline-secondary">
                      No
                    </button>
                    <button onClick={()=>{ deleteLocality() }} className="ml-2 btn btn-danger">Eliminar</button>
                  </div>
              </div>
            </div>}
            <div className="page-header align-items-center justify-content-spacebetween row no-gutters px-4 my-4">
              <div className="col-12 col-sm-5 text-center text-sm-left mb-0">
                <div className="row align-items-center">
                  <div className="ml-2 col row">
                    <p className="page-title bold"><Link className="page-title light" to="/configuration">Configuración</Link> <span>Localidades</span></p>
                  </div>
                </div>
              </div>
              <div className="col-12 col-sm-1 mb-0">
                <div className="row align-items-center justify-content-space-around">
                  <i className="material-icons color-white display-5">help_outline</i>
                </div>
              </div>
            </div>

            <div className="row">
                <div className="col-lg-7 col-md-7 col-sm-12">
                    <div className="row">
                      {
                        localitys.length > 0 ? localitys.map(locality=>{
                          return(
                            <div className="col-md-6 col-sm-12">
                              <div onClick={() => setLocality(locality)} key={locality.localidadId} className="card card-small card-post mb-4">
                                <div className="card-post__image" style={{backgroundImage: `url(${locality.locacionImg})` }}></div>
                                <div className="card-body">
                                  <h5 className="card-title">
                                    <p className="text-fiord-blue mb-2">{locality.nombreLocalidad}</p>
                                  </h5>
                                  <p className="card-text">{locality.direccionLocalidad}</p>
                                </div>
                                
                              </div>

                            </div>
                          )
                        }) : <div className="text-center"><p>No hay localidades</p></div>
                      }

                    </div>
                </div>
                <div className="col-lg-5 col-md-5 col-sm-12">
                    { locality.localidadId != null && !update ? 
                    <div className="card">
                      <div className="card-header-img-width">
                        <img src={locality.locacionImg} alt=""/>
                      </div>
                      <div onClick={()=>setLocality({})} className="card-close-btn">
                        <span>X</span>
                      </div>
                      <div className="px-4">
                        <div className="card-claim-box">
                          <p className="card-claim-text">{locality.nombreLocalidad}</p>
                        </div>
                        <div className="card-claim-box">
                          <p className="card-claim-title">Dirección de la localidad</p>
                          <p className="card-claim-text">{locality.direccionLocalidad}</p>
                        </div>
                        <div className="card-claim-box">
                          <p className="card-claim-title">Ciudad de la localidad</p>
                          <p className="card-claim-text">{locality.ciudad}</p>
                        </div>

                      </div>
                      <div className="card-footer">
                        <div className="row no-gutters align-items-center justify-content-spacebetween">
                            <button onClick={()=>{setDeleteModal(true)} } className="col-md-3 py-2 btn btn-outline-danger"><span class="icon-reduced material-icons">delete</span></button>
                            <button onClick={()=>{setUpdate(true); }} className="col-md-8 btn btn-primary">Editar localidad</button>
                        </div>
                      </div>
                    </div>
                    : update ? 
                    <form onSubmit={e => e.preventDefault() && false }>
                      <div className="card">
                        <div className="card-header text-center">
                            <h4>Actualizar localidad</h4>
                          </div>
                          <div onClick={()=>{ setUpdate(false); setLocality({});} } className="card-close-btn">
                            <span>X</span>
                          </div>
                        <div className="px-4">

                            <input type="file"
                              ref={hiddenFileInput}
                              onChange={handleChange} 
                              style={{display: 'none'}}
                            />
                            <div onClick={handleClick} className="card-update-product-img-fwidth">
                              {src !== "" ? <img src={src} alt="" /> : <img src={locality.locacionImg} alt="" />}
                            </div>
                          <div className="form-group">
                            <p className="input-label">Nombre de la localidad</p>
                            <input type="text" defaultValue={locality.nombreLocalidad} onChange={(e)=>{setLocalityUpdateInfo({...localityUpdateInfo, nombreLocalidad: e.target.value})}} placeholder="Nombre de la localidad" className="form-control"/>
                          </div>
                          <div className="form-group">
                            <p className="input-label">Dirección de la localidad</p>
                            <input type="text" defaultValue={locality.direccionLocalidad} onChange={(e)=>{setLocalityUpdateInfo({...localityUpdateInfo, direccionLocalidad: e.target.value})}} placeholder="Dirección de la localidad" className="form-control"/>
                          </div>
                          <div className="form-group">
                            <p className="input-label">Dirección detallada de la localidad</p>
                            <input type="text" defaultValue={locality.direccionDetallada} onChange={(e)=>{setLocalityUpdateInfo({...localityUpdateInfo, direccionDetallada: e.target.value})}} placeholder="Dirección detallada de la localidad" className="form-control"/>
                          </div>
                          <div className="form-group">
                            <p className="input-label">Ciudad de la localidad</p>
                            <input type="text" defaultValue={locality.ciudad} onChange={(e)=>{setLocalityUpdateInfo({...localityUpdateInfo, ciudad: e.target.value})}} placeholder="Ciudad de la localidad" className="form-control"/>
                          </div>
                          <div className="form-group">
                            <p className="input-label">Teléfono de la localidad</p>
                            <input type="text" defaultValue={locality.telefono} onChange={(e)=>{setLocalityUpdateInfo({...localityUpdateInfo, telefono: e.target.value})}} placeholder="Teléfono de la localidad" className="form-control"/>
                          </div>
                          <div className="form-group">
                            <p className="input-label">Otro teléfono de la localidad</p>
                            <input type="text" defaultValue={locality.otroTelefono} onChange={(e)=>{setLocalityUpdateInfo({...localityUpdateInfo, otroTelefono: e.target.value})}} placeholder="Otro teléfono de la localidad" className="form-control"/>
                          </div>
                          
                        </div>
                        <div className="card-footer">
                          <button onClick={()=>{saveUpdateLocality()}} className="btn btn-primary btn-block">Actualizar localidad</button>
                        </div>
                      </div>
                    </form>
                    : <form onSubmit={e => e.preventDefault() && false }>
                      <div className="card">
                        <div className="card-header text-center">
                          <h4>Crear localidad</h4>
                        </div>
                        <div className="px-4">

                          <input type="file"
                            ref={hiddenFileInput}
                            onChange={handleChange} 
                            style={{display: 'none'}}
                          />
                          <div onClick={handleClick} className="card-update-product-img-fwidth">
                            {src !== "" ? <img src={src} alt="" /> : <div className="card-header-img-upload"><p className="material-icons icon">add</p><p className="mb-0">Cargar imagen</p></div>}
                          </div>
                          <p className="mt-3 mb-3 text-muted text-center light">Dimensiones recomendadas (600 x 300)</p>
                          <div className="form-group">
                            <p className="input-label">Nombre de la localidad</p>
                            <input type="text" onChange={(e)=>{setLocalityInfo({...localityInfo, nombreLocalidad: e.target.value})}} placeholder="Nombre de la localidad" className="form-control"/>
                          </div>
                          <div className="form-group">
                            <p className="input-label">Dirección de la localidad</p>
                            <input type="text" onChange={(e)=>{setLocalityInfo({...localityInfo, direccionLocalidad: e.target.value})}} placeholder="Dirección de la localidad" className="form-control"/>
                          </div>
                          <div className="form-group">
                            <p className="input-label">Dirección detallada de la localidad</p>
                            <input type="text" onChange={(e)=>{setLocalityInfo({...localityInfo, direccionDetallada: e.target.value})}} placeholder="Dirección detallada de la localidad" className="form-control"/>
                          </div>
                          <div className="form-group">
                            <p className="input-label">Ciudad de la localidad</p>
                            <input type="text" onChange={(e)=>{setLocalityInfo({...localityInfo, ciudad: e.target.value})}} placeholder="Ciudad de la localidad" className="form-control"/>
                          </div>
                          <div className="form-group">
                            <p className="input-label">Teléfono de la localidad</p>
                            <input type="text" onChange={(e)=>{setLocalityInfo({...localityInfo, telefono: e.target.value})}} placeholder="Teléfono de la localidad" className="form-control"/>
                          </div>
                          <div className="form-group">
                            <p className="input-label">Otro teléfono de la localidad</p>
                            <input type="text" onChange={(e)=>{setLocalityInfo({...localityInfo, otroTelefono: e.target.value})}} placeholder="Otro teléfono de la localidad" className="form-control"/>
                          </div>
                          
                        </div>
                        <div className="card-footer">
                          <button onClick={()=>{checkInputs(localityInfo)}} className="btn btn-primary btn-block">{btnMessage}</button>
                        </div>
                      </div>
                    </form>}
                </div>
            </div>

          </div>
    )

    async function uploadLocality() {
      setBtnMessage("Subiendo...")
      let id = firebase.db.collection("Localidades").doc().id;
      try {
        await firebase.storage.ref(`/Localidades imagenes/${file.name}`).put(file)
        firebase.storage.ref("Localidades imagenes").child(file.name).getDownloadURL().then((url) => {

          let typesOfPetFriendly = [
            "Clínica",
          ]
  
          if(typesOfPetFriendly.includes(user.tipoAliado)){
  
            var placeId = firebase.db.collection("Places").doc().id
  
            let place = {
              createdOn: moment().toDate(),
              description: user.direccion,
              geolocation: "",
              media: [{
                index: 1,
                url: url,
                type: "photo"
              }],
              name: user.nombreComercial,
              placeId: placeId,
              subjectId: user.aliadoId,
              subjectType: "aliado",
              type: "Park"
            }
    
            firebase.db.collection("Places").doc(placeId).set(place)
          }

          firebase.db.collection("Localidades").doc(id).set({
            aliadoId: user.aliadoId,
            localidadId: id,
            serviciosContiene: true,
            pais: user.pais,
            locacionImg: url,
            nombreLocalidad: localityInfo.nombreLocalidad,
            direccionDetallada: localityInfo.direccionLocalidad,
            direccionLocalidad: localityInfo.direccionLocalidad,
            ciudad: localityInfo.ciudad,
            telefono: localityInfo.telefono,
            otroTelefono: localityInfo.otroTelefono,
            createdOn: moment().toDate(),
          })
        })
        history.push({
          pathname: "/configuration/localitys/addservices", 
          state: { localidadId: id}
        })
      } catch(error) {
        alert(error.message)
      }
    }
    
    async function saveUpdateLocality(){
      if(file){
        try {
          await firebase.storage.ref(`/Localidades imagenes/${file.name}`).put(file)
          firebase.storage.ref("Localidades imagenes").child(file.name).getDownloadURL().then((urlI) => {
            firebase.db.collection('Localidades').doc(locality.localidadId).update({
              locacionImg: urlI,
              nombreLocalidad: localityUpdateInfo.nombreLocalidad ?? localityInfo.nombreLocalidad,
              direccionDetallada: localityUpdateInfo.direccionLocalidad ?? localityInfo.direccionLocalidad,
              direccionLocalidad: localityUpdateInfo.direccionLocalidad ?? localityInfo.direccionLocalidad,
              ciudad: localityUpdateInfo.ciudad ?? localityInfo.ciudad,
              telefono: localityUpdateInfo.telefono ?? localityInfo.telefono,
              otroTelefono: localityUpdateInfo.otroTelefono ?? localityInfo.otroTelefono,
            })
          })
        } catch (e) {
          alert(e.message)
        }
      }else{
        await firebase.db.collection('Localidades').doc(locality.localidadId).update({
          nombreLocalidad: localityUpdateInfo.nombreLocalidad ?? locality.nombreLocalidad,
          direccionDetallada: localityUpdateInfo.direccionLocalidad ?? locality.direccionLocalidad,
          direccionLocalidad: localityUpdateInfo.direccionLocalidad ?? locality.direccionLocalidad,
          ciudad: localityUpdateInfo.ciudad ?? locality.ciudad,
          telefono: localityUpdateInfo.telefono ?? locality.telefono,
          otroTelefono: localityUpdateInfo.otroTelefono ?? locality.otroTelefono,
        })
      }
      setSuccessMsg("Localidad actualizada exitosamente")
      setSuccess(true)
      getLocalitys(user.aliadoId)
      setUpdate(false)
      setLocality({})
      setTimeout(() => {
        setSuccess(false)
      }, 4000);
    }

    async function deleteLocality(){
      try{
        await firebase.db.collection('Localidades').doc(locality.localidadId).delete()
        setDeleteModal(false)
        setSuccessMsg("Localidad eliminada exitosamente")
        setSuccess(true)
        getLocalitys(user.aliadoId)
        setLocality({})
        setTimeout(() => {
          setSuccess(false)
        }, 4000);
      }catch(e){
        console.log("Error: " + e);
      }
    }

}

export default Localitys