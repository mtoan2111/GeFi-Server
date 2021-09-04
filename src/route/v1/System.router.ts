import express from 'express';
import SystemController from '../../controller/v1/System.controller';
import { container } from '../../../inversify.config';

let systemController = container.get<SystemController>('SystemController');
let router = express.Router();

router
    /**
     * @swagger
     * /v1/system/ping:
     *  get:
     *    summary: Ping.
     *    tags:
     *      - System
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
     *                env:
     *                  type: string
     *                  example: "dev"
     *                version:
     *                  type: string
     *                  example: "0.4.4-20210512-c4d46b8"
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
     */
    .get('/ping', systemController.ping);

export default router;
