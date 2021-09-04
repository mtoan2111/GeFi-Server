import {MigrationInterface, QueryRunner} from "typeorm";

export class serviceHome1622104753688 implements MigrationInterface {
    name = 'serviceHome1622104753688'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "automation" DROP COLUMN "trigger"`);
        await queryRunner.query(`ALTER TABLE "automation" ADD "trigger" json NOT NULL DEFAULT '{}'`);
        await queryRunner.query(`ALTER TABLE "automation" DROP COLUMN "input"`);
        await queryRunner.query(`ALTER TABLE "automation" ADD "input" json NOT NULL DEFAULT '{}'`);
        await queryRunner.query(`ALTER TABLE "automation" DROP COLUMN "output"`);
        await queryRunner.query(`ALTER TABLE "automation" ADD "output" json NOT NULL DEFAULT '{}'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "automation" DROP COLUMN "output"`);
        await queryRunner.query(`ALTER TABLE "automation" ADD "output" text NOT NULL DEFAULT '{}'`);
        await queryRunner.query(`ALTER TABLE "automation" DROP COLUMN "input"`);
        await queryRunner.query(`ALTER TABLE "automation" ADD "input" text NOT NULL DEFAULT '{}'`);
        await queryRunner.query(`ALTER TABLE "automation" DROP COLUMN "trigger"`);
        await queryRunner.query(`ALTER TABLE "automation" ADD "trigger" text NOT NULL DEFAULT '{}'`);
    }

}
