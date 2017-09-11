import firebase from 'firebase';

var config = {
    apiKey: "AIzaSyCCh4NkFjHPPyOcfnFHUUhahmloB04WdiE",
    authDomain: "pomodoro-979f2.firebaseapp.com",
    databaseURL: "https://pomodoro-979f2.firebaseio.com",
    projectId: "pomodoro-979f2",
    storageBucket: "",
    messagingSenderId: "297458746146"
}

firebase.initializeApp(config);

export default firebase;
