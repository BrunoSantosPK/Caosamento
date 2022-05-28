// Módulos do express
import uploadPhoto from "./database/upload";
import express from "express";
import path from "path";

// Controllers e validators
import BreedController from "./controllers/breeds";
import BreedValidator from "./validators/breeds";

import AnimalController from "./controllers/animals";
import AnimalValidator from "./validators/animals";

import UserController from "./controllers/users";
import AuthController from "./controllers/auth";
import UserValidator from "./validators/users";

// Definição de rotas
const routes = express.Router();

routes.get("/breed", AuthController.token, BreedController.get);
routes.post("/breed", AuthController.token, BreedValidator.new, BreedController.new);

routes.get("/animal", AuthController.token, AnimalValidator.search, AnimalController.search);
routes.get("/animal/:uid", AuthController.token, AnimalValidator.getByUser, AnimalController.getByUser);
routes.post("/animal", AuthController.token, uploadPhoto.single("photo"), AnimalValidator.add, AnimalController.add);

routes.post("/user", UserValidator.new, UserController.new);
routes.get("/user/:uid", AuthController.token, UserValidator.get, UserController.get);
routes.put("/user", AuthController.token, UserValidator.updateData, UserController.updateData);

routes.post("/login", UserValidator.login, UserController.login);
routes.post("/pass", AuthController.token, UserValidator.resetPass, UserController.resetPass);
routes.put("/pass", AuthController.token, UserValidator.updatePass, UserController.updatePass);

routes.use("/static", express.static(path.join(__dirname, "public")));

export default routes;