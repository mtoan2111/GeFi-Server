export type TDeviceConnection = {
    id: string | undefined;
    createdAt: string | undefined;
    updatedAt: string | undefined;
    isDeleted: boolean | undefined;
    isActive: boolean | undefined;
    name: string | undefined;
    logo: string | undefined | null | null;
    note: string | undefined | null | null;
    deviceConnectionCode: string | undefined | null | null;
    type: string | undefined | null | null;
    vendorCode: string | undefined | null | null;
};
