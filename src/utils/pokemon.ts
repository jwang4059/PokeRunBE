import {
	GENDERS,
	GrowthRateExperienceLevel,
	MainClient,
	MoveClient,
	NATURES,
	Pokemon,
	PokemonAbility,
	PokemonClient,
	PokemonHeldItem,
	PokemonMove,
} from "pokenode-ts";
import { POKEDEX_LIMIT, SPECIES_LIMIT, VERSION_GROUP } from "../constants.js";
import {
	generateRandomNumber,
	generateRandomWeightedNumber,
	getIdFromUrl,
} from "./helper.js";

export const getRandomPokemon = async (api: PokemonClient) => {
	const pokedexStart = 1;
	const pokedexEnd = POKEDEX_LIMIT;
	const randomPokemonId = generateRandomNumber(pokedexStart, pokedexEnd);
	const randomPokemon = api.getPokemonById(randomPokemonId);

	return randomPokemon;
};

export const getRandomEgg = async (api: MainClient) => {
	const evolutionChainStart = 1;
	const evolutionChainEnd = SPECIES_LIMIT;

	let pokemon: Pokemon | null = null;

	while (!pokemon) {
		const randomEvolutionChainId = generateRandomNumber(
			evolutionChainStart,
			evolutionChainEnd
		);

		// eslint-disable-next-line no-await-in-loop
		const evolutionChain = await api.evolution.getEvolutionChainById(
			randomEvolutionChainId
		);

		// eslint-disable-next-line no-await-in-loop
		const species = await api.pokemon.getPokemonSpeciesByName(
			evolutionChain.chain.species.name
		);

		if (
			!species.is_legendary &&
			!species.is_mythical &&
			species.name !== "unown" &&
			species.name !== "ditto"
		) {
			const defaultSpecies = species.varieties.find(
				(variety) => variety.is_default
			);

			if (defaultSpecies) {
				// eslint-disable-next-line no-await-in-loop
				pokemon = await api.pokemon.getPokemonByName(
					defaultSpecies.pokemon.name
				);
			} else {
				// eslint-disable-next-line no-await-in-loop
				pokemon = await api.pokemon.getPokemonByName(species.name);
			}
		}
	}

	return pokemon;
};

export const getRandomLevel = (min = 1, max = 100, weights = []) => {
	if (weights.length > 0) {
		return min + generateRandomWeightedNumber(weights);
	}

	return generateRandomNumber(min, max);
};

export const getRandomGenderId = (genderRate: number) => {
	if (genderRate === -1) return GENDERS.GENDERLESS;

	const rateOfFemale = genderRate / 8;
	const rateOfMale = 1 - rateOfFemale;
	const genderId = generateRandomWeightedNumber([rateOfFemale, rateOfMale]);

	return genderId === 1 ? GENDERS.FEMALE : GENDERS.MALE;
};

export const getRandomAbilityId = (abilities: PokemonAbility[]) => {
	const nonHiddenAbilities = abilities.filter((ability) => !ability.is_hidden);
	const abilityUrl =
		nonHiddenAbilities[generateRandomNumber(0, nonHiddenAbilities.length - 1)]
			.ability.url;

	return getIdFromUrl(abilityUrl);
};

export const getRandomNatureId = () =>
	generateRandomNumber(1, Object.keys(NATURES).length);

export const getRandomItemId = (items: PokemonHeldItem[]) => {
	const itemProbabilities = items.map((item) => {
		const itemFromVersionGroup = item.version_details.find(
			(detail) => detail.version.name === VERSION_GROUP
		);

		if (itemFromVersionGroup) return itemFromVersionGroup.rarity / 100;
		return 0;
	});

	const probabilityOfItem = itemProbabilities.reduce(
		(acc, curr) => acc + curr,
		0
	);

	const probabilityOfNoItem = 1 - probabilityOfItem;

	itemProbabilities.push(probabilityOfNoItem);

	const itemIndex = generateRandomWeightedNumber(itemProbabilities) - 1;

	if (itemIndex >= items.length) return null;

	const itemUrl = items[itemIndex].item.url;

	return getIdFromUrl(itemUrl);
};

export const getRandomIv = () => generateRandomNumber(0, 31);

export const getExperience = (
	levels: GrowthRateExperienceLevel[],
	currentLevel: number
) => {
	let left = 0;
	let right = levels.length - 1;

	while (left <= right) {
		const mid = Math.floor((left + right) / 2);

		// Element found, return its index
		if (levels[mid].level === currentLevel) {
			return levels[mid].experience;
		}

		if (levels[mid].level < currentLevel) {
			// Continue searching in the right half
			left = mid + 1;
		} else {
			// Continue searching in the left half
			right = mid - 1;
		}
	}

	return 0; // Element not found
};

const compareMoves = (moveX: PokemonMove, moveY: PokemonMove) => {
	const moveXDetail = moveX.version_group_details.find(
		(detail) => detail.version_group.name === VERSION_GROUP
	);
	const moveYDetail = moveY.version_group_details.find(
		(detail) => detail.version_group.name === VERSION_GROUP
	);
	const moveXLvl = moveXDetail ? moveXDetail.level_learned_at : 0;
	const moveYLvl = moveYDetail ? moveYDetail.level_learned_at : 0;

	if (moveXLvl !== moveYLvl) return moveXLvl - moveYLvl;

	const moveXName = moveX.move.name.toUpperCase();
	const moveYName = moveY.move.name.toUpperCase();

	if (moveXName < moveYName) return -1;
	if (moveXName > moveYName) return 1;
	return 0;
};

export const findIndexOfLastMove = (
	moves: PokemonMove[],
	currentLevel: number
) => {
	let left = 0;
	let right = moves.length - 1;
	let closestIndex = -1;

	while (left <= right) {
		const mid = Math.floor((left + right) / 2);
		const versionGroup = moves[mid].version_group_details.find(
			(detail) => detail.version_group.name === VERSION_GROUP
		);

		if (versionGroup) {
			// Element found, return its index
			if (versionGroup.level_learned_at === currentLevel) {
				return mid;
			}

			if (versionGroup.level_learned_at < currentLevel) {
				// Continue searching in the right half
				left = mid + 1;
				closestIndex = mid;
			} else {
				// Continue searching in the left half
				right = mid - 1;
			}
		} else {
			return closestIndex; // Version group not found
		}
	}

	return closestIndex; // Element not found
};

export const getLatestMoves = async (
	moveList: PokemonMove[],
	currentLevel: number,
	api: MoveClient
) => {
	const filteredMoves = moveList.filter(
		(move) =>
			move.version_group_details.find(
				(detail) =>
					detail.move_learn_method.name === "level-up" &&
					detail.version_group.name === VERSION_GROUP
			) !== undefined
	);

	filteredMoves.sort(compareMoves);

	const numberOfMoves = 4;
	const end = findIndexOfLastMove(filteredMoves, currentLevel);
	const start = Math.max(end - numberOfMoves + 1, 0);
	const movePromises = [];

	for (let i = start; i <= end; i += 1) {
		const move = api.getMoveByName(filteredMoves[i].move.name);
		movePromises.push(move);
	}

	const moves = await Promise.all(movePromises);

	return moves;
};

export const calcReward = (distance: number) => {
	const breakpoints = [1, 2, 3, 6, 9, 13, 18, 26];
	let index = breakpoints.length - 1;

	while (index >= 0) {
		if (distance >= breakpoints[index]) return index + 1;
		index -= 1;
	}

	return 0;
};
