import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateChatAndMessageTable1761227564734
	implements MigrationInterface
{
	name = 'CreateChatAndMessageTable1761227564734';

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`CREATE TYPE "public"."messages_role_enum" AS ENUM('system', 'user', 'assistant')`
		);
		await queryRunner.query(
			`CREATE TABLE "messages" ("id" character(26) NOT NULL, "parts" json NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "role" "public"."messages_role_enum" NOT NULL DEFAULT 'user', "chat_id" character(26), CONSTRAINT "PK_18325f38ae6de43878487eff986" PRIMARY KEY ("id"))`
		);
		await queryRunner.query(
			`CREATE TABLE "chats" ("id" character(26) NOT NULL, "title" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "user_id" character(26), CONSTRAINT "PK_0117647b3c4a4e5ff198aeb6206" PRIMARY KEY ("id"))`
		);
		await queryRunner.query(
			`ALTER TABLE "messages" ADD CONSTRAINT "FK_7540635fef1922f0b156b9ef74f" FOREIGN KEY ("chat_id") REFERENCES "chats"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
		);
		await queryRunner.query(
			`ALTER TABLE "chats" ADD CONSTRAINT "FK_b6c92d818d42e3e298e84d94414" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`ALTER TABLE "chats" DROP CONSTRAINT "FK_b6c92d818d42e3e298e84d94414"`
		);
		await queryRunner.query(
			`ALTER TABLE "messages" DROP CONSTRAINT "FK_7540635fef1922f0b156b9ef74f"`
		);
		await queryRunner.query(`DROP TABLE "chats"`);
		await queryRunner.query(`DROP TABLE "messages"`);
		await queryRunner.query(`DROP TYPE "public"."messages_role_enum"`);
	}
}
