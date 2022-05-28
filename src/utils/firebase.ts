import { initializeApp } from "firebase/app";
import {
    getAuth, signInWithEmailAndPassword, UserCredential,
    createUserWithEmailAndPassword, sendPasswordResetEmail,
    updatePassword, User
} from "firebase/auth";

type ResponseLogin = {
    success: boolean,
    data?: UserCredential,
    message?: string
};

type ResponseOperation = {
    success: boolean,
    message?: string
};

export function getConfig() {
    return {
        apiKey: process.env.API_KEY,
        authDomain: process.env.AUTH_DOMAIN,
        projectId: process.env.PROJECT_ID,
        storageBucket: process.env.STORAGE_BUCKET,
        messagingSenderId: process.env.MESSAGING_SENDER_ID,
        appId: process.env.APP_ID,
        measurementId: process.env.MEASUREMENT_ID
    }
}

export async function getUserData(user: string, pass: string): Promise<ResponseLogin> {
    initializeApp(getConfig());
    const auth = getAuth();

    try {
        const res = await signInWithEmailAndPassword(auth, user, pass);
        return { success: true, data: res };
    } catch(error: any) {
        return { success: false, message: error.message };
    }
}

export async function createUser(user: string, pass: string): Promise<ResponseLogin> {
    initializeApp(getConfig());
    const auth = getAuth();

    try {
        const res = await createUserWithEmailAndPassword(auth, user, pass);
        return { success: true, data: res };
    } catch(error: any) {
        return { success: false, message: error.message };
    }
}

export async function resetPass(user: string): Promise<ResponseOperation> {
    initializeApp(getConfig());
    const auth = getAuth();

    try {
        await sendPasswordResetEmail(auth, user);
        return { success: true, message: "E-mail enviado" };
    } catch(error: any) {
        return { success: false, message: error.message };
    }
}

export async function updatePass(user: string, pass: string, newPass: string): Promise<ResponseOperation> {
    initializeApp(getConfig());
    const auth = getAuth();

    try {
        await signInWithEmailAndPassword(auth, user, pass);
        await updatePassword(auth.currentUser as User, newPass);
        return { success: true, message: "Senha atualizada" };
    } catch(error: any) {
        return { success: false, message: error.message };
    }
}

import { getStorage, ref, getDownloadURL } from "firebase/storage";
export async function getUrl() {
    try {
        const app = initializeApp(getConfig());
        const auth = getAuth();
        await signInWithEmailAndPassword(auth, "bruno.19ls@gmail.com", "lambari");
        
        const storage = getStorage(app);
        const forestRef = ref(storage, "pricone-01.jpg");
        const url = await getDownloadURL(forestRef);
        console.log(url);
    } catch(error: any) {
        console.log(error.message);
    }
}