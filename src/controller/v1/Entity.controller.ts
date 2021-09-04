import { Home } from '../../model/v1/home/Home.model';
import { Area } from '../../model/v1/home/Area.model';
import { User } from '../../model/v1/home/User.model';
import { Response, Request } from 'express';
import { Member } from '../../model/v1/home/Member.model';
import { Device } from '../../model/v1/home/Entity.model';
import { inject, injectable } from 'inversify';
import { ErrorCode } from '../../response/Error.response';
import { HomeStatistical } from '../../model/v1/home/HomeStatistical.model';
import { AreaStatistical } from '../../model/v1/home/AreaStatistical.model';
import { Automation } from '../../model/v1/home/Automation.model';
import { DeleteQueryBuilder, getConnection, getRepository, SelectQueryBuilder } from 'typeorm';
import ICRUD from '../../interface/ICRUD.interface';
import ILogger from '../../interface/ILogger.interface';
import IPolicy from '../../interface/IPolicy.interface';
import IEntity from '../../interface/IEntity.interface';
import ITimestamp from '../../interface/ITimestamp.Interface';
import IResponser from '../../interface/IResponser.interface';
import ISemaphore from '../../interface/ISemaphore.interface';
import IEntityType, { TEntityLastFirmware, TEntityType, TEntityTypeFirmwareInfo } from '../../interface/IEntityType.interface';
import { TEntityFirmwareInfo } from '../../interface/IEntity.interface';
import IAutomation from '../../interface/IAutomation.interface';

/**
 * [[include:/major/Entity/Entity.md]]
 */

@injectable()
class EntityController implements ICRUD {
    private logger: ILogger;
    private responser: IResponser;
    private entity: IEntity;
    private timestamp: ITimestamp;
    private entityType: IEntityType;
    private policy: IPolicy;
    private semaphore: ISemaphore;
    private automation: IAutomation;

    constructor(
        @inject('Logger') logger: ILogger,
        @inject('Responser') responser: IResponser,
        @inject('Entity') entity: IEntity,
        @inject('Timestamp') timestamp: ITimestamp,
        @inject('EntityType') entityType: IEntityType,
        @inject('Policy') policy: IPolicy,
        @inject('Semaphore') semaphore: ISemaphore,
        @inject('Automation') automation: IAutomation,
    ) {
        this.logger = logger;
        this.responser = responser;
        this.entity = entity;
        this.timestamp = timestamp;
        this.entityType = entityType;
        this.policy = policy;
        this.semaphore = semaphore;
        this.automation = automation;
    }
    /**
     * ## Find the entities that satisfy the input conditions
     *
     * ### The request api:
     * ### <span style="background-color:#61affe; padding: 2px 15px; border-radius: 5px; color: white">GET</span> /home/v1/entity
     *
     * **Note:** Need to be set the `DEBUG_LEVEL` to `debug` in **.env** file for using `ILogger`
     *
     * @param req - the request delegate of client
     *
     * `req` will be include a limited fields
     *
     * |Parameters|Requried/Optional|Type|Detail|
     * |----------|-----------------|----|------|
     * |id| optional | nvarchar(128) | The id of the entity that need to be searched|
     * |homeId| required | nvarchar(128) | The homeId of the entity that need to be searched|
     * |sentitive | required | boolean | Search mode: `false`: search all or `true` : search by area|
     * |appCode | required | nvarchar(256) | The app name of the application that need to be searched|
     * |familyName | optional | nvarchar(256) | The family name of the device that need to be searched|
     * |memberId | optional | nvarchar(128) | The member id of the entity that need to be searched. If memberId is appeared, userId will be ignored by default|
     * |areaId| optional | nvarchar(128) | The areaId of the entity that need to be searched|
     * |parentId | optional | nvarchar(128) | The id of parent that need to be searched|
     * |name | optional | nvarchar(256) | The name of the entity that need to be searched|
     *
     * @param res - the response delegate of client
     *
     * @returns
     *
     * - Response `HTTP Code` to client as follow
     *
     * |Code|Detail|
     * |----|------|
     * |<span style="color:green">200</span> | Return a list of areas by query|
     * |<span style="color:red">400</span> | Occur if an exception raised |
     * |<span style="color:red">401</span> | Occur if don't have permission |
     * |<span style="color:red">406</span> | Occur if one of the field in request is not acceptable |
     *
     * - List of areas will be in the format as the below
     *
     * ```json
     * {
     *      message: '',
     *      data: [{
     *          id: 'xxxxxxx-xxxx-xxxx-xxxxxx',
     *          homeid: 'xxxxxxx-xxxx-xxxx-xxxxxx',
     *          userid: 'xxxxxxx-xxxx-xxxx-xxxxxx',
     *          areaid: 'xxxxxxx-xxxx-xxxx-xxxxxx',
     *          areaName: string,
     *          name: string,
     *          mac: string,
     *          parentId: 'xxxxxxx-xxxx-xxxx-xxxxxx' | null,
     *          typeId: 'xxxxxxx-xxxx-xxxx-xxxxxx',
     *          typeCode: string
     *          typeCode: string,
     *          typeName: string,
     *          catId: 'xxxxxxx-xxxx-xxxx-xxxxxx',
     *          catName: string,
     *          connectionId: 'xxxxxxx-xxxx-xxxx-xxxxxx',
     *          connectionName: string,
     *          familyId: 'xxxxxxx-xxxx-xxxx-xxxxxx',
     *          familyName: string,
     *          logo: string,
     *          state: object,
     *      }]
     * }
     * ```
     * - response detail
     *
     * |Parameters|Type|Detail|
     * |----------|----|------|
     * |id | string | The id of the entity will be in <a href="https://en.wikipedia.org/wiki/Universally_unique_identifier" target="_blank">uuid_v4</a> format|
     * |name | string | The name of the entity |
     * |homeId | string | The home id of the entity will be in <a href="https://en.wikipedia.org/wiki/Universally_unique_identifier" target="_blank">uuid_v4</a> format|
     * |userId | string | The user id of the entity will be in <a href="https://en.wikipedia.org/wiki/Universally_unique_identifier" target="_blank">uuid_v4</a> format|
     * |areaId | string | The area id of the entity will be in <a href="https://en.wikipedia.org/wiki/Universally_unique_identifier" target="_blank">uuid_v4</a> format|
     * |areaname | string | The name of the area |
     * |parentId | string or null  | The parent id of the entity will be in <a href="https://en.wikipedia.org/wiki/Universally_unique_identifier" target="_blank">uuid_v4</a> format|
     * |typeId | string | The type id of the entity will be in <a href="https://en.wikipedia.org/wiki/Universally_unique_identifier" target="_blank">uuid_v4</a> format|
     * |typeCode | string | The type code of the entity will be in <a href="https://en.wikipedia.org/wiki/Universally_unique_identifier" target="_blank">uuid_v4</a> format|
     * |typeName | string | The type name of the entity|
     * |catId | string | The category id of the entity will be in <a href="https://en.wikipedia.org/wiki/Universally_unique_identifier" target="_blank">uuid_v4</a> format|
     * |catName | string | The category name of the entity|
     * |connectionId | string | The connection id of the entity will be in <a href="https://en.wikipedia.org/wiki/Universally_unique_identifier" target="_blank">uuid_v4</a> format|
     * |connectionName | string | The connection name of the entity|
     * |familyId | string | The family type id of the entity will be in <a href="https://en.wikipedia.org/wiki/Universally_unique_identifier" target="_blank">uuid_v4</a> format|
     * |familyName | string | The family type name of the entity|
     * |state | object | The last state of entity|
     * |logo | string or null | The logo of the entity. entity can be an url or a key or null|
     * |pos | number | The position of the entity that will be appeared in app|
     *
     */
    get = async (req: Request, res: Response): Promise<void> => {
        const param = req.query;
        const connection = getConnection();
        const queryRunner = connection.createQueryRunner();
        await queryRunner.connect();

        try {
            let deviceQueryTmp: SelectQueryBuilder<Device> = queryRunner.manager
                .getRepository(Device)
                .createQueryBuilder('device')
                .where(typeof param.id !== 'undefined' && param.id !== '' ? 'device.id = :id' : '1 = 1', {
                    id: param.id,
                })
                .andWhere(typeof param.name !== 'undefined' && param.name !== '' ? 'device.name = :name' : '1 = 1', {
                    name: param.name,
                })
                .andWhere(typeof param.parentId !== 'undefined' && param.parentId !== '' ? 'device.parentId = :parent' : '1 = 1', { parent: param.parentId })
                .andWhere(typeof param.vendorCode !== 'undefined' && param.vendorCode !== '' ? 'device.vendorId = :vendorCode' : '1 = 1', {
                    vendorCode: param.vendorCode,
                })
                .andWhere(
                    typeof param.familyName !== 'undefined' && param.familyName !== ''
                        ? `LOWER(REPLACE(device.familyName, ' ', '')) = LOWER(REPLACE(:familyName, ' ', ''))`
                        : '1 = 1',
                    { familyName: param.familyName },
                )
                .andWhere('device.homeId = :homeId', { homeId: param.homeId })
                .andWhere('device.appCode = :appCode', { appCode: param.appCode });

            if (param?.sentitive) {
                deviceQueryTmp = deviceQueryTmp.andWhere(typeof param.areaId !== 'undefined' ? 'device.areaId = :areaId' : 'device.areaId IS NULL', {
                    areaId: param.areaId,
                });
            }

            const homeDetail = await queryRunner.manager
                .getRepository(Home)
                .createQueryBuilder('home')
                .where('home.id = :id', { id: param.homeId })
                .andWhere('home.userId = :userId', { userId: param.userId })
                .andWhere('home.appCode = :appCode', { appCode: param.appCode })
                .getOne();

            this.logger.Info({ path: 'Entity.controller.ts', resource: 'get:homeDetail', mess: JSON.stringify(homeDetail) });

            if (homeDetail && homeDetail.isOwner && typeof param.memberId !== 'undefined' && param.memberId !== null && param.memberId !== '') {
                const member = await queryRunner.manager
                    .getRepository(Member)
                    .createQueryBuilder('member')
                    .where('member.id = :memberId', { memberId: param.memberId })
                    .andWhere('member.homeId = :homeId', { homeId: param.homeId })
                    .andWhere('member.appCode = :appCode', { appCode: param.appCode })
                    .getOne();

                this.logger.Info({ path: 'Entity.controller.ts', resource: 'get:member', mess: JSON.stringify(member) });

                if (typeof member !== 'undefined') {
                    deviceQueryTmp = deviceQueryTmp.andWhere('device.userId = :memberId', { memberId: param.memberId });
                } else {
                    return this.responser.Ok(res, { message: 'done', data: [] });
                }
            } else {
                deviceQueryTmp = deviceQueryTmp.andWhere('device.userId = :userId', { userId: param.userId });
            }

            const entities = await deviceQueryTmp
                .leftJoinAndSelect(Area, 'area', 'area.id = device.areaId')
                .orderBy('device.position', 'ASC')
                .select([
                    'device.id AS id',
                    'device.name AS name',
                    'device.userId AS userId',
                    'device.homeId AS homeId',
                    'device.areaId AS areaId',
                    'area.name AS areaName',
                    'device.mac AS mac',
                    'device.typeId AS typeId',
                    'device.typeCode AS typeCode',
                    'device.typeName AS typeName',
                    'device.categoryId AS catId',
                    'device.categoryName AS catName',
                    'device.familyId AS familyId',
                    'device.familyName AS familyName',
                    'device.connectionId AS connectionId',
                    'device.connectionName AS connectionName',
                    'device.vendorId AS vendorId',
                    'device.vendorName AS vendorName',
                    'device.parentId AS parentId',
                    'device.extra AS extra',
                    'device.logo AS logo',
                    'device.position AS pos',
                ])
                .getRawMany();

            this.logger.Info({ path: 'Entity.controller.ts', resource: 'get:entities', mess: JSON.stringify(entities) });
            let results: any = [];

            await Promise.all(
                entities.map(async (entity) => {
                    this.logger.Info({ path: 'Entity.controller.ts', resource: 'get:entity', mess: JSON.stringify(entity) });
                    if (entity.familyName?.toLowerCase?.() === 'hc') {
                        results.push(entity);
                        return;
                    }
                    let id = entity?.id;

                    if (entity?.parentid && entity?.parentid !== null && typeof entity?.parentid !== 'undefined') {
                        id = `${entity.parentid}/${id}`;
                    }

                    this.logger.Info({ path: 'Entity.controller.ts', resource: 'get:entity:id', mess: id });

                    let entityState: any = {};
                    try {
                        entityState = await this.entity.state(id);
                        this.logger.Info({ path: 'Entity.controller.ts', resource: 'get:entity:state', mess: JSON.stringify(entityState) });
                    } catch (err) {
                        this.logger.Error({ path: 'Entity.controller.ts', resource: 'get:entity:state:catch', mess: err });
                    }
                    if (typeof entityState === 'undefined') {
                        results.push(entity);
                        return;
                    }
                    results.push({
                        ...entity,
                        updated: entityState?.updated,
                        state: entityState?.state,
                    });
                }),
            );

            this.logger.Info({ path: 'Entity.controller.ts', resource: 'get:results', mess: JSON.stringify(results) });
            return this.responser.Ok(res, { message: 'done', data: results });
        } catch (err) {
            this.logger.Error({ path: 'Entity.controller.ts', resource: 'get:catch', mess: err });
            return this.responser.BadRequest(res, { message: err });
        } finally {
            queryRunner.release();
        }
    };

