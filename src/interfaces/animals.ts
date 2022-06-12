import { ObjectId } from "mongodb";

export interface Animal {
    _id: ObjectId;
    photo: string;
    uid: string;
    name: string;
    description: string;
    breedId: string;
    breedName: string;
}