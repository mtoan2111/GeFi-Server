import IAutomation, { TAutomation } from '../interface/IAutomation.interface';
import ILogger from '../interface/ILogger.interface';
// import { ErrorCode } from '../response/Error.response';
import axios from 'axios';
import { inject, injectable } from 'inversify';
const https = require('https');

@injectable()
class Automation implements IAutomation {
    private logger: ILogger;
    private agent: any;
    constructor(@inject('Logger') logger: ILogger) {
        this.logger = logger;
        this.agent = new https.Agent({
            rejectUnauthorized: false,
        });
    }

    create = async (option: TAutomation): Promise<any> => {
        try {
            let baseUri: string | undefined | null = 'https://dev-api.mht.vn/rule';
            typeof process.env.AUTOMATION_URL !== 'undefined' && (baseUri = process.env.AUTOMATION_URL);
            const createAutomationUri = `${baseUri}/v1/rule/`;
            this.logger.Info({ path: 'Automation.helper.ts', resource: 'createAutomation:createAutomationUri', mess: createAutomationUri });
            const { name, homeId, HCId, processedAt, logo, type, logic, active, trigger, input, output } = option;

            let body: TAutomation = {
                name,
                spaceId: homeId,
                HCId,
                processedAt,
                logo,
                type,
                logic,
                active,
                // trigger,
                input,
                output,
            };

            body['trigger'] = {
                type: trigger?.type,
                configuration: {
                    start: trigger?.configuration.start,
                },
            };

            if (body?.HCId === '' || body?.HCId === null) {
                delete body['HCId'];
            }

            if (typeof trigger?.configuration.end === 'undefined') {
                body.trigger.configuration.end = body.trigger.configuration.start;
            }

            this.logger.Info({ path: 'Automation.helper.ts', resource: 'createAutomation:request:body', mess: JSON.stringify(body) });

            return await axios
                .post(createAutomationUri, body, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    httpsAgent: this.agent,
                })
                .then((response) => {
                    if (response.status === 200) {
                        return response.data;
                    }
                })
                .then((data) => {
                    this.logger.Info({ path: 'Automation.helper.ts', resource: 'createAutomation:request:data', mess: JSON.stringify(data) });
                    if (data) {
                        return data?.id;
                    }
                })
                .catch((err) => {
                    this.logger.Error({ path: 'Automation.helper.ts', resource: 'createAutomation:request:catch', mess: JSON.stringify(err) });
                    return Promise.resolve();
                });
        } catch (error) {
            this.logger.Error({ path: 'Automation.helper.ts', resource: 'createAutomation:catch', mess: error });
            return Promise.resolve();
        }
    };
    update = async (option: TAutomation): Promise<any> => {
        try {
            const { id, name, homeId, HCId, processedAt, logo, type, logic, active, trigger, input, output } = option;
            let baseUri: string | undefined | null = 'https://dev-api.mht.vn/rule';
            typeof process.env.AUTOMATION_URL !== 'undefined' && (baseUri = process.env.AUTOMATION_URL);
            const updateAutomationUri = `${baseUri}/v1/rule/${id}`;
            this.logger.Info({ path: 'Automation.helper.ts', resource: 'updateAutomation:updateAutomationUri', mess: updateAutomationUri });

            let body: TAutomation = {
                name,
                spaceId: homeId,
                HCId,
                processedAt,
                logo,
                type,
                logic,
                active,
                // trigger,
                input,
                output,
            };

            body['trigger'] = {
                type: trigger?.type,
                configuration: {
                    start: trigger?.configuration.start,
                },
            };

            if (body?.HCId === '' || body?.HCId === null) {
                delete body['HCId'];
            }

            if (typeof trigger?.configuration.end === 'undefined') {
                body.trigger.configuration.end = body.trigger.configuration.start;
            }

            this.logger.Info({ path: 'Automation.helper.ts', resource: 'updateAutomation:request:body', mess: JSON.stringify(body) });
            return await axios
                .put(updateAutomationUri, body, {
                    httpsAgent: this.agent,
                })
                .then((response) => {
                    if (response.status === 200) {
                        return response.data;
                    }
                })
                .then((data) => {
                    this.logger.Info({ path: 'Automation.helper.ts', resource: 'updateAutomation:requst:data', mess: JSON.stringify(data) });
                    return Promise.resolve(true);
                })
                .catch((err) => {
                    this.logger.Error({ path: 'Automation.helper.ts', resource: 'updateAutomation:request:catch', mess: JSON.stringify(err?.response?.data) });
                    return Promise.resolve();
                });
        } catch (error) {
            this.logger.Error({ path: 'Automation.helper.ts', resource: 'updateAutomation:catch', mess: error });
            return Promise.resolve();
        }
    };

    delete = async (id: string): Promise<any> => {
        try {
            let baseUri: string | undefined | null = 'https://dev-api.mht.vn/rule';
            typeof process.env.AUTOMATION_URL !== 'undefined' && (baseUri = process.env.AUTOMATION_URL);
            const updateAutomationUri = `${baseUri}/v1/rule/${id}`;
            this.logger.Info({ path: 'Automation.helper.ts', resource: 'deleteDevice:updateAutomationUri', mess: updateAutomationUri });

            return await axios
                .delete(updateAutomationUri, {
                    httpsAgent: this.agent,
                })
                .then((response) => {
                    if (response.status === 200) {
                        return response.data;
                    }
                })
                .then((data) => {
                    this.logger.Info({ path: 'Automation.helper.ts', resource: 'deleteDevice:request:data', mess: JSON.stringify(data) });
                    return Promise.resolve(data);
                })
                .catch((err) => {
                    this.logger.Error({ path: 'Automation.helper.ts', resource: 'deleteDevice:request:catch', mess: JSON.stringify(err?.response?.data) });
                    if (err?.response?.status === 404) {
                        return Promise.resolve([]);
                    }
                    return Promise.resolve(undefined);
                });
        } catch (error) {
            this.logger.Error({ path: 'Automation.helper.ts', resource: 'deleteDevice:catch', mess: error });
            return Promise.resolve(undefined);
        }
    };

    deleteDevice = async (id: string): Promise<any> => {
        try {
            let baseUri: string | undefined | null = 'https://dev-api.mht.vn/rule';
            typeof process.env.AUTOMATION_URL !== 'undefined' && (baseUri = process.env.AUTOMATION_URL);
            const updateAutomationUri = `${baseUri}/v1/rule/devices/${id}`;
            this.logger.Info({ path: 'Automation.helper.ts', resource: 'deleteDevice:updateAutomationUri', mess: updateAutomationUri });

            return await axios
                .delete(updateAutomationUri, {
                    httpsAgent: this.agent,
                })
                .then((response) => {
                    if (response.status === 200) {
                        return response.data;
                    }
                })
                .then((data) => {
                    this.logger.Info({ path: 'Automation.helper.ts', resource: 'deleteDevice:request:data', mess: JSON.stringify(data) });
                    return Promise.resolve(data);
                })
                .catch((err) => {
                    this.logger.Error({ path: 'Automation.helper.ts', resource: 'deleteDevice:request:catch', mess: JSON.stringify(err?.response?.data) });
                    if (err?.response?.status === 404) {
                        return Promise.resolve([]);
                    }
                    return Promise.resolve(undefined);
                });
        } catch (error) {
            this.logger.Error({ path: 'Automation.helper.ts', resource: 'deleteDevice:catch', mess: error });
            return Promise.resolve(undefined);
        }
    };
}

export default Automation;
