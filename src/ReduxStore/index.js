// store.js

import { combineReducers } from "redux";
import { LoginSignUpSlicee } from "./Slices/auth"; // Ensure logout action is exported

import { configureStore } from "@reduxjs/toolkit";
import { loadState, saveState } from "./utils/localStorage";


const appReducer = combineReducers({
  auth: LoginSignUpSlicee,
});


const rootReducer = (state, action) => {

  return appReducer(state, action);
};


// jo kuch bhi state me change ho raha wo redux state and local storage state dono jahgah update ho raha


// with the  help of (preloadedState) ,  we are getting the data from localstorage and putting that in redux store. 
// with the  help of saveState(Store.getState()) ,  we are set or saving  the data to localstorage from redux store . 

//when we used store.subscribe() it measn whatever we are written in callback.. they work just after whatever we are changing in state.


// Load persisted state
const persistedState = loadState();

const Store = configureStore({
  reducer: rootReducer, 
  preloadedState: persistedState, //if any data exxist in local just use to save in store.
  devTools: process.env.NODE_ENV !== 'production', // disable in production
});

Store.subscribe(() => {
  console.log(Store.getState());
  
  saveState(Store.getState()); // Subscribes to the Redux store — so that whenever anything changes, the entire Redux state is saved to localStorage
});

export default Store;


//Here Store has inbuilt Function Like



// store.getState()

//1.  // const unsubscribe = store.subscribe(() => {
    //   console.log('State changed!', store.getState());   
   // });

    // unsubscribe();



    // store.subscribe(listener)

//2  // const state = store.getState();
       // console.log(state.auth.isLoggedIn);

