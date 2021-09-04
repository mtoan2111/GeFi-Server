import Joi from 'joi';
import { ErrorCode } from '../../response/Error.response';
// import { ValidationMethod } from '../../constant';
import { EValidationMethod } from '../../interface/IValid.interface';

class EntityValidation {
    private get = Joi.object({
        id: Joi.string().optional().allow(null, '').max(128).trim().messages({
            'string.base': ErrorCode.NSERR_ENTITYIDTYPE,
            'string.max': ErrorCode.NSERR_ENTITYIDOUTOFBOUND,
        }),
        homeId: Joi.string()
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
        sentitive: Joi.boolean().required().messages({
            'boolean.base': ErrorCode.NSERR_ENTITYSENTITIVETYPE,
            'any.required': ErrorCode.NSERR_ENTITYSENTITIVEREQUIRED,
        }),
        memberId: Joi.string()
            .optional()
            .allow(null, '')
            .max(128)
            .trim()
            .uuid({
                version: 'uuidv4',
                separator: '-',
            })
            .messages({
                'string.base': ErrorCode.NSERR_MEMBERIDTYPE,
                'string.max': ErrorCode.NSERR_MEMBERIDOUTOFBOUND,
                'string.guid': ErrorCode.NSERR_MEMBERIDWRONGFORMAT,
            }),
        parentId: Joi.string().optional().allow(null, '').max(128).trim().messages({
            'string.base': ErrorCode.NSERR_ENTITYPARENTIDTYPE,
            'string.max': ErrorCode.NSERR_ENTITYPARENTOUTOFBOUND,
        }),
        familyName: Joi.string().optional().allow(null, '').max(256).trim().messages({
            'string.base': ErrorCode.NSERR_ENTITYTYPENAMETYPE,
            'string.max': ErrorCode.NSERR_ENTITYTYPENAMEOUTOFBOUND,
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
                'string.base': ErrorCode.NSERR_AREAIDTYPE,
                'string.max': ErrorCode.NSERR_AREAIDOUTOFBOUND,
                'string.guid': ErrorCode.NSERR_AREAIDWRONGFORMAT,
            }),
        name: Joi.string().optional().allow(null, '').max(256).trim().messages({
            'string.base': ErrorCode.NSERR_ENTITYNAMETYPE,
            'string.max': ErrorCode.NSERR_ENTITYNAMEOUTOFBOUND,
        }),
        vendorCode: Joi.string().optional().allow(null, '').max(128).trim().messages({
            'string.base': ErrorCode.NSERR_ENTITYVENDORTYPE,
            'string.max': ErrorCode.NSERR_ENTITYVENDOROUTOFBOUND,
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

    private getUpdateInfo = Joi.object({
        id: Joi.string().optional().allow(null, '').max(128).trim().messages({
            'string.base': ErrorCode.NSERR_ENTITYIDTYPE,
            'string.max': ErrorCode.NSERR_ENTITYIDOUTOFBOUND,
        }),
        homeId: Joi.string()
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
        parentId: Joi.string().optional().allow(null, '').max(128).trim().messages({
            'string.base': ErrorCode.NSERR_ENTITYPARENTIDTYPE,
            'string.max': ErrorCode.NSERR_ENTITYPARENTOUTOFBOUND,
        }),
        name: Joi.string().optional().allow(null, '').max(256).trim().messages({
            'string.base': ErrorCode.NSERR_ENTITYNAMETYPE,
            'string.max': ErrorCode.NSERR_ENTITYNAMEOUTOFBOUND,
        }),
        vendorCode: Joi.string().optional().allow(null, '').max(128).trim().messages({
            'string.base': ErrorCode.NSERR_ENTITYVENDORTYPE,
            'string.max': ErrorCode.NSERR_ENTITYVENDOROUTOFBOUND,
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
        id: Joi.string().required().max(128).trim().messages({
            'string.base': ErrorCode.NSERR_ENTITYIDTYPE,
            'string.max': ErrorCode.NSERR_ENTITYIDOUTOFBOUND,
            'string.empty': ErrorCode.NSERR_ENTITYIDEMPTY,
            'any.required': ErrorCode.NSERR_ENTITYIDREQUIRED,
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
        homeId: Joi.string()
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
        typeCode: Joi.string().required().max(128).trim().messages({
            'string.base': ErrorCode.NSERR_ENTITYTYPECODETYPE,
            'string.max': ErrorCode.NSERR_ENTITYTYPECODEOUTOFBOUND,
            'string.guid': ErrorCode.NSERR_ENTITYTYPECODEWRONGFORMAT,
            'string.empty': ErrorCode.NSERR_ENTITYTYPECODEEMPTY,
            'any.required': ErrorCode.NSERR_ENTITYTYPECODEREQUIRED,
        }),
        appCode: Joi.string().required().max(256).trim().messages({
            'string.base': ErrorCode.NSERR_APPCODETYPE,
            'string.max': ErrorCode.NSERR_APPCODEOUTOFBOUND,
            'string.empty': ErrorCode.NSERR_APPCODEEMPTY,
            'any.required': ErrorCode.NSERR_APPCODEREQUIRED,
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
                'string.base': ErrorCode.NSERR_AREAIDTYPE,
                'string.max': ErrorCode.NSERR_AREAIDOUTOFBOUND,
                'string.guid': ErrorCode.NSERR_AREAIDWRONGFORMAT,
            }),
        parentId: Joi.string().optional().allow(null, '').max(128).trim().messages({
            'string.base': ErrorCode.NSERR_ENTITYPARENTIDTYPE,
            'string.max': ErrorCode.NSERR_ENTITYPARENTOUTOFBOUND,
        }),
        name: Joi.string().required().max(256).trim().messages({
            'string.base': ErrorCode.NSERR_ENTITYNAMETYPE,
            'string.empty': ErrorCode.NSERR_ENTITYNAMEEMPTY,
            'string.max': ErrorCode.NSERR_ENTITYNAMEOUTOFBOUND,
            'any.required': ErrorCode.NSERR_ENTITYTYPENAMEREQUIRED,
        }),
        token: Joi.number().optional().integer().allow(null, '').messages({
            'number.base': ErrorCode.NSERR_ENTITYPAIRINGTOKENTYPE,
            'number.max': ErrorCode.NSERR_ENTITYPAIRINGTOKENOUTOFBOUND,
        }),
        logo: Joi.string().optional().allow(null, '').max(512).trim().messages({
            'string.base': ErrorCode.NSERR_ENTITYLOGOTYPE,
            'string.max': ErrorCode.NSERR_ENTITYLOGOOUTOFBOUND,
        }),
        pos: Joi.number().optional().allow(null, '').integer().min(-1).max(1023).messages({
            'number.base': ErrorCode.NSERR_ENTITYPOSITIONTYPE,
            'number.min': ErrorCode.NSERR_ENTITYPOSITIONOUTOFBOUND,
            'number.max': ErrorCode.NSERR_ENTITYPOSITIONOUTOFBOUND,
        }),
        extra: Joi.object().optional(),
    })
        .messages({
            'object.unknown': ErrorCode.NSERR_PARAMUNKNOWN,
        })
        .options({
            abortEarly: true,
        });

    private share = Joi.object({
        ids: Joi.array()
            .required()
            .items(
                Joi.string().required().max(128).trim().messages({
                    'string.base': ErrorCode.NSERR_ENTITYIDTYPE,
                    'string.max': ErrorCode.NSERR_ENTITYIDOUTOFBOUND,
                    'string.empty': ErrorCode.NSERR_ENTITYIDEMPTY,
                    'any.required': ErrorCode.NSERR_ENTITYIDREQUIRED,
                }),
            )
            .messages({
                'array.includesRequiredUnknowns': ErrorCode.NSERR_ENTITIESSHARINGEMPTY,
                'any.required': ErrorCode.NSERR_ENTITIESSHARINGREQUIRED,
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
        homeId: Joi.string()
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
        memberId: Joi.string()
            .required()
            .max(128)
            .trim()
            .uuid({
                version: 'uuidv4',
                separator: '-',
            })
            .messages({
                'string.base': ErrorCode.NSERR_MEMBERIDTYPE,
                'string.max': ErrorCode.NSERR_MEMBERIDOUTOFBOUND,
                'string.guid': ErrorCode.NSERR_MEMBERIDWRONGFORMAT,
                'string.empty': ErrorCode.NSERR_MEMBERIDEMPTY,
                'any.required': ErrorCode.NSERR_MEMBERIDREQUIRED,
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

    private unshare = Joi.object({
        ids: Joi.array()
            .required()
            .items(
                Joi.string().required().max(128).trim().messages({
                    'string.base': ErrorCode.NSERR_ENTITYIDTYPE,
                    'string.max': ErrorCode.NSERR_ENTITYIDOUTOFBOUND,
                    'string.empty': ErrorCode.NSERR_ENTITYIDEMPTY,
                    'any.required': ErrorCode.NSERR_ENTITYIDREQUIRED,
                }),
            )
            .messages({
                'array.includesRequiredUnknowns': ErrorCode.NSERR_ENTITIESSHARINGEMPTY,
                'any.required': ErrorCode.NSERR_ENTITIESSHARINGREQUIRED,
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
        homeId: Joi.string()
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
        memberId: Joi.string()
            .required()
            .max(128)
            .trim()
            .uuid({
                version: 'uuidv4',
                separator: '-',
            })
            .messages({
                'string.base': ErrorCode.NSERR_MEMBERIDTYPE,
                'string.max': ErrorCode.NSERR_MEMBERIDOUTOFBOUND,
                'string.guid': ErrorCode.NSERR_MEMBERIDWRONGFORMAT,
                'string.empty': ErrorCode.NSERR_MEMBERIDEMPTY,
                'any.required': ErrorCode.NSERR_MEMBERIDREQUIRED,
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
        id: Joi.string().required().max(128).trim().messages({
            'string.base': ErrorCode.NSERR_ENTITYIDTYPE,
            'string.max': ErrorCode.NSERR_ENTITYIDOUTOFBOUND,
            'string.empty': ErrorCode.NSERR_ENTITYIDEMPTY,
            'any.required': ErrorCode.NSERR_ENTITYIDREQUIRED,
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
        homeId: Joi.string()
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
                'string.base': ErrorCode.NSERR_AREAIDTYPE,
                'string.max': ErrorCode.NSERR_AREAIDOUTOFBOUND,
                'string.guid': ErrorCode.NSERR_AREAIDWRONGFORMAT,
            }),
        name: Joi.string().optional().allow(null, '').max(256).trim().messages({
            'string.base': ErrorCode.NSERR_ENTITYNAMETYPE,
            'string.max': ErrorCode.NSERR_ENTITYNAMEOUTOFBOUND,
        }),
        logo: Joi.string().optional().allow(null, '').max(512).trim().messages({
            'string.base': ErrorCode.NSERR_ENTITYLOGOTYPE,
            'string.max': ErrorCode.NSERR_ENTITYLOGOOUTOFBOUND,
        }),
        pos: Joi.number().optional().allow(null, '').integer().min(-1).max(1023).messages({
            'number.base': ErrorCode.NSERR_ENTITYPOSITIONTYPE,
            'number.min': ErrorCode.NSERR_ENTITYPOSITIONOUTOFBOUND,
            'number.max': ErrorCode.NSERR_ENTITYPOSITIONOUTOFBOUND,
        }),
        extra: Joi.object().optional(),
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
        id: Joi.string().required().max(128).trim().messages({
            'string.base': ErrorCode.NSERR_ENTITYIDTYPE,
            'string.max': ErrorCode.NSERR_ENTITYIDOUTOFBOUND,
            'string.empty': ErrorCode.NSERR_ENTITYIDEMPTY,
            'any.required': ErrorCode.NSERR_ENTITYIDREQUIRED,
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
        homeId: Joi.string()
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
        [EValidationMethod.GETUPDATEINFO]: this.getUpdateInfo,
        [EValidationMethod.CREATE]: this.create,
        [EValidationMethod.SHARE]: this.share,
        [EValidationMethod.UNSHARE]: this.unshare,
        [EValidationMethod.UPDATE]: this.update,
        [EValidationMethod.DELETE]: this.delete,
    };

    public getValidSchema = (method: string): Joi.ObjectSchema<any> => {
        return this.hashMethod[method];
    };
}

export default new EntityValidation();
