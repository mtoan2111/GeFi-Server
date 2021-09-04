import express from 'express';
import HomeController from '../../controller/v1/Home.controller';
import { container } from '../../../inversify.config';

let homeController = container.get<HomeController>('HomeController');
let router = express.Router();

router
    .get('/get', homeController.get)
    .post('/create', homeController.create)
    .put('/update', homeController.update)
    .delete('/delete', homeController.delete);

export default router;
