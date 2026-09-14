import { Request, Response, NextFunction } from 'express';

export const validateRegister = (req: Request, res: Response, next: NextFunction): void => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
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
    if (!task || task.trim() === '') {
        res.status(400).json({ message: 'Task tidak boleh kosong!' });
        return;
    }
    next();
};

export const validateUpdateTodo = (req: Request, res: Response, next: NextFunction): void => {
    const { task, is_completed } = req.body;

    if (task === undefined && is_completed === undefined) {
        res.status(400).json({ success: false, message: 'Isi minimal task atau is_completed!' });
        return;
    }
    // Jika task dikirim, harus berupa string
    if (task !== undefined && typeof task !== 'string') {
        res.status(400).json({ success: false, message: 'Task harus berupa string!' });
        return;
    }
    // Jika is_completed dikirim, harus berupa boolean
    if (is_completed !== undefined && typeof is_completed !== 'boolean') {
        res.status(400).json({ success: false, message: 'is_completed harus berupa true atau false!' });
        return;
    }
    next();
};