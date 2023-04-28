import express from "express";
import cors from "cors";
import helmet from "helmet";
import * as dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(cors());
app.use(helmet());

app.get("/", (_, res) => {
	res.send("Hello World!");
});

export default app;
