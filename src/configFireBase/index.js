// Import the functions you need from the SDKs you need
// import { initializeApp } from 'firebase/app';
// import { getAnalytics } from 'firebase/analytics';
import firebase from 'firebase/compat/app';
import 'firebase/compat/storage';

const firebaseConfig = {
    apiKey: 'AIzaSyD4LSH_2OBbOZgUCiiVVSY8AE9zWVGnucA',
    authDomain: 'watches-395b6.firebaseapp.com',
    projectId: 'watches-395b6',
    storageBucket: 'watches-395b6.appspot.com',
    messagingSenderId: '248543532683',
    appId: '1:248543532683:web:18a1a45d029ed4cf78268e',
    measurementId: 'G-ETV6HVEQG1',
};

firebase.initializeApp(firebaseConfig);

const storage = firebase.storage();

export { storage };
