import path from "path";
import cors from "cors";
import express from "express";
import { config } from "dotenv";
import { errors } from "celebrate";

config({path: path.join(__dirname, "config", ".env")});
import routes from "./routes";

// Carrega aplicação express
const app = express();
app.use(express.json());
app.use(cors());
app.use(routes);
app.use(errors());

export default app;