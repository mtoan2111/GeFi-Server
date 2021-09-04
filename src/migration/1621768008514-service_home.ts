import {MigrationInterface, QueryRunner} from "typeorm";

export class serviceHome1621768008514 implements MigrationInterface {
    name = 'serviceHome1621768008514'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "appName"`);
        await queryRunner.query(`ALTER TABLE "area_statistical" ADD "cHC" integer`);
        await queryRunner.query(`ALTER TABLE "home_statistical" ADD "cHC" integer`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "home_statistical" DROP COLUMN "cHC"`);
        await queryRunner.query(`ALTER TABLE "area_statistical" DROP COLUMN "cHC"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "appName" character varying(256)`);
    }

}
