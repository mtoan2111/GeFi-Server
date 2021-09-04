import { TEntityType } from './IEntityType.interface';
import { TDeviceStateResponseDataState } from '../model/v1/etcd/State.model';

export type TEntityFirmwareInfo = {
    id: string | undefined;
    model: string | undefined;
    modeCode?: string | undefined;
    hwVersion: string | undefined;
    fmVersion: string | undefined;
};

export type TEntityState = {
    updated?: number | undefined;
    state: TDeviceStateResponseDataState | undefined;
};

export interface IEntity {
    register: (id: string, token: string, jwt: string | undefined | null) => Promise<boolean>;
    get: (id: string, jwt: string | undefined | null) => Promise<TEntityType | undefined>;
    state: (id: string) => Promise<TEntityState | undefined>;
    token: (id: string) => Promise<string>;
    info: (id: string, parentId: string, jwt: string | undefined | null) => Promise<TEntityFirmwareInfo | undefined>;
}

export default IEntity;
