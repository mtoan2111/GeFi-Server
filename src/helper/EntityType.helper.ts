import IEntityType, { TEntityTypeFirmwareInfo, TEntityCategory, TEntityType, TEntityLastFirmware } from '../interface/IEntityType.interface';
import { TDeviceTypes } from '../model/v1/device/App.model';
import { TDeviceType } from '../model/v1/device/Type.model';
import { TDeviceCategory } from '../model/v1/device/Category.model';
import { TDeviceConnection } from '../model/v1/device/Connection.model';
import { TDeviceFamily } from '../model/v1/device/Family.model';
import { TVendor } from '../model/v1/vendor/Vendor.model';
import { TDeviceTypeLastFirmware } from '../model/v1/device/Firmware.model';
import { injectable, inject } from 'inversify';
import ILogger from '../interface/ILogger.interface';
import axios from 'axios';
const https = require('https');

@injectable()
class EntityType implements IEntityType {
    private logger: ILogger;
    private agent: any;

    constructor(@inject('Logger') logger: ILogger) {
        this.logger = logger;
        this.agent = new https.Agent({
            rejectUnauthorized: false,
        });
    }

    get = async (app: string): Promise<TEntityCategory[]> => {
        try {
            let baseUri: string | undefined | null = 'http://dev-api.mht.vn/device/';
            typeof process.env.DEVICE_URL !== 'undefined' && (baseUri = process.env.DEVICE_URL);

            const deviceTypeUri = `${baseUri}/v1/app/?page_size=50&page=1&appCode=${app}`;
            const deviceConnectionUri = `${baseUri}/v1/device-connection/?page_size=100&page=1`;
            const deviceFamilyUri = `${baseUri}/v1/device-family/?page_size=100&page=1`;
            const deviceCategoryUri = `${baseUri}/v1/device-category/?page_size=100&page=1`;

            this.logger.Info({ path: 'EntityType.helper.ts', resource: 'get:deviceTypeUri', mess: deviceTypeUri });
            this.logger.Info({ path: 'EntityType.helper.ts', resource: 'get:deviceConnectionUri', mess: deviceConnectionUri });
            this.logger.Info({ path: 'EntityType.helper.ts', resource: 'get:deviceFamilyUri', mess: deviceFamilyUri });
            this.logger.Info({ path: 'EntityType.helper.ts', resource: 'get:deviceCategoryUri', mess: deviceCategoryUri });

            const types: TDeviceTypes[] = await axios
                .get(deviceTypeUri, {
                    httpsAgent: this.agent,
                })
                .then((res) => {
                    if (res.status === 200) return res.data;
                })
                .then((data) => {
                    return data?.items?.[0]?.deviceTypes || [];
                })
                .catch((err) => {
                    this.logger.Error({ path: 'EntityType.helper.ts', resource: 'get:types:catch', mess: JSON.stringify(err?.response?.data) });
                    return [];
                });

            this.logger.Info({ path: 'EntityType.helper.ts', resource: 'get:types', mess: JSON.stringify(types) });

            const connections: TDeviceConnection[] = await axios
                .get(deviceConnectionUri, {
                    httpsAgent: this.agent,
                })
                .then((res) => {
                    if (res.status === 200) return res.data;
                })
                .then((data) => {
                    return data?.items || [];
                })
                .catch((err) => {
                    this.logger.Error({ path: 'EntityType.helper.ts', resource: 'get:connections:catch', mess: JSON.stringify(err?.response?.data) });
                    return [];
                });

            this.logger.Info({ path: 'EntityType.helper.ts', resource: 'get:connections', mess: JSON.stringify(connections) });

            const families: TDeviceFamily[] = await axios
                .get(deviceFamilyUri, {
                    httpsAgent: this.agent,
                })
                .then((res) => {
                    if (res.status === 200) return res.data;
                })
                .then((data) => {
                    return data?.items || [];
                })
                .catch((err) => {
                    this.logger.Error({ path: 'EntityType.helper.ts', resource: 'get:families:catch', mess: JSON.stringify(err?.response?.data) });
                    return [];
                });

            this.logger.Info({ path: 'EntityType.helper.ts', resource: 'get:families', mess: JSON.stringify(families) });

            const categories: TDeviceCategory[] = await axios
                .get(deviceCategoryUri, {
                    httpsAgent: this.agent,
                })
                .then((res) => {
                    if (res.status === 200) return res.data;
                })
                .then((data) => {
                    return data?.items || [];
                })
                .catch((err) => {
                    this.logger.Error({ path: 'EntityType.helper.ts', resource: 'get:categories:catch', mess: JSON.stringify(err?.response?.data) });
                    return [];
                });

            this.logger.Info({ path: 'EntityType.helper.ts', resource: 'get:categories', mess: JSON.stringify(categories) });

            const typesGrouped = types?.reduce?.((r, a) => {
                r[a?.deviceType?.deviceCategoryId || ''] = r[a?.deviceType?.deviceCategoryId || ''] || [];

                const connectionInfo = connections.find((connection) => {
                    return connection.id === a?.deviceType?.deviceConnectionId;
                });

                const familyInfo = families.find((family) => {
                    return family.id === a?.deviceType?.deviceFamilyId;
                });

                r[a?.deviceType?.deviceCategoryId || ''].push({
                    typeId: a?.deviceTypeId,
                    typeCode: a?.deviceType?.deviceTypeCode,
                    typeName: a?.deviceType?.name,
                    typeLogo: a?.deviceType?.logo,
                    familyId: familyInfo?.id,
                    familyName: familyInfo?.name,
                    connectionId: connectionInfo?.id,
                    connectionName: connectionInfo?.name,
                });
                return r;
            }, Object.create(null));

            const categoryIds = Object.keys(typesGrouped);
            let categoryTypes: TEntityCategory[] = [];

            categoryIds?.map?.((categoryId) => {
                const categoryInfo = categories.find((category) => {
                    return category.id === categoryId;
                });
                categoryTypes.push({
                    catId: categoryInfo?.id,
                    catName: categoryInfo?.name,
                    catLogo: categoryInfo?.logo,
                    types: [
                        ...typesGrouped[categoryId].map((type) => ({
                            ...type,
                            catId: categoryInfo?.id,
                            catName: categoryInfo?.name,
                        })),
                    ],
                });
            });

            this.logger.Info({ path: 'EntityType.helper.ts', resource: 'get:categoryTypes', mess: JSON.stringify(categoryTypes) });
            return categoryTypes;
        } catch (err) {
            this.logger.Error({ path: 'EntityType.helper.ts', resource: 'get:catch', mess: err });
            return [];
        }
    };

