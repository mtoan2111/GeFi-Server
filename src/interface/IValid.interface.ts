export enum EValidationController {
    MATCH = 'match',
}

export enum EValidationMethod {
    CREATE = 'create',
    JOIN = 'join',
    START = 'start',
    PLAY = 'play',
    FINISH = 'finish',
    COMPLETE = 'complete',
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
