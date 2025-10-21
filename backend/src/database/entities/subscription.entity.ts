import {
	BeforeInsert,
	Column,
	CreateDateColumn,
	Entity,
	JoinColumn,
	OneToOne,
	PrimaryColumn,
	UpdateDateColumn,
} from 'typeorm';
import { ulid } from 'ulid';
import { User } from './user.entity';

@Entity({ name: 'subscriptions' })
export class Subscription {
	@PrimaryColumn({ type: 'character', length: 26 })
	id: string;

	@OneToOne(() => User, (user) => user.subscription, { onDelete: 'CASCADE' })
	@JoinColumn({ name: 'user_id' })
	user: User;

	@Column({ name: 'plan_name' })
	planName: string;

	@Column({
		name: 'start_date',
		default: () => 'now()',
	})
	startDate: Date;

	@Column({
		name: 'end_date',
		nullable: true,
	})
	endDate?: Date;

	@Column({
		name: 'status',
	})
	status: string;

	@Column({
		name: 'stripe_subscription_id',
		nullable: true,
	})
	stripeSubscriptionId?: string;

	@Column({
		name: 'stripe_price_id',
		nullable: true,
	})
	stripePriceId?: string;

	@CreateDateColumn({ name: 'created_at' })
	createdAt: Date;

	@UpdateDateColumn({ name: 'updated_at' })
	updatedAt: Date;

	@BeforeInsert()
	async beforeInsert() {
		this.id = ulid();
	}
}
