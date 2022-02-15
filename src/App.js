import logo from './logo.svg';
import ostv from './ostv.png'
import './App.css';
import Tv from './Tv.js';
import { initializeApp } from "firebase/app";
import { getStorage, ref, listAll } from "firebase/storage";
import react from 'react';

const firebaseConfig = {
  apiKey: "AIzaSyDdvmlYE1K1ABaxtQFY8cP0bg40px5Ye28",
  authDomain: "mems-c39f6.firebaseapp.com",
  projectId: "mems-c39f6",
  storageBucket: "mems-c39f6.appspot.com",
  messagingSenderId: "513012563483",
  appId: "1:513012563483:web:5079ef4abac4da434242be"
};

class App extends react.Component {

  constructor(props) {
    super(props);
    const app = initializeApp(firebaseConfig);

    // console.log(app)
    // const storage = getStorage();
    // const listRef = ref(storage, '/');

    // res = await listRef.listAll();
    // res.items.forEach((itemRef) => {
    // // All the items under listRef.
    // console.log("item", itemRef);
    // });
  }

  render(){
    return (
      <div className="App w-screen h-screen bg-cream border-solid border-2 border-indigo-600
      flex justify-center items-center" >
          <Tv/>
      </div>
    );

  }
}

export default App;
