import {MigrationInterface, QueryRunner} from "typeorm";

export class serviceHome1620964895688 implements MigrationInterface {
    name = 'serviceHome1620964895688'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "area" ADD "appName" character varying(256)`);
        await queryRunner.query(`ALTER TABLE "area_statistical" ADD "appName" character varying(256)`);
        await queryRunner.query(`ALTER TABLE "home" ADD "appName" character varying(256)`);
        await queryRunner.query(`ALTER TABLE "home_statistical" ADD "appName" character varying(256)`);
        await queryRunner.query(`ALTER TABLE "invitation" ADD "appName" character varying(256)`);
        await queryRunner.query(`ALTER TABLE "member" ADD "appName" character varying(256)`);
        await queryRunner.query(`ALTER TABLE "user" ADD "appName" character varying(256)`);
        await queryRunner.query(`ALTER TABLE "verify" ADD "appName" character varying(256)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "verify" DROP COLUMN "appName"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "appName"`);
        await queryRunner.query(`ALTER TABLE "member" DROP COLUMN "appName"`);
        await queryRunner.query(`ALTER TABLE "invitation" DROP COLUMN "appName"`);
        await queryRunner.query(`ALTER TABLE "home_statistical" DROP COLUMN "appName"`);
        await queryRunner.query(`ALTER TABLE "home" DROP COLUMN "appName"`);
        await queryRunner.query(`ALTER TABLE "area_statistical" DROP COLUMN "appName"`);
        await queryRunner.query(`ALTER TABLE "area" DROP COLUMN "appName"`);
    }

}
