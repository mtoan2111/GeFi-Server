import { Entity, PrimaryColumn, Column } from 'typeorm';
import { Audit } from './Audit.model';

@Entity()
export class Member extends Audit {
    @PrimaryColumn({ type: 'character varying', length: 256 })
    email: string = '';

    @PrimaryColumn({ type: 'character varying', length: 128 })
    homeId: string = '';

    @Column({ type: 'character varying', length: 128, nullable: true })
    id: string = '';

    @Column({ type: 'character varying', length: 256, nullable: true })
    name: string = '';

    @Column({ type: 'boolean', nullable: true })
    isOwner: boolean = true;

    @Column({ type: 'boolean', nullable: true })
    state: boolean = true;

    @Column({ type: 'character varying', length: 50, nullable: true })
    appCode: string = '';
}
