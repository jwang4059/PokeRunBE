import { QueryFailedError, TypeORMError } from "typeorm";

export const getErrorMessage = (error: unknown) => {
	if (error instanceof TypeORMError) {
		if (error instanceof QueryFailedError) {
			if (error.driverError.code === "23505") {
				return error.driverError.detail;
			}
		}
	}
	if (error instanceof Error) return error.message;
	return String(error);
};

export function getIdFromUrl(urlString: string) {
	try {
		const url = new URL(urlString);
		const path = url.pathname;
		const pathSegments = path.split("/").filter((segment) => segment !== ""); // Split and remove empty segments
		const id = pathSegments[pathSegments.length - 1];

		return parseInt(id, 10);
	} catch (error) {
		console.error("Invalid URL:", error);
		return -1;
	}
}

/**
 *
 * @param min min value
 * @param max max value
 * @returns number (random number between [min, max], inclusive)
 */
export const generateRandomNumber = (min: number, max: number) => {
	const random = Math.floor(Math.random() * (max - min + 1)) + min;
	return random;
};

/**
 *
 * @param weights List of weights (probability of returning index value)
 * @returns number (random number between [1, weights.length], inclusive)
 */
export const generateRandomWeightedNumber = (weights: number[]): number => {
	if (!weights.length) return -1;

	const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);
	if (totalWeight !== 1) return -1;

	const randomNum = Math.random() * totalWeight;
	let weightSum = 0;

	for (let i = 0; i < weights.length; i += 1) {
		weightSum += weights[i];
		if (randomNum < weightSum) {
			return i + 1;
		}
	}

	return -1;
};
