import { Response } from "express";
import { PokemonClient } from "pokenode-ts";

const getRandomPokemon = async (res: Response, api: PokemonClient) => {
	const pokedexStart = 1;
	const pokedexEnd = 386;
	const randomPokemonId =
		Math.floor(Math.random() * (pokedexEnd - pokedexStart + 1)) + pokedexStart;

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
const getRandomEgg = () => {
	// Get current player
	// Check player level
	// Load egg rarity distribution based on player level
	// Generate random rarity
	// Get list of pokemons within rarity
	// Generate random pokemon with rarity
	// Store random pokemon in pc (or party if empty)
};

export { getRandomPokemon, getRandomEgg };
