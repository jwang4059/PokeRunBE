import { Request, Response } from "express";
import { MainClient, Pokemon } from "pokenode-ts";
import { DataSource } from "typeorm";
import { FAILED, SUCCESS } from "../constants.js";
import MyPokemon from "../entity/MyPokemon.js";
import Trainer from "../entity/Trainer.js";
import {
	generateRandomNumber,
	generateRandomWeightedNumber,
} from "../utils/helper.js";
import {
	calcReward,
	getExperience,
	getLatestMoves,
	getRandomAbilityId,
	getRandomEgg,
	getRandomGenderId,
	getRandomItemId,
	getRandomIv,
	getRandomNatureId,
} from "../utils/pokemon.js";
import { createErrorMsg } from "../utils/messages.js";

/**
 * Used to get random egg for pokemon
 * Generate random egg tier (eggs can be tier 1 - 3)
 * Should probably add percentage for each tier (percentages scale with player level)
 * Each tier should have different step counters for hatching (1. 2k, 2. 5k, 3. 10k)
 * Within each tier, generate random pokemon from tier
 */
export const getRandomEggDraft = (res: Response) => {
	// Get current player
	// Check player level
	// Load egg rarity distribution based on player level
	const weights = [0.25, 0.3, 0.3, 0.15]; // weights must add up to 1
	// Generate random rarity
	const randomNumber = generateRandomWeightedNumber(weights);

	// Get number of pokemons within rarity (should get length from sql db)
	const numberOfPokemons = 5;

	// Generate random pokemon with rarity (use prev number as max)
	const randomPokemonNumber = generateRandomNumber(0, numberOfPokemons);
	console.log(randomPokemonNumber);

	// If possible, get pokemon without retrieving entire list of pokemons
	// Else, get entire list and use randomPokemonNumber to get pokemon

	// Store random pokemon in pc (or party if empty)
	res.send(`Number => ${randomNumber}`);
};

const getPokemonReward = async (
	req: Request,
	res: Response,
	appDataSource: DataSource,
	api: MainClient
) => {
	const { trainerId, distance } = req.body;
	if (!trainerId || !distance) {
		res.json({
			status: FAILED,
			message: "Missing required parameters",
		});

		return;
	}

	try {
		const trainerRepository = appDataSource.getRepository(Trainer);
		const trainer = await trainerRepository.findOneBy({ id: trainerId });

		if (!trainer) {
			res.status(400).json(createErrorMsg("Invalid trainerId"));
			return;
		}

		const pokemonRepository = appDataSource.getRepository(MyPokemon);

		const numberOfPokemons = calcReward(distance);

		if (numberOfPokemons === 0) {
			res.json([]);
		} else {
			const pokemonPromises: Promise<Pokemon>[] = [];

			for (let i = 0; i < numberOfPokemons; i += 1) {
				pokemonPromises.push(getRandomEgg(api));
			}

			const pokemons = await Promise.all(pokemonPromises);

			const myPokemonPromises = pokemons.map(async (pokemon) => {
				const levelFirstCaught = 5;

				const species = await api.pokemon.getPokemonSpeciesByName(
					pokemon.species.name
				);

				const growthRate = await api.pokemon.getGrowthRateByName(
					species.growth_rate.name
				);

				const [move1, move2, move3, move4] = await getLatestMoves(
					pokemon.moves,
					levelFirstCaught,
					api.move
				);

				return pokemonRepository.create({
					name: pokemon.name,
					pokemonId: pokemon.id,
					level: levelFirstCaught,
					genderId: getRandomGenderId(species.gender_rate),
					abilityId: getRandomAbilityId(pokemon.abilities),
					natureId: getRandomNatureId(),
					levelFirstCaught,
					itemId: getRandomItemId(pokemon.held_items),
					happiness: species.base_happiness,
					hpIV: getRandomIv(),
					attackIV: getRandomIv(),
					defenseIV: getRandomIv(),
					spAtkIV: getRandomIv(),
					spDefIV: getRandomIv(),
					speedIV: getRandomIv(),
					experience: getExperience(growthRate.levels, levelFirstCaught),
					move1Id: move1 ? move1.id : null,
					move2Id: move2 ? move2.id : null,
					move3Id: move3 ? move3.id : null,
					move4Id: move4 ? move4.id : null,
					move1PP: move1 ? move1.pp : null,
					move2PP: move2 ? move2.pp : null,
					move3PP: move3 ? move3.pp : null,
					move4PP: move4 ? move4.pp : null,
					steps: 255 * (species.hatch_counter + 1),
					trainer,
				});
			});

			const myPokemons = await Promise.all(myPokemonPromises);

			const savedPokemons = await pokemonRepository.save(myPokemons);

			res.json({ status: SUCCESS, pokemons: savedPokemons });
		}
	} catch (e) {
		console.log(e);
		res.status(400).json(e);
	}
};

export default {
	getPokemonReward,
};
