import { EMailTemplate, EMailI18n } from '../model/v1/mail/Mail.model';

interface IEmail {
    send: (email: string, type: EMailTemplate, token: string, lang: EMailI18n, appCode: string) => Promise<void>;
}

export default IEmail;
