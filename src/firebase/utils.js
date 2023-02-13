import firebase from 'firebase/app';
import 'firebase/database';
import 'firebase/storage';
import 'firebase/messaging';
import 'firebase/firestore';
import 'firebase/auth';
import moment from 'moment';

class Utils {
  
    constructor(){
      this.db = firebase.firestore();
    }

    async getAllDaysAgenda(id) {
        let localidadesList = []
        let serviciosList = []
        let array = []
        await this.db.collection("Localidades").where("aliadoId", "==", id).get().then((localidades)=>{
            Promise.all(localidades.docs.map(async (doc) => {
                localidadesList.push(doc.id)
            }))
        }).then(() => {
            Promise.all(localidadesList.map(async (lic) => {
                let localidadId = lic
                await this.db.collection("Localidades").doc(lic).collection("Servicios").get().then((servicios)=>{
                    Promise.all(servicios.docs.map(async (doc) => {
                        let o = {
                            servicioId: doc.id,
                            localidadId: localidadId,
                        }
                        serviciosList.push(o)
                    }))
                }).then(()=>{
                    Promise.all(serviciosList.map(async (servicio) => {
                        await this.db.collection("Localidades").doc(servicio.localidadId).collection("Servicios").doc(servicio.servicioId).collection("Agenda").orderBy("date", "asc").get().then((dias)=>{
                            Promise.all(dias.docs.map(async (doc) => {
                                let diaO = doc.data().date.toDate()
                                let diaMoment = moment(doc.data().date.toDate()).format("ddd, MMM D YYYY")
                                let object = {
                                    fecha: diaMoment,
                                    date: diaO,
                                    servicioId: servicio.servicioId,
                                    localidadId: servicio.localidadId
                                }
                                array.push(object)
                                // console.log(object)
                            }))
                            // array.push(servicio)
                        })
                    }))
                })
            }))
        })

        return array
	}
    
    checkIfContainsLetters(value){
        var regExp = /[a-zA-Z]/g;
        let result = false
        if(regExp.test(value)){
            result = true
        }else{
            result = false
        }
        return result
    }

    async getPetInterested(aliadoId){
        let array = []
        //Se obtienen todas las mascotas del aliado
        await this.db.collection("Mascotas").where("aliadoId", "==", aliadoId).get().then((mascotas)=>{
            Promise.all(mascotas.docs.map(async (mDoc) => {
                let mascota = mDoc.data()
                //Se obtienen los ids de los interesados desde la subcollection de la mascota
                await this.db.collection("Mascotas").doc(mascota.mid).collection("Interesados").get().then((idsOwners)=>{
                    idsOwners.docs.forEach((idOwner)=>{
                        let interesadoDoc = idOwner.data()
                        //Se obtiene la info del interesado junto a información adicional de la mascota
                        this.db.collection("Dueños").doc(interesadoDoc.uid).get().then((o)=>{
                            let owner = o.data()
                            owner["petthumbnailUrl"] = mascota.petthumbnailUrl
                            owner["petUid"] = mascota.uid
                            owner["namePet"] = mascota.nombre
                            owner["mid"] = mascota.mid
                            owner["newOwner"] = mascota.newOwner
                            array.push(owner)
                        })
                    });
                })
            }))
        })
        return array
    }

}

export default new Utils()
