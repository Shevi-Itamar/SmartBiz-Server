import express from 'express';
const router = express.Router();
import userController from '../controllers/users.controller';
import auth from '../middlewares/auth.middleware';
import login from "../controllers/auth.controller";  
import authController from '../controllers/auth.controller';

router.post("/login", login.login);  // לוגין
// שליפת כל המשתמשים - רק למנהל
router.get('/', auth.verifyToken, auth.isAdmin, userController.getAllUsers);

// שליפת משתמש לפי מייל - על עצמו או על אחרים אם מנהל
router.get('/:email', auth.verifyToken, auth.isSelfOrAdmin, userController.getUserByEmail);

// יצירת משתמש - פתוח לכולם
router.post('/', userController.createUser);

// עדכון משתמש - על עצמו או על אחרים אם מנהל
router.put('/:email', auth.verifyToken, auth.isSelfOrAdmin, userController.updateUser);

// מחיקת משתמש - על עצמו או על אחרים אם מנהל
router.delete('/:email', auth.verifyToken, auth.isSelfOrAdmin, userController.deleteUser);

router.post('/forgot-password', authController.forgotPassword); // שליחת מייל איפוס סיסמה

router.post('/reset-password', authController.resetPassword); // איפוס סיסמה

export default router;
