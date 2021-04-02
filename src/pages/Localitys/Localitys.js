import React, {useState, useEffect} from 'react'
import firebase from '../../firebase/config'
import {Link} from 'react-router-dom';
import moment from 'moment';

function Localitys() {

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

    useEffect(() => {
        firebase.getCurrentUser().then((val)=>{
          setUser(val)
          getLocalitys(val.aliadoId)
          getCityes(val.pais)
        })
    }, [])

    return (
        <div className="main-content-container container-fluid px-4">

            <div className="page-header align-items-center justify-content-spacebetween row no-gutters py-2 px-4 my-4">
              <div className="col-12 col-sm-5 text-center text-sm-left mb-0">
                <div className="row align-items-center">
                  <div className="col">
                    <p className="page-title"><Link className="color-white" to="/configuration">Configuración</Link> {'>'} Localidades</p>
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
                    { locality.localidadId != null ? <div className="card">
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
                        <div className="row">
                          <div className="col-md-6 col-sm-12">
                            <button onClick={deleteLocality} className="btn btn-danger">Eliminar localidad</button>
                          </div>
                          {/* <div className="col-md-6 col-sm-12">
                            <button onClick={uploadLocality} className="btn btn-primary">Editar producto</button>
                          </div> */}
                        </div>
                      </div>
                    </div>
                    : <form onSubmit={e => e.preventDefault() && false }>
                      <div className="card">
                        <div className="card-header text-center">
                          <h4>Crear localidad</h4>
                        </div>
                        <div className="px-4">
                          {/* <div className="form-group">
                            <select className="form-control" value={tipoproducto} onChange={e => setTipoproducto(e.target.value)}>
                              {tiposproductos.map(data => (
                                  <option key={data} value={data}>{data}</option>
                              ))}
                            </select>
                          </div> */}

                          <input type="file"
                            ref={hiddenFileInput}
                            onChange={handleChange} 
                            style={{display: 'none'}}
                          />
                          <div onClick={handleClick} className="card-update-product-img-fwidth">
                            {src !== "" ? <img src={src} alt="" /> : <div className="card-header-img-upload"><p className="material-icons icon">add</p><p className="mb-0">Cargar imagen</p></div>}
                          </div>
                          <div className="form-group">
                            <input type="text" onChange={(e)=>{setLocalityInfo({...localityInfo, nombreLocalidad: e.target.value})}} placeholder="Nombre de la localidad" className="form-control"/>
                          </div>
                          <div className="form-group">
                            <input type="text" onChange={(e)=>{setLocalityInfo({...localityInfo, direccionLocalidad: e.target.value})}} placeholder="Dirección de la localidad" className="form-control"/>
                          </div>
                          <div className="form-group">
                            <input type="text" onChange={(e)=>{setLocalityInfo({...localityInfo, direccionDetallada: e.target.value})}} placeholder="Dirección detallada de la localidad" className="form-control"/>
                          </div>
                          <div className="form-group">
                            <select className="form-control" value={localityInfo.ciudad} onChange={(e)=>{setLocalityInfo({...localityInfo, ciudad: e.target.value})}}>
                              {cities.map(data => (
                                  <option key={data} value={data}>{data}</option>
                              ))}
                            </select>
                          </div>
                          <div className="form-group">
                            <input type="text" onChange={(e)=>{setLocalityInfo({...localityInfo, telefono: e.target.value})}} placeholder="Teléfono de la localidad" className="form-control"/>
                          </div>
                          <div className="form-group">
                            <input type="text" onChange={(e)=>{setLocalityInfo({...localityInfo, otroTelefono: e.target.value})}} placeholder="Otro teléfono de la localidad" className="form-control"/>
                          </div>
                          
                        </div>
                        <div className="card-footer">
                          <button onClick={()=>uploadLocality} className="btn btn-primary btn-block">{btnMessage}</button>
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
          firebase.db.collection("Localidades").doc(id).set({
            aliadoId: user.aliadoId,
            localidadId: id,
            serviciosContiene: true,
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
        window.location.href = "/configuration/localidades/addservices"
      } catch(error) {
        alert(error.message)
      }
    }
      
    async function deleteLocality(){
      try{
        await firebase.db.collection('Localidades').doc(locality.localidadId).delete()
        window.location.href = "/configuration/localidades"
      }catch(e){
        console.log("Error: " + e);
      }
    }

}

export default Localitys
