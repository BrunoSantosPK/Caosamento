import fs from "fs";
import path from "path";
import { ObjectId } from "mongodb";
import { Request, Response } from "express";
import * as mongo from "../database/connect";
import CustomResponse from "../utils/response";

export default class AnimalController {

    static async add(request: Request, response: Response) {
        const { uid, name, description, breed } = request.body;
        const client = mongo.getMongoClient();
        const res = new CustomResponse();

        try {
            // Conexão com banco de dados
            await client.connect();
            const database = mongo.getDatabase(client);
            const pets = mongo.getCollectionPets(database);
            const users = mongo.getCollectionUsers(database);
            const breeds = mongo.getCollectionBreeds(database);

            // Verifica se o arquivo foi enviado
            if(request.file == undefined)
                throw new Error("Não foi enviada a foto do animal.");

            // Verifica id de usuário informado
            const user = await users.findOne({ uid });
            if(user == null)
                throw new Error("Usuário não encontrado na base de dados.");

            // Verifica id de raça informado
            const bd: any = await breeds.findOne({ _id: new ObjectId(breed) });
            if(bd == null)
                throw new Error("Raça não cadastrada no sistema.");

            // Faz a padronização do nome de arquivo
            const extension = request.file.originalname.split(".")[1];
            const fileName = `pet-${uid}-${Date.now()}.${extension}`
            const filePath = path.join(__dirname, "..", "public", fileName);
            fs.rename(request.file.path, filePath, err => {
                if(err)
                    throw new Error(err.message);
            });

            // Realiza o cadastro de novo PET
            const pet = {
                photo: fileName, uid, name, description, breed, breedName: bd.name,
                city: user.city, country: user.country, us: user.us, email: user.email
            };
            const insert = await pets.insertOne(pet);
            res.setAttr("newAnimal", pet);

        } catch(error: any) {
            res.setMessage(error.message);
            res.setStatus(400);

        } finally {
            await client.close();
            return response.json(res.getJSON());
        }
    }

    static async getByUser(request: Request, response: Response) {
        const { uid } = request.params;
        const res = new CustomResponse();
        const client = mongo.getMongoClient();

        try {
            // Conexão com banco de dados
            await client.connect();
            const database = mongo.getDatabase(client);
            const collection = mongo.getCollectionPets(database);

            // Recupera pets do usuário
            const pets = await collection.find({ uid }).toArray();
            res.setAttr("pets", pets);

        } catch(error: any) {
            res.setMessage(error.message);
            res.setStatus(400);

        } finally {
            await client.close();
            return response.json(res.getJSON());
        }
    }

    static async search(request: Request, response: Response) {
        const { breed, us, city, page, uid } = request.query;
        const client = mongo.getMongoClient();
        const res = new CustomResponse();

        try {
            // Conexão com banco de dados
            await client.connect();
            const database = mongo.getDatabase(client);
            const collection = mongo.getCollectionPets(database);

            // Cria o sistema de filtro
            const filter: any = { breedId: breed, uid: { $ne: uid } };
            if(us != undefined) filter.us = us;
            if(city != undefined) filter.city = city;

            // Fas o ajuste de paginação
            const pageSize = 50;
            const getPage = parseInt(page as string);
            const skip = (getPage - 1) * pageSize;

            // Recupera pets de acordo com os filtros passados
            const pets = await collection.find(filter).skip(skip).limit(pageSize).toArray();
            res.setAttr("page", getPage);
            res.setAttr("pets", pets);

        } catch(error: any) {
            res.setMessage(error.message);
            res.setStatus(400);

        } finally {
            await client.close();
            return response.json(res.getJSON());
        }
    }

}