import { TDeviceType } from './Type.model';

export enum EDeviceStatus {
    TESTING = 'testing',
    WAITING = 'wait',
    ACTIVE = 'active',
    DEACTIVE = 'deactive',
}

export type TDevice = {
    id: string | undefined;
    createdAt: string | undefined;
    updatedAt: string | undefined;
    isDeleted: boolean | undefined;
    isActive: boolean | undefined;
    deviceTypeId: string | undefined;
    name: string | undefined;
    mac: string | undefined;
    status: EDeviceStatus;
    fingerPrint: string | undefined;
    note: string | undefined;
    state: any;
    deviceCode: string | undefined | null | null;
    vendorCode: string | undefined | null | null;
    deviceId: string | undefined;
    deviceType: TDeviceType;
};
