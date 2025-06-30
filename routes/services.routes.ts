import express from 'express';
import servicesController from '../controllers/services.controller';
const router = express.Router();
import auth from '../middlewares/auth.middleware';

router.get('/', servicesController.getAllServices);
router.get('/:id', servicesController.getServiceById);
router.post('/',auth.verifyToken,auth.isAdmin, servicesController.createService);
router.put('/:id',auth.verifyToken,auth.isAdmin, servicesController.updateService);
router.delete('/:id',auth.verifyToken,auth.isAdmin, servicesController.deleteService);

export default router;
