import IAuth, { TAccount } from '../interface/IAuth.interface';
import ILogger from '../interface/ILogger.interface';
import { ErrorCode } from '../response/Error.response';
import { inject, injectable } from 'inversify';
import axios from 'axios';
const https = require('https');

@injectable()
class Auth implements IAuth {
    private logger: ILogger;
    private agent: any;
    constructor(@inject('Logger') logger: ILogger) {
        this.logger = logger;
        this.agent = new https.Agent({
            rejectUnauthorized: false,
        });
    }

    newPassword = async (option: TAccount): Promise<any> => {
        try {
            const { email, password, token, appCode } = option;
            let baseUri: string | undefined | null = 'https://dev-api.mht.vn/auth/';
            typeof process.env.AUTH_URL !== 'undefined' && (baseUri = process.env.AUTH_URL);
            const newPasswordUri = `${baseUri}v1/user/update-new-password`;
            this.logger.Info({ path: 'Auth.helper.ts', resource: 'newPassword:newPasswordUri', mess: newPasswordUri });

            const body = {
                email,
                newPassword: password,
                confirmToken: token?.toString?.(),
                appCode,
            };

            this.logger.Info({ path: 'Auth.helper.ts', resource: 'newPassword:request:body', mess: JSON.stringify(body) });

            return await axios
                .post(newPasswordUri, body, {
                    httpsAgent: this.agent,
                })
                .then((response) => {
                    if (response.status === 200) {
                        return response.data;
                    }
                })
                .then((data) => {
                    this.logger.Info({ path: 'Auth.helper.ts', resource: 'newPassword:request:data', mess: JSON.stringify(data) });
                    return Promise.resolve({
                        errStatus: false,
                    });
                })
                .catch((err) => {
                    this.logger.Error({ path: 'Auth.helper.ts', resource: 'newPassword:request:catch', mess: JSON.stringify(err?.response?.data) });
                    const traceCode: string = err?.response?.data?.errors?.[0]?.errorCode;
                    let errStatus: boolean = true;
                    let errCode: string = '';
                    switch (traceCode) {
                        case '08013600':
                            errCode = ErrorCode.NSERR_USERCODEEXPIRED;
                            break;
                        case '08013500':
                            errCode = ErrorCode.NSERR_USERCODENOTMATCH;
                            break;
                        default:
                            errCode = ErrorCode.NSERR_UNKNOWN;
                            break;
                    }
                    return Promise.resolve({
                        errStatus,
                        errCode,
                        traceCode,
                    });
                });
        } catch (err) {
            this.logger.Error({ path: 'Auth.helper.ts', resource: 'newPassword:catch', mess: err });
            return Promise.resolve({
                errStatus: true,
                errCode: ErrorCode.NSERR_UNKNOWN,
            });
        }
    };

    updatePassword = async (oldPassword: string, newPassword: string, jwt: string | undefined | null): Promise<any> => {
        try {
            let baseUri: string | undefined | null = 'https://dev-api.mht.vn/auth/';
            typeof process.env.AUTH_URL !== 'undefined' && (baseUri = process.env.AUTH_URL);
            const updatePasswordUri = `${baseUri}v1/user/set-password`;

            this.logger.Info({ path: 'Auth.helper.ts', resource: 'updatePassword:updatePasswordUri', mess: updatePasswordUri });

            const headers = {
                Authorization: jwt,
            };

            this.logger.Info({ path: 'Auth.helper.ts', resource: 'updatePassword:request:header', mess: JSON.stringify(headers) });

            const body = {
                oldPassword,
                newPassword,
            };

            this.logger.Info({ path: 'Auth.helper.ts', resource: 'updatePassword:request:body', mess: JSON.stringify(body) });

            return await axios
                .post(updatePasswordUri, body, {
                    headers,
                    httpsAgent: this.agent,
                })
                .then((response) => {
                    if (response.status === 200) {
                        return response.data;
                    }
                })
                .then((data) => {
                    this.logger.Info({ path: 'Auth.helper.ts', resource: 'updatePassword:request:data', mess: JSON.stringify(data) });
                    return Promise.resolve({
                        errStatus: false,
                    });
                })
                .catch((err) => {
                    this.logger.Error({ path: 'Auth.helper.ts', resource: 'updatePassword:request:catch', mess: JSON.stringify(err?.response?.data) });
                    const traceCode: string = err.response.data.errors?.[0]?.errorCode;
                    let errStatus: boolean = true;
                    let errCode: string = '';
                    switch (traceCode) {
                        case '08001600':
                            errCode = ErrorCode.NSERR_USEROLDPWDWRONG;
                            break;
                        default:
                            errCode = ErrorCode.NSERR_UNKNOWN;
                            break;
                    }
                    return Promise.resolve({
                        errStatus,
                        errCode,
                        traceCode,
                    });
                });
        } catch (err) {
            this.logger.Error({ path: 'Auth.helper.ts', resource: 'updatePassword:catch', mess: err });
            return Promise.resolve(false);
        }
    };

