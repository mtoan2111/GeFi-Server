import { Entity, PrimaryColumn, Column } from 'typeorm';
import { Audit } from './Audit.model';

@Entity()
export class Invitation extends Audit {
    @PrimaryColumn({ type: 'character varying', length: 128 })
    id: string = '';

    @Column({ type: 'character varying', length: 256 })
    ownerId: string = '';

    @Column({ type: 'character varying', length: 256 })
    homeId: string = '';

    @Column({ type: 'character varying', length: 256, nullable: true })
    memberId: string = '';

    @Column({ type: 'character varying', length: 256 })
    memberEmail: string = '';

    @Column({ type: 'character varying', length: 512, nullable: true })
    note: string = '';

    @Column({ type: 'integer', nullable: true })
    state: number = -1;

    @Column({ type: 'boolean', nullable: true })
    isRead: boolean = false;

    @Column({ type: 'character varying', length: 50, nullable: true })
    appCode: string = '';
}
