import firebase from 'firebase/app';
import 'firebase/database';
import 'firebase/storage';
import 'firebase/firestore';
import 'firebase/auth';
import moment from 'moment';
import { getFirebaseApp } from './firebaseApp';

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

class Firebase {

    constructor(){
        firebase.initializeApp(firebaseConfig);
        this.auth = firebase.auth();
        this.db = firebase.firestore();
        this.storage = firebase.storage();
    }

    login(email, password){
        return this.auth.signInWithEmailAndPassword(email, password)
    }

    async register(email, password){
        await this.auth.createUserWithEmailAndPassword(email, password)
    }

  addUser(email, userInfo, url) {
		if(!this.auth.currentUser) {
			return alert('No autorizado')
		}
    let aliados = []
    this.db.collection('Aliados').get().then(data=>{  
      data.forEach(tipo=>{
        aliados.push(tipo.id)
      })
    })
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
        role: userInfo.role,
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
  
  // Crear instancia local en la función para crear el usuario 
  async createRoleUser(email, password, userInfo, url){

    let authInstance = getFirebaseApp('auth-worker');
    let authInstanceWorker = firebase.auth(authInstance);
    authInstanceWorker.setPersistence(firebase.auth.Auth.Persistence.NONE);

    try {
      const userData = await authInstanceWorker.createUserWithEmailAndPassword(email, password);
      this.db.collection("Aliados").doc(userData.user.uid).set({
        aliadoId: userData.user.uid,
        nombre: userInfo.nombre,
        // aliadoCodigo: "57-" + aliados.length,
        nombreComercial: userInfo.nombreComercial ?? userInfo.nombre,
        tipoEmpresa: userInfo.tipoEmpresa,
        tipoAliado: userInfo.tipoAliado,
        pais: "Colombia",
        telefono: userInfo.telefono,
        identificacion: userInfo.identificacion,
        direccion: userInfo.direccion,
        avatar: userInfo.avatar,
        role: userInfo.role,
        email: userData.user.email,
      }).then((val)=>{
        this.db.collection("Aliados").doc(this.auth.currentUser.uid).collection("Usuarios").doc(userData.user.uid).set({
          aliadoId: userData.user.uid,
        }).then((val)=>{
          window.location.href = "/employes";
        })
      })
    } catch (error) {
      return alert(error);
    }
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
