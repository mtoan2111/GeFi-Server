enum EDeviceInformationResponseState {
    ACTIVE = 'active',
    DEACTIVE = 'deactive',
    UPGRADE = 'upgrade',
}

enum EDeviceInformationResponseUpgradeState {
    OTA_START_SUCCESS,
    OTA_START_FAILURE,
    OTA_START_DOWNLOAD,
    OTA_DOWNLOADING,
    OTA_DOWNLOAD_FAILURE,
    OTA_DOWNLOAD_SUCCESS,
    OTA_VERIFY_FAILURE,
    OTA_REBOOTING,
}

type TDeviceInformationReponseVersion = {
    firmware: string | undefined;
    hardware: string | undefined;
};

type TDeviceInformationResponseOwner = {
    userId: string | undefined;
    homeId: string | undefined;
};

type TDeviceInformationResponseModel = {
    model?: string | undefined;
    model_name?: string | undefined;
    model_code?: string | undefined;
    vendor?: string | undefined;
    region?: string | undefined;
};

type TDeviceInformationResponseUpgrade = {
    download: number | undefined;
    state: EDeviceInformationResponseUpgradeState;
};

type TDeviceInfomationResponse = {
    state: EDeviceInformationResponseState;
    version: TDeviceInformationReponseVersion;
    model: TDeviceInformationResponseModel;
    owner?: TDeviceInformationResponseOwner;
    upgrade?: TDeviceInformationResponseUpgrade;
};

type TDeviceInformationAudit = {
    createdAt: number | undefined;
};

export type TDeviceInfomation = {
    uid?: string | undefined;
    token?: string | undefined;
    audit?: TDeviceInformationAudit;
    response: TDeviceInfomationResponse;
};