    /**
     * ## Find the entities that satisfy the input conditions
     *
     * ### The request api:
     * ### <span style="background-color:#61affe; padding: 2px 15px; border-radius: 5px; color: white">GET</span> /home/v1/entity
     *
     * **Note:** Need to be set the `DEBUG_LEVEL` to `debug` in **.env** file for using `ILogger`
     *
     * @param req - the request delegate of client
     *
     * `req` will be include a limited fields
     *
     * |Parameters|Requried/Optional|Type|Detail|
     * |----------|-----------------|----|------|
     * |id| optional | nvarchar(128) | The id of the entity that need to be searched|
     * |homeId| required | nvarchar(128) | The homeId of the entity that need to be searched|
     * |sentitive | required | boolean | Search mode: `false`: search all or `true` : search by area|
     * |appCode | required | nvarchar(256) | The app name of the application that need to be searched|
     * |familyName | optional | nvarchar(256) | The family name of the device that need to be searched|
     * |memberId | optional | nvarchar(128) | The member id of the entity that need to be searched. If memberId is appeared, userId will be ignored by default|
     * |areaId| optional | nvarchar(128) | The areaId of the entity that need to be searched|
     * |parentId | optional | nvarchar(128) | The id of parent that need to be searched|
     * |name | optional | nvarchar(256) | The name of the entity that need to be searched|
     *
     * @param res - the response delegate of client
     *
     * @returns
     *
     * - Response `HTTP Code` to client as follow
     *
     * |Code|Detail|
     * |----|------|
     * |<span style="color:green">200</span> | Return a list of areas by query|
     * |<span style="color:red">400</span> | Occur if an exception raised |
     * |<span style="color:red">401</span> | Occur if don't have permission |
     * |<span style="color:red">406</span> | Occur if one of the field in request is not acceptable |
     *
     * - List of areas will be in the format as the below
     *
     * ```json
     * {
     *      message: '',
     *      data: [{
     *          id: 'xxxxxxx-xxxx-xxxx-xxxxxx',
     *          homeid: 'xxxxxxx-xxxx-xxxx-xxxxxx',
     *          userid: 'xxxxxxx-xxxx-xxxx-xxxxxx',
     *          areaid: 'xxxxxxx-xxxx-xxxx-xxxxxx',
     *          areaName: string,
     *          name: string,
     *          mac: string,
     *          parentId: 'xxxxxxx-xxxx-xxxx-xxxxxx' | null,
     *          typeId: 'xxxxxxx-xxxx-xxxx-xxxxxx',
     *          typeCode: string
     *          typeCode: string,
     *          typeName: string,
     *          catId: 'xxxxxxx-xxxx-xxxx-xxxxxx',
     *          catName: string,
     *          connectionId: 'xxxxxxx-xxxx-xxxx-xxxxxx',
     *          connectionName: string,
     *          familyId: 'xxxxxxx-xxxx-xxxx-xxxxxx',
     *          familyName: string,
     *          logo: string,
     *          state: object,
     *      }]
     * }
     * ```
     * - response detail
     *
     * |Parameters|Type|Detail|
     * |----------|----|------|
     * |id | string | The id of the entity will be in <a href="https://en.wikipedia.org/wiki/Universally_unique_identifier" target="_blank">uuid_v4</a> format|
     * |name | string | The name of the entity |
     * |homeId | string | The home id of the entity will be in <a href="https://en.wikipedia.org/wiki/Universally_unique_identifier" target="_blank">uuid_v4</a> format|
     * |userId | string | The user id of the entity will be in <a href="https://en.wikipedia.org/wiki/Universally_unique_identifier" target="_blank">uuid_v4</a> format|
     * |areaId | string | The area id of the entity will be in <a href="https://en.wikipedia.org/wiki/Universally_unique_identifier" target="_blank">uuid_v4</a> format|
     * |areaname | string | The name of the area |
     * |parentId | string or null  | The parent id of the entity will be in <a href="https://en.wikipedia.org/wiki/Universally_unique_identifier" target="_blank">uuid_v4</a> format|
     * |typeId | string | The type id of the entity will be in <a href="https://en.wikipedia.org/wiki/Universally_unique_identifier" target="_blank">uuid_v4</a> format|
     * |typeCode | string | The type code of the entity will be in <a href="https://en.wikipedia.org/wiki/Universally_unique_identifier" target="_blank">uuid_v4</a> format|
     * |typeName | string | The type name of the entity|
     * |catId | string | The category id of the entity will be in <a href="https://en.wikipedia.org/wiki/Universally_unique_identifier" target="_blank">uuid_v4</a> format|
     * |catName | string | The category name of the entity|
     * |connectionId | string | The connection id of the entity will be in <a href="https://en.wikipedia.org/wiki/Universally_unique_identifier" target="_blank">uuid_v4</a> format|
     * |connectionName | string | The connection name of the entity|
     * |familyId | string | The family type id of the entity will be in <a href="https://en.wikipedia.org/wiki/Universally_unique_identifier" target="_blank">uuid_v4</a> format|
     * |familyName | string | The family type name of the entity|
     * |state | object | The last state of entity|
     * |logo | string or null | The logo of the entity. entity can be an url or a key or null|
     * |pos | number | The position of the entity that will be appeared in app|
     *
     */
    getUpdateInfo = async (req: Request, res: Response): Promise<void> => {
        const param = req.query;
        const connection = getConnection();
        const queryRunner = connection.createQueryRunner();
        await queryRunner.connect();

        try {
            const existedDevice: Device | undefined = await getRepository(Device)
                .createQueryBuilder('device')
                .where('device.id = :id', { id: param.id })
                .andWhere('device.homeId = :homeId', { homeId: param.homeId })
                .andWhere('device.userId = :userId', { userId: param.userId })
                .andWhere('device.appCode = :appCode', { appCode: param.appCode })
                .getOne();

            if (typeof existedDevice === 'undefined') {
                return this.responser.NotFound(res, { code: ErrorCode.NSERR_ENTITYNOTFOUND });
            }

            const jwt = req.headers.authorization;

            const deviceInfo: TEntityFirmwareInfo | undefined = await this.entity.info(existedDevice?.id, existedDevice?.parentId, jwt);
            if (typeof deviceInfo === 'undefined') {
                return this.responser.NotFound(res, { code: ErrorCode.NSERR_ENTITYINFONOTFOUND });
            }

            this.logger.Info({ path: 'Entity.controller.ts', resource: 'getUpdateInfo:deviceInfo', mess: JSON.stringify(deviceInfo) });

            const requestFirmwarePayload: TEntityLastFirmware = {
                modelCode: deviceInfo.modeCode,
                vendorCode: existedDevice?.vendorId,
                firmwareVersion: deviceInfo.fmVersion,
                hardwareVersion: deviceInfo.hwVersion,
            };

            this.logger.Info({ path: 'Entity.controller.ts', resource: 'getUpdateInfo:requestFirmwarePayload', mess: JSON.stringify(requestFirmwarePayload) });

            const deviceTypeFirmware: TEntityTypeFirmwareInfo | undefined = await this.entityType.getFirmware(requestFirmwarePayload, jwt);
            // if (typeof deviceTypeFirmware === 'undefined') {
            //     return this.responser.NotFound(res, { code: ErrorCode.NSERR_ENTITYINFONOTFOUND });
            // }

            this.logger.Info({ path: 'Entity.controller.ts', resource: 'getUpdateInfo:deviceTypeFirmware', mess: JSON.stringify(deviceTypeFirmware) });

            let result = {
                id: existedDevice?.id,
                userId: existedDevice?.userId,
                homeId: existedDevice?.homeId,
                name: existedDevice?.name,
                appCode: existedDevice?.appCode,
                typeId: existedDevice?.typeId,
                vendorId: existedDevice?.vendorId,
                vendorName: existedDevice?.vendorName,
                modelCode: deviceTypeFirmware?.modelCode,
                version: {
                    firmware: deviceInfo?.fmVersion,
                    hardware: deviceInfo?.hwVersion,
                },
            };

            if (typeof deviceTypeFirmware !== 'undefined') {
                result['modelVersion'] = {
                    firmware: deviceTypeFirmware?.version,
                    uri: deviceTypeFirmware?.url,
                    sha256: deviceTypeFirmware?.sha256,
                    region: deviceTypeFirmware?.region,
                };
            }

            this.logger.Info({ path: 'Entity.controller.ts', resource: 'get:result', mess: JSON.stringify(result) });
            return this.responser.Ok(res, { message: 'done', data: result });
        } catch (err) {
            this.logger.Error({ path: 'Entity.controller.ts', resource: 'get:catch', mess: err });
            return this.responser.BadRequest(res, { message: err });
        } finally {
            queryRunner.release();
        }
    };

