import React, { useState } from 'react'
import firebase from '../firebase/config'
import {Link} from 'react-router-dom';

function Login() {

    const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [error, setError] = useState(false)
    const [emessage, setEmessage] = useState("")
	
    return (
		<div className="container">
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
			<main className="h-100vh row flow-column align-items-center">
				<form className="login-form-container" onSubmit={e => e.preventDefault() && false }>
					<div className="form-image">
						<img src="../images/logo.png" alt="EMA  Aliados Aliados"/>
					</div>
					<div className="bg-white w-100 text-center rounded p-4">
						<div className="form-group col-lg-12 mb-4">
						<input type="text" className="form-control" onChange={(e) => setEmail(e.target.value)} placeholder="Email" value={email} />
						</div>
						<div className="form-group col-lg-12 mb-4">
						<input type="password" className="form-control" onChange={(e) => setPassword(e.target.value)} placeholder="Contraseña" value={password} />
						</div>
						<button
							onClick={login}
							className="btn btn-primary btn-block mb-4">
							Iniciar sesión
						</button>
						<Link
							to="/register"
							className="color-primary">
							¿No tienes cuenta aún?, regístrate
						</Link>
					</div>
				</form>
			</main>
		</div>
    )

    async function login() {
		try {
			await firebase.login(email, password)
            window.location.href = "/";
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

export default Login
