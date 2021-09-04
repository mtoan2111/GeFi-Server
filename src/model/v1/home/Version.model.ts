import { Entity, PrimaryColumn, Column } from 'typeorm';
import { Audit } from './Audit.model';

@Entity()
export class Version extends Audit {
    @PrimaryColumn({ type: 'character varying', length: 128 })
    id: string = '';

    @Column({ type: 'character varying', length: 50, nullable: true })
    appCode: string = '';

    @Column({ type: 'character varying', length: 32 })
    version: string = '';
}
