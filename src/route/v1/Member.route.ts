import express from 'express';
import MemberController from '../../controller/v1/Member.controller';
import { container } from '../../../inversify.config';
import InvitationController from '../../controller/v1/Invitation.controller';
import IValidation from '../../interface/IValid.interface';
// import { ValidationClass, ValidationMethod } from '../../constant';
import { EValidationController, EValidationMethod } from '../../interface/IValid.interface';

const validation: IValidation = container.get<IValidation>('Validation');

let memberController = container.get<MemberController>('MemberController');
let invitationController = container.get<InvitationController>('InvitationController');
let router = express.Router();

router
    /**
     * @swagger
     * /v1/member:
     *  get:
     *    summary: Search member in service by query param.
     *    security:
     *     - authorizationHeader: []
     *    tags:
     *      - Member
     *    parameters:
     *      - name: id
     *        in: query
     *        schema:
     *          type: string
     *          example: "3123af-23144aac-3214-4545-6213"
     *      - name: homeId
     *        in: query
     *        required: true
     *        schema:
     *          type: string
     *          example: "3123af-23144aac-3214-4545-6213"
     *      - name: memberEmail
     *        in: query
     *        schema:
     *          type: string
     *          example: "toannm.hust@gmail.com"
     *      - name: name
     *        in: query
     *        schema:
     *          type: string
     *          example: "toannm"
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
     *                      name: "Closer số 1"
     *                    - id: "3123af-23144aac-3214-4545-6213"
     *                      homeId: "3123af-23144aac-3214-4545-6213"
     *                      name: "Lesor số 2"
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
     *                  example: "You do not permission to get member in this home"
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
                    controller: EValidationController.MEMBER,
                    method: EValidationMethod.GET,
                },
            });
        },
        memberController.get,
    )
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
     * /v1/member/:
     *  put:
     *    summary: update member.
     *    security:
     *     - authorizationHeader: []
     *    tags:
     *      - Member
     *    requestBody:
     *      required: true
     *      content:
     *        application/json:
     *          schema:
     *            type: object
     *            properties:
     *              memberEmail:
     *                type: string
     *                example: '3123af-23144aac-3214-4545-6213'
     *              userId:
     *                type: string
     *                example: '3123af-23144aac-3214-4545-6213'
     *              homeId:
     *                type: string
     *                example: '3123af-23144aac-3214-4545-6213'
     *              name:
     *                type: string
     *                example: 'Iphone Clock 13 pro max 512GB'
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
     *                  example: "Member has been updated"
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
     *                  example: "You do not permission to update member in this home"
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
     *                  example: "Could not find this member"
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
                    controller: EValidationController.MEMBER,
                    method: EValidationMethod.UPDATE,
                },
            });
        },
        memberController.update,
    )
    /**
     * @swagger
     * /v1/member/:
     *  delete:
     *    summary: Delete member.
     *    security:
     *     - authorizationHeader: []
     *    tags:
     *      - Member
     *    requestBody:
     *      required: true
     *      content:
     *        application/json:
     *          schema:
     *            type: object
     *            properties:
     *              memberId:
     *                type: string
     *                example: 'c932cf65-6b67-41bc-adec-4e005a53451a'
     *              memberEmail:
     *                type: string
     *                example: 'toannm.hust@gmail.com'
     *              userId:
     *                type: string
     *                example: '21beb77a-da40-4a25-9b70-7cf2f62f4e53'
     *              homeId:
     *                type: string
     *                example: '21beb77a-da40-4a25-9b70-7cf2f62f4e53'
     *              appCode:
     *                type: string
     *                example: "Phenikaa Life"
     *            required:
     *              - id
     *              - homeId
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
     *                  example: "Member has been deleted"
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
     *                  example: "You do not permission to delete member in this home"
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
     *                  example: "Could not find any member in db"
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
                    controller: EValidationController.MEMBER,
                    method: EValidationMethod.DELETE,
                },
            });
        },
        memberController.delete,
    );

export default router;
