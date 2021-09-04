import { TDeviceCategory } from './Category.model';
import { TDeviceConnection } from './Connection.model';
import { TDeviceFamily } from './Family.model';

export type TDeviceType = {
    id: string | undefined;
    createdAt: string | undefined;
    updatedAt: string | undefined;
    isDeleted: boolean | undefined;
    isActive: boolean | undefined;
    name: string | undefined;
    deviceFamilyId: string | undefined;
    deviceCategoryId: string | undefined;
    deviceConnectionId: string | undefined;
    state: any | null | undefined;
    deviceTypeCode: string | undefined;
    type: string | undefined;
    logo?: string | undefined;
    vendorCode: any | null | undefined;
    deviceCategory?: TDeviceCategory | undefined;
    deviceConnection?: TDeviceConnection | undefined;
    deviceFamily?: TDeviceFamily | undefined;
};
