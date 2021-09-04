import Joi from 'joi';
// import { ValidationMethod } from '../../constant';
import { EValidationMethod } from '../../interface/IValid.interface';
import { ErrorCode } from '../../response/Error.response';

class AutomationValidation {
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
                'string.base': ErrorCode.NSERR_AUTOMATIONIDTYPE,
                'string.max': ErrorCode.NSERR_AUTOMATIONIDOUTOFBOUND,
                'string.guid': ErrorCode.NSERR_AUTOMATIONIDWRONGFORMAT,
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
        appCode: Joi.string().required().max(256).trim().messages({
            'string.base': ErrorCode.NSERR_APPCODETYPE,
            'string.max': ErrorCode.NSERR_APPCODEOUTOFBOUND,
            'string.empty': ErrorCode.NSERR_APPCODEEMPTY,
            'any.required': ErrorCode.NSERR_APPCODEREQUIRED,
        }),
        type: Joi.string().required().max(32).trim().messages({
            'string.base': ErrorCode.NSERR_AUTOMATIONTYPETYPE,
            'string.max': ErrorCode.NSERR_AUTOMATIONTYPEOUTOFBOUND,
            'string.empty': ErrorCode.NSERR_AUTOMATIONTYPEEMPTY,
            'any.required': ErrorCode.NSERR_AUTOMATIONTYPEREQUIRED,
        }),
        name: Joi.string().optional().allow(null, '').max(256).trim().messages({
            'string.base': ErrorCode.NSERR_AUTOMATIONNAMETYPE,
            'string.max': ErrorCode.NSERR_AUTOMATIONNAMEOUTOFBOUND,
        }),

