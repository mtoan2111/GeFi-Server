export interface PolicyPayload {
    action: string;
    resource: string;
    service: string;
    email?: string;
    userId?: string;
    jwt: string | undefined | null;
    appCode: string;
}

interface IPolicy {
    assign: (payload: PolicyPayload) => Promise<boolean>;
    unassign: (payload: PolicyPayload) => Promise<boolean>;
}

export default IPolicy;
