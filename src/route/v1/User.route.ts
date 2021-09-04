import express from 'express';
import UserController from '../../controller/v1/User.controller';
import { container } from '../../../inversify.config';
import IValidation from '../../interface/IValid.interface';
// import { ValidationClass, ValidationMethod } from '../../constant';
import { EValidationController, EValidationMethod } from '../../interface/IValid.interface';

const validation: IValidation = container.get<IValidation>('Validation');

let userController = container.get<UserController>('UserController');
let router = express.Router();

router
    /**
     * @swagger
     * /v1/user:
     *  get:
     *    summary: Search area in service by query param.
     *    security:
     *     - authorizationHeader: []
     *    tags:
     *      - User
     *    parameters:
     *      - name: userId
     *        in: query
     *        schema:
     *          type: string
     *          example: "3123af-23144aac-3214-4545-6213"
     *      - name: name
     *        in: query
     *        schema:
     *          type: string
     *          example: "Toannm"
     *      - name: phone
     *        in: query
     *        schema:
     *          type: string
     *          example: "0948930789"
     *      - name: email
     *        in: query
     *        schema:
     *          type: string
     *          example: "toannm.hust@gmail.com"
     *      - name: address
     *        in: query
     *        schema:
     *          type: string
     *          example: "167 Hoàng Ngân"
     *      - name: fcm
     *        in: query
     *        schema:
     *          type: string
     *          example: "Eyrdfjkhskjfweqcvxcv=;saqwvcvbff"
     *      - name: appCode
     *        in: query
     *        required: true
     *        schema:
     *          type: string
     *          example: "17a32b13d27"
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
     *                    - userId: "3123af-23144aac-3214-4545-6213"
     *                      name: "toannm"
     *                      phone: "0828823828"
     *                      avatar: "default.png"
     *                      email: "toannm.phe@gmail.com"
     *                      address: "167 Hoàng Ngân"
     *                      fcm: Eyadsdflksjd=;fsdfjwczxcz123aslkdzxc235890
     *                    - userId: "3123af-23144aac-3214-4545-6213"
     *                      name: "toannm"
     *                      phone: "0828823828"
     *                      avatar: "default.png"
     *                      email: "toannm.phe@gmail.com"
     *                      address: "167 Hoàng Ngân"
     *                      fcm: Eyadsdflksjd=;fsdfjwczxcz123aslkdzxc235890
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
     *                  example: "You do not permission to get user"
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
                    controller: EValidationController.USER,
                    method: EValidationMethod.GET,
                },
            });
        },
        userController.get,
    )
    /**
     * @swagger
     * /v1/user/forgot-password:
     *  post:
     *    summary: Verify email.
     *    tags:
     *      - User
     *    requestBody:
     *      required: true
     *      content:
     *        application/json:
     *          schema:
     *            type: object
     *            properties:
     *              email:
     *                type: string
     *                example: 'a@example.com'
     *              appCode:
     *                type: string
     *                example: '17a32b13d27'
     *            required:
     *              - name
     *              - appCode
     *    responses:
     *      200:
     *        description: Return a successfull message
     *        content:
     *          application/json:
     *            schema:
     *              type: object
     *              properties:
     *                message:
     *                  type: string
     *                  example: "Please checking your email to acquire token"
     *
     *      404:
     *        description: Occur if a email is not existed in db
     *        content:
     *          application/json:
     *            schema:
     *              type: object
     *              properties:
     *                message:
     *                  type: string
     *                  example: "Could not found any email in db"
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
     *
     */
    .post(
        '/forgot-password',
        (request, response, next) => {
            validation.valid({
                response,
                request,
                next,
                valid: {
                    controller: EValidationController.USER,
                    method: EValidationMethod.FORGOTPASSWORD,
                },
            });
        },
        userController.forgotPassword,
    )
    /**
     * @swagger
     * /v1/user/verify-email:
     *  post:
     *    summary: Verify email.
     *    tags:
     *      - User
     *    requestBody:
     *      required: true
     *      content:
     *        application/json:
     *          schema:
     *            type: object
     *            properties:
     *              email:
     *                type: string
     *                example: 'a@example.com'
     *              appCode:
     *                type: string
     *                example: '17a32b13d27'
     *            required:
     *              - name
     *              - appCode
     *    responses:
     *      200:
     *        description: Return a successfull message
     *        content:
     *          application/json:
     *            schema:
     *              type: object
     *              properties:
     *                message:
     *                  type: string
     *                  example: "Please checking your email to acquire token"
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
     *        description: Occur if a email has been registered before
     *        content:
     *          application/json:
     *            schema:
     *              type: object
     *              properties:
     *                message:
     *                  type: string
     *                  example: "This email has been registered"
     *
     */
    .post(
        '/verify-email',
        (request, response, next) => {
            validation.valid({
                response,
                request,
                next,
                valid: {
                    controller: EValidationController.USER,
                    method: EValidationMethod.VERIFYEMAIL,
                },
            });
        },
        userController.verifyEmail,
    )
    /**
     * @swagger
     * /v1/user/register:
     *  post:
     *    summary: Create user.
     *    tags:
     *      - User
     *    requestBody:
     *      required: true
     *      content:
     *        application/json:
     *          schema:
     *            type: object
     *            properties:
     *              password:
     *                type: string
     *                example: '323213123'
     *              password_cfm:
     *                type: string
     *                example: '323213123'
     *              token:
     *                type: string
     *                example: '1234'
     *              name:
     *                type: string
     *                example: 'Nguyễn Mạnh Toàn'
     *              phone:
     *                type: string
     *                example: '0948930789'
     *              email:
     *                type: string
     *                example: "toannm.hust@gmail.com"
     *              address:
     *                type: number
     *                example: "167 Hoàng Ngân"
     *              fcm:
     *                type: string
     *                example: "AAAAj29las8:APA91bFy3RiCEUdiBPxvcts-JdRbj9ukKs_UlM3tgmkQBOk6c06HjwJfo2OFfgqy23LJqRNN1YnesbNCcmwbTGsJ-31HO8OIfiyhtpRHuwNMaRHXqZ0fuC2AMzx8y5kiJHMTMSO47g77"
     *              lang:
     *                type: string
     *                example: "vi"
     *            required:
     *              - name
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
     *                      name: "toannm"
     *                      phone: "0828823828"
     *                      email: "toannm.phe@gmail.com"
     *                      address: "167 Hoàng Ngân"
     *                      fcm: Eyadsdflksjd=;fsdfjwczxcz123aslkdzxc235890
     *                      lang: vi
     *                    - id: "3123af-23144aac-3214-4545-6213"
     *                      name: "toannm"
     *                      phone: "0828823828"
     *                      email: "toannm.phe@gmail.com"
     *                      address: "167 Hoàng Ngân"
     *                      fcm: Eyadsdflksjd=;fsdfjwczxcz123aslkdzxc235890
     *                      lang: vi
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
     *                  example: "You do not permission to create user"
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
     *                  example: "User has been existed"
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
                    controller: EValidationController.USER,
                    method: EValidationMethod.CREATE,
                },
            });
        },
        userController.create,
    )
    /**
     * @swagger
     * /v1/user/update-password:
     *  put:
     *    summary: Update password by using old password.
     *    security:
     *     - authorizationHeader: []
     *    tags:
     *      - User
     *    requestBody:
     *      required: true
     *      content:
     *        application/json:
     *          schema:
     *            type: object
     *            properties:
     *              password_old:
     *                type: string
     *                example: "***************"
     *              password_cfm:
     *                type: string
     *                example: "***********"
     *              password:
     *                type: string
     *                example: "***********"
     *            required:
     *              - name
     *    responses:
     *      200:
     *        description: Return a successfull message
     *        content:
     *          application/json:
     *            schema:
     *              type: object
     *              properties:
     *                message:
     *                  type: string
     *                  example: "User has been updated"
     *
     *      400:
     *        description: Occur if old password is incorrect
     *        content:
     *          application/json:
     *            schema:
     *              type: object
     *              properties:
     *                message:
     *                  type: string
     *                  example: "Old password is incorrect"
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
        '/update-password',
        (request, response, next) => {
            validation.valid({
                response,
                request,
                next,
                valid: {
                    controller: EValidationController.USER,
                    method: EValidationMethod.UPDATEPASSWORD,
                },
            });
        },
        userController.updatePassword,
    )
    /**
     * @swagger
     * /v1/user/new-password:
     *  put:
     *    summary: Update password by using verification token.
     *    security:
     *     - authorizationHeader: []
     *    tags:
     *      - User
     *    requestBody:
     *      required: true
     *      content:
     *        application/json:
     *          schema:
     *            type: object
     *            properties:
     *              email:
     *                type: string
     *                example: 'toan93.hust@gmail.com'
     *              password:
     *                type: string
     *                example: '***********'
     *              password_cfm:
     *                type: string
     *                example: '***********'
     *              token:
     *                type: number
     *                example: "1234"
     *            required:
     *              - name
     *    responses:
     *      200:
     *        description: Return a successfull message
     *        content:
     *          application/json:
     *            schema:
     *              type: object
     *              properties:
     *                message:
     *                  type: string
     *                  example: "Your password has been updated successfully"
     *
     *      400:
     *        description: Occur if token expired
     *        content:
     *          application/json:
     *            schema:
     *              type: object
     *              properties:
     *                message:
     *                  type: string
     *                  example: "Token expired"
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
        '/new-password',
        (request, response, next) => {
            validation.valid({
                response,
                request,
                next,
                valid: {
                    controller: EValidationController.USER,
                    method: EValidationMethod.NEWPASSWORD,
                },
            });
        },
        userController.newPassword,
    )
    /**
     * @swagger
     * /v1/user/:
     *  put:
     *    summary: Update user.
     *    security:
     *     - authorizationHeader: []
     *    tags:
     *      - User
     *    requestBody:
     *      required: true
     *      content:
     *        application/json:
     *          schema:
     *            type: object
     *            properties:
     *              name:
     *                type: string
     *                example: 'Nguyễn Mạnh Toàn'
     *              phone:
     *                type: string
     *                example: '0948930789'
     *              address:
     *                type: number
     *                example: "167 Hoàng Ngân"
     *              fcm:
     *                type: string
     *                example: "AAAAj29las8:APA91bFy3RiCEUdiBPxvcts-JdRbj9ukKs_UlM3tgmkQBOk6c06HjwJfo2OFfgqy23LJqRNN1YnesbNCcmwbTGsJ-31HO8OIfiyhtpRHuwNMaRHXqZ0fuC2AMzx8y5kiJHMTMSO47g77"
     *              lang:
     *                type: string
     *                example: "vi"
     *            required:
     *              - name
     *    responses:
     *      200:
     *        description: Return a successfull message
     *        content:
     *          application/json:
     *            schema:
     *              type: object
     *              properties:
     *                message:
     *                  type: string
     *                  example: "Your password has been updated successfully"
     *
     *      400:
     *        description: Occur if nothing is changed
     *        content:
     *          application/json:
     *            schema:
     *              type: object
     *              properties:
     *                message:
     *                  type: string
     *                  example: "Nothing to be changed"
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
                    controller: EValidationController.USER,
                    method: EValidationMethod.UPDATE,
                },
            });
        },
        userController.update,
    )
    /**
     * @swagger
     * /v1/user/:
     *  delete:
     *    summary: Delete user.
     *    security:
     *     - authorizationHeader: []
     *    tags:
     *      - User
     *    responses:
     *      200:
     *        description: Return a successfull message
     *        content:
     *          application/json:
     *            schema:
     *              type: object
     *              properties:
     *                message:
     *                  type: string
     *                  example: "User has been deleted"
     *
     *      404:
     *        description: Occur if nothing is changed
     *        content:
     *          application/json:
     *            schema:
     *              type: object
     *              properties:
     *                message:
     *                  type: string
     *                  example: "Could not find any user in db"
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
                    controller: EValidationController.USER,
                    method: EValidationMethod.DELETE,
                },
            });
        },
        userController.delete,
    );

export default router;
