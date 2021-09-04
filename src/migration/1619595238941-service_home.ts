import {MigrationInterface, QueryRunner} from "typeorm";

export class serviceHome1619595238941 implements MigrationInterface {
    name = 'serviceHome1619595238941'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "area" ("createdAt" TIMESTAMP, "createdBy" character varying(128), "updatedAt" TIMESTAMP, "updatedBy" character varying(128), "id" character varying(128) NOT NULL, "userId" character varying(128) NOT NULL, "homeId" character varying(128) NOT NULL, "name" character varying(256) NOT NULL, "position" integer, "logo" character varying(128), CONSTRAINT "PK_0471bef7289709ba12080ae2923" PRIMARY KEY ("id", "userId", "homeId"))`);
        await queryRunner.query(`CREATE TABLE "area_statistical" ("createdAt" TIMESTAMP, "createdBy" character varying(128), "updatedAt" TIMESTAMP, "updatedBy" character varying(128), "id" character varying(128) NOT NULL, "homeId" character varying(128) NOT NULL, "userId" character varying(128) NOT NULL, "centities" integer, CONSTRAINT "PK_b15cc5851aba7619e58534f082a" PRIMARY KEY ("id", "homeId", "userId"))`);
        await queryRunner.query(`CREATE TABLE "Entity" ("createdAt" TIMESTAMP, "createdBy" character varying(128), "updatedAt" TIMESTAMP, "updatedBy" character varying(128), "id" character varying(128) NOT NULL, "homeId" character varying(256) NOT NULL, "userId" character varying(128) NOT NULL, "areaId" character varying(256) NOT NULL, "name" character varying(256) NOT NULL, "logo" character varying(512), "parent" character varying(128), "mac" character varying(64) NOT NULL, "fig" character varying(128) NOT NULL, "typeId" character varying(128) NOT NULL, "categoryId" character varying(128) NOT NULL, "connection" character varying(128) NOT NULL, "extra" character varying(1024) NOT NULL, CONSTRAINT "PK_2488ebc93f835d6165222f68547" PRIMARY KEY ("id", "homeId", "userId"))`);
        await queryRunner.query(`CREATE TABLE "home" ("createdAt" TIMESTAMP, "createdBy" character varying(128), "updatedAt" TIMESTAMP, "updatedBy" character varying(128), "id" character varying(128) NOT NULL, "userId" character varying(128) NOT NULL, "name" character varying(256) NOT NULL, "pos" character varying(64), "logo" character varying(128), "isOwner" boolean, CONSTRAINT "PK_437820d1a87c087647efc43f5ce" PRIMARY KEY ("id", "userId"))`);
        await queryRunner.query(`CREATE TABLE "home_statistical" ("createdAt" TIMESTAMP, "createdBy" character varying(128), "updatedAt" TIMESTAMP, "updatedBy" character varying(128), "homeId" character varying(128) NOT NULL, "userId" character varying(128) NOT NULL, "careas" integer, "centities" integer, CONSTRAINT "PK_dc2703c3867ecde268b6e4bc8b1" PRIMARY KEY ("homeId", "userId"))`);
        await queryRunner.query(`CREATE TABLE "invitation" ("createdAt" TIMESTAMP, "createdBy" character varying(128), "updatedAt" TIMESTAMP, "updatedBy" character varying(128), "id" character varying(128) NOT NULL, "ownerId" character varying(256) NOT NULL, "homeId" character varying(256) NOT NULL, "memberId" character varying(256) NOT NULL, "note" character varying(512), "state" integer, "isRead" boolean, CONSTRAINT "PK_beb994737756c0f18a1c1f8669c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "member" ("createdAt" TIMESTAMP, "createdBy" character varying(128), "updatedAt" TIMESTAMP, "updatedBy" character varying(128), "id" character varying(128) NOT NULL, "homeId" character varying(128) NOT NULL, "name" character varying(256) NOT NULL, "email" character varying(256), "isOwner" boolean, CONSTRAINT "PK_7bd3c4172c33d4c2e047a871af2" PRIMARY KEY ("id", "homeId"))`);
        await queryRunner.query(`CREATE TABLE "user" ("createdAt" TIMESTAMP, "createdBy" character varying(128), "updatedAt" TIMESTAMP, "updatedBy" character varying(128), "id" character varying(128) NOT NULL, "name" character varying(256) NOT NULL, "phone" character varying(32), "email" character varying(256), "address" character varying(512), "birthday" TIMESTAMP, "fcm" character varying(512), "avatar" character varying(512), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "member"`);
        await queryRunner.query(`DROP TABLE "invitation"`);
        await queryRunner.query(`DROP TABLE "home_statistical"`);
        await queryRunner.query(`DROP TABLE "home"`);
        await queryRunner.query(`DROP TABLE "Entity"`);
        await queryRunner.query(`DROP TABLE "area_statistical"`);
        await queryRunner.query(`DROP TABLE "area"`);
    }

}
