import React, {useState, useEffect, useRef} from 'react'
import firebase from '../../firebase/config'
import {Link, useHistory} from 'react-router-dom';
import moment from 'moment';
import {Editor, EditorState, RichUtils} from 'draft-js';
import 'draft-js/dist/Draft.css';
import Compressor from 'compressorjs';

function Events() {

  const history = useHistory()

    const hiddenFileInput = useRef(null);

    const inputDescRef = useRef(null);
    const inputTitleRef = useRef(null);

    const [btnMessage, setBtnMessage] = useState("Crear evento");
    const [events, setEvents] = useState([])
    const [compressedFile, setCompressedFile] = useState(null);
    const [update, setUpdate] = useState(false);
    const [error, setError] = useState(false) 
    const [success, setSuccess] = useState(false);

    const [searchName, setSearchName] = useState("")
    const [searchCategorie, setSearchCategorie] = useState("")
    const [searchStatus, setSearchStatus] = useState("")

    const [emessage, setEmessage] = useState("")
    const [successMsg, setSuccessMsg] = useState("");
    const [user, setUser] = useState({})
    
    const [event, setEvent] = useState({
      title: "",
      description: "",
      event: Date.now()
    })
    
    const [file, setFile] = useState(null);
    const [url, setURL] = useState("");
    const [src, setImg] = useState('');

    let listCategories = [
      "Mastografía",
      "Salud",
      "Cuidados",
      "Consejos",
    ]

    const handleClick = event => {
      hiddenFileInput.current.click();
    };

    function handleChange(e) {
      setImg(URL.createObjectURL(e.target.files[0]));    
      setFile(e.target.files[0]);
    }

    const getEvents = async(aliadoId) =>{
      let tipos = [];
      await firebase.db.collection('Events').where("subjectId", "==", "A" + aliadoId)
      .get().then(val => {
        val.docs.forEach(item=>{
          tipos.push(item.data())
          tipos.sort()
        })
        setEvents(tipos)
      })
    }
  
    const handleCompressedUpload = (e) => {
      const image = e.target.files[0];
      new Compressor(image, {
        quality: 0.8, // 0.6 Se puede usar también, pero no es recomendado ir más abajo.
        success: (compressedResult) => { 
          setCompressedFile(compressedResult)
        },
      });
    };

    function checkInputs(object){
      let val = 0
      let array = []
      object["file"] = file
      Object.keys(object).forEach(function(key) {
        if(update){
            if (object[key] === '') {
              val++
              array.push(key)
            }
        }else{
            if (object[key] === '' || object[key] === null) {
                val++
                array.push(key)
              }
        }
      });
      if(val > 0){
        setError(true)
        setEmessage("Todos los campos son requeridos")
        setTimeout(() => {
          setError(false)
        }, 4000);
        setBtnMessage("Crear evento")
      }else{
        update ? updateEvent() : uploadEvent()
      }
      return val > 0 ? true : false
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

    useEffect(() => {
        firebase.getCurrentUser().then((val)=>{
          setUser(val)
          getEvents(val.aliadoId)
        });
      }, [])

    return (
      <div className="main-content-container container-fluid px-4">
            {success && <SuccessComponent msg={successMsg === "" ? "Producto cargado exitosamente" : successMsg}/>}
            {error && <ErrorComponent msg={emessage === "" ? "Todos los campos son requeridos" : emessage}/>}
            <div className="page-header align-items-center justify-content-spacebetween row no-gutters px-4 my-4">
              <div className="col-12 col-sm-5 text-center text-sm-left mb-0">
                <div className="row align-items-center">
                  <div className="ml-2 col row">
                    <p className="page-title bold"> <span>Eventos</span></p>
                  </div>
                </div>
              </div>
              <div className="col-12 col-sm-1 mb-0">
                <div className="row align-items-center justify-content-space-around level-2">
                  <i className="material-icons color-white display-5 cursor-pointer">help_outline</i>
                </div>
              </div>
            </div>

            <div className="my-3 row no-gutters align-items-center">
                <div className="form-group mr-3 mb-0 col-lg-2">
                    <input type="text" placeholder="Nombre del evento" className="form-control" onChange={(e)=>{ setSearchName(e.target.value) }}/>
                </div>
                <div className="form-group mr-3 mb-0 col-lg-2">
                    <select className="form-control" onChange={(e) => { setSearchCategorie(e.target.value) }}>
                        <option value="">Categoría</option>
                        {listCategories.map(data => (
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

                <button className="btn btn-primary mr-3 col-lg-1" onClick={()=>{getEvents( user.aliadoId )}}><i className="material-icons">search</i></button>

                <div onClick={()=>{ 
                    history.push({
                      pathname: "/events/detail", 
                      state: {update: false}
                    })
                  }} className="btn btn-primary mr-3">
                    Agregar nuevo evento<i className="material-icons ml-2">add</i>
                </div>

            </div>
            
            <div className="position-relative">

              <div className="event-row-products-container-title">
                <p className="event-row-products-container-title-value">-</p>
                <p className="event-row-products-container-title-value">Titulo del evento</p>
                <p className="event-row-products-container-title-value">Fecha</p>
                <p className="event-row-products-container-title-value">Hora</p>
                <p className="event-row-products-container-title-value">Costo</p>
                <p className="event-row-products-container-title-value">Registrados</p>
                <p className="event-row-products-container-title-value">Dónde</p>
              </div>
              
              { events.length > 0 ? events.map((e, i) => {
                /* let precioRounded = Math.round(prod.precio * 100) / 100 */
                let date = moment(e.date).format("DD/MM/YYYY")
                return(
                  <div onClick={()=>{ 
                    history.push({
                      pathname: "/events/detail", 
                      state: { event: e, update: true}
                    })
                  }} className="event-row-products-container-title row-products-container-data" key={i}>
                      <img src={e.media[0]["url"]} alt="" className="row-products-container-img" />
                      <p className="event-row-products-container-p-value">{e.title}</p>
                      <p className="event-row-products-container-p-value">{date}</p>
                      <p className="event-row-products-container-p-value">{e.hour ?? "12:00" }</p>
                      <p className="event-row-products-container-p-value">{(e.price === undefined || e.price.toString() === "NaN") ?? "-"}</p>
                      <p className="event-row-products-container-p-value">{e.registeredSubjects?.length ?? "-"}</p>
                      <p className="event-row-products-container-p-value">{e.where ?? "-"}</p>
                  </div>
                )
                }) : <div className="text-center"><p>No hay eventos</p></div> 
              }
                
            </div>

          </div>
    )

    async function uploadEvent() {
      setBtnMessage("Subiendo...")
      let id = firebase.db.collection("Events").doc().id;
      try {
        await firebase.storage.ref(`/Events imagenes/${file.name}`).put(file)
        firebase.storage.ref("Events imagenes").child(file.name).getDownloadURL().then((url) => {
          firebase.db.collection("Events").doc(id).set({
            subjectId: "A" + user.aliadoId,
            country: "Perú",
            createdOn: moment().toDate(),
            date: event.date,
            description: event.description,
            eventId: id,
            features: [],
            media: [{
                index: 1,
                type: "photo",
                url: url
            }],
            status: "approved",
            title: event.title
          })
        })
        getEvents(user.aliadoId)
        setSuccess(true)
        setFile(null)
        setURL("");
        setImg('');
        inputTitleRef.current.value = ""
        inputDescRef.current.value = ""
        setSuccessMsg("Evento cargado exitosamente")
        setTimeout(() => {
          setSuccess(false)
          window.location.href = "/events"
        }, 4000);
        setBtnMessage("Crear evento")
        window.scrollTo(0, 0)
      } catch(error) {
        alert(error.message)
      }
    }
      
    async function updateEvent(){
      if(file){
        await firebase.storage.ref(`/Events/${file.name}`).put(file)
        firebase.storage.ref("Events").child(file.name).getDownloadURL().then((url) => {
          firebase.db.collection("Events").doc(event.eventId).update({
            media: [{
                index: 1,
                type: "photo",
                url: url
            }],
            title: event.title,
            description: event.description,
            date: event.date
          })
        })
        getEvents(user.aliadoId)
      }else{
        try {
          await firebase.db.collection("Events").doc(event.eventId).update({
            title: event.title,
            description: event.description,
            date: event.date
          })
          getEvents(user.aliadoId)
        } catch (e) {
          alert(e.message)
        }

      }
    }
  
    async function deleteEvent(){
      try{
        await firebase.db.collection('Events').doc(event.eventId).delete()
        getEvents(user.aliadoId)
        setEvent({})
      }catch(e){
        console.log("Error: " + e);
      }
    }

}

export default Events
