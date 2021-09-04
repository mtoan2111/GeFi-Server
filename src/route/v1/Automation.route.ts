import express from 'express';
import AutomationController from '../../controller/v1/Automation.controller';
import { container } from '../../../inversify.config';
import IValidation from '../../interface/IValid.interface';
// import { ValidationClass, ValidationMethod } from '../../constant';
import { EValidationController, EValidationMethod } from '../../interface/IValid.interface';

const validation: IValidation = container.get<IValidation>('Validation');

let automationController = container.get<AutomationController>('AutomationController');
let router = express.Router();

router
    /**
     * @swagger
     * /v1/automation:
     *  get:
     *    summary: Search automation in service by query param.
     *    security:
     *     - authorizationHeader: []
     *    tags:
     *      - Automation
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
     *          example: "Default automation"
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
     *      - name: type
     *        in: query
     *        required: true
     *        schema:
     *          type: string
     *          example: "rule"
     *      - name: inputIds
     *        in: query
     *        required: false
     *        schema:
     *          type: array
     *          items:
     *            type: string
     *            example: "3123af-23144aac-3214-4545-6213"
     *      - name: outputIds
     *        in: query
     *        required: false
     *        schema:
     *          type: array
     *          items:
     *            type: string
     *            example: "3123af-23144aac-3214-4545-6213"
     *    responses:
     *      200:
     *        description: Return a list of automation if success
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
     *                  example: "You do not permission to get automation"
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
                    controller: EValidationController.AUTOMATION,
                    method: EValidationMethod.GET,
                },
            });
        },
        automationController.get,
    )
    /**
     * @swagger
     * /v1/area/:
     *  post:
     *    summary: Create automation.
     *    security:
     *     - authorizationHeader: []
     *    tags:
     *      - Automation
     *    requestBody:
     *      required: true
     *      content:
     *        application/json:
     *          schema:
     *            type: object
     *            properties:
     *              name:
     *                type: string
     *                example: 'test rule'
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
     *              type:
     *                type: string
     *                example: "rule"
     *              logic:
     *                type: string
     *                example: "and"
     *              active:
     *                type: boolean
     *                example: true
     *              hcId:
     *                type: string
     *                example: "1c39c65b-6948-481d-a442-aae6ba16fc78"
     *              input:
     *                type: array
     *                items:
     *                  type: object
     *                  properties:
     *                    id:
     *                      type: string
     *                      example: "1c39c65b-6948-481d-a442-aae6ba16fc78"
     *                    state:
     *                      type: object
     *                      properties:
     *                        onoff:
     *                          type: boolean
     *                          example: true
     *                        dim:
     *                          type: number
     *                          example: 1
     *                        colortem:
     *                          type: number
     *                          example: 2700
     *                        hsv:
     *                          type: object
     *                          properties:
     *                            h:
     *                              type: number
     *                              example: 355
     *                            s:
     *                              type: number
     *                              example: 255
     *                            v:
     *                              type: number
     *                              example: 100
     *                        door:
     *                          type: boolean
     *                          example: true
     *                        motion:
     *                          type: boolean
     *                          example: true
     *                        contact:
     *                          type: boolean
     *                          example: true
     *                        humidity:
     *                          type: number
     *                          example: 100
     *                        temp:
     *                          type: number
     *                          example: 100
     *                        opcupancy:
     *                          type: number
     *                          example: 100
     *                        light:
     *                          type: number
     *                          example: 100000
     *                        fan:
     *                          type: number
     *                          example: 100
     *                    operator:
     *                      type: object
     *                      properties:
     *                        onoff:
     *                          type: string
     *                          example:
     *                        dim:
     *                          type: string
     *                          example:
     *                        colortem:
     *                          type: string
     *                          example: 2700
     *                        hsv:
     *                          type: object
     *                          properties:
     *                            h:
     *                              type: string
     *                              example: 355
     *                            s:
     *                              type: string
     *                              example: 255
     *                            v:
     *                              type: string
     *                              example: 100
     *                        door:
     *                          type: string
     *                          example: true
     *                        motion:
     *                          type: string
     *                          example: true
     *                        contact:
     *                          type: string
     *                          example: true
     *                        humidity:
     *                          type: string
     *                          example: 100
     *                        temp:
     *                          type: string
     *                          example: 100
     *                        opcupancy:
     *                          type: string
     *                          example: 100
     *                        light:
     *                          type: string
     *                          example: 100000
     *                        fan:
     *                          type: string
     *                          example: 100
     *                  required:
     *                    - id
     *                    - state
     *                    - operator
     *              output:
     *                type: array
     *                items:
     *                  type: object
     *                  properties:
     *                    type:
     *                      type: string
     *                      example: "device"
     *                    id:
     *                      type: string
     *                      example: "1c39c65b-6948-481d-a442-aae6ba16fc78"
     *                    delay:
     *                      type: number
     *                      example: 10000000
     *                    state:
     *                      type: object
     *                      properties:
     *                        onoff:
     *                          type: boolean
     *                          example: true
     *                        dim:
     *                          type: number
     *                          example: 1
     *                        colortem:
     *                          type: number
     *                          example: 2700
     *                        hsv:
     *                          type: object
     *                          properties:
     *                            h:
     *                              type: number
     *                              example: 355
     *                            s:
     *                              type: number
     *                              example: 255
     *                            v:
     *                              type: number
     *                              example: 100
     *                        door:
     *                          type: boolean
     *                          example: true
     *                        motion:
     *                          type: boolean
     *                          example: true
     *                        contact:
     *                          type: boolean
     *                          example: true
     *                        humidity:
     *                          type: number
     *                          example: 100
     *                        temp:
     *                          type: number
     *                          example: 100
     *                        opcupancy:
     *                          type: number
     *                          example: 100
     *                        light:
     *                          type: number
     *                          example: 100000
     *                        fan:
     *                          type: number
     *                          example: 100
     *                  required:
     *                    - type
     *                    - id
     *                    - state
     *              trigger:
     *                type: object
     *                properties:
     *                  type:
     *                    type: string
     *                    example: "timer"
     *                  configuration:
     *                    type: object
     *                    properties:
     *                      start:
     *                        type: string
     *                        example: "0 * * * * ?"
     *                      end:
     *                        type: string
     *                        example: "1 * * * * ?"
     *                    required:
     *                      - start
     *            required:
     *              - homeId
     *              - userId
     *              - name
     *              - appCode
     *              - type
     *              - logic
     *              - active
     *              - input
     *              - output
     *              - trigger
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
     *                  example: "Automation has been created successfully"
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
     *                  example: "You do not permission to create automation"
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
     *        description: Occur if an automation has been existed before
     *        content:
     *          application/json:
     *            schema:
     *              type: object
     *              properties:
     *                message:
     *                  type: string
     *                  example: "Automation has been existed"
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
                    controller: EValidationController.AUTOMATION,
                    method: EValidationMethod.CREATE,
                },
            });
        },
        automationController.create,
    )
    /**
     * @swagger
     * /v1/area/:
     *  put:
     *    summary: Update automation detail.
     *    security:
     *     - authorizationHeader: []
     *    tags:
     *      - Automation
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
     *                  example: "Automation has been updated"
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
     *                  example: "You do not permission to update automation in this home"
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
     *                  example: "Could not find any automation in db"
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
                    controller: EValidationController.AUTOMATION,
                    method: EValidationMethod.UPDATE,
                },
            });
        },
        automationController.update,
    )
    /**
     * @swagger
     * /v1/area/:
     *  delete:
     *    summary: Delete automation.
     *    security:
     *     - authorizationHeader: []
     *    tags:
     *      - Automation
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
                    controller: EValidationController.AUTOMATION,
                    method: EValidationMethod.DELETE,
                },
            });
        },
        automationController.delete,
    );

export default router;
