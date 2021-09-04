import express from 'express';
import AreaController from '../../controller/v1/Area.controller';
import { container } from '../../../inversify.config';

let areaController = container.get<AreaController>('AreaController');
let router = express.Router();

/**
 * @swagger
 * /user:
 *  get:
 *    summary: Get the list users.
 *    security:
 *     - authorizationHeader: []
 *    responses:
 *      200:
 *        description: A list of users
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                data:
 *                  type: array
 *                  properties:
 *                    id:
 *                      type: string
 *                      description: The user ID
 *                      example: 'b902cf19-ac73-4f22-8c8a-d0f63269b609'
 *                    name:
 *                      type: string
 *                      description: The name of user
 *                      example: 'Nguyen Van A'   
 *                                  
 */
router.get('/get', areaController.get)
/**
 *  
 *
 *  
 */
.post('/create', areaController.create)
/**
 * 
 * 
 */
.put('/update', areaController.update)
/**
 * 
 * 
 */
.delete('/delete', areaController.delete);

export default router;
