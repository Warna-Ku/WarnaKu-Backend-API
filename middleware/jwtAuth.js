import { prismaClient } from '../application/database.js';
import jwt from 'jsonwebtoken';

const authorize = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    console.log(authHeader);

    if (!authHeader) {
        return res.status(401).json({ status: 'Error', message: 'Token not provided' });
    }

    const token = authHeader.split(' ')[1]; //extract Bearer token

    console.log('Token: ', token);

    try {
        const decodedToken = jwt.verify(token, process.env.SECRET_KEY);
        const userId = decodedToken.uid; // Assuming your JWT payload contains a 'uid' field

        console.log(decodedToken);

        const existingUser = await prismaClient.user.findUnique({
            where: {
                uid: userId
            }
        });

        if (!existingUser) {
            return res.status(401).json({ status: 'Error', message: 'Invalid token' });
        }

        // Add the userId to the request object
        req.userId = userId;

        next();
    } catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
            return res.status(401).json({ status: 'Error', message: 'Invalid token' });
        }
        console.error('JWT verification error:', error);
        return res.status(500).json({ status: 'Error', message: 'Internal Server Error' });
    }
};

export default authorize;
