import {
	Entity,
	Column,
	PrimaryGeneratedColumn,
	CreateDateColumn,
	UpdateDateColumn,
	OneToMany,
	Relation,
} from "typeorm";
import MyPokemon from "./MyPokemon.js";

@Entity()
class Trainer {
	@PrimaryGeneratedColumn("uuid")
	id!: string;

	@Column("varchar", { nullable: true })
	name!: string | undefined;

	@Column("varchar", { nullable: true })
	gender!: string | undefined;

	@OneToMany(() => MyPokemon, (pokemon) => pokemon.trainer)
	pokemons!: Relation<MyPokemon>[];

	@CreateDateColumn({ name: "created_at" })
	createdAt!: Date;

	@UpdateDateColumn({ name: "updated_at" })
	updatedAt!: Date;
}

export default Trainer;
