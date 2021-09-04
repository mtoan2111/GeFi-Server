import { TDeviceType } from './Type.model';

export type TDeviceModel = {
    id: string | undefined;
    createdAt: string | undefined;
    updatedAt: string | undefined;
    isDeleted: boolean | undefined;
    isActive: boolean | undefined;
    name: string | undefined;
    modelCode: string | undefined;
    vendorCode: string | undefined;
    deviceTypeId: string | undefined;
    deviceType?: TDeviceType | undefined;
};
