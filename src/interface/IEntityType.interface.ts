import { EDeviceStatus } from '../model/v1/device/Device.model';

export type TEntityTypeFirmwareInfo = {
    modelCode: string | undefined;
    vendorCode: string | undefined;
    version: string | undefined;
    url: string | undefined;
    sha256?: string | undefined;
    region?: string | undefined;
};

export type TEntityType = {
    mac?: string | undefined;
    typeId: string | undefined;
    typeCode: string | undefined;
    typeName: string | undefined;
    typeLogo?: string | undefined;
    familyId: string | undefined;
    familyName: string | undefined;
    connectionId: string | undefined;
    connectionName: string | undefined;
    catId: string | undefined;
    catName: string | undefined;
    vendorId: string | undefined;
    vendorName?: string | undefined;
    status?: EDeviceStatus;
};

export type TEntityCategory = {
    catId: string | undefined;
    catName: string | undefined;
    catLogo?: string | undefined | null | null;
    types: TEntityType[];
};

export type TEntityLastFirmware = {
    modelCode?: string | undefined;
    vendorCode?: string | undefined;
    firmwareVersion?: string | undefined;
    hardwareVersion?: string | undefined;
    url?: string | undefined;
    sha256?: string | undefined;
    region?: string | undefined;
    version?: string | undefined;
};

interface IEntityType {
    get: (app: string) => Promise<TEntityCategory[]>;
    verify: (app: string, typeCode: string, jwt: string | undefined | null) => Promise<boolean>;
    info: (typeCode: string, jwt: string | undefined | null) => Promise<TEntityType | undefined>;
    verifyAppCode: (appCode: string) => Promise<boolean>;
    getFirmware: (payload: TEntityLastFirmware, jwt: string | undefined | null) => Promise<TEntityTypeFirmwareInfo | undefined>;
}

export default IEntityType;
