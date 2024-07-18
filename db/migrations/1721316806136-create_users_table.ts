import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUsersTable1721316806136 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "users" (
                "id" SERIAL PRIMARY KEY,
                "email" VARCHAR(255) NOT NULL UNIQUE,
                "password" VARCHAR(255),
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "login_count" INT DEFAULT 0,
                "last_login_at" TIMESTAMP,
                "last_logout_at" TIMESTAMP                
            );`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            DROP TABLE "users";
        `);
  }
}
