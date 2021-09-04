export enum EDeviceStateResponseController {
    DEVICE = 'device',
    AUTOMATION = 'rule',
}

export enum EDeviceStateResponseAction {
    GET = 'get',
    UPDATE = 'update',
    CREATE = 'create',
    DELETE = 'delete',
    SCAN = 'scan',
    STOP = 'stop',
    STATES = 'states',
    STATE = 'state',
}

type HSV = {
    h: number | undefined;
    s: number | undefined;
    v: number | undefined | null;
};

enum EAIRCONDITIONALFanSpeed {
    LOW = 'L',
    MED = 'H',
    HIGH = 'HH',
}

enum EAIRCONDITIONALMODE {
    FAN = 'fan',
    HOT = 'hot',
    COOL = 'cool',
    DRY = 'dry',
}

export type TDeviceStateResponseDataState = {
    onoff?: boolean | undefined;
    battery?: number | undefined;
    dim?: number | undefined;
    colortem?: number | undefined;
    door?: number | undefined;
    motion?: number | undefined;
    humidity?: number | undefined;
    temp?: number | undefined;
    occupancy?: boolean | undefined;
    light?: number | undefined;
    contact?: number | undefined;
    shutter?: number | undefined;
    hsv?: HSV | undefined;
    fan: EAIRCONDITIONALFanSpeed | undefined;
    timerOn: number | undefined;
    timerOff: number | undefined;
    mode: EAIRCONDITIONALMODE | undefined;
};

export type TDeviceStateResponseData = {
    id: string | undefined;
    state?: TDeviceStateResponseDataState;
};

type TDeviceStateResponse = {
    device_id: string | undefined;
    actor: EDeviceStateResponseController;
    action: EDeviceStateResponseAction;
    state: TDeviceStateResponseDataState;
};

type TDeviceStateAudit = {
    id: string | undefined;
    createdAt: number | undefined;
};

export type TDeviceState = {
    token: string | undefined | null;
    uid: string | undefined | null;
    audit: TDeviceStateAudit;
    response: TDeviceStateResponse;
};
