import app from "../app";
import request from "supertest";
import * as mongo from "../database/connect";
import { deleteUser } from "../utils/firebase";

// Salva sistema de autenticação
let uid: string
let token: string;
const pass = "lambaroso123";
const email = "user@user.com.br";

describe("Sistema de gerenciamento de usuários", () => {
    beforeAll(async () => {
        await request(app).post("/user").send({
            email, pass, repeatPass: pass
        });
    });

    afterAll(async () => {
        const client = mongo.getMongoClient();
        try {
            await client.connect();
            await deleteUser(email, pass);

            const database = mongo.getDatabase(client);
            const collection = mongo.getCollectionUsers(database);
            await collection.deleteOne({ uid });

        } catch(error: any) {
            console.log("Ocorreu erro ao final do teste.");
            console.log(error);

        } finally {
            await client.close();
        }
    });

    describe("POST/login", () => {
        it("Login realizado com sucesso", async () => {
            const result = await request(app).post("/login").send({ email, pass });
            token = result.body.data.user.token;
            uid = result.body.data.user.uid;

            expect(result.body).toEqual(
                expect.objectContaining({ statusCode: 200 })
            )
        });
    });
});