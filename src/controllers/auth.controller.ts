import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import pool from '../config/database';

export const register = async (req: Request, res: Response): Promise<void> => {
    try {
        const { nama, email, password } = req.body;
        
        const hashedPassword = await bcrypt.hash(password, 10);
        
        const [rows]: any = await pool.query('SELECT * FROM Auth WHERE email = ?', [email]);
        if (rows.length > 0) {
            res.status(400).json({ message: 'Email sudah terdaftar' });
            return;
        }

        await pool.query('INSERT INTO Auth (nama, email, password) VALUES (?, ?, ?)', [nama, email, hashedPassword]);
        res.status(201).json({ message: 'Registrasi berhasil' });
    } catch (error) {
        res.status(500).json({ message: 'Terjadi kesalahan pada server' });
    }
};

export const login = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;
        
        const [rows]: any = await pool.query('SELECT * FROM Auth WHERE email = ?', [email]);
        if (rows.length === 0) {
            res.status(401).json({ message: 'Email atau password salah' });
            return;
        }

        const user = rows[0];
        
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            res.status(401).json({ message: 'Email atau password salah' });
            return;
        }

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET as string, { expiresIn: '2h' });
        res.json({ message: 'Login berhasil', token });
    } catch (error) {
        res.status(500).json({ message: 'Terjadi kesalahan pada server' });
    }
};