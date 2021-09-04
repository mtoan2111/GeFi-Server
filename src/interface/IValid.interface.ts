import { Request, Response } from 'express';

export enum EValidationController {
    USER = 'user',
    HOME = 'home',
    AREA = 'area',
    ENTITY = 'entity',
    ENTITYTYPE = 'entityType',
    INVITATION = 'invitation',
    MEMBER = 'member',
    VERSION = 'version',
    AUTOMATION = 'automation',
}

export enum EValidationMethod {
    GET = 'get',
    CREATE = 'create',
    UPDATE = 'update',
    DELETE = 'delete',
    SHARE = 'share',
    UNSHARE = 'unshare',
    FORGOTPASSWORD = 'forgotPassword',
    VERIFYEMAIL = 'verifyEmail',
    UPDATEPASSWORD = 'updatePassword',
    NEWPASSWORD = 'newPassword',
    GETUPDATEINFO = 'updateInfo',
}

export interface TValidationHanlder {
    method: EValidationMethod;
    controller: EValidationController;
}

export interface TValidation {
    request: Request;
    response: Response;
    next: Function;
    valid: TValidationHanlder;
}

interface IValidation {
    valid: (option: TValidation) => void;
}

export default IValidation;
