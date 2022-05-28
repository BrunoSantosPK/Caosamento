import { Request, Response } from "express";
import CustomResponse from "../utils/response";
import { getDatabase, getMongoClient, getCollectionBreeds } from "../database/connect";

export default class BreedController {

    static async get(request: Request, response: Response) {
        const res = new CustomResponse();
        const client = getMongoClient();

        try {
            // Conexão com banco de dados
            await client.connect();
            const database = getDatabase(client);
            const collection = getCollectionBreeds(database);

            // Recupera raças cadastradas
            const breeds = await collection.find().toArray();
            res.setAttr("breeds", breeds);

        } catch(error: any) {
            res.setMessage(error.message);
            res.setStatus(400);

        } finally {
            await client.close();
            return response.json(res.getJSON());
        }
    }

    static async new(request: Request, response: Response) {
        const { name, animal } = request.body;
        const res = new CustomResponse();
        const client = getMongoClient();

        try {
            // Conexão com banco de dados
            await client.connect();
            const database = getDatabase(client);
            const collection = getCollectionBreeds(database);

            // Adiciona novo registro
            const up = name.toUpperCase();
            const exist = await collection.findOne({ up });
            if(exist != null)
                throw new Error("Raça já cadastrada.");

            const inserted = await collection.insertOne({ name, animal, up });
            res.setAttr("newBreed", { name, animal, id: inserted.insertedId });

        } catch(error: any) {
            res.setMessage(error.message);
            res.setStatus(400);

        } finally {
            await client.close();
            return response.json(res.getJSON());
        }
    }

}