    verify = async (app: string, typeCode: string): Promise<boolean> => {
        try {
            let baseUri: string | undefined | null = 'http://dev-api.mht.vn/device/';
            typeof process.env.DEVICE_URL !== 'undefined' && (baseUri = process.env.DEVICE_URL);
            const deviceTypeUri = `${baseUri}/v1/app/?page_size=50&page=1&appCode=${app}`;

            this.logger.Info({ path: 'EntityType.helper.ts', resource: 'verify:deviceTypeUri', mess: deviceTypeUri });

            const types: TDeviceTypes[] = await axios
                .get(deviceTypeUri, {
                    httpsAgent: this.agent,
                })
                .then((res) => {
                    if (res.status === 200) return res.data;
                })
                .then((data) => {
                    return data?.items?.[0]?.deviceTypes || [];
                })
                .catch((err) => {
                    this.logger.Error({ path: 'EntityType.helper.ts', resource: 'verify:catch', mess: JSON.stringify(err?.response?.data) });
                    return [];
                });

            const typeInfo = types.find((type) => {
                return type?.deviceType?.deviceTypeCode === typeCode;
            });
            if (typeof typeInfo === 'undefined') {
                return Promise.resolve(false);
            }
            return Promise.resolve(true);
        } catch (err) {
            this.logger.Error({ path: 'EntityType.helper.ts', resource: 'verify:catch', mess: err });
            return Promise.resolve(false);
        }
    };

