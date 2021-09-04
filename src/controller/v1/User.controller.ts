import { v4 as uuidv4 } from 'uuid';
import { User } from '../../model/v1/home/User.model';
import { Home } from '../../model/v1/home/Home.model';
import { Response, Request } from 'express';
import { inject, injectable } from 'inversify';
import { Member } from '../../model/v1/home/Member.model';
import { Invitation } from '../../model/v1/home/Invitation.model';
import { getConnection, getRepository } from 'typeorm';
import { HomeStatistical } from '../../model/v1/home/HomeStatistical.model';
import IAuth from '../../interface/IAuth.interface';
import ICRUD from '../../interface/ICRUD.interface';
import ILogger from '../../interface/ILogger.interface';
import { ErrorCode } from '../../response/Error.response';
import ISemaphore from 'src/interface/ISemaphore.interface';
import IResponser from '../../interface/IResponser.interface';
import ITimestamp from '../../interface/ITimestamp.Interface';

@injectable()
class UserController implements ICRUD {
    private logger: ILogger;
    private responser: IResponser;
    private timestamp: ITimestamp;
    private auth: IAuth;
    private semaphore: ISemaphore;

    constructor(
        @inject('Logger') logger: ILogger,
        @inject('Responser') responser: IResponser,
        @inject('Timestamp') timestamp: ITimestamp,
        @inject('Auth') auth: IAuth,
        @inject('Semaphore') semaphore: ISemaphore,
    ) {
        this.logger = logger;
        this.responser = responser;
        this.timestamp = timestamp;
        this.auth = auth;
        this.semaphore = semaphore;
    }
    /**
     * ## Find the users that satisfy the input conditions
     *
     * ### The request api:
     * ### <span style="background-color:#61affe; padding: 2px 15px; border-radius: 5px; color: white">GET</span> /home/v1/user
     *
     * - **Note:** Need to be set the `DEBUG_LEVEL` to `debug` in **.env** file for using `ILogger`.
     * - **Note:** Need to add `jwt token` into the header to bypass gateway.
     *
     * ```js
     *      headers['Authorization'] = `${jwt_token}`
     * ```
     *
     * @param req - the request delegate of client
     *
     * `req` will be include a limited fields
     *
     * |Parameters|Required/Optional|Type|Detail|
     * |----------|-----------------|----|------|
     * |name | optional | nvarchar(256) | The name of the user that need to be searched|
     * |phone | optional | nvarchar(256) | The homeId of the user that need to be searched|
     * |email | optional | nvarchar(256) | The name of the user that need to be searched|
     * |address | optional | nvarchar(256) | The homeId of the user that need to be searched|
     * |fcm | optional | nvarchar(256) | The homeId of the user that need to be searched|
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
     *          name: string,
     *          avatar: string,
     *          phone: string,
     *          email: string,
     *          address: string | null,
     *          fcm: string,
     *      }]
     * }
     * ```
     * - response detail
     *
     * |Parameters|Type|Detail|
     * |----------|----|------|
     * |id | string | The id of the user will be in <a href="https://en.wikipedia.org/wiki/Universally_unique_identifier" target="_blank">uuid_v4</a> format|
     * |name | string | The name of the area |
     * |phone | string | The homeId of the area |
     * |email | string | The userId of the area |
     * |address | string | The address of user|
     * |fcm | string | The fire base token of user|
     *
     */
    get = async (req: Request, res: Response): Promise<void> => {
        try {
            const param: any = req.query;
            const user: any[] =
                (await getRepository(User)
                    .createQueryBuilder('user')
                    .where(typeof param.userId !== 'undefined' && param.userId !== '' ? 'user.id = :userId' : '1 = 1', {
                        userId: param.userId,
                    })
                    .andWhere(typeof param.name !== 'undefined' && param.name !== '' ? 'user.name ILIKE (:name)' : '1 = 1', { name: `%${param.name}%` })
                    .andWhere(typeof param.phone !== 'undefined' && param.phone !== '' ? 'user.phone = :phone' : '1 = 1', { phone: param.phone })
                    .andWhere(typeof param.email !== 'undefined' && param.email !== '' ? 'user.email = :email' : '1 = 1', { email: param.email })
                    .andWhere(typeof param.address !== 'undefined' && param.address !== '' ? 'user.address = :address' : '1 = 1', { address: param.address })
                    .andWhere(typeof param.fcm !== 'undefined' && param.fcm !== '' ? 'user.fcm = :fcm' : '1 = 1', {
                        fcm: param.fcm,
                    })
                    .andWhere('user.appCode = :appCode', { appCode: param.appCode })
                    .leftJoinAndSelect(Invitation, 'ivt', 'ivt.memberEmail = user.email AND ivt.state = -1 AND ivt.appCode = :appCodeIvt', {
                        appCodeIvt: param.appCode,
                    })
                    .leftJoinAndSelect(Home, 'home', 'home.userId = user.id AND home.isOwner = true')
                    .distinctOn(['user.id'])
                    .groupBy('user.id')
                    .addGroupBy('ivt.id')
                    .select([
                        'user.id AS id',
                        'user.name AS name',
                        'user.phone AS phone',
                        'user.avatar AS avatar',
                        'user.email AS email',
                        'user.address AS address',
                        'user.fcm AS fcm',
                        'user.appCode AS appCode',
                        'user.lang AS lang',
                        'ivt.id IS NOT NULL AS notify',
                        'COUNT(home.id) AS homecountasowner',
                    ])
                    .getRawOne()) || [];

            this.logger.Info({ path: 'User.controller.ts', resource: 'get:user', mess: JSON.stringify(user) });

            return this.responser.Ok(res, { message: 'done', data: user });
        } catch (err) {
            this.logger.Error({ path: 'User.controller.ts', resource: 'get:catch', mess: err });
            return this.responser.BadRequest(res, { message: err });
        }
    };
    /**
     * ## Create a user
     *
     * ### The request api:
     * ### <span style="background-color:#49cc90; padding: 2px 15px; border-radius: 5px; color: white">POST</span> /home/v1/user/register
     *
     * - **Note:** The parameter will be sent in the body of request
     * - **Note:** Need to be set the `DEBUG_LEVEL` to `debug` in **.env** file for using `ILogger`
     * - **Note:** Need to add `jwt token` into the header to bypass gateway.
     *
     * ```js
     *      headers['Authorization'] = `${jwt_token}`
     * ```
     *
     * @param req - the request delegate of client
     * `req` will be include a limited fields
     *
     * |Parameters|Required/Optional|Type|Detail|
     * |----------|-----------------|----|------|
     * |password | required | nvarchar(128) | The password of the user that need to be created|
     * |password_cfm | required | nvarchar(128) | The comfirmation password of the user that need to be created|
     * |token | required | nvarchar(4) | The token that sent to the email|
     * |name | required | nvarchar(256) | The name of the home that need to be created|
     * |email | required | nvarchar(256) | The email of the user that need to be created|
     * |fcm | required | nvarchar(512) | The firebase token of the user that need to be created|
     * |address | optional | nvarchar(512) | The address of the user that need to be created|
     * |phone | optional | nvarchar(32) | The phone of the user that need to be created|
     * |lang | optional | nvarchar(16) | The language of the user that need to be created, the language will be in <strong style="color:red">vi</strong> or <strong style="color:red">en</strong>|
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
     * |<span style="color:red">400</span> | Occur if an exception raised |
     * |<span style="color:red">401</span> | Occur if doesn't have permission |
     * |<span style="color:red">406</span> | Occur if one of the field in request is not acceptable |
     *
     * - The response message will be display in the format as the below
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
     *
     */
    create = async (req: Request, res: Response): Promise<void> => {
        const param = req.body;
        const lockResource = `/home/${param.email}/${param.appCode}/createUser`;
        await this.semaphore.acquire(lockResource);
        const connection = getConnection();
        const queryRunner = connection.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const existedUser: User | undefined = await getRepository(User)
                .createQueryBuilder('User')
                .where('User.email = :email', { email: param.email })
                .andWhere('User.appCode = :appCode', { appCode: param.appCode })
                .getOne();

            this.logger.Info({ path: 'User.controller.ts', resource: 'create:existedUser', mess: JSON.stringify(existedUser) });

            if (typeof existedUser !== 'undefined') {
                this.logger.Error({ path: 'User.controller.ts', resource: 'create:existedUser', mess: ErrorCode.NSERR_USEREXISTED });
                return this.responser.Conflict(res, { code: ErrorCode.NSERR_USEREXISTED });
            }

            this.logger.Info({ path: 'User.controller.ts', resource: 'create:verifyAccount:timer:start', mess: Date.now() });
            const verifyUser = await this.auth.verifyAccount({
                email: param?.email,
                password: param?.password,
                token: param.token,
                appCode: param.appCode,
            });
            this.logger.Info({ path: 'User.controller.ts', resource: 'create:verifyAccount:timer:stop', mess: Date.now() });

            this.logger.Info({ path: 'User.controller.ts', resource: 'create:user', mess: JSON.stringify(verifyUser) });

            if (verifyUser.errStatus) {
                this.logger.Error({ path: 'User.controller.ts', resource: 'create:errStatus', mess: verifyUser?.errCode });
                switch (verifyUser?.errCode) {
                    case ErrorCode.NSERR_USERCODENOTMATCH:
                        return this.responser.BadRequest(res, { code: verifyUser?.errCode, trace: `${verifyUser?.errCode}_${verifyUser?.traceCode}` });
                    case ErrorCode.NSERR_USEREMAILNOTFOUND:
                        return this.responser.NotFound(res, { code: verifyUser?.errCode, trace: `${verifyUser?.errCode}_${verifyUser?.traceCode}` });
                    case ErrorCode.NSERR_USERCODEEXPIRED:
                        return this.responser.BadRequest(res, { code: verifyUser?.errCode, trace: `${verifyUser?.errCode}_${verifyUser?.traceCode}` });
                    default:
                        return this.responser.BadRequest(res, { code: ErrorCode.NSERR_UNKNOWN });
                }
            }

            let tmpHomeId: string = '';
            while (tmpHomeId == '') {
                let uId: string = uuidv4();
                const eHome: Home | undefined = await getRepository(Home).createQueryBuilder('home').where('home.id = :id', { id: uId }).getOne();
                if (typeof eHome === 'undefined') {
                    tmpHomeId = uId;
                }
            }

            const nowTimeStamp = this.timestamp.convert(Date.now());

            const queryBuilder = connection.createQueryBuilder(queryRunner);
            await queryBuilder
                .insert()
                .into(Home)
                .values({
                    id: tmpHomeId,
                    userId: verifyUser.data,
                    name: 'Default Home',
                    isOwner: true,
                    appCode: param.appCode,
                    createdAt: nowTimeStamp,
                    createdBy: verifyUser.data,
                })
                .execute();

            await queryBuilder
                .insert()
                .into(Member)
                .values({
                    id: verifyUser.data,
                    homeId: tmpHomeId,
                    email: param?.email,
                    name: param?.name,
                    state: true,
                    isOwner: true,
                    appCode: param.appCode,
                    createdAt: nowTimeStamp,
                    createdBy: verifyUser.data,
                })
                .execute();

            await queryBuilder
                .insert()
                .into(HomeStatistical)
                .values({
                    homeId: tmpHomeId,
                    userId: verifyUser.data,
                    cAreas: 0,
                    cEntities: 0,
                    cHC: 0,
                    appCode: param.appCode,
                    createdAt: nowTimeStamp,
                    createdBy: verifyUser.data,
                })
                .execute();

            await queryBuilder
                .update(Invitation)
                .set({
                    memberId: verifyUser.data,
                    appCode: param.appCode,
                    updatedAt: nowTimeStamp,
                    updatedBy: verifyUser.data,
                })
                .where('memberEmail = :email', {
                    email: param.email,
                })
                .execute();

            await queryBuilder
                .insert()
                .into(User)
                .values({
                    id: verifyUser.data,
                    name: param.name,
                    phone: param.phone,
                    email: param.email,
                    address: param.address,
                    lang: param.lang,
                    fcm: param.fcm,
                    appCode: param.appCode,
                    createdAt: nowTimeStamp,
                    createdBy: verifyUser.data,
                })
                .execute();

            //Need To Call Policy Service Here
            //Open full resource for owner

            await queryRunner.commitTransaction();
            return this.responser.Created(res, { message: 'User has been created successfully' });
        } catch (err) {
            await queryRunner.rollbackTransaction();
            this.logger.Error({ path: 'User.controller.ts', resource: 'create:catch', mess: err });
            return this.responser.BadRequest(res, { message: err });
        } finally {
            await queryRunner.release();
            await this.semaphore.release(lockResource);
        }
    };

    /**
     * ## Verify Email
     *
     * ### The request api:
     * ### <span style="background-color:#49cc90; padding: 2px 15px; border-radius: 5px; color: white">POST</span> /home/v1/user/verify-email
     *
     * - **Note:** The parameter will be sent in the body of request
     * - **Note:** Need to be set the `DEBUG_LEVEL` to `debug` in **.env** file for using `ILogger`
     *
     * @param req - the request delegate of client
     * `req` will be include a limited fields
     *
     * |Parameters|Required/Optional|Type|Detail|
     * |----------|-----------------|----|------|
     * |email | required | nvarchar(256) | The email that need to be verify|
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
     * |<span style="color:red">400</span> | Occur if an exception raised |
     * |<span style="color:red">401</span> | Occur if doesn't have permission |
     * |<span style="color:red">406</span> | Occur if one of the field in request is not acceptable |
     *
     * - The response message will be display in the format as the below
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
    verifyEmail = async (req: Request, res: Response): Promise<void> => {
        try {
            const param = req.body;
            const existedUser: User | undefined = await getRepository(User)
                .createQueryBuilder('user')
                .where('user.email = :email', { email: param.email })
                .andWhere('user.appCode = :appCode', { appCode: param.appCode })
                .getOne();

            this.logger.Info({ path: 'User.controller.ts', resource: 'verifyEmail:existedUser', mess: JSON.stringify(existedUser) });

            if (typeof existedUser !== 'undefined') {
                this.logger.Error({ path: 'User.controller.ts', resource: 'verifyEmail:existedUser', mess: ErrorCode.NSERR_USEREMAILREGISTERED });
                return this.responser.Conflict(res, { code: ErrorCode.NSERR_USEREMAILREGISTERED });
            }

            this.logger.Info({ path: 'User.controller.ts', resource: 'create:signUp:timer:start', mess: Date.now() });
            const signUp = await this.auth.signUp({ email: param.email, appCode: param.appCode });
            this.logger.Info({ path: 'User.controller.ts', resource: 'create:signUp:timer:stop', mess: Date.now() });
            this.logger.Info({ path: 'User.controller.ts', resource: 'verifyEmail:signUp', mess: JSON.stringify(signUp) });

            if (signUp?.errStatus) {
                this.logger.Error({ path: 'User.controller.ts', resource: 'verifyEmail:errStatus', mess: signUp?.errCode });
                switch (signUp?.errCode) {
                    case ErrorCode.NSERR_USEREXISTED:
                        return this.responser.Conflict(res, { code: signUp?.errCode, trace: `${signUp?.errCode}_${signUp?.traceCode}` });
                    default:
                        return this.responser.BadRequest(res, { code: ErrorCode.NSERR_UNKNOWN });
                }
            }

            return this.responser.Ok(res, { message: 'Please checking your email to acquire token' });
        } catch (err) {
            this.logger.Error({ path: 'User.controller.ts', resource: 'verifyEmail:catch', mess: err });
            return this.responser.BadRequest(res, { message: err });
        }
    };

    /**
     * ## Forgot password
     *
     * ### The request api:
     * ### <span style="background-color:#49cc90; padding: 2px 15px; border-radius: 5px; color: white">POST</span> /home/v1/user/forgot-password
     *
     * - **Note:** The parameter will be sent in the body of request
     * - **Note:** Need to be set the `DEBUG_LEVEL` to `debug` in **.env** file for using `ILogger`
     *
     * @param req - the request delegate of client
     * `req` will be include a limited fields
     *
     * |Parameters|Required/Optional|Type|Detail|
     * |----------|-----------------|----|------|
     * |email | required | nvarchar(50) | The email that need to be verify|
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
     * |<span style="color:red">400</span> | Occur if an exception raised |
     * |<span style="color:red">401</span> | Occur if doesn't have permission |
     * |<span style="color:red">406</span> | Occur if one of the field in request is not acceptable |
     *
     * - The response message will be display in the format as the below
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
    forgotPassword = async (req: Request, res: Response): Promise<void> => {
        try {
            const param = req.body;
            const existedUser: User | undefined = await getRepository(User)
                .createQueryBuilder('user')
                .where('user.email = :email', { email: param.email })
                .andWhere('user.appCode = :appCode', { appCode: param.appCode })
                .getOne();

            this.logger.Info({ path: 'User.controller.ts', resource: 'forgotPassword:existedUser', mess: JSON.stringify(existedUser) });

            if (typeof existedUser === 'undefined') {
                this.logger.Error({ path: 'User.controller.ts', resource: 'forgotPassword:existedUser', mess: ErrorCode.NSERR_USEREMAILNOTFOUND });
                return this.responser.NotFound(res, { code: ErrorCode.NSERR_USEREMAILNOTFOUND });
            }

            this.logger.Info({ path: 'User.controller.ts', resource: 'create:forgotPassword:timer:start', mess: Date.now() });
            const forgot = await this.auth.forgotPassword({ email: param.email, appCode: param.appCode });
            this.logger.Info({ path: 'User.controller.ts', resource: 'create:forgotPassword:timer:stop', mess: Date.now() });

            this.logger.Info({ path: 'User.controller.ts', resource: 'forgotPassword:forgot', mess: JSON.stringify(forgot) });

            if (forgot.errStatus) {
                this.logger.Error({ path: 'User.controller.ts', resource: 'forgotPassword:errStatus', mess: forgot?.errCode });
                switch (forgot?.errCode) {
                    case ErrorCode.NSERR_USEREMAILNOTFOUND:
                        return this.responser.NotFound(res, { code: forgot?.errCode, trace: `${forgot?.errCode}_${forgot?.traceCode}` });
                    default:
                        return this.responser.BadRequest(res, { code: ErrorCode.NSERR_UNKNOWN });
                }
            }

            return this.responser.Ok(res, { message: 'Please checking your email to acquire token' });
        } catch (err) {
            this.logger.Error({ path: 'User.controller.ts', resource: 'forgotPassword:catch', mess: err });
            return this.responser.BadRequest(res, { message: err });
        }
    };

    /**
     * ## Update a new password by token
     *
     * ### The request api:
     * ### <span style="background-color:#fca130; padding: 2px 15px; border-radius: 5px; color: white">PUT</span> /home/v1/user/new-password
     *
     * - **Note:** The parameter will be sent in the body of request
     * - **Note:** Need to be set the `DEBUG_LEVEL` to `debug` in **.env** file for using `ILogger`
     * - **Note:** Need to add `jwt token` into the header to bypass gateway.
     *
     * ```js
     *      headers['Authorization'] = `${jwt_token}`
     * ```
     *
     * @param req - the request delegate of client
     * `req` will be include a limited fields
     *
     * |Parameters|Required/Optional|Type|Detail|
     * |----------|-----------------|----|------|
     * |email | required | nvarchar(50) | The email of your account that need to be update new password|
     * |token | required | nvarchar(4) | The verify token that sent to your registered email|
     * |password | required | nvarchar(256) | The new password of your account that need to be updated|
     * |password_cfm | required | nvarchar(256) | The confirmation password of your account that need to be updated|
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
     * |<span style="color:red">400</span> | Occur if an exception raised or old password is incorrect |
     * |<span style="color:red">401</span> | Occur if doesn't have permission |
     * |<span style="color:red">404</span> | Occur if your account cound not be found in db |
     * |<span style="color:red">406</span> | Occur if one of the field in request is not acceptable |
     *
     * - The response message will be display in the format as the below
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
     *
     */
    newPassword = async (req: Request, res: Response): Promise<void> => {
        try {
            const param = req.body;
            const existedUser: User | undefined = await getRepository(User)
                .createQueryBuilder('user')
                .where('user.email = :email', { email: param.email })
                .andWhere('user.appCode = :appCode', { appCode: param.appCode })
                .getOne();

            this.logger.Info({ path: 'User.controller.ts', resource: 'newPassword:existedUser', mess: JSON.stringify(existedUser) });

            if (typeof existedUser === 'undefined') {
                this.logger.Error({ path: 'User.controller.ts', resource: 'newPassword:existedUser', mess: ErrorCode.NSERR_USEREMAILNOTFOUND });
                return this.responser.NotFound(res, { code: ErrorCode.NSERR_USEREMAILNOTFOUND });
            }
            this.logger.Info({ path: 'User.controller.ts', resource: 'create:newPassword:timer:start', mess: Date.now() });
            const newPassword = await this.auth.newPassword({
                email: param.email,
                password: param.password,
                token: param.token,
                appCode: param.appCode,
            });
            this.logger.Info({ path: 'User.controller.ts', resource: 'create:newPassword:timer:stop', mess: Date.now() });
            this.logger.Info({ path: 'User.controller.ts', resource: 'newPassword:newPassword', mess: JSON.stringify(newPassword) });

            if (newPassword.errStatus) {
                this.logger.Error({ path: 'User.controller.ts', resource: 'newPassword:errStatus', mess: newPassword?.errCode });
                switch (newPassword?.errCode) {
                    case ErrorCode.NSERR_USERCODEEXPIRED:
                        return this.responser.BadRequest(res, { code: newPassword?.errCode, trace: `${newPassword?.errCode}_${newPassword?.traceCode}` });
                    case ErrorCode.NSERR_USERCODENOTMATCH:
                        return this.responser.BadRequest(res, { code: newPassword?.errCode, trace: `${newPassword?.errCode}_${newPassword?.traceCode}` });
                    default:
                        return this.responser.BadRequest(res, { code: ErrorCode.NSERR_UNKNOWN });
                }
            }

            return this.responser.Ok(res, { message: 'Your password has been updated successfully' });
        } catch (err) {
            this.logger.Error({ path: 'User.controller.ts', resource: 'newPassword:catch', mess: err });
            return this.responser.BadRequest(res, { message: err });
        }
    };

    /**
     * ## Update a new password by old password
     *
     * ### The request api:
     * ### <span style="background-color:#fca130; padding: 2px 15px; border-radius: 5px; color: white">PUT</span> /home/v1/user/update-password
     *
     * - **Note:** The parameter will be sent in the body of request
     * - **Note:** Need to be set the `DEBUG_LEVEL` to `debug` in **.env** file for using `ILogger`
     * - **Note:** Need to add `jwt token` into the header to bypass gateway.
     *
     * ```js
     *      headers['Authorization'] = `${jwt_token}`
     * ```
     *
     * @param req - the request delegate of client
     * `req` will be include a limited fields
     *
     * |Parameters|Required/Optional|Type|Detail|
     * |----------|-----------------|----|------|
     * |password_old | required | nvarchar(256) | The old password of your account that need to be updated|
     * |password | required | nvarchar(256) | The new password of your account that need to be updated|
     * |password_cfm | required | nvarchar(256) | The confirmation password of your account that need to be updated|
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
     * |<span style="color:red">400</span> | Occur if an exception raised or old password is incorrect |
     * |<span style="color:red">401</span> | Occur if doesn't have permission |
     * |<span style="color:red">404</span> | Occur if your account cound not be found in db |
     * |<span style="color:red">406</span> | Occur if one of the field in request is not acceptable |
     *
     * - The response message will be display in the format as the below
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
     *
     */
    updatePassword = async (req: Request, res: Response): Promise<void> => {
        try {
            const param = req.body;
            const existedUser: User | undefined = await getRepository(User)
                .createQueryBuilder('user')
                .where('user.id = :userId', { userId: param.userId })
                .getOne();

            this.logger.Info({ path: 'User.controller.ts', resource: 'updatePassword:existedUser', mess: JSON.stringify(existedUser) });

            if (typeof existedUser === 'undefined') {
                this.logger.Error({ path: 'User.controller.ts', resource: 'updatePassword:existedUser', mess: ErrorCode.NSERR_USERNOTFOUND });
                return this.responser.NotFound(res, { code: ErrorCode.NSERR_USERNOTFOUND });
            }

            if (param?.password_old?.trim?.() === param?.password?.trim?.()) {
                this.logger.Error({ path: 'User.controller.ts', resource: 'updatePassword:password_old', mess: ErrorCode.NSERR_USERNEWPWDEQUALOLDPWD });
                return this.responser.Conflict(res, { code: ErrorCode.NSERR_USERNEWPWDEQUALOLDPWD });
            }
            this.logger.Info({ path: 'User.controller.ts', resource: 'create:updatePassword:timer:start', mess: Date.now() });
            const updatePassword = await this.auth.updatePassword(param.password_old, param.password, req.headers.authorization);
            this.logger.Info({ path: 'User.controller.ts', resource: 'create:updatePassword:timer:stop', mess: Date.now() });
            this.logger.Info({ path: 'User.controller.ts', resource: 'updatePassword:updatePassword', mess: JSON.stringify(updatePassword) });

            if (updatePassword.errStatus) {
                this.logger.Error({ path: 'User.controller.ts', resource: 'updatePassword:errStatus', mess: updatePassword?.errCode });
                switch (updatePassword?.errCode) {
                    case ErrorCode.NSERR_USEROLDPWDWRONG:
                        return this.responser.BadRequest(res, {
                            code: updatePassword?.errCode,
                            trace: `${updatePassword?.errCode}_${updatePassword?.traceCode}`,
                        });
                    default:
                        return this.responser.BadRequest(res, { code: ErrorCode.NSERR_UNKNOWN });
                }
            }

            return this.responser.Ok(res, { message: 'Your password has been updated successfully' });
        } catch (err) {
            this.logger.Error({ path: 'User.controller.ts', resource: 'updatePassword:catch', mess: err });
            return this.responser.BadRequest(res, { message: err });
        }
    };
    /**
     * ## Update an existed user info that satisfy the input conditions
     *
     * ### The request api:
     * ### <span style="background-color:#fca130; padding: 2px 15px; border-radius: 5px; color: white">PUT</span> /home/v1/user
     *
     * - **Note:** The parameter will be sent in the body of request
     * - **Note:** Need to be set the `DEBUG_LEVEL` to `debug` in **.env** file for using `ILogger`
     * - **Note:** Need to add `jwt token` into the header to bypass gateway.
     *
     * ```js
     *      headers['Authorization'] = `${jwt_token}`
     * ```
     *
     * @param req - the request delegate of client
     * `req` will be include a limited fields
     *
     * |Parameters|Required/Optional|Type|Detail|
     * |----------|-----------------|----|------|
     * |name | optional | nvarchar(256) | The name of the home that need to be updated|
     * |phone | optional | nvarchar(32) | The phone of the user that need to be updated|
     * |address | optional | nvarchar(512) | The address of the user that need to be updated|
     * |fcm | optional | nvarchar(512) | The firebase token of the user that need to be updated|
     * |lang | optional | nvarchar(16) | The language of the user that need to be updated, language will be in <span style="color:green">vi</span> or <span style="color:green">en</span>|
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
     * |<span style="color:red">400</span> | Occur if an exception raised |
     * |<span style="color:red">401</span> | Occur if doesn't have permission |
     * |<span style="color:red">404</span> | Occur if the home cound not be found in db |
     * |<span style="color:red">406</span> | Occur if one of the field in request is not acceptable |
     *
     * - The response message will be display in the format as the below
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
     *
     */
    update = async (req: any = {}, res: any = {}): Promise<void> => {
        const param: any = req.body;
        const lockResource = `/home/${req.body.userId}/${req.body.appCode}/updateUser`;
        await this.semaphore.acquire(lockResource);
        const connection = getConnection();
        const queryRunner = connection.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            let isChanged: boolean = false;
            const existedUser: User | undefined = await getRepository(User).createQueryBuilder('user').where('user.id = :id', { id: param.userId }).getOne();
            this.logger.Info({ path: 'User.controller.ts', resource: 'update:existedUser', mess: JSON.stringify(existedUser) });
            let userTmp = {
                name: existedUser?.name,
                phone: existedUser?.phone,
                address: existedUser?.address,
                fcm: existedUser?.fcm,
                avatar: existedUser?.avatar,
                lang: existedUser?.lang,
            };

            if (typeof existedUser === 'undefined') {
                this.logger.Error({ path: 'User.controller.ts', resource: 'update:existedUser', mess: ErrorCode.NSERR_USERNOTFOUND });
                return this.responser.NotFound(res, { code: ErrorCode.NSERR_USERNOTFOUND });
            }

            if (param.name && typeof param.name !== 'undefined' && param.name !== '' && existedUser!?.name !== param.name) {
                userTmp.name = param.name;
                isChanged = true;
            }

            if (param.phone && typeof param.phone !== 'undefined' && param.phone !== '' && existedUser!?.phone !== param.phone) {
                userTmp.phone = param.phone;
                isChanged = true;
            }

            if (param.address && typeof param.address !== 'undefined' && param.address !== '' && existedUser!?.address !== param.address) {
                userTmp.address = param.address;
                isChanged = true;
            }

            if (param.fcm && typeof param.fcm !== 'undefined' && param.fcm !== '' && existedUser!?.fcm !== param.fcm) {
                userTmp.fcm = param.fcm;
                isChanged = true;
            }

            if (param.avatar && typeof param.avatar !== 'undefined' && param.avatar !== '' && existedUser!?.avatar !== param.avatar) {
                userTmp.avatar = param.avatar;
                isChanged = true;
            }

            if (param.lang && typeof param.lang !== 'undefined' && param.lang !== '' && existedUser!?.lang !== param.lang) {
                userTmp.lang = param.lang;
                isChanged = true;
            }
            const queryBuilder = connection.createQueryBuilder(queryRunner);
            if (isChanged) {
                const nowTimeStamp = this.timestamp.convert(Date.now());

                await queryBuilder
                    .update(User)
                    .set({
                        name: userTmp.name,
                        phone: userTmp.phone,
                        address: userTmp.address,
                        fcm: userTmp.fcm,
                        avatar: userTmp.avatar,
                        lang: userTmp.lang,
                        updatedAt: nowTimeStamp,
                        updatedBy: param.userId,
                    })
                    .where('id = :id', { id: param.userId })
                    .execute();

                await queryRunner.commitTransaction();
                this.logger.Info({ path: 'User.controller.ts', resource: 'update:userTmp', mess: JSON.stringify(userTmp) });
                return this.responser.Ok(res, { message: 'done', data: { ...userTmp } });
            }
            return this.responser.BadRequest(res, { code: ErrorCode.NSERR_NOTHINGTOBECHANGED });
        } catch (err) {
            await queryRunner.rollbackTransaction();
            this.logger.Error({ path: 'User.controller.ts', resource: 'update:catch', mess: err });
            return this.responser.BadRequest(res, { message: err });
        } finally {
            await queryRunner.release();
            await this.semaphore.release(lockResource);
        }
    };
    /**
     * ## Delete an user that satisfy the input conditions
     *
     * ### The request api:
     * ### <span style="background-color:#f93e3e; padding: 2px 15px; border-radius: 5px; color: white">DELETE</span> /home/v1/user
     *
     * - **Note:** The parameter will be sent in the body of request
     * - **Note:** Need to be set the `DEBUG_LEVEL` to `debug` in **.env** file for using `ILogger`
     * - **Note:** Need to add `jwt token` into the header to bypass gateway.
     *
     * ```js
     *      headers['Authorization'] = `${jwt_token}`
     * ```
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
     * |<span style="color:red">400</span> | Occur if an exception raised |
     * |<span style="color:red">404</span> | Occur if the user cound not be found in db |
     * |<span style="color:red">406</span> | Occur if one of the field in request is not acceptable |
     *
     * - The response message will be display in the format as the below
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
     *
     */
    delete = async (_req: any = {}, _res: any = {}): Promise<void> => {};
}

export default UserController;
