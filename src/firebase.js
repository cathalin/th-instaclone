import firebase from 'firebase';

const firebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyAlsFu_w3hi5I4kAaT3lxF8njY0mBabZ-U",
    authDomain: "instaclone-3107.firebaseapp.com",
    databaseURL: "https://instaclone-3107.firebaseio.com",
    projectId: "instaclone-3107",
    storageBucket: "instaclone-3107.appspot.com",
    messagingSenderId: "524930530334",
    appId: "1:524930530334:web:65fff6249ef24ca6ad420f",
    measurementId: "G-32GELRBDPC"
});
const db = firebaseApp.firestore();
const auth = firebaseApp.auth();
const storage = firebaseApp.storage();

export { db, auth, storage };