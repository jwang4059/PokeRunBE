import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
class PokemonTier {
	@PrimaryGeneratedColumn()
	id!: number;

	@Column()
	pokemonId!: string;

	@Column()
	pokemonTier!: number;

	@Column()
	eggTier!: number;
}

export default PokemonTier;
