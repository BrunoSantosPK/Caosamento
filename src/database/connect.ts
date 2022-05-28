import { MongoClient, Db } from "mongodb";

export function getMongoURI() {
    const user = process.env.MONGO_USER;
    const pass = process.env.MONGO_PASS;
    const host = process.env.MONGO_HOST;

    return `mongodb+srv://${user}:${pass}@${host}/?retryWrites=true&w=majority`
}

export function getMongoClient() {
    return new MongoClient(getMongoURI());
}

export function getDatabase(client: MongoClient) {
    return client.db("petshow");
}

export function getCollectionUsers(database: Db) {
    return database.collection("users");
}

export function getCollectionPets(database: Db) {
    return database.collection("pets");
}

export function getCollectionBreeds(database: Db) {
    return database.collection("breeds")
}