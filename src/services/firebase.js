import { initializeApp, getApps, getApp } from 'firebase/app'
import { getAuth } from 'firebase/auth';
import 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const config = {
    apiKey: import.meta.env.VITE_API_KEY,
    authDomain: import.meta.env.VITE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_APP_ID,
};

// Initialize Firebase 

const firebaseApp = getApps().length === 0 ? initializeApp(config) : getApp();

export const auth = getAuth(firebaseApp);
export const storage = getStorage(firebaseApp);

export default firebaseApp;

// !firebase.apps.length
//     ? firebase.initializeApp(config).auth()
//     : firebase.app().auth();
