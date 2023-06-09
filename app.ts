import express from "express";
import cors from "cors";
import helmet from "helmet";
import { PokemonClient } from "pokenode-ts";
import * as dotenv from "dotenv";
import {
	getRandomEgg,
	getRandomPokemon,
} from "./src/controllers/pokemon.controller.js";

dotenv.config();

const api = new PokemonClient();
const app = express();

app.use(cors());
app.use(helmet());
app.use(express.json());

app.get("/", (_, res) => {
	res.send("Hello World!");
});

app.get("/random", async (_, res) => {
	await getRandomPokemon(res, api);
});

app.get("/egg", async (_, res) => {
	getRandomEgg(res);
});

export default app;
