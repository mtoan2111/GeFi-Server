import {MigrationInterface, QueryRunner} from "typeorm";

export class homeService1624533057002 implements MigrationInterface {
    name = 'homeService1624533057002'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "area" RENAME COLUMN "appName" TO "appCode"`);
        await queryRunner.query(`ALTER TABLE "area_statistical" RENAME COLUMN "appName" TO "appCode"`);
        await queryRunner.query(`ALTER TABLE "home" RENAME COLUMN "appName" TO "appCode"`);
        await queryRunner.query(`ALTER TABLE "home_statistical" RENAME COLUMN "appName" TO "appCode"`);
        await queryRunner.query(`ALTER TABLE "invitation" RENAME COLUMN "appName" TO "appCode"`);
        await queryRunner.query(`ALTER TABLE "member" RENAME COLUMN "appName" TO "appCode"`);
        await queryRunner.query(`ALTER TABLE "verify" RENAME COLUMN "appName" TO "appCode"`);
        await queryRunner.query(`ALTER TABLE "version" RENAME COLUMN "appName" TO "appCode"`);
        await queryRunner.query(`ALTER TABLE "version" RENAME CONSTRAINT "PK_ba07c9f6d7f3b8e965e5abd805f" TO "PK_77eefff13013d1e47656d420815"`);
        await queryRunner.query(`ALTER TABLE "automation" DROP COLUMN "appName"`);
        await queryRunner.query(`ALTER TABLE "automation" ADD "appCode" character varying(50)`);
        await queryRunner.query(`ALTER TABLE "entity" ADD "appCode" character varying(50)`);
        await queryRunner.query(`ALTER TABLE "user" ADD "appCode" character varying(256)`);
        await queryRunner.query(`ALTER TABLE "area" DROP COLUMN "appCode"`);
        await queryRunner.query(`ALTER TABLE "area" ADD "appCode" character varying(50)`);
        await queryRunner.query(`ALTER TABLE "area_statistical" DROP COLUMN "appCode"`);
        await queryRunner.query(`ALTER TABLE "area_statistical" ADD "appCode" character varying(50)`);
        await queryRunner.query(`ALTER TABLE "home" DROP COLUMN "appCode"`);
        await queryRunner.query(`ALTER TABLE "home" ADD "appCode" character varying(50)`);
        await queryRunner.query(`ALTER TABLE "home_statistical" DROP COLUMN "appCode"`);
        await queryRunner.query(`ALTER TABLE "home_statistical" ADD "appCode" character varying(50)`);
        await queryRunner.query(`ALTER TABLE "invitation" DROP COLUMN "appCode"`);
        await queryRunner.query(`ALTER TABLE "invitation" ADD "appCode" character varying(50)`);
        await queryRunner.query(`ALTER TABLE "member" DROP COLUMN "appCode"`);
        await queryRunner.query(`ALTER TABLE "member" ADD "appCode" character varying(50)`);
        await queryRunner.query(`ALTER TABLE "verify" DROP COLUMN "appCode"`);
        await queryRunner.query(`ALTER TABLE "verify" ADD "appCode" character varying(50)`);
        await queryRunner.query(`ALTER TABLE "version" DROP CONSTRAINT "PK_77eefff13013d1e47656d420815"`);
        await queryRunner.query(`ALTER TABLE "version" ADD CONSTRAINT "PK_4fb5fbb15a43da9f35493107b1d" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "version" DROP COLUMN "appCode"`);
        await queryRunner.query(`ALTER TABLE "version" ADD "appCode" character varying(50)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "version" DROP COLUMN "appCode"`);
        await queryRunner.query(`ALTER TABLE "version" ADD "appCode" character varying(256) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "version" DROP CONSTRAINT "PK_4fb5fbb15a43da9f35493107b1d"`);
        await queryRunner.query(`ALTER TABLE "version" ADD CONSTRAINT "PK_77eefff13013d1e47656d420815" PRIMARY KEY ("id", "appCode")`);
        await queryRunner.query(`ALTER TABLE "verify" DROP COLUMN "appCode"`);
        await queryRunner.query(`ALTER TABLE "verify" ADD "appCode" character varying(256)`);
        await queryRunner.query(`ALTER TABLE "member" DROP COLUMN "appCode"`);
        await queryRunner.query(`ALTER TABLE "member" ADD "appCode" character varying(256)`);
        await queryRunner.query(`ALTER TABLE "invitation" DROP COLUMN "appCode"`);
        await queryRunner.query(`ALTER TABLE "invitation" ADD "appCode" character varying(256)`);
        await queryRunner.query(`ALTER TABLE "home_statistical" DROP COLUMN "appCode"`);
        await queryRunner.query(`ALTER TABLE "home_statistical" ADD "appCode" character varying(256)`);
        await queryRunner.query(`ALTER TABLE "home" DROP COLUMN "appCode"`);
        await queryRunner.query(`ALTER TABLE "home" ADD "appCode" character varying(256)`);
        await queryRunner.query(`ALTER TABLE "area_statistical" DROP COLUMN "appCode"`);
        await queryRunner.query(`ALTER TABLE "area_statistical" ADD "appCode" character varying(256)`);
        await queryRunner.query(`ALTER TABLE "area" DROP COLUMN "appCode"`);
        await queryRunner.query(`ALTER TABLE "area" ADD "appCode" character varying(256)`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "appCode"`);
        await queryRunner.query(`ALTER TABLE "entity" DROP COLUMN "appCode"`);
        await queryRunner.query(`ALTER TABLE "automation" DROP COLUMN "appCode"`);
        // await queryRunner.query(`ALTER TABLE "automation" ADD "output" jsonb NOT NULL DEFAULT '{}'`);
        // await queryRunner.query(`ALTER TABLE "automation" ADD "input" jsonb NOT NULL DEFAULT '{}'`);
        await queryRunner.query(`ALTER TABLE "automation" ADD "appName" character varying(256)`);
        await queryRunner.query(`ALTER TABLE "version" RENAME CONSTRAINT "PK_77eefff13013d1e47656d420815" TO "PK_ba07c9f6d7f3b8e965e5abd805f"`);
        await queryRunner.query(`ALTER TABLE "version" RENAME COLUMN "appCode" TO "appName"`);
        await queryRunner.query(`ALTER TABLE "verify" RENAME COLUMN "appCode" TO "appName"`);
        await queryRunner.query(`ALTER TABLE "member" RENAME COLUMN "appCode" TO "appName"`);
        await queryRunner.query(`ALTER TABLE "invitation" RENAME COLUMN "appCode" TO "appName"`);
        await queryRunner.query(`ALTER TABLE "home_statistical" RENAME COLUMN "appCode" TO "appName"`);
        await queryRunner.query(`ALTER TABLE "home" RENAME COLUMN "appCode" TO "appName"`);
        await queryRunner.query(`ALTER TABLE "area_statistical" RENAME COLUMN "appCode" TO "appName"`);
        await queryRunner.query(`ALTER TABLE "area" RENAME COLUMN "appCode" TO "appName"`);
    }

}
