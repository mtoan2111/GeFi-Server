import IEntity, { TEntityFirmwareInfo, TEntityState } from '../interface/IEntity.interface';
import { TEntityType } from '../interface/IEntityType.interface';
import { inject, injectable } from 'inversify';
import axios from 'axios';
import ILogger from '../interface/ILogger.interface';
import { TDeviceInfomation } from '../model/v1/etcd/Info.model';
import { TDeviceState, EDeviceStateResponseController, EDeviceStateResponseAction, TDeviceStateResponseDataState } from '../model/v1/etcd/State.model';
import IETCD from '../interface/IETCD.interface';
// const { Etcd3 } = require('etcd3');
const https = require('https');

@injectable()
class Entity implements IEntity {
    private logger: ILogger;
    // private etcd3EntityClient: any;
    private etcd: IETCD;
    private agent: any;

    constructor(@inject('Logger') logger: ILogger, @inject('ETCD') etcd: IETCD) {
        this.logger = logger;
        this.etcd = etcd;

        this.agent = new https.Agent({
            rejectUnauthorized: false,
        });

        // let etcdUri: string | undefined | null = '192.168.1.44:2379';

        // typeof process.env.ETCD_URL !== 'undefined' && (etcdUri = process.env.ETCD_URL);

        // if (typeof process.env.ETCD_USER !== 'undefined' && typeof process.env.ECTD_USER !== 'undefined') {
        //     let etcdUser = 'device';
        //     typeof process.env.ETCD_USER !== 'undefined' && (etcdUser = process.env.ETCD_USER);

        //     let etcdPassword = 'xJajESfccMU8too3XKDdWaa';
        //     typeof process.env.ETCD_PASSWORD !== 'undefined' && (etcdPassword = process.env.ETCD_PASSWORD);

        //     const auth = {
        //         username: etcdUser,
        //         password: etcdPassword,
        //     };

        //     this.logger.Info({ path: 'Entity.helper.ts', resource: 'constructor:etcd:auth', mess: JSON.stringify(auth) });
        //     this.etcd3EntityClient = new Etcd3({
        //         hosts: etcdUri,
        //         auth,
        //     });
        // }

        // this.etcd3EntityClient = new Etcd3({
        //     hosts: etcdUri,
        // });

        this.logger.Info({ path: 'Entity.helper.ts', resource: 'constructor', mess: 'init' });
    }

    register = async (id: string, token: string, jwt: string | undefined | null): Promise<boolean> => {
        try {
            let baseUri: string | undefined | null = 'http://dev-api.mht.vn/device/';
            typeof process.env.DEVICE_URL !== 'undefined' && (baseUri = process.env.DEVICE_URL);

            const headers = {
                'Content-Type': 'application/json',
                Authorization: jwt,
            };

            const body = {
                id,
                token,
            };

            const options = {
                headers,
                signal: undefined,
            };

            return await axios
                .post(`${baseUri}v1/register`, body, options)
                .then((response) => {
                    if (response.status === 200) {
                        return response.data;
                    }
                })
                .then((data) => {
                    return data;
                })
                .catch(() => {
                    return false;
                });
        } catch (err) {
            this.logger.Error(err);
            return false;
        }
    };

