import express from "express";
import cors from "cors";
import helmet from "helmet";
import { MainClient } from "pokenode-ts";
import appDataSource from "./src/data-source.js";
import User from "./src/controllers/user.controller.js";
import Pokemon from "./src/controllers/pokemon.controller.js";
import { getRandomPokemon } from "./src/utils/pokemon.js";

// Create client for Pokemon API
const api = new MainClient();

// Create and setup express app
const app = express();
app.use(
	cors({
		origin: process.env.CORS_ORIGIN,
		credentials: true,
	})
);
app.use(helmet());
app.use(express.json());

// Register routes
app.get("/", async (_, res) => {
	res.send("PokeRun BE API");
});

app.post("/register", (req, res) => {
	User.register(req, res, appDataSource);
});

app.post("/login", (req, res) => {
	User.login(req, res, appDataSource);
});

app.post("/reward", (req, res) => {
	Pokemon.getPokemonReward(req, res, appDataSource, api);
});

app.post("/deactivate", (req, res) => {
	User.deactivate(req, res, appDataSource);
});

app.get("/random", async (_, res) => {
	const pokemon = await getRandomPokemon(api.pokemon);
	res.json(pokemon);
});

export default app;
