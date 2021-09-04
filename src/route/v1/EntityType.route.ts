import express from 'express';
import EntityTypeController from '../../controller/v1/EntityType.Controller';
import { container } from '../../../inversify.config';
import IValidation from '../../interface/IValid.interface';
// import { ValidationClass, ValidationMethod } from '../../constant';
import { EValidationController, EValidationMethod } from '../../interface/IValid.interface';

const validation: IValidation = container.get<IValidation>('Validation');

let entityTypeController = container.get<EntityTypeController>('EntityTypeController');
let router = express.Router();

router
    /**
     * @swagger
     * /v1/entity-type:
     *  get:
     *    summary: Search area in service by query param.
     *    security:
     *     - authorizationHeader: []
     *    tags:
     *      - EntityType
     *    parameters:
     *      - name: app
     *        in: query
     *        schema:
     *          type: string
     *          example: "Phenikaa"
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
     *                    - catId: "3123af-23144aac-3214-4545-6213"
     *                      catName: "toannm"
     *                      catLogo: ""
     *                      type:
     *                        typeId: "3123af-23144aac-3214-4545-6213"
     *                        typeName: "3123af-23144aac-3214-4545-6213"
     *                        typeLogo: "3123af-23144aac-3214-4545-6213"
     *                    - catId: "3123af-23144aac-3214-4545-6213"
     *                      catName: "toannm"
     *                      catLogo: ""
     *                      type:
     *                        typeId: "3123af-23144aac-3214-4545-6213"
     *                        typeName: "3123af-23144aac-3214-4545-6213"
     *                        typeLogo: "3123af-23144aac-3214-4545-6213"
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
                    controller: EValidationController.ENTITYTYPE,
                    method: EValidationMethod.GET,
                },
            });
        },
        entityTypeController.get,
    );

export default router;
