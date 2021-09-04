import IPolicy, { PolicyPayload } from '../interface/IPolicy.interface';
import ILogger from '../interface/ILogger.interface';
import { inject, injectable } from 'inversify';
import axios from 'axios';
const https = require('https');

@injectable()
class Policy implements IPolicy {
    private logger: ILogger;
    private agent: any;

    constructor(@inject('Logger') logger: ILogger) {
        this.logger = logger;
        this.agent = new https.Agent({
            rejectUnauthorized: false,
        });
    }

    assign = async (payload: PolicyPayload): Promise<boolean> => {
        try {
            const { action, resource, service, email, jwt, appCode } = payload;
            let baseUri: string | undefined | null = 'http://qa-api.mht.vn/auth/';
            typeof process.env.AUTH_URL !== 'undefined' && (baseUri = process.env.AUTH_URL);
            const policyUri = `${baseUri}v1/policy/user/assign`;

            this.logger.Info({ path: 'Policy.helper.ts', resource: 'assign:policyUri', mess: policyUri });

            const headers = {
                'Content-Type': 'application/json',
                Authorization: jwt,
            };

            const body = {
                action,
                resource,
                service,
                email,
                appCode,
            };

            this.logger.Info({ path: 'Policy.helper.ts', resource: 'assign:request:body', mess: JSON.stringify(body) });

            return await axios
                .post(policyUri, body, {
                    headers,
                    httpsAgent: this.agent,
                })
                .then((response) => {
                    if (response.status === 200) {
                        return response.data;
                    }
                })
                .then((data) => {
                    this.logger.Info({ path: 'Policy.helper.ts', resource: 'assign:request:data', mess: JSON.stringify(data) });
                    return true;
                })
                .catch((err) => {
                    this.logger.Error({ path: 'Policy.helper.ts', resource: 'assign:request:catch', mess: JSON.stringify(err?.response?.data) });
                    return Promise.resolve(false);
                });
        } catch (err) {
            this.logger.Error({ path: 'Policy.helper.ts', resource: 'assign:catch', mess: err });
            return Promise.resolve(false);
        }
    };

    unassign = async (payload: PolicyPayload): Promise<boolean> => {
        try {
            const { action, resource, service, userId, jwt } = payload;
            let baseUri: string | undefined | null = 'http://dev-api.mht.vn/auth/';
            typeof process.env.AUTH_URL !== 'undefined' && (baseUri = process.env.AUTH_URL);
            const policyUri = `${baseUri}v1/policy/resource/unassign`;
            this.logger.Info({ path: 'Policy.helper.ts', resource: 'unassign:policyUri', mess: policyUri });

            const headers = {
                'Content-Type': 'application/json',
                Authorization: jwt,
            };

            const body = {
                action,
                resource,
                service,
                userId,
            };

            this.logger.Info({ path: 'Policy.helper.ts', resource: 'unassign:request:body', mess: JSON.stringify(body) });

            return await axios
                .post(policyUri, body, { headers, httpsAgent: this.agent, timeout: 5000 })
                .then((response) => {
                    if (response.status === 200) {
                        return response.data;
                    }
                })
                .then((data) => {
                    this.logger.Info({ path: 'Policy.helper.ts', resource: 'unassign:request:data', mess: JSON.stringify(data) });
                    return true;
                })
                .catch((err) => {
                    this.logger.Error({ path: 'Policy.helper.ts', resource: 'unassign:request:catch', mess: JSON.stringify(err?.response?.data) });
                    return false;
                });
        } catch (err) {
            this.logger.Error({ path: 'Policy.helper.ts', resource: 'unassign:catch', mess: err });
            return Promise.resolve(false);
        }
    };
}
export default Policy;
