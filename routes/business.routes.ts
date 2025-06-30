import express from"express";
const router = express.Router();
import businessController from "../controllers/business.controller";
import  authMiddleware from '../middlewares/auth.middleware';

// GET - שליפת פרטי עסק
router.get("/", businessController.getBusiness);

// PUT - עדכון פרטי עסק
router.put("/",authMiddleware.verifyToken, authMiddleware.isAdmin, businessController.updateBusiness);

export default router;
