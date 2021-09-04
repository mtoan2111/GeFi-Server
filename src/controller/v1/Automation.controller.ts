import { User } from '../../model/v1/home/User.model';
import { Home } from '../../model/v1/home/Home.model';
import { Area } from '../../model/v1/home/Area.model';
import { Request, Response } from 'express';
import { Device } from '../../model/v1/home/Entity.model';
import { inject, injectable } from 'inversify';
import { Automation } from '../../model/v1/home/Automation.model';
import { ErrorCode } from '../../response/Error.response';
import { Brackets, getConnection, getRepository, SelectQueryBuilder } from 'typeorm';
import ICRUD from '../../interface/ICRUD.interface';
import ILogger from '../../interface/ILogger.interface';
import IResponser from '../../interface/IResponser.interface';
import ITimestamp from '../../interface/ITimestamp.Interface';
import ISemaphore from '../../interface/ISemaphore.interface';
import IAutomation from '../../interface/IAutomation.interface';

@injectable()
class AutomationController implements ICRUD {
    private logger: ILogger;
    private responser: IResponser;
    private timestamp: ITimestamp;
    private semaphore: ISemaphore;
    private automation: IAutomation;

    constructor(
        @inject('Logger') logger: ILogger,
        @inject('Responser') responser: IResponser,
        @inject('Timestamp') timestamp: ITimestamp,
        @inject('Semaphore') semaphore: ISemaphore,
        @inject('Automation') automation: IAutomation,
    ) {
        this.logger = logger;
        this.responser = responser;
        this.timestamp = timestamp;
        this.semaphore = semaphore;
        this.automation = automation;
    }
    /**
     * ## Find the automation that satisfy the input conditions
     *
     * ### <span style="background-color:#61affe; padding: 2px 15px; border-radius: 5px; color: white">GET</span> /home/v1/area
     *
     * **Note:** Need to be set the `DEBUG_LEVEL` to `debug` in **.env** file for using `ILogger`
     *
     * @param req - the request delegate of client
     *
     * `req` will be include a limited fields
     *
     * |Parameters|Required/Optional|Type|Detail|
     * |----------|-----------------|----|------|
     * |id| optional | nvarchar(128) | The id of the automation will be in <a href="https://en.wikipedia.org/wiki/Universally_unique_identifier" target="_blank">uuid_v4</a> format|
     * |homeId | required | nvarchar(128) | The homeId of the automation that need to be searched|
     * |userId | required | nvarchar(128) | The userId of the automation that need to be searched|
     * |appCode | required | nvarchar(256) | The app name of the application that need to be searched|
     * |type | required | nvarchar(32) | The type of the automation that need to be searched|
     * |name | optional | nvarchar(256) | The name of the automation that need to be searched|
     * |inputIds | optional | Lít of input id of devices of automation that need to be searched|
     * |outputIds | optional | List of output id of devices of automation that need to be searched|
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
     *          name: string,
     *          logo: string | null,
     *          position: number | null,
     *      }]
     * }
     * ```
     * - response detail
     *
     * |Parameters|Type|Detail|
     * |----------|----|------|
     * |id | string | The id of the area will be in <a href="https://en.wikipedia.org/wiki/Universally_unique_identifier" target="_blank">uuid_v4</a> format|
     * |homeId | string | The home id of the area will be in <a href="https://en.wikipedia.org/wiki/Universally_unique_identifier" target="_blank">uuid_v4</a> format|
     * |name | string | The name of the area |
     * |logo | string or null | The logo of the area. Logo can be an url or a key or null|
     * |position | number  | The position of area will be appeared in app|
     *
     */
    get = async (req: Request, res: Response): Promise<void> => {
        const param = req.query;
        const connection = getConnection();
        const queryRunner = connection.createQueryRunner();
        await queryRunner.connect();
        try {
            const homeOwner = await queryRunner.manager
                .getRepository(Home)
                .createQueryBuilder('home')
                .where('home.id = :homeid', { homeid: param.homeId })
                .andWhere('home.isOwner = :boolean', { boolean: true })
                .andWhere('home.appCode = :appCode', { appCode: param.appCode })
                .getOne();

            this.logger.Info({ path: 'Automation.controller.ts', resource: 'get:homeOwner', mess: JSON.stringify(homeOwner) });

            const isOnwer = homeOwner && homeOwner?.userId === param?.userId;

            let automationQueryTmp: SelectQueryBuilder<Automation> = getRepository(Automation)
                .createQueryBuilder('auto')
                .where(typeof param.id !== 'undefined' && param.id !== '' ? 'auto.id = :id' : '1 = 1', {
                    id: param.id,
                })
                .andWhere('auto.homeId = :homeid', { homeid: param.homeId })
                .andWhere('auto.appCode = :appCode', { appCode: param.appCode })
                .andWhere(typeof param.name !== 'undefined' && param.name !== '' ? 'auto.name = :name' : '1 = 1', {
                    name: param.name,
                })
                .andWhere(typeof param.inputId !== 'undefined' && param.inputId !== '' ? ':inputId = ANY(auto.inputIds)' : '1 = 1', {
                    inputId: param.inputId,
                })
                .andWhere(typeof param.outputId !== 'undefined' && param.outputId !== '' ? ':outputId IN ANY(auto.outputIds)' : '1 = 1', {
                    outputId: param.outputId,
                });

            const eAutomation: any[] = (await automationQueryTmp.getMany()) || [];

            this.logger.Info({ path: 'Automation.controller.ts', resource: 'get:eAutomation', mess: JSON.stringify(eAutomation) });

            let results = {};

            await Promise.all(
                eAutomation?.map(async (automation) => {
                    results[automation?.id] = {
                        id: automation?.id,
                        name: automation?.name,
                        homeId: automation?.homeId,
                        userId: automation?.userId,
                        hcId: automation?.hcId,
                        hcInfo: automation?.hcInfo,
                        owner: automation?.createdBy === param?.userId,
                        position: automation?.position,
                        logic: automation?.logic,
                        type: automation?.type,
                        gmt: automation?.GMT,
                        appCode: automation?.appCode,
                        active: automation?.active,
                        trigger: automation?.trigger,
                    };
                    const { raw } = automation;
                    const { input, output } = raw;
                    let inputs = {};
                    let outputs = {};
                    await Promise.all(
                        input?.map?.(async (device) => {
                            // this.logger.Info({ path: 'Automation.controller.ts', resource: 'get:input:device', mess: JSON.stringify(device) });
                            let eDeviceQueryTmp: SelectQueryBuilder<Device> = queryRunner.manager
                                .getRepository(Device)
                                .createQueryBuilder('device')
                                .where('device.homeId = :homeId', { homeId: param.homeId })
                                .andWhere('device.id = :id', { id: device?.id })
                                .andWhere('device.appCode = :appCode', { appCode: param.appCode });
                            if (isOnwer) {
                                eDeviceQueryTmp = eDeviceQueryTmp.andWhere('device.userId = :userId', { userId: param.userId });
                            } else {
                                eDeviceQueryTmp = eDeviceQueryTmp.andWhere(
                                    new Brackets((qb) => {
                                        qb.where('device.userId = :ownerId', { ownerId: homeOwner?.userId }).orWhere('device.userId = :userId', {
                                            userId: param.userId,
                                        });
                                    }),
                                );
                            }
                            const eDevices: any[] = await eDeviceQueryTmp
                                .select([
                                    'device.id AS id',
                                    'device.name AS name',
                                    'device.userId AS userId',
                                    'device.homeId AS homeId',
                                    'device.areaId AS areaId',
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

                            // this.logger.Info({ path: 'Automation.controller.ts', resource: 'get:input:eDevices', mess: JSON.stringify(eDevices) });
                            let deviceFound: any;
                            deviceFound = eDevices?.find((x) => x.userid === param.userId);
                            if (typeof deviceFound === 'undefined') {
                                deviceFound = eDevices?.find((x) => x.userid === homeOwner?.userId);
                            }

                            if (typeof deviceFound === 'undefined') {
                                inputs[device?.id] = {
                                    ...device,
                                    deleted: true,
                                };
                                return;
                            }

                            const eDeviceArea = await queryRunner.manager
                                .getRepository(Area)
                                .createQueryBuilder('area')
                                .where('area.id = :id', { id: deviceFound?.areaid })
                                .andWhere('area.userId = :userId', { userId: deviceFound?.userid })
                                .andWhere('area.homeId = :homeId', { homeId: deviceFound?.homeid })
                                .andWhere('area.appCode = :appCode', { appCode: param?.appCode })
                                .getOne();

                            deviceFound['areaname'] = eDeviceArea?.name;
                            deviceFound['state'] = device.state;
                            deviceFound['operator'] = device.operator;
                            inputs[deviceFound?.id] = {
                                ...deviceFound,
                                deleted: false,
                            };
                        }),
                    );

                    results[automation?.id] = {
                        ...(results[automation?.id] || {}),
                        input: Object.values(inputs),
                    };

                    await Promise.all(
                        output?.map?.(async (device) => {
                            // this.logger.Info({ path: 'Automation.controller.ts', resource: 'get:output:device', mess: JSON.stringify(device) });
                            let eDeviceQueryTmp: SelectQueryBuilder<Device> = queryRunner.manager
                                .getRepository(Device)
                                .createQueryBuilder('device')
                                .where('device.homeId = :homeId', { homeId: param.homeId })
                                .andWhere('device.id = :id', { id: device?.id })
                                .andWhere('device.appCode = :appCode', { appCode: param.appCode });
                            if (isOnwer) {
                                eDeviceQueryTmp = eDeviceQueryTmp.andWhere('device.userId = :userId', { userId: param.userId });
                            } else {
                                eDeviceQueryTmp = eDeviceQueryTmp.andWhere(
                                    new Brackets((qb) => {
                                        qb.where('device.userId = :ownerId', { ownerId: homeOwner?.userId }).orWhere('device.userId = :userId', {
                                            userId: param.userId,
                                        });
                                    }),
                                );
                            }
                            const eDevices: any[] = await eDeviceQueryTmp
                                .select([
                                    'device.id AS id',
                                    'device.name AS name',
                                    'device.userId AS userId',
                                    'device.homeId AS homeId',
                                    'device.areaId AS areaId',
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

                            // this.logger.Info({ path: 'Automation.controller.ts', resource: 'get:output:eDevices', mess: JSON.stringify(eDevices) });
                            let deviceFound: any;
                            deviceFound = eDevices?.find((x) => x.userid === param.userId);
                            if (typeof deviceFound === 'undefined') {
                                deviceFound = eDevices?.find((x) => x.userid === homeOwner?.userId);
                            }

                            if (typeof deviceFound === 'undefined') {
                                outputs[device?.id] = {
                                    ...device,
                                    deleted: true,
                                };
                                return;
                            }

                            const eDeviceArea = await queryRunner.manager
                                .getRepository(Area)
                                .createQueryBuilder('area')
                                .where('area.id = :id', { id: deviceFound?.areaid })
                                .andWhere('area.userId = :userId', { userId: deviceFound?.userid })
                                .andWhere('area.homeId = :homeId', { homeId: deviceFound?.homeid })
                                .andWhere('area.appCode = :appCode', { appCode: param?.appCode })
                                .getOne();

                            deviceFound['areaname'] = eDeviceArea?.name;
                            deviceFound['state'] = device.state;
                            deviceFound['delay'] = device.delay;
                            outputs[deviceFound?.id] = {
                                ...deviceFound,
                                deleted: false,
                            };
                        }),
                    );

                    results[automation?.id] = {
                        ...(results[automation?.id] || {}),
                        output: Object.values(outputs),
                    };
                }),
            );

            this.logger.Info({ path: 'Automation.controller.ts', resource: 'get:results', mess: JSON.stringify(results) });
            return this.responser.Ok(res, { message: 'done', data: Object.values(results) });
        } catch (err) {
            this.logger.Error({ path: 'Automation.controller.ts', resource: 'get:automation', mess: err });
            return this.responser.BadRequest(res, { message: err });
        } finally {
            queryRunner.release();
        }
    };
    /**
     * ## Create an automation
     *
     * ### <span style="background-color:#49cc90; padding: 2px 15px; border-radius: 5px; color: white">POST</span> /home/v1/area
     *
     * - **Note:** The parameter will be sent in the body of request
     * - **Note:** Need to be set the `DEBUG_LEVEL` to `debug` in **.env** file for using `ILogger`
     *
     * @param req - the request delegate of client
     * `req` will be include a limited fields
     *
     * |Parameters|Required/Optional|Type|Detail|
     * |----------|-----------------|----|------|
     * |homeId | required | nvarchar(128) | The homeId of the automation that need to be created|
     * |userId | required | nvarchar(128) | The id of the user that created automation|
     * |logo | optional | nvarchar(128) | The logo of automation that need to be created|
     * |name | required | nvarchar(128) | The name of the automation that need to be created|
     * |pos | optional | number(-1,127) | The position will be displayed in app of automation that need to be created|
     * |appCode | required | nvarchar(256) | The app name of the application that need to be created|
     * |type | required | nvarchar(32) | The type of the automation that need to be created|
     * |logic | required | nvarchar(32) | The logic of the automation that need to be created|
     * |active | required | boolean | The active status  of the automation that need to be created|
     * |hcId | optional | nvarchar(128) | The id of HC that control devices through wifi|
     * |input | required | object | see bellow |
     * |output | required | object | see bellow |
     * |trigger | required | object | see bellow |
     *
     * logic detail:
     *
     * |Logic type| Detail|
     * | and | rule will be executed if all condition are met|
     * | or | rule will be executed if atleast a condition is met|
     *
     * trigger detail:
     * 
     * ```json
     * trigger: {
     *     configuration: {
     *         start: "cron-time",
     *         end: "cron-time"
     *     }
     * }
     * 
     * ```
     * 
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
     * |<span style="color:red">409</span> | Occur if the area has been existed |
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
     */
    create = async (req: Request, res: Response): Promise<void> => {
        const param: any = req.body;
        const connection = getConnection();
        const queryRunner = connection.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            this.logger.Info({ path: 'Automation.controller.ts', resource: 'create:param', mess: JSON.stringify(param) });

            const user: User | undefined = await getRepository(User).createQueryBuilder('user').where('user.id = :id', { id: param.userId }).getOne();

            this.logger.Info({ path: 'Automation.controller.ts', resource: 'create:user', mess: JSON.stringify(user) });

            if (typeof user === 'undefined') {
                return this.responser.NotFound(res, { code: ErrorCode.NSERR_USERNOTFOUND });
            }

            const home: Home | undefined = await getRepository(Home)
                .createQueryBuilder('homeuser')
                .where('homeuser.id = :id', { id: param.homeId })
                .andWhere('homeuser.userId = :userid', { userid: param.userId })
                .andWhere('homeuser.appCode = :appCode', { appCode: param.appCode })
                .getOne();

            this.logger.Info({ path: 'Automation.controller.ts', resource: 'create:home', mess: JSON.stringify(home) });

            if (typeof home === 'undefined') {
                return this.responser.NotFound(res, { code: ErrorCode.NSERR_HOMENOTFOUND });
            }

            const isInHC = param?.hcId !== '' && param?.hcId && typeof param?.hcId !== 'undefined';

            this.logger.Info({ path: 'Automation.controller.ts', resource: 'create:isInHC', mess: JSON.stringify(isInHC) });

            const existedHomeController: any | undefined = await getRepository(Device)
                .createQueryBuilder('device')
                .where('device.id = :id', { id: param.hcId })
                .andWhere('device.userId = :userId', { userId: param.userId })
                .andWhere('device.homeId = :homeId', { homeId: param.homeId })
                .andWhere('device.appCode = :appCode', { appCode: param.appCode })
                .leftJoinAndSelect(Area, 'area', 'area.id = device.areaId')
                .select([
                    'device.id AS id',
                    'device.name AS name',
                    'device.userId AS userId',
                    'device.homeId AS homeId',
                    'device.areaId AS areaId',
                    'area.name AS areaName',
                    'device.mac AS mac',
                    'device.typeId AS typeId',
                    'device.typeName AS typeName',
                    'device.categoryId AS catId',
                    'device.categoryName AS catName',
                    'device.familyId AS familyId',
                    'device.familyName AS familyName',
                    'device.connectionId AS connectionId',
                    'device.connectionName AS connectionName',
                    'device.parentId AS parentId',
                    'device.extra AS extra',
                    'device.logo AS logo',
                    'device.position AS pos',
                ])
                .getRawOne();

            this.logger.Info({ path: 'Automation.controller.ts', resource: 'create:existedHomeController', mess: JSON.stringify(existedHomeController) });

            const deviceInputNotExisted: any = {};
            const deviceInputTransfer: any[] = [];
            const deviceInputIds: string[] = [];

            await Promise.all(
                param?.input?.map(async (device) => {
                    const deviceExisted: any = await getRepository(Device)
                        .createQueryBuilder('device')
                        .where('device.homeId = :homeId', { homeId: param.homeId })
                        .andWhere('device.userId = :userId', { userId: param.userId })
                        .andWhere('device.id = :id', { id: device.id })
                        .andWhere('device.appCode = :appCode', { appCode: param.appCode })
                        .leftJoinAndSelect(Area, 'area', 'area.id = device.areaId')
                        .select([
                            'device.id AS id',
                            'device.name AS name',
                            'device.userId AS userId',
                            'device.homeId AS homeId',
                            'device.areaId AS areaId',
                            'area.name AS areaName',
                            'device.mac AS mac',
                            'device.typeId AS typeId',
                            'device.typeName AS typeName',
                            'device.categoryId AS catId',
                            'device.categoryName AS catName',
                            'device.familyId AS familyId',
                            'device.familyName AS familyName',
                            'device.connectionId AS connectionId',
                            'device.connectionName AS connectionName',
                            'device.parentId AS parentId',
                            'device.extra AS extra',
                            'device.logo AS logo',
                            'device.position AS pos',
                        ])
                        .getRawOne();

                    this.logger.Info({
                        path: 'Automation.controller.ts',
                        resource: 'create:input:deviceExisted',
                        mess: JSON.stringify(deviceExisted),
                    });

                    if (typeof deviceExisted === 'undefined') {
                        deviceInputNotExisted[device.id] = {
                            id: device.id,
                            code: ErrorCode.NSERR_ENTITYNOTFOUND,
                        };
                        return;
                    }

                    const isHaveParent = typeof deviceExisted?.parentid !== 'undefined' && deviceExisted?.parentid !== null && deviceExisted?.parentid !== '';

                    if ((isInHC && isHaveParent && param.hcId !== deviceExisted?.parentid) || (isInHC && !isHaveParent) || (!isInHC && isHaveParent)) {
                        deviceInputNotExisted[device.id] = {
                            id: device.id,
                            code: ErrorCode.NSERR_AUTOMATIONENTITYINPUTNOTSUITABLE,
                        };
                        return;
                    }

                    deviceInputTransfer.push({
                        ...deviceExisted,
                        state: {
                            ...device?.state,
                        },
                        operator: {
                            ...device?.operator,
                        },
                    });

                    deviceInputIds.push(device?.id);
                }),
            );

            this.logger.Info({ path: 'Automation.controller.ts', resource: 'create:deviceInputNotExisted', mess: JSON.stringify(deviceInputNotExisted) });

            if (Object.keys(deviceInputNotExisted || {})?.length !== 0) {
                return this.responser.NotFound(res, { code: ErrorCode.NSERR_ENTITYNOTFOUND, data: [...Object.values(deviceInputNotExisted)] });
            }

            const deviceOuputNotExisted: any = {};
            const deviceOutputTransfer: any[] = [];
            const deviceOutputIds: string[] = [];

            await Promise.all(
                param?.output?.map(async (device) => {
                    switch (device.type) {
                        case 'scene':
                            const sceneExisted: any[] = await getRepository(Automation)
                                .createQueryBuilder('auto')
                                .where('auto.userId = :userId', { userId: param?.userId })
                                .andWhere('auto.homeId = :homeId', { homeId: param?.homeId })
                                .andWhere('auto.appCode = :appCode', { appCode: param?.appCode })
                                .andWhere('auto.id = :id', { id: param?.id })
                                .select(['auto.id AS id', 'auto.name AS name'])
                                .getRawOne();
                            if (typeof sceneExisted === 'undefined') {
                                deviceOuputNotExisted[device.id] = {
                                    id: device.id,
                                    code: ErrorCode.NSERR_AUTOMATIONNOTFOUND,
                                };
                            }

                            deviceOutputTransfer.push({
                                ...sceneExisted,
                                type: device.type,
                                state: device.state,
                                delay: device.delay,
                            });

                            deviceOutputIds.push(device.id);
                            break;
                        case 'device':
                            const deviceExisted: any = await getRepository(Device)
                                .createQueryBuilder('device')
                                .where('device.homeId = :homeId', { homeId: param.homeId })
                                .andWhere('device.userId = :userId', { userId: param.userId })
                                .andWhere('device.id = :id', { id: device.id })
                                .leftJoinAndSelect(Area, 'area', 'area.id = device.areaId')
                                .select([
                                    'device.id AS id',
                                    'device.name AS name',
                                    'device.userId AS userId',
                                    'device.homeId AS homeId',
                                    'device.areaId AS areaId',
                                    'area.name AS areaName',
                                    'device.mac AS mac',
                                    'device.typeId AS typeId',
                                    'device.typeName AS typeName',
                                    'device.categoryId AS catId',
                                    'device.categoryName AS catName',
                                    'device.familyId AS familyId',
                                    'device.familyName AS familyName',
                                    'device.connectionId AS connectionId',
                                    'device.connectionName AS connectionName',
                                    'device.parentId AS parentId',
                                    'device.extra AS extra',
                                    'device.logo AS logo',
                                    'device.position AS pos',
                                ])
                                .getRawOne();

                            this.logger.Info({
                                path: 'Automation.controller.ts',
                                resource: 'create:output:deviceExisted',
                                mess: JSON.stringify(deviceExisted),
                            });

                            if (typeof deviceExisted === 'undefined') {
                                deviceOuputNotExisted[device.id] = {
                                    id: device.id,
                                    code: ErrorCode.NSERR_ENTITYNOTFOUND,
                                };
                                return;
                            }

                            const isHaveParent =
                                typeof deviceExisted?.parentid !== 'undefined' && deviceExisted?.parentid !== null && deviceExisted?.parentid !== '';

                            this.logger.Info({
                                path: 'Automation.controller.ts',
                                resource: 'create:output:deviceExisted:isHaveParent',
                                mess: JSON.stringify(isHaveParent),
                            });

                            this.logger.Info({
                                path: 'Automation.controller.ts',
                                resource: 'create:output:deviceExisted:compare',
                                mess: JSON.stringify(
                                    (isInHC && isHaveParent && param.hcId !== deviceExisted?.parentid) ||
                                        (isInHC && !isHaveParent) ||
                                        (!isInHC && isHaveParent),
                                ),
                            });

                            if ((isInHC && isHaveParent && param.hcId !== deviceExisted?.parentid) || (isInHC && !isHaveParent) || (!isInHC && isHaveParent)) {
                                deviceOuputNotExisted[device.id] = {
                                    id: device.id,
                                    code: ErrorCode.NSERR_AUTOMATIONENTITYOUTPUTNOTSUITABLE,
                                };
                                return;
                            }

                            deviceOutputTransfer.push({
                                ...deviceExisted,
                                type: device.type,
                                state: {
                                    ...device?.state,
                                },
                                delay: device.delay,
                            });

                            deviceOutputIds.push(device.id);
                            break;
                        case 'notice':
                            deviceOutputTransfer.push({
                                ...device,
                                type: device.type,
                                delay: device.delay,
                            });
                            break;
                        default:
                            break;
                    }
                }),
            );

            this.logger.Info({
                path: 'Automation.controller.ts',
                resource: 'create:deviceOuputNotExisted',
                mess: JSON.stringify(deviceOuputNotExisted),
            });

            if (Object.keys(deviceOuputNotExisted || {})?.length !== 0) {
                return this.responser.NotFound(res, { code: ErrorCode.NSERR_ENTITYNOTFOUND, data: [...Object.values(deviceOuputNotExisted)] });
            }

            const autoId = await this.automation.create({
                name: param.name,
                homeId: param.homeId,
                HCId: param.hcId,
                processedAt: param.processAt,
                logo: param.logo,
                type: param.type,
                logic: param.logic,
                active: param.active,
                trigger: { ...(param.trigger || {}) },
                input: [...(param.input || [])],
                output: [...(param.output || [])],
            });

            this.logger.Info({
                path: 'Automation.controller.ts',
                resource: 'create:autoId',
                mess: autoId,
            });

            if (typeof autoId === 'undefined') {
                return this.responser.BadRequest(res, { code: ErrorCode.NSERR_UNKNOWN });
            }

            const automationRaw = {
                id: autoId,
                hc: param.hcId,
                name: param.name,
                type: param.type,
                timezone: param.timezone,
                logic: param.logic,
                active: param.active,
                trigger: param.trigger,
                input: param.input,
                output: param.output,
            };

            const automationTmp = {
                id: autoId,
                homeId: param.homeId,
                userId: param.userId,
                hcId: param.hcId,
                hcInfo: { ...existedHomeController },
                appCode: param.appCode,
                GMT: param.timezone,
                logic: param.logic,
                name: param.name,
                logo: param.logo,
                position: param.pos || -1,
                type: param.type,
                active: param.active,
                trigger: param.trigger,
                inputIds: deviceInputIds,
                outputIds: deviceOutputIds,
                raw: automationRaw,
            };

            this.logger.Info({ path: 'Automation.controller.ts', resource: 'create:automationTmp', mess: JSON.stringify(automationTmp) });

            const queryBuilder = connection.createQueryBuilder(queryRunner);
            const nowTimestamp = this.timestamp.convert(Date.now());

            await queryBuilder
                .insert()
                .into(Automation)
                .values({
                    ...automationTmp,
                    createdAt: nowTimestamp,
                    createdBy: param.userId,
                })
                .execute();

            await queryRunner.commitTransaction();
            return this.responser.Created(res, { message: 'done', data: { ...automationTmp } });
        } catch (err) {
            await queryRunner.rollbackTransaction();
            return this.responser.BadRequest(res, { message: err });
        } finally {
            await queryRunner.release();
        }
    };
    /**
     * ## Update an existed automation that satisfy the input conditions
     *
     * ### The request api:
     * ### <span style="background-color:#fca130; padding: 2px 15px; border-radius: 5px; color: white">PUT</span> /home/v1/automation
     *
     * - **Note:** The parameter will be sent in the body of request
     * - **Note:** Need to be set the `DEBUG_LEVEL` to `debug` in **.env** file for using `ILogger`
     *
     * @param req - the request delegate of client
     * `req` will be include a limited fields
     *
     * |Parameters|Required/Optional|Type|Detail|
     * |----------|-----------------|----|------|
     * |homeId | required | nvarchar(128) | The homeId of the automation that need to be created|
     * |userId | required | nvarchar(128) | The id of the user that created automation|
     * |logo | optional | nvarchar(128) | The logo of automation that need to be created|
     * |name | required | nvarchar(128) | The name of the automation that need to be created|
     * |pos | optional | number(-1,127) | The position will be displayed in app of automation that need to be created|
     * |appCode | required | nvarchar(256) | The app name of the application that need to be created|
     * |type | required | nvarchar(32) | The type of the automation that need to be created|
     * |logic | required | nvarchar(32) | The logic of the automation that need to be created|
     * |active | required | boolean | The active status  of the automation that need to be created|
     * |hcId | optional | nvarchar(128) | The id of HC that control devices through wifi|
     * |input | required |
     * |output | required |
     * |trigger | required |
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
        const param: any = req.body;

        const lockResource = `/home/${req.body.id}/${req.body.userId}/${req.body.homeId}/${req.body.appCode}/updateAutomation`;
        await this.semaphore.acquire(lockResource);

        const connection = getConnection();
        const queryRunner = connection.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            let isChanged: boolean = false;
            let isActiveChange: boolean = false;
            let isTriggerChange: boolean = false;
            let isInputChange: boolean = false;
            let isOutputChange: boolean = false;
            let isLogicChange: boolean = false;

            const existedAutomation: Automation | undefined = await getRepository(Automation)
                .createQueryBuilder('automation')
                .where('automation.id = :id', { id: param.id })
                .andWhere('automation.homeId = :homeId', { homeId: param.homeId })
                .andWhere('automation.appCode = :appCode', { appCode: param.appCode })
                .getOne();

            this.logger.Info({ path: 'Automation.controller.ts', resource: 'update:existedAutomation', mess: JSON.stringify(existedAutomation) });

            if (typeof existedAutomation === 'undefined') {
                return this.responser.NotFound(res, { code: ErrorCode.NSERR_AUTOMATIONNOTFOUND });
            }

            if (existedAutomation?.createdBy !== param.userId) {
                return this.responser.Unauthorized(res, { code: ErrorCode.NSERR_AUTOMATIONCOULDNOTBECHANGED });
            }

            let automationTmp = {
                id: existedAutomation?.id,
                hcId: existedAutomation?.hcId,
                hcInfo: existedAutomation?.hcInfo,
                homeId: existedAutomation?.homeId,
                userId: existedAutomation?.userId,
                trigger: existedAutomation?.trigger,
                appCode: existedAutomation?.appCode,
                type: existedAutomation?.type,
                position: existedAutomation?.position,
                active: existedAutomation?.active,
                name: existedAutomation?.name,
                logo: existedAutomation?.logo,
                raw: existedAutomation?.raw,
                logic: existedAutomation?.logic,
                inputIds: existedAutomation?.inputIds,
                outputIds: existedAutomation?.outputIds,
                GMT: existedAutomation?.GMT,
            };

            const isInHC = automationTmp?.hcId !== '' && typeof automationTmp?.hcId !== 'undefined';

            if (param.timezone && typeof param.timezone !== 'undefined' && param.timezone !== '' && existedAutomation!?.GMT !== param.timezone) {
                isChanged = true;
                automationTmp.GMT = param.timezone;
            }

            if (param.name && typeof param.name !== 'undefined' && param.name !== '' && existedAutomation!?.name !== param.name) {
                isChanged = true;
                automationTmp.logic = param.logic;
            }

            if (param.active && typeof param.active !== 'undefined' && param.active !== '' && existedAutomation!?.active !== param.active) {
                isChanged = true;
                automationTmp.active = param.active;
            }

            if (param.type && typeof param.type !== 'undefined' && param.type !== '' && existedAutomation!?.type !== param.type) {
                isChanged = true;
                automationTmp.type = param.type;
            }

            if (param.logo && typeof param.logo !== 'undefined' && param.logo !== '' && existedAutomation!?.logo !== param.logo) {
                isChanged = true;
                automationTmp.logo = param.logo;
            }

            if (param.pos && typeof param.pos !== 'undefined' && param.pos !== '' && existedAutomation!?.position !== param.pos) {
                isChanged = true;
                automationTmp.position = param.pos;
            }

            if (param.logic && typeof param.logic !== 'undefined' && param.logic !== '' && existedAutomation!?.logic !== param.logic) {
                isChanged = true;
                isLogicChange = true;
                automationTmp.logic = param.logic;
            }

            this.logger.Info({ path: 'Automation.controller.ts', resource: 'update:active:param', mess: param.active });
            this.logger.Info({ path: 'Automation.controller.ts', resource: 'update:active:existedAutomation', mess: existedAutomation!?.active });
            this.logger.Info({
                path: 'Automation.controller.ts',
                resource: 'update:active:compare',
                mess: existedAutomation!?.active !== param.active,
            });

            if (typeof param.active !== 'undefined' && param.active !== '' && existedAutomation!?.active !== param.active) {
                isChanged = true;
                isActiveChange = true;
                automationTmp.active = param.active;
            }

            if (param.trigger && typeof param.trigger !== 'undefined' && param.trigger !== '') {
                const tmpTrigger = {
                    start: existedAutomation?.trigger!?.configuration?.start,
                    end: existedAutomation?.trigger!?.configuration?.end,
                };

                const paramTrigger = {
                    start: param?.trigger?.configuration?.start,
                    end: param?.trigger?.configuration?.end,
                };

                this.logger.Info({ path: 'Automation.controller.ts', resource: 'update:trigger:tmpTrigger', mess: JSON.stringify(tmpTrigger) });
                this.logger.Info({ path: 'Automation.controller.ts', resource: 'update:trigger:paramTrigger', mess: JSON.stringify(paramTrigger) });
                this.logger.Info({
                    path: 'Automation.controller.ts',
                    resource: 'update:trigger:compare',
                    mess: JSON.stringify(tmpTrigger) !== JSON.stringify(paramTrigger),
                });

                if (JSON.stringify(tmpTrigger) !== JSON.stringify(paramTrigger)) {
                    isChanged = true;
                    isTriggerChange = true;
                    automationTmp.trigger = {
                        ...param.trigger,
                    };
                }
            }

            const deviceInputIds: string[] = [];

            if (param.input && typeof param.input !== 'undefined' && param.input !== '') {
                const tmpInput = existedAutomation?.raw?.input?.sort?.((x, y) => {
                    if (x.id > y.id) return 1;
                    if (x.id < y.id) return -1;
                    return 0;
                });

                const paramInput = param?.input?.sort?.((x, y) => {
                    if (x.id > y.id) return 1;
                    if (x.id < y.id) return -1;
                    return 0;
                });

                this.logger.Info({ path: 'Automation.controller.ts', resource: 'update:input:tmpInput', mess: JSON.stringify(tmpInput) });
                this.logger.Info({ path: 'Automation.controller.ts', resource: 'update:input:paramInput', mess: JSON.stringify(paramInput) });
                this.logger.Info({
                    path: 'Automation.controller.ts',
                    resource: 'update:input:compare',
                    mess: JSON.stringify(tmpInput) !== JSON.stringify(paramInput),
                });

                if (JSON.stringify(tmpInput) !== JSON.stringify(paramInput)) {
                    const deviceInputNotExisted: any = {};
                    const deviceInputTransfer: any[] = [];
                    await Promise.all(
                        param?.input?.map(async (device) => {
                            const deviceExisted: any = await getRepository(Device)
                                .createQueryBuilder('device')
                                .where('device.homeId = :homeId', { homeId: param.homeId })
                                .andWhere('device.userId = :userId', { userId: param.userId })
                                .andWhere('device.id = :id', { id: device.id })
                                .andWhere('device.appCode = :appCode', { appCode: param.appCode })
                                .leftJoinAndSelect(Area, 'area', 'area.id = device.areaId')
                                .select([
                                    'device.id AS id',
                                    'device.name AS name',
                                    'device.userId AS userId',
                                    'device.homeId AS homeId',
                                    'device.areaId AS areaId',
                                    'area.name AS areaName',
                                    'device.mac AS mac',
                                    'device.typeId AS typeId',
                                    'device.typeName AS typeName',
                                    'device.categoryId AS catId',
                                    'device.categoryName AS catName',
                                    'device.familyId AS familyId',
                                    'device.familyName AS familyName',
                                    'device.connectionId AS connectionId',
                                    'device.connectionName AS connectionName',
                                    'device.parentId AS parentId',
                                    'device.extra AS extra',
                                    'device.logo AS logo',
                                    'device.position AS pos',
                                ])
                                .getRawOne();

                            if (typeof deviceExisted === 'undefined') {
                                deviceInputNotExisted[device.id] = {
                                    id: device.id,
                                    code: ErrorCode.NSERR_ENTITYNOTFOUND,
                                };
                                return;
                            }

                            const isHaveParent =
                                typeof deviceExisted?.parentid !== 'undefined' && deviceExisted?.parentid !== null && deviceExisted?.parentid !== '';

                            if (
                                (isInHC && isHaveParent && existedAutomation.hcId !== deviceExisted?.parentid) ||
                                (isInHC && !isHaveParent) ||
                                (!isInHC && isHaveParent)
                            ) {
                                deviceInputNotExisted[device.id] = {
                                    id: device.id,
                                    code: ErrorCode.NSERR_AUTOMATIONENTITYINPUTNOTSUITABLE,
                                };
                                return;
                            }

                            deviceInputTransfer.push({
                                ...deviceExisted,
                                state: {
                                    ...device?.state,
                                },
                                operator: {
                                    ...device?.operator,
                                },
                            });

                            deviceInputIds.push(device?.id);
                        }),
                    );

                    this.logger.Info({
                        path: 'Automation.controller.ts',
                        resource: 'update:deviceInputNotExisted',
                        mess: JSON.stringify(deviceInputNotExisted),
                    });

                    if (Object.keys(deviceInputNotExisted || {})?.length !== 0) {
                        return this.responser.NotFound(res, { code: ErrorCode.NSERR_ENTITYNOTFOUND, data: [...Object.values(deviceInputNotExisted)] });
                    }

                    isChanged = true;
                    isInputChange = true;
                    automationTmp.inputIds = [...deviceInputIds];
                }
            }

            if (param.output && typeof param.output !== 'undefined' && param.output !== '') {
                const tmpOutput = existedAutomation?.raw?.output?.sort?.((x, y) => {
                    if (x.id > y.id) return 1;
                    if (x.id < y.id) return -1;
                    return 0;
                });

                const paramOutput = param?.output?.sort?.((x, y) => {
                    if (x.id > y.id) return 1;
                    if (x.id < y.id) return -1;
                    return 0;
                });

                this.logger.Info({ path: 'Automation.controller.ts', resource: 'update:output:tmpOutput', mess: JSON.stringify(tmpOutput) });
                this.logger.Info({ path: 'Automation.controller.ts', resource: 'update:output:paramOutput', mess: JSON.stringify(paramOutput) });
                this.logger.Info({
                    path: 'Automation.controller.ts',
                    resource: 'update:output:compare',
                    mess: JSON.stringify(tmpOutput) !== JSON.stringify(paramOutput),
                });

                if (JSON.stringify(tmpOutput) !== JSON.stringify(paramOutput)) {
                    const deviceOuputNotExisted: any = {};
                    const deviceOutputTransfer: any[] = [];
                    const deviceOutputIds: string[] = [];
                    await Promise.all(
                        param?.output?.map(async (device) => {
                            switch (device.type) {
                                case 'scene':
                                    const sceneExisted: any[] = await getRepository(Automation)
                                        .createQueryBuilder('auto')
                                        .where('auto.userId = :userId', { userId: param?.userId })
                                        .andWhere('auto.homeId = :homeId', { homeId: param?.homeId })
                                        .andWhere('auto.appCode = :appCode', { appCode: param?.appCode })
                                        .andWhere('auto.id = :id', { id: param?.id })
                                        .select(['auto.id AS id', 'auto.name AS name'])
                                        .getRawOne();
                                    if (typeof sceneExisted === 'undefined') {
                                        deviceOuputNotExisted[device.id] = {
                                            id: device.id,
                                            code: ErrorCode.NSERR_AUTOMATIONNOTFOUND,
                                        };
                                    }

                                    deviceOutputTransfer.push({
                                        ...sceneExisted,
                                        type: device.type,
                                        state: device.state,
                                        delay: device.delay,
                                    });

                                    deviceOutputIds.push(device.id);
                                    break;
                                case 'device':
                                    const deviceExisted: any = await getRepository(Device)
                                        .createQueryBuilder('device')
                                        .where('device.homeId = :homeId', { homeId: param.homeId })
                                        .andWhere('device.userId = :userId', { userId: param.userId })
                                        .andWhere('device.id = :id', { id: device.id })
                                        .leftJoinAndSelect(Area, 'area', 'area.id = device.areaId')
                                        .select([
                                            'device.id AS id',
                                            'device.name AS name',
                                            'device.userId AS userId',
                                            'device.homeId AS homeId',
                                            'device.areaId AS areaId',
                                            'area.name AS areaName',
                                            'device.mac AS mac',
                                            'device.typeId AS typeId',
                                            'device.typeName AS typeName',
                                            'device.categoryId AS catId',
                                            'device.categoryName AS catName',
                                            'device.familyId AS familyId',
                                            'device.familyName AS familyName',
                                            'device.connectionId AS connectionId',
                                            'device.connectionName AS connectionName',
                                            'device.parentId AS parentId',
                                            'device.extra AS extra',
                                            'device.logo AS logo',
                                            'device.position AS pos',
                                        ])
                                        .getRawOne();

                                    this.logger.Info({
                                        path: 'Automation.controller.ts',
                                        resource: 'create:output:deviceExisted',
                                        mess: JSON.stringify(deviceExisted),
                                    });

                                    if (typeof deviceExisted === 'undefined') {
                                        deviceOuputNotExisted[device.id] = {
                                            id: device.id,
                                            code: ErrorCode.NSERR_ENTITYNOTFOUND,
                                        };
                                        return;
                                    }

                                    const isHaveParent =
                                        typeof deviceExisted?.parentid !== 'undefined' && deviceExisted?.parentid !== null && deviceExisted?.parentid !== '';

                                    if (
                                        (isInHC && isHaveParent && existedAutomation.hcId !== deviceExisted?.parentid) ||
                                        (isInHC && !isHaveParent) ||
                                        (!isInHC && isHaveParent)
                                    ) {
                                        deviceOuputNotExisted[device.id] = {
                                            id: device.id,
                                            code: ErrorCode.NSERR_AUTOMATIONENTITYOUTPUTNOTSUITABLE,
                                        };
                                        return;
                                    }

                                    deviceOutputTransfer.push({
                                        ...deviceExisted,
                                        type: device?.type,
                                        state: {
                                            ...device?.state,
                                        },
                                        delay: device?.delay,
                                    });

                                    deviceOutputIds.push(device.id);
                                    break;
                                case 'notice':
                                    deviceOutputTransfer.push({
                                        ...device,
                                        type: device?.type,
                                        delay: device?.delay,
                                    });
                                    break;
                                default:
                                    break;
                            }
                        }),
                    );

                    this.logger.Info({
                        path: 'Automation.controller.ts',
                        resource: 'create:deviceOuputNotExisted',
                        mess: JSON.stringify(deviceOuputNotExisted),
                    });

                    if (Object.keys(deviceOuputNotExisted || {})?.length !== 0) {
                        return this.responser.NotFound(res, { code: ErrorCode.NSERR_ENTITYNOTFOUND, data: [...Object.values(deviceOuputNotExisted)] });
                    }
                    isChanged = true;
                    isOutputChange = true;
                    automationTmp.outputIds = [...deviceOutputIds];
                }
            }

            const queryBuilder = connection.createQueryBuilder(queryRunner);
            if (isChanged) {
                const automationRaw = {
                    hc: existedAutomation?.raw?.hcId,
                    name: automationTmp.name,
                    type: existedAutomation?.raw?.type,
                    logic: automationTmp.logic,
                    active: automationTmp.active,
                    timezone: automationTmp.GMT,
                    trigger: automationTmp.trigger,
                    input: isInputChange ? param.input : existedAutomation?.raw?.input,
                    output: isOutputChange ? param.output : existedAutomation?.raw?.output,
                };
                automationTmp.raw = { ...automationRaw };
                const nowTimestamp = this.timestamp.convert(Date.now());

                await queryBuilder
                    .update(Automation)
                    .set({
                        ...automationTmp,
                        updatedAt: nowTimestamp,
                        updatedBy: param.userId,
                    })
                    .where('id = :id', { id: param.id })
                    .andWhere('appCode = :appCode', { appCode: param.appCode })
                    .execute();

                this.logger.Info({
                    path: 'Automation.controller.ts',
                    resource: 'update:changedStatus',
                    mess: isLogicChange || isActiveChange || isTriggerChange || isInputChange || isOutputChange,
                });

                if (isLogicChange || isActiveChange || isTriggerChange || isInputChange || isOutputChange) {
                    const updateResult = await this.automation.update({
                        id: automationTmp.id,
                        logic: automationTmp.logic,
                        type: automationTmp.type,
                        active: automationTmp.active,
                        trigger: automationTmp.trigger,
                        input: param.input,
                        output: param.output,
                    });

                    if (typeof updateResult === 'undefined') {
                        this.logger.Error({ path: 'Automation.controller.ts', resource: 'update:updateResult', mess: ErrorCode.NSERR_NOTHINGTOBECHANGED });
                        await queryRunner.rollbackTransaction();
                        return this.responser.BadRequest(res, { code: ErrorCode.NSERR_NOTHINGTOBECHANGED });
                    }
                }

                await queryRunner.commitTransaction();

                this.logger.Info({ path: 'Automation.controller.ts', resource: 'update:automationTmp', mess: JSON.stringify(automationTmp) });
                return this.responser.Ok(res, { message: 'done', data: { ...automationTmp } });
            }
            return this.responser.BadRequest(res, { code: ErrorCode.NSERR_NOTHINGTOBECHANGED });
        } catch (err) {
            await queryRunner.rollbackTransaction();
            this.logger.Error({ path: 'Automation.controller.ts', resource: 'update:catch', mess: err });
            return this.responser.BadRequest(res, { message: err });
        } finally {
            await queryRunner.release();
            await this.semaphore.release(lockResource);
        }
    };
    /**
     * ## Delete an existed automation that satisfy the input conditions
     *
     * ### The request api:
     * ### <span style="background-color:#f93e3e; padding: 2px 15px; border-radius: 5px; color: white">DELETE</span> /home/v1/automation
     *
     * - **Note:** The parameter will be sent in the body of request
     * - **Note:** Need to be set the `DEBUG_LEVEL` to `debug` in **.env** file for using `ILogger`
     *
     * @param req - the request delegate of client
     * `req` will be include a limited fields
     *
     * |Parameters|Required/Optional|Type|Detail|
     * |----------|-----------------|----|------|
     * |id | required | nvarchar(128) | The id of the automation that need to be deleted|
     * |homeId | required | nvarchar(128) | The homeId of the automation that need to be deleted|
     * |userId | required | nvarchar(128) | The userId of the automation that need to be deleted|
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
     * |<span style="color:red">401</span> | Occur if don't have permission to delete the automation |
     * |<span style="color:red">404</span> | Occur if the automation could not be found in the db |
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
     */
    delete = async (req: Request, res: Response): Promise<void> => {
        const param: any = req.body;

        const lockResource = `/home/${req.body.id}/${req.body.userId}/${req.body.homeId}/${req.body.appCode}/updateAutomation`;
        await this.semaphore.acquire(lockResource);

        const connection = getConnection();
        const queryRunner = connection.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const existedAutomation: Automation | undefined = await getRepository(Automation)
                .createQueryBuilder('automation')
                .where('automation.id = :id', { id: param.id })
                .andWhere('automation.homeId = :homeId', { homeId: param.homeId })
                .andWhere('automation.appCode = :appCode', { appCode: param.appCode })
                .getOne();

            this.logger.Info({ path: 'Automation.controller.ts', resource: 'update:existedAutomation', mess: JSON.stringify(existedAutomation) });

            if (typeof existedAutomation === 'undefined') {
                return this.responser.NotFound(res, { code: ErrorCode.NSERR_AUTOMATIONNOTFOUND });
            }

            if (existedAutomation?.createdBy !== param.userId) {
                return this.responser.Unauthorized(res, { code: ErrorCode.NSERR_AUTOMATIONCOULDNOTBECHANGED });
            }

            const queryBuilder = connection.createQueryBuilder(queryRunner);
            await queryBuilder
                .delete()
                .from(Automation)
                .where('id = :id', { id: existedAutomation.id })
                .andWhere('homeId = :homeId', { homeId: param.homeId })
                .andWhere('appCode = :appCode', { appCode: param.appCode })
                .execute();

            const deleteResult = await this.automation.delete(existedAutomation?.id);

            if (typeof deleteResult === 'undefined') {
                this.logger.Error({ path: 'Automation.controller.ts', resource: 'delete:deleteResult', mess: ErrorCode.NSERR_AUTOMATIONCOULDNOTBEDELETED });
                await queryRunner.rollbackTransaction();
                return this.responser.BadRequest(res, { code: ErrorCode.NSERR_AUTOMATIONCOULDNOTBEDELETED });
            }

            await queryRunner.commitTransaction();
            return this.responser.Ok(res, { message: 'Automation has been deleted' });
        } catch (err) {
            await queryRunner.rollbackTransaction();
            this.logger.Error({ path: 'Automation.controller.ts', resource: 'delete:catch', mess: err });
        } finally {
            await queryRunner.release();
            await this.semaphore.release(lockResource);
        }
    };
}

export default AutomationController;
