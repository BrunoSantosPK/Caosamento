import * as firebaseAuth from "firebase/auth";
import { getAuth as getAdminAuth } from "firebase-admin/auth";

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
    const auth = firebaseAuth.getAuth();

    try {
        const res = await firebaseAuth.signInWithEmailAndPassword(auth, user, pass);
        return { success: true, data: res };
    } catch(error: any) {
        return { success: false, message: error.message };
    }
}

export async function createUser(user: string, pass: string): Promise<ResponseAuth> {
    const auth = firebaseAuth.getAuth();

    try {
        const res = await firebaseAuth.createUserWithEmailAndPassword(auth, user, pass);
        return { success: true, data: res };
    } catch(error: any) {
        return { success: false, message: error.message };
    }
}

export async function updatePass(user: string, pass: string, newPass: string): Promise<ResponseAuth> {
    const auth = firebaseAuth.getAuth();

    try {
        await firebaseAuth.signInWithEmailAndPassword(auth, user, pass);
        await firebaseAuth.updatePassword(auth.currentUser as firebaseAuth.User, newPass);
        return { success: true, message: "Senha atualizada" };
    } catch(error: any) {
        return { success: false, message: error.message };
    }
}

export async function resetPass(user: string): Promise<ResponseAuth> {
    const auth = firebaseAuth.getAuth();

    try {
        await firebaseAuth.sendPasswordResetEmail(auth, user);
        return { success: true, message: "E-mail enviado" };
    } catch(error: any) {
        return { success: false, message: error.message };
    }
}

export async function validateToken(token: string): Promise<ResponseAuth> {
    const auth = getAdminAuth();

    try {
        const res = await auth.verifyIdToken(token);
        return { success: true, message: res.uid };
    } catch(error: any) {
        return { success: false, message: error.message };
    }
}