    info = async (typeCode: string): Promise<TEntityType | undefined> => {
        try {
            let baseUri: string | undefined | null = 'http://dev-api.mht.vn/device/';
            typeof process.env.DEVICE_URL !== 'undefined' && (baseUri = process.env.DEVICE_URL);
            const deviceTypeUri = `${baseUri}/v1/device-type/deviceTypeCode/${typeCode}`;

            this.logger.Info({ path: 'EntityType.helper.ts', resource: 'info:deviceTypeUri', mess: deviceTypeUri });

            const type: TDeviceType | undefined = await axios
                .get(deviceTypeUri, {
                    httpsAgent: this.agent,
                })
                .then((res) => {
                    if (res.status === 200) return res.data;
                })
                .then((data) => {
                    return data;
                })
                .catch((err) => {
                    this.logger.Error({ path: 'EntityType.helper.ts', resource: 'info:type:catch', mess: JSON.stringify(err?.response?.data) });
                    return undefined;
                });

            this.logger.Info({ path: 'EntityType.helper.ts', resource: 'info:type', mess: type });

            if (typeof type === 'undefined') {
                return Promise.resolve(undefined);
            }

            const deviceConnectionUri = `${baseUri}/v1/device-connection/${type?.deviceConnectionId}`;

            this.logger.Info({ path: 'EntityType.helper.ts', resource: 'info:deviceConnectionUri', mess: deviceConnectionUri });

            const connection: TDeviceConnection | undefined = await axios
                .get(deviceConnectionUri, {
                    httpsAgent: this.agent,
                })
                .then((res) => {
                    if (res.status === 200) return res.data;
                })
                .then((data) => {
                    return data;
                })
                .catch((err) => {
                    this.logger.Error({ path: 'EntityType.helper.ts', resource: 'info:connection:catch', mess: JSON.stringify(err?.response?.data) });
                    return undefined;
                });

            this.logger.Info({ path: 'EntityType.helper.ts', resource: 'info:connection', mess: connection });
            if (typeof connection === 'undefined') {
                return Promise.resolve(undefined);
            }

            const deviceFamilyUri = `${baseUri}/v1/device-family/${type?.deviceFamilyId}`;

            this.logger.Info({ path: 'EntityType.helper.ts', resource: 'info:deviceFamilyUri', mess: deviceFamilyUri });

            const family: TDeviceFamily | undefined = await axios
                .get(deviceFamilyUri, {
                    httpsAgent: this.agent,
                })
                .then((res) => {
                    if (res.status === 200) return res.data;
                })
                .then((data) => {
                    return data;
                })
                .catch((err) => {
                    this.logger.Error({ path: 'EntityType.helper.ts', resource: 'info:family:catch', mess: JSON.stringify(err?.response?.data) });
                    return undefined;
                });

            this.logger.Info({ path: 'EntityType.helper.ts', resource: 'info:family', mess: family });
            if (typeof family === 'undefined') {
                return Promise.resolve(undefined);
            }

            const deviceCategoryUri = `${baseUri}/v1/device-category/${type?.deviceCategoryId}`;

            this.logger.Info({ path: 'EntityType.helper.ts', resource: 'info:deviceCategoryUri', mess: deviceCategoryUri });

            const category: TDeviceCategory | undefined = await axios
                .get(deviceCategoryUri, {
                    httpsAgent: this.agent,
                })
                .then((res) => {
                    if (res.status === 200) return res.data;
                })
                .then((data) => {
                    return data;
                })
                .catch((err) => {
                    this.logger.Error({ path: 'EntityType.helper.ts', resource: 'info:category:catch', mess: JSON.stringify(err?.response?.data) });
                    return undefined;
                });

            this.logger.Info({ path: 'EntityType.helper.ts', resource: 'info:category', mess: category });

            if (typeof category === 'undefined') {
                return Promise.resolve(undefined);
            }

            const vendorUri = `${baseUri}/v1/vendor?pageSize=50&pageNumber=1&vendorCode=${type?.vendorCode}`;

            this.logger.Info({ path: 'EntityType.helper.ts', resource: 'info:vendorUri', mess: vendorUri });

            const vendor: TVendor | undefined = await axios
                .get(vendorUri, {
                    httpsAgent: this.agent,
                })
                .then((res) => {
                    if (res.status === 200) return res.data;
                })
                .then((data) => {
                    if (data.toial > 0) return data?.items?.[0];
                    return undefined;
                })
                .catch((err) => {
                    this.logger.Error({ path: 'EntityType.helper.ts', resource: 'info:vendor:catch', mess: JSON.stringify(err?.response?.data) });
                    return undefined;
                });

            this.logger.Info({ path: 'EntityType.helper.ts', resource: 'info:vendor', mess: vendor });
            // if (typeof vendor === 'undefined') {
            //     return Promise.reject();
            // }

            const entityTypeTmp: TEntityType = {
                typeId: type?.id,
                typeName: type?.name,
                typeCode: type?.deviceTypeCode,
                familyId: family?.id,
                familyName: family?.name,
                connectionId: connection?.id,
                connectionName: connection?.name,
                catId: category?.id,
                catName: category?.name,
                vendorId: vendor?.vendorCode,
                vendorName: vendor?.vendorName,
            };

            this.logger.Info({
                path: 'EntityType.helper.ts',
                resource: 'info',
                mess: JSON.stringify(entityTypeTmp),
            });

            return Promise.resolve({ ...entityTypeTmp });
        } catch (err) {
            this.logger.Error({ path: 'EntityType.helper.ts', resource: 'info:catch', mess: err });
            return Promise.resolve(undefined);
        }
    };

