import "reflect-metadata";
import { DataSource } from "typeorm";
import User from "./entity/User.js";
import Trainer from "./entity/Trainer.js";
import MyPokemon from "./entity/MyPokemon.js";

const appDataSource = new DataSource({
	type: "postgres",
	url: process.env.DATABASE_URL,
	entities: [User, Trainer, MyPokemon],
	logging: true,
	synchronize: true,
	// subscribers: [],
	// migrations: [],
});

// Establish database connection
appDataSource
	.initialize()
	.then(() => {
		console.log("Data Source has been initialized!");
	})
	.catch((err) => {
		console.error("Error during Data Source initialization:", err);
	});

export default appDataSource;
