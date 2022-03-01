import {
  IonBackButton,
  IonButton,
  IonButtons,
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
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { useHistory } from "react-router";
import { useState } from "react";

const CreateAccount: React.FC = () => {
  const auth = getAuth();
  const history = useHistory();
  const [alert] = useIonAlert();

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const doCreateAccount = () => {
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        console.log(user);
        history.replace("/");
        return true;
      })
      .catch(async (error) => {
        const errorCode = error.code;
        const errorMessage = error.message;

        await alert({
          header: "Error Creating Account",
          message: errorMessage,
          buttons: ["OK"],
        });
      });
  };

  return (
    <IonPage id="create-account-page">
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton />
          </IonButtons>
          <IonTitle>CREATE ACCOUNT</IonTitle>
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
            type="password"
            placeholder="Enter Password"
            onIonChange={(e) => setPassword(e.detail.value!)}
          ></IonInput>
        </IonItem>
        <IonButton onClick={() => doCreateAccount()}>CREATE ACCOUNT</IonButton>
      </IonContent>
    </IonPage>
  );
};

export default CreateAccount;
