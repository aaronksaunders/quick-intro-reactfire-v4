import { useState } from "react";
import {
  IonButton,
  IonContent,
  IonHeader,
  IonInput,
  IonItem,
  IonPage,
  IonTitle,
  IonToolbar,
  useIonAlert,
} from "@ionic/react";
import "./Home.css";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { useHistory } from "react-router";

const Login: React.FC = () => {
  const auth = getAuth();
  const history = useHistory();
  const [alert] = useIonAlert();

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  /**
   *
   */
  const doSignIn = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        console.log(user);
        history.push("/home");
        return true;
      })
      .catch(async (error) => {
        const errorCode = error.code;
        const errorMessage = error.message;

        await alert({
          header: "Error Signing In",
          message: errorMessage,
          buttons: ["OK"],
        });
      });
  };
  return (
    <IonPage id="login-page">
      <IonHeader>
        <IonToolbar>
          <IonTitle>LOGIN</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen className="ion-padding">
        <IonItem>
          <IonInput
            value={email}
            placeholder="Enter Email"
            onIonChange={(e) => setEmail(e.detail.value!)}
          ></IonInput>
        </IonItem>
        <IonItem>
          <IonInput
            value={password}
            placeholder="Enter Password"
            onIonChange={(e) => setPassword(e.detail.value!)}
          ></IonInput>
        </IonItem>
        <IonButton onClick={() => doSignIn()}>SIGN IN ACCOUNT</IonButton>
        <IonButton routerLink="/create-account">CREATE ACCOUNT</IonButton>
      </IonContent>
    </IonPage>
  );
};

export default Login;
