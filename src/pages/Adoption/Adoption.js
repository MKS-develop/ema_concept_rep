import React, {useState, useEffect} from 'react'
import firebase from '../../firebase/config'
import {Link, useHistory} from 'react-router-dom';
import moment from 'moment';
import { MuiPickersUtilsProvider, DatePicker } from '@material-ui/pickers';
import MomentUtils from '@date-io/moment';

function Adoption() {

  const history = useHistory()
    const hiddenFileInput = React.useRef(null);
    const [btnMessage, setBtnMessage] = useState("Publicar mascota");
    const [pets, setPets] = useState([])
    const [productsTypes, setProductsTypes] = useState([])
    const [update, setUpdate] = useState(false);
    const [adoptado, setAdopatado] = useState(false);
    const [apadrinado, setApadrinado] = useState(false);
    const [species, setSpecies] = useState([])
    const [user, setUser] = useState({})
    const [pet, setPet] = useState({})
    const [petInfo, setPetInfo] = useState({
      nombreMascota: "",
      historiaMascota: "",
      especieMascota: "",
      edadTamañoMascota: "",
      tamañoMascota: "",
      adoptadoPor: "",
      apadrinadoPor: "",
      costoApadrinar: 0,
      costoAdoptar: 0,
    })
    const [petUInfo, setPetUInfo] = useState({
      nombreMascota: null,
      historiaMascota: null,
      especieMascota: null,
      edadTamañoMascota: null,
      tamañoMascota: null,
      adoptadoPor: null,
      apadrinadoPor: null,
      costoApadrinar: null,
      costoAdoptar: null,
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

    const getPets = async(aliadoId) =>{
      let tipos = [];
      let reference = firebase.db.collection('Mascotas').where("aliadoId", "==", aliadoId)
      let adoptadoQuery = adoptado ? reference.where("adoptadoStatus", "==", true) : reference
      let apadrinadoQuery = apadrinado ? adoptadoQuery.where("apadrinadoStatus", "==", true) : adoptadoQuery
      await apadrinadoQuery.get().then(val => {
        val.docs.forEach(item=>{
          tipos.push(item.data())
          tipos.sort()
        })
        setPets(tipos)
      })
    }
    
    const getPetsSpecies = async() =>{
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

    useEffect(() => {
        firebase.getCurrentUser().then((val)=>{
          setUser(val)
          getPets(val.aliadoId)
        });
        getPetsSpecies()
    }, [])

    return (
      <MuiPickersUtilsProvider utils={MomentUtils}>
        <div className="main-content-container container-fluid px-4">

            <div className="page-header align-items-center justify-content-spacebetween row no-gutters px-4 my-4">
              <div className="col-12 col-sm-5 text-center text-sm-left mb-0">
                <div className="row align-items-center">
                  <div className="col">
                    <p className="page-title">Adopción y apadrinamiento</p>
                  </div>
                </div>
              </div>
              <div className="col-12 col-sm-1 mb-0">
                <div className="row align-items-center justify-content-space-around">
                  <i className="material-icons color-white display-5">help_outline</i>
                </div>
              </div>
            </div>
            <div className="form-row align-items-center justify-content-space-between">
              
              <div className="form-group ml-3">
                <input type="checkbox" onClick={()=>{setAdopatado(!adoptado)}} name="ad"/>
                <label className="mb-0 ml-2" htmlFor="ad">Por adoptar/apadrinar</label>
              </div>
              <div className="form-group ml-3">
                <input type="checkbox" onClick={()=>{setApadrinado(!apadrinado)}} name="ap"/>
                <label className="mb-0 ml-2" htmlFor="ap">Adoptado/apadrinado</label>
              </div>
              <div className="ml-3 form-group">
                <button className="btn btn-primary" onClick={()=>{getPets(user.aliadoId)}}>Buscar <i className="material-icons">search</i></button>
              </div>
            </div>
            <div className="row">
              {/* Pet card */}
              <div className="col-lg-7 col-md-7 col-sm-12">
                  <div className="row justify-content-space-between">
                    {
                      pets.length > 0 ? pets.map(pet=>{
                          return(
                            <div className="col-md-4 col-sm-12">
                              <div onClick={() => setPet(pet)} key={pet.mid} className="pet-img mb-4">
                                <img src={pet.petthumbnailUrl} alt={pet.petthumbnailUrl}/>
                              </div>
                          </div>
                      )
                    }) : <div className="text-center"><p>No hay mascotas</p></div>
                  }
                  </div>
              </div>
              {/* End Pet card */}
              {/* Upload Pet card */}
                <div className="col-lg-5 col-md-5 col-sm-12">
                    { pet.nombre != null  && !update ? 
                    // Info pet card
                    <div className="card">
                      <div className="card-header-img">
                        <img src={pet.petthumbnailUrl} alt=""/>
                      </div>
                      <div className="col-md-12 my-3 col-sm-12">
                        <button onClick={()=>{
                            history.push({
                              pathname: "/proceedings", 
                              state: {mid: pet.mid}
                            })
                        }} className="btn btn-block btn-outline-secondary">Expediente médico</button>
                      </div>
                      <div onClick={()=>setPet({})} className="card-close-btn">
                        <span>X</span>
                      </div>
                      <div className="px-4">
                        <div className="card-claim-box">
                          <p className="card-claim-text">{pet.nombre}</p>
                        </div>
                        <div className="card-claim-box">
                          <p className="card-claim-title">Historia</p>
                          <p className="card-claim-text">{pet.historia}</p>
                        </div>
                        <div className="card-claim-box">
                          <p className="card-claim-title">Especie: {pet.especie}</p>
                        </div>
                        <div className="card-claim-box">
                          <p className="card-claim-title">Edad: {pet.edadMascota} </p>
                        </div>
                        <div className="card-claim-box">
                          <p className="card-claim-title">Tamaño de la mascota: {pet.tamañoMascota}</p>
                        </div>
                        <div className="card-claim-box">
                          <p className="card-claim-title">Adoptado por: {pet.adoptadoPor}</p>
                        </div>
                        <div className="card-claim-box">
                          <p className="card-claim-title">Apadrinado por: {pet.apadrinadoPor}</p>
                        </div>
                      </div>
                      <div className="card-footer">
                        <div className="row">
                          <div className="col-md-6 col-sm-12">
                            <button onClick={deletePet} className="btn btn-outline-danger">Eliminar mascota</button>
                          </div>
                          <div className="col-md-6 col-sm-12">
                            <button onClick={()=>{setUpdate(true)}} className="btn btn-primary">Editar mascota</button>
                          </div>
                        </div>
                      </div>
                    </div>
                    // End info pet card
                    : update ?
                    // Update info pet card
                    <form onSubmit={e => e.preventDefault() && false }>
                      <div className="card">
                        <div className="card-header text-center">
                          <h4>Actualizar mascota</h4>
                        </div>
                        <div onClick={()=>{setPet({}); setUpdate(false)}} className="card-close-btn">
                          <span>X</span>
                        </div>
                        <div className="px-4">

                          <input type="file"
                            ref={hiddenFileInput}
                            onChange={handleChange} 
                            style={{display: 'none'}}
                          />
                          <div onClick={handleClick} className="card-update-product-img">
                            {src !== "" ? <img src={src} alt="" /> : <img src={pet.petthumbnailUrl} alt="" />}
                          </div>

                          <div className="form-group">
                            <input type="text" onChange={(e)=>{setPetUInfo({...petUInfo, nombreMascota: e.target.value})}} placeholder={pet.nombre} className="form-control"/>
                          </div>
                          <div className="form-group">
                            <textarea type="text" onChange={(e)=>{setPetUInfo({...petUInfo, historiaMascota: e.target.value})}} placeholder={pet.historia} className="form-control"/>
                          </div>
                          <div className="form-group">
                            <input type="text" onChange={(e)=>{setPetUInfo({...petUInfo, especieMascota: e.target.value})}} placeholder={pet.especie} className="form-control"/>
                          </div>
                          <div className="form-group">
                            <input type="text" onChange={(e)=>{setPetUInfo({...petUInfo, edadTamañoMascota: e.target.value})}} placeholder={pet.edadMascota} className="form-control"/>
                          </div>
                          <div className="form-group">
                            <input type="text" onChange={(e)=>{setPetUInfo({...petUInfo, tamañoMascota: e.target.value})}} placeholder={pet.tamañoMascota} className="form-control"/>
                          </div>
                          <div className="form-group">
                            <input type="text" onChange={(e)=>{setPetUInfo({...petUInfo, costoApadrinar: e.target.value})}} placeholder={pet.costroApadrinar} className="form-control"/>
                          </div>
                          <div className="form-group">
                            <input type="text" onChange={(e)=>{setPetUInfo({...petUInfo, costoAdoptar: e.target.value})}} placeholder={pet.costoAdoptar} className="form-control"/>
                          </div>

                          {/* <div className="form-group">
                            <select className="form-control" placeholder={pet.categoria} value={petUInfo.categoria} onChange={(e)=>{setPetUInfo({...petUInfo, categoria: e.target.value})}}>
                              {productsTypes.map(data => (
                                  <option key={data} value={data}>{data}</option>
                              ))}
                            </select>
                          </div> */}
                        </div>
                        <div className="card-footer">
                          <button onClick={()=>{updatePet()}} className="btn btn-primary btn-block">{btnMessage}</button>
                        </div>
                      </div>
                    </form>
                    // End update info pet card
                    :
                    // Upload pet card
                    <form onSubmit={e => e.preventDefault() && false }>
                      <div className="card">
                        <div className="card-header text-center">
                          <h4>Publicar mascota</h4>
                        </div>
                        <div className="px-4">

                          <input type="file"
                            ref={hiddenFileInput}
                            onChange={handleChange} 
                            style={{display: 'none'}}
                          />
                          <div onClick={handleClick} className="card-update-product-img">
                            {src !== "" ? <img src={src} alt="" /> : <div className="card-header-img-upload"><p className="material-icons icon">add</p><p>Foto de la mascota</p></div>}
                          </div>

                          <div className="form-group">
                            <input type="text" onChange={(e)=>{setPetInfo({...petInfo, nombreMascota: e.target.value})}} placeholder="Nombre de la mascota" className="form-control"/>
                          </div>
                          <div className="form-group">
                            <textarea type="text" onChange={(e)=>{setPetInfo({...petInfo, historiaMascota: e.target.value})}} placeholder="Historia de la mascota" className="form-control"/>
                          </div>
                          <div className="form-group">
                            <input type="text" onChange={(e)=>{setPetInfo({...petInfo, especieMascota: e.target.value})}} placeholder="Especie de la mascota" className="form-control"/>
                          </div>
                          <div className="form-group">
                            <input type="text" onChange={(e)=>{setPetInfo({...petInfo, edadTamañoMascota: e.target.value})}} placeholder="Edad de la mascota" className="form-control"/>
                          </div>
                          <div className="form-group">
                            <input type="text" onChange={(e)=>{setPetInfo({...petInfo, tamañoMascota: e.target.value})}} placeholder="Tamaño de la mascota" className="form-control"/>
                          </div>
                          <div className="form-group">
                            <input type="text" onChange={(e)=>{setPetInfo({...petInfo, costoApadrinar: e.target.value})}} placeholder="Costo por apadrinar a la mascota" className="form-control"/>
                          </div>
                          <div className="form-group">
                            <input type="text" onChange={(e)=>{setPetInfo({...petInfo, costoAdoptar: e.target.value})}} placeholder="Costo por adoptar a la mascota" className="form-control"/>
                          </div>
                          
                          <div className="form-group">
                            <select className="form-control" value={petInfo.categoria} onChange={(e)=>{setPetInfo({...petInfo, categoria: e.target.value})}}>
                              {productsTypes.map(data => (
                                  <option key={data} value={data}>{data}</option>
                              ))}
                            </select>
                          </div>
                        </div>
                        <div className="card-footer">
                          <button onClick={()=>{uploadPet()}} className="btn btn-primary btn-block">{btnMessage}</button>
                        </div>
                      </div>
                    </form>
                    // End upload pet card
                  }
                </div>
            </div>
          </div>
        </MuiPickersUtilsProvider>
    )

    async function uploadPet() {
      setBtnMessage("Subiendo...")
      let id = Date.now().toString()
      try {
        await firebase.storage.ref(`/Mascotas imagenes/${file.name}`).put(file)
        await firebase.storage.ref("Mascotas imagenes").child(file.name).getDownloadURL().then((url) => {
          firebase.db.collection("Mascotas").doc(id).set({
            aliadoId: user.aliadoId,
            mid: id,
            petthumbnailUrl: url,
            nombre: petInfo.nombreMascota,
            historia: petInfo.historiaMascota,
            especie: petInfo.especieMascota,
            edadMascota: petInfo.edadTamañoMascota,
            tamañoMascota: petInfo.tamañoMascota,
            costroApadrinar: petInfo.costoApadrinar,
            costoAdoptar: petInfo.costoAdoptar,
            adoptadoStatus: false,
            apadrinadoStatus: false,
            createdOn: moment().toDate(),
          }).then((val)=>{
            window.location.href = "/adoption"
          })
        })
      } catch(error) {
        alert(error.message)
      }
    }
      
    async function updatePet(){
      if(file){
        await firebase.storage.ref(`/Mascotas imagenes/${file.name}`).put(file)
        firebase.storage.ref("Mascotas imagenes").child(file.name).getDownloadURL().then((url) => {
          firebase.db.collection("Mascotas").doc(pet.mid).update({
            petthumbnailUrl: url,
            nombre: petUInfo.nombreMascota ?? pet.nombre,

          }).then((val)=>{
            window.location.href = "/adoption"
          })
        })
      }else{
        try {
          await firebase.db.collection("Mascotas").doc(pet.mid).update({
            nombre: petUInfo.nombreMascota ?? pet.nombre,
            
          })
          window.location.href = "/adoption"

        } catch (e) {
          alert(e.message)
        }

      }
    }
  
    async function deletePet(){
      try{
        await firebase.db.collection('Mascotas').doc(pet.mid).delete()
        window.location.href = "/adoption"
      }catch(e){
        console.log("Error: " + e);
      }
    }

}

export default Adoption
