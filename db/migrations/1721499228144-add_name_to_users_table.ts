import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddNameToUsersTable1721499228144 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "users" ADD COLUMN "name" VARCHAR(255);
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "users" DROP COLUMN "name";
        `);
  }
}
