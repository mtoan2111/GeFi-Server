import Joi from 'joi';
import { ErrorCode } from '../../response/Error.response';
// import { ValidationMethod } from '../../constant';
import { EValidationMethod } from '../../interface/IValid.interface';

class EntityTypeValidation {
    private get = Joi.object({
        userId: Joi.string()
            .optional()
            .allow(null, '')
            .max(128)
            .trim()
            .uuid({
                version: 'uuidv4',
                separator: '-',
            })
            .messages({
                'string.base': ErrorCode.NSERR_USERIDTYPE,
                'string.max': ErrorCode.NSERR_USERIDOUTOFBOUND,
                'string.guid': ErrorCode.NSERR_USERIDWRONGFORMAT,
                'string.empty': ErrorCode.NSERR_USERIDEMPTY,
                'any.required': ErrorCode.NSERR_USERIDREQUIRED,
            }),
        appCode: Joi.string().required().trim().max(256).messages({
            'string.base': ErrorCode.NSERR_APPCODETYPE,
            'string.max': ErrorCode.NSERR_APPCODEOUTOFBOUND,
            'string.empty': ErrorCode.NSERR_APPCODEEMPTY,
            'any.required': ErrorCode.NSERR_APPCODEREQUIRED,
        }),
    })
        .messages({
            'object.unknown': ErrorCode.NSERR_PARAMUNKNOWN,
        })
        .options({
            abortEarly: true,
        });

    private create = Joi.object();
    private update = Joi.object();
    private delete = Joi.object();

    private hashMethod = {
        [EValidationMethod.GET]: this.get,
        [EValidationMethod.CREATE]: this.create,
        [EValidationMethod.UPDATE]: this.update,
        [EValidationMethod.DELETE]: this.delete,
    };

    public getValidSchema = (method: string): Joi.ObjectSchema<any> => {
        return this.hashMethod[method];
    };
}

export default new EntityTypeValidation();
