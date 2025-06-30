import { Request, Response } from 'express';
import { OAuth2Client } from 'google-auth-library';
import usersService from '../services/users.service';
import jwt from 'jsonwebtoken';

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID|| ''; // Replace with your actual Google Client ID
const client = new OAuth2Client(CLIENT_ID);
const SECRET = process.env.SECRET ||'';
export const handleGoogleLogin = async (req: Request, res: Response) => {
    const { token } = req.body;

    try {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: CLIENT_ID,
        });

        const payload = ticket.getPayload();
        if (!payload) {
            res.status(401).json({ message: 'Invalid token' });
            return;
        }

        const { sub, email, name } = payload;

        const user = await usersService.getUserByEmail(email);
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        
        const userToken = jwt.sign(
            {
                userId: user._id,
                email: user.userEmail,
                role: user.role,
            },
            SECRET,
            { expiresIn: '2h' }
        );

        res.json({ token: userToken, user:user});
    } catch (err) {
        console.error('Error verifying token:', err);
        res.status(401).json({ message: 'Token verification failed' });
    }
}