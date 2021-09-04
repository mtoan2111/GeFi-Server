export type TDeviceFamily = {
    id: string | undefined;
    createdAt: string | undefined;
    updatedAt: string | undefined;
    isDeleted: boolean | undefined;
    isActive: boolean | undefined;
    name: string | undefined;
    deviceFamilyCode: string | undefined;
    type: string | undefined;
    vendorCode: string | undefined | null | null;
    note: string | undefined | null | null;
};
