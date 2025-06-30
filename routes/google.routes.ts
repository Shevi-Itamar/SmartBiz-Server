import { Router } from 'express';
import { handleGoogleLogin } from '../controllers/google.controller';


const router = Router();
router.post('/',handleGoogleLogin);
export default router;