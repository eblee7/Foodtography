import  { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth";

const app = initializeApp({
    apiKey: "AIzaSyCJVHwA1g36Su3W1K1gbSLNcjxhl2AtaWc",
    authDomain: "food-photography-8833a.firebaseapp.com",
    projectId: "food-photography-8833a",
    storageBucket: "food-photography-8833a.appspot.com",
    messagingSenderId: "878541122468",
    appId: "1:878541122468:web:e37edfccf83b457c186f31",
    measurementId: "G-RHFXL6HF0V",
})

export const auth = getAuth(app);
