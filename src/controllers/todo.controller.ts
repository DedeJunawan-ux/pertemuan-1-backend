import { Response } from 'express';
import pool from '../config/database';
import { AuthRequest } from '../middlewares/auth.middleware';

export const getTodos = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?.id; 
        
        const [rows] = await pool.query('SELECT * FROM todos WHERE user_id = ?', [userId]);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: 'Terjadi kesalahan saat mengambil Todo' });
    }
};

export const createTodo = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?.id;
        const { task } = req.body;
        
        // Baris ini sudah diperbaiki untuk menangkap hasil query MySQL
        const [result]: any = await pool.query('INSERT INTO todos (user_id, task) VALUES (?, ?)', [userId, task]);
        
        res.status(201).json({
            success: true,
            message: "Tugas berhasil ditambahkan!",
            data: {
                id: result.insertId, 
                task: task,
                is_completed: false
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Terjadi kesalahan saat menyimpan Todo' });
    }
};