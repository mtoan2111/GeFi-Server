import {MigrationInterface, QueryRunner} from "typeorm";

export class serviceHome1623916305451 implements MigrationInterface {
    name = 'serviceHome1623916305451'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "automation" DROP COLUMN "input"`);
        await queryRunner.query(`ALTER TABLE "automation" DROP COLUMN "output"`);
        await queryRunner.query(`ALTER TABLE "home" ADD "longitude" double precision`);
        await queryRunner.query(`ALTER TABLE "home" ADD "latitude" double precision`);
        await queryRunner.query(`ALTER TABLE "home" ADD "address" character varying(1024)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "home" DROP COLUMN "address"`);
        await queryRunner.query(`ALTER TABLE "home" DROP COLUMN "latitude"`);
        await queryRunner.query(`ALTER TABLE "home" DROP COLUMN "longitude"`);
        await queryRunner.query(`ALTER TABLE "automation" ADD "output" jsonb NOT NULL DEFAULT '{}'`);
        await queryRunner.query(`ALTER TABLE "automation" ADD "input" jsonb NOT NULL DEFAULT '{}'`);
    }

}
