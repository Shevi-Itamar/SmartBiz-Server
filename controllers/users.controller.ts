import { Request, Response } from 'express';
import UsersService from '../services/users.service';
import log4js from '../logger';
import jwt from 'jsonwebtoken';

const SECRET = process.env.SECRET ||'';

const logger = log4js.getLogger('users.controller');

interface IUserRequest extends Request {
  params: {
    email: string;
  };
  body: {
    userName?: string;
    userEmail?: string;
    userPhone?: string;
    userPassword?: string;
    userAddress?: string;
    role?: 'admin' | 'user';
  };
}

// שליפת כל המשתמשים
const getAllUsers = async (_req: Request, res: Response): Promise<void> => {
  logger.info('GET /users - Fetching all users');
  try {
    const users = await UsersService.getAllUsers();
    res.status(200).json(users);
  } catch (error: any) {
    logger.error(`Error fetching users: ${error.message}`);
    res.status(500).send(`Error fetching users: ${error.message}`);
  }
};

// שליפת משתמש לפי מייל
const getUserByEmail = async (req: IUserRequest, res: Response): Promise<void> => {
  const { email } = req.params;
  logger.info(`GET /users/${email} - Fetching user by email`);

  if (!email) {
    logger.warn('Missing email in request');
    res.status(400).send('Missing email parameter');
    return;
  }

  try {
    const user = await UsersService.getUserByEmail(email);
    if (!user) {
      logger.warn(`User with email ${email} not found`);
      res.status(404).send('User not found');
      return;
    }

    res.status(200).json(user);
  } catch (error: any) {
    logger.error(`Error fetching user: ${error.message}`);
    res.status(500).send(`Error fetching user: ${error.message}`);
  }
};

const createUser = async (req: IUserRequest, res: Response): Promise<void> => {
  logger.info('POST /users - Creating new user');
  const { userName, userEmail, userPhone, userPassword, userAddress, role } = req.body;

  if (!userName || !userEmail || !userPhone || !userPassword || !userAddress) {
    logger.warn('Missing required fields in user creation');
    res.status(400).send('Missing required fields');
    return;
  }

  try {
    // צור את המשתמש (שומר גם את הסיסמה בהאש)
    const newUser = await UsersService.createUser({
      userName,
      userEmail,
      userPhone,
      userPassword,
      userAddress,
      role: role || 'user',
    });

    // עכשיו מייצרים JWT באותו אופן כמו בפונקציה login
    const token = jwt.sign(
      {
        userId: newUser._id,
        email: newUser.userEmail,
        role: newUser.role,
      },
      SECRET,
      { expiresIn: '2h' }
    );

    logger.info(`User created with email: ${newUser.userEmail}`);

    res.status(201).json({
      token,
      user: {
        userId: newUser._id,
        userEmail: newUser.userEmail,
        userPassword: newUser.userPassword,
        role: newUser.role,
        userName: newUser.userName,
        userPhone: newUser.userPhone,
        userAddress: newUser.userAddress,
      }
    });
  } catch (error: any) {
    logger.error(`Error creating user: ${error.message}`);
    res.status(500).send(`Error creating user: ${error.message}`);
  }
};


// עדכון משתמש לפי מייל
const updateUser = async (req: IUserRequest, res: Response): Promise<void> => {
  const { email } = req.params;
  logger.info(`PUT /users/${email} - Updating user`);

  const { userName, userPhone, userAddress, userEmail, role } = req.body;

  if (!email) {
    logger.warn('Missing email in request');
    res.status(400).send('Missing email');
    return;
  }

  if (!userName || !userPhone || !userEmail || !userAddress) {
    logger.warn('Missing required fields in user update');
    res.status(400).send('Missing required fields');
    return;
  }

  try {
    const updatedUser = await UsersService.updateUser(email, {
      userName,
      userPhone,
      userEmail,
      userAddress,
      role,    
    });

    if (!updatedUser) {
      logger.warn(`User with email ${email} not found for update`);
      res.status(404).send('User not found');
      return;
    }

    logger.info(`User with email ${email} updated`);
    res.status(200).json(updatedUser);
  } catch (error: any) {
    logger.error(`Error updating user: ${error.message}`);
    res.status(500).send(`Error updating user: ${error.message}`);
  }
};

// מחיקת משתמש לפי מייל
const deleteUser = async (req: IUserRequest, res: Response): Promise<void> => {
  const { email } = req.params;
  logger.info(`DELETE /users/${email} - Deleting user`);

  if (!email) {
    logger.warn('Missing email in delete');
    res.status(400).send('Missing email');
    return;
  }

  try {
    const deletedUser = await UsersService.deleteUser(email);
    if (!deletedUser) {
      logger.warn(`User with email ${email} not found`);
      res.status(404).send('User not found');
      return;
    }

    logger.info(`User with email ${email} deleted`);
    res.status(200).json(deletedUser);
  } catch (error: any) {
    logger.error(`Error deleting user: ${error.message}`);
    res.status(500).send(`Error deleting user: ${error.message}`);
  }
};

export default  {
    getAllUsers,
    getUserByEmail,
    createUser,
    updateUser,
    deleteUser
    };