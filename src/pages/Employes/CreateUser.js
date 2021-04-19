import React, {useState, useEffect} from 'react'
import firebase from '../../firebase/config'
import {Link} from 'react-router-dom';

function CreateUser() {

    const [btnMessage, setBtnMessage] = useState("Crear usuario");
    const [user, setUser] = useState({})
    const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [nombreCompleto, setNombreCompleto] = useState('')
	const [nombreComercial, setNombreComercial] = useState('')
	const [tipoEmpresa, setTipoEmpresa] = useState('')
	const [tipoAliado, setTipoAliado] = useState('')
	const [telefono, setTelefono] = useState('')
	const [identificacion, setIdentificacion] = useState('')
	const [direccion, setDireccion] = useState('')
    const [aliados, setAliados] = useState([])
    const [roles, setRoles] = useState([])
    const [rol, setRol] = useState("")
    const [error, setError] = useState(false)
    const tiposEmpresa = ["Jurídica", "Natural"]
    const [sp, setShowPassword] = useState(false)
    const [emessage, setEmessage] = useState("")
    const hiddenFileInput = React.useRef(null);

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
    
    function getAliados(){
        let tipos = []
        firebase.db.collection('TipoAliado').get().then(data=>{  
        data.forEach(tipo=>{
            tipos.push(tipo.id)
            tipos.sort()
        })
        setAliados(tipos)
        })
        .catch(e=>{
        console.error("Error TipoAliado:",e)
        })
    }

    async function getRoles(id){
        let tipos = []
        await firebase.db.collection('Roles').where("aliadoId", "==", id).get().then(data=>{  
            data.docs.forEach(tipo=>{
                tipos.push(tipo.data())
            })
            setRoles(tipos)
        });
    }

    useEffect(() => {
        async function fetchData() {
            await firebase.getCurrentUser().then((val)=>{
                setUser(val)
                getRoles(val.aliadoId)
            })
        }
        fetchData()
        getAliados()
    })

    return (

        <div className="main-content-container container-fluid px-4">
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
            <div className="page-header align-items-center justify-content-spacebetween row no-gutters px-4 my-4">
              <div className="col-12 col-sm-5 text-center text-sm-left mb-0">
                <div className="row align-items-center">
                    <Link to="/employes" className="ml-3 mr-3 page-title">Regresar</Link>
                </div>
              </div>
              <div className="col-12 col-sm-1 mb-0">
                <div className="row align-items-center justify-content-space-around">
                  <i className="material-icons color-white display-5">help_outline</i>
                </div>
              </div>
            </div>
            <div className="row w-100">
                <div className="col-lg-5 col-md-5 col-sm-12 mx-auto">
                    <form onSubmit={e => e.preventDefault() && false }>
                        <div className="card">
                            <div className="card-header text-center">
                                <h4>Crear usuario</h4>
                            </div>
                            <div className="px-4 py-4">
                                <div className="mb-5">
                                  
                                  <input type="file"
                                    ref={hiddenFileInput}
                                    onChange={handleChange} 
                                    style={{display: 'none'}}
                                  />
                                  <div onClick={handleClick} className="register-img">
                                    {src !== "" ? <img src={src} alt="" /> : <div className="register-img-upload"><p className="material-icons icon mb-0">add</p></div>}
                                  </div>
                                </div>
                                <div className="form-group">
                                    <input type="text" className="form-control" onChange={(e) => setNombreCompleto(e.target.value)} placeholder="Nombre del usuario" value={nombreCompleto} />
                                </div>
                                <div className="form-group">
                                  <select placeholder="Pureba" className="form-control" value={rol} onChange={e => setRol(e.target.value)}>
                                      <option>Selecciona el rol del usuario</option>
                                    {roles.map(data => (
                                        <option key={data.roleId} value={data.roleId}>{data.roleNombre}</option>
                                    ))}
                                  </select>
                                </div>    
                                <div className="form-group">
                                    <input type="text" className="form-control" onChange={(e) => setTelefono(e.target.value)} placeholder="Teléfono" value={telefono} />
                                </div>
                                <div className="form-group">
                                    <input type="text" className="form-control" onChange={(e) => setIdentificacion(e.target.value)} placeholder="Identificación" value={identificacion} />
                                </div>
                                <div className="form-group">
                                    <input type="text" className="form-control" onChange={(e) => setEmail(e.target.value)} placeholder="Email" value={email} />
                                </div>
                                <div className="form-group">
                                    <div className="row align-items-center">
                                        <div className="col-md-11">
                                            <input type={sp ? "text" : "password"} className="form-control" onChange={(e) => setPassword(e.target.value)} placeholder="Contraseña" value={password} />
                                        </div>
                                        <span onClick={()=>{setShowPassword(!sp)}} className="material-icons mb-0">{sp ? "visibility_off" : "visibility" }</span>
                                    </div>
                                </div>
                            </div>
                            <div className="card-footer">
                                <button onClick={()=>{onRegister()}} className="btn btn-primary btn-block">{btnMessage}</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>

          </div>
    )    

    async function onRegister() {
        setBtnMessage("Cargando...")
        try {
            await firebase.storage.ref(`/Aliados imagenes/${file.name}`).put(file)
            await firebase.storage.ref("Aliados imagenes").child(file.name).getDownloadURL().then((urlI) => {
                const userInfo = {
                    avatar: urlI,
                    nombre: nombreCompleto,
                    nombreComercial: user.nombreComercial,
                    tipoEmpresa: user.tipoEmpresa, 
                    tipoAliado: user.tipoAliado, 
                    telefono: telefono,
                    identificacion: identificacion,
                    direccion: direccion,
                    role: rol,
                }
                firebase.createRoleUser(email, password, userInfo, urlI)                    
            })
        } catch(e) {
            setBtnMessage("Crear usuario")
            switch(e.message) {
                case "The email address is badly formatted.":
                    setError(true)
                    setEmessage("Debes ingresar un email correcto");
                break;
                case "There is no user record corresponding to this identifier. The user may have been deleted.":
                    setError(true)
                    setEmessage( "El usuario no existe");
                break;
                case "The password is invalid or the user does not have a password.":
                    setError(true)
                    setEmessage("Contraseña incorrecta. Intenta ingresar la correcta");
                break;
                case "The email address is already in use by another account.":
                    setError(true)
                    setEmessage("Tu cuenta ya está registrada con nosotros, si deseas hacer algún cambio o una compra descarga nuestra aplicación.");

                break;
                case "Password should be at least 6 characters":
                    setError(true)
                    setEmessage("La contraseña debe ser mayor a 5 caracteres");

                break;
                default:
                    setError(true)
                    setEmessage(e.message);
          
                break;
            }
        }
      }

}

export default CreateUser
