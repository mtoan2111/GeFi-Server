export type TAutomationTriggerConfiguration = {
    start: string | undefined | null;
    end?: string | undefined | null;
};

export type TAutomationTrigger = {
    type: string | undefined | null;
    configuration: TAutomationTriggerConfiguration;
};

export type TAutomation = {
    id?: string | undefined | null;
    name?: string | undefined | null;
    homeId?: string | undefined | null;
    spaceId?: string | undefined | null;
    HCId?: string | undefined | null;
    processedAt?: string | undefined | null;
    logo?: string | undefined | null;
    type: string | undefined | null;
    logic: string | undefined | null;
    active: boolean | undefined;
    trigger?: TAutomationTrigger | undefined;
    input: any[] | undefined;
    output: any[] | undefined;
};

interface IAutomation {
    create: (option: TAutomation) => Promise<any>;
    update: (option: TAutomation) => Promise<any>;
    delete: (id: string) => Promise<any>;
    deleteDevice: (deviceId: string) => Promise<any>;
}

export default IAutomation;
