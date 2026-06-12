import { getApp, getApps, initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getDatabase } from "firebase/database";

const firebaseWebConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

function hasRequiredFirebaseWebConfig() {
  return (
    typeof firebaseWebConfig.apiKey === "string" &&
    firebaseWebConfig.apiKey.length > 0 &&
    typeof firebaseWebConfig.authDomain === "string" &&
    firebaseWebConfig.authDomain.length > 0 &&
    typeof firebaseWebConfig.databaseURL === "string" &&
    firebaseWebConfig.databaseURL.length > 0 &&
    typeof firebaseWebConfig.projectId === "string" &&
    firebaseWebConfig.projectId.length > 0 &&
    typeof firebaseWebConfig.appId === "string" &&
    firebaseWebConfig.appId.length > 0
  );
}

export function getFirebaseClientApp() {
  if (!hasRequiredFirebaseWebConfig()) {
    throw new Error(
      "Firebase Web SDK 설정이 비어 있어요. NEXT_PUBLIC_FIREBASE_* 환경변수를 확인해 주세요.",
    );
  }

  return getApps().length > 0 ? getApp() : initializeApp(firebaseWebConfig);
}

export function getFirebaseClientDatabase() {
  return getDatabase(getFirebaseClientApp());
}

export async function initializeFirebaseAnalytics() {
  if (
    typeof window === "undefined" ||
    typeof firebaseWebConfig.measurementId !== "string" ||
    firebaseWebConfig.measurementId.length === 0 ||
    !hasRequiredFirebaseWebConfig()
  ) {
    return null;
  }

  if (!(await isSupported())) {
    return null;
  }

  return getAnalytics(getFirebaseClientApp());
}
