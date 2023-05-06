import { Response } from "express";
import { PokemonClient } from "pokenode-ts";
import {
	generateRandomNumber,
	generateRandomWeightedNumber,
} from "../utils/helper.js";

export const getRandomPokemon = async (res: Response, api: PokemonClient) => {
	const pokedexStart = 1;
	const pokedexEnd = 386;
	const randomPokemonId = generateRandomNumber(pokedexStart, pokedexEnd);
	const randomPokemon = await api.getPokemonById(randomPokemonId);
	res.send(randomPokemon);
};

/**
 * Used to get random egg for pokemon
 * Generate random egg tier (eggs can be tier 1 - 3)
 * Should probably add percentage for each tier (percentages scale with player level)
 * Each tier should have different step counters for hatching (1. 2k, 2. 5k, 3. 10k)
 * Within each tier, generate random pokemon from tier
 */
export const getRandomEgg = (res: Response) => {
	// Get current player
	// Check player level
	// Load egg rarity distribution based on player level
	const weights = [0.25, 0.3, 0.3, 0.15]; // weights must add up to 1
	// Generate random rarity
	const randomNumber = generateRandomWeightedNumber(weights);

	// Get list of pokemons within rarity
	// Generate random pokemon with rarity
	// Store random pokemon in pc (or party if empty)
	res.send(`Number => ${randomNumber}`);
};