    signUp = async (options: TAccount): Promise<any> => {
        try {
            const { email, appCode } = options;
            let baseUri: string | undefined | null = 'https://dev-api.mht.vn/auth/';
            typeof process.env.AUTH_URL !== 'undefined' && (baseUri = process.env.AUTH_URL);
            const signUpUri = `${baseUri}v1/sign-up`;

            this.logger.Info({ path: 'Auth.helper.ts', resource: 'signUp:signUpUri', mess: signUpUri });

            const body = {
                email,
                appCode,
                appType: 'APP',
            };

            this.logger.Info({ path: 'Auth.helper.ts', resource: 'signUp:request:body', mess: JSON.stringify(body) });

            return await axios
                .post(signUpUri, body, {
                    httpsAgent: this.agent,
                })
                .then((response) => {
                    if (response.status === 200) {
                        return response.data;
                    }
                })
                .then((data) => {
                    this.logger.Info({ path: 'Auth.helper.ts', resource: 'signUp:request:data', mess: JSON.stringify(data) });
                    if (data?.email === email && data?.appCode === appCode) {
                        return Promise.resolve({
                            errStatus: false,
                        });
                    }
                    return Promise.resolve({
                        errStatus: true,
                        errCode: ErrorCode.NSERR_UNKNOWN,
                    });
                })
                .catch((err) => {
                    this.logger.Error({ path: 'Auth.helper.ts', resource: 'signUp:request:catch', mess: JSON.stringify(err?.response?.data) });
                    const traceCode: string = err.response.data.errors?.[0]?.errorCode;
                    let errStatus: boolean = true;
                    let errCode: string = '';
                    switch (traceCode) {
                        case '08000400':
                            errCode = ErrorCode.NSERR_USEREXISTED;
                            break;
                        case '08040700':
                            errCode = ErrorCode.NSERR_APPCODENOTFOUND;
                            break;
                        default:
                            errCode = ErrorCode.NSERR_UNKNOWN;
                            break;
                    }
                    return Promise.resolve({
                        errStatus,
                        errCode,
                        traceCode,
                    });
                });
        } catch (err) {
            this.logger.Error({ path: 'Auth.helper.ts', resource: 'signUp:catch', mess: err });
            return Promise.resolve({
                errStatus: true,
                errCode: ErrorCode.NSERR_UNKNOWN,
            });
        }
    };

    verifyAccount = async (option: TAccount): Promise<any> => {
        try {
            const { email, password, token, appCode } = option;
            let baseUri: string | undefined | null = 'https://dev-api.mht.vn/auth/';
            typeof process.env.AUTH_URL !== 'undefined' && (baseUri = process.env.AUTH_URL);
            const verifyAccountUri = `${baseUri}v1/confirmation/verify-user`;

            this.logger.Info({ path: 'Auth.helper.ts', resource: 'verifyAccount:verifyAccountUri', mess: verifyAccountUri });

            const body = {
                email,
                action: 'VERIFY_EMAIL',
                confirmToken: token?.toString?.(),
                password,
                appCode,
            };

            this.logger.Info({ path: 'Auth.helper.ts', resource: 'verifyAccount:request:body', mess: JSON.stringify(body) });

            return await axios
                .post(verifyAccountUri, body, {
                    httpsAgent: this.agent,
                })
                .then((response) => {
                    if (response.status === 200) {
                        return response.data;
                    }
                })
                .then((data) => {
                    this.logger.Info({ path: 'Auth.helper.ts', resource: 'verifyAccount:request:data', mess: JSON.stringify(data) });
                    return { error: false, data: data?.id };
                })
                .catch((err) => {
                    this.logger.Error({ path: 'Auth.helper.ts', resource: 'verifyAccount:request:catch', mess: JSON.stringify(err?.response?.data) });
                    const traceCode: string = err.response.data.errors?.[0]?.errorCode;
                    let errStatus: boolean = true;
                    let errCode: string = '';
                    switch (traceCode) {
                        case '08013500':
                            errCode = ErrorCode.NSERR_USERCODENOTMATCH;
                            break;
                        case '08000800':
                            errCode = ErrorCode.NSERR_USEREMAILNOTFOUND;
                            break;
                        case 'Not found':
                            errCode = ErrorCode.NSERR_USEREMAILNOTFOUND;
                            break;
                        case '08013600':
                            errCode = ErrorCode.NSERR_USERCODEEXPIRED;
                            break;
                        case '08040700':
                            errCode = ErrorCode.NSERR_APPCODENOTFOUND;
                            break;
                        default:
                            errCode = ErrorCode.NSERR_UNKNOWN;
                            break;
                    }
                    return Promise.resolve({
                        errStatus,
                        errCode,
                        traceCode,
                    });
                });
        } catch (err) {
            this.logger.Error({ path: 'Auth.helper.ts', resource: 'verifyAccount:catch', mess: err });
            return Promise.resolve({
                errStatus: true,
                errCode: ErrorCode.NSERR_UNKNOWN,
            });
        }
    };

