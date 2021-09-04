import {MigrationInterface, QueryRunner} from "typeorm";

export class serviceHome1622104121833 implements MigrationInterface {
    name = 'serviceHome1622104121833'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "automation" ADD "name" character varying(256)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "automation" DROP COLUMN "name"`);
    }

}
