import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUserOauthTable1721318936923 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE "user_oauth" (
                "id" SERIAL PRIMARY KEY,
                "user_id" INT NOT NULL REFERENCES "users" ("id"),
                "provider_id" INT NOT NULL REFERENCES "oauth_providers" ("id"),
                "provider_user_id" VARCHAR(255) NOT NULL,
                "access_token" TEXT NOT NULL,
                "refresh_token" TEXT,
                "expires_at" TIMESTAMP,
                "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                UNIQUE ("user_id", "provider_id")
            );
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            DROP TABLE "user_oauth";
        `);
  }
}
