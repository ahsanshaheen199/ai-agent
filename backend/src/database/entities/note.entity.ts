import {
	BeforeInsert,
	Column,
	CreateDateColumn,
	Entity,
	JoinColumn,
	ManyToOne,
	PrimaryColumn,
	UpdateDateColumn,
} from 'typeorm';
import { ulid } from 'ulid';
import { User } from './user.entity';

@Entity({ name: 'notes' })
export class Note {
	@PrimaryColumn({ type: 'character', length: 26 })
	id: string;

	@Column({ type: 'varchar' })
	title: string;

	@Column({ type: 'text' })
	content: string;

	@CreateDateColumn({ name: 'created_at' })
	createdAt: Date;

	@UpdateDateColumn({ name: 'updated_at' })
	updatedAt: Date;

	@ManyToOne(() => User, (user) => user.notes, { onDelete: 'CASCADE' })
	@JoinColumn({ name: 'user_id' })
	user: User;

	@BeforeInsert()
	async beforeInsert() {
		this.id = ulid();
	}
}
