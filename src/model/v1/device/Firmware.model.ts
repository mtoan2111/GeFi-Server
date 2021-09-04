import { TDeviceModel } from './Model.model';

type TDeviceFirmwareInfo = {
    sha256sum: string | undefined;
};

export type TDeviceTypeFirmware = {
    id: string | undefined;
    createdAt: string | undefined;
    updatedAt: string | undefined;
    isDeleted: boolean | undefined;
    isActive: boolean | undefined;
    deviceTypeId: string | undefined;
    version: number[];
    vendorCode: string | undefined;
    condition: boolean | undefined;
    info: TDeviceFirmwareInfo | undefined;
    url: string | undefined;
    model: TDeviceModel;
    region: string | undefined;
    hardwareToFirmwares: any[];
};

export type TDeviceTypeLastFirmware = {
    url: string | undefined;
    version: string | undefined;
    region?: string | undefined;
    sha256?: string | undefined;
};
