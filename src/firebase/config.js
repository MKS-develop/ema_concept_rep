import firebase from 'firebase/app';
import 'firebase/database';
import 'firebase/storage';
import 'firebase/firestore';
import 'firebase/auth';
import moment from 'moment';
import { getFirebaseApp } from './firebaseApp';

var firebaseConfig = {}

firebaseConfig = {
  apiKey: "AIzaSyDdx-OuI2xsOXP_jA9VYRDibPK6aEFxwWA",
  authDomain: "ema-dev-2fe4b.firebaseapp.com",
  projectId: "ema-dev-2fe4b",
  storageBucket: "ema-dev-2fe4b.appspot.com",
  messagingSenderId: "523189819320",
  appId: "1:523189819320:web:64dd19807351c71967e14d",
  measurementId: "G-WY5PKK9DNZ"
};

console.log('Estamos en Desarrollo')

class Firebase {

    constructor(){
        firebase.initializeApp(firebaseConfig);
        firebase.firestore().settings({experimentalForceLongPolling: true});
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
        pais: "México",
        countRatings: 0,
        totalRatings: 0,
        telefono: userInfo.telefono,
        masterId: this.auth.currentUser.uid,
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
        nombreLocalidad: userInfo.localidad,
        locacionImg: url,
        ciudad: userInfo.localidad,
        pais: "México",
        lc: "Localidad Principal",
        direccionDetallada: userInfo.direccion,
        direccionLocalidad: userInfo.localidad,
        telefono: userInfo.telefono,
        otroTelefono: userInfo.telefono,
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
        masterId: this.auth.currentUser.uid,
        pais: "México",
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

  async createClient(aliadoId, clientes, email, password, userInfo, url, data){

    let authInstance = getFirebaseApp('auth-worker');
    let authInstanceWorker = firebase.auth(authInstance);
    authInstanceWorker.setPersistence(firebase.auth.Auth.Persistence.NONE);
  
    try {
      const uid = await (await authInstanceWorker.createUserWithEmailAndPassword(email, password)).user.uid;
      this.db.collection("Dueños").doc(uid).set({
        uid: uid,
        email: email,
        identificacion: data["identificacion"],
        edad: data["edad"],
        telefono: data["telefono"],
        user: userInfo,
        dadsLastName: data["dadsLastName"],
        momsLastName: data["momsLastName"],
        codPostal: data["codPostal"],
        url: url,
        password: password,
        direccion: data["direccion"],
        bienvenida: true,
        walkin: true,
        // token: token,
        registroCompleto: false,
      })
      this.db.collection("Aliados").doc(aliadoId).collection("Clients").doc(uid).set({
        uid: uid,
        email: email,
        identificacion: data["identificacion"],
        edad: data["edad"],
        telefono: data["telefono"],
        user: userInfo,
        dadsLastName: data["dadsLastName"],
        momsLastName: data["momsLastName"],
        url: url,
        walkin: true,
      })
      return uid
    } catch (error) {
      return "error";
    }
  }

  async getCountryInfo(pais){
    let data = await this.db.collection("Ciudades").doc(pais).get()
    return data
  }

  async getRoleInfo(rol){
    let list = []
    let dataDefault = {
      canMakeReserves: false,
      canAccessAgenda: false,
      canViewClients: false,
      canChargeFile: false,
      canViewAllCenters: false,
      canFilterByStatus: false
    }
    await this.db.collection("Roles").get().then((v)=>{
      v.docs.forEach((d)=>{
        list.push(d.data())
      })
    })

    let data = list.filter((prv)=>( prv["roleId"] === rol ))
    
    return data[0]
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
