import {
	Column,
	CreateDateColumn,
	Entity,
	JoinColumn,
	OneToOne,
	PrimaryGeneratedColumn,
	Relation,
	UpdateDateColumn,
} from "typeorm";
import Trainer from "./Trainer.js";

@Entity()
class User {
	@PrimaryGeneratedColumn()
	id!: number;

	@Column("varchar", { unique: true })
	username!: string;

	@Column({ type: "varchar", nullable: true })
	passwordHash!: string | undefined;

	@OneToOne(() => Trainer, { cascade: true })
	@JoinColumn()
	trainer!: Relation<Trainer>;

	@CreateDateColumn({ name: "created_at" })
	createdAt!: Date;

	@UpdateDateColumn({ name: "updated_at" })
	updatedAt!: Date;
}

export default User;
