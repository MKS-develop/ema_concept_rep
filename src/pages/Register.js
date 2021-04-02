import React, {useState, useEffect} from 'react'
import firebase from '../firebase/config'

function Register() {

	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [nombreCompleto, setNombreCompleto] = useState('')
	const [nombreComercial, setNombreComercial] = useState('')
	const [tipoEmpresa, setTipoEmpresa] = useState('')
	const [tipoAliado, setTipoAliado] = useState('')
	const [telefono, setTelefono] = useState('')
	const [identificacion, setIdentificacion] = useState('')
	const [direccion, setDireccion] = useState('')
  const [tiposDeAliados, setAliados] = useState([])
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

  useEffect(()=>{
    getAliados();
  },[]);

  return (
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
        <form className="bg-white p-5 rounded mt-5 w-100" onSubmit={e => e.preventDefault() && false }>
            <div className="row mb-5">
              <div className="form-register-image mx-auto">
                <img src="../images/logo.png" alt="MKS Salud Aliados Aliados" alt=""/>
              </div>
              <input type="file"
                ref={hiddenFileInput}
                onChange={handleChange} 
                style={{display: 'none'}}
              />
              <div onClick={handleClick} className="register-img">
                {src !== "" ? <img src={src} alt="" /> : <div className="register-img-upload"><p className="material-icons icon mb-0">add</p></div>}
              </div>
            </div>
                  <div className="form-row">
                    <div className="form-group col-md-6">
                      <input type="text" className="form-control" onChange={(e) => setEmail(e.target.value)} placeholder="Email" value={email} />
                    </div>
                    <div className="form-group col-md-6">
                      <div className="row align-items-center">
                        <div className="col-md-11">
                          <input type={sp ? "text" : "password"} className="form-control" onChange={(e) => setPassword(e.target.value)} placeholder="Contraseña" value={password} />
                        </div>
                        <span onClick={()=>{setShowPassword(!sp)}} className="material-icons mb-0">{sp ? "visibility_off" : "visibility" }</span>
                      </div>
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group col-md-6">
                      <input type="text" className="form-control" onChange={(e) => setNombreCompleto(e.target.value)} placeholder="Nombre completo" value={nombreCompleto} />
                    </div>
                    <div className="form-group col-md-6">
                      <input type="text" className="form-control" onChange={(e) => setNombreComercial(e.target.value)} placeholder="Nombre comercial" value={nombreComercial} />
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group col-md-6">
                      <select className="form-control" value={tipoEmpresa} onChange={(e) => setTipoEmpresa(e.target.value)}>
                        {tiposEmpresa.map(data => (
                            <option key={data} value={data}>{data}</option>
                        ))}
                      </select>
                    </div>
                    <div className="form-group col-md-6">
                      <select className="form-control" value={tipoAliado} onChange={e => setTipoAliado(e.target.value)}>
                        {tiposDeAliados.map(data => (
                            <option key={data} value={data}>{data}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group col-md-6">
                      <input type="text" className="form-control" onChange={(e) => setTelefono(e.target.value)} placeholder="Teléfono" value={telefono} />
                    </div>
                    <div className="form-group col-md-6">
                      <input type="text" className="form-control" onChange={(e) => setIdentificacion(e.target.value)} placeholder="Identificación" value={identificacion} />
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group col-md-6">
                      <input type="text" className="form-control" onChange={(e) => setDireccion(e.target.value)} placeholder="Dirección" value={direccion} />
                    </div>
                  </div>
          <button onClick={onRegister} className="btn btn-primary"> Registrate </button>
        </form>
      </div>
		</main>
    )

    async function onRegister() {
      //Aquí estoy rellenando la información del usuario para utilizarla en el archivo "config"
        const userInfo = {
            nombre: nombreCompleto,
            nombreComercial: nombreComercial ?? nombreCompleto,
            tipoEmpresa: tipoEmpresa, 
            tipoAliado: tipoAliado, 
            telefono: telefono,
            identificacion: identificacion,
            direccion: direccion,
        }

		try {
      //Vas a ver mucho este "firebase.CUALQUIERCOSA" y es porque estoy utilizando 
      //la clase de firebase del arhcivo "config" donde estan todas estas funcionalidades
      await firebase.register(email, password)
      //Con esto pasa lo mismo, llamo a la clase "firebase" y su instancía "storage" que definí en el archivo
      //"config"
      await firebase.storage.ref(`/Aliados imagenes/${file.name}`).put(file)
      await firebase.storage.ref("Aliados imagenes").child(file.name).getDownloadURL().then((urlI) => {
        //Imagino que ya sabes que lo mismo pasa aquí, la función "AddUser" esta en el archivo "config"
        //y le estoy pasando el objeto del usuario anteriormente creado como parametro
        firebase.addUser(email, userInfo, urlI).then((val)=>{
          if(userInfo.tipoAliado === "Médico"){
            window.location.href = "/register/doctor_register";
          }else{
            window.location.href = "/";
          }
        })
      })
		} catch(e) {
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
			// alert(error.message)
		}
	}

}

export default Register
