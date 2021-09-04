import {MigrationInterface, QueryRunner} from "typeorm";

export class serviceHome1622111447575 implements MigrationInterface {
    name = 'serviceHome1622111447575'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "automation" ADD "inputIds" character varying(128) array`);
        await queryRunner.query(`ALTER TABLE "automation" ADD "outputIds" character varying(128) array`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "automation" DROP COLUMN "outputIds"`);
        await queryRunner.query(`ALTER TABLE "automation" DROP COLUMN "inputIds"`);
    }

}
