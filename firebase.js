// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth'; //로그인 인증 기능
import { getFirestore } from 'firebase/firestore'; // 데이터베이스 연걸?
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAIa69i5SXAUZnYSVRgoXK9SZI2E_QtbHA",
  authDomain: "able-a5d50.firebaseapp.com",
  projectId: "able-a5d50",
  storageBucket: "able-a5d50.firebasestorage.app",
  messagingSenderId: "28186858085",
  appId: "1:28186858085:web:c7bd86ac2d6eaaec82ec8c",
  measurementId: "G-TTZEV09YZ9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app); // firestore 인스턴스 생성

export { auth, db };