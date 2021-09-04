import express from 'express';
import EntityController from '../../controller/v1/Entity.controller';
import { container } from '../../../inversify.config';
import IValidation from '../../interface/IValid.interface';
// import { ValidationClass, ValidationMethod } from '../../constant';
import { EValidationController, EValidationMethod } from '../../interface/IValid.interface';

const validation: IValidation = container.get<IValidation>('Validation');

let entityController = container.get<EntityController>('EntityController');
let router = express.Router();

router
    /**
     * @swagger
     * /v1/entity:
     *  get:
     *    summary: Search entity in service by query param.
     *    security:
     *     - authorizationHeader: []
     *    tags:
     *      - Entity
     *    parameters:
     *      - name: id
     *        in: query
     *        schema:
     *          type: string
     *          example: "3123af-23144aac-3214-4545-6213"
     *      - name: userId
     *        in: query
     *        required: true
     *        schema:
     *          type: string
     *          example: "3123af-23144aac-3214-4545-6213"
     *      - name: homeId
     *        in: query
     *        required: true
     *        schema:
     *          type: string
     *          example: "3123af-23144aac-3214-4545-6213"
     *      - name: areaId
     *        in: query
     *        schema:
     *          type: string
     *          example: "3123af-23144aac-3214-4545-6213"
     *      - name: name
     *        in: query
     *        schema:
     *          type: string
     *          example: "Default room"
     *      - name: parentId
     *        in: query
     *        schema:
     *          type: string
     *          example: "3123af-23144aac-3214-4545-6213"
     *      - name: appCode
     *        in: query
     *        required: true
     *        schema:
     *          type: string
     *          example: "Phenikaa Life"
     *    responses:
     *      200:
     *        description: Return a list of entities if success
     *        content:
     *          application/json:
     *            schema:
     *              type: object
     *              properties:
     *                message:
     *                  type: string
     *                  example: "done"
     *                data:
     *                  type: array
     *                  items:
     *                    type: object
     *                  example:
     *                    - id: "3123af-23144aac-3214-4545-6213"
     *                      homeId: "3123af-23144aac-3214-4545-6213"
     *                      areaId: "3123af-23144aac-3214-4545-6213"
     *                      areaName: "Phòng khách"
     *                      name: "Thiết bị 1"
     *                      mac: "00:01:02:03:04:05"
     *                      parentId: "3123af-23144aac-3214-4545-6213"
     *                      typeId: "3123af-23144aac-3214-4545-6213"
     *                      typeCode: "00504024000"
     *                      typeName: "3123af-23144aac-3214-4545-6213"
     *                      catId: "3123af-23144aac-3214-4545-6213"
     *                      catName: "3123af-23144aac-3214-4545-6213"
     *                      connectionId: "3123af-23144aac-3214-4545-6213"
     *                      connectionName: "3123af-23144aac-3214-4545-6213"
     *                      familyId: "3123af-23144aac-3214-4545-6213"
     *                      familyName: "RGB"
     *                      logo: "default.png"
     *                      pos: -1
     *                      state: {}
     *                    - id: "3123af-23144aac-3214-4545-6213"
     *                      homeId: "3123af-23144aac-3214-4545-6213"
     *                      areaId: "3123af-23144aac-3214-4545-6213"
     *                      areaName: "Phòng khách"
     *                      name: "Thiết bị 1"
     *                      mac: "00:01:02:03:04:05"
     *                      parentId: "3123af-23144aac-3214-4545-6213"
     *                      typeId: "3123af-23144aac-3214-4545-6213"
     *                      typeCode: "00504024000"
     *                      typeName: "3123af-23144aac-3214-4545-6213"
     *                      catId: "3123af-23144aac-3214-4545-6213"
     *                      catName: "3123af-23144aac-3214-4545-6213"
     *                      connectionId: "3123af-23144aac-3214-4545-6213"
     *                      connectionName: "3123af-23144aac-3214-4545-6213"
     *                      familyId: "3123af-23144aac-3214-4545-6213"
     *                      familyName: "RGB"
     *                      logo: "default.png"
     *                      pos: -1
     *                      state: {}
     *
     *      406:
     *        description: Occur if an input is not acceptable
     *        content:
     *          application/json:
     *            schema:
     *              type: object
     *              properties:
     *                message:
     *                  type: string
     *                  example: "Field in request is not acceptable"
     */
    .get(
        '',
        (request, response, next) => {
            validation.valid({
                response,
                request,
                next,
                valid: {
                    controller: EValidationController.ENTITY,
                    method: EValidationMethod.GET,
                },
            });
        },
        entityController.get,
    )
    /**
     * @swagger
     * /v1/entity/update-info:
     *  get:
     *    summary: Search update info of entity in service by query param.
     *    security:
     *     - authorizationHeader: []
     *    tags:
     *      - Entity
     *    parameters:
     *      - name: id
     *        in: query
     *        schema:
     *          type: string
     *          example: "3123af-23144aac-3214-4545-6213"
     *      - name: userId
     *        in: query
     *        required: true
     *        schema:
     *          type: string
     *          example: "3123af-23144aac-3214-4545-6213"
     *      - name: homeId
     *        in: query
     *        required: true
     *        schema:
     *          type: string
     *          example: "3123af-23144aac-3214-4545-6213"
     *      - name: name
     *        in: query
     *        schema:
     *          type: string
     *          example: "Default room"
     *      - name: parentId
     *        in: query
     *        schema:
     *          type: string
     *          example: "3123af-23144aac-3214-4545-6213"
     *      - name: appCode
     *        in: query
     *        required: true
     *        schema:
     *          type: string
     *          example: "Phenikaa Life"
     *    responses:
     *      200:
     *        description: Return a list of entities if success
     *        content:
     *          application/json:
     *            schema:
     *              type: object
     *              properties:
     *                message:
     *                  type: string
     *                  example: "done"
     *                data:
     *                  type: array
     *                  items:
     *                    type: object
     *                  example:
     *                    - id: "3123af-23144aac-3214-4545-6213"
     *                      homeId: "3123af-23144aac-3214-4545-6213"
     *                      areaId: "3123af-23144aac-3214-4545-6213"
     *                      areaName: "Phòng khách"
     *                      name: "Thiết bị 1"
     *                      mac: "00:01:02:03:04:05"
     *                      parentId: "3123af-23144aac-3214-4545-6213"
     *                      typeId: "3123af-23144aac-3214-4545-6213"
     *                      typeCode: "00504024000"
     *                      typeName: "3123af-23144aac-3214-4545-6213"
     *                      catId: "3123af-23144aac-3214-4545-6213"
     *                      catName: "3123af-23144aac-3214-4545-6213"
     *                      connectionId: "3123af-23144aac-3214-4545-6213"
     *                      connectionName: "3123af-23144aac-3214-4545-6213"
     *                      familyId: "3123af-23144aac-3214-4545-6213"
     *                      familyName: "RGB"
     *                      logo: "default.png"
     *                      pos: -1
     *                      state: {}
     *                    - id: "3123af-23144aac-3214-4545-6213"
     *                      homeId: "3123af-23144aac-3214-4545-6213"
     *                      areaId: "3123af-23144aac-3214-4545-6213"
     *                      areaName: "Phòng khách"
     *                      name: "Thiết bị 1"
     *                      mac: "00:01:02:03:04:05"
     *                      parentId: "3123af-23144aac-3214-4545-6213"
     *                      typeId: "3123af-23144aac-3214-4545-6213"
     *                      typeCode: "00504024000"
     *                      typeName: "3123af-23144aac-3214-4545-6213"
     *                      catId: "3123af-23144aac-3214-4545-6213"
     *                      catName: "3123af-23144aac-3214-4545-6213"
     *                      connectionId: "3123af-23144aac-3214-4545-6213"
     *                      connectionName: "3123af-23144aac-3214-4545-6213"
     *                      familyId: "3123af-23144aac-3214-4545-6213"
     *                      familyName: "RGB"
     *                      logo: "default.png"
     *                      pos: -1
     *                      state: {}
     *
     *      406:
     *        description: Occur if an input is not acceptable
     *        content:
     *          application/json:
     *            schema:
     *              type: object
     *              properties:
     *                message:
     *                  type: string
     *                  example: "Field in request is not acceptable"
     */
    .get(
        '/update-info',
        (request, response, next) => {
            validation.valid({
                response,
                request,
                next,
                valid: {
                    controller: EValidationController.ENTITY,
                    method: EValidationMethod.GETUPDATEINFO,
                },
            });
        },
        entityController.getUpdateInfo,
    )
    /**
     * @swagger
     * /v1/entity/register:
     *  post:
     *    summary: register entity
     *    security:
     *     - authorizationHeader: []
     *    tags:
     *      - Entity
     *    requestBody:
     *      required: true
     *      content:
     *        application/json:
     *          schema:
     *            type: object
     *            properties:
     *              userId:
     *                type: string
     *                example: '3123af-23144aac-3214-4545-6213'
     *              homeId:
     *                type: string
     *                example: '3123af-23144aac-3214-4545-6213'
     *              typeCode:
     *                type: string
     *                example: '00504024000'
     *              areaId:
     *                type: string
     *                example: '3123af-23144aac-3214-4545-6213'
     *              parentId:
     *                type: string
     *                example: '3123af-23144aac-3214-4545-6213'
     *              name:
     *                type: string
     *                example: 'Thiết bị test'
     *              logo:
     *                type: string
     *                example: 'default.png'
     *              pos:
     *                type: number
     *                example: 1
     *              extra:
     *                type: object
     *                properties:
     *                  hc_token:
     *                    type: string
     *                    example: "asasd-asdasd-xcv-xc-vsdf"
     *                  tv_token:
     *                    type: string
     *                    example: "asasd-asdasd-xcv-xc-vsdf"
     *              token:
     *                type: string
     *                example: '23412354'
     *              appCode:
     *                type: string
     *                example: "Phenikaa Life"
     *            required:
     *              - id
     *    responses:
     *      200:
     *        description: Return an entity info if success
     *        content:
     *          application/json:
     *            schema:
     *              type: object
     *              properties:
     *                message:
     *                  type: string
     *                  example: "done"
     *                data:
     *                  type: object
     *                  properties:
     *                    id:
     *                      type: string
     *                      example: "3123af-23144aac-3214-4545-6213"
     *                    homeId:
     *                      type: string
     *                      example: "3123af-23144aac-3214-4545-6213"
     *                    userId:
     *                      type: string
     *                      example: "3123af-23144aac-3214-4545-6213"
     *                    areaId:
     *                      type: string
     *                      example: "3123af-23144aac-3214-4545-6213"
     *                    areaName:
     *                      type: string
     *                      example: "Phòng trọ"
     *                    name:
     *                      type: string
     *                      example: "Camera giấu kín"
     *                    mac:
     *                      type: string
     *                      example: "00:11:22:33:44:55"
     *                    parentId:
     *                      type: string
     *                      example: "3123af-23144aac-3214-4545-6213"
     *                    typeCode:
     *                      type: string
     *                      example: "00504024000"
     *                    typeName:
     *                      type: string
     *                      example: "Lighting (Zigbee)"
     *                    catId:
     *                      type: string
     *                      example: "3123af-23144aac-3214-4545-6213"
     *                    catName:
     *                      type: string
     *                      example: "Đèn"
     *                    connectionId:
     *                      type: string
     *                      example: "3123af-23144aac-3214-4545-6213"
     *                    connectionName:
     *                      type: string
     *                      example: "Zigbee"
     *                    familyId:
     *                      type: string
     *                      example: "3123af-23144aac-3214-4545-6213"
     *                    familyName:
     *                      type: string
     *                      example: "Đèn cầy"
     *                    logo:
     *                      type: string
     *                      example: "default.png"
     *                    pos:
     *                      type: number
     *                      example: -1
     *                    state:
     *                      type: object
     *      404:
     *        description: Occur if a element could not found
     *        content:
     *          application/json:
     *            schema:
     *              oneOf:
     *                - $ref: "#/components/schemas/ParentNotFound"
     *                - $ref: "#/components/schemas/HomeNotFound"
     *                - $ref: "#/components/schemas/AreaNotFound"
     *            examples:
     *              parents:
     *                summary: Example parent not found
     *                value:
     *                  message: "Could not find any parents in db"
     *              home:
     *                summary: Example home not found
     *                value:
     *                  message: "Could not find any home in db"
     *              area:
     *                summary: Example area not found
     *                value:
     *                  message: "Could not find any area in db"
     *
     *      406:
     *        description: Occur if an input is not acceptable
     *        content:
     *          application/json:
     *            schema:
     *              type: object
     *              properties:
     *                message:
     *                  type: string
     *                  example: "Field in request is not acceptable"
     *
     *      409:
     *        description: Occur if a device has been existed before
     *        content:
     *          application/json:
     *            schema:
     *              type: object
     *              properties:
     *                message:
     *                  type: string
     *                  example: "Device has been existed"
     *
     * components:
     *  schemas:
     *    ParentNotFound:
     *      type: object
     *      properties:
     *        message:
     *          type: string
     *    DeviceTypeNotFound:
     *      type: object
     *      properties:
     *        message:
     *          type: string
     *
     */
    .post(
        '/register',
        (request, response, next) => {
            validation.valid({
                response,
                request,
                next,
                valid: {
                    controller: EValidationController.ENTITY,
                    method: EValidationMethod.CREATE,
                },
            });
        },
        entityController.create,
    )
    /**
     * @swagger
     * /v1/entity/share:
     *  post:
     *    summary: share an entity to other user
     *    security:
     *     - authorizationHeader: []
     *    tags:
     *      - Entity
     *    requestBody:
     *      required: true
     *      content:
     *        application/json:
     *          schema:
     *            type: object
     *            properties:
     *              ids:
     *                type: array
     *                items:
     *                  type: string
     *                  example: 'PDS_17912d5c118_d80531b6-2b7c-4e8d-a981-7924be92a4da'
     *              homeId:
     *                type: string
     *                example: 'Thiết bị test'
     *              memberId:
     *                type: string
     *                example: '2e94f51a-3bc0-422e-acf5-22af223c2578'
     *              appCode:
     *                type: string
     *                example: "Phenikaa Life"
     *            required:
     *              - id
     *              - homeId
     *              - userId
     *    responses:
     *      200:
     *        description: Response success
     *        content:
     *          application/json:
     *            schema:
     *              type: object
     *              properties:
     *                message:
     *                  type: string
     *                  example: "done"
     *                data:
     *                  type: array
     *                  items:
     *                    type: object
     *                    properties:
     *                      id:
     *                        type: string
     *                        example: 'PDS_17912d5c118_d80531b6-2b7c-4e8d-a981-7924be92a4da'
     *                      name:
     *                        type: string
     *                        example: 'Test'
     *                      share:
     *                        type: boolean
     *                        example: true
     *                      message:
     *                        type: string
     *                        example: 'done'
     *
     *      400:
     *        description: Occur if nothing to be changed
     *        content:
     *          application/json:
     *            schema:
     *              type: object
     *              properties:
     *                message:
     *                  type: string
     *                  example: "Nothing to be share"
     *
     *      404:
     *        description: Occur if a element could not found
     *        content:
     *          application/json:
     *            schema:
     *              oneOf:
     *                - $ref: "#/components/schemas/DeviceNotFound"
     *                - $ref: "#/components/schemas/HomeNotFound"
     *                - $ref: "#/components/schemas/AreaNotFound"
     *                - $ref: "#/components/schemas/ParentNotFound"
     *                - $ref: "#/components/schemas/DeviceTypeNotFound"
     *            examples:
     *              devices:
     *                summary: Example device not found
     *                value:
     *                  message: "Could not find any device in db"
     *              homes:
     *                summary: Example home not found
     *                value:
     *                  message: "Could not find any home in db"
     *              areas:
     *                summary: Example area not found
     *                value:
     *                  message: "Could not find any area in db"
     *              parents:
     *                summary: Example parent not found
     *                value:
     *                  message: "Could not find any parents in db"
     *              deviceType:
     *                summary: Example device type not found
     *                value:
     *                  message: "Could not find any device type in db"
     *
     *      406:
     *        description: Occur if an input is not acceptable
     *        content:
     *          application/json:
     *            schema:
     *              type: object
     *              properties:
     *                message:
     *                  type: string
     *                  example: "Field in request is not acceptable"
     *
     *      409:
     *        description: Occur if a device has been existed before
     *        content:
     *          application/json:
     *            schema:
     *              type: object
     *              properties:
     *                message:
     *                  type: string
     *                  example: "Device has been existed"
     *
     * components:
     *  schemas:
     *    HomeNotFound:
     *      type: object
     *      properties:
     *        message:
     *          type: string
     *    AreaNotFound:
     *      type: object
     *      properties:
     *        message:
     *          type: string
     *    DeviceNotFound:
     *      type: object
     *      properties:
     *        message:
     *          type: string
     *    ParentNotFound:
     *      type: object
     *      properties:
     *        message:
     *          type: string
     *    DeviceTypeNotFound:
     *      type: object
     *      properties:
     *        message:
     *          type: string
     *
     */
    .post(
        '/share',
        (request, response, next) => {
            validation.valid({
                response,
                request,
                next,
                valid: {
                    controller: EValidationController.ENTITY,
                    method: EValidationMethod.SHARE,
                },
            });
        },
        entityController.share,
    )
    /**
     * @swagger
     * /v1/entity/unshare:
     *  post:
     *    summary: unshare an entity to other user
     *    tags:
     *      - Entity
     *    requestBody:
     *      required: true
     *      content:
     *        application/json:
     *          schema:
     *            type: object
     *            properties:
     *              ids:
     *                type: array
     *                items:
     *                  type: string
     *                  example: 'PDS_17912d5c118_d80531b6-2b7c-4e8d-a981-7924be92a4da'
     *              homeId:
     *                type: string
     *                example: 'Thiết bị test'
     *              userId:
     *                type: string
     *                example: '3123af-23144aac-3214-4545-6213'
     *              memberId:
     *                type: string
     *                example: '2e94f51a-3bc0-422e-acf5-22af223c2578'
     *              appCode:
     *                type: string
     *                example: "Phenikaa Life"
     *            required:
     *              - id
     *              - homeId
     *              - userId
     *              - memberId
     *    responses:
     *      200:
     *        description: Response success
     *        content:
     *          application/json:
     *            schema:
     *              type: object
     *              properties:
     *                message:
     *                  type: string
     *                  example: "done"
     *                data:
     *                  type: array
     *                  items:
     *                    type: object
     *                    properties:
     *                      id:
     *                        type: string
     *                        example: 'PDS_17912d5c118_d80531b6-2b7c-4e8d-a981-7924be92a4da'
     *                      name:
     *                        type: string
     *                        example: 'Test'
     *                      share:
     *                        type: boolean
     *                        example: true
     *                      message:
     *                        type: string
     *                        example: 'done'
     *
     *      400:
     *        description: Occur if nothing to be changed
     *        content:
     *          application/json:
     *            schema:
     *              type: object
     *              properties:
     *                message:
     *                  type: string
     *                  example: "Nothing to be changed"
     *
     *      404:
     *        description: Occur if a element could not found
     *        content:
     *          application/json:
     *            schema:
     *              oneOf:
     *                - $ref: "#/components/schemas/DeviceNotFound"
     *                - $ref: "#/components/schemas/HomeNotFound"
     *                - $ref: "#/components/schemas/AreaNotFound"
     *                - $ref: "#/components/schemas/ParentNotFound"
     *                - $ref: "#/components/schemas/DeviceTypeNotFound"
     *            examples:
     *              devices:
     *                summary: Example device not found
     *                value:
     *                  message: "Could not find any device in db"
     *              homes:
     *                summary: Example home not found
     *                value:
     *                  message: "Could not find any home in db"
     *              areas:
     *                summary: Example area not found
     *                value:
     *                  message: "Could not find any area in db"
     *              parents:
     *                summary: Example parent not found
     *                value:
     *                  message: "Could not find any parents in db"
     *              deviceType:
     *                summary: Example device type not found
     *                value:
     *                  message: "Could not find any device type in db"
     *
     *      406:
     *        description: Occur if an input is not acceptable
     *        content:
     *          application/json:
     *            schema:
     *              type: object
     *              properties:
     *                message:
     *                  type: string
     *                  example: "Field in request is not acceptable"
     *
     *      409:
     *        description: Occur if a device has been existed before
     *        content:
     *          application/json:
     *            schema:
     *              type: object
     *              properties:
     *                message:
     *                  type: string
     *                  example: "Device has been existed"
     *
     * components:
     *  schemas:
     *    HomeNotFound:
     *      type: object
     *      properties:
     *        message:
     *          type: string
     *    AreaNotFound:
     *      type: object
     *      properties:
     *        message:
     *          type: string
     *    DeviceNotFound:
     *      type: object
     *      properties:
     *        message:
     *          type: string
     *    ParentNotFound:
     *      type: object
     *      properties:
     *        message:
     *          type: string
     *    DeviceTypeNotFound:
     *      type: object
     *      properties:
     *        message:
     *          type: string
     *
     */
    .post(
        '/unshare',
        (request, response, next) => {
            validation.valid({
                response,
                request,
                next,
                valid: {
                    controller: EValidationController.ENTITY,
                    method: EValidationMethod.GET,
                },
            });
        },
        entityController.unshare,
    )
    /**
     * @swagger
     * /v1/entity/:
     *  put:
     *    security:
     *     - authorizationHeader: []
     *    summary: create entity
     *    tags:
     *      - Entity
     *    requestBody:
     *      required: true
     *      content:
     *        application/json:
     *          schema:
     *            type: object
     *            properties:
     *              id:
     *                type: string
     *                example: '3123af-23144aac-3214-4545-6213'
     *              userId:
     *                type: string
     *                example: '3123af-23144aac-3214-4545-6213'
     *              homeId:
     *                type: string
     *                example: '3123af-23144aac-3214-4545-6213'
     *              areaId:
     *                type: string
     *                example: '3123af-23144aac-3214-4545-6213'
     *              name:
     *                type: string
     *                example: 'Thiết bị test'
     *              logo:
     *                type: string
     *                example: 'hh.png'
     *              extra:
     *                type: object
     *                properties:
     *                  hc_token:
     *                    type: string
     *                    example: "123123"
     *                  tv_token:
     *                    type: string
     *                    example: "123123"
     *              appCode:
     *                type: string
     *                example: "Phenikaa Life"
     *            required:
     *              - id
     *    responses:
     *      200:
     *        description: Response success
     *        content:
     *          application/json:
     *            schema:
     *              type: object
     *              properties:
     *                message:
     *                  type: string
     *                  example: "Device has been updated"
     *
     *      400:
     *        description: Occur if nothing to be changed
     *        content:
     *          application/json:
     *            schema:
     *              type: object
     *              properties:
     *                message:
     *                  type: string
     *                  example: "Nothing to be changed"
     *
     *      404:
     *        description: Occur if a element could not found
     *        content:
     *          application/json:
     *            schema:
     *              oneOf:
     *                - $ref: "#/components/schemas/DeviceNotFound"
     *                - $ref: "#/components/schemas/HomeNotFound"
     *                - $ref: "#/components/schemas/AreaNotFound"
     *                - $ref: "#/components/schemas/ParentNotFound"
     *                - $ref: "#/components/schemas/DeviceTypeNotFound"
     *            examples:
     *              devices:
     *                summary: Example device not found
     *                value:
     *                  message: "Could not find any device in db"
     *              homes:
     *                summary: Example home not found
     *                value:
     *                  message: "Could not find any home in db"
     *              areas:
     *                summary: Example area not found
     *                value:
     *                  message: "Could not find any area in db"
     *              parents:
     *                summary: Example parent not found
     *                value:
     *                  message: "Could not find any parents in db"
     *              deviceType:
     *                summary: Example device type not found
     *                value:
     *                  message: "Could not find any device type in db"
     *
     *      406:
     *        description: Occur if an input is not acceptable
     *        content:
     *          application/json:
     *            schema:
     *              type: object
     *              properties:
     *                message:
     *                  type: string
     *                  example: "Field in request is not acceptable"
     *
     *      409:
     *        description: Occur if a device has been existed before
     *        content:
     *          application/json:
     *            schema:
     *              type: object
     *              properties:
     *                message:
     *                  type: string
     *                  example: "Device has been existed"
     *
     * components:
     *  schemas:
     *    HomeNotFound:
     *      type: object
     *      properties:
     *        message:
     *          type: string
     *    AreaNotFound:
     *      type: object
     *      properties:
     *        message:
     *          type: string
     *    DeviceNotFound:
     *      type: object
     *      properties:
     *        message:
     *          type: string
     *    ParentNotFound:
     *      type: object
     *      properties:
     *        message:
     *          type: string
     *    DeviceTypeNotFound:
     *      type: object
     *      properties:
     *        message:
     *          type: string
     *
     */
    .put(
        '',
        (request, response, next) => {
            validation.valid({
                response,
                request,
                next,
                valid: {
                    controller: EValidationController.ENTITY,
                    method: EValidationMethod.UPDATE,
                },
            });
        },
        entityController.update,
    )
    /**
     * @swagger
     * /v1/entity/:
     *  delete:
     *    summary: Delete entity.
     *    security:
     *     - authorizationHeader: []
     *    tags:
     *      - Entity
     *    requestBody:
     *      required: true
     *      content:
     *        application/json:
     *          schema:
     *            type: object
     *            properties:
     *              id:
     *                type: string
     *                example: '3123af-23144aac-3214-4545-6213'
     *              userId:
     *                type: string
     *                example: '3123af-23144aac-3214-4545-6213'
     *              homeId:
     *                type: string
     *                example: '3123af-23144aac-3214-4545-6213'
     *              appCode:
     *                type: string
     *                example: "Phenikaa Life"
     *            required:
     *              - id
     *    responses:
     *      200:
     *        description: Response success
     *        content:
     *          application/json:
     *            schema:
     *              type: object
     *              properties:
     *                message:
     *                  type: string
     *                  example: "Device has been deleted"
     *
     *      404:
     *        description: Occur if a element could not found
     *        content:
     *          application/json:
     *            schema:
     *              type: object
     *              properties:
     *                message:
     *                  type: string
     *                  example: "Could not find any devices in db"
     *
     *      406:
     *        description: Occur if an input is not acceptable
     *        content:
     *          application/json:
     *            schema:
     *              type: object
     *              properties:
     *                message:
     *                  type: string
     *                  example: "Field in request is not acceptable"
     *
     */
    .delete(
        '',
        (request, response, next) => {
            validation.valid({
                response,
                request,
                next,
                valid: {
                    controller: EValidationController.ENTITY,
                    method: EValidationMethod.DELETE,
                },
            });
        },
        entityController.delete,
    );

export default router;
