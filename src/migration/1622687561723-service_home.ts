import {MigrationInterface, QueryRunner} from "typeorm";

export class serviceHome1622687561723 implements MigrationInterface {
    name = 'serviceHome1622687561723'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "entity" ADD "vendorId" character varying(128)`);
        await queryRunner.query(`ALTER TABLE "entity" ADD "vendorName" character varying(256)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "entity" DROP COLUMN "vendorName"`);
        await queryRunner.query(`ALTER TABLE "entity" DROP COLUMN "vendorId"`);
    }

}
