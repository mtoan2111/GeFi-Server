import {MigrationInterface, QueryRunner} from "typeorm";

export class serviceHome1626407940630 implements MigrationInterface {
    name = 'serviceHome1626407940630'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "automation" ADD "GMT" integer`);
        await queryRunner.query(`ALTER TABLE "automation" DROP COLUMN "logic"`);
        await queryRunner.query(`ALTER TABLE "automation" ADD "logic" character varying(32)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "automation" DROP COLUMN "logic"`);
        await queryRunner.query(`ALTER TABLE "automation" ADD "logic" character varying`);
        await queryRunner.query(`ALTER TABLE "automation" DROP COLUMN "GMT"`);
    }

}
