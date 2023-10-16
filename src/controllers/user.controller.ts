import argon2 from "argon2";
import { Request, Response } from "express";
import { DataSource } from "typeorm";
import { createErrorMsg } from "../utils/messages.js";
import User from "../entity/User.js";
import Trainer from "../entity/Trainer.js";
import { getErrorMessage } from "../utils/helper.js";
import {
	validateRegisterParameters,
	validateLoginParameters,
} from "../utils/validate.js";
import { SUCCESS } from "../constants.js";

const register = async (
	req: Request,
	res: Response,
	appDataSource: DataSource
) => {
	const { username, password } = req.body;

	const errors = validateRegisterParameters(username, password);

	if (errors) {
		res.status(400).json(errors);
		return;
	}

	try {
		const passwordHash = await argon2.hash(password);

		const userRepository = appDataSource.getRepository(User);

		const user = userRepository.create({
			username,
			passwordHash,
			trainer: new Trainer(),
		});

		await userRepository.save(user);

		res.json({ success: SUCCESS, trainerId: user.trainer.id });
	} catch (error: unknown) {
		res.status(400).json(createErrorMsg(getErrorMessage(error)));
	}
};

const login = async (
	req: Request,
	res: Response,
	appDataSource: DataSource
) => {
	const { username, password } = req.body;

	const errors = validateLoginParameters(username, password);

	if (errors) {
		res.status(400).json(errors);
		return;
	}

	try {
		const userRepository = appDataSource.getRepository(User);
		const user = await userRepository.findOne({
			where: { username },
			relations: { trainer: true },
		});

		if (!user || !user.passwordHash) {
			res.status(400).json(createErrorMsg("Invalid login credentials"));
			return;
		}

		if (await argon2.verify(user.passwordHash, password)) {
			res.json({ status: SUCCESS, trainerId: user.trainer.id });
		} else {
			res.status(400).json(createErrorMsg("Invalid login credentials"));
		}
	} catch (error: unknown) {
		res.status(400).json(createErrorMsg(getErrorMessage(error)));
	}
};

const deactivate = async (
	req: Request,
	res: Response,
	appDataSource: DataSource
) => {
	const { username } = req.body;

	try {
		const userRepository = appDataSource.getRepository(User);
		const result = await userRepository.delete({ username });

		res.json({ status: SUCCESS, ...result });
	} catch (error: unknown) {
		res.status(400).json(createErrorMsg(getErrorMessage(error)));
	}
};

export default {
	register,
	login,
	deactivate,
};
