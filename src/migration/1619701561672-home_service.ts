import {MigrationInterface, QueryRunner} from "typeorm";

export class homeService1619701561672 implements MigrationInterface {
    name = 'homeService1619701561672'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "home" RENAME COLUMN "pos" TO "position"`);
        await queryRunner.query(`ALTER TABLE "entity" DROP COLUMN "parent"`);
        await queryRunner.query(`ALTER TABLE "entity" DROP COLUMN "fig"`);
        await queryRunner.query(`ALTER TABLE "entity" DROP COLUMN "connection"`);
        await queryRunner.query(`ALTER TABLE "entity" ADD "position" integer`);
        await queryRunner.query(`ALTER TABLE "entity" ADD "parentId" character varying(128)`);
        await queryRunner.query(`ALTER TABLE "entity" ADD "typeName" character varying(128) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "entity" ADD "categoryName" character varying(128) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "entity" ADD "connectionId" character varying(128) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "entity" ADD "connectionName" character varying(128) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "entity" ADD "familyId" character varying(128) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "entity" ADD "familyName" character varying(128) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "entity" ADD "appCode" character varying(128)`);
        await queryRunner.query(`ALTER TABLE "home" DROP COLUMN "position"`);
        await queryRunner.query(`ALTER TABLE "home" ADD "position" integer`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "home" DROP COLUMN "position"`);
        await queryRunner.query(`ALTER TABLE "home" ADD "position" character varying(64)`);
        await queryRunner.query(`ALTER TABLE "entity" DROP COLUMN "appCode"`);
        await queryRunner.query(`ALTER TABLE "entity" DROP COLUMN "familyName"`);
        await queryRunner.query(`ALTER TABLE "entity" DROP COLUMN "familyId"`);
        await queryRunner.query(`ALTER TABLE "entity" DROP COLUMN "connectionName"`);
        await queryRunner.query(`ALTER TABLE "entity" DROP COLUMN "connectionId"`);
        await queryRunner.query(`ALTER TABLE "entity" DROP COLUMN "categoryName"`);
        await queryRunner.query(`ALTER TABLE "entity" DROP COLUMN "typeName"`);
        await queryRunner.query(`ALTER TABLE "entity" DROP COLUMN "parentId"`);
        await queryRunner.query(`ALTER TABLE "entity" DROP COLUMN "position"`);
        await queryRunner.query(`ALTER TABLE "entity" ADD "connection" character varying(128) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "entity" ADD "fig" character varying(128) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "entity" ADD "parent" character varying(128)`);
        await queryRunner.query(`ALTER TABLE "home" RENAME COLUMN "position" TO "pos"`);
    }

}
