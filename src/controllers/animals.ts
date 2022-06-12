import fs from "fs";
import path from "path";
import { ObjectId } from "mongodb";
import { User } from "../interfaces/users";
import { Request, Response } from "express";
import * as mongo from "../database/connect";
import CustomResponse from "../utils/response";
import { Animal } from "../interfaces/animals";

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
            const pet = { photo: fileName, uid, name, description, breed, breedName: bd.name };
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
        const { breed, uf, city, page, uid } = request.query;
        const client = mongo.getMongoClient();
        const res = new CustomResponse();

        try {
            // Conexão com banco de dados
            await client.connect();
            const database = mongo.getDatabase(client);
            const users = mongo.getCollectionUsers(database);
            const animals = mongo.getCollectionPets(database);

            // Verifica os filtros de cidade e estado
            const filterUser: any = {};
            if(uf != undefined) filterUser.uf = uf;
            if(city != undefined) filterUser.city = city;

            // Busca usuários que satisfazem o filtro
            const usersId: Array<string> = [];
            let usersData: Array<User>;
            if(Object.keys(filterUser).length > 0) {
                filterUser.uid = { $ne: uid };
                usersData = await users.find(filterUser).toArray() as Array<User>;
                usersData.forEach(item => usersId.push(item.uid));
            }

            // Cria o filtro para busca de animal
            const filterAnimal: any = { breedId: breed };
            if(usersId.length == 0)
                filterAnimal.uid = { $ne: uid };
            else
                filterAnimal.uid = { $in: usersId };

            // Faz o ajuste de paginação
            const pageSize = 50;
            const getPage = parseInt(page as string);
            const skip = (getPage - 1) * pageSize;

            // Recupera pets de acordo com os filtros passados
            const data: any = [];
            const pets = await animals.find(filterAnimal).skip(skip).limit(pageSize).toArray() as Array<Animal>;
            pets.forEach(item => {
                let match = usersData.find(element => element.uid == item.uid);
                data.push({
                    ...item,
                    shareWhatsapp: match?.shareWhatsapp,
                    whatsapp: match?.whatsapp,
                    email: match?.email,
                    city: match?.city,
                    uf: match?.uf
                })
            });

            res.setAttr("page", getPage);
            res.setAttr("pets", data);

        } catch(error: any) {
            res.setMessage(error.message);
            res.setStatus(400);

        } finally {
            await client.close();
            return response.json(res.getJSON());
        }
    }

    static async delete(request: Request, response: Response) {
        const client = mongo.getMongoClient();
        const res = new CustomResponse();
        const { animal } = request.body;

        try {
            // Conexão com banco de dados
            await client.connect();
            const database = mongo.getDatabase(client);
            const collection = mongo.getCollectionPets(database);

            // Verifica dados do documento
            const filter = { _id: new ObjectId(animal) };
            const document = await collection.findOne(filter);
            if(document == null)
                throw new Error("O id informado não foi encontrado.");

            // Apaga o documento e remove a imagem do servidor
            const filePath = path.join(__dirname, "..", "public", document.photo);
            const result = await collection.deleteOne(filter);
            fs.unlink(filePath, error => {
                if(error)
                    throw new Error("Não foi possível remover a foto de perfil.");
            });

        } catch(error: any) {
            res.setMessage(error.message);
            res.setStatus(400);

        } finally {
            await client.close();
            return response.json(res.getJSON());
        }
    }

}
