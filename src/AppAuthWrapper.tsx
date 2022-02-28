import { Redirect, Route, Switch } from "react-router-dom";
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
import "@ionic/react/css/normalize.css";
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

import { connectAuthEmulator, getAuth } from "firebase/auth"; // Firebase v9+
import { connectFirestoreEmulator, getFirestore } from "firebase/firestore"; // Firebase v9+

import {
  AuthProvider,
  useFirebaseApp,
  FirestoreProvider,
  useSigninCheck,
} from "reactfire";
import Login from "./pages/Login";
import CreateAccount from "./pages/CreateAccount";

setupIonicReact();

const App: React.FC = () => {
  const app = useFirebaseApp();
  const firestoreDatabase = getFirestore(app);
  const auth = getAuth(app);

  // Check for dev/test mode however your app tracks that.
  // `process.env.NODE_ENV` is a common React pattern
  if (process.env.NODE_ENV !== "production") {
    // Set up emulators
    connectFirestoreEmulator(firestoreDatabase, "localhost", 9000);
    connectAuthEmulator(auth, "http://localhost:9099");
  }
  console.log(auth.currentUser);

  return (
    <IonApp>
      <AuthProvider sdk={auth}>
        <FirestoreProvider sdk={firestoreDatabase}>
          <IonReactRouter>
            <IonRouterOutlet>
              <AuthWrapper fallback={<AuthRoute />}>
                <Route path="/" exact={true}>
                  <Redirect to="/home" />
                </Route>
                <Route path="/home" exact={true}>
                  <Home />
                </Route>
              </AuthWrapper>
            </IonRouterOutlet>
          </IonReactRouter>
        </FirestoreProvider>
      </AuthProvider>
    </IonApp>
  );
};

export default App;

const AuthRoute = () => {
  return (
    <Switch>
      <Route path="/login" exact={true}>
        <Login />
      </Route>
      <Route path="/create-account" exact={true}>
        <CreateAccount />
      </Route>
      <Route path="*" exact={true}>
        <Redirect to="/login" />
      </Route>
    </Switch>
  );
};

export const AuthWrapper = ({
  children,
  fallback,
}: React.PropsWithChildren<{ fallback: JSX.Element }>): JSX.Element => {
  const { status, data: signInCheckResult } = useSigninCheck();
  console.log(signInCheckResult);

  if (!children) {
    throw new Error("Children must be provided");
  }
  if (status === "loading") {
    return <IonLoading isOpen={status === "loading"} />;
  } else if (signInCheckResult.signedIn === true) {
    return children as JSX.Element;
  }

  return fallback;
};
