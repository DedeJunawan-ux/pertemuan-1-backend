import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import pool from '../config/database';
import type { RegisterRequest, LoginRequest, JwtUserPayload } from '../types/auth';
import { sendSuccess, sendError } from '../utils/response';

export const register = async (req: Request, res: Response): Promise<void> => {
    const payload: RegisterRequest = req.body;
    try {
        const hashedPassword = await bcrypt.hash(payload.password, 10);
        
        // Pastikan tabel di MySQL bernama 'Auth' dan kolomnya 'nama'
        await pool.query(
            'INSERT INTO Auth (nama, email, password) VALUES (?, ?, ?)', 
            [payload.username, payload.email, hashedPassword]
        );
        
        sendSuccess(res, 'Registrasi berhasil!', null, 201);
    } catch (error: any) {
        console.error("--- ERROR DATABASE REGISTER ---", error);
        if (error.code === 'ER_DUP_ENTRY') {
            sendError(res, 'Username atau Email sudah terdaftar!', 409);
            return;
        }
        sendError(res, 'Error server.', 500);
    }
};

export const login = async (req: Request, res: Response): Promise<void> => {
    const payload: LoginRequest = req.body;
    try {
        const [rows]: any = await pool.query(
            'SELECT * FROM Auth WHERE nama = ?', 
            [payload.username]
        );
        const user = rows[0];

        if (!user || !(await bcrypt.compare(payload.password, user.password))) {
            sendError(res, 'Username atau password salah!', 401);
            return;
        }

        const tokenPayload: JwtUserPayload = { 
            id: user.id, 
            username: user.nama, 
            email: user.email 
        };
        const token = jwt.sign(tokenPayload, process.env.JWT_SECRET as string, { expiresIn: '2h' });

        sendSuccess(res, 'Login berhasil!', { token });
    } catch (error) {
        console.error("--- ERROR DATABASE LOGIN ---", error);
        sendError(res, 'Error server.', 500);
    }
};