import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddEmailVerifiedAndEmailVerificationTokenToUsersTable1721327910396
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "users" ADD COLUMN "email_verified" BOOLEAN NOT NULL DEFAULT false;
            ALTER TABLE "users" ADD COLUMN "email_verification_token" VARCHAR(255);
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "users" DROP COLUMN "email_verified";
            ALTER TABLE "users" DROP COLUMN "email_verification_token";
        `);
  }
}
