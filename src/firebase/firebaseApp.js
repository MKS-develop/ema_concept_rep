import firebase from 'firebase/app';
import 'firebase/database';
import 'firebase/storage';
import 'firebase/firestore';
import 'firebase/auth';

export const getFirebaseApp = (name, firebaseConfig) => {
    let foundApp = firebase.apps.find(app => app.name === name);
    return foundApp ? foundApp : firebase.initializeApp( firebaseConfig || firebase.app().options, 'auth-worker');
}