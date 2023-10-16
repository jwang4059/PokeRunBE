import { FAILED, SUCCESS } from "../constants.js";
import { Message } from "../types.js";

export const createErrorMsg = (msg: string): Message => ({
	status: FAILED,
	message: msg,
});

export const createSuccessMsg = (msg: string): Message => ({
	status: SUCCESS,
	message: msg,
});
