import { MigrationInterface, QueryRunner } from 'typeorm';

export class homeService1620362430500 implements MigrationInterface {
    name = 'homeService1620362430500';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "member"`);
        await queryRunner.query(`CREATE TABLE public.member
        (
            "createdAt" timestamp without time zone,
            "createdBy" character varying(128),
            "updatedAt" timestamp without time zone,
            "updatedBy" character varying(128),
            email character varying(256),
            "homeId" character varying(128) NOT NULL,
            id character varying(128),
            name character varying(256) NOT NULL,
            "isOwner" boolean,
            state boolean,
            CONSTRAINT "PK_9ed4edc7663e90a838474301ce6" PRIMARY KEY ("homeId", "email")
        )`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "member" DROP CONSTRAINT "PK_9ed4edc7663e90a838474301ce6"`);
        await queryRunner.query(`ALTER TABLE "member" ADD CONSTRAINT "PK_da8eddfbb0fe7389e2c1eafe710" PRIMARY KEY ("id", "homeId", "email")`);
        await queryRunner.query(`COMMENT ON COLUMN "member"."id" IS NULL`);
        await queryRunner.query(`ALTER TABLE "member" ALTER COLUMN "id" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "member" DROP CONSTRAINT "PK_da8eddfbb0fe7389e2c1eafe710"`);
        await queryRunner.query(`ALTER TABLE "member" ADD CONSTRAINT "PK_7bd3c4172c33d4c2e047a871af2" PRIMARY KEY ("id", "homeId")`);
        await queryRunner.query(`COMMENT ON COLUMN "member"."email" IS NULL`);
        await queryRunner.query(`ALTER TABLE "member" ALTER COLUMN "email" DROP NOT NULL`);
    }
}
