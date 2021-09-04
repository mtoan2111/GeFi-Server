import {MigrationInterface, QueryRunner} from "typeorm";

export class serviceHome1622130800203 implements MigrationInterface {
    name = 'serviceHome1622130800203'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "automation" ADD "raw" jsonb NOT NULL DEFAULT '{}'`);
        await queryRunner.query(`COMMENT ON COLUMN "automation"."inputIds" IS NULL`);
        await queryRunner.query(`ALTER TABLE "automation" ALTER COLUMN "inputIds" SET DEFAULT '{}'`);
        await queryRunner.query(`COMMENT ON COLUMN "automation"."outputIds" IS NULL`);
        await queryRunner.query(`ALTER TABLE "automation" ALTER COLUMN "outputIds" SET DEFAULT '{}'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "automation" ALTER COLUMN "outputIds" DROP DEFAULT`);
        await queryRunner.query(`COMMENT ON COLUMN "automation"."outputIds" IS NULL`);
        await queryRunner.query(`ALTER TABLE "automation" ALTER COLUMN "inputIds" DROP DEFAULT`);
        await queryRunner.query(`COMMENT ON COLUMN "automation"."inputIds" IS NULL`);
        await queryRunner.query(`ALTER TABLE "automation" DROP COLUMN "raw"`);
    }

}
