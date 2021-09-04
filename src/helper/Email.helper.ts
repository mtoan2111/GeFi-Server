import IEmail from '../interface/IEmail.interface';
import { EMailTemplate, EMailI18n, EmailRequestBody } from '../model/v1/mail/Mail.model';
import ILogger from '../interface/ILogger.interface';
import { inject, injectable } from 'inversify';
// import sgMail from '@sendgrid/mail';
import axios from 'axios';
const https = require('https');

@injectable()
class Email implements IEmail {
    private logger: ILogger;
    private agent: any;

    constructor(@inject('Logger') logger: ILogger) {
        this.logger = logger;

        this.agent = new https.Agent({
            rejectUnauthorized: false,
        });

        // sgMail.setApiKey(process.env.SENDGRID_API_KEY as string);
        // sgMail.setApiKey('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');
    }

    send = async (email: string, type: EMailTemplate, _token: string, lang: EMailI18n, appCode: string): Promise<void> => {
        try {
            let baseUri: string | undefined | null = 'http://dev-api.mht.vn/mail-pusher/';
            typeof process.env.EMAIL_URL !== 'undefined' && (baseUri = process.env.EMAIL_URL);
            const sendEmailUri = `${baseUri}/v1/mail-pusher/send-mail`;

            this.logger.Info({ path: 'Email.helper.ts', resource: 'send:sendEmailUri', mess: sendEmailUri });

            const body: EmailRequestBody = {
                mailTemplate: type,
                toEmail: email,
                isConsole: false,
                appCode,
                lang,
            };

            this.logger.Info({ path: 'Email.helper.ts', resource: 'send:request:body', mess: JSON.stringify(body) });

            await axios
                .post(sendEmailUri, body, {
                    httpsAgent: this.agent,
                })
                .then((res) => {
                    if (res.status === 200) return res.data;
                })
                .then((data) => {
                    this.logger.Info({ path: 'Email.helper.ts', resource: 'send:request:data', mess: JSON.stringify(data) });
                    // return data;
                })
                .catch((err) => {
                    this.logger.Error({ path: 'Email.helper.ts', resource: 'send:request:catch', mess: err });
                    // return undefined;
                });
            // this.logger.Info({ path: 'Email.helper.ts', resource: 'send:param', mess: { email, type, token } });
            // let payload: string = '';
            // switch (type) {
            //     case 'invitation':
            //         payload = this.invitation(email, email);
            //         break;
            //     case 'token':
            //         payload = this.token(email, token);
            //         break;
            //     default:
            //         return Promise.reject(false);
            // }
            // const msg = {
            //     to: email,
            //     from: process.env.SENDGRID_EMAIL as string,
            //     subject: 'Verify email',
            //     html: payload,
            // };
            // return sgMail
            //     .send(msg)
            //     .then(() => {
            //         return true;
            //     })
            //     .catch((err) => {
            //         this.logger.Error({ path: 'Email.helper.ts', resource: 'send:send:catch', mess: err });
            //         return false;
            //     });
        } catch (err) {
            this.logger.Error({ path: 'Email.helper.ts', resource: 'send:catch', mess: err });
            return Promise.reject(false);
        }
    };

    invitation = (member: string, owner: string): string => {
        try {
            const payload = `
            <div>
                Dear ${member},
            </div>
            <br/>
            <div>
            Welcome to our ecosystem - Phenikaa Life.
            </div>
            <div>
            I am pleased to inform you that you are cordially invited to the home that owner by ${owner}
            </div>
            <div>
            To accept the invitation, please download the application in store
            </div>
            <br/>
            <br/>
            <div>
            Yours sincerely
            </div>
            <div>
            Phenikaa Life
            </div>`;
            return payload;
        } catch {
            return '';
        }
    };

    token = (email: string, token: string): string => {
        try {
            const payload = `
            <div>
                Dear ${email},
            </div>
            <br/>
            <div>
            Thanks for using our ecosystem - Phenikaa Life.
            </div>
            <div>
            I am pleased to inform you that your verify token is <strong>${token}</strong>
            </div>
            <br/>
            <br/>
            <div>
            Yours sincerely
            </div>
            <div>
            Phenikaa Life
            </div>`;
            return payload;
        } catch {
            return '';
        }
    };
}

export default Email;
