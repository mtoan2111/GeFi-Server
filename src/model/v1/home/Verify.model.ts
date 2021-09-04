import { Entity, PrimaryColumn, Column } from 'typeorm';
import { Audit } from './Audit.model';

@Entity()
export class Verify extends Audit {
    @PrimaryColumn({ type: 'character varying', length: 128 })
    id: string = '';

    @Column({ type: 'character varying', length: 256 })
    email: string = '';

    @Column({ type: 'character varying', length: 8 })
    token: string = '';

    @Column({ type: 'character varying', length: 16 })
    flag: string = '';

    @Column({ type: 'character varying', length: 16 })
    step: string = '';

    @Column({ type: 'character varying', length: 50, nullable: true })
    appCode: string = '';
}
