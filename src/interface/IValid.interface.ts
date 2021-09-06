export enum EValidationController {
    MATCH = 'match',
}

export enum EValidationMethod {
    GET = 'get',
    CREATE = 'create',
    UPDATE = 'update',
    DELETE = 'delete',
    JOIN = 'join',
    PLAY = 'play',
    SHARE = 'share',
    UNSHARE = 'unshare',
    FORGOTPASSWORD = 'forgotPassword',
    VERIFYEMAIL = 'verifyEmail',
    UPDATEPASSWORD = 'updatePassword',
    NEWPASSWORD = 'newPassword',
    GETUPDATEINFO = 'updateInfo',
}

export type TValidationReponse = {
    isValid: boolean;
    reason: string;
};

export type TValidationHanlder = {
    param: any;
    method: EValidationMethod;
    controller: EValidationController;
};

interface IValidation {
    valid: (option: TValidationHanlder) => TValidationReponse;
}

export default IValidation;
