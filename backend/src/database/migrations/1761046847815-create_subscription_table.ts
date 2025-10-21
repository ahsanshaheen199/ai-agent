import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateSubscriptionTable1761046847815
	implements MigrationInterface
{
	name = 'CreateSubscriptionTable1761046847815';

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`CREATE TABLE "subscriptions" ("id" character(26) NOT NULL, "plan_name" character varying NOT NULL, "start_date" TIMESTAMP NOT NULL DEFAULT now(), "end_date" TIMESTAMP, "status" character varying NOT NULL, "stripe_subscription_id" character varying, "stripe_price_id" character varying, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "user_id" character(26), CONSTRAINT "REL_d0a95ef8a28188364c546eb65c" UNIQUE ("user_id"), CONSTRAINT "PK_a87248d73155605cf782be9ee5e" PRIMARY KEY ("id"))`
		);
		await queryRunner.query(
			`ALTER TABLE "subscriptions" ADD CONSTRAINT "FK_d0a95ef8a28188364c546eb65c1" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`ALTER TABLE "subscriptions" DROP CONSTRAINT "FK_d0a95ef8a28188364c546eb65c1"`
		);
		await queryRunner.query(`DROP TABLE "subscriptions"`);
	}
}
