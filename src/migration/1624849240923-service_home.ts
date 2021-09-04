import {MigrationInterface, QueryRunner} from "typeorm";

export class serviceHome1624849240923 implements MigrationInterface {
    name = 'serviceHome1624849240923'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "entity" ADD "typeCode" character varying(128)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "entity" DROP COLUMN "typeCode"`);
    }

}
