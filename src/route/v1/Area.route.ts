import express from 'express';
import AreaController from '../../controller/v1/Area.controller';
import { container } from '../../../inversify.config';
import IValidation from '../../interface/IValid.interface';
// import { ValidationClass, ValidationMethod } from '../../constant';
import { EValidationController, EValidationMethod } from '../../interface/IValid.interface';
// import { Response } from '@sendgrid/helpers/classes';

const validation: IValidation = container.get<IValidation>('Validation');
const areaController: AreaController = container.get<AreaController>('AreaController');
let router = express.Router();

router
    /**
     * @swagger
     * /v1/area:
     *  get:
     *    summary: Search area in service by query param.
     *    security:
     *     - authorizationHeader: []
     *    tags:
     *      - Area
     *    parameters:
     *      - name: id
     *        in: query
     *        schema:
     *          type: string
     *          example: "3123af-23144aac-3214-4545-6213"
     *      - name: name
     *        in: query
     *        schema:
     *          type: string
     *          example: "Default room"
     *      - name: homeId
     *        in: query
     *        required: true
     *        schema:
     *          type: string
     *          example: "3123af-23144aac-3214-4545-6213"
     *      - name: userId
     *        in: query
     *        required: true
     *        schema:
     *          type: string
     *          example: "1c39c65b-6948-481d-a442-aae6ba16fc78"
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
     *                      userId: "3123af-23144aac-3214-4545-6213"
     *                      name: "Phòng khách"
     *                      position: "null"
     *                      entitiesCount: 0
     *                      logo: "default.png"
     *                    - id: "3123af-23144aac-3214-4545-6213"
     *                      homeId: "3123af-23144aac-3214-4545-6213"
     *                      userId: "3123af-23144aac-3214-4545-6213"
     *                      name: "Phòng ăn"
     *                      position: "null"
     *                      entitiesCount: 0
     *                      logo: "default.png"
     *
     *      401:
     *        description: Occur if does not have permission
     *        content:
     *          application/json:
     *            schema:
     *              type: object
     *              properties:
     *                message:
     *                  type: string
     *                  example: "You do not permission to get area in this home"
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
    .get(
        '',
        (request, response, next) => {
            validation.valid({
                response,
                request,
                next,
                valid: {
                    controller: EValidationController.AREA,
                    method: EValidationMethod.GET,
                },
            });
        },
        areaController.get,
    )
    /**
     * @swagger
     * /v1/area/:
     *  post:
     *    summary: Create area.
     *    security:
     *     - authorizationHeader: []
     *    tags:
     *      - Area
     *    requestBody:
     *      required: true
     *      content:
     *        application/json:
     *          schema:
     *            type: object
     *            properties:
     *              name:
     *                type: string
     *                example: 'Phòng Khách'
     *              homeId:
     *                type: string
     *                example: '56b1683b-abd5-4025-8b07-946fdedda9c7'
     *              userId:
     *                type: string
     *                example: '1c39c65b-6948-481d-a442-aae6ba16fc78'
     *              logo:
     *                type: string
     *                example: 'default.png'
     *              pos:
     *                type: number
     *                example: 1
     *              appCode:
     *                type: string
     *                example: "Phenikaa Life"
     *            required:
     *              - name
     *    responses:
     *      200:
     *        description: Return a successful message
     *        content:
     *          application/json:
     *            schema:
     *              type: object
     *              properties:
     *                message:
     *                  type: string
     *                  example: "Area has been created successfully"
     *
     *      401:
     *        description: Occur if does not have permission
     *        content:
     *          application/json:
     *            schema:
     *              type: object
     *              properties:
     *                message:
     *                  type: string
     *                  example: "You do not permission to create area in this home"
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
     *                  example: "Could not find any homes in db"
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
     *        description: Occur if an area has been existed before
     *        content:
     *          application/json:
     *            schema:
     *              type: object
     *              properties:
     *                message:
     *                  type: string
     *                  example: "Area has been existed"
     *
     */
    .post(
        '',
        (request, response, next) => {
            validation.valid({
                response,
                request,
                next,
                valid: {
                    controller: EValidationController.AREA,
                    method: EValidationMethod.CREATE,
                },
            });
        },
        areaController.create,
    )
    /**
     * @swagger
     * /v1/area/:
     *  put:
     *    summary: Update area detail.
     *    security:
     *     - authorizationHeader: []
     *    tags:
     *      - Area
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
     *              homeId:
     *                type: string
     *                example: '3123af-23144aac-3214-4545-6213'
     *              userId:
     *                type: string
     *                example: '3123af-23144aac-3214-4545-6213'
     *              name:
     *                type: string
     *                example: 'Phòng Khách'
     *              logo:
     *                type: string
     *                example: 'default.png'
     *              pos:
     *                type: number
     *                example: 1
     *              appCode:
     *                type: string
     *                example: "Phenikaa Life"
     *            required:
     *              - id
     *              - homeId
     *              - userId
     *    responses:
     *      200:
     *        description: Response successful message
     *        content:
     *          application/json:
     *            schema:
     *              type: object
     *              properties:
     *                message:
     *                  type: string
     *                  example: "Area has been updated"
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
     *      401:
     *        description: Occur if does not have permission
     *        content:
     *          application/json:
     *            schema:
     *              type: object
     *              properties:
     *                message:
     *                  type: string
     *                  example: "You do not permission to update area in this home"
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
     *                  example: "Could not find any areas in db"
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
    .put(
        '',
        (request, response, next) => {
            validation.valid({
                response,
                request,
                next,
                valid: {
                    controller: EValidationController.AREA,
                    method: EValidationMethod.UPDATE,
                },
            });
        },
        areaController.update,
    )
    /**
     * @swagger
     * /v1/area/:
     *  delete:
     *    summary: Delete area.
     *    security:
     *     - authorizationHeader: []
     *    tags:
     *      - Area
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
     *              homeId:
     *                type: string
     *                example: '3123af-23144aac-3214-4545-6213'
     *              userId:
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
     *                  example: "Area has been deleted"
     *
     *      401:
     *        description: Occur if does not have permission
     *        content:
     *          application/json:
     *            schema:
     *              type: object
     *              properties:
     *                message:
     *                  type: string
     *                  example: "You do not permission to delete area in this home"
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
     *                  example: "Could not find any area in db"
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
                    controller: EValidationController.AREA,
                    method: EValidationMethod.DELETE,
                },
            });
        },
        areaController.delete,
    );

export default router;
