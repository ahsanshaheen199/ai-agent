import {
	BeforeInsert,
	Column,
	CreateDateColumn,
	Entity,
	OneToOne,
	OneToMany,
	PrimaryColumn,
	UpdateDateColumn,
} from 'typeorm';
import { ulid } from 'ulid';
import bcrypt from 'bcrypt';
import { Subscription } from './subscription.entity';
import { Note } from './note.entity';

@Entity({ name: 'users' })
export class User {
	@PrimaryColumn({ type: 'character', length: 26 })
	id: string;

	@Column({ name: 'first_name', nullable: true })
	firstName: string;

	@Column({ name: 'last_name', nullable: true })
	lastName: string;

	@Column({ unique: true })
	email: string;

	@Column({ nullable: true })
	password: string;

	@CreateDateColumn({ name: 'created_at' })
	createdAt: Date;

	@UpdateDateColumn({ name: 'updated_at' })
	updatedAt: Date;

	@OneToOne(() => Subscription, (subscription) => subscription.user)
	subscription: Subscription;

	@OneToMany(() => Note, (note) => note.user)
	notes: Note[];

	@BeforeInsert()
	async beforeInsert() {
		this.id = ulid();
		if (this.password) {
			this.password = await bcrypt.hash(this.password, 10);
		}
	}
}
