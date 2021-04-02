import React, {useState, useEffect} from 'react'
import firebase from '../firebase/config'
import {Link} from 'react-router-dom';
import moment from 'moment';
import { MuiPickersUtilsProvider, DatePicker } from '@material-ui/pickers';
import MomentUtils from '@date-io/moment';

function DoctorSignUp() {
    const [btnMessage, setBtnMessage] = useState("Terminar registro");
    const [user, setUser] = useState({})
    const [tiposEspecialidades, setTiposEspecialidades] = useState([])
    const [tipoEspecialidad, setTipoEspecialidad] = useState("")
    const [fechaCertificado, setFechaCertificado] = useState(null)
    const [hojaProfesional, setHojaProfesional] = useState("")
    const [certificado, setCertificado] = useState("")
    const [grupo, setGrupo] = useState("")
    const [grupo2, setGrupo2] = useState("")
    const [grupos, setGrupos] = useState([])
    const [palabra, setPalabra] = useState("")
    const [palabrasClave, setPalabrasClave] = useState([])
    const [busquedaIndividual, setBusquedaIndividual] = useState(false)
    const [busquedaGrupo, setBusquedaGrupo] = useState(false)
    const [error, setError] = useState(false)
    const [emessage, setEmessage] = useState("")

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
      });
      getGrupos();
      getSpecialitysTypes();
      }, [])
  
  return (
    <MuiPickersUtilsProvider utils={MomentUtils}>
    <main className="container">
      {error 
      ? <div className="alert alert-danger alert-dismissible fade show mb-0 mt-2" role="alert">
              <button onClick={()=>{setError(false)}} className="close" data-dismiss="alert" aria-label="Close">
              <span aria-hidden="true">×</span>
              </button>
              <i className="fa fa-exclamation-triangle mx-2"></i>
              <strong>Cuidado!</strong> {emessage}
          </div>
      : <div></div>
      }
      <div className="h-100vh row no-gutters flow-column align-items-center">
        <form className="bg-white p-5 rounded mt-5" onSubmit={e => e.preventDefault() && false }>
            <h3 className="mb-5">Registra tu especialidad</h3>
            <div className="form-group mt-5">
              <select className="form-control" value={tipoEspecialidad} onChange={e => setTipoEspecialidad(e.target.value)}>
                {tiposEspecialidades.map(data => (
                    <option key={data} value={data}>{data}</option>
                ))}
              </select>
            </div>    
            <div className="form-group">
              <select className="form-control" value={grupo} onChange={e => setGrupo(e.target.value)}>
                {grupos.map(data => (
                    <option key={data.grupoNombre} value={data.grupoNombre}>{data.grupoNombre}</option>
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
            <div className="form-group">
              <input type="text" onChange={(e)=>{setHojaProfesional(e.target.value)}} placeholder="Resúmen de la hoja profesional" className="form-control"/>
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
            <button onClick={onRegister} className="btn btn-primary btn-block"> {btnMessage} </button>
        </form>
      </div>
	</main>
    </MuiPickersUtilsProvider>
    )

    async function onRegister() {
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
                hojaProfesional: hojaProfesional,
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
            window.location.href = "/";
		} catch(e) {
			alert(e.message)
		}
	}

}

export default DoctorSignUp