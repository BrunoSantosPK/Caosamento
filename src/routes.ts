// Módulos do express
import uploadPhoto from "./database/upload";
import { Router } from "express";
const routes = Router();

// Controllers e validators
import BreedController from "./controllers/breeds";
import BreedValidator from "./validators/breeds";

import AnimalController from "./controllers/animals";
import AnimalValidator from "./validators/animals";

import UserController from "./controllers/users";
import UserValidator from "./validators/users";

// Definição de rotas
routes.get("/breed", BreedController.get);
routes.post("/breed", BreedValidator.new, BreedController.new);

routes.get("/animal", AnimalValidator.search, AnimalController.search);
routes.get("/animal/:uid", AnimalValidator.getByUser, AnimalController.getByUser);
routes.post("/animal", uploadPhoto.single("photo"), AnimalValidator.add, AnimalController.add);

routes.post("/user", UserValidator.new, UserController.new);
routes.get("/user/:uid", UserValidator.get, UserController.get);
routes.post("/login", UserValidator.login, UserController.login);
routes.put("/user", UserValidator.updateData, UserController.updateData);

export default routes;