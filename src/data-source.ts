import { DataSource } from "typeorm";

const AppDataSource = new DataSource({
	type: "postgres",
	url: process.env.DATABASE_URL,
	logging: true,
	// synchronize: true,
	// entities: [Post, Category],
	// subscribers: [],
	// migrations: [],
});

export default AppDataSource;
