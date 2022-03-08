import { Redirect, Route } from "react-router-dom";
import {
  IonApp,
  IonLoading,
  IonRouterOutlet,
  setupIonicReact,
} from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import Home from "./pages/Home";

/* Core CSS required for Ionic components to work properly */
import "@ionic/react/css/core.css";

/* Basic CSS for apps built with Ionic */
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";

/* Optional CSS utils that can be commented out */
import "@ionic/react/css/padding.css";
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/display.css";

/* Theme variables */
import "./theme/variables.css";

import {
  connectAuthEmulator,
  getAuth,
  indexedDBLocalPersistence,
  initializeAuth,
} from "firebase/auth"; // Firebase v9+
import { connectFirestoreEmulator, getFirestore } from "firebase/firestore"; // Firebase v9+

import {
  AuthProvider,
  useFirebaseApp,
  FirestoreProvider,
  useSigninCheck,
  StorageProvider,
} from "reactfire";
import Login from "./pages/Login";
import CreateAccount from "./pages/CreateAccount";
import React from "react";
import { connectStorageEmulator, getStorage } from "firebase/storage";

setupIonicReact();

const App: React.FC = () => {
  const app = useFirebaseApp();
  const firestoreDatabase = getFirestore(app);
  const storage = getStorage(app);

  const auth = initializeAuth(app, {
    persistence: indexedDBLocalPersistence,
  });

  // browser only
  // const auth = getAuth(app);

  // Check for dev/test mode however your app tracks that.
  // `process.env.NODE_ENV` is a common React pattern
  if (process.env.NODE_ENV !== "production") {
    // Set up emulators
    // connectFirestoreEmulator(firestoreDatabase, "localhost", 9000);
    // connectAuthEmulator(auth, "http://localhost:9099");
    // connectStorageEmulator(storage, "localhost", 9199);
  }

  return (
    <IonApp>
      <AuthProvider sdk={auth}>
        <FirestoreProvider sdk={firestoreDatabase}>
          <StorageProvider sdk={storage}>
            <IonReactRouter>
              <IonRouterOutlet>
                <Route path="/" exact={true}>
                  <Redirect to="/home" />
                </Route>
                <PrivateRoute path="/home" exact={true}>
                  <Home />
                </PrivateRoute>
                <Route path="/login" exact={true}>
                  <Login />
                </Route>
                <Route path="/create-account" exact={true}>
                  <CreateAccount />
                </Route>
              </IonRouterOutlet>
            </IonReactRouter>
          </StorageProvider>
        </FirestoreProvider>
      </AuthProvider>
    </IonApp>
  );
};

export default App;

// A wrapper for <Route> that redirects to the login
// screen if you're not yet authenticated.
export const PrivateRoute = ({
  children,
  location,
  ...rest
}: React.PropsWithChildren<any>) => {
  const { status, data: signInCheckResult } = useSigninCheck();
  if (status === "loading") {
    return <IonLoading isOpen={status === "loading"} />;
  }

  return (
    <Route
      {...rest}
      render={({ location }) =>
        signInCheckResult.signedIn === true ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: "/login",
            }}
          />
        )
      }
    />
  );
};
