import { MigrationInterface, QueryRunner } from 'typeorm';

export class homeService1620025124332 implements MigrationInterface {
    name = 'homeService1620025124332';

    public async up(queryRunner: QueryRunner): Promise<void> {
        // await queryRunner.query(`ALTER TABLE "invitation" ADD "memberEmail" character varying(256) NOT NULL`);
        // await queryRunner.query(`ALTER TABLE "invitation" ALTER COLUMN "memberId" DROP NOT NULL`);
        // await queryRunner.query(`COMMENT ON COLUMN "invitation"."memberId" IS NULL`);
        await queryRunner.query(`DROP TABLE "invitation"`);
        await queryRunner.query(`CREATE TABLE "invitation" (
            "createdAt" timestamp without time zone,
            "createdBy" character varying(128),
            "updatedAt" timestamp without time zone,
            "updatedBy" character varying(128),
            id character varying(128) NOT NULL,
            "ownerId" character varying(256) NOT NULL,
            "homeId" character varying(256) NOT NULL,
            "memberId" character varying(256),
            "memberEmail" character varying(256) NOT NULL,
            note character varying(512),
            state integer,
            "isRead" boolean,
            CONSTRAINT "PK_beb994737756c0f18a1c1f8669c" PRIMARY KEY (id)
        )`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`COMMENT ON COLUMN "invitation"."memberId" IS NULL`);
        await queryRunner.query(`ALTER TABLE "invitation" ALTER COLUMN "memberId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "invitation" DROP COLUMN "memberEmail"`);
    }
}
