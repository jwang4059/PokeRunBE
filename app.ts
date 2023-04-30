import express from "express";
import cors from "cors";
import helmet from "helmet";
import Pokedex from "pokedex-promise-v2";
import * as dotenv from "dotenv";

dotenv.config();

const P = new Pokedex();
const app = express();

app.use(cors());
app.use(helmet());

app.get("/", (_, res) => {
	res.send("Hello World!");
});

app.get("/random", (_, res) => {
	(async () => {
		const pokedexStart = 1;
		const pokedexEnd = 386;
		const randomPokemonId =
			Math.floor(Math.random() * (pokedexEnd - pokedexStart + 1)) +
			pokedexStart;

		const randomPokemon = await P.getPokemonByName(randomPokemonId);
		res.send(randomPokemon);
	})();
});

export default app;
