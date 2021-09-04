import {MigrationInterface, QueryRunner} from "typeorm";

export class serviceHome1622608047889 implements MigrationInterface {
    name = 'serviceHome1622608047889'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "automation" ADD "hcId" character varying(128)`);
        await queryRunner.query(`ALTER TABLE "automation" ADD "hcInfo" jsonb NOT NULL DEFAULT '{}'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "automation" DROP COLUMN "hcInfo"`);
        await queryRunner.query(`ALTER TABLE "automation" DROP COLUMN "hcId"`);
    }

}
