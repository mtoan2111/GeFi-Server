import { TDeviceType } from './Type.model';

export type TDeviceTypes = {
    id: string | undefined;
    createdAt: string | undefined;
    updatedAt: string | undefined;
    isDeleted: boolean | undefined;
    isActive: boolean | undefined;
    appId: string | undefined;
    deviceTypeId: string | undefined;
    scope: string | undefined;
    deviceType: TDeviceType;
};

export type TDeviceApp = {
    id: string | undefined;
    createdAt: string | undefined;
    updatedAt: string | undefined;
    isDeleted: boolean | undefined;
    isActive: boolean | undefined;
    name: string | undefined;
    appCode: string | undefined;
    vendorCode: string | undefined;
    deviceTypes: TDeviceTypes[];
};
