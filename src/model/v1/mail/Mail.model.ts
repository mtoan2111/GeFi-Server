export enum EMailTemplate {
    CONFIRMATION = 'CONFIRMATION_MAIL',
    FORGOTPASSWORD = 'FORGOT_PASSWORD',
    INVITATION = 'INVITATION',
}

export enum EMailI18n {
    vi = 'vi',
    en = 'en',
}

export type EmailRequestBody = {
    mailTemplate: EMailTemplate;
    toEmail: string;
    cfCode?: string;
    isConsole: boolean;
    appCode: string;
    lang?: EMailI18n;
};
