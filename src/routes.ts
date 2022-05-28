// Módulos do express
import uploadPhoto from "./database/upload";
import { Router } from "express";
const routes = Router();

// Controllers e validators
import BreedController from "./controllers/breeds";
import BreedValidator from "./validators/breeds";

import AnimalController from "./controllers/animals";
import AnimalValidator from "./validators/animals";

// Definição de rotas
routes.get("/breed", BreedController.get);
routes.post("/breed", BreedValidator.new, BreedController.new);

routes.get("/animal", AnimalValidator.search, AnimalController.search);
routes.get("/animal/:uid", AnimalValidator.getByUser, AnimalController.getByUser);
routes.post("/animal", uploadPhoto.single("photo"), AnimalValidator.add, AnimalController.add);

export default routes;