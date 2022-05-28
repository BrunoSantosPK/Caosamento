import { Request, Response } from "express";
import * as mongo from "../database/connect";
import * as firebase from "../utils/firebase";
import CustomResponse from "../utils/response";

export default class UserController {

    static async new(request: Request, response: Response) {
        const { repeatPass, pass, email } = request.body;
        const client = mongo.getMongoClient();
        const res = new CustomResponse();

        try {
            // Conexão com banco de dados
            await client.connect();
            const database = mongo.getDatabase(client);
            const collection = mongo.getCollectionUsers(database);

            // Verifica se as senhas são correspondentes
            if(repeatPass != pass)
                throw new Error("As senhas não são iguais.");

            // Cria no firebase
            const result = await firebase.createUser(email, pass);
            if(!result.success)
                throw new Error(result.message);

            // Faz a inclusão do usuário no mongo
            await collection.insertOne({
                email, uid: result.data?.user.uid
            });

        } catch(error: any) {
            res.setMessage(error.message);
            res.setStatus(400);

        } finally {
            await client.close();
            return response.json(res.getJSON());
        }
    }

    static async login(request: Request, response: Response) {
        const { pass, email } = request.body;
        const res = new CustomResponse();

        try {
            // Verifica credenciais no firebase
            const result = await firebase.login(email, pass);
            if(!result.success)
                throw new Error(result.message)

            // Pepera resposta para envio
            res.setAttr("user", {
                uid: result.data?.user.uid
            });

        } catch(error: any) {
            res.setMessage(error.message);
            res.setStatus(400);

        } finally {
            return response.json(res.getJSON());
        }
    }

    static async updateData(request: Request, response: Response) {
        const { uid, us, city, shareWhatsapp, whatsapp, name } = request.body;
        const client = mongo.getMongoClient();
        const res = new CustomResponse();

        try {
            // Conexão com banco de dados
            await client.connect();
            const database = mongo.getDatabase(client);
            const collection = mongo.getCollectionUsers(database);

            // Verifica se o whatsapp foi enviado no caso de compartilhamento
            if(shareWhatsapp && whatsapp == undefined)
                throw new Error("Se deseja compartilhar whatsapp, informe um número com DDD.");

            // Cria documento de atualização
            const doc: any = { uid, us, city, name, shareWhatsapp, country: "Brasil" };
            if(whatsapp != undefined)
                doc.whatsapp = whatsapp;

            // Faz a atualização no banco
            await collection.updateOne({ uid }, { $set: doc });

        } catch(error: any) {
            res.setMessage(error.message);
            res.setStatus(400);

        } finally {
            return response.json(res.getJSON());
        }
    }

    static async get(request: Request, response: Response) {
        const client = mongo.getMongoClient();
        const res = new CustomResponse();
        const { uid } = request.params;

        try {
            // Conexão com banco de dados
            await client.connect();
            const database = mongo.getDatabase(client);
            const collection = mongo.getCollectionUsers(database);

            // Busca dados do usuário
            const result = await collection.findOne({ uid });
            res.setAttr("user", result);

        } catch(error: any) {
            res.setMessage(error.message);
            res.setStatus(400);

        } finally {
            return response.json(res.getJSON());
        }
    }

    static async updatePass(request: Request, response: Response) {
        const { email, oldPass, pass, repeatPass } = request.body;
        const res = new CustomResponse();

        try {
            // Verifica se as senhas são iguais
            if(pass != repeatPass)
                throw new Error("As senhas não conferem.");

            // Faz a atualização no firebase
            const result = await firebase.updatePass(email, oldPass, pass);
            if(!result.success)
                throw new Error(result.message);

        } catch(error: any) {
            res.setMessage(error.message);
            res.setStatus(400);

        } finally {
            return response.json(res.getJSON());
        }
    }

    static async resetPass(request: Request, response: Response) {
        const res = new CustomResponse();
        const { email } = request.body;
        
        try {
            // Envia requisição de auteração para firebase
            const result = await firebase.resetPass(email);
            if(!result.success)
                throw new Error(result.message);

        } catch(error: any) {
            res.setMessage(error.message);
            res.setStatus(400);

        } finally {
            return response.json(res.getJSON());
        }
    }

}