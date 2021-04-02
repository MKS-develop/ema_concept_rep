import firebase from 'firebase/app';
import 'firebase/database';
import 'firebase/storage';
import 'firebase/firestore';
import 'firebase/auth';
import moment from 'moment';
import { getAllByPlaceholderText } from '@testing-library/dom';

var firebaseConfig = {}

firebaseConfig = {
  apiKey: "AIzaSyD_FidjHLNJa3n2jvTqFt2V9_Kdvkc5qKg",
  authDomain: "mkss-9b4e0.firebaseapp.com",
  projectId: "mkss-9b4e0",
  storageBucket: "mkss-9b4e0.appspot.com",
  messagingSenderId: "1027897425378",
  appId: "1:1027897425378:web:a65aa617b67ef099eb8dbb",
  measurementId: "G-1NTTQ4W2TE"
};
console.log('Estamos en Desarrollo')

//Estoy manejando la funcionalidad de autenticación y registro del usuario en este archivo, para así poder acceder a la bd, el storage
//y la propia información del usuario desde todos lados

class Firebase {
    constructor(){
        firebase.initializeApp(firebaseConfig);
        this.auth = firebase.auth();
        this.db = firebase.firestore();
        this.storage = firebase.storage();
    }

    //Inicar sesión
    login(email, password){
        return this.auth.signInWithEmailAndPassword(email, password)
    }
    
    //Registro
    async register(email, password){
        await this.auth.createUserWithEmailAndPassword(email, password)
    }

    //Una vez se registro el usuario se crea el documento en la colección
    addUser(email, userInfo, url) {
		  if(!this.auth.currentUser) {
		  	return alert('No autorizado')
		  }
      //Esto es solo para el codigo del aliado, lo quitas si quieres
      let aliados = []
      this.db.collection('Aliados').get().then(data=>{  
        data.forEach(tipo=>{
          aliados.push(tipo.id)
        })
      })
      //Para la información del usuario estoy usando un objeto que relleno en el registro
		  return this.db.collection("Aliados").doc(this.auth.currentUser.uid).set({
        aliadoId: this.auth.currentUser.uid,
        nombre: userInfo.nombre,
        aliadoCodigo: "57-" + aliados.length,
        nombreComercial: userInfo.nombreComercial ?? userInfo.nombre,
        tipoEmpresa: userInfo.tipoEmpresa, 
        tipoAliado: userInfo.tipoAliado, 
        pais: "Colombia",
        telefono: userInfo.telefono,
        identificacion: userInfo.identificacion,
        direccion: userInfo.direccion,
        avatar: url,
        email: email,
      }).then((val)=>{
        var localidadId = this.db.collection("Localidades").doc().id
        this.db.collection("Localidades").doc(localidadId).set({
          aliadoId: this.auth.currentUser.uid,
          serviciosContiene: false,
          localidadId: localidadId,
          nombreLocalidad: "Localidad Principal",
          locacionImg: url,
          ciudad: userInfo.direccion,
          pais: "Colombia",
          lc: "Localidad Principal",
          direccionDetallada: userInfo.direccion,
          direccionLocalidad: userInfo.direccion,
          telefono: userInfo.telefono,
          otroTelefono: userInfo.telefono,
          createdOn: moment().toDate(),
        })
        
        this.db.collection("Aliados").doc(this.auth.currentUser.uid).collection("Petpoints")
        .doc(this.auth.currentUser.uid).set({
          aliadoId: this.auth.currentUser.uid,
          ppAcumulados: 500,
          ppCanjeados: 0,
          createdOn: moment().toDate(),
        })
      })
	}

  //Salir de la sesión
  logout(){
      return this.auth.signOut()
  }

  isInitialized() {
		return new Promise(resolve => {
			this.auth.onAuthStateChanged(resolve)
		})
	}
    
  isLogged() {
	    return this.auth.currentUser;
	}

  async getCurrentUser() {
		const user = await this.db.doc(`Aliados/${this.auth.currentUser.uid}`).get()        
		return user.data()
	}

}

export default new Firebase()
