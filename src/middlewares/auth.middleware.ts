import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
    user?: { id: number };
}

export const authenticateJWT = (req: AuthRequest, res: Response, next: NextFunction): void => {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.split(' ')[1];

        jwt.verify(token, process.env.JWT_SECRET as string, (err: any, user: any) => {
            if (err) {
                res.status(401).json({ message: 'Token tidak valid atau kedaluwarsa' });
                return;
            }
            req.user = { id: user.id };
            next();
        });
    } else {
        res.status(401).json({ message: 'Authorization header tidak ditemukan' });
        return;
    }
};