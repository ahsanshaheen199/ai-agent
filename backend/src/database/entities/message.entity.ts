import {
	Column,
	CreateDateColumn,
	Entity,
	JoinColumn,
	ManyToOne,
	PrimaryColumn,
	UpdateDateColumn,
} from 'typeorm';
import { Chat } from './chat.entity';
import { BeforeInsert } from 'typeorm';
import { ulid } from 'ulid';

export enum Role {
	SYSTEM = 'system',
	USER = 'user',
	ASSISTANT = 'assistant',
}

@Entity({ name: 'messages' })
export class Message {
	@PrimaryColumn({ type: 'character', length: 26 })
	id: string;

	@Column({ type: 'json' })
	parts: string;

	@ManyToOne(() => Chat, (chat) => chat.messages, { onDelete: 'CASCADE' })
	@JoinColumn({ name: 'chat_id' })
	chat: Chat;

	@CreateDateColumn({ name: 'created_at' })
	createdAt: Date;

	@UpdateDateColumn({ name: 'updated_at' })
	updatedAt: Date;

	@Column({ type: 'enum', enum: Role, default: Role.USER })
	role: Role;

	@BeforeInsert()
	async beforeInsert() {
		this.id = ulid();
	}
}
