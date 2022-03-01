import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import "./Home.css";
import { useFirebaseApp } from "reactfire";
import { getAuth, signOut } from "firebase/auth";
import { useHistory } from "react-router";

const Home: React.FC = () => {
  const app = useFirebaseApp();
  const auth = getAuth(app);
  const history = useHistory();

  return (
    <IonPage id="home-page">
      <IonHeader>
        <IonToolbar>
          <IonTitle>HOME</IonTitle>
          <IonButtons slot="end">
            <IonButton
              onClick={async () => {
                await signOut(auth);
                history.replace("/login");
              }}
            >
              SIGN OUT
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <pre>
          {auth.currentUser ? JSON.stringify(auth.currentUser, null, 2) : null}
        </pre>
      </IonContent>
    </IonPage>
  );
};

export default Home;
