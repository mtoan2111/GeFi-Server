import Joi from 'joi';
import { ErrorCode } from '../../response/Error.response';
// import { ValidationMethod } from '../../constant';
import { EValidationMethod } from '../../interface/IValid.interface';

class HomeValidation {
    private get = Joi.object({
        id: Joi.string()
            .optional()
            .allow(null, '')
            .max(128)
            .trim()
            .uuid({
                version: 'uuidv4',
                separator: '-',
            })
            .messages({
                'string.base': ErrorCode.NSERR_HOMEIDTYPE,
                'string.max': ErrorCode.NSERR_HOMEIDOUTOFBOUND,
                'string.guid': ErrorCode.NSERR_HOMEIDWRONGFORMAT,
            }),
        areaId: Joi.string()
            .optional()
            .allow(null, '')
            .max(128)
            .trim()
            .uuid({
                version: 'uuidv4',
                separator: '-',
            })
            .messages({
                'string.base': ErrorCode.NSERR_HOMEIDTYPE,
                'string.max': ErrorCode.NSERR_HOMEIDOUTOFBOUND,
                'string.guid': ErrorCode.NSERR_HOMEIDWRONGFORMAT,
            }),
        userId: Joi.string()
            .required()
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
        name: Joi.string().optional().allow(null, '').max(256).trim().messages({
            'string.base': ErrorCode.NSERR_HOMENAMETYPE,
            'string.max': ErrorCode.NSERR_HOMENAMEOUTOFBOUND,
        }),
        appCode: Joi.string().required().max(256).trim().messages({
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

    private create = Joi.object({
        userId: Joi.string()
            .required()
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
        name: Joi.string().required().max(256).trim().messages({
            'string.base': ErrorCode.NSERR_HOMENAMETYPE,
            'string.max': ErrorCode.NSERR_HOMENAMEOUTOFBOUND,
            'string.empty': ErrorCode.NSERR_HOMENAMEEMPTY,
            'any.required': ErrorCode.NSERR_HOMENAMEREQUIRED,
        }),
        logo: Joi.string().optional().allow(null, '').max(128).trim().messages({
            'string.base': ErrorCode.NSERR_HOMELOGOTYPE,
            'string.max': ErrorCode.NSERR_HOMELOGOOUTOFBOUND,
        }),
        pos: Joi.number().optional().allow(null, '').min(-1).max(127).messages({
            'number.base': ErrorCode.NSERR_HOMEPOSITIONTYPE,
            'number.min': ErrorCode.NSERR_HOMEPOSITIONOUTOFBOUND,
            'number.max': ErrorCode.NSERR_HOMEPOSITIONOUTOFBOUND,
        }),
        appCode: Joi.string().required().max(256).trim().messages({
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

    private update = Joi.object({
        id: Joi.string()
            .required()
            .max(128)
            .trim()
            .uuid({
                version: 'uuidv4',
                separator: '-',
            })
            .messages({
                'string.base': ErrorCode.NSERR_HOMEIDTYPE,
                'string.max': ErrorCode.NSERR_HOMEIDOUTOFBOUND,
                'string.guid': ErrorCode.NSERR_HOMEIDWRONGFORMAT,
                'string.empty': ErrorCode.NSERR_HOMEIDEMPTY,
                'any.required': ErrorCode.NSERR_HOMEIDREQUIRED,
            }),
        userId: Joi.string()
            .required()
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
        name: Joi.string().allow(null, '').max(256).optional().trim().messages({
            'string.base': ErrorCode.NSERR_HOMENAMETYPE,
            'string.max': ErrorCode.NSERR_HOMENAMEOUTOFBOUND,
        }),
        logo: Joi.string().optional().allow(null, '').max(128).trim().messages({
            'string.base': ErrorCode.NSERR_HOMELOGOTYPE,
            'string.max': ErrorCode.NSERR_HOMELOGOOUTOFBOUND,
        }),
        pos: Joi.number().optional().allow(null, '').min(-1).max(127).messages({
            'number.base': ErrorCode.NSERR_HOMEPOSITIONTYPE,
            'number.min': ErrorCode.NSERR_HOMEPOSITIONOUTOFBOUND,
            'number.max': ErrorCode.NSERR_HOMEPOSITIONOUTOFBOUND,
        }),
        appCode: Joi.string().required().max(256).trim().messages({
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

    private delete = Joi.object({
        id: Joi.string()
            .required()
            .max(128)
            .trim()
            .uuid({
                version: 'uuidv4',
                separator: '-',
            })
            .messages({
                'string.base': ErrorCode.NSERR_HOMEIDTYPE,
                'string.max': ErrorCode.NSERR_HOMEIDOUTOFBOUND,
                'string.guid': ErrorCode.NSERR_HOMEIDWRONGFORMAT,
                'string.empty': ErrorCode.NSERR_HOMEIDEMPTY,
                'any.required': ErrorCode.NSERR_HOMEIDREQUIRED,
            }),
        userId: Joi.string()
            .required()
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
        appCode: Joi.string().required().max(256).trim().messages({
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

export default new HomeValidation();
