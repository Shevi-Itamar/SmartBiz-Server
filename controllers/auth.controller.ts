import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import Users from '../models/Users.model';
import log4js from '../logger';
import { Request, Response } from 'express';
import authService from '../services/auth.service';
import usersService from '../services/users.service';
import sendEmail from '../services/sendEmail.service'

const logger = log4js.getLogger('auth.controller');
const SECRET= process.env.SECRET ||'';

/**
 * POST /login
 * התחברות משתמש לפי אימייל וסיסמה
 */
const login = async (req: Request, res: Response): Promise<void> => {
  const { userEmail, userPassword } = req.body;

  logger.info(`Login attempt: ${userEmail}`);

  if (!userEmail || !userPassword) {
    logger.warn('Login failed: Missing credentials');
    res.status(400).send('Missing credentials');
    return;
  }

  try {
    const user = await Users.findOne({ userEmail });

    if (!user) {
      logger.warn(`Login failed: User not found (${userEmail})`);
      res.status(401).send('Invalid email or password');
      return;
    }

    const validPassword = await bcrypt.compare(userPassword, user.userPassword);
    if (!validPassword) {
      logger.warn(`Login failed: Incorrect password for ${userEmail}`);
      res.status(401).send('Invalid email or password');
      return;
    }

    const token = jwt.sign(
      {
        userId: user._id,
        email: user.userEmail,
        role: user.role,
      },
      SECRET,
      { expiresIn: '2h' }
    );

    logger.info(`Login success: ${userEmail}`);
    res.status(200).json({
      token, user: {
        userId: user._id,
        userEmail: user.userEmail,
        role: user.role,
        userName: user.userName,
        userPhone: user.userPhone,
        userAddress: user.userAddress,

      }
    });

  } catch (err: any) {
    logger.error(`Login error for ${userEmail}: ${err.message}`);
    res.status(500).send('Server error');
  }
};


const forgotPassword = async (req: Request, res: Response): Promise<void> => {
  const { userEmail } = req.body;
  if (!userEmail) {
    logger.warn('Forgot password failed: Missing email');
    res.status(400).send('Missing email');
    return;
  }
  try {
    const user = await usersService.getUserByEmail(req.body.userEmail);
    if (!user) {
      logger.warn(`Forgot password failed: User not found (${req.body.userEmail})`);
      res.status(404).send('User not found');
      return;
    }

    logger.info(`Forgot password request for: ${userEmail}`);
    const tempCode = authService.createTempCode(userEmail);
    const { email, code } = await tempCode;
    await sendEmail.sendSimpleMessage(email, code);

    logger.info(`Forgot password email sent to: ${userEmail}`);
    res.status(200).send('Email sent with reset code');
  } catch (err: any) {
    logger.error(`Forgot password error for ${userEmail}: ${err.message}`);
    res.status(500).send('Server error');
  }

}

const resetPassword = async (req: Request, res: Response): Promise<void> => {
  const { userEmail, code, newPassword } = req.body;
  if (!userEmail || !code || !newPassword) {
    logger.warn('Reset password failed: Missing credentials');
    res.status(400).send('Missing credentials');
    return;
  }
  try {
    const isValidCode = await authService.verifyTempCode(userEmail, code);
    if (!isValidCode) {
      logger.warn(`Reset password failed: Invalid code for ${userEmail}`);
      res.status(400).send('Invalid code');
      return;
    }
    const hushedPassword = await bcrypt.hash(newPassword, 10);
    await usersService.updateUser(userEmail, {userPassword:hushedPassword});

    logger.info(`Password reset successful for ${userEmail}`);
    res.status(200).send('Password reset successful');
  } catch (err: any) {
    logger.error(`Reset password error for ${userEmail}: ${err.message}`);
    res.status(500).send('Server error');
  }
}







export default { login, forgotPassword, resetPassword };