        inputIds: Joi.array()
            .allow()
            .items(
                Joi.string().allow().max(128).trim().messages({
                    'string.base': ErrorCode.NSERR_ENTITYIDTYPE,
                    'string.max': ErrorCode.NSERR_ENTITYIDOUTOFBOUND,
                }),
            ),
        outputIds: Joi.array()
            .allow()
            .items(
                Joi.string().allow().max(128).trim().messages({
                    'string.base': ErrorCode.NSERR_ENTITYIDTYPE,
                    'string.max': ErrorCode.NSERR_ENTITYIDOUTOFBOUND,
                }),
            ),
    })
        .messages({
            'object.unknown': ErrorCode.NSERR_PARAMUNKNOWN,
        })
        .options({
            abortEarly: true,
        });

    private create = Joi.object({
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
        logo: Joi.string().optional().allow(null, '').max(128).trim().messages({
            'string.base': ErrorCode.NSERR_AREALOGOTYPE,
            'string.max': ErrorCode.NSERR_AREALOGOOUTOFBOUND,
        }),
        name: Joi.string().required().max(128).trim().messages({
            'string.base': ErrorCode.NSERR_AUTOMATIONNAMETYPE,
            'string.max': ErrorCode.NSERR_AUTOMATIONNAMEOUTOFBOUND,
            'string.empty': ErrorCode.NSERR_AUTOMATIONNAMEEMPTY,
            'any.required': ErrorCode.NSERR_AUTOMATIONNAMEREQUIRED,
        }),
        pos: Joi.number().optional().allow(null, '').min(-1).max(127).messages({
            'number.base': ErrorCode.NSERR_AUTOMATIONPOSITIONWRONGTYPE,
            'number.min': ErrorCode.NSERR_AUTOMATIONPOSITIONOUTOFBOUND,
            'number.max': ErrorCode.NSERR_AUTOMATIONPOSITIONOUTOFBOUND,
        }),
        appCode: Joi.string().required().max(256).trim().messages({
            'string.base': ErrorCode.NSERR_APPCODETYPE,
            'string.max': ErrorCode.NSERR_APPCODEOUTOFBOUND,
            'string.empty': ErrorCode.NSERR_APPCODEEMPTY,
            'any.required': ErrorCode.NSERR_APPCODEREQUIRED,
        }),
        type: Joi.string().required().valid('rule', 'scene', 'group').max(32).trim().messages({
            'string.base': ErrorCode.NSERR_AUTOMATIONTYPETYPE,
            'string.max': ErrorCode.NSERR_AUTOMATIONTYPEOUTOFBOUND,
            'string.empty': ErrorCode.NSERR_AUTOMATIONTYPEEMPTY,
            'any.required': ErrorCode.NSERR_AUTOMATIONTYPEREQUIRED,
            'any.only': ErrorCode.NSERR_AUTOMATIONTYPETYPE,
        }),
        logic: Joi.string().required().max(32).valid('and', 'or').trim().messages({
            'string.base': ErrorCode.NSERR_AUTOMATIONLOGICTYPE,
            'string.max': ErrorCode.NSERR_AUTOMATIONLOGICOUTOFBOUND,
            'string.empty': ErrorCode.NSERR_AUTOMATIONLOGICEMPTY,
            'any.required': ErrorCode.NSERR_AUTOMATIONLOGICREQUIRED,
            'any.only': ErrorCode.NSERR_AUTOMATIONLOGICTYPE,
        }),
        active: Joi.boolean().required().messages({
            'string.base': ErrorCode.NSERR_AUTOMATIONACTIVEWRONGTYPE,
            'string.max': ErrorCode.NSERR_AUTOMATIONACTIVEOUTOFBOUND,
            'string.empty': ErrorCode.NSERR_AUTOMATIONACTIVEEMPTY,
            'any.required': ErrorCode.NSERR_AUTOMATIONACTIVEREQUIRED,
        }),
        hcId: Joi.string().optional().allow(null, '').max(128).trim().messages({
            'string.base': ErrorCode.NSERR_AUTOMATIONHCIDWRONGTYPE,
            'string.max': ErrorCode.NSERR_AUTOMATIONHCIDOUTOFBOUND,
        }),
        processAt: Joi.string().required().valid('CLOUD', 'HC', 'APP').max(128).trim().messages({
            'string.base': ErrorCode.NSERR_AUTOMATIONPROCESSEDATTYPE,
            'string.empty': ErrorCode.NSERR_AUTOMATIONPROCESSEDATEMPTY,
            'string.max': ErrorCode.NSERR_AUTOMATIONPROCESSEDATOUTOFBOUND,
            'any.only': ErrorCode.NSERR_AUTOMATIONPROCESSEDATTYPE,
            'any.required': ErrorCode.NSERR_AUTOMATIONPROCESSEDATREQUIRED,
        }),
        timezone: Joi.number().required().min(-12).max(14).messages({
            'number.base': ErrorCode.NSERR_AUTOMATIONTIMEZONETYPE,
            'number.max': ErrorCode.NSERR_AUTOMATIONTIMEZONEOUTOFBOUND,
            'number.min': ErrorCode.NSERR_AUTOMATIONTIMEZONEOUTOFBOUND,
            'any.required': ErrorCode.NSERR_AUTOMATIONTIMEZONEREQUIRED,
        }),
        input: Joi.array()
            .required()
            .items(
                Joi.object({
                    id: Joi.string().required().max(128).trim().messages({
                        'string.base': ErrorCode.NSERR_ENTITYIDTYPE,
                        'string.max': ErrorCode.NSERR_ENTITYIDOUTOFBOUND,
                        'string.empty': ErrorCode.NSERR_ENTITYIDEMPTY,
                        'any.required': ErrorCode.NSERR_ENTITYIDREQUIRED,
                    }),
                    state: Joi.object({
                        onoff: Joi.boolean().optional().messages({
                            'boolean.base': ErrorCode.NSERR_AUTOMATIONINPUTSTATEONOFFWRONGTYPE,
                        }),
                        dim: Joi.number().optional().min(1).max(100).messages({
                            'number.base': ErrorCode.NSERR_AUTOMATIONINPUTSTATEDIMWRONGTYPE,
                            'number.min': ErrorCode.NSERR_AUTOMATIONINPUTSTATEDIMOUTOFBOUND,
                            'number.max': ErrorCode.NSERR_AUTOMATIONINPUTSTATEDIMOUTOFBOUND,
                        }),
                        colortem: Joi.number().optional().min(2700).max(6500).messages({
                            'number.base': ErrorCode.NSERR_AUTOMATIONINPUTSTATECOLORTEMWRONGTYPE,
                            'number.min': ErrorCode.NSERR_AUTOMATIONINPUTSTATECOLORTEMOUTOFBOUND,
                            'number.max': ErrorCode.NSERR_AUTOMATIONINPUTSTATECOLORTEMOUTOFBOUND,
                        }),
                        hsv: Joi.object({
                            h: Joi.number().optional().min(0).max(355).messages({
                                'number.base': ErrorCode.NSERR_AUTOMATIONINPUTSTATEHSV_HUEWRONGTYPE,
                                'number.min': ErrorCode.NSERR_AUTOMATIONINPUTSTATEHSV_HUEOUTOFBOUND,
                                'number.max': ErrorCode.NSERR_AUTOMATIONINPUTSTATEHSV_HUEOUTOFBOUND,
                            }),
                            s: Joi.number().optional().min(0).max(255).messages({
                                'number.base': ErrorCode.NSERR_AUTOMATIONINPUTSTATEHSV_SATURATIONWRONGTYPE,
                                'number.min': ErrorCode.NSERR_AUTOMATIONINPUTSTATEHSV_SATURATIONOUTOFBOUND,
                                'number.max': ErrorCode.NSERR_AUTOMATIONINPUTSTATEHSV_SATURATIONOUTOFBOUND,
                            }),
                            v: Joi.number().optional().min(1).max(100).messages({
                                'number.base': ErrorCode.NSERR_AUTOMATIONINPUTSTATEHSV_VALUEWRONGTYPE,
                                'number.min': ErrorCode.NSERR_AUTOMATIONINPUTSTATEHSV_VALUEOUTOFBOUND,
                                'number.max': ErrorCode.NSERR_AUTOMATIONINPUTSTATEHSV_VALUEOUTOFBOUND,
                            }),
                        }),
                        door: Joi.boolean().optional().messages({
                            'boolean.base': ErrorCode.NSERR_AUTOMATIONINPUTSTATEDOORWRONGTYPE,
                        }),
                        motion: Joi.boolean().optional().messages({
                            'boolean.base': ErrorCode.NSERR_AUTOMATIONINPUTSTATEMOTIONWRONGTYPE,
                        }),
                        contact: Joi.boolean().optional().messages({
                            'boolean.base': ErrorCode.NSERR_AUTOMATIONINPUTSTATECONTACTWRONGTYPE,
                        }),
                        humidity: Joi.number().optional().min(0).max(100).messages({
                            'number.base': ErrorCode.NSERR_AUTOMATIONINPUTSTATEHUMIDITYWRONGTYPE,
                            'number.min': ErrorCode.NSERR_AUTOMATIONINPUTSTATEHUMIDITYOUTOFBOUND,
                            'number.max': ErrorCode.NSERR_AUTOMATIONINPUTSTATEHUMIDITYOUTOFBOUND,
                        }),
                        temp: Joi.number().optional().min(-50).max(100).messages({
                            'number.base': ErrorCode.NSERR_AUTOMATIONINPUTSTATETEMPWRONGTYPE,
                            'number.min': ErrorCode.NSERR_AUTOMATIONINPUTSTATETEMPOUTOFBOUND,
                            'number.max': ErrorCode.NSERR_AUTOMATIONINPUTSTATETEMPOUTOFBOUND,
                        }),
                        opcupancy: Joi.number().optional().min(0).max(100).messages({
                            'number.base': ErrorCode.NSERR_AUTOMATIONINPUTSTATEOCUPANCYWRONGTYPE,
                            'number.min': ErrorCode.NSERR_AUTOMATIONINPUTSTATEOCUPANCYOUTOFBOUND,
                            'number.max': ErrorCode.NSERR_AUTOMATIONINPUTSTATEOCUPANCYOUTOFBOUND,
                        }),
                        light: Joi.number().optional().min(0).max(100000).messages({
                            'number.base': ErrorCode.NSERR_AUTOMATIONINPUTSTATELIGHTWRONGTYPE,
                            'number.min': ErrorCode.NSERR_AUTOMATIONINPUTSTATELIGHTOUTOFBOUND,
                            'number.max': ErrorCode.NSERR_AUTOMATIONINPUTSTATELIGHTOUTOFBOUND,
                        }),
                        fan: Joi.number().optional().min(0).max(100).messages({
                            'number.base': ErrorCode.NSERR_AUTOMATIONINPUTSTATEFANWRONGTYPE,
                            'number.min': ErrorCode.NSERR_AUTOMATIONINPUTSTATEFANOUTOFBOUND,
                            'number.max': ErrorCode.NSERR_AUTOMATIONINPUTSTATELIGHTOUTOFBOUND,
                        }),
                    })
                        .required()
                        .min(1)
                        .messages({
                            'object.base': ErrorCode.NSERR_AUTOMATIONINPUTSTATEWRONGTYPE,
                            'object.min': ErrorCode.NSERR_AUTOMATIONINPUTSTATEATLEASTONEOBJECT,
                            'object.empty': ErrorCode.NSERR_AUTOMATIONINPUTSTATEEMPTY,
                            'any.required': ErrorCode.NSERR_AUTOMATIONINPUTSTATEREQUIRED,
                        }),
                    operator: Joi.object({
                        onoff: Joi.string().optional().valid('eq', 'neq', 'le', 'ge', 'lt', 'gt').messages({
                            'string.base': ErrorCode.NSERR_AUTOMATIONINPUTOPERATORONOFFWRONGTYPE,
                            'any.only': ErrorCode.NSERR_AUTOMATIONINPUTOPERATORONOFFWRONGTYPE,
                        }),
                        dim: Joi.string().optional().valid('eq', 'neq', 'le', 'ge', 'lt', 'gt').messages({
                            'string.base': ErrorCode.NSERR_AUTOMATIONINPUTOPERATORDIMWRONGTYPE,
                            'any.only': ErrorCode.NSERR_AUTOMATIONINPUTOPERATORDIMWRONGTYPE,
                        }),
                        colortem: Joi.string().optional().valid('eq', 'neq', 'le', 'ge', 'lt', 'gt').messages({
                            'string.base': ErrorCode.NSERR_AUTOMATIONINPUTOPERATORCOLORTEMWRONGTYPE,
                            'any.only': ErrorCode.NSERR_AUTOMATIONINPUTOPERATORCOLORTEMWRONGTYPE,
                        }),
                        hsv: Joi.object({
                            h: Joi.string().optional().valid('eq', 'neq', 'le', 'ge', 'lt', 'gt').messages({
                                'string.base': ErrorCode.NSERR_AUTOMATIONINPUTOPERATORHSV_HUEWRONGTYPE,
                                'any.only': ErrorCode.NSERR_AUTOMATIONINPUTOPERATORHSV_HUEWRONGTYPE,
                            }),
                            s: Joi.string().optional().valid('eq', 'neq', 'le', 'ge', 'lt', 'gt').messages({
                                'string.base': ErrorCode.NSERR_AUTOMATIONINPUTOPERATORHSV_SATURATIONWRONGTYPE,
                                'any.only': ErrorCode.NSERR_AUTOMATIONINPUTOPERATORHSV_SATURATIONWRONGTYPE,
                            }),
                            v: Joi.string().optional().valid('eq', 'neq', 'le', 'ge', 'lt', 'gt').messages({
                                'string.base': ErrorCode.NSERR_AUTOMATIONINPUTOPERATORHSV_VALUEWRONGTYPE,
                                'any.only': ErrorCode.NSERR_AUTOMATIONINPUTOPERATORHSV_VALUEWRONGTYPE,
                            }),
                        }),
                        door: Joi.string().optional().valid('eq', 'neq', 'le', 'ge', 'lt', 'gt').messages({
                            'string.base': ErrorCode.NSERR_AUTOMATIONINPUTOPERATORDOORWRONGTYPE,
                            'any.only': ErrorCode.NSERR_AUTOMATIONINPUTOPERATORDOORWRONGTYPE,
                        }),
                        motion: Joi.string().optional().valid('eq', 'neq', 'le', 'ge', 'lt', 'gt').messages({
                            'string.base': ErrorCode.NSERR_AUTOMATIONINPUTOPERATORMOTIONWRONGTYPE,
                            'any.only': ErrorCode.NSERR_AUTOMATIONINPUTOPERATORMOTIONWRONGTYPE,
                        }),
                        contact: Joi.string().optional().valid('eq', 'neq', 'le', 'ge', 'lt', 'gt').messages({
                            'string.base': ErrorCode.NSERR_AUTOMATIONINPUTOPERATORCONTACTWRONGTYPE,
                            'any.only': ErrorCode.NSERR_AUTOMATIONINPUTOPERATORCONTACTWRONGTYPE,
                        }),
                        humidity: Joi.string().optional().valid('eq', 'neq', 'le', 'ge', 'lt', 'gt').messages({
                            'string.base': ErrorCode.NSERR_AUTOMATIONINPUTOPERATORHUMIDITYWRONGTYPE,
                            'any.only': ErrorCode.NSERR_AUTOMATIONINPUTOPERATORHUMIDITYWRONGTYPE,
                        }),
                        temp: Joi.string().optional().valid('eq', 'neq', 'le', 'ge', 'lt', 'gt').messages({
                            'string.base': ErrorCode.NSERR_AUTOMATIONINPUTOPERATORTEMPWRONGTYPE,
                            'any.only': ErrorCode.NSERR_AUTOMATIONINPUTOPERATORTEMPWRONGTYPE,
                        }),
                        opcupancy: Joi.string().optional().valid('eq', 'neq', 'le', 'ge', 'lt', 'gt').messages({
                            'string.base': ErrorCode.NSERR_AUTOMATIONINPUTOPERATOROCUPANCYWRONGTYPE,
                            'any.only': ErrorCode.NSERR_AUTOMATIONINPUTOPERATOROCUPANCYWRONGTYPE,
                        }),
                        light: Joi.string().optional().valid('eq', 'neq', 'le', 'ge', 'lt', 'gt').messages({
                            'string.base': ErrorCode.NSERR_AUTOMATIONINPUTOPERATORLIGHTWRONGTYPE,
                            'any.only': ErrorCode.NSERR_AUTOMATIONINPUTOPERATORLIGHTWRONGTYPE,
                        }),
                        fan: Joi.string().optional().valid('eq', 'neq', 'le', 'ge', 'lt', 'gt').messages({
                            'string.base': ErrorCode.NSERR_AUTOMATIONINPUTOPERATORFANWRONGTYPE,
                            'any.only': ErrorCode.NSERR_AUTOMATIONINPUTOPERATORFANWRONGTYPE,
                        }),
                    })
                        .required()
                        .min(1)
                        .messages({
                            'object.min': ErrorCode.NSERR_AUTOMATIONINPUTOPERATORATLEASTONEOBJECT,
                            'object.unknown': ErrorCode.NSERR_PARAMUNKNOWN,
                            'any.required': ErrorCode.NSERR_AUTOMATIONINPUTOPERATORREQUIRED,
                        }),
                })
                    .and('state.onoff', 'operator.onoff')
                    .and('state.dim', 'operator.dim')
                    .and('state.colortem', 'operator.colortem')
                    .and('state.hsv', 'operator.hsv')
                    .and('state.hsv.h', 'operator.hsv.h')
                    .and('state.hsv.s', 'operator.hsv.s')
                    .and('state.hsv.v', 'operator.hsv.v')
                    .and('state.door', 'operator.door')
                    .and('state.motion', 'operator.motion')
                    .and('state.contact', 'operator.contact')
                    .and('state.humidity', 'operator.humidity')
                    .and('state.temp', 'operator.temp')
                    .and('state.opcupancy', 'operator.opcupancy')
                    .and('state.light', 'operator.light')
                    .and('state.fan', 'operator.fan')
                    .messages({
                        'operator.and': ErrorCode.NSERR_AUTOMATIONSTATEOPERATORNOTMATCH,
                    }),
            )
            .messages({
                'array.base': ErrorCode.NSERR_AUTOMATIONINPUTWRONGTYPE,
                'array.empty': ErrorCode.NSERR_AUTOMATIONINPUTEMPTY,
                'any.required': ErrorCode.NSERR_AUTOMATIONINPUTREQUIRED,
            }),
        output: Joi.array()
            .required()
            .items(
                Joi.object({
                    type: Joi.string().required().allow('device', 'scene', 'notice').messages({
                        'string.base': ErrorCode.NSERR_AUTOMATIONOUTPUTTYPEWRONGTYPE,
                        'string.empty': ErrorCode.NSERR_AUTOMATIONOUTPUTTYPEEMPTY,
                        'any.required': ErrorCode.NSERR_AUTOMATIONOUTPUTTYPEREQUIRED,
                    }),
                    id: Joi.string().required().max(128).trim().messages({
                        'string.base': ErrorCode.NSERR_ENTITYIDTYPE,
                        'string.max': ErrorCode.NSERR_ENTITYIDOUTOFBOUND,
                        'string.empty': ErrorCode.NSERR_ENTITYIDEMPTY,
                        'any.required': ErrorCode.NSERR_ENTITYIDREQUIRED,
                    }),
                    delay: Joi.number().optional().min(0).max(10000000).messages({
                        'string.base': ErrorCode.NSERR_AUTOMATIONOUTPUTDELAYWRONGTYPE,
                        'string.min': ErrorCode.NSERR_AUTOMATIONOUTPUTDELAYOUTOFBOUND,
                        'string.max': ErrorCode.NSERR_AUTOMATIONOUTPUTDELAYOUTOFBOUND,
                    }),
                    state: Joi.object({
                        onoff: Joi.boolean().optional().messages({
                            'boolean.base': ErrorCode.NSERR_AUTOMATIONOUTPUTSTATEONOFFWRONGTYPE,
                        }),
                        dim: Joi.number().optional().min(1).max(100).messages({
                            'number.base': ErrorCode.NSERR_AUTOMATIONOUTPUTSTATEDIMWRONGTYPE,
                            'number.min': ErrorCode.NSERR_AUTOMATIONOUTPUTSTATEDIMOUTOFBOUND,
                            'number.max': ErrorCode.NSERR_AUTOMATIONOUTPUTSTATEDIMOUTOFBOUND,
                        }),
                        colortem: Joi.number().optional().min(2700).max(6500).messages({
                            'number.base': ErrorCode.NSERR_AUTOMATIONOUTPUTSTATECOLORTEMWRONGTYPE,
                            'number.min': ErrorCode.NSERR_AUTOMATIONOUTPUTSTATECOLORTEMOUTOFBOUND,
                            'number.max': ErrorCode.NSERR_AUTOMATIONOUTPUTSTATECOLORTEMOUTOFBOUND,
                        }),
                        hsv: Joi.object({
                            h: Joi.number().optional().min(0).max(355).messages({
                                'number.base': ErrorCode.NSERR_AUTOMATIONOUTPUTSTATEHSV_HUEWRONGTYPE,
                                'number.min': ErrorCode.NSERR_AUTOMATIONOUTPUTSTATEHSV_HUEOUTOFBOUND,
                                'number.max': ErrorCode.NSERR_AUTOMATIONOUTPUTSTATEHSV_HUEOUTOFBOUND,
                            }),
                            s: Joi.number().optional().min(0).max(255).messages({
                                'number.base': ErrorCode.NSERR_AUTOMATIONOUTPUTSTATEHSV_SATURATIONWRONGTYPE,
                                'number.min': ErrorCode.NSERR_AUTOMATIONOUTPUTSTATEHSV_SATURATIONOUTOFBOUND,
                                'number.max': ErrorCode.NSERR_AUTOMATIONOUTPUTSTATEHSV_SATURATIONOUTOFBOUND,
                            }),
                            v: Joi.number().optional().min(1).max(100).messages({
                                'number.base': ErrorCode.NSERR_AUTOMATIONOUTPUTSTATEHSV_VALUEWRONGTYPE,
                                'number.min': ErrorCode.NSERR_AUTOMATIONOUTPUTSTATEHSV_VALUEOUTOFBOUND,
                                'number.max': ErrorCode.NSERR_AUTOMATIONOUTPUTSTATEHSV_VALUEOUTOFBOUND,
                            }),
                        }).length(3),
                        door: Joi.boolean().optional().messages({
                            'boolean.base': ErrorCode.NSERR_AUTOMATIONOUTPUTSTATEDOORWRONGTYPE,
                        }),
                        motion: Joi.boolean().optional().messages({
                            'boolean.base': ErrorCode.NSERR_AUTOMATIONOUTPUTSTATEMOTIONWRONGTYPE,
                        }),
                        contact: Joi.boolean().optional().messages({
                            'boolean.base': ErrorCode.NSERR_AUTOMATIONOUTPUTSTATECONTACTWRONGTYPE,
                        }),
                        humidity: Joi.number().optional().min(0).max(100).messages({
                            'number.base': ErrorCode.NSERR_AUTOMATIONOUTPUTSTATEHUMIDITYWRONGTYPE,
                            'number.min': ErrorCode.NSERR_AUTOMATIONOUTPUTSTATEHUMIDITYOUTOFBOUND,
                            'number.max': ErrorCode.NSERR_AUTOMATIONOUTPUTSTATEHUMIDITYOUTOFBOUND,
                        }),
                        temp: Joi.number().optional().min(-50).max(100).messages({
                            'number.base': ErrorCode.NSERR_AUTOMATIONOUTPUTSTATETEMPWRONGTYPE,
                            'number.min': ErrorCode.NSERR_AUTOMATIONOUTPUTSTATETEMPOUTOFBOUND,
                            'number.max': ErrorCode.NSERR_AUTOMATIONOUTPUTSTATETEMPOUTOFBOUND,
                        }),
                        opcupancy: Joi.number().optional().min(0).max(100).messages({
                            'number.base': ErrorCode.NSERR_AUTOMATIONOUTPUTSTATEOCUPANCYWRONGTYPE,
                            'number.min': ErrorCode.NSERR_AUTOMATIONOUTPUTSTATEOCUPANCYOUTOFBOUND,
                            'number.max': ErrorCode.NSERR_AUTOMATIONOUTPUTSTATEOCUPANCYOUTOFBOUND,
                        }),
                        light: Joi.number().optional().min(0).max(100000).messages({
                            'number.base': ErrorCode.NSERR_AUTOMATIONOUTPUTSTATELIGHTWRONGTYPE,
                            'number.min': ErrorCode.NSERR_AUTOMATIONOUTPUTSTATELIGHTOUTOFBOUND,
                            'number.max': ErrorCode.NSERR_AUTOMATIONOUTPUTSTATELIGHTOUTOFBOUND,
                        }),
                        fan: Joi.number().optional().min(0).max(100).messages({
                            'number.base': ErrorCode.NSERR_AUTOMATIONOUTPUTSTATEFANWRONGTYPE,
                            'number.min': ErrorCode.NSERR_AUTOMATIONOUTPUTSTATEFANOUTOFBOUND,
                            'number.max': ErrorCode.NSERR_AUTOMATIONOUTPUTSTATEFANOUTOFBOUND,
                        }),
                    })
                        .required()
                        .min(1)
                        .messages({
                            'object.min': ErrorCode.NSERR_AUTOMATIONOUTPUTSTATEATLEASTONEOBJECT,
                            'object.unknown': ErrorCode.NSERR_PARAMUNKNOWN,
                            'any.required': ErrorCode.NSERR_AUTOMATIONOUTPUTSTATEREQUIRED,
                        }),
                }),
            )
            .messages({}),
        trigger: Joi.object({
            type: Joi.string().optional().allow('timer').messages({
                'string.base': ErrorCode.NSERR_AUTOMATIONTRIGGERTYPEWRONGTYPE,
            }),
            configuration: Joi.object({
                start: Joi.string().required().messages({
                    'string.base': ErrorCode.NSERR_AUTOMATIONTRIGGERCONFIGURATIONSTARTINGTIMEWRONGTYPE,
                    'string.empty': ErrorCode.NSERR_AUTOMATIONTRIGGERCONFIGURATIONSTARTINGTIMEEMPTY,
                    'any.required': ErrorCode.NSERR_AUTOMATIONTRIGGERCONFIGURATIONSTARTINGTIMEREQUIRED,
                }),
                end: Joi.string().optional().allow('', null).messages({
                    'string.base': ErrorCode.NSERR_AUTOMATIONTRIGGERCONFIGURATIONENDINGTIMEWRONGTYPE,
                }),
            })
                .optional()
                .messages({
                    'object.unknown': ErrorCode.NSERR_PARAMUNKNOWN,
                }),
        }).required(),
    })
        .messages({
            'object.unknown': ErrorCode.NSERR_PARAMUNKNOWN,
            'object.required': ErrorCode.NSERR_AUTOMATIONTRIGGERREQUIRED,
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
                'string.base': ErrorCode.NSERR_AUTOMATIONIDTYPE,
                'string.max': ErrorCode.NSERR_AUTOMATIONIDOUTOFBOUND,
                'string.guid': ErrorCode.NSERR_AUTOMATIONIDWRONGFORMAT,
                'string.empty': ErrorCode.NSERR_AUTOMATIONIDEMPTY,
                'any.required': ErrorCode.NSERR_AUTOMATIONIDREQUIRED,
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
        name: Joi.string().optional().allow(null, '').max(256).trim().messages({
            'string.base': ErrorCode.NSERR_AREANAMETYPE,
            'string.max': ErrorCode.NSERR_AREANAMEOUTOFBOUND,
        }),
        logo: Joi.string().optional().allow(null, '').max(128).trim().messages({
            'string.base': ErrorCode.NSERR_AREALOGOTYPE,
            'string.max': ErrorCode.NSERR_AREALOGOOUTOFBOUND,
        }),
        pos: Joi.number().optional().allow(null, '').min(-1).max(127).messages({
            'number.base': ErrorCode.NSERR_AREAPOSITIONTYPE,
            'number.min': ErrorCode.NSERR_AREAPOSITIONOUTOFBOUND,
            'number.max': ErrorCode.NSERR_AREAPOSITIONOUTOFBOUND,
        }),
        appCode: Joi.string().required().max(256).trim().messages({
            'string.base': ErrorCode.NSERR_APPCODETYPE,
            'string.max': ErrorCode.NSERR_APPCODEOUTOFBOUND,
            'string.empty': ErrorCode.NSERR_APPCODEEMPTY,
            'any.required': ErrorCode.NSERR_APPCODEREQUIRED,
        }),
        active: Joi.boolean().optional().messages({
            'string.base': ErrorCode.NSERR_AUTOMATIONTYPETYPE,
            'string.max': ErrorCode.NSERR_AUTOMATIONTYPEOUTOFBOUND,
        }),
        timezone: Joi.number().optional().allow(null, '').min(-12).max(14).messages({
            'number.base': ErrorCode.NSERR_AUTOMATIONTIMEZONETYPE,
            'number.max': ErrorCode.NSERR_AUTOMATIONTIMEZONEOUTOFBOUND,
            'number.min': ErrorCode.NSERR_AUTOMATIONTIMEZONEOUTOFBOUND,
        }),
        // type: Joi.string().optional().max(32).trim().messages({
        //     'string.base': ErrorCode.NSERR_AUTOMATIONTYPETYPE,
        //     'string.max': ErrorCode.NSERR_AUTOMATIONTYPEOUTOFBOUND,
        // }),
        logic: Joi.string().optional().max(32).allow('', null).valid('and', 'or').trim().messages({
            'string.base': ErrorCode.NSERR_AUTOMATIONLOGICTYPE,
            'string.max': ErrorCode.NSERR_AUTOMATIONLOGICOUTOFBOUND,
            'string.empty': ErrorCode.NSERR_AUTOMATIONLOGICEMPTY,
            'any.only': ErrorCode.NSERR_AUTOMATIONLOGICTYPE,
        }),
        input: Joi.array()
            .required()
            .items(
                Joi.object({
                    id: Joi.string().required().max(128).trim().messages({
                        'string.base': ErrorCode.NSERR_ENTITYIDTYPE,
                        'string.max': ErrorCode.NSERR_ENTITYIDOUTOFBOUND,
                        'string.empty': ErrorCode.NSERR_ENTITYIDEMPTY,
                        'any.required': ErrorCode.NSERR_ENTITYIDREQUIRED,
                    }),
                    state: Joi.object({
                        onoff: Joi.boolean().optional().messages({
                            'boolean.base': ErrorCode.NSERR_AUTOMATIONINPUTSTATEONOFFWRONGTYPE,
                        }),
                        dim: Joi.number().optional().min(1).max(100).messages({
                            'number.base': ErrorCode.NSERR_AUTOMATIONINPUTSTATEDIMWRONGTYPE,
                            'number.min': ErrorCode.NSERR_AUTOMATIONINPUTSTATEDIMOUTOFBOUND,
                            'number.max': ErrorCode.NSERR_AUTOMATIONINPUTSTATEDIMOUTOFBOUND,
                        }),
                        colortem: Joi.number().optional().min(2700).max(6500).messages({
                            'number.base': ErrorCode.NSERR_AUTOMATIONINPUTSTATECOLORTEMWRONGTYPE,
                            'number.min': ErrorCode.NSERR_AUTOMATIONINPUTSTATECOLORTEMOUTOFBOUND,
                            'number.max': ErrorCode.NSERR_AUTOMATIONINPUTSTATECOLORTEMOUTOFBOUND,
                        }),
                        hsv: Joi.object({
                            h: Joi.number().optional().min(0).max(355).messages({
                                'number.base': ErrorCode.NSERR_AUTOMATIONINPUTSTATEHSV_HUEWRONGTYPE,
                                'number.min': ErrorCode.NSERR_AUTOMATIONINPUTSTATEHSV_HUEOUTOFBOUND,
                                'number.max': ErrorCode.NSERR_AUTOMATIONINPUTSTATEHSV_HUEOUTOFBOUND,
                            }),
                            s: Joi.number().optional().min(0).max(255).messages({
                                'number.base': ErrorCode.NSERR_AUTOMATIONINPUTSTATEHSV_SATURATIONWRONGTYPE,
                                'number.min': ErrorCode.NSERR_AUTOMATIONINPUTSTATEHSV_SATURATIONOUTOFBOUND,
                                'number.max': ErrorCode.NSERR_AUTOMATIONINPUTSTATEHSV_SATURATIONOUTOFBOUND,
                            }),
                            v: Joi.number().optional().min(1).max(100).messages({
                                'number.base': ErrorCode.NSERR_AUTOMATIONINPUTSTATEHSV_VALUEWRONGTYPE,
                                'number.min': ErrorCode.NSERR_AUTOMATIONINPUTSTATEHSV_VALUEOUTOFBOUND,
                                'number.max': ErrorCode.NSERR_AUTOMATIONINPUTSTATEHSV_VALUEOUTOFBOUND,
                            }),
                        }),
                        door: Joi.boolean().optional().messages({
                            'boolean.base': ErrorCode.NSERR_AUTOMATIONINPUTSTATEDOORWRONGTYPE,
                        }),
                        motion: Joi.boolean().optional().messages({
                            'boolean.base': ErrorCode.NSERR_AUTOMATIONINPUTSTATEMOTIONWRONGTYPE,
                        }),
                        contact: Joi.boolean().optional().messages({
                            'boolean.base': ErrorCode.NSERR_AUTOMATIONINPUTSTATECONTACTWRONGTYPE,
                        }),
                        humidity: Joi.number().optional().min(0).max(100).messages({
                            'number.base': ErrorCode.NSERR_AUTOMATIONINPUTSTATEHUMIDITYWRONGTYPE,
                            'number.min': ErrorCode.NSERR_AUTOMATIONINPUTSTATEHUMIDITYOUTOFBOUND,
                            'number.max': ErrorCode.NSERR_AUTOMATIONINPUTSTATEHUMIDITYOUTOFBOUND,
                        }),
                        temp: Joi.number().optional().min(-50).max(100).messages({
                            'number.base': ErrorCode.NSERR_AUTOMATIONINPUTSTATETEMPWRONGTYPE,
                            'number.min': ErrorCode.NSERR_AUTOMATIONINPUTSTATETEMPOUTOFBOUND,
                            'number.max': ErrorCode.NSERR_AUTOMATIONINPUTSTATETEMPOUTOFBOUND,
                        }),
                        opcupancy: Joi.number().optional().min(0).max(100).messages({
                            'number.base': ErrorCode.NSERR_AUTOMATIONINPUTSTATEOCUPANCYWRONGTYPE,
                            'number.min': ErrorCode.NSERR_AUTOMATIONINPUTSTATEOCUPANCYOUTOFBOUND,
                            'number.max': ErrorCode.NSERR_AUTOMATIONINPUTSTATEOCUPANCYOUTOFBOUND,
                        }),
                        light: Joi.number().optional().min(0).max(100000).messages({
                            'number.base': ErrorCode.NSERR_AUTOMATIONINPUTSTATELIGHTWRONGTYPE,
                            'number.min': ErrorCode.NSERR_AUTOMATIONINPUTSTATELIGHTOUTOFBOUND,
                            'number.max': ErrorCode.NSERR_AUTOMATIONINPUTSTATELIGHTOUTOFBOUND,
                        }),
                        fan: Joi.number().optional().min(0).max(100).messages({
                            'number.base': ErrorCode.NSERR_AUTOMATIONINPUTSTATEFANWRONGTYPE,
                            'number.min': ErrorCode.NSERR_AUTOMATIONINPUTSTATEFANOUTOFBOUND,
                            'number.max': ErrorCode.NSERR_AUTOMATIONINPUTSTATELIGHTOUTOFBOUND,
                        }),
                    })
                        .required()
                        .min(1)
                        .messages({
                            'object.base': ErrorCode.NSERR_AUTOMATIONINPUTSTATEWRONGTYPE,
                            'object.min': ErrorCode.NSERR_AUTOMATIONINPUTSTATEATLEASTONEOBJECT,
                            'object.empty': ErrorCode.NSERR_AUTOMATIONINPUTSTATEEMPTY,
                            'any.required': ErrorCode.NSERR_AUTOMATIONINPUTSTATEREQUIRED,
                        }),
                    operator: Joi.object({
                        onoff: Joi.string().optional().allow('eq', 'neq', 'le', 'ge', 'lt', 'gt').messages({
                            'string.base': ErrorCode.NSERR_AUTOMATIONINPUTOPERATORONOFFWRONGTYPE,
                        }),
                        dim: Joi.string().optional().allow('eq', 'neq', 'le', 'ge', 'lt', 'gt').messages({
                            'string.base': ErrorCode.NSERR_AUTOMATIONINPUTOPERATORDIMWRONGTYPE,
                        }),
                        colortem: Joi.string().optional().allow('eq', 'neq', 'le', 'ge', 'lt', 'gt').messages({
                            'string.base': ErrorCode.NSERR_AUTOMATIONINPUTOPERATORCOLORTEMWRONGTYPE,
                        }),
                        hsv: Joi.object({
                            h: Joi.string().optional().allow('eq', 'neq', 'le', 'ge', 'lt', 'gt').messages({
                                'string.base': ErrorCode.NSERR_AUTOMATIONINPUTOPERATORHSV_HUEWRONGTYPE,
                            }),
                            s: Joi.string().optional().allow('eq', 'neq', 'le', 'ge', 'lt', 'gt').messages({
                                'string.base': ErrorCode.NSERR_AUTOMATIONINPUTOPERATORHSV_SATURATIONWRONGTYPE,
                            }),
                            v: Joi.string().optional().allow('eq', 'neq', 'le', 'ge', 'lt', 'gt').messages({
                                'string.base': ErrorCode.NSERR_AUTOMATIONINPUTOPERATORHSV_VALUEWRONGTYPE,
                            }),
                        }),
                        door: Joi.string().optional().allow('eq', 'neq', 'le', 'ge', 'lt', 'gt').messages({
                            'string.base': ErrorCode.NSERR_AUTOMATIONINPUTOPERATORDOORWRONGTYPE,
                        }),
                        motion: Joi.string().optional().allow('eq', 'neq', 'le', 'ge', 'lt', 'gt').messages({
                            'string.base': ErrorCode.NSERR_AUTOMATIONINPUTOPERATORMOTIONWRONGTYPE,
                        }),
                        contact: Joi.string().optional().allow('eq', 'neq', 'le', 'ge', 'lt', 'gt').messages({
                            'string.base': ErrorCode.NSERR_AUTOMATIONINPUTOPERATORCONTACTWRONGTYPE,
                        }),
                        humidity: Joi.string().optional().allow('eq', 'neq', 'le', 'ge', 'lt', 'gt').messages({
                            'string.base': ErrorCode.NSERR_AUTOMATIONINPUTOPERATORHUMIDITYWRONGTYPE,
                        }),
                        temp: Joi.string().optional().allow('eq', 'neq', 'le', 'ge', 'lt', 'gt').messages({
                            'string.base': ErrorCode.NSERR_AUTOMATIONINPUTOPERATORTEMPWRONGTYPE,
                        }),
                        opcupancy: Joi.string().optional().allow('eq', 'neq', 'le', 'ge', 'lt', 'gt').messages({
                            'string.base': ErrorCode.NSERR_AUTOMATIONINPUTOPERATOROCUPANCYWRONGTYPE,
                        }),
                        light: Joi.string().optional().allow('eq', 'neq', 'le', 'ge', 'lt', 'gt').messages({
                            'string.base': ErrorCode.NSERR_AUTOMATIONINPUTOPERATORLIGHTWRONGTYPE,
                        }),
                        fan: Joi.string().optional().allow('eq', 'neq', 'le', 'ge', 'lt', 'gt').messages({
                            'string.base': ErrorCode.NSERR_AUTOMATIONINPUTOPERATORFANWRONGTYPE,
                        }),
                    })
                        .required()
                        .min(1)
                        .messages({
                            'object.min': ErrorCode.NSERR_AUTOMATIONINPUTOPERATORATLEASTONEOBJECT,
                            'object.unknown': ErrorCode.NSERR_PARAMUNKNOWN,
                            'any.required': ErrorCode.NSERR_AUTOMATIONINPUTOPERATORREQUIRED,
                        }),
                })
                    .required()
                    .and('state.onoff', 'operator.onoff')
                    .and('state.dim', 'operator.dim')
                    .and('state.colortem', 'operator.colortem')
                    .and('state.hsv', 'operator.hsv')
                    .and('state.hsv.h', 'operator.hsv.h')
                    .and('state.hsv.s', 'operator.hsv.s')
                    .and('state.hsv.v', 'operator.hsv.v')
                    .and('state.door', 'operator.door')
                    .and('state.motion', 'operator.motion')
                    .and('state.contact', 'operator.contact')
                    .and('state.humidity', 'operator.humidity')
                    .and('state.temp', 'operator.temp')
                    .and('state.opcupancy', 'operator.opcupancy')
                    .and('state.light', 'operator.light')
                    .and('state.fan', 'operator.fan')
                    .messages({
                        'object.unknown': ErrorCode.NSERR_PARAMUNKNOWN,
                    }),
            )
            .messages({
                'array.base': ErrorCode.NSERR_AUTOMATIONINPUTWRONGTYPE,
                'array.empty': ErrorCode.NSERR_AUTOMATIONINPUTEMPTY,
                'any.required': ErrorCode.NSERR_AUTOMATIONINPUTREQUIRED,
            }),
        output: Joi.array()
            .required()
            .items(
                Joi.object({
                    type: Joi.string().required().allow('device', 'scene', 'notice').messages({
                        'string.base': ErrorCode.NSERR_AUTOMATIONOUTPUTTYPEWRONGTYPE,
                        'string.empty': ErrorCode.NSERR_AUTOMATIONOUTPUTTYPEEMPTY,
                        'any.required': ErrorCode.NSERR_AUTOMATIONOUTPUTTYPEREQUIRED,
                    }),
                    id: Joi.string().required().max(128).trim().messages({
                        'string.base': ErrorCode.NSERR_ENTITYIDTYPE,
                        'string.max': ErrorCode.NSERR_ENTITYIDOUTOFBOUND,
                        'string.empty': ErrorCode.NSERR_ENTITYIDEMPTY,
                        'any.required': ErrorCode.NSERR_ENTITYIDREQUIRED,
                    }),
                    delay: Joi.number().optional().min(0).max(10000000).messages({
                        'string.base': ErrorCode.NSERR_AUTOMATIONOUTPUTDELAYWRONGTYPE,
                        'string.min': ErrorCode.NSERR_AUTOMATIONOUTPUTDELAYOUTOFBOUND,
                        'string.max': ErrorCode.NSERR_AUTOMATIONOUTPUTDELAYOUTOFBOUND,
                    }),
                    state: Joi.object({
                        onoff: Joi.boolean().optional().messages({
                            'boolean.base': ErrorCode.NSERR_AUTOMATIONOUTPUTSTATEONOFFWRONGTYPE,
                        }),
                        dim: Joi.number().optional().min(1).max(100).messages({
                            'number.base': ErrorCode.NSERR_AUTOMATIONOUTPUTSTATEDIMWRONGTYPE,
                            'number.min': ErrorCode.NSERR_AUTOMATIONOUTPUTSTATEDIMOUTOFBOUND,
                            'number.max': ErrorCode.NSERR_AUTOMATIONOUTPUTSTATEDIMOUTOFBOUND,
                        }),
                        colortem: Joi.number().optional().min(2700).max(6500).messages({
                            'number.base': ErrorCode.NSERR_AUTOMATIONOUTPUTSTATECOLORTEMWRONGTYPE,
                            'number.min': ErrorCode.NSERR_AUTOMATIONOUTPUTSTATECOLORTEMOUTOFBOUND,
                            'number.max': ErrorCode.NSERR_AUTOMATIONOUTPUTSTATECOLORTEMOUTOFBOUND,
                        }),
                        hsv: Joi.object({
                            h: Joi.number().optional().min(0).max(355).messages({
                                'number.base': ErrorCode.NSERR_AUTOMATIONOUTPUTSTATEHSV_HUEWRONGTYPE,
                                'number.min': ErrorCode.NSERR_AUTOMATIONOUTPUTSTATEHSV_HUEOUTOFBOUND,
                                'number.max': ErrorCode.NSERR_AUTOMATIONOUTPUTSTATEHSV_HUEOUTOFBOUND,
                            }),
                            s: Joi.number().optional().min(0).max(255).messages({
                                'number.base': ErrorCode.NSERR_AUTOMATIONOUTPUTSTATEHSV_SATURATIONWRONGTYPE,
                                'number.min': ErrorCode.NSERR_AUTOMATIONOUTPUTSTATEHSV_SATURATIONOUTOFBOUND,
                                'number.max': ErrorCode.NSERR_AUTOMATIONOUTPUTSTATEHSV_SATURATIONOUTOFBOUND,
                            }),
                            v: Joi.number().optional().min(1).max(100).messages({
                                'number.base': ErrorCode.NSERR_AUTOMATIONOUTPUTSTATEHSV_VALUEWRONGTYPE,
                                'number.min': ErrorCode.NSERR_AUTOMATIONOUTPUTSTATEHSV_VALUEOUTOFBOUND,
                                'number.max': ErrorCode.NSERR_AUTOMATIONOUTPUTSTATEHSV_VALUEOUTOFBOUND,
                            }),
                        }),
                        door: Joi.boolean().optional().messages({
                            'boolean.base': ErrorCode.NSERR_AUTOMATIONOUTPUTSTATEDOORWRONGTYPE,
                        }),
                        motion: Joi.boolean().optional().messages({
                            'boolean.base': ErrorCode.NSERR_AUTOMATIONOUTPUTSTATEMOTIONWRONGTYPE,
                        }),
                        contact: Joi.boolean().optional().messages({
                            'boolean.base': ErrorCode.NSERR_AUTOMATIONOUTPUTSTATECONTACTWRONGTYPE,
                        }),
                        humidity: Joi.number().optional().min(0).max(100).messages({
                            'number.base': ErrorCode.NSERR_AUTOMATIONOUTPUTSTATEHUMIDITYWRONGTYPE,
                            'number.min': ErrorCode.NSERR_AUTOMATIONOUTPUTSTATEHUMIDITYOUTOFBOUND,
                            'number.max': ErrorCode.NSERR_AUTOMATIONOUTPUTSTATEHUMIDITYOUTOFBOUND,
                        }),
                        temp: Joi.number().optional().min(-50).max(100).messages({
                            'number.base': ErrorCode.NSERR_AUTOMATIONOUTPUTSTATETEMPWRONGTYPE,
                            'number.min': ErrorCode.NSERR_AUTOMATIONOUTPUTSTATETEMPOUTOFBOUND,
                            'number.max': ErrorCode.NSERR_AUTOMATIONOUTPUTSTATETEMPOUTOFBOUND,
                        }),
                        opcupancy: Joi.number().optional().min(0).max(100).messages({
                            'number.base': ErrorCode.NSERR_AUTOMATIONOUTPUTSTATEOCUPANCYWRONGTYPE,
                            'number.min': ErrorCode.NSERR_AUTOMATIONOUTPUTSTATEOCUPANCYOUTOFBOUND,
                            'number.max': ErrorCode.NSERR_AUTOMATIONOUTPUTSTATEOCUPANCYOUTOFBOUND,
                        }),
                        light: Joi.number().optional().min(0).max(100000).messages({
                            'number.base': ErrorCode.NSERR_AUTOMATIONOUTPUTSTATELIGHTWRONGTYPE,
                            'number.min': ErrorCode.NSERR_AUTOMATIONOUTPUTSTATELIGHTOUTOFBOUND,
                            'number.max': ErrorCode.NSERR_AUTOMATIONOUTPUTSTATELIGHTOUTOFBOUND,
                        }),
                        fan: Joi.number().optional().min(0).max(100).messages({
                            'number.base': ErrorCode.NSERR_AUTOMATIONOUTPUTSTATEFANWRONGTYPE,
                            'number.min': ErrorCode.NSERR_AUTOMATIONOUTPUTSTATEFANOUTOFBOUND,
                            'number.max': ErrorCode.NSERR_AUTOMATIONOUTPUTSTATEFANOUTOFBOUND,
                        }),
                    })
                        .required()
                        .min(1)
                        .messages({
                            'object.min': ErrorCode.NSERR_AUTOMATIONOUTPUTSTATEATLEASTONEOBJECT,
                            'object.unknown': ErrorCode.NSERR_PARAMUNKNOWN,
                            'any.required': ErrorCode.NSERR_AUTOMATIONOUTPUTSTATEREQUIRED,
                        }),
                }),
            ),
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
                'string.base': ErrorCode.NSERR_AUTOMATIONIDTYPE,
                'string.max': ErrorCode.NSERR_AUTOMATIONIDOUTOFBOUND,
                'string.guid': ErrorCode.NSERR_AUTOMATIONIDWRONGFORMAT,
                'string.empty': ErrorCode.NSERR_AUTOMATIONIDEMPTY,
                'any.required': ErrorCode.NSERR_AUTOMATIONIDREQUIRED,
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

export default new AutomationValidation();
