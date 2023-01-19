import { getFirestore } from "firebase-admin/firestore";
import { getApps, initializeApp, cert } from "firebase-admin/app";
import serviceAccount from "./serviceAccountKey.json";

if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: serviceAccount.project_id,
      clientEmail: serviceAccount.client_email,
      privateKey: serviceAccount.private_key,
    }),
  });
}

const db = getFirestore().collection("todo");
export default db;
