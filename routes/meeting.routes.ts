import express from 'express';
const router = express.Router();
import meetingController from '../controllers/meeting.controller';
import auth from '../middlewares/auth.middleware';

// שליפת כל הפגישות – רק למנהל
router.get('/', auth.verifyToken, auth.isAdmin, meetingController.getAllMeetings);

// שליפת כל הפגישות של משתמש לפי מייל – מנהל או המשתמש עצמו
router.get('/user/:email', auth.verifyToken, auth.isSelfOrAdmin, meetingController.getMeetingsByEmail);

// שליפת פגישה בודדת לפי ID – מנהל או מי שיצר את הפגישה
router.get('/:id', auth.verifyToken, meetingController.getMeetingById);

// יצירת פגישה – משתמש או מנהל
router.post('/', auth.verifyToken, meetingController.createMeeting);

// עדכון פגישה – משתמש או מנהל
router.put('/:id', auth.verifyToken, meetingController.updateMeeting);

// מחיקת פגישה – משתמש או מנהל
router.delete('/:id', auth.verifyToken, meetingController.deleteMeeting);

router.get('/free-hours/:date', auth.verifyToken, meetingController.getAvailableHours);

export default router;
