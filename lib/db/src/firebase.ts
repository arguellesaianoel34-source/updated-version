import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import { getDatabase, type Database } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyBX0J19kPOyes51li60NjL4eJqld-8k_VI",
  authDomain: "vibeglobally-79ca7.firebaseapp.com",
  databaseURL:
    "https://vibeglobally-79ca7-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "vibeglobally-79ca7",
  storageBucket: "vibeglobally-79ca7.firebasestorage.app",
  messagingSenderId: "878355123619",
  appId: "1:878355123619:web:d2152e0d3ae1f259d49e16",
  measurementId: "G-HKNVPPTC7Q",
};

let app: FirebaseApp;
let database: Database;

export function getFirebaseApp(): FirebaseApp {
  if (!app) {
    app = getApps().length > 0 ? getApps()[0]! : initializeApp(firebaseConfig);
  }
  return app;
}

export function getDb(): Database {
  if (!database) {
    database = getDatabase(getFirebaseApp());
  }
  return database;
}
