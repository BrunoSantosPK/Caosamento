import path from "path";
import cors from "cors";
import express from "express";
import { config } from "dotenv";
import { errors } from "celebrate";

import routes from "./routes";
import { getConfig } from "./utils/firebase";
import { initializeApp } from "firebase-admin/app";
import { initializeApp as initializeAppAdmin } from "firebase-admin/app";

// Inicializa aplicação firebase
config({path: path.join(__dirname, "config", ".env")});
//const normal = initializeApp(getConfig(), "normalApp");
//const admin = initializeAppAdmin(getConfig(), "adminApp");

// Carrega aplicação express
const app = express();
app.use(express.json());
app.use(cors());
app.use(routes);
app.use(errors());
app.listen(process.env.PORT || 3030);