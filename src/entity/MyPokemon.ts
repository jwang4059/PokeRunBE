import { Genders } from "pokenode-ts";
import {
	Check,
	Column,
	CreateDateColumn,
	Entity,
	ManyToOne,
	PrimaryGeneratedColumn,
	Relation,
	UpdateDateColumn,
} from "typeorm";
import Trainer from "./Trainer.js";

@Entity({ name: "pokemon" })
class MyPokemon {
	@PrimaryGeneratedColumn()
	id!: number;

	@Column("varchar", {
		length: 12,
	})
	name!: string;

	@Column("smallint", { name: "pokemon_id" })
	pokemonId!: number;

	@Column("smallint")
	level!: number;

	@Column("enum", { name: "gender_id", enum: Genders, default: Genders.FEMALE })
	genderId!: Genders;

	@Column("smallint", { name: "ability_id" })
	abilityId!: number;

	@Column("smallint", { name: "nature_id" })
	natureId!: number;

	@Column("smallint", { name: "level_first_caught", default: 1 })
	levelFirstCaught!: number;

	@CreateDateColumn({ name: "date_of_catch" })
	dateOfCatch!: Date;

	@Column("varchar", { name: "item_id", nullable: true })
	itemId!: number | null;

	@Column("smallint", { default: 0 })
	@Check("happiness BETWEEN 0 AND 255")
	happiness!: number;

	@Column("smallint", { name: "hp_iv", default: 0 })
	@Check("hp_iv BETWEEN 0 AND 31")
	hpIV = 0;

	@Column("smallint", { name: "attack_iv", default: 0 })
	@Check("attack_iv BETWEEN 0 AND 31")
	attackIV = 0;

	@Column("smallint", { name: "defense_iv", default: 0 })
	@Check("defense_iv BETWEEN 0 AND 31")
	defenseIV = 0;

	@Column("smallint", { name: "sp_atk_iv", default: 0 })
	@Check("sp_atk_iv BETWEEN 0 AND 31")
	spAtkIV = 0;

	@Column("smallint", { name: "sp_def_iv", default: 0 })
	@Check("sp_def_iv BETWEEN 0 AND 31")
	spDefIV = 0;

	@Column("smallint", { name: "speed_iv", default: 0 })
	@Check("speed_iv BETWEEN 0 AND 31")
	speedIV = 0;

	@Column("smallint", { name: "hp_ev", default: 0 })
	@Check(
		"hp_ev BETWEEN 0 AND 255 AND hp_ev + attack_ev + defense_ev + sp_atk_ev + sp_def_ev + speed_ev <= 510"
	)
	hpEV = 0;

	@Column("smallint", { name: "attack_ev", default: 0 })
	@Check(
		"attack_ev BETWEEN 0 AND 255 AND hp_ev + attack_ev + defense_ev + sp_atk_ev + sp_def_ev + speed_ev <= 510"
	)
	attackEV = 0;

	@Column("smallint", { name: "defense_ev", default: 0 })
	@Check(
		"defense_ev BETWEEN 0 AND 255 AND hp_ev + attack_ev + defense_ev + sp_atk_ev + sp_def_ev + speed_ev <= 510"
	)
	defenseEV = 0;

	@Column("smallint", { name: "sp_atk_ev", default: 0 })
	@Check(
		"sp_atk_ev BETWEEN 0 AND 255 AND hp_ev + attack_ev + defense_ev + sp_atk_ev + sp_def_ev + speed_ev <= 510"
	)
	spAtkEV = 0;

	@Column("smallint", { name: "sp_def_ev", default: 0 })
	@Check(
		"sp_def_ev BETWEEN 0 AND 255 AND hp_ev + attack_ev + defense_ev + sp_atk_ev + sp_def_ev + speed_ev <= 510"
	)
	spDefEV = 0;

	@Column("smallint", { name: "speed_ev", default: 0 })
	@Check(
		"speed_ev BETWEEN 0 AND 255 AND hp_ev + attack_ev + defense_ev + sp_atk_ev + sp_def_ev + speed_ev <= 510"
	)
	speedEV = 0;

	@Column("int", { default: 0 })
	experience = 0;

	@Column("smallint", { name: "move_1_id", nullable: true })
	move1Id!: number | null;

	@Column("smallint", { name: "move_2_id", nullable: true })
	move2Id!: number | null;

	@Column("smallint", { name: "move_3_id", nullable: true })
	move3Id!: number | null;

	@Column("smallint", { name: "move_4_id", nullable: true })
	move4Id!: number | null;

	@Column("smallint", { name: "move_1_pp", nullable: true })
	move1PP!: number | null;

	@Column("smallint", { name: "move_2_pp", nullable: true })
	move2PP!: number | null;

	@Column("smallint", { name: "move_3_pp", nullable: true })
	move3PP!: number | null;

	@Column("smallint", { name: "move_4_pp", nullable: true })
	move4PP!: number | null;

	@Column("int", { default: 0 })
	steps = 0;

	@Column("boolean", { name: "is_egg", default: true })
	isEgg = true;

	@ManyToOne(() => Trainer, (trainer) => trainer.pokemons)
	trainer!: Relation<Trainer>;

	@CreateDateColumn({ name: "created_at" })
	createdAt!: Date;

	@UpdateDateColumn({ name: "updated_at" })
	updatedAt!: Date;
}

export default MyPokemon;
