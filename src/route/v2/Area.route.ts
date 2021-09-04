import express from 'express';
import AreaController from '../../controller/v1/Area.controller';
import { container } from '../../../inversify.config';

let areaController = container.get<AreaController>('AreaController');
let router = express.Router();

router
    .get('/get', areaController.get)
    .post('/create', areaController.create)
    .put('/update', areaController.update)
    .delete('/delete', areaController.delete);

export default router;
