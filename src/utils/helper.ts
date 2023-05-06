export const generateRandomNumber = (min: number, max: number) => {
	const random = Math.floor(Math.random() * (max - min + 1)) + min;
	return random;
};

export const generateRandomWeightedNumber = (weights: number[]) => {
	if (!weights.length) return -1;

	const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);
	if (totalWeight !== 1) return -1;

	const randomNum = Math.random() * totalWeight;
	let weightSum = 0;

	for (let i = 0; i < weights.length; i += 1) {
		weightSum += weights[i];
		if (randomNum < weightSum) {
			return i;
		}
	}

	return -1;
};
