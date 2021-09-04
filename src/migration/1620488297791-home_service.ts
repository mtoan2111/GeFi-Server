import {MigrationInterface, QueryRunner} from "typeorm";

export class homeService1620488297791 implements MigrationInterface {
    name = 'homeService1620488297791'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "member" ALTER COLUMN "name" DROP NOT NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "member"."name" IS NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`COMMENT ON COLUMN "member"."name" IS NULL`);
        await queryRunner.query(`ALTER TABLE "member" ALTER COLUMN "name" SET NOT NULL`);
    }

}
