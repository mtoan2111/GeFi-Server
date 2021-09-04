import { Entity, PrimaryColumn, Column } from 'typeorm';
import { Audit } from './Audit.model';

@Entity({
    name: 'entity',
})
export class Device extends Audit {
    @PrimaryColumn({ type: 'character varying', length: 128 })
    id: string = '';

    @PrimaryColumn({ type: 'character varying', length: 256 })
    homeId: string = '';

    @PrimaryColumn({ type: 'character varying', length: 128 })
    userId: string = '';

    // @Column({ type: 'integer', nullable: true })
    // childrenCount: number = 0;

    @Column({ type: 'character varying', length: 128, nullable: true })
    areaId: string | null = '';

    @Column({ type: 'character varying', length: 256 })
    name: string = '';

    @Column({ type: 'character varying', length: 512, nullable: true })
    logo: string = '';

    @Column({ type: 'integer', nullable: true })
    position: number = 0;

    @Column({ type: 'character varying', length: 128, nullable: true })
    parentId: string = '';

    @Column({ type: 'character varying', length: 64, nullable: true })
    mac: string = '';

    @Column({ type: 'character varying', length: 128 })
    typeId: string = '';

    @Column({ type: 'character varying', length: 128, nullable: true })
    typeCode: string = '';

    @Column({ type: 'character varying', length: 256, nullable: true })
    typeName: string = '';

    @Column({ type: 'character varying', length: 128 })
    categoryId: string = '';

    @Column({ type: 'character varying', length: 256, nullable: true })
    categoryName: string = '';

    @Column({ type: 'character varying', length: 128 })
    connectionId: string = '';

    @Column({ type: 'character varying', length: 257, nullable: true })
    connectionName: string = '';

    @Column({ type: 'character varying', length: 128 })
    familyId: string = '';

    @Column({ type: 'character varying', length: 256, nullable: true })
    familyName: string = '';

    @Column({ type: 'character varying', length: 256, nullable: true })
    appName: string = '';

    @Column({ type: 'character varying', length: 50, nullable: true })
    appCode: string = '';

    @Column({ type: 'character varying', length: 128, nullable: true })
    vendorId: string = '';

    @Column({ type: 'character varying', length: 256, nullable: true })
    vendorName: string = '';

    @Column({ type: 'character varying', length: 1024 })
    extra: string = '';
}
