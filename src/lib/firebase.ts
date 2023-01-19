import firebase, { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyCmzpMs2ObZH6tEvtDo5LkSXW4ghVUiV5A",
  authDomain: "web-todo-a65f8.firebaseapp.com",
  projectId: "web-todo-a65f8",
  storageBucket: "web-todo-a65f8.appspot.com",
  messagingSenderId: "720580900948",
  appId: "1:720580900948:web:34c3aaf1c5d1820b7955c1",
  measurementId: "G-ZY1LD7X8YX",
};

const firebaseApp = initializeApp(firebaseConfig);

export default firebaseApp;
