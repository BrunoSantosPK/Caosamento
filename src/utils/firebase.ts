import * as firebase from "firebase/app";
import * as firebaseAuth from "firebase/auth";
import * as firebaseAdmin from "firebase-admin/app";
import * as firebaseAuthAdmin from "firebase-admin/auth";
import admApp from "./configFirebase";

type ResponseAuth = {
    success: boolean,
    data?: firebaseAuth.UserCredential,
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

export async function login(user: string, pass: string): Promise<ResponseAuth> {
    try {
        firebase.initializeApp(getConfig());
        const auth = firebaseAuth.getAuth();
        
        const res = await firebaseAuth.signInWithEmailAndPassword(auth, user, pass);
        return { success: true, data: res };

    } catch(error: any) {
        return { success: false, message: error.message };
    }
}

export async function createUser(user: string, pass: string): Promise<ResponseAuth> {
    try {
        firebase.initializeApp(getConfig());
        const auth = firebaseAuth.getAuth();

        const res = await firebaseAuth.createUserWithEmailAndPassword(auth, user, pass);
        return { success: true, data: res };

    } catch(error: any) {
        return { success: false, message: error.message };
    }
}

export async function updatePass(user: string, pass: string, newPass: string): Promise<ResponseAuth> {
    try {
        firebase.initializeApp(getConfig());
        const auth = firebaseAuth.getAuth();

        await firebaseAuth.signInWithEmailAndPassword(auth, user, pass);
        await firebaseAuth.updatePassword(auth.currentUser as firebaseAuth.User, newPass);
        return { success: true, message: "Senha atualizada" };

    } catch(error: any) {
        return { success: false, message: error.message };
    }
}

export async function resetPass(user: string): Promise<ResponseAuth> {
    try {
        firebase.initializeApp(getConfig());
        const auth = firebaseAuth.getAuth();

        await firebaseAuth.sendPasswordResetEmail(auth, user);
        return { success: true, message: "E-mail enviado" };

    } catch(error: any) {
        return { success: false, message: error.message };
    }
}

export async function validateToken(token: string): Promise<ResponseAuth> {
    try {
        admApp;
        const auth = firebaseAuthAdmin.getAuth();

        const res = await auth.verifyIdToken(token);
        return { success: true, message: res.uid };
        
    } catch(error: any) {
        return { success: false, message: error.message };
    }
}