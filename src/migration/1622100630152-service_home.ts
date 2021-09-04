import {MigrationInterface, QueryRunner} from "typeorm";

export class serviceHome1622100630152 implements MigrationInterface {
    name = 'serviceHome1622100630152'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "automation" DROP COLUMN "typeId"`);
        await queryRunner.query(`ALTER TABLE "automation" ADD "type" character varying(32)`);
        await queryRunner.query(`ALTER TABLE "automation" ADD "appName" character varying(256)`);
        await queryRunner.query(`ALTER TABLE "automation" ADD "logo" character varying(128)`);
        await queryRunner.query(`ALTER TABLE "automation" ADD "position" integer`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "automation" DROP COLUMN "position"`);
        await queryRunner.query(`ALTER TABLE "automation" DROP COLUMN "logo"`);
        await queryRunner.query(`ALTER TABLE "automation" DROP COLUMN "appName"`);
        await queryRunner.query(`ALTER TABLE "automation" DROP COLUMN "type"`);
        await queryRunner.query(`ALTER TABLE "automation" ADD "typeId" integer`);
    }

}
