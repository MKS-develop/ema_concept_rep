import React, {useState, useEffect} from 'react'
import firebase from '../firebase/config'
import {Link} from 'react-router-dom';
import moment from 'moment';
import { MuiPickersUtilsProvider, DatePicker } from '@material-ui/pickers';
import MomentUtils from '@date-io/moment';

function Specialitys() {
  const [btnMessage, setBtnMessage] = useState("Crear especialidad");
  const [user, setUser] = useState({})
  const [specialitys, setSpecialitys] = useState([])
  const [speciality, setSpeciality] = useState({})
  const [tiposEspecialidades, setTiposEspecialidades] = useState([])
  const [tipoEspecialidad, setTipoEspecialidad] = useState("")
  const [fechaCertificado, setFechaCertificado] = useState(null)
  const [certificado, setCertificado] = useState("")
  const [grupo, setGrupo] = useState("")
  const [grupo2, setGrupo2] = useState("")
  const [grupos, setGrupos] = useState([])
  const [palabra, setPalabra] = useState("")
  const [palabrasClave, setPalabrasClave] = useState([])
  const [busquedaIndividual, setBusquedaIndividual] = useState(false)
  const [busquedaGrupo, setBusquedaGrupo] = useState(false)

  const getSpecialitys = async(aliadoId) =>{
    let tipos = [];
    await firebase.db.collection('Aliados').doc(aliadoId).collection("Especialidades")
    .get().then(val => {
      val.docs.forEach(item=>{
        tipos.push(item.data())
      })
      setSpecialitys(tipos)
    })
  }

  async function getGrupos(){
      let tipos = []
      await firebase.db.collection('Grupos').get().then(data=>{  
      data.docs.forEach(tipo=>{
        tipos.push(tipo.data())
        tipos.sort()
      })
      setGrupos(tipos)
      });
  }
  
  function addWord(palabra){
      palabrasClave.push(palabra)
  }
  
  async function getSpecialitysTypes(){
      let tipos = []
      await firebase.db.collection('Especialidades').get().then(data=>{  
      data.docs.forEach(tipo=>{
        tipos.push(tipo.id)
        tipos.sort()
      })
      setTiposEspecialidades(tipos)
      });
  }

	useEffect(() => {
    firebase.getCurrentUser().then(val=>{
      setUser(val)
      getSpecialitys(val.aliadoId);
    });
    getGrupos();
    getSpecialitysTypes();
	}, [])

  return (
    <MuiPickersUtilsProvider utils={MomentUtils}>
    <div className="main-content-container container-fluid px-4">
       <div className="page-header align-items-center justify-content-spacebetween row no-gutters px-4 my-4">
        <div className="col-12 col-sm-5 text-center text-sm-left mb-0">
          <div className="row align-items-center">
            <div className="col">
              <p className="page-title bold"><Link className="page-title light" to="/configuration">Configuración</Link> {'>'} Especialidades</p>
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
          {
            specialitys.length > 0 ? specialitys.map(speciality=>{
              return(
                <div onClick={() => setSpeciality(speciality)} key={speciality.especialidadId}>
                  <p>{speciality.especialidad} - {speciality.certificado}</p>
                </div>
              )
            }) : <div className="text-center"><p>No hay especialidades</p></div>
          }
        </div>
        <div className="col-lg-5 col-md-5 col-sm-12">
          { speciality.especialidad != null ? <div className="card">
            <div className="card-header text-center">
              <h4>Especialidad</h4>
            </div>
            <div className="px-4">
              <div className="card-claim-box">
                <p className="card-claim-title">Especialidad</p>
                <p className="card-claim-text">{speciality.especialidad}</p>
              </div>
              <div className="card-claim-box">
                <p className="card-claim-title">Fecha del certificado</p>
                <p className="card-claim-text">{speciality.fechaCertificado}</p>
              </div>
              <div className="card-claim-box">
                <p className="card-claim-title">Grupo al que perteneze</p>
                <p className="card-claim-text">{speciality.grupo}</p>
              </div>
              <div className="card-claim-box">
                <p className="card-claim-title mb-2">Áreas de experticia</p>
                <div className="row px-2">
                  {speciality.palabrasClave.map(p => (
                      <p className="pill" key={p}>{p}</p>
                  ))}
                </div>
              </div>
              
            </div>
            <div className="card-footer">
              <div className="row">
                <div className="col-md-6 col-sm-12">
                  <button onClick={deleteReclamo} className="btn btn-outline-danger">Eliminar especialidad</button>
                </div>
                {/* <div className="col-md-6 col-sm-12">
                  <button className="btn btn-primary">Editar reclamo</button>
                </div> */}
              </div>
            </div>
          </div>
          : <form onSubmit={e => e.preventDefault() && false }>
            <div className="card">
              <div className="card-header text-center">
                <h4>Cargar especialidad</h4>
              </div>
              <div className="px-4 my-3">
                <div className="form-group">
                  <select className="form-control" value={tipoEspecialidad} onChange={e => setTipoEspecialidad(e.target.value)}>
                    {tiposEspecialidades.map(data => (
                        <option key={data} value={data}>{data}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <select className="form-control" value={grupo} onChange={e => setGrupo(e.target.value)}>
                    {grupos.map(data => (
                        <option key={data} value={data.grupoNombre}>{data.grupoNombre}</option>
                    ))}
                  </select>
                </div>
                {grupo === "Otro" ? 
                  <div className="form-group">
                    <input type="text" onChange={(e)=>{setGrupo2(e.target.value)}} placeholder="Grupo" className="form-control"/>
                  </div>
                : <div></div>}
                <div className="form-group">
                  <input type="text" onChange={(e)=>{setCertificado(e.target.value)}} placeholder="Nro. Certificado" className="form-control"/>
                </div>
                <div className="form-group spe-input">
                  <DatePicker
                    format="ddd, MMM D YYYY"
                    placeholder="Fecha del certificado"
                    maxDate={moment().toDate()}
                    label=""
                    okLabel="Listo"
                    cancelLabel="Cancelar"
                    value={fechaCertificado}
                    onChange={setFechaCertificado}
                    animateYearScrolling
                  />
                </div>
                <div className="form-row">
                  <div className="form-group col-lg 6">
                    <input type="text" onChange={e=>{setPalabra(e.target.value)}} placeholder="Área de experticia" className="form-control"/>
                  </div>
                  { palabra !== "" ?
                  <div className="form-group col-lg 6">
                    <span onClick={()=>{ setPalabrasClave([...palabrasClave, palabra]) }} className="btn btn-primary btn-block">Añadir</span>
                  </div>
                  : <div></div> }
                </div>
                <div className="px-3 row">
                  {palabrasClave.map(p => (
                    <p className="pill" key={p}>{p}</p>
                  ))}
                </div>
              </div>
              <div className="card-footer">
                <button onClick={uploadEspecialidad} className="btn btn-primary btn-block">{btnMessage}</button>
              </div>
            </div>
          </form>}
        </div>
      </div>
      

    </div>
    </MuiPickersUtilsProvider>
  )

  async function uploadEspecialidad() {
    setBtnMessage("Creando especialidad...")
    let date = Date().toLocaleString();
    let sid = firebase.db.collection("Aliados").doc(user.aliadoId).collection("Especialidades").doc().id;

    try {
      await firebase.db.collection("Aliados").doc(user.aliadoId).collection("Especialidades").doc(sid).set({
        especialidadId: sid,
        aliadoId: user.aliadoId,
        especialidad: tipoEspecialidad,
        grupo: grupo === "Otro" ? grupo2 : grupo,
        certificado: certificado,
        fechaCertificado: fechaCertificado.toString(),
        busquedaIndividual: busquedaIndividual,
        busquedaGrupo: busquedaGrupo,
        hojaProfesional: null,
        palabrasClave: palabrasClave,
        createdOn: moment().toDate()
      })
      if(grupo === "Otro"){
        await firebase.db.collection("Grupos").doc(grupo2).set({
          grupoNombre: grupo2,
          grupoId: firebase.db.collection("Grupos").doc().id,
          createdOn: moment().toDate()
        }).then((val)=>{
          firebase.db.collection("Grupos").doc(grupo2).collection("Aliados").doc(user.aliadoId).set({
            aliadoId: user.aliadoId,
          })
        })
      }else{
        await firebase.db.collection("Grupos").doc(grupo).collection("Aliados").doc(user.aliadoId).set({
          aliadoId: user.aliadoId,
        })
      }
      window.location.href = "/configuration/specialitys"
    } catch(error) {
      alert(error.message)
    }
  }
    
  async function deleteReclamo(){
    try{
      await firebase.db.collection("Aliados").doc(user.aliadoId).collection("Especialidades").doc(speciality.especialidadId).delete()
      window.location.href = "/configuration/specialitys"
    }catch(e){
      console.log("Error: " + e);
    }
  }
}

export default Specialitys