    /**
     * ## Create a device
     *
     * ### The request api:
     * ### <span style="background-color:#49cc90; padding: 2px 15px; border-radius: 5px; color: white">POST</span> /home/v1/entity/register
     *
     * - **Note:** The parameter will be sent in the body of request
     * - **Note:** Need to be set the `DEBUG_LEVEL` to `debug` in **.env** file for using `ILogger`
     *
     * @param req - the request delegate of client
     * `req` will be include a limited fields
     *
     * |Parameters|Requried/Optional|Type|Detail|
     * |----------|-----------------|----|------|
     * |id | required | nvarchar(128) | The id of the entity will be in <a href="https://en.wikipedia.org/wiki/Universally_unique_identifier" target="_blank">uuid_v4</a> format|
     * |homeId | required | nvarchar(128) | The home id of the entity will be in <a href="https://en.wikipedia.org/wiki/Universally_unique_identifier" target="_blank">uuid_v4</a> format|
     * |typeCode | required | nvarchar(128) | The device type code of the entity will be in <a href="https://en.wikipedia.org/wiki/Universally_unique_identifier" target="_blank">uuid_v4</a> format|
     * |areaId | required | nvarchar(128) | The area id of the entity will be in <a href="https://en.wikipedia.org/wiki/Universally_unique_identifier" target="_blank">uuid_v4</a> format|
     * |appCode | required | nvarchar(256) | The app name of the application that need to be created|
     * |parentId | optional | nvarchar(128) | The id of parent will be in <a href="https://en.wikipedia.org/wiki/Universally_unique_identifier" target="_blank">uuid_v4</a> format|
     * |name | required | nvarchar(256) | The name of the the entity that need to be created|
     * |logo | optional | nvarchar(128) | The id of parent that need to be created|
     * |pos | optional | integer(-1,1023) | The position of entity that need to be created|
     * |extra | optional | object | The extra data of the entity that need to be created|
     * |token | optional | nvarchar(256) | The pairing token of the entity that need to be created|
     *
     * - **<strong style="color: red;">Note:</strong>** if parentId apprear, id of entity must include typeCode
     *
     * @param res - the response delegate of client
     *
     * @returns
     *
     * - Response `HTTP Code` to client as follow
     *
     * |Code|Detail|
     * |----|------|
     * |<span style="color:green">200</span> | Return a successful message|
     * |<span style="color:red">400</span> | Occur if an exception has been raised |
     * |<span style="color:red">401</span> | Occur if don't have permission to create area |
     * |<span style="color:red">404</span> | Occur if the dependencies data could not be found |
     * |<span style="color:red">406</span> | Occur if one of the field in request is not acceptable |
     *
     * - Response will be in the format as the below
     *
     * ```json
     * {
     *      message: ''
     * }
     * ```
     *
     * - response detail
     *
     * |Parameters|Type|Detail|
     * |----------|----|------|
     * |message | string | The message will be responsed to client|
     *
     *
     */
    create = async (req: Request, res: Response): Promise<void> => {
        const param = req.body;
        const lockResource = `/home/${param.userId}/${param.homeId}/${param.appCode}/createEntity`;
        await this.semaphore.acquire(lockResource);
        const connection = getConnection();
        const queryRunner = connection.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction('READ COMMITTED');

        try {
            this.logger.Info({
                path: 'Entity.controller.ts',
                resource: 'create:param',
                mess: `
                
                
                
                
                    ${JSON.stringify(param)}
                    
                    
                    
                    
                    `,
            });

            if (param?.parentId && typeof param?.parentId !== 'undefined' && param?.parentId !== '' && !param?.id?.includes(param?.typeCode)) {
                this.logger.Error({ path: 'Entity.controller.ts', resource: 'create:parentId', mess: ErrorCode.NSERR_ENTITYUNREGISTEREDFORDEVICETYPE });
                return this.responser.NotFound(res, { code: ErrorCode.NSERR_ENTITYUNREGISTEREDFORDEVICETYPE });
            }

            const existedUser = await queryRunner.manager
                .getRepository(User)
                .createQueryBuilder('user')
                .where('user.id = :userId', { userId: param.userId })
                .andWhere('user.appCode = :appCode', { appCode: param.appCode })
                .getOne();

            if (typeof existedUser === 'undefined') {
                this.logger.Error({ path: 'Entity.controller.ts', resource: 'create:existedUser', mess: ErrorCode.NSERR_USERNOTFOUND });
                return this.responser.NotFound(res, { code: ErrorCode.NSERR_USERNOTFOUND });
            }

            const homeDetail = await queryRunner.manager
                .getRepository(Home)
                .createQueryBuilder('home')
                .where('home.id = :homeId', { homeId: param.homeId })
                .andWhere('home.userId = :userId', { userId: param.userId })
                .andWhere('home.appCode = :appCode', { appCode: param.appCode })
                .getOne();

            this.logger.Info({ path: 'Entity.controller.ts', resource: 'create:homeDetail', mess: JSON.stringify(homeDetail) });

            if (typeof homeDetail === 'undefined') {
                this.logger.Error({ path: 'Entity.controller.ts', resource: 'create:homeDetail', mess: ErrorCode.NSERR_HOMENOTFOUND });
                return this.responser.NotFound(res, { code: ErrorCode.NSERR_HOMENOTFOUND });
            }

            if (typeof param?.areaId !== 'undefined' && param?.areaId !== null && param?.areaId !== '') {
                const existedArea = await queryRunner.manager
                    .getRepository(Area)
                    .createQueryBuilder('area')
                    .where('area.id = :areaId', { areaId: param.areaId })
                    .andWhere('area.homeId = :homeId', { homeId: param.homeId })
                    .andWhere('area.userId = :userId', { userId: param.userId })
                    .andWhere('area.appCode = :appCode', { appCode: param.appCode })
                    .getOne();

                this.logger.Info({ path: 'Entity.controller.ts', resource: 'create:existedArea', mess: JSON.stringify(existedArea) });

                if (typeof existedArea === 'undefined') {
                    this.logger.Error({ path: 'Entity.controller.ts', resource: 'create:existedArea', mess: ErrorCode.NSERR_AREANOTFOUND });
                    return this.responser.NotFound(res, { code: ErrorCode.NSERR_AREANOTFOUND });
                }
            }

            if (typeof param.parentId !== 'undefined' && param.parentId !== '' && param.parentId !== null) {
                const existedParentDevice = await queryRunner.manager
                    .getRepository(Device)
                    .createQueryBuilder('device')
                    .where('device.id = :id', { id: param.parentId })
                    .andWhere('device.homeId = :homeId', { homeId: param.homeId })
                    .andWhere('device.userId = :userId', { userId: param.userId })
                    .andWhere('device.appCode = :appCode', { appCode: param.appCode })
                    .getOne();

                this.logger.Info({ path: 'Entity.controller.ts', resource: 'create:existedParentDevice', mess: JSON.stringify(existedParentDevice) });
                if (typeof existedParentDevice === 'undefined') {
                    this.logger.Error({ path: 'Entity.controller.ts', resource: 'create:existedParentDevice', mess: ErrorCode.NSERR_ENTITYPARENTNOTFOUND });
                    return this.responser.NotFound(res, { code: ErrorCode.NSERR_ENTITYPARENTNOTFOUND });
                }
            }

            const existedDevice = await queryRunner.manager
                .getRepository(Device)
                .createQueryBuilder('device')
                .where('device.id = :id', { id: param.id })
                .getOne();
            this.logger.Info({ path: 'Entity.controller.ts', resource: 'create:existedDevice', mess: JSON.stringify(existedDevice) });

            if (typeof existedDevice !== 'undefined') {
                this.logger.Error({ path: 'Entity.controller.ts', resource: 'create:existedDevice', mess: ErrorCode.NSERR_ENTITYEXISTED });
                return this.responser.Conflict(res, { code: ErrorCode.NSERR_ENTITYEXISTED });
            }

            const jwt = req.headers.authorization;
            this.logger.Info({ path: 'Entity.controller.ts', resource: 'create:jwt', mess: jwt });

            this.logger.Info({ path: 'Entity.controller.ts', resource: 'create:verify:timer:start', mess: Date.now() });
            const typeVerification = await this.entityType.verify(param.appCode, param.typeCode, jwt);
            this.logger.Info({ path: 'Entity.controller.ts', resource: 'create:verify:timer:stop', mess: Date.now() });
            this.logger.Info({ path: 'Entity.controller.ts', resource: 'create:typeVerification', mess: typeVerification });

            if (!typeVerification) {
                this.logger.Error({ path: 'Entity.controller.ts', resource: 'create:typeVerification', mess: ErrorCode.NSERR_ENTITYUNREGISTEREDAPP });
                return this.responser.Unauthorized(res, {
                    code: ErrorCode.NSERR_ENTITYUNREGISTEREDAPP,
                });
            }

            let entityInfo: TEntityType | undefined;

            if (typeof param?.parentId !== 'undefined' && param?.parentId !== '' && param?.parentId !== null) {
                this.logger.Info({ path: 'Entity.controller.ts', resource: 'create:info:timer:start', mess: Date.now() });
                entityInfo = await this.entityType.info(param.typeCode, jwt);
                this.logger.Info({ path: 'Entity.controller.ts', resource: 'create:info:timer:stop', mess: Date.now() });

                this.logger.Info({ path: 'Entity.controller.ts', resource: 'create:entityInfo', mess: JSON.stringify(entityInfo) });
            } else {
                this.logger.Info({ path: 'Entity.controller.ts', resource: 'create:get:timer:start', mess: Date.now() });
                entityInfo = await this.entity.get(param.id, jwt);
                this.logger.Info({ path: 'Entity.controller.ts', resource: 'create:get:timer:stop', mess: Date.now() });

                this.logger.Info({ path: 'Entity.controller.ts', resource: 'create:entityInfo', mess: JSON.stringify(entityInfo) });

                this.logger.Info({ path: 'Entity.controller.ts', resource: 'create:token:timer:start', mess: Date.now() });
                const entityToken = await this.entity.token(param.id);
                this.logger.Info({ path: 'Entity.controller.ts', resource: 'create:token:timer:stop', mess: Date.now() });

                // this.logger.Info({ path: 'Entity.controller.ts', resource: 'create:entityToken', mess: entityToken });

                if (entityInfo?.status !== 'active') {
                    this.logger.Error({ path: 'Entity.controller.ts', resource: 'create:active', mess: ErrorCode.NSERR_ENTITYINACTIVE });
                    return this.responser.BadRequest(res, { code: ErrorCode.NSERR_ENTITYINACTIVE });
                }

                this.logger.Info({ path: 'Entity.controller.ts', resource: 'create:paramToken', mess: param.token });
                this.logger.Info({ path: 'Entity.controller.ts', resource: 'create:etcdToken', mess: entityToken });
                this.logger.Info({ path: 'Entity.controller.ts', resource: 'create:typeof:paramToken', mess: typeof param.token });
                this.logger.Info({ path: 'Entity.controller.ts', resource: 'create:typeof:etcdToken', mess: typeof entityToken });
                this.logger.Info({
                    path: 'Entity.controller.ts',
                    resource: 'create:compareToken',
                    mess:
                        (param.token === '' && typeof entityToken !== 'undefined' && entityToken !== '') ||
                        (typeof param.token !== 'undefined' && param.token !== '' && param.token?.toString?.() !== entityToken?.toString?.()),
                });

                if (
                    (param.token === '' && typeof entityToken !== 'undefined' && entityToken !== '') ||
                    (typeof param.token !== 'undefined' && param.token !== '' && param.token?.toString?.() !== entityToken?.toString?.())
                ) {
                    this.logger.Error({ path: 'Entity.controller.ts', resource: 'create:token', mess: ErrorCode.NSERR_ENTITYPAIRINGTOKENNOTMATCH });
                    return this.responser.BadRequest(res, { code: ErrorCode.NSERR_ENTITYPAIRINGTOKENNOTMATCH });
                }
            }

            if (typeof entityInfo === 'undefined') {
                this.logger.Error({ path: 'Entity.controller.ts', resource: 'create:entityInfo', mess: ErrorCode.NSERR_ENTITYINFONOTFOUND });
                return this.responser.BadRequest(res, { code: ErrorCode.NSERR_ENTITYINFONOTFOUND });
            }

            if (entityInfo?.typeCode !== param.typeCode) {
                this.logger.Error({ path: 'Entity.controller.ts', resource: 'create:typeCode', mess: ErrorCode.NSERR_ENTITYTYPENOTMATCH });
                return this.responser.BadRequest(res, { code: ErrorCode.NSERR_ENTITYTYPENOTMATCH });
            }

            const nowTimeStamp = this.timestamp.convert(Date.now());
            const entityTmp = {
                id: param.id,
                name: param.name,
                userId: param.userId,
                homeId: param.homeId,
                areaId: param.areaId,
                parentId: param.parentId,
                mac: entityInfo?.mac,
                typeId: entityInfo?.typeId,
                typeCode: entityInfo?.typeCode,
                typeName: entityInfo?.typeName,
                categoryId: entityInfo?.catId,
                categoryName: entityInfo?.catName,
                familyId: entityInfo?.familyId,
                familyName: entityInfo?.familyName,
                connectionId: entityInfo?.connectionId,
                connectionName: entityInfo?.connectionName,
                vendorId: entityInfo?.vendorId,
                vendorName: entityInfo?.vendorName,
                appCode: param.appCode,
                extra: param.extra,
                logo: param.logo,
                position: param.pos,
            };

            this.logger.Info({ path: 'Entity.controller.ts', resource: 'create:entityTmp', mess: JSON.stringify(entityTmp) });

            const queryBuilder = connection.createQueryBuilder(queryRunner);
            // let isLocked = false;
            // while (!isLocked) {
            //     isLocked = await this.entity.lock(lockResource);
            //     await new Promise((resolve) => setTimeout(resolve, 1000));
            // }

            await queryBuilder
                .insert()
                .into(Device)
                .values({
                    ...entityTmp,
                    createdAt: nowTimeStamp,
                    createdBy: param.userId,
                })
                .execute();

            const isHC =
                entityTmp.familyName?.toLowerCase?.()?.replace(/\s/g, '') === 'hc' ||
                entityTmp.familyName?.toLowerCase?.()?.replace(/\s/g, '') === 'homecontroller';

            this.logger.Info({ path: 'Entity.controller.ts', resource: 'create:isHC', mess: isHC });
            if (isHC) {
                await queryBuilder
                    .update(HomeStatistical)
                    .set({
                        cHC: () => 'cHC + 1',
                        updatedAt: nowTimeStamp,
                        updatedBy: param.userId,
                    })
                    .where('homeId = :homeId', { homeId: param.homeId })
                    .andWhere('userId = :userId', { userId: param.userId })
                    .andWhere('appCode = :appCode', { appCode: param.appCode })
                    .execute();
            } else {
                await queryBuilder
                    .update(HomeStatistical)
                    .set({
                        cEntities: () => 'cEntities + 1',
                        updatedAt: nowTimeStamp,
                        updatedBy: param.userId,
                    })
                    .where('homeId = :homeId', { homeId: param.homeId })
                    .andWhere('userId = :userId', { userId: param.userId })
                    .andWhere('appCode = :appCode', { appCode: param.appCode })
                    .execute();
            }

            if (typeof param?.areaId !== 'undefined' && param?.areaId !== null && param?.areaId !== '') {
                if (isHC) {
                    await queryBuilder
                        .update(AreaStatistical)
                        .set({
                            cHC: () => 'cHC+1',
                            updatedAt: nowTimeStamp,
                            updatedBy: param.userId,
                        })
                        .where('id = :areaId', { areaId: param.areaId })
                        .andWhere('appCode = :appCode', { appCode: param.appCode })
                        .execute();
                } else {
                    await queryBuilder
                        .update(AreaStatistical)
                        .set({
                            cEntities: () => 'cEntities+1',
                            updatedAt: nowTimeStamp,
                            updatedBy: param.userId,
                        })
                        .where('id = :areaId', { areaId: param.areaId })
                        .andWhere('appCode = :appCode', { appCode: param.appCode })
                        .execute();
                }
            }

            const member = await queryRunner.manager.getRepository(User).createQueryBuilder('user').where('user.id = :id', { id: param.userId }).getOne();
            this.logger.Info({ path: 'Entity.controller.ts', resource: 'create:member', mess: JSON.stringify(member) });

            this.logger.Info({ path: 'Entity.controller.ts', resource: 'create:assign:timer:start', mess: Date.now() });
            const assignPolicy = await this.policy.assign({
                action: '*',
                resource: entityTmp.id,
                service: 'device',
                email: String(member?.email),
                jwt,
                appCode: param.appCode,
            });
            this.logger.Info({ path: 'Entity.controller.ts', resource: 'create:assign:timer:stop', mess: Date.now() });
            this.logger.Info({ path: 'Entity.controller.ts', resource: 'create:assignPolicy', mess: assignPolicy });

            if (homeDetail && homeDetail.isOwner !== true) {
                const homeOwner = await queryRunner.manager
                    .getRepository(Home)
                    .createQueryBuilder('home')
                    .where('home.id = :id', { id: param.homeId })
                    .andWhere('home.isOwner = :isOwner', { isOwner: true })
                    .andWhere('home.appCode = :appCode', { appCode: param.appCode })
                    .getOne();

                this.logger.Info({ path: 'Entity.controller.ts', resource: 'create:homeOwner', mess: JSON.stringify(homeOwner) });
                const owner = await getRepository(User).createQueryBuilder('user').where('user.id = :id', { id: homeOwner?.id }).getOne();

                await queryBuilder
                    .insert()
                    .into(Device)
                    .values({
                        ...entityTmp,
                        userId: homeOwner?.userId,
                        areaId: '',
                        createdAt: nowTimeStamp,
                        createdBy: param.userId,
                    })
                    .execute();

                if (isHC) {
                    await queryBuilder
                        .update(HomeStatistical)
                        .set({
                            cHC: () => 'cHC + 1',
                            updatedAt: nowTimeStamp,
                            updatedBy: param.userId,
                        })
                        .where('homeId = :homeId', { homeId: param.homeId })
                        .andWhere('userId = :userId', { userId: homeOwner?.userId })
                        .andWhere('appCode = :appCode', { appCode: param.appCode })
                        .execute();
                } else {
                    await queryBuilder
                        .update(HomeStatistical)
                        .set({
                            cEntities: () => 'cEntities + 1',
                            updatedAt: nowTimeStamp,
                            updatedBy: param.userId,
                        })
                        .where('homeId = :homeId', { homeId: param.homeId })
                        .andWhere('userId = :userId', { userId: homeOwner?.userId })
                        .andWhere('appCode = :appCode', { appCode: param.appCode })
                        .execute();
                }

                this.logger.Info({ path: 'Entity.controller.ts', resource: 'create:assign:timer:start', mess: Date.now() });
                const assignPolicy = await this.policy.assign({
                    action: '*',
                    resource: entityTmp.id,
                    service: 'device',
                    email: String(owner?.email),
                    jwt,
                    appCode: param.appCode,
                });
                this.logger.Info({ path: 'Entity.controller.ts', resource: 'create:assign:timer:stop', mess: Date.now() });
                this.logger.Info({ path: 'Entity.controller.ts', resource: 'create:assignPolicy', mess: assignPolicy });
            }
            await queryRunner.commitTransaction();
            return this.responser.Created(res, { message: 'done', data: { ...entityTmp } });
        } catch (err) {
            await queryRunner.rollbackTransaction();
            return this.responser.BadRequest(res, { message: err });
        } finally {
            await queryRunner.release();
            await this.semaphore.release(lockResource);
        }
    };
    /**
     * ## Share entities
     *
     * ### The request api:
     * ### <span style="background-color:#49cc90; padding: 2px 15px; border-radius: 5px; color: white">POST</span> /home/v1/entity/share
     *
     * - **Note:** The parameter will be sent in the body of request
     * - **Note:** Need to be set the `DEBUG_LEVEL` to `debug` in **.env** file for using `ILogger`
     *
     * @param req - the request delegate of client
     * `req` will be include a limited fields
     *
     * |Parameters|Requried/Optional|Type|Detail|
     * |----------|-----------------|----|------|
     * |ids | required | [...nvarchar(128)] | The list of id of the entity will be in <a href="https://en.wikipedia.org/wiki/Universally_unique_identifier" target="_blank">uuid_v4</a> format|
     * |homeId | required | nvarchar(128) | The home id of the entity will be in <a href="https://en.wikipedia.org/wiki/Universally_unique_identifier" target="_blank">uuid_v4</a> format|
     * |memberId | required | nvarchar(128) | The member id will be in <a href="https://en.wikipedia.org/wiki/Universally_unique_identifier" target="_blank">uuid_v4</a> format|
     * |appCode | required | nvarchar(256) | The app name of the application that need to be shared|
     *
     * @param res - the response delegate of client
     *
     * @returns
     *
     * - Response `HTTP Code` to client as follow
     *
     * |Code|Detail|
     * |----|------|
     * |<span style="color:green">200</span> | Return a successful message|
     * |<span style="color:red">400</span> | Occur if an exception has been raised |
     * |<span style="color:red">401</span> | Occur if don't have permission to create area |
     * |<span style="color:red">404</span> | Occur if the dependencies data could not be found |
     * |<span style="color:red">406</span> | Occur if one of the field in request is not acceptable |
     *
     * - Response will be in the format as the below
     *
     * ```json
     * {
     *      message: ''
     * }
     * ```
     *
     * - response detail
     *
     * |Parameters|Type|Detail|
     * |----------|----|------|
     * |message | string | The message will be responsed to client|
     *
     *
     */
    share = async (req: Request, res: Response): Promise<void> => {
        try {
            const param = req.body;
            const homeDetail = await getRepository(Home)
                .createQueryBuilder('home')
                .where('home.id = :homeId', { homeId: param.homeId })
                .andWhere('home.userId = :userId', { userId: param.userId })
                .andWhere('home.appCode = :appCode', { appCode: param.appCode })
                .getOne();

            this.logger.Info({ path: 'Entity.controller.ts', resource: 'share:homeDetail', mess: JSON.stringify(homeDetail) });

            if (typeof homeDetail === 'undefined') {
                this.logger.Error({ path: 'Entity.controller.ts', resource: 'share:homeDetail', mess: ErrorCode.NSERR_HOMENOTFOUND });
                return this.responser.NotFound(res, { code: ErrorCode.NSERR_HOMENOTFOUND });
            }
            if (homeDetail && homeDetail.isOwner !== true) {
                this.logger.Error({ path: 'Entity.controller.ts', resource: 'share:isOwner', mess: ErrorCode.NSERR_UNAUTHORIZED });
                return this.responser.Unauthorized(res, { code: ErrorCode.NSERR_UNAUTHORIZED });
            }

            const existedMember: Member | undefined = await getRepository(Member)
                .createQueryBuilder('member')
                .where('member.id = :memberId', { memberId: param.memberId })
                .andWhere('member.homeId = :homeId', { homeId: param.homeId })
                .andWhere('member.appCode = :appCode', { appCode: param.appCode })
                .getOne();

            this.logger.Info({ path: 'Entity.controller.ts', resource: 'share:existedMember', mess: JSON.stringify(existedMember) });

            if (typeof existedMember === 'undefined') {
                this.logger.Error({ path: 'Entity.controller.ts', resource: 'share:existedMember', mess: ErrorCode.NSERR_MEMBERNOTFOUND });
                return this.responser.NotFound(res, { code: ErrorCode.NSERR_MEMBERNOTFOUND });
            }

            const jwt = req.headers.authorization;
            let results: any = {};

            await Promise.all(
                param?.ids?.map(async (id) => {
                    const existedDevice = await getRepository(Device)
                        .createQueryBuilder('device')
                        .where('device.id = :id', { id: id })
                        .andWhere('device.userId = :userId', { userId: param.userId })
                        .andWhere('device.appCode = :appCode', { appCode: param.appCode })
                        .getOne();

                    this.logger.Info({ path: 'Entity.controller.ts', resource: 'share:device:existedDevice', mess: JSON.stringify(existedDevice) });

                    results[id] = {
                        id,
                        name: existedDevice?.name,
                    };

                    if (typeof existedDevice === 'undefined') {
                        results[id] = {
                            ...(results[id] || {}),
                            shared: false,
                            code: ErrorCode.NSERR_ENTITYNOTFOUND,
                        };
                        return;
                    }

                    const existedSharing = await getRepository(Device)
                        .createQueryBuilder('device')
                        .where('device.id = :id', { id: id })
                        .andWhere('device.userId = :memberId', { memberId: param.memberId })
                        .andWhere('device.appCode = :appCode', { appCode: param.appCode })
                        .getOne();

                    this.logger.Info({ path: 'Entity.controller.ts', resource: 'share:device:existedSharing', mess: JSON.stringify(existedSharing) });

                    if (typeof existedSharing !== 'undefined') {
                        results[id] = {
                            ...(results[id] || {}),
                            shared: false,
                            code: ErrorCode.NSERR_ENTITYSHARED,
                        };

                        return;
                    }

                    const lockResource = `/home/${param.userId}/${param.homeId}/${param.appCode}/shareEntity`;
                    await this.semaphore.acquire(lockResource);
                    const connection = getConnection();
                    const queryRunner = connection.createQueryRunner();
                    await queryRunner.connect();
                    await queryRunner.startTransaction();
                    try {
                        const queryBuilder = connection.createQueryBuilder(queryRunner);
                        const nowTimeStamp = this.timestamp.convert(Date.now());

                        await queryBuilder
                            .insert()
                            .into(Device)
                            .values({
                                ...existedDevice,
                                userId: existedMember.id,
                                areaId: '',
                                createdAt: nowTimeStamp,
                                createdBy: param.userId,
                            })
                            .execute();

                        const isHomeController: boolean =
                            existedDevice.familyName?.toLowerCase?.()?.replace(/\s/g, '') === 'hc' ||
                            existedDevice.familyName?.toLowerCase?.()?.replace(/\s/g, '') === 'homecontroller';

                        this.logger.Info({ path: 'Entity.controller.ts', resource: 'share:device:isHomeController', mess: isHomeController });

                        this.logger.Info({ path: 'Entity.controller.ts', resource: 'create:assign:timer:start', mess: Date.now() });
                        let assignPolicy = await this.policy.assign({
                            action: 'control',
                            resource: results[id].id,
                            service: 'device',
                            email: existedMember.email,
                            jwt,
                            appCode: param.appCode,
                        });
                        this.logger.Info({ path: 'Entity.controller.ts', resource: 'create:assign:timer:stop', mess: Date.now() });
                        this.logger.Info({ path: 'Entity.controller.ts', resource: 'create:assignPolicy', mess: assignPolicy });

                        if (isHomeController) {
                            await queryBuilder
                                .update(HomeStatistical)
                                .set({
                                    cHC: () => 'cHC + 1',
                                    updatedAt: nowTimeStamp,
                                    updatedBy: param?.userId,
                                })
                                .where('homeId = :homeId', { homeId: param.homeId })
                                .andWhere('userId = :userId', { userId: existedMember.id })
                                .andWhere('appCode = :appCode', { appCode: param.appCode })
                                .execute();
                        } else {
                            await queryBuilder
                                .update(HomeStatistical)
                                .set({
                                    cEntities: () => 'cEntities + 1',
                                    updatedAt: nowTimeStamp,
                                    updatedBy: param?.userId,
                                })
                                .where('homeId = :homeId', { homeId: param.homeId })
                                .andWhere('userId = :userId', { userId: existedMember.id })
                                .andWhere('appCode = :appCode', { appCode: param.appCode })
                                .execute();

                            if (existedDevice.parentId !== null && typeof existedDevice.parentId !== 'undefined' && existedDevice.parentId !== '') {
                                const resultHC = results[existedDevice.parentId];
                                // -> Nếu chưa share hoặc lần trước share bị lỗi thì share lại
                                if (typeof resultHC === 'undefined' || !resultHC?.shared) {
                                    const existedHomeController = await getRepository(Device)
                                        .createQueryBuilder('device')
                                        .where('device.id = :id', { id: existedDevice.parentId })
                                        .andWhere('device.userId = :userId', { userId: param.userId })
                                        .andWhere('device.appCode = :appCode', { appCode: param.appCode })
                                        .getOne();

                                    this.logger.Info({
                                        path: 'Entity.controller.ts',
                                        resource: 'share:device:existedHomeController',
                                        mess: JSON.stringify(existedHomeController),
                                    });

                                    results[existedDevice.parentId] = {
                                        id: existedDevice?.parentId,
                                        name: existedHomeController?.name,
                                    };

                                    let isHCFalse = false;

                                    if (typeof existedHomeController === 'undefined') {
                                        isHCFalse = true;
                                        results[existedDevice.parentId] = {
                                            ...(results[existedDevice.parentId] || {}),
                                            shared: false,
                                            code: ErrorCode.NSERR_ENTITYNOTFOUND,
                                        };
                                    }

                                    const existedHomeControllerSharing = await getRepository(Device)
                                        .createQueryBuilder('device')
                                        .where('device.id = :id', { id: existedDevice.parentId })
                                        .andWhere('device.userId = :memberId', { memberId: param.memberId })
                                        .andWhere('device.appCode = :appCode', { appCode: param.appCode })
                                        .getOne();

                                    this.logger.Info({
                                        path: 'Entity.controller.ts',
                                        resource: 'share:device:existedHomeControllerSharing',
                                        mess: JSON.stringify(existedHomeControllerSharing),
                                    });

                                    if (typeof existedHomeControllerSharing !== 'undefined') {
                                        isHCFalse = true;
                                        results[existedDevice.id] = {
                                            ...(results[existedDevice.id] || {}),
                                            shared: false,
                                            code: ErrorCode.NSERR_ENTITYSHARED,
                                        };
                                    }

                                    if (!isHCFalse) {
                                        await queryBuilder
                                            .insert()
                                            .into(Device)
                                            .values({
                                                ...existedHomeController,
                                                userId: existedMember.id,
                                                areaId: '',
                                                createdAt: nowTimeStamp,
                                                createdBy: param.userId,
                                            })
                                            .execute();

                                        await queryBuilder
                                            .update(HomeStatistical)
                                            .set({
                                                cHC: () => 'cHC + 1',
                                                updatedAt: nowTimeStamp,
                                                updatedBy: param?.userId,
                                            })
                                            .where('homeId = :homeId', { homeId: param.homeId })
                                            .andWhere('userId = :userId', { userId: existedMember.id })
                                            .andWhere('appCode = :appCode', { appCode: param.appCode })
                                            .execute();

                                        this.logger.Info({ path: 'Entity.controller.ts', resource: 'share:assignPolicy:timer:start', mess: Date.now() });
                                        const assignPolicy = await this.policy.assign({
                                            action: '*',
                                            resource: existedHomeController?.id || '',
                                            service: 'device',
                                            email: existedMember.email,
                                            jwt,
                                            appCode: param.appCode,
                                        });
                                        this.logger.Info({ path: 'Entity.controller.ts', resource: 'share:assignPolicy:timer:stop', mess: Date.now() });
                                        this.logger.Info({ path: 'Entity.controller.ts', resource: 'share:assignPolicy', mess: assignPolicy });
                                    }
                                }
                            }
                        }

                        await queryRunner.commitTransaction();
                        results[id] = {
                            shared: true,
                            ...(results[id] || {}),
                            message: 'done',
                        };

                        results[existedDevice.parentId] = {
                            ...(results[existedDevice.parentId] || {}),
                            shared: true,
                            message: 'done',
                        };

                        this.logger.Info({ path: 'Entity.controller.ts', resource: 'create:assign:timer:start', mess: Date.now() });
                        assignPolicy = await this.policy.assign({
                            action: 'control',
                            resource: results[id].id,
                            service: 'device',
                            email: existedMember.email,
                            jwt,
                            appCode: param.appCode,
                        });
                        this.logger.Info({ path: 'Entity.controller.ts', resource: 'create:assign:timer:stop', mess: Date.now() });
                        this.logger.Info({ path: 'Entity.controller.ts', resource: 'create:assignPolicy', mess: assignPolicy });
                    } catch (error) {
                        this.logger.Error({ path: 'Entity.controller.ts', resource: 'share:device:catch', mess: error });
                        results[id] = {
                            ...(results[id] || {}),
                            shared: false,
                            message: error,
                            code: ErrorCode.NSERR_UNKNOWN,
                        };

                        results[existedDevice.parentId] = {
                            ...(results[existedDevice.parentId] || {}),
                            shared: false,
                            message: error,
                            code: ErrorCode.NSERR_UNKNOWN,
                        };
                        await queryRunner.rollbackTransaction();
                    } finally {
                        await queryRunner.release();
                        await this.semaphore.release(lockResource);
                    }
                }),
            );
            return this.responser.Ok(res, { message: 'done', data: Object.values(results || {}) || [] });
        } catch (error) {
            this.logger.Error({ path: 'Entity.controller.ts', resource: 'share:catch', mess: error });
            return this.responser.BadRequest(res, { message: error });
        }
    };
    /**
     * ## Unshare entities
     *
     * ### The request api:
     * ### <span style="background-color:#49cc90; padding: 2px 15px; border-radius: 5px; color: white">POST</span> /home/v1/entity/unshare
     *
     * - **Note:** The parameter will be sent in the body of request
     * - **Note:** Need to be set the `DEBUG_LEVEL` to `debug` in **.env** file for using `ILogger`
     *
     * @param req - the request delegate of client
     * `req` will be include a limited fields
     *
     * |Parameters|Requried/Optional|Type|Detail|
     * |----------|-----------------|----|------|
     * |ids | required | [...nvarchar(128)] | The list of id of the entity will be in <a href="https://en.wikipedia.org/wiki/Universally_unique_identifier" target="_blank">uuid_v4</a> format|
     * |homeId | required | nvarchar(128) | The home id of the entity will be in <a href="https://en.wikipedia.org/wiki/Universally_unique_identifier" target="_blank">uuid_v4</a> format|
     * |memberId | required | nvarchar(128) | The member id will be in <a href="https://en.wikipedia.org/wiki/Universally_unique_identifier" target="_blank">uuid_v4</a> format|
     * |appCode | required | nvarchar(256) | The app name of the application that need to be unshared|
     *
     * @param res - the response delegate of client
     *
     * @returns
     *
     * - Response `HTTP Code` to client as follow
     *
     * |Code|Detail|
     * |----|------|
     * |<span style="color:green">200</span> | Return a successful message|
     * |<span style="color:red">400</span> | Occur if an exception has been raised |
     * |<span style="color:red">401</span> | Occur if don't have permission to create area |
     * |<span style="color:red">404</span> | Occur if the dependencies data could not be found |
     * |<span style="color:red">406</span> | Occur if one of the field in request is not acceptable |
     *
     * - Response will be in the format as the below
     *
     * ```json
     * {
     *      message: ''
     * }
     * ```
     *
     * - response detail
     *
     * |Parameters|Type|Detail|
     * |----------|----|------|
     * |message | string | The message will be responsed to client|
     *
     *
     */
    unshare = async (req: Request, res: Response): Promise<void> => {
        try {
            const param = req.body;
            const homeDetail = await getRepository(Home)
                .createQueryBuilder('home')
                .where('home.id = :homeId', { homeId: param.homeId })
                .andWhere('home.userId = :userId', { userId: param.userId })
                .andWhere('home.appCode = :appCode', { appCode: param.appCode })
                .getOne();

            this.logger.Info({ path: 'Entity.controller.ts', resource: 'unshare:homeDetail', mess: JSON.stringify(homeDetail) });

            if (typeof homeDetail === 'undefined') {
                this.logger.Error({ path: 'Entity.controller.ts', resource: 'unshare:homeDetail', mess: ErrorCode.NSERR_HOMENOTFOUND });
                return this.responser.NotFound(res, { code: ErrorCode.NSERR_HOMENOTFOUND });
            }
            if (homeDetail && homeDetail.isOwner !== true) {
                this.logger.Error({ path: 'Entity.controller.ts', resource: 'unshare:isOwner', mess: ErrorCode.NSERR_UNAUTHORIZED });
                return this.responser.Unauthorized(res, { code: ErrorCode.NSERR_UNAUTHORIZED });
            }

            const existedMember: Member | undefined = await getRepository(Member)
                .createQueryBuilder('member')
                .where('member.id = :memberId', { memberId: param.memberId })
                .andWhere('member.homeId = :homeId', { homeId: param.homeId })
                .andWhere('member.appCode = :appCode', { appCode: param.appCode })
                .getOne();

            this.logger.Info({ path: 'Entity.controller.ts', resource: 'unshare:existedMember', mess: JSON.stringify(existedMember) });

            if (typeof existedMember === 'undefined') {
                this.logger.Error({ path: 'Entity.controller.ts', resource: 'unshare:existedMember', mess: ErrorCode.NSERR_MEMBERNOTFOUND });
                return this.responser.NotFound(res, { code: ErrorCode.NSERR_MEMBERNOTFOUND });
            }

            const jwt = req.headers.authorization;
            let results: any = {};

            await Promise.all(
                param?.ids?.map(async (id) => {
                    const deviceResult = results[id];

                    this.logger.Info({ path: 'Entity.controller.ts', resource: 'unshare:device:deviceResult', mess: JSON.stringify(deviceResult) });
                    // -> Nếu device đã được unshare do unshare hc từ trước thì bỏ qua.
                    if (deviceResult && typeof deviceResult !== 'undefined' && deviceResult?.unshared) {
                        return;
                    }

                    const existedDevice = await getRepository(Device)
                        .createQueryBuilder('device')
                        .where('device.id = :id', { id: id })
                        .andWhere('device.userId = :userId', { userId: param.userId })
                        .andWhere('device.appCode = :appCode', { appCode: param.appCode })
                        .getOne();

                    this.logger.Info({ path: 'Entity.controller.ts', resource: 'unshare:device:existedDevice', mess: JSON.stringify(existedDevice) });

                    results[id] = {
                        id,
                        name: existedDevice?.name,
                    };

                    if (typeof existedDevice === 'undefined') {
                        results[id] = {
                            ...results[id],
                            unshared: false,
                            code: ErrorCode.NSERR_ENTITYNOTFOUND,
                        };
                        return;
                    }

                    const existedSharing = await getRepository(Device)
                        .createQueryBuilder('device')
                        .where('device.id = :id', { id: id })
                        .andWhere('device.userId = :memberId', { memberId: param.memberId })
                        .andWhere('device.appCode = :appCode', { appCode: param.appCode })
                        .getOne();

                    this.logger.Info({ path: 'Entity.controller.ts', resource: 'unshare:device:existedSharing', mess: JSON.stringify(existedSharing) });

                    if (typeof existedSharing === 'undefined') {
                        results[id] = {
                            ...results[id],
                            unshared: false,
                            code: ErrorCode.NSERR_ENTITYUNSHARED,
                        };
                        return;
                    }

                    const isHomeController =
                        existedDevice.familyName?.toLowerCase?.()?.replace(/\s/g, '') === 'hc' ||
                        existedDevice.familyName?.toLowerCase?.()?.replace(/\s/g, '') === 'homecontroller';

                    this.logger.Info({ path: 'Entity.controller.ts', resource: 'unshare:device:isHomeController', mess: isHomeController });

                    let subDevices: Device[] = [];
                    let countSubDevices: number = 0;

                    if (isHomeController) {
                        // -> Nếu device là HC thì lấy ra danh sách thiết bị con của nó trong nhà member
                        subDevices = await getRepository(Device)
                            .createQueryBuilder('device')
                            .where('device.parentId = :id', { id: existedDevice.id })
                            .andWhere('device.userId = :memberId', { memberId: param.memberId })
                            .andWhere('device.appCode = :appCode', { appCode: param.appCode })
                            .getMany();

                        this.logger.Info({ path: 'Entity.controller.ts', resource: 'unshare:device:subDevices', mess: JSON.stringify(subDevices) });

                        countSubDevices = subDevices.length;
                    }

                    const lockResource = `/home/${param.userId}/${param.homeId}/${param.appCode}/unshareEntity`;
                    await this.semaphore.acquire(lockResource);
                    const connection = getConnection();
                    const queryRunner = connection.createQueryRunner();
                    await queryRunner.connect();
                    await queryRunner.startTransaction();
                    try {
                        const nowTimeStamp = this.timestamp.convert(Date.now());
                        const queryBuilder = connection.createQueryBuilder(queryRunner);
                        await queryBuilder
                            .delete()
                            .from(Device)
                            .where('id = :id', { id: id })
                            .andWhere('userId = :memberId', { memberId: param.memberId })
                            .andWhere('appCode = :appCode', { appCode: param.appCode })
                            .execute();

                        this.logger.Info({ path: 'Entity.controller.ts', resource: 'unshare:unassignPolicy:timer:start', mess: Date.now() });
                        const unassignPolicy = await this.policy.unassign({
                            action: '*',
                            resource: id,
                            service: 'device',
                            userId: param.memberId,
                            jwt,
                            appCode: param.appCode,
                        });
                        this.logger.Info({ path: 'Entity.controller.ts', resource: 'unshare:unassignPolicy:timer:stop', mess: Date.now() });
                        this.logger.Info({ path: 'Entity.controller.ts', resource: 'unshare:assignPolicy', mess: unassignPolicy });

                        if (isHomeController) {
                            const areaGroupBy = await getRepository(Device)
                                .createQueryBuilder('device')
                                .where('device.parentId = :id', { id: existedDevice.id })
                                .andWhere('device.userId = :memberId', { memberId: param.memberId })
                                .andWhere('device.appCode = :appCode', { appCode: param.appCode })
                                .andWhere(`device.areaId != ''`)
                                .groupBy('device.areaId')
                                .addGroupBy('device.userId')
                                .addGroupBy('device.homeId')
                                .select(['device.userId AS userid', 'device.homeId as homeid', 'device.areaId AS areaid', 'COUNT(device.areaId) AS areacount'])
                                .getRawMany();

                            this.logger.Info({ path: 'Entity.controller.ts', resource: 'unshare:device:areaGroupBy', mess: JSON.stringify(areaGroupBy) });

                            await Promise.all(
                                areaGroupBy?.map?.(async (area) => {
                                    await queryBuilder
                                        .update(AreaStatistical)
                                        .set({
                                            cEntities: () => `cEntities - ${area.areacount}`,
                                            updatedAt: nowTimeStamp,
                                            updatedBy: param.userId,
                                        })
                                        .where('id = :id', { id: area.areaid })
                                        .andWhere('userId = :userid', { userid: area.userid })
                                        .andWhere('homeId = :homeid', { homeid: area.homeid })
                                        .execute();
                                }),
                            );

                            await queryBuilder
                                .delete()
                                .from(Device)
                                .where('parentId = :id', { id })
                                .andWhere('homeId = :homeId', { homeId: param.homeId })
                                .andWhere('userId = :memberId', { memberId: param.memberId })
                                .andWhere('appCode = :appCode', { appCode: param.appCode })
                                .execute();

                            await queryBuilder
                                .delete()
                                .from(Device)
                                .where('id = :id', { id: existedDevice.id })
                                .andWhere('homeId = :homeId', { homeId: param.homeId })
                                .andWhere('userId = :memberId', { memberId: param.memberId })
                                .andWhere('appCode = :appCode', { appCode: param.appCode })
                                .execute();

                            await queryBuilder
                                .update(HomeStatistical)
                                .set({
                                    cHC: () => 'cHC - 1',
                                    updatedAt: nowTimeStamp,
                                    updatedBy: param?.userId,
                                })
                                .where('homeId = :homeId', { homeId: param.homeId })
                                .andWhere('userId = :memberId', { memberId: param.memberId })
                                .andWhere('appCode = :appCode', { appCode: param.appCode })
                                .execute();

                            await queryBuilder
                                .update(HomeStatistical)
                                .set({
                                    cEntities: () => `cEntities - ${countSubDevices}`,
                                    updatedAt: nowTimeStamp,
                                    updatedBy: param?.userId,
                                })
                                .where('homeId = :homeId', { homeId: param.homeId })
                                .andWhere('userId = :memberId', { memberId: param.memberId })
                                .andWhere('appCode = :appCode', { appCode: param.appCode })
                                .execute();
                        } else {
                            await queryBuilder
                                .update(HomeStatistical)
                                .set({
                                    cEntities: () => 'cEntities - 1',
                                    updatedAt: nowTimeStamp,
                                    updatedBy: param?.userId,
                                })
                                .where('homeId = :homeId', { homeId: param.homeId })
                                .andWhere('userId = :memberId', { memberId: param.memberId })
                                .andWhere('appCode = :appCode', { appCode: param.appCode })
                                .execute();

                            if (typeof existedSharing?.areaId !== 'undefined' && existedSharing?.areaId !== null && existedSharing?.areaId !== '') {
                                await queryBuilder
                                    .update(AreaStatistical)
                                    .set({
                                        cEntities: () => 'cEntities - 1',
                                    })
                                    .where('id = :areaId', { areaId: existedSharing.areaId })
                                    .andWhere('appCode = :appCode', { appCode: param.appCode })
                                    .execute();
                            }
                            await queryBuilder
                                .delete()
                                .from(Device)
                                .where('id = :id', { id: existedDevice.id })
                                .andWhere('homeId = :homeId', { homeId: param.homeId })
                                .andWhere('userId = :memberId', { memberId: param.memberId })
                                .andWhere('appCode = :appCode', { appCode: param.appCode })
                                .execute();
                        }

                        await queryRunner.commitTransaction();
                        results[id] = {
                            ...results[id],
                            unshared: true,
                            message: 'done',
                        };

                        if (isHomeController) {
                            // -> Nếu transaction thành công thì tất cả thiết bị con đã được xoá -> update list results
                            await Promise.all(
                                subDevices?.map?.(async (device) => {
                                    this.logger.Info({
                                        path: 'Entity.controller.ts',
                                        resource: 'unshare:subDevices:unassignPolicy:timer:start',
                                        mess: Date.now(),
                                    });
                                    const unassignPolicy = await this.policy.unassign({
                                        action: '*',
                                        resource: device?.id,
                                        service: 'device',
                                        userId: param.memberId,
                                        jwt,
                                        appCode: param.appCode,
                                    });
                                    this.logger.Info({
                                        path: 'Entity.controller.ts',
                                        resource: 'unshare:subDevices:unassignPolicy:timer:stop',
                                        mess: Date.now(),
                                    });
                                    this.logger.Info({ path: 'Entity.controller.ts', resource: 'unshare:subDevices:assignPolicy', mess: unassignPolicy });
                                    results[device.id] = {
                                        id: device?.id,
                                        name: device?.name,
                                        message: 'done',
                                        unshare: true,
                                    };
                                }),
                            );
                        }
                    } catch (error) {
                        this.logger.Error({ path: 'Entity.controller.ts', resource: 'unshare:device:catch', mess: error });
                        await queryRunner.rollbackTransaction();
                        if (isHomeController) {
                            // -> Nếu transaction không thành công thì update lại list results
                            subDevices?.map?.((device) => {
                                results[device.id] = {
                                    id: device?.id,
                                    name: device?.name,
                                    unshare: false,
                                    code: ErrorCode.NSERR_UNKNOWN,
                                };
                            });
                        }
                    } finally {
                        await queryRunner.release();
                        await this.semaphore.release(lockResource);
                    }
                }),
            );
            return this.responser.Ok(res, { message: 'done', data: Object.values(results || {}) || [] });
        } catch (error) {
            this.logger.Error({ path: 'Entity.controller.ts', resource: 'unshare:catch', mess: error });
            return this.responser.BadRequest(res, { message: error });
        }
    };
    /**
     * ## Update an existed device that satisfy the input conditions
     *
     * ### The request api:
     * ### <span style="background-color:#fca130; padding: 2px 15px; border-radius: 5px; color: white">PUT</span> /home/v1/entity
     *
     * - **Note:** The parameter will be sent in the body of request
     * - **Note:** Need to be set the `DEBUG_LEVEL` to `debug` in **.env** file for using `ILogger`
     *
     * @param req - the request delegate of client
     * `req` will be include a limited fields
     *
     * |Parameters|Requried/Optional|Type|Detail|
     * |----------|-----------------|----|------|
     * |id | required | nvarchar(128) | The home id of the entity will be in <a href="https://en.wikipedia.org/wiki/Universally_unique_identifier" target="_blank">uuid_v4</a> format|
     * |appCode | required | nvarchar(256) | The app name of the application that need to be updated|
     * |homeId | required | nvarchar(128) | The home id of the entity will be in <a href="https://en.wikipedia.org/wiki/Universally_unique_identifier" target="_blank">uuid_v4</a> format|
     * |areaId | optional | nvarchar(128) | The area id of the entity will be in <a href="https://en.wikipedia.org/wiki/Universally_unique_identifier" target="_blank">uuid_v4</a> format|
     * |name | optional | nvarchar(256) | The name of the devices that need to be updated|
     * |logo | optional | nvarchar(128) | The name of the devices that need to be updated|
     * |pos | optional | integer(-1,1023) | The name of the devices that need to be updated|
     * |extra | any | any | The name of the devices that need to be updated|
     *
     * @param res - the response delegate of client
     *
     * @returns
     *
     * - Response `HTTP Code` to client as follow
     *
     * |Code|Detail|
     * |----|------|
     * |<span style="color:green">200</span> | Return a successful message|
     * |<span style="color:red">400</span> | Occur if an exception raised or nothing is changed |
     * |<span style="color:red">401</span> | Occur if don't have permission |
     * |<span style="color:red">404</span> | Occur if the area could not be found in the db |
     * |<span style="color:red">406</span> | Occur if one of the field in request is not acceptable |
     *
     * - Response will be in the format as the below
     *
     * ```json
     * {
     *      message: '',
     * }
     * ```
     * - response detail
     *
     * |Parameters|Type|Detail|
     * |----------|----|------|
     * |message | string | The message will be responsed to client|
     *
     */
    update = async (req: Request, res: Response): Promise<void> => {
        const param = req.body;
        const lockResource = `/home/${param.userId}/${param.homeId}/${param.appCode}/updateEntity`;
        await this.semaphore.acquire(lockResource);
        const connection = getConnection();
        const queryRunner = connection.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            let isChanged: boolean = false;
            let isAreaChanged: boolean = false;
            const existedDevice = await getRepository(Device)
                .createQueryBuilder('device')
                .where('device.id = :id', { id: param.id })
                .andWhere('device.homeId = :homeId', { homeId: param?.homeId })
                .andWhere('device.userId = :userId', { userId: param?.userId })
                .andWhere('device.appCode = :appCode', { appCode: param.appCode })
                .getOne();

            this.logger.Info({ path: 'Entity.controller.ts', resource: 'update:existedDevice', mess: JSON.stringify(existedDevice) });

            if (typeof existedDevice === 'undefined') {
                this.logger.Error({ path: 'Entity.controller.ts', resource: 'update:existedDevice', mess: ErrorCode.NSERR_ENTITYNOTFOUND });
                return this.responser.NotFound(res, { code: ErrorCode.NSERR_ENTITYNOTFOUND });
            }

            const oldArea = await getRepository(Area)
                .createQueryBuilder('area')
                .where('area.id = :id', { id: existedDevice!?.areaId })
                .andWhere('area.userId = :userId', { userId: param?.userId })
                .andWhere('area.appCode = :appCode', { appCode: param?.appCode })
                .getOne();

            this.logger.Info({ path: 'Entity.controller.ts', resource: 'update:oldArea', mess: JSON.stringify(oldArea) });

            let entityTmp = {
                id: existedDevice?.id,
                homeid: existedDevice?.homeId,
                userid: existedDevice?.userId,
                name: existedDevice?.name,
                areaid: existedDevice?.areaId,
                areaname: oldArea?.name,
                logo: existedDevice?.logo,
                pos: existedDevice?.position,
                typeid: existedDevice?.typeId,
                typecode: existedDevice?.typeCode,
                typename: existedDevice?.typeName,
                familyid: existedDevice?.familyId,
                familyname: existedDevice?.familyName,
                catid: existedDevice?.categoryId,
                catname: existedDevice?.categoryName,
                connectionid: existedDevice?.connectionId,
                connectionname: existedDevice?.connectionName,
                parentid: existedDevice?.parentId,
                vendorid: existedDevice?.vendorId,
                vendorname: existedDevice?.vendorName,
                extra: existedDevice?.extra,
                mac: existedDevice?.mac,
            };

            this.logger.Info({ path: 'Entity.controller.ts', resource: 'update:entityTmp', mess: JSON.stringify(entityTmp) });

            if (param.name && typeof param.name !== 'undefined' && param.name !== '' && existedDevice!?.name !== param.name) {
                isChanged = true;
                entityTmp.name = param.name;
            }

            if (typeof param.areaId !== 'undefined') {
                if (param.areaId !== '' && existedDevice!?.areaId !== param.areaId) {
                    entityTmp.areaname = '';
                    const existedArea: Area | undefined = await getRepository(Area)
                        .createQueryBuilder('area')
                        .where('area.id = :id', { id: param?.areaId })
                        .andWhere('area.homeId = :homeId', { homeId: param?.homeId })
                        .andWhere('area.userId = :userId', { userId: param?.userId })
                        .andWhere('area.appCode = :appCode', { appCode: param.appCode })
                        .getOne();

                    this.logger.Info({ path: 'Entity.controller.ts', resource: 'update:existedArea', mess: JSON.stringify(existedArea) });
                    if (typeof existedArea === 'undefined') {
                        this.logger.Error({ path: 'Entity.controller.ts', resource: 'update:existedArea', mess: ErrorCode.NSERR_AREANOTFOUND });
                        return this.responser.NotFound(res, { code: ErrorCode.NSERR_AREANOTFOUND });
                    }
                    entityTmp.areaname = existedArea.name;
                    entityTmp.areaid = param.areaId;
                    isChanged = true;
                    isAreaChanged = true;
                }
            }

            if (param.name && typeof param.name !== 'undefined' && param.name !== '' && existedDevice!?.name !== param.name) {
                isChanged = true;
                entityTmp.name = param.name;
            }

            if (param.logo && typeof param.logo !== 'undefined' && param.logo !== '' && existedDevice!?.logo !== param.logo) {
                isChanged = true;
                entityTmp.logo = param.logo;
            }

            if (param.pos && typeof param.pos !== 'undefined' && param.pos !== '' && existedDevice!?.position !== param.pos) {
                isChanged = true;
                entityTmp.pos = param.pos;
            }

            if (param.extra && typeof param.extra !== 'undefined' && param.extra !== '' && existedDevice!?.extra !== param.extra) {
                isChanged = true;
                entityTmp.extra = param.extra;
            }
            const nowTimeStamp = this.timestamp.convert(Date.now());
            const queryBuilder = connection.createQueryBuilder(queryRunner);
            if (isChanged) {
                await queryBuilder
                    .update(Device)
                    .set({
                        name: entityTmp.name,
                        areaId: entityTmp.areaid,
                        logo: entityTmp.logo,
                        position: entityTmp.pos,
                        extra: entityTmp.extra,
                        updatedAt: nowTimeStamp,
                        updatedBy: param.userId,
                    })
                    .where('id = :id', { id: param.id })
                    .andWhere('homeId = :homeId', { homeId: param.homeId })
                    .andWhere('userId = :userId', { userId: param.userId })
                    .andWhere('appCode = :appCode', { appCode: param.appCode })
                    .execute();

                const isHomeController: boolean =
                    existedDevice.familyName?.toLowerCase?.()?.replace(/\s/g, '') === 'hc' ||
                    existedDevice.familyName?.toLowerCase?.()?.replace(/\s/g, '') === 'homecontroller';

                this.logger.Info({ path: 'Entity.controller.ts', resource: 'update:isHomeController', mess: isHomeController });

                if (isAreaChanged) {
                    if (param.areaId !== '' && existedDevice!?.areaId !== param.areaId) {
                        if (isHomeController) {
                            await queryBuilder
                                .update(AreaStatistical)
                                .set({
                                    cHC: () => 'cHC + 1',
                                    updatedAt: nowTimeStamp,
                                    updatedBy: param?.userId,
                                })
                                .where('id = :areaId', { areaId: param.areaId })
                                .andWhere('appCode = :appCode', { appCode: param.appCode })
                                .execute();
                        } else {
                            await queryBuilder
                                .update(AreaStatistical)
                                .set({
                                    cEntities: () => 'cEntities + 1',
                                    updatedAt: nowTimeStamp,
                                    updatedBy: param?.userId,
                                })
                                .where('id = :areaId', { areaId: param.areaId })
                                .andWhere('appCode = :appCode', { appCode: param.appCode })
                                .execute();
                        }
                    }
                    if (isHomeController) {
                        await queryBuilder
                            .update(AreaStatistical)
                            .set({
                                cHC: () => 'cHC - 1',
                                updatedAt: nowTimeStamp,
                                updatedBy: param?.userId,
                            })
                            .where('id = :areaId', { areaId: existedDevice.areaId })
                            .andWhere('appCode = :appCode', { appCode: param.appCode })
                            .execute();
                    } else {
                        await queryBuilder
                            .update(AreaStatistical)
                            .set({
                                cEntities: () => 'cEntities - 1',
                                updatedAt: nowTimeStamp,
                                updatedBy: param?.userId,
                            })
                            .where('id = :areaId', { areaId: existedDevice.areaId })
                            .andWhere('appCode = :appCode', { appCode: param.appCode })
                            .execute();
                    }
                }
                await queryRunner.commitTransaction();
                return this.responser.Ok(res, { message: 'done', data: { ...entityTmp } });
            }
            return this.responser.BadRequest(res, { code: ErrorCode.NSERR_NOTHINGTOBECHANGED });
        } catch (err) {
            await queryRunner.rollbackTransaction();
            this.logger.Error({ path: 'Entity.controller.ts', resource: 'update:catch', mess: err });
            return this.responser.BadRequest(res, { message: err });
        } finally {
            await queryRunner.release();
            await this.semaphore.release(lockResource);
        }
    };
    /**
     * ## Delete an existed device that satisfy the input conditions
     *
     * ### The request api:
     * ### <span style="background-color:#f93e3e; padding: 2px 15px; border-radius: 5px; color: white">DELETE</span> /home/v1/entity
     *
     * - **Note:** The parameter will be sent in the body of request
     * - **Note:** Need to be set the `DEBUG_LEVEL` to `debug` in **.env** file for using `ILogger`
     *
     * @param req - the request delegate of client
     * `req` will be include a limited fields
     *
     * |Parameters|Requried/Optional|Type|Detail|
     * |----------|-----------------|----|------|
     * |id | required | nvarchar(128) | The home id of the entity will be in <a href="https://en.wikipedia.org/wiki/Universally_unique_identifier" target="_blank">uuid_v4</a> format|
     * |homeId | required | nvarchar(128) | The home id of the entity will be in <a href="https://en.wikipedia.org/wiki/Universally_unique_identifier" target="_blank">uuid_v4</a> format|
     * |appCode | required | nvarchar(256) | The app name of the application that need to be deleted|
     *
     * @param res - the response delegate of client
     *
     * @returns
     *
     * - Response `HTTP Code` to client as follow
     *
     * |Code|Detail|
     * |----|------|
     * |<span style="color:green">200</span> | Return a successful message|
     * |<span style="color:red">400</span> | Occur if an exception raised or nothing is changed |
     * |<span style="color:red">401</span> | Occur if don't have permission |
     * |<span style="color:red">404</span> | Occur if the area could not be found in the db |
     * |<span style="color:red">406</span> | Occur if one of the field in request is not acceptable |
     *
     * - Response will be in the format as the below
     *
     * ```json
     * {
     *      message: '',
     * }
     * ```
     * - response detail
     *
     * |Parameters|Type|Detail|
     * |----------|----|------|
     * |message | string | The message will be responsed to client|
     *
     */
    delete = async (req: Request, res: Response): Promise<void> => {
        const param = req.body;
        const lockResource = `/home/${param.userId}/${param.homeId}/${param.appCode}/deleteEntity`;
        await this.semaphore.acquire(lockResource);
        const connection = getConnection();
        const queryRunner = connection.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const homeDetail = await getRepository(Home)
                .createQueryBuilder('home')
                .where('home.id = :homeId', { homeId: param.homeId })
                .andWhere('home.userId = :userId', { userId: param.userId })
                .andWhere('home.appCode = :appCode', { appCode: param.appCode })
                .getOne();

            this.logger.Info({ path: 'Entity.controller.ts', resource: 'delete:homeDetail', mess: JSON.stringify(homeDetail) });

            if (typeof homeDetail === 'undefined') {
                this.logger.Error({ path: 'Entity.controller.ts', resource: 'delete:homeDetail', mess: ErrorCode.NSERR_HOMENOTFOUND });
                return this.responser.NotFound(res, { code: ErrorCode.NSERR_HOMENOTFOUND });
            }

            const existedDevice = await getRepository(Device)
                .createQueryBuilder('device')
                .where('device.id = :id', { id: param.id })
                .andWhere('device.homeId = :homeId', { homeId: param.homeId })
                .andWhere('device.userId = :userId', { userId: param.userId })
                .andWhere('device.appCode = :appCode', { appCode: param.appCode })
                .getOne();

            this.logger.Info({ path: 'Entity.controller.ts', resource: 'delete:existedDevice', mess: JSON.stringify(existedDevice) });

            if (typeof existedDevice === 'undefined') {
                this.logger.Error({ path: 'Entity.controller.ts', resource: 'delete:existedDevice', mess: ErrorCode.NSERR_ENTITYNOTFOUND });
                return this.responser.NotFound(res, { code: ErrorCode.NSERR_ENTITYNOTFOUND });
            }

            const queryBuilder: SelectQueryBuilder<any> = connection.createQueryBuilder(queryRunner);
            const nowTimestamp: string = this.timestamp.convert(Date.now());
            const isOwner: boolean = homeDetail && homeDetail.isOwner === true;
            const isHomeController: boolean =
                existedDevice.familyName?.toLowerCase?.()?.replace(/\s/g, '') === 'hc' ||
                existedDevice.familyName?.toLowerCase?.()?.replace(/\s/g, '') === 'homecontroller';

            this.logger.Info({ path: 'Entity.controller.ts', resource: 'delete:isOwner', mess: isOwner });
            this.logger.Info({ path: 'Entity.controller.ts', resource: 'delete:isHomeController', mess: isHomeController });
            const jwt = req.headers.authorization;

            let unassignDevices: any[] = [];

            if (isHomeController) {
                await queryBuilder
                    .update(HomeStatistical)
                    .set({
                        cHC: () => 'cHC -1',
                        updatedAt: nowTimestamp,
                        updatedBy: param.userId,
                    })
                    .where('homeId = :homeId', { homeId: existedDevice.homeId })
                    .andWhere('appCode = :appCode', { appCode: param.appCode })
                    .andWhere('userId = :userId', { userId: existedDevice.userId })
                    .execute();

                if (isOwner) {
                    let existedHCNotInOwner: any[] = await queryRunner.manager
                        .getRepository(Device)
                        .createQueryBuilder('device')
                        .where('device.id = :id', { id: existedDevice.id })
                        .andWhere('device.userId != :userId', { userId: existedDevice.userId })
                        .andWhere('device.appCode = :appCode', { appCode: param.appCode })
                        .select(['device.userId AS id'])
                        .getRawMany();

                    await Promise.all(
                        existedHCNotInOwner?.map?.(async (memberInfo) => {
                            await queryBuilder
                                .update(HomeStatistical)
                                .set({
                                    cHC: () => 'cHC -1',
                                })
                                .where('homeId = :homeId', { homeId: existedDevice.homeId })
                                .andWhere('appCode = :appCode', { appCode: param.appCode })
                                .andWhere('userId = :userId', { userId: memberInfo?.id })
                                .execute();
                        }),
                    );
                }

                let areaOfDeviceQuery: SelectQueryBuilder<Device> = getRepository(Device)
                    .createQueryBuilder('device')
                    .where('device.id = :id', { id: param.id })
                    .andWhere('device.appCode = :appCode', { appCode: param.appCode })
                    .andWhere(`device.areaId != ''`);

                if (!isOwner) {
                    areaOfDeviceQuery = areaOfDeviceQuery.andWhere('device.userId = :userId', { userId: param.userId });
                }

                const areaOfDevice: any[] = await areaOfDeviceQuery.select(['device.areaId as areaid']).getRawMany();

                this.logger.Info({
                    path: 'Entity.controller.ts',
                    resource: 'delete:areaOfDevice',
                    mess: JSON.stringify(areaOfDevice),
                });

                await Promise.all(
                    areaOfDevice?.map?.(async (areaInfo) => {
                        await queryBuilder
                            .update(AreaStatistical)
                            .set({
                                cHC: () => 'cHC - 1',
                            })
                            .where('id = :id', { id: areaInfo.areaid })
                            .andWhere('appCode = :appCode', { appCode: param.appCode })
                            .execute();
                    }),
                );

                // -> nhóm các thiết bị có cùng nhà, phòng, user lại với nhau và đếm số thiết bị theo phòng
                // -> bỏ area = '' vì không thống kê phòng default

                let areaDeviceGroupByQuery: SelectQueryBuilder<Device> = getRepository(Device)
                    .createQueryBuilder('device')
                    .where('device.parentId = :id', { id: existedDevice.id })
                    .andWhere('device.appCode = :appCode', { appCode: param.appCode })
                    .andWhere(`device.areaId != ''`);

                if (!isOwner) {
                    // -> Nếu không phải owner thì chỉ tìm các thiết bị thuộc nó
                    areaDeviceGroupByQuery = areaDeviceGroupByQuery.andWhere('device.userId = :userId', { userId: param.userId });
                }

                const areaDeviceGroupBy: any[] = await areaDeviceGroupByQuery
                    .groupBy('device.areaId')
                    .addGroupBy('device.homeId')
                    .addGroupBy('device.userId')
                    .select(['device.userId AS userid', 'device.homeId as homeid', 'device.areaId AS areaid', 'COUNT(device.areaId) AS areacount'])
                    .getRawMany();

                this.logger.Info({ path: 'Entity.controller.ts', resource: 'delete:areaDeviceGroupBy', mess: JSON.stringify(areaDeviceGroupBy) });

                await Promise.all(
                    areaDeviceGroupBy?.map?.(async (area) => {
                        // -> update lại thống kê
                        await queryBuilder
                            .update(AreaStatistical)
                            .set({
                                cEntities: () => `cEntities - ${area.areacount}`,
                                updatedAt: nowTimestamp,
                                updatedBy: param.userId,
                            })
                            .where('id = :id', { id: area.areaid })
                            .andWhere('userId = :userid', { userid: area.userid })
                            .andWhere('appCode = :appCode', { appCode: param.appCode })
                            .andWhere('homeId = :homeid', { homeid: area.homeid })
                            .execute();
                    }),
                );

                // -> nhóm các thiết bị có cùng nhà và userid lại với nhau sau đố đếm số thiết bị theo nhà
                let homeDeviceGroupbyQuery: SelectQueryBuilder<Device> = getRepository(Device)
                    .createQueryBuilder('device')
                    .where('device.parentId = :id', { id: existedDevice.id })
                    .andWhere('device.appCode = :appCode', { appCode: param.appCode });

                if (!isOwner) {
                    // -> Nếu không phải owner thì chỉ tìm các thiết bị thuộc nó
                    homeDeviceGroupbyQuery = homeDeviceGroupbyQuery.andWhere('device.userId = :userId', { userId: param.userId });
                }

                const homeDeviceGroupby = await homeDeviceGroupbyQuery
                    .groupBy('device.homeId')
                    .addGroupBy('device.userId')
                    .select(['device.userId AS userid', 'device.homeId AS homeid', 'COUNT(device.homeId) AS homecount'])
                    .getRawMany();

                this.logger.Info({ path: 'Entity.controller.ts', resource: 'delete:homeDeviceGroupby', mess: JSON.stringify(homeDeviceGroupby) });

                await Promise.all(
                    homeDeviceGroupby?.map?.(async (home) => {
                        // -> update lại thống kê
                        await queryBuilder
                            .update(HomeStatistical)
                            .set({
                                cEntities: () => `cEntities - ${home.homecount}`,
                                updatedAt: nowTimestamp,
                                updatedBy: param.userId,
                            })
                            .andWhere('userId = :userid', { userid: home.userid })
                            .andWhere('homeId = :homeid', { homeid: home.homeid })
                            .andWhere('appCode = :appCode', { appCode: param.appCode })
                            .execute();
                    }),
                );

                let deviceDeletingInfoQuery: SelectQueryBuilder<Device> = getRepository(Device)
                    .createQueryBuilder('device')
                    .where('device.parentId = :id', { id: param.id })
                    .andWhere('device.appCode = :appCode', { appCode: param.appCode })
                    .andWhere('device.homeId = :homeId', { homeId: param.homeId });

                if (!isOwner) {
                    deviceDeletingInfoQuery = deviceDeletingInfoQuery.andWhere('userId = :userId', { userId: param.userId });
                }

                const deviceDeletingInfo = await deviceDeletingInfoQuery.getMany();
                unassignDevices = [...(unassignDevices || []), ...deviceDeletingInfo];

                // -> Xoá con trước
                let deviceDeletingQuery: DeleteQueryBuilder<Device> = queryBuilder
                    .delete()
                    .from(Device)
                    .where('parentId = :id', { id: param.id })
                    .andWhere('appCode = :appCode', { appCode: param.appCode })
                    .andWhere('homeId = :homeId', { homeId: param.homeId });

                if (!isOwner) {
                    deviceDeletingQuery = deviceDeletingQuery.andWhere('userId = :userId', { userId: param.userId });
                }

                await deviceDeletingQuery.execute();

                let hcDeletingInfoQuery: SelectQueryBuilder<Device> = getRepository(Device)
                    .createQueryBuilder('device')
                    .where('device.id = :id', { id: param.id })
                    .andWhere('device.appCode = :appCode', { appCode: param.appCode })
                    .andWhere('device.homeId = :homeId', { homeId: param.homeId });

                if (!isOwner) {
                    deviceDeletingInfoQuery = deviceDeletingInfoQuery.andWhere('userId = :userId', { userId: param.userId });
                }

                const hcDeletingInfo = await hcDeletingInfoQuery.getMany();

                unassignDevices = [...(unassignDevices || []), ...hcDeletingInfo];

                // -> Xoá hc
                let homecontrollerDeletingQuery = queryBuilder
                    .delete()
                    .from(Device)
                    .where('id = :id', { id: param.id })
                    .andWhere('appCode = :appCode', { appCode: param.appCode })
                    .andWhere('homeId = :homeId', { homeId: param.homeId });

                if (!isOwner) {
                    homecontrollerDeletingQuery = homecontrollerDeletingQuery.andWhere('userId = :userId', { userId: param.userId });
                }

                await homecontrollerDeletingQuery.execute();
            } else {
                await queryBuilder
                    .update(HomeStatistical)
                    .set({
                        cEntities: () => 'cEntities -1',
                    })
                    .where('homeId = :homeId', { homeId: existedDevice.homeId })
                    .andWhere('appCode = :appCode', { appCode: param.appCode })
                    .andWhere('userId = :userId', { userId: existedDevice.userId })
                    .execute();
                // if is not owner =>

                if (isOwner) {
                    let existedDeviceNotInOwner: any[] = await queryRunner.manager
                        .getRepository(Device)
                        .createQueryBuilder('device')
                        .where('device.id = :id', { id: existedDevice.id })
                        .andWhere('device.userId != :userId', { userId: existedDevice.userId })
                        .andWhere('device.appCode = :appCode', { appCode: param.appCode })
                        .select(['device.userId AS id'])
                        .getRawMany();

                    await Promise.all(
                        existedDeviceNotInOwner?.map?.(async (user) => {
                            await queryBuilder
                                .update(HomeStatistical)
                                .set({
                                    cEntities: () => 'cEntities -1',
                                })
                                .where('homeId = :homeId', { homeId: existedDevice.homeId })
                                .andWhere('appCode = :appCode', { appCode: param.appCode })
                                .andWhere('userId = :userId', { userId: user.id })
                                .execute();
                        }),
                    );
                }

                let areaOfDeviceQuery: SelectQueryBuilder<Device> = getRepository(Device)
                    .createQueryBuilder('device')
                    .where('device.id = :id', { id: param.id })
                    .andWhere('device.appCode = :appCode', { appCode: param.appCode })
                    .andWhere('device.areaId != :areaId', { areaId: '' });

                if (!isOwner) {
                    areaOfDeviceQuery = areaOfDeviceQuery.andWhere('device.userId = :userId', { userId: param.userId });
                }

                const areaOfDevice: any[] = await areaOfDeviceQuery.select(['device.areaId as areaid']).getRawMany();

                this.logger.Info({ path: 'Entity.controller.ts', resource: 'delete:areaOfDeviceQuery', mess: JSON.stringify(areaOfDevice) });

                await Promise.all(
                    areaOfDevice?.map?.(async (areaInfo) => {
                        await queryBuilder
                            .update(AreaStatistical)
                            .set({
                                cEntities: () => 'cEntities - 1',
                            })
                            .where('id = :id', { id: areaInfo.areaid })
                            .andWhere('appCode = :appCode', { appCode: param.appCode })
                            .execute();
                    }),
                );

                let deviceDeletingInfoQuery: SelectQueryBuilder<Device> = getRepository(Device)
                    .createQueryBuilder('device')
                    .where('device.id = :id', { id: param.id })
                    .andWhere('device.appCode = :appCode', { appCode: param.appCode })
                    .andWhere('device.homeId = :homeId', { homeId: param.homeId });

                if (!isOwner) {
                    deviceDeletingInfoQuery = deviceDeletingInfoQuery.andWhere('userId = :userId', { userId: param.userId });
                }

                const deviceDeletingInfo = await deviceDeletingInfoQuery.getMany();
                unassignDevices = [...(unassignDevices || []), ...deviceDeletingInfo];

                let devicesDeletingQuery: DeleteQueryBuilder<Device> = queryBuilder
                    .delete()
                    .from(Device)
                    .where('id = :id', { id: param.id })
                    .andWhere('homeId = :homeId', { homeId: param.homeId })
                    .andWhere('appCode = :appCode', { appCode: param.appCode });

                if (!isOwner) {
                    devicesDeletingQuery = devicesDeletingQuery.andWhere('userId = :userId', { userId: param.userId });
                }
                await devicesDeletingQuery.execute();
            }

            let automationDeleteDeviceFail: any[] = [];
            let automationDeleted: string[] = [];
            this.logger.Info({ path: 'Entity.controller.ts', resource: 'delete:unassignDevices', mess: JSON.stringify(unassignDevices) });

            // if owner -> remove automation id
            if (isOwner) {
                await Promise.all(
                    unassignDevices?.map?.(async (device) => {
                        if (device) {
                            const autoDeletingResult = await this.automation.deleteDevice(device?.id);
                            if (typeof autoDeletingResult === 'undefined') {
                                automationDeleteDeviceFail.push(device?.id);
                                return;
                            }

                            this.logger.Info({ path: 'Entity.controller.ts', resource: 'delete:autoDeletingResult', mess: JSON.stringify(autoDeletingResult) });
                            automationDeleted = [...(automationDeleted || []), ...(autoDeletingResult || [])];
                        }
                    }),
                );

                if (automationDeleteDeviceFail.length > 0) {
                    await queryRunner.rollbackTransaction();
                    return this.responser.BadRequest(res, { code: ErrorCode.NSERR_ENTITYCOULDNOTBEDELETED });
                }

                this.logger.Info({ path: 'Entity.controller.ts', resource: 'delete:automationDeleted', mess: JSON.stringify(automationDeleted) });

                await Promise.all(
                    automationDeleted?.map(async (auto) => {
                        await queryBuilder
                            .update(Automation)
                            .set({
                                active: false,
                                updatedAt: nowTimestamp,
                                updatedBy: param.userId,
                            })
                            .where('id = :id', { id: auto })
                            .andWhere('homeId = :homeId', { homeId: param.homeId })
                            .andWhere('appCode = :appCode', { appCode: param.appCode })
                            .execute();
                    }),
                );
            }

            await queryRunner.commitTransaction();

            await Promise.all(
                unassignDevices?.map?.(async (device) => {
                    this.logger.Info({
                        path: 'Entity.controller.ts',
                        resource: 'delete:deviceDeletingInfo:unassignPolicy:timer:start',
                        mess: Date.now(),
                    });
                    const unassignPolicy = await this.policy.unassign({
                        action: '*',
                        resource: device?.id,
                        service: 'device',
                        userId: device.userId,
                        jwt,
                        appCode: param.appCode,
                    });

                    this.logger.Info({
                        path: 'Entity.controller.ts',
                        resource: 'delete:deviceDeletingInfo:unassignPolicy:timer:stop',
                        mess: Date.now(),
                    });
                    this.logger.Info({ path: 'Entity.controller.ts', resource: 'delete:deviceDeletingInfo:unassignPolicy', mess: unassignPolicy });
                }),
            );

            return this.responser.Ok(res, { message: 'Device has been deleted' });
        } catch (err) {
            await queryRunner.rollbackTransaction();
            this.logger.Error({ path: 'Entity.controller.ts', resource: 'delete:catch', mess: err });
            return this.responser.BadRequest(err, { mess: err });
        } finally {
            await this.semaphore.release(lockResource);
            await queryRunner.release();
        }
    };
}

export default EntityController;
