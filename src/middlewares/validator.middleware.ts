import { Request, Response, NextFunction } from 'express';

export const validateRegister = (req: Request, res: Response, next: NextFunction): void => {
    const { nama, email, password } = req.body;
    if (!nama || !email || !password) {
        res.status(400).json({ message: 'Nama, email, dan password wajib diisi!' });
        return;
    }
    next();
};

export const validateLogin = (req: Request, res: Response, next: NextFunction): void => {
    const { email, password } = req.body;
    if (!email || !password) {
        res.status(400).json({ message: 'Email dan password wajib diisi!' });
        return;
    }
    next();
};

export const validateTodo = (req: Request, res: Response, next: NextFunction): void => {
    const { task } = req.body;
    if (!task) {
        res.status(400).json({ message: 'Task wajib diisi!' });
        return;
    }
    next();
};