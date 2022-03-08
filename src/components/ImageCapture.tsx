import { IonButton, IonImg } from "@ionic/react";
import {
  getDownloadURL,
  ref,
  StorageReference,
  uploadBytesResumable,
  UploadTask,
  UploadTaskSnapshot,
} from "firebase/storage";
import * as React from "react";
import { useState } from "react";
import { useStorage, useStorageDownloadURL } from "reactfire";

// ionic stuff
import { isPlatform } from "@ionic/react";

import {
  Camera,
  CameraResultType,
  CameraSource,
  Photo,
} from "@capacitor/camera";

/**
 *
 * @returns https://github.com/FirebaseExtended/reactfire/blob/a2d2f1c36450515e81e07bd50f539266f5d825dc/example/withoutSuspense/Storage.tsx
 */
export const ImageCapture = () => {
  const [imageUrl, setImageUrl] = useState<any>(undefined);
  const [error, setError] = useState<Error | undefined>(undefined);

  const storage = useStorage();

  const processTask = async (uploadTask:any): Promise<string|null> => {
    return uploadTask?.then(
      async (result: UploadTaskSnapshot) => {
        console.log("upload complete", result);
        const downloadUrl: string = await getDownloadURL(
          ref(storage, result?.metadata?.fullPath)
        );
        return downloadUrl;
      },
      () => null
    );
  };

  /**
   * take a photo using the capacitor camera to be used when testing on
   * and actual device or when using capacitor pwa camera
   */
  const takePhoto = async () => {
    try {
      const photo:Photo = await Camera.getPhoto({
        resultType: CameraResultType.Uri,
        source: CameraSource.Camera,
        quality: 100,
      });

      const path = photo?.webPath + "";
      const r = await fetch(path);
      const blob = await r.blob();
      const filename = path?.replace(/^.*[\\\/]/, "");

      const newRef = ref(storage, `images/${filename}`);
      const uploadTask = uploadBytesResumable(newRef, blob);
      const downloadUrl = await processTask(uploadTask);
      setImageUrl(downloadUrl);
    } catch (e) {
      setError(e as Error);
    }
  };

  /**
   * when using basic web, you can used the file input element
   * and get a file from the event object to upload
   *
   * @param event
   */
  const onChange = async (event: { target: { files: any } }) => {
    const fileList = event.target.files;
    const fileToUpload = fileList[0];
    const fileName = fileToUpload.name;

    // create a reference to the file in storage
    const newRef = ref(storage, `images/${fileName}`);

    // start the upload process
    const uploadTask = uploadBytesResumable(newRef, fileToUpload);

    // when the task is completed, get the download url so
    // you can
    const downloadUrl = await processTask(uploadTask);
    setImageUrl(downloadUrl);
  };

  return (
    <>
      <input type="file" accept="image/png, image/jpeg" onChange={onChange} />
      <p>
        <IonButton onClick={takePhoto}>CAMERA</IonButton>
      </p>
      {imageUrl ? <IonImg src={imageUrl} /> : null}
      {error ? <p>{error?.message}</p> : null}
    </>
  );
};
