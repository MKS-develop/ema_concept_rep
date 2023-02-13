import React, {useState, useEffect} from 'react'
import firebase from '../../firebase/config'
import {Link, useHistory, useLocation} from 'react-router-dom';


function ClientInfo() {

  const history = useHistory()
  let data = useLocation()

  const [family, setFamily] = useState([])
  const [parentsList, setParentsList] = useState([])
  const [sexesList, setSexesList] = useState([])

  const [user, setUser] = useState({})
  const [role, setRole] = useState({})

  const [client, setClient] = useState({})
  const [pacientePlan, setClientePlan] = useState({})
  const [pacientePetPoints, setClientePP] = useState({})
  const [familyFormData, setFamilyFormData] = useState({
    apellido: "",
    direccion: "",
    email: "",
    fechanac: "",
    nombre: "",
    parentesco: "",
    edad: "",
    sexo: "",
    telefono: "",
  })

  const [popupForm, setPopupForm] = useState(false)
  const [popupEpisode, setPopupEpisode] = useState(false)
  const [loadedClient, setLoadedClient] = useState(false)
  const [openSidebarCreation, setOpenSidebarCreation] = useState(false)
  const [loadedLists, setLoadedLists] = useState(false)
  const [loadedFamily, setLoadedFamily] = useState(false)

  const [file, setFile] = useState(null);
  const [urlImage, setUrlImage] = useState("");

  const [episodes, setEpisodes] = useState([])
  const [episode, setEpisode] = useState({})

  const getClient = async(uid)=>{
    let tipos = []
    try{
      await firebase.db.collection("Dueños").doc(uid).get().then((val)=>{
        setClient(val.data())
      })
      await firebase.db.collection("Dueños").doc(uid).collection("Results").get().then((val)=>{
        val.docs.forEach((d)=> tipos.push(d.data()) )
      })
    }catch(e){
      console.log(`Error: ${e}`)
    }
    setEpisodes(tipos)
    setLoadedClient(true)
  }
  
  const getFamily = async(uid)=>{
    let tipos = []
    try{
      await firebase.db.collection("Dueños").where("parentId", "==", uid).get().then((val)=>{
        val.docs.forEach((doc)=>{
          tipos.push(doc.data())
        })
        setFamily(tipos)
      })
    }catch(e){
      console.log(`Error: ${e}`)
    }
    setLoadedFamily(true)
  }

  function manageOpenEpisode(data){
    setPopupForm(false)
    setPopupEpisode(!popupEpisode)
    setEpisode(data)
  }

  function handleChange(e) {
    setFile(e.target.files[0]);
  }

  const FamilyComponent = ({data}) => {
    return(
      <div onClick={()=>{
        history.push({
          pathname: "/client/proceedings",
          state: {mid: data["uid"], uid: data["parentId"], isOwner: false }
        })
      }} className="family-box-componente">
        <p className="family-box-componente-name">{data["user"] ?? "-"}</p>
        <p className="family-box-componente-parentesc">{data["parentesco"] ?? "-"}</p>
      </div>
    )
  }

  const EpisodeComponent = ({data}) => {
    return(
      <div onClick={()=>{ manageOpenEpisode(data) }} className="episode-box-componente">
        <p className="episode-box-componente-title">{data["name"]}</p>
        <p className="episode-box-componente-type">{data["urlFile"]}</p>
        <p className="episode-box-componente-text">{data["urlImage"]}</p>
      </div>
    )
  }

  async function getListsFromDB(){
    let tiposSexes = []
    let tiposParents = []
    try{
      await firebase.db.collection("Parentesco").get().then((val)=>{
        val.docs.forEach((doc)=>{
          tiposParents.push(doc.id)
        })
      })
      await firebase.db.collection("SexoPersona").get().then((val)=>{
        val.docs.forEach((doc)=>{
          tiposSexes.push(doc.id)
        })
      })
    }catch(e){
      console.log(`Error: ${e}`)
    }
    setSexesList(tiposSexes)
    setParentsList(tiposParents)
    setLoadedLists(true)
  }

  useEffect(() => {
    getFamily(data.state.uid)
  }, [loadedFamily])

  useEffect(() => {
    getListsFromDB()
  }, [loadedLists])
  

  useEffect(() => {
    firebase.getCurrentUser().then((val)=>{
      setUser(val)
      firebase.getRoleInfo(val.role ?? "Atencion").then((r)=>{
        setRole(r)
      })
    })
    if(data.state !== undefined){
      getClient(data.state.uid)
    }
  }, [loadedClient])

  return (
    <div className="main-content-container container-fluid px-4">
      <div className={`sidebar-activation ${openSidebarCreation && "active"}`}>
        <div className="sidebar-activation-wrapper">
          <div className="sidebar-activation-header">
            <div onClick={()=>{ setOpenSidebarCreation(false) }}  className="sidebar-activation-header-btn cursor-pointer mr-2">
              <i className="material-icons">close</i>
            </div>
            <div className="right-side-info-title">
              Crear familiar
            </div>
          </div>
          
          <div className="sidebar-activation-body">
            <div className="mb-4">
              <p className="calendar-component-appointment-card-title mb-1">Nombre</p>
              <input type="text" placeholder="Escribir..." className="form-control" onChange={(e)=>{ setFamilyFormData({...familyFormData, nombre:e.target.value}) }} />
            </div>
            <div className="mb-4">
              <p className="calendar-component-appointment-card-title mb-1">Apellido</p>
              <input type="text" placeholder="Escribir..." className="form-control" onChange={(e)=>{ setFamilyFormData({...familyFormData, apellido:e.target.value}) }} />
            </div>
            <div className="mb-4">
              <p className="calendar-component-appointment-card-title mb-1">Parentesco</p>
              <select className="form-control" onChange={(e)=>{ setFamilyFormData({...familyFormData, parentesco:e.target.value}) }}>
                <option value="">Seleccionar</option>
                {parentsList.map((o, i)=>{
                  return(
                    <option key={i} value={o}>{o}</option>
                  )
                })}
              </select>

            </div>
            <div className="mb-4">
              <p className="calendar-component-appointment-card-title mb-1">Sexo</p>
              <select className="form-control" onChange={(e)=>{ setFamilyFormData({...familyFormData, sexo:e.target.value}) }}>
                <option value="">Seleccionar</option>
                {sexesList.map((o, i)=>{
                  return(
                    <option key={i} value={o}>{o}</option>
                  )
                })}
              </select>

            </div>
            <div className="mb-4">
              <p className="calendar-component-appointment-card-title mb-1">Edad</p>
              <input type="number" min="0" max="100" placeholder="Escribir..." className="form-control" onChange={(e)=>{ setFamilyFormData({...familyFormData, edad:e.target.value}) }} />
            </div>
            <div className="mb-4">
              <p className="calendar-component-appointment-card-title mb-1">Fecha nacimiento</p>
              <input type="date" placeholder="Escribir..." className="form-control" onChange={(e)=>{ setFamilyFormData({...familyFormData, fechanac:e.target.value}) }} />
            </div>
            <div className="mb-4">
              <p className="calendar-component-appointment-card-title mb-1">Dirección</p>
              <input type="text" placeholder="Escribir..." className="form-control" onChange={(e)=>{ setFamilyFormData({...familyFormData, direccion:e.target.value}) }} />
            </div>
            <div className="mb-4">
              <p className="calendar-component-appointment-card-title mb-1">Teléfono</p>
              <input type="text" placeholder="Escribir..." className="form-control" onChange={(e)=>{ setFamilyFormData({...familyFormData, telefono:e.target.value}) }} />
            </div>
            <div className="mb-4">
              <p className="calendar-component-appointment-card-title mb-1">Email</p>
              <input type="email" placeholder="Escribir..." className="form-control" onChange={(e)=>{ setFamilyFormData({...familyFormData, email:e.target.value}) }} />
            </div>
            
          </div> 
          <div className="sidebar-activation-footer">
            <div className="btn btn-block btn-primary" onClick={()=>{ 
              uploadFamily()
            }}>Crear</div>
          </div>

        </div>
      </div>
      <div className={`sidebar-activation ${popupForm && "active"}`}>
        <div className="sidebar-activation-wrapper">
          <div className="sidebar-activation-header">
            <div onClick={()=>{ setPopupForm(false) }}  className="sidebar-activation-header-btn cursor-pointer mr-2">
              <i className="material-icons">close</i>
            </div>
            <div className="right-side-info-title">
              Subir resultado
            </div>
          </div>
          
          <div className="sidebar-activation-body">
            <div className="mb-2 mt-1">
              <p className="row-content-container-right-desc">Carga los documentos o imagenes del resultado</p>
            </div>
            <div className="mb-4">
              <p className="calendar-component-appointment-card-title mb-1">Subir informe PDF</p>
              <input type="file" onChange={handleChange} className="form-control" />
            </div>
            <div className="mb-4">
              <p className="calendar-component-appointment-card-title mb-1">URL de la imagen</p>
              <input type="text" placeholder="URL" className="form-control" onChange={(e)=>{ setUrlImage(e.target.value) }} />
            </div>
          </div> 
          <div className="sidebar-activation-footer">
            <div className="btn btn-block btn-primary" onClick={()=>{ 
              uploadResult()
            }}>Subir</div>
          </div>

        </div>
      </div>
      <div className={`sidebar-activation ${popupEpisode && "active"}`}>
        <div className="sidebar-activation-wrapper">
          <div className="sidebar-activation-header">
            <div onClick={()=>{ setPopupEpisode(false) }}  className="sidebar-activation-header-btn cursor-pointer mr-2">
              <i className="material-icons">close</i>
            </div>
            <div className="right-side-info-title">
              Resultado
            </div>
          </div>
          
          <div className="sidebar-activation-body">
            <div className="mb-4">
              <p className="calendar-component-appointment-card-title mb-1">Informe PDF</p>
              <a target='_blank' href={episode?.urlFile}>{episode?.urlFile}</a>
            </div>
            <div className="mb-4">
              <p className="calendar-component-appointment-card-title mb-1">URL de la imagen</p>
              <a target='_blank' href={episode?.urlImage}>{episode?.urlImage}</a>
            </div>
          </div>

        </div>
      </div>
      <div className="page-header align-items-center justify-content-spacebetween row no-gutters px-4 my-4">
        <div className="col-12 col-sm-5 text-center text-sm-left mb-0">
          <div className="row align-items-center">
            <div className="col">
              <p className="page-title bold"><Link className="page-title light" to="/clients">Pacientes</Link> <span>Paciente</span></p>
            </div>
          </div>
        </div>
        <div className="col-12 col-sm-1 mb-0">
          <div className="row align-items-center justify-content-space-around">
            <i className="material-icons color-white display-5">help_outline</i>
          </div>
        </div>
      </div>
      <div className="row mb-5 container">
        <h3 className="mb-0 mt-2">Paciente</h3>
        {role?.canChargeFile && <div onClick={()=>{ setPopupEpisode(false); setPopupForm(true) }} className="btn ml-5 mt-2 btn-outline-primary">
          Subir resultado
        </div>}
        <div onClick={()=>{}} className={`btn ml-5 mt-2 btn-outline-success`}>
          No requiere seguimiento
        </div>
        <div onClick={()=>{}} className={`btn ml-5 mt-2 btn-outline-danger`}>
          Requiere seguimiento
        </div>
        <div onClick={()=>{updateUser() }} className={`btn ml-5 mt-2 btn-outline-primary`}>
          Actualizar
        </div>
        <div onClick={()=>{ goToExpedient() }} className={`btn ml-5 mt-2 btn-outline-primary`}>
          Expediente médico
        </div>
      </div>
      <div className="row">
        <div className="col-lg-4 mb-4">
          <p className="mb-2 bold color-primary">Nombre del paciente</p>
          <input style={{textTransform: "capitalize"}} defaultValue={client?.user} onChange={(e)=>{ setClient({...client, user: e.target.value}) }} className='form-control' />
        </div>
        <div className="col-lg-4 mb-4">
          <p className="mb-2 bold color-primary">Primer apellido</p>
          <input style={{textTransform: "capitalize"}} defaultValue={client?.dadsLastName} onChange={(e)=>{ setClient({...client, dadsLastName: e.target.value}) }} className='form-control' />
        </div>
        <div className="col-lg-4 mb-4">
          <p className="mb-2 bold color-primary">Segundo apellido</p>
          <input style={{textTransform: "capitalize"}} defaultValue={client?.momsLastName} onChange={(e)=>{ setClient({...client, momsLastName: e.target.value}) }} className='form-control' />
        </div>
        <div className="col-lg-4 mb-4">
          <p className="mb-2 bold color-primary">Edad</p>
          <input type="number" min="0" max="100" defaultValue={client?.edad} onChange={(e)=>{ setClient({...client, edad: e.target.value}) }} className='form-control' />
        </div>
        <div className="col-lg-4 mb-4">
          <p className="mb-2 bold color-primary">CURP</p>
          <input style={{textTransform: "capitalize"}} defaultValue={client?.identificacion} onChange={(e)=>{ setClient({...client, identificacion: e.target.value}) }} className='form-control' />
        </div>
        <div className="col-lg-4 mb-4">
          <p className="mb-2 bold color-primary">Sexo</p>
          <select defaultValue={client?.sexo} className="form-control" onChange={(e) => setClient({...client, sexo: e.target.value})}>
            <option
            value="">Sexo</option>
            <option selected={client?.sexo === "Mujer" ? true : false}
            value="Mujer">Mujer</option>
            <option selected={client?.sexo === "Hombre" ? true : false}
            value="Hombre">Hombre</option>
          </select>
        </div>
        <div className="col-lg-4 mb-4">
          <p className="mb-2 bold color-primary">Dirección</p>
          <input defaultValue={client?.direccion} onChange={(e)=>{ setClient({...client, direccion: e.target.value}) }} className='form-control' />
        </div>
        <div className="col-lg-4 mb-4">
          <p className="mb-2 bold color-primary">Teléfono</p>
          <input defaultValue={client?.telefono} onChange={(e)=>{ setClient({...client, telefono: e.target.value}) }} className='form-control' />
        </div>
        <div className="col-lg-4 mb-4">
          <p className="mb-2 bold color-primary">Email</p>
          <p>{client?.email ?? "-"}</p>
        </div>
      </div>
      <div className="row mb-5 container">
        <h3 className="mb-0 mt-2">Grupo familiar</h3>
        <div onClick={()=>{ setOpenSidebarCreation(!openSidebarCreation) }} className={`btn ml-5 mt-2 btn-outline-success`}>
          Agregar familiar
        </div>
      </div>
      <div className="row mt-3 container">
        {family.length > 0 ? 
          family.map((fa, i)=> <FamilyComponent data={fa} />  )
          : <div className="text-center col-lg-12"><p>No hay personas en el grupo familiar</p></div>
        }
      </div>
      <h3 className="mb-0 mt-2">Resultados</h3>
      <div className="row mt-3 container">
        {episodes.length > 0 ? 
          episodes.map((ep, i)=> <EpisodeComponent data={ep} />  )
          : <div className="text-center col-lg-12"><p>No hay resultados de este paciente</p></div>
        }
      </div>
    </div>
  )

  function goToExpedient(){
    history.push({
      pathname: "/client/proceedings",
      state: {mid: client["uid"], uid: client["uid"], isOwner: true }
    })
  }
  
  async function changeClientStatus(){
    await firebase.db.collection("Dueños").doc(client.uid).update({
      welfareStatus: !client?.welfareStatus
    })
    getClient(data.state.uid)
  }

  async function updateUser(){

    client["user"] = client["user"].toString().charAt(0).toUpperCase() + client["user"].toString().slice(1)
    client["dadsLastName"] = client["dadsLastName"].toString().charAt(0).toUpperCase() + client["dadsLastName"].toString().slice(1)
    client["momsLastName"] = client["momsLastName"].toString().charAt(0).toUpperCase() + client["momsLastName"].toString().slice(1)
    client["identificacion"] = client["identificacion"].toString().charAt(0).toUpperCase() + client["identificacion"].toString().slice(1)

    try {
      await firebase.db.collection("Dueños").doc(client["uid"]).update(client)
      await firebase.db.collectionGroup("Clients").where("uid", "==", client["uid"]).get().then((v)=>{
        v.docs.forEach(async (doc)=>{
          await doc.ref.update(client)
        })
      })
    } catch (e) {
      console.log(e)
    }
  }

  async function uploadResult(){
    let tipos = []

    if(file){
      let id = firebase.db.collection("Dueños").doc(client.uid).collection("Results").doc().id
      await firebase.storage.ref(`/Results media/${file.name}`).put(file)
      await firebase.storage.ref("Results media").child(file.name).getDownloadURL().then((urlI) => {
        firebase.db.collection("Dueños").doc(client.uid).collection("Results").doc(id).set({
          urlFile: urlI,
          urlImage: urlImage,
          name: file.name ?? "-",
          type: "PDF"
        })
      })

    }else{
      let id = firebase.db.collection("Dueños").doc(client.uid).collection("Results").doc().id
      await firebase.db.collection("Dueños").doc(client.uid).collection("Results").doc(id).set({
        urlFile: "-",
        urlImage: urlImage,
        name: "-",
        type: "Imagen"
      })
    }
    await firebase.db.collection("Dueños").doc(client.uid).collection("Results").get().then((val)=>{
      val.docs.forEach((d)=> tipos.push(d.data()) )
    })
    setEpisodes(tipos)
  }

  async function uploadFamily(){
    let id = firebase.db.collection("Dueños").doc().id
    await firebase.db.collection("Dueños").doc(id).set({
      uid: id,
      email: familyFormData["email"],
      identificacion: "",
      edad: familyFormData["edad"],
      telefono: familyFormData["telefono"],
      user: familyFormData["nombre"],
      dadsLastName: familyFormData["apellido"],
      momsLastName: "",
      codPostal: "",
      url: "",
      password: "",
      direccion: familyFormData["direccion"],
      parentesco: familyFormData["parentesco"],
      bienvenida: true,
      walkin: true,
      parentId: client["uid"],
      // token: token,
      registroCompleto: false,
    })
    setFamilyFormData({
      apellido: "",
      direccion: "",
      email: "",
      edad: "",
      fechanac: "",
      nombre: "",
      parentesco: "",
      sexo: "",
      telefono: "",
    })
    setOpenSidebarCreation(false)
    getFamily(client["uid"])
  }


}

export default ClientInfo