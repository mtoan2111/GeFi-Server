import MatchValidation from '../valid/v1/Match.valid';
import IValidation, { TValidationHanlder, EValidationController, TValidationReponse } from '../interface/IValid.interface';
import Joi from 'joi';
import { injectable, inject } from 'inversify';
import ILogger from '../interface/ILogger.interface';
import { ErrorCode } from 'src/response/Error.response';

@injectable()
class Validation implements IValidation {
    hashValid = {
        [EValidationController.MATCH]: MatchValidation,
    };
    constructor(@inject('Logger') private logger: ILogger) {}

    valid = (option: TValidationHanlder): TValidationReponse => {
        try {
            const { controller, method, param } = option;

            this.logger.Info({ path: `${controller}.controller.ts`, resource: `${method}:param`, mess: JSON.stringify(param) });

            const validResult: Joi.ValidationResult = this.hashValid[controller]?.getValidSchema?.(method)?.validate?.(param);

            this.logger.Info({ path: `${controller}.controller.ts`, resource: `${method}:valid`, mess: JSON.stringify(validResult) });

            if (validResult?.error) {
                let errorDetail: string = validResult?.error?.details?.[0]?.message;
                return {
                    isValid: false,
                    reason: errorDetail,
                };
            }
            return {
                isValid: true,
                reason: '',
            };
        } catch (err) {
            this.logger.Error({ path: `${option?.controller}.controller.ts`, resource: `${option?.method}:param`, mess: err });
            return {
                isValid: false,
                reason: ErrorCode.NSERR_UNKNOWN,
            };
        }
    };
}

export default Validation;
