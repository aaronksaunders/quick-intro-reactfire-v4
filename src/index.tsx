import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import * as serviceWorkerRegistration from "./serviceWorkerRegistration";
import reportWebVitals from "./reportWebVitals";
import {
  FirebaseAppProvider,
} from "reactfire";

// ionic stuff
import { defineCustomElements } from '@ionic/pwa-elements/loader';

const firebaseConfig = {
  /* add your config object from the Firebase console */
  apiKey: "AIzaSyBkqZmuBNdoqk4ENvRZG7vOIBQrsDgznGc",
  authDomain: "reactfire-new.firebaseapp.com",
  projectId: "reactfire-new",
  storageBucket: "reactfire-new.appspot.com"
};


ReactDOM.render(
  <React.StrictMode>
    <FirebaseAppProvider firebaseConfig={firebaseConfig}>
      <App />
    </FirebaseAppProvider>
  </React.StrictMode>,
  document.getElementById("root")
);

defineCustomElements(window);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorkerRegistration.unregister();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
