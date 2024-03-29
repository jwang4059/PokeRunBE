import express from "express";
import cors from "cors";
import helmet from "helmet";
import { MainClient } from "pokenode-ts";
import appDataSource from "./src/data-source.js";
import User from "./src/controllers/user.controller.js";
import Pokemon from "./src/controllers/pokemon.controller.js";

// Create client for Pokemon API
const api = new MainClient();

// Create and setup express app
const app = express();
app.use(cors());
app.use(helmet());
app.use(express.json());

// Register routes
app.get("/", (_, res) => {
	res.send("Hello World!");
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

export default app;
