export interface TAccount {
    email: string | undefined | null;
    password?: string | undefined | null;
    token?: string | undefined | null;
    appCode: string | undefined | null;
}

interface IAuth {
    signUp: (options: TAccount) => Promise<any>;
    forgotPassword: (option: TAccount) => Promise<any>;
    verifyAccount: (option: TAccount) => Promise<any>;
    newPassword: (option: TAccount) => Promise<any>;
    updatePassword: (oldPassword: string, newPassword: string, jwt: string | undefined | null) => Promise<any>;
    auth: (token: string) => Promise<void>;
}

export default IAuth;