    verifyAppCode = async (appCode: string): Promise<boolean> => {
        try {
            let baseUri: string | undefined | null = 'http://dev-api.mht.vn/device';
            typeof process.env.DEVICE_URL !== 'undefined' && (baseUri = process.env.DEVICE_URL);
            const appCodeUri = `${baseUri}/v1/app?page_size=50&page=1&appCode=${appCode}`;

            this.logger.Info({ path: 'EntityType.helper.ts', resource: 'verifyAppCode:appCodeUri', mess: appCodeUri });

            const app = await axios
                .get(appCodeUri, {
                    httpsAgent: this.agent,
                })
                .then((res) => {
                    if (res.status === 200) return res.data;
                })
                .then((data) => {
                    // this.logger.Info({ path: 'EntityType.helper.ts', resource: 'verifyAppCode:data', mess: JSON.stringify(data) });
                    return data?.total;
                })
                .catch((err) => {
                    this.logger.Error({ path: 'EntityType.helper.ts', resource: 'verifyAppCode:app:catch', mess: JSON.stringify(err?.response?.data) });
                    return '';
                });

            if (app !== 0) {
                return true;
            } else {
                return false;
            }
        } catch (err) {
            this.logger.Error({ path: 'EntityType.helper.ts', resource: 'verifyAppCode:catch', mess: err });
            return Promise.resolve(false);
        }
    };

    getFirmware = async (payload: TEntityLastFirmware, jwt: string | undefined | null): Promise<TEntityTypeFirmwareInfo | undefined> => {
        try {
            let baseUri: string | undefined | null = 'http://dev-api.mht.vn/device';
            typeof process.env.DEVICE_URL !== 'undefined' && (baseUri = process.env.DEVICE_URL);
            const lastestFirmwareUri = `${baseUri}/v1/firmware/latest-version`;

            this.logger.Info({ path: 'EntityType.helper.ts', resource: 'getFirmware:modelUri', mess: lastestFirmwareUri });

            const body: TEntityLastFirmware = {
                modelCode: payload.modelCode,
                vendorCode: payload.vendorCode,
                firmwareVersion: payload.firmwareVersion,
                hardwareVersion: payload.hardwareVersion,
            };

            const firmware: TDeviceTypeLastFirmware | undefined = await axios
                .post(lastestFirmwareUri, body, {
                    headers: {
                        Authorization: jwt,
                    },
                    httpsAgent: this.agent,
                })
                .then((res) => {
                    if (res.status === 200) return res.data;
                    return Promise.resolve(undefined);
                })
                .catch((err) => {
                    this.logger.Error({ path: 'EntityType.helper.ts', resource: 'getFirmware:model:catch', mess: JSON.stringify(err?.response?.data) });
                    return Promise.resolve(undefined);
                });

            if (typeof firmware === 'undefined') {
                return Promise.resolve(undefined);
            }

            this.logger.Info({ path: 'EntityType.helper.ts', resource: 'getFirmware:firmware', mess: JSON.stringify(firmware) });

            const firmInfo: TEntityTypeFirmwareInfo = {
                modelCode: payload.modelCode,
                vendorCode: payload.vendorCode,
                version: firmware.version,
                url: firmware.url,
                sha256: firmware.sha256,
                region: firmware.region,
            };

            this.logger.Info({ path: 'EntityType.helper.ts', resource: 'getFirmware:firmInfo', mess: JSON.stringify(firmInfo) });
            return firmInfo;
        } catch (err) {
            this.logger.Error({ path: 'EntityType.helper.ts', resource: 'getFirmware:catch', mess: err });
            return Promise.resolve(undefined);
        }
    };
}

export default EntityType;
