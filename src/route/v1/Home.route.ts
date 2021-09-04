import express from 'express';
import HomeController from '../../controller/v1/Home.controller';
import { container } from '../../../inversify.config';
import IValidation from '../../interface/IValid.interface';
// import { ValidationClass, ValidationMethod } from '../../constant';
import { EValidationController, EValidationMethod } from '../../interface/IValid.interface';

const validation: IValidation = container.get<IValidation>('Validation');
let homeController = container.get<HomeController>('HomeController');
let router = express.Router();

router
    /**
     * @swagger
     * /v1/home:
     *  get:
     *    summary: Search home in service by query param.
     *    tags:
     *      - Home
     *    security:
     *     - authorizationHeader: []
     *    parameters:
     *      - name: name
     *        in: query
     *        schema:
     *          type: string
     *          example: "Default room"
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
     *          example: "1c39c65b-6948-481d-a442-aae6ba16fc78"
     *      - name: appCode
     *        in: query
     *        required: true
     *        schema:
     *          type: string
     *          example: "Phenikaa Life"
     *    responses:
     *      200:
     *        description: Return a list of homes if success
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
     *                      userId: "3123af-23144aac-3214-4545-6213"
     *                      name: "Biệt phủ cầu giấy 200 triệu đô la"
     *                      logo: "default.png"
     *                      position: "null"
     *                      owner: true
     *                      entitiesCount: 0
     *                      areasCount: 100
     *                    - id: "3123af-23144aac-3214-4545-6213"
     *                      userId: "3123af-23144aac-3214-4545-6213"
     *                      name: "Biệt phủ hoàn kiếm 2000 mét vuông"
     *                      position: "null"
     *                      owner: false
     *                      entitiesCount: 0
     *                      areasCount: 100
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
     *                  example: "You do not permission to get home"
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
                    controller: EValidationController.HOME,
                    method: EValidationMethod.GET,
                },
            });
        },
        homeController.get,
    )
    /**
     * @swagger
     * /v1/home/:
     *  post:
     *    security:
     *     - authorizationHeader: []
     *    summary: Create home.
     *    tags:
     *      - Home
     *    requestBody:
     *      required: true
     *      content:
     *        application/json:
     *          schema:
     *            type: object
     *            properties:
     *              userId:
     *                type: string
     *                example: 'a55a3704-019f-4f12-9def-bf12bcc49d80'
     *              name:
     *                type: string
     *                example: 'Nha cua Thanh'
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
     *              - userId
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
     *                  example: "Home has been created successfully"
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
     *                  example: "You do not permission to create home"
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
     *                  example: "Home has been existed"
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
                    controller: EValidationController.HOME,
                    method: EValidationMethod.CREATE,
                },
            });
        },
        homeController.create,
    )
    /**
     * @swagger
     * /v1/home/:
     *  put:
     *    summary: Update home detail.
     *    tags:
     *      - Home
     *    security:
     *     - authorizationHeader: []
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
     *                  example: "Home has been updated"
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
     *                  example: "You do not permission to update home"
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
     *                  example: "Could not find any home in db"
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
                    controller: EValidationController.HOME,
                    method: EValidationMethod.UPDATE,
                },
            });
        },
        homeController.update,
    )
    /**
     * @swagger
     * /v1/home/:
     *  delete:
     *    summary: Delete home.
     *    security:
     *     - authorizationHeader: []
     *    tags:
     *      - Home
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
     *                  example: "Home has been deleted"
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
     *                  example: "You do not permission to delete home"
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
     */
    .delete(
        '',
        (request, response, next) => {
            validation.valid({
                response,
                request,
                next,
                valid: {
                    controller: EValidationController.HOME,
                    method: EValidationMethod.DELETE,
                },
            });
        },
        homeController.delete,
    );

export default router;
