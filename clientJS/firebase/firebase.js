// import * as firebase from 'firebase/app'
import * as firebase from 'firebase';
import 'firebase/firestore';

const config = {
  apiKey: "AIzaSyBIYxHZ9E61e2rZ5Ch8jtpnPMS8xoYWda8",
  authDomain: "webnotes-938a4.firebaseapp.com",
  databaseURL: "https://webnotes-938a4.firebaseio.com",
  projectId: "webnotes-938a4",
  storageBucket: "webnotes-938a4.appspot.com",
  messagingSenderId: "192500259507",
  appId: "1:192500259507:web:70f720d651c64324b12ec6"
}

firebase.initializeApp(config)

export default firebase