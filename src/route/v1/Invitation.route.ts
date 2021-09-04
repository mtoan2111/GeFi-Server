import express from 'express';
import InvitationController from '../../controller/v1/Invitation.controller';
import { container } from '../../../inversify.config';
import IValidation from '../../interface/IValid.interface';
// import { ValidationClass, ValidationMethod } from '../../constant';
import { EValidationController, EValidationMethod } from '../../interface/IValid.interface';

const validation: IValidation = container.get<IValidation>('Validation');

let invitationController = container.get<InvitationController>('InvitationController');
let router = express.Router();

router
    /**
     * @swagger
     * /v1/invitation:
     *  get:
     *    summary: Search invitation in service by query param.
     *    security:
     *     - authorizationHeader: []
     *    tags:
     *      - Invitation
     *    parameters:
     *      - name: id
     *        in: query
     *        schema:
     *          type: string
     *          example: "3123af-23144aac-3214-4545-6213"
     *      - name: ownerId
     *        in: query
     *        schema:
     *          type: string
     *          example: "3123af-23144aac-3214-4545-6213"
     *      - name: homeId
     *        in: query
     *        schema:
     *          type: string
     *          example: "3123af-23144aac-3214-4545-6213"
     *      - name: memberId
     *        in: query
     *        schema:
     *          type: string
     *          example: "3123af-23144aac-3214-4545-6213"
     *      - name: state
     *        in: query
     *        schema:
     *          type: number
     *          example: 0
     *      - name: isRead
     *        in: query
     *        schema:
     *          type: boolean
     *          example: false
     *      - name: appCode
     *        in: query
     *        required: true
     *        schema:
     *          type: string
     *          example: "Phenikaa Life"
     *    responses:
     *      200:
     *        description: Return a list of invitation if success
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
     *                      ownerId: "3123af-23144aac-3214-4545-6213"
     *                      memberId: "3123af-23144aac-3214-4545-6213"
     *                      isRead: true
     *                      state: -1
     *                      note: "vào nhà đi"
     *                    - id: "3123af-23144aac-3214-4545-6213"
     *                      ownerId: "3123af-23144aac-3214-4545-6213"
     *                      memberId: "3123af-23144aac-3214-4545-6213"
     *                      isRead: true
     *                      state: -1
     *                      note: "vào nhà đi"
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
     *                  example: "You do not permission to get invitation in this home"
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
                    controller: EValidationController.INVITATION,
                    method: EValidationMethod.GET,
                },
            });
        },
        invitationController.get,
    )
    /**
     * @swagger
     * /v1/invitation/:
     *  post:
     *    summary: Create an invitation.
     *    tags:
     *      - Invitation
     *    requestBody:
     *      required: true
     *      content:
     *        application/json:
     *          schema:
     *            type: object
     *            properties:
     *              ownerId:
     *                type: string
     *                example: "d49ccdbe-a756-4920-80ca-1eea0637b547"
     *              memberEmail:
     *                type: array
     *                example: ["ndt4081@gmail.com"]
     *              homeId:
     *                type: string
     *                example: '21beb77a-da40-4a25-9b70-7cf2f62f4e53'
     *              note:
     *                type: string
     *                example: "vao nha di"
     *              appCode:
     *                type: string
     *                example: "Phenikaa Life"
     *            required:
     *              - homeId
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
     *                  example: 'Invitation has been created successfully'
     *
     *      404:
     *        description: Occur if a user could not found
     *        content:
     *          application/json:
     *            schema:
     *              oneOf:
     *                - $ref: "#/components/schemas/ParentNotFound"
     *                - $ref: "#/components/schemas/DeviceTypeNotFound"
     *            examples:
     *              parents:
     *                summary: Example parent not found
     *                value:
     *                  message: "Could not find any parents in db"
     *              deviceType:
     *                summary: Example device type not found
     *                value:
     *                  message: "Could not find this user in system"
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
     *        description: Occur if an invitation has been existed before
     *        content:
     *          application/json:
     *            schema:
     *              type: object
     *              properties:
     *                message:
     *                  type: string
     *                  example: "Invitation has been existed"
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
                    controller: EValidationController.INVITATION,
                    method: EValidationMethod.CREATE,
                },
            });
        },
        invitationController.create,
    )
    /**
     * @swagger
     * /v1/invitation/:
     *  put:
     *    summary: Update an invitation.
     *    tags:
     *      - Invitation
     *    requestBody:
     *      required: true
     *      content:
     *        application/json:
     *          schema:
     *            type: object
     *            properties:
     *              id:
     *                type: string
     *                example: "eb7b1bae-6541-4fec-b5f7-355dcf1bc9f1"
     *              state:
     *                type: integer
     *                example: 1
     *              isRead:
     *                type: boolean
     *                example: true
     *              appCode:
     *                type: string
     *                example: "Phenikaa Life"
     *            required:
     *              - id
     *    responses:
     *      200:
     *        description: Return an area created if success
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
     *
     *      404:
     *        description: Occur if a user could not found
     *        content:
     *          application/json:
     *            schema:
     *              oneOf:
     *                - $ref: "#/components/schemas/ParentNotFound"
     *                - $ref: "#/components/schemas/DeviceTypeNotFound"
     *            examples:
     *              parents:
     *                summary: Example parent not found
     *                value:
     *                  message: "Could not find any parents in db"
     *              deviceType:
     *                summary: Example device type not found
     *                value:
     *                  message: "Could not find this user in system"
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
     *        description: Occur if an invitation has been existed before
     *        content:
     *          application/json:
     *            schema:
     *              type: object
     *              properties:
     *                message:
     *                  type: string
     *                  example: "Invitation has been existed"
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
                    controller: EValidationController.INVITATION,
                    method: EValidationMethod.UPDATE,
                },
            });
        },
        invitationController.update,
    )
    /**
     * @swagger
     * /v1/invitation/:
     *  put:
     *    summary: Update an invitation.
     *    tags:
     *      - Invitation
     *    requestBody:
     *      required: true
     *      content:
     *        application/json:
     *          schema:
     *            type: object
     *            properties:
     *              id:
     *                type: string
     *                example: "eb7b1bae-6541-4fec-b5f7-355dcf1bc9f1"
     *              appCode:
     *                type: string
     *                example: "Phenikaa Life"
     *            required:
     *              - id
     *    responses:
     *      200:
     *        description: Return an area created if success
     *        content:
     *          application/json:
     *            schema:
     *              type: object
     *              properties:
     *                message:
     *                  type: string
     *                  example: "Invitation deleted"
     *
     *      404:
     *        description: Occur if a user could not found
     *        content:
     *          application/json:
     *            schema:
     *              oneOf:
     *                - $ref: "#/components/schemas/ParentNotFound"
     *                - $ref: "#/components/schemas/DeviceTypeNotFound"
     *            examples:
     *              parents:
     *                summary: Example parent not found
     *                value:
     *                  message: "Could not find any parents in db"
     *              deviceType:
     *                summary: Example device type not found
     *                value:
     *                  message: "Could not find this user in system"
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
     *        description: Occur if an invitation has been existed before
     *        content:
     *          application/json:
     *            schema:
     *              type: object
     *              properties:
     *                message:
     *                  type: string
     *                  example: "Invitation has been existed"
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
                    controller: EValidationController.INVITATION,
                    method: EValidationMethod.DELETE,
                },
            });
        },
        invitationController.delete,
    );

export default router;