    get = async (id: string, jwt: string | undefined | null): Promise<TEntityType | undefined> => {
        try {
            let deviceBaseUri: string | undefined | null = 'https://dev-api.mht.vn/device/';
            typeof process.env.DEVICE_URL !== 'undefined' && (deviceBaseUri = process.env.DEVICE_URL);
            const getEntityUri: string = `${deviceBaseUri}/v1/device/${id}`;

            this.logger.Info({ path: 'Entity.helper.ts', resource: 'get:entity:uri', mess: JSON.stringify(getEntityUri) });

            let info: TEntityType | undefined = await axios
                .get(getEntityUri, {
                    headers: {
                        Authorization: jwt,
                    },
                    httpsAgent: this.agent,
                })
                .then((response) => {
                    if (response.status === 200) {
                        return response.data;
                    }
                    return Promise.resolve(undefined);
                })
                .then((entityInfo) => {
                    const info: TEntityType = {
                        mac: entityInfo?.mac,
                        status: entityInfo?.status,
                        typeId: entityInfo?.deviceType?.id,
                        typeName: entityInfo?.deviceType?.name,
                        typeCode: entityInfo?.deviceType?.deviceTypeCode,
                        catId: entityInfo?.deviceType?.deviceCategory?.id,
                        catName: entityInfo?.deviceType?.deviceCategory?.name,
                        familyId: entityInfo?.deviceType?.deviceFamily?.id,
                        familyName: entityInfo?.deviceType?.deviceFamily?.name,
                        connectionId: entityInfo?.deviceType?.deviceConnection?.id,
                        connectionName: entityInfo?.deviceType?.deviceConnection?.name,
                        vendorId: entityInfo?.vendorCode,
                    };
                    return info;
                })
                .catch((err) => {
                    this.logger.Error({ path: 'Entity.helper.ts', resource: 'get:entity:catch', mess: JSON.stringify(err?.response?.data) });
                    return Promise.resolve(undefined);
                });

            this.logger.Info({ path: 'Entity.helper.ts', resource: 'get:entity:info', mess: JSON.stringify(info) });

            if (typeof info === 'undefined') {
                return Promise.resolve(undefined);
            }

            let vendorBaseUri: string | undefined | null = 'https://dev-api.mht.vn/vendor/';
            typeof process.env.VENDOR_URL !== 'undefined' && (vendorBaseUri = process.env.VENDOR_URL);
            const getVendorUri: string = `${vendorBaseUri}/v1/vendor?pageSize=50&pageNumber=1&vendorCode=${info?.vendorId}`;

            this.logger.Info({ path: 'Entity.helper.ts', resource: 'get:vendor:uri', mess: JSON.stringify(getVendorUri) });

            return axios
                .get(getVendorUri, {
                    httpsAgent: this.agent,
                })
                .then((response) => {
                    if (response.status === 200) {
                        return response.data;
                    }
                })
                .then((data) => {
                    this.logger.Info({ path: 'Entity.helper.ts', resource: 'get:vendor:result', mess: JSON.stringify(data) });
                    if (data.total > 0) {
                        const eInfo: TEntityType = {
                            mac: info?.mac,
                            status: info?.status,
                            typeId: info?.typeId,
                            typeName: info?.typeName,
                            typeCode: info?.typeCode,
                            catId: info?.catId,
                            catName: info?.catName,
                            familyId: info?.familyId,
                            familyName: info?.familyName,
                            connectionId: info?.connectionId,
                            connectionName: info?.connectionName,
                            vendorId: info?.vendorId,
                            vendorName: data?.items?.[0]?.vendorName,
                        };
                        return { ...eInfo };
                    }
                    return undefined;
                })
                .catch((err) => {
                    this.logger.Error({ path: 'Entity.helper.ts', resource: 'get:vendor:catch', mess: JSON.stringify(err?.response?.data) });
                    return Promise.resolve(undefined);
                });
        } catch (err) {
            this.logger.Error({ path: 'Entity.helper.ts', resource: 'get:catch', mess: err });
            return Promise.resolve(undefined);
        }
    };

    state = async (id: string): Promise<TEntityState | undefined> => {
        try {
            const topic = `${id}/state`;

            this.logger.Info({ path: 'Entity.helper.ts', resource: 'state:topic', mess: topic });
            const state = await this.etcd.get<TDeviceState | undefined>(topic);
            this.logger.Info({ path: 'Entity.helper.ts', resource: 'state:stateLog', mess: JSON.stringify(state) });
            if (typeof state !== 'undefined') {
                if (typeof state === 'undefined') return undefined;

                if (state?.response?.actor !== EDeviceStateResponseController.DEVICE && state?.response?.action !== EDeviceStateResponseAction.STATE) {
                    return undefined;
                }

                const stateInfo: TDeviceStateResponseDataState | undefined = state?.response?.state;
                const stateId: string | undefined = state?.response?.device_id;

                if (!id.includes(stateId || '')) {
                    return undefined;
                }
                const entityState: TEntityState = {
                    updated: state?.audit?.createdAt,
                    state: stateInfo,
                };
                return entityState;
            }
            return undefined;
        } catch (err) {
            this.logger.Error({ path: 'Entity.helper.ts', resource: 'state:catch', mess: err });
            return Promise.resolve(undefined);
        }
    };

    token = async (id: string): Promise<any> => {
        try {
            const topic = `${id}/token`;
            this.logger.Info({ path: 'Entity.helper.ts', resource: 'token:topic', mess: topic });
            return await this.etcd.get<number | undefined>(topic);
        } catch (err) {
            this.logger.Error({ path: 'Entity.helper.ts', resource: 'token:catch', mess: err });
            return Promise.resolve();
        }
    };

    info = async (id: string, parentId: string): Promise<TEntityFirmwareInfo | undefined> => {
        try {
            let infoTopic = `${id}/info`;
            if (typeof parentId !== 'undefined' && parentId !== null && parentId !== '') {
                infoTopic = `${parentId}/${id}/info`;
            }

            const info = await this.etcd.get<TDeviceInfomation | undefined>(infoTopic);
            this.logger.Info({ path: 'Entity.helper.ts', resource: 'info:infoLog', mess: JSON.stringify(info) });
            if (typeof info !== 'undefined') {
                if (typeof info === 'undefined') return undefined;

                const version = info?.response?.version;
                if (typeof version === 'undefined') return undefined;

                const model = info?.response?.model;
                if (typeof model === 'undefined') return undefined;

                const fwInfo: TEntityFirmwareInfo = {
                    id: id,
                    fmVersion: version?.firmware,
                    hwVersion: version?.hardware,
                    model: model?.model_name,
                    modeCode: model?.model_code,
                };

                this.logger.Info({ path: 'Entity.helper.ts', resource: 'info:fwInfo', mess: JSON.stringify(fwInfo) });
                return fwInfo;
            }
            return undefined;
        } catch (err) {
            this.logger.Error({ path: 'Entity.helper.ts', resource: 'info:catch', mess: err });
            return Promise.resolve(undefined);
        }
    };
}

export default Entity;
