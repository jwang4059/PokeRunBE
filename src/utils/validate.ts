// import validator from "validator";
import { Message } from "../types.js";
import { createErrorMsg } from "./messages.js";

// const validateEmail = (email: string): Message | null => {
// 	if (!email) {
// 		return createErrorMsg("Missing email address");
// 	}

// 	if (typeof email !== "string") {
// 		return createErrorMsg("Email must be a string");
// 	}

// 	if (validator.isEmail(email)) {
// 		return createErrorMsg("Email must be valid email");
// 	}

// 	return null;
// };

const validateUsername = (name: string): Message | null => {
	if (!name) {
		return createErrorMsg("Missing username");
	}

	if (typeof name !== "string") {
		return createErrorMsg("Username must be a string");
	}

	if (name.length > 30) {
		return createErrorMsg("Username must be 30 characters or less");
	}

	return null;
};

const validatePassword = (password: string): Message | null => {
	if (!password) {
		return createErrorMsg("Missing password");
	}

	if (typeof password !== "string") {
		return createErrorMsg("Password must be a string");
	}

	if (password.length < 8) {
		return createErrorMsg("Password must be at least 8 characters");
	}

	return null;
};

export const validateRegisterParameters = (
	username: string,
	password: string
): Message | null => {
	let errors = null;

	errors = validateUsername(username);
	if (errors) return errors;
	errors = validatePassword(password);
	if (errors) return errors;

	return null;
};

export const validateLoginParameters = (
	username: string,
	password: string
): Message | null => {
	if (!username || !password) {
		return createErrorMsg("Missing login credentials");
	}

	if (typeof username !== "string" || typeof password !== "string") {
		return createErrorMsg("Login credentials must be type string");
	}

	return null;
};
