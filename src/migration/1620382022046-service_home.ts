import {MigrationInterface, QueryRunner} from "typeorm";

export class serviceHome1620382022046 implements MigrationInterface {
    name = 'serviceHome1620382022046'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "entity" DROP COLUMN "appCode"`);
        await queryRunner.query(`ALTER TABLE "entity" ADD "appName" character varying(256)`);
        await queryRunner.query(`ALTER TABLE "entity" ALTER COLUMN "mac" DROP NOT NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "entity"."mac" IS NULL`);
        await queryRunner.query(`ALTER TABLE "entity" DROP COLUMN "typeName"`);
        await queryRunner.query(`ALTER TABLE "entity" ADD "typeName" character varying(256)`);
        await queryRunner.query(`ALTER TABLE "entity" DROP COLUMN "categoryName"`);
        await queryRunner.query(`ALTER TABLE "entity" ADD "categoryName" character varying(256)`);
        await queryRunner.query(`ALTER TABLE "entity" DROP COLUMN "connectionName"`);
        await queryRunner.query(`ALTER TABLE "entity" ADD "connectionName" character varying(257)`);
        await queryRunner.query(`ALTER TABLE "entity" DROP COLUMN "familyName"`);
        await queryRunner.query(`ALTER TABLE "entity" ADD "familyName" character varying(256)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "entity" DROP COLUMN "familyName"`);
        await queryRunner.query(`ALTER TABLE "entity" ADD "familyName" character varying(128) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "entity" DROP COLUMN "connectionName"`);
        await queryRunner.query(`ALTER TABLE "entity" ADD "connectionName" character varying(128) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "entity" DROP COLUMN "categoryName"`);
        await queryRunner.query(`ALTER TABLE "entity" ADD "categoryName" character varying(128) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "entity" DROP COLUMN "typeName"`);
        await queryRunner.query(`ALTER TABLE "entity" ADD "typeName" character varying(128) NOT NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "entity"."mac" IS NULL`);
        await queryRunner.query(`ALTER TABLE "entity" ALTER COLUMN "mac" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "entity" DROP COLUMN "appName"`);
        await queryRunner.query(`ALTER TABLE "entity" ADD "appCode" character varying(128)`);
    }

}
