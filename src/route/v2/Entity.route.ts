import express from 'express';
import EntityController from '../../controller/v1/Entity.controller';
import { container } from '../../../inversify.config';

let entityController = container.get<EntityController>('EntityController');
let router = express.Router();

router
    .get('/get', entityController.get)
    .post('/create', entityController.create)
    .put('/update', entityController.update)
    .delete('/delete', entityController.delete);

export default router;