    forgotPassword = async (option: TAccount): Promise<any> => {
        try {
            const { email, appCode } = option;
            let baseUri: string | undefined | null = 'https://dev-api.mht.vn/auth/';
            typeof process.env.AUTH_URL !== 'undefined' && (baseUri = process.env.AUTH_URL);
            const forgotPasswordUri = `${baseUri}v1/forgot-password`;

            this.logger.Info({ path: 'Auth.helper.ts', resource: 'forgotPassword:forgotPasswordUri', mess: forgotPasswordUri });

            const body = {
                email,
                appCode,
            };

            this.logger.Info({ path: 'Auth.helper.ts', resource: 'forgotPassword:request:body', mess: JSON.stringify(body) });

            return await axios
                .post(forgotPasswordUri, body, {
                    httpsAgent: this.agent,
                })
                .then((response) => {
                    if (response.status === 200) {
                        return response.data;
                    }
                })
                .then((data) => {
                    this.logger.Info({ path: 'Auth.helper.ts', resource: 'forgotPassword:request:data', mess: JSON.stringify(data) });
                    if (data?.user?.email === email && data?.user?.appCode === appCode) {
                        return Promise.resolve({
                            errStatus: false,
                        });
                    }
                    return Promise.resolve({
                        errStatus: false,
                        errCode: ErrorCode.NSERR_UNKNOWN,
                    });
                })
                .catch((err) => {
                    this.logger.Error({ path: 'Auth.helper.ts', resource: 'forgotPassword:request:catch', mess: JSON.stringify(err?.response?.data) });
                    const traceCode: string = err.response.data.errors?.[0]?.errorCode;
                    let errStatus: boolean = true;
                    let errCode: string = '';
                    switch (traceCode) {
                        case `08000800`:
                            errCode = ErrorCode.NSERR_USEREMAILNOTFOUND;
                            break;
                        case '08040700':
                            errCode = ErrorCode.NSERR_APPCODENOTFOUND;
                            break;
                        default:
                            errCode = ErrorCode.NSERR_UNKNOWN;
                            break;
                    }
                    return Promise.resolve({
                        errStatus,
                        errCode,
                        traceCode,
                    });
                });
        } catch (err) {
            this.logger.Error({ path: 'Auth.helper.ts', resource: 'forgotPassword:catch', mess: err });
            return Promise.resolve({
                errStatus: false,
                errCode: ErrorCode.NSERR_UNKNOWN,
            });
        }
    };

    auth = async (token: string): Promise<void> => {
        try {
            let baseUri: string | undefined | null = 'http://dev-api.mht.vn/auth/';
            typeof process.env.AUTH_URL !== 'undefined' && (baseUri = process.env.AUTH_URL);
            const authUri = `${baseUri}v1/auth`;

            this.logger.Info({ path: 'Auth.helper.ts', resource: 'auth:authUri', mess: authUri });

            const headers = {
                'Content-Type': 'application/json',
                Authorization: token,
            };

            this.logger.Info({ path: 'Auth.helper.ts', resource: 'auth:request:header', mess: JSON.stringify(headers) });

            const options = {
                headers,
                signal: undefined,
            };

            return await axios
                .get(authUri, options)
                .then((response) => {
                    if (response.status === 200) {
                        return response.data;
                    }
                })
                .then((data) => {
                    this.logger.Info({ path: 'Auth.helper.ts', resource: 'auth:request:data', mess: JSON.stringify(data) });
                    return data;
                })
                .catch((err) => {
                    this.logger.Error({ path: 'Auth.helper.ts', resource: 'auth:request:catch', mess: JSON.stringify(err?.response?.data) });
                    return false;
                });
        } catch (err) {
            this.logger.Error({ path: 'Auth.helper.ts', resource: 'auth:catch', mess: err });
        }
    };
}

export default Auth;
