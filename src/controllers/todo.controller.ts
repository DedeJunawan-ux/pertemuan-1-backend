import { Response } from 'express';
import pool from '../config/database';
import { AuthRequest } from '../middlewares/auth.middleware';

export const getTodos = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?.id; 
        const [rows] = await pool.query('SELECT * FROM todos WHERE user_id = ?', [userId]);
        
        // Output dimodifikasi agar sesuai dengan referensi gambar
        res.status(200).json({
            success: true,
            data: rows
        });
    } catch (error) {
        res.status(500).json({ message: 'Terjadi kesalahan saat mengambil Todo' });
    }
};

export const createTodo = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?.id;
        const { task } = req.body;
        const [result]: any = await pool.query('INSERT INTO todos (user_id, task) VALUES (?, ?)', [userId, task]);
        
        res.status(201).json({
            success: true,
            message: "Tugas berhasil ditambahkan!",
            data: { id: result.insertId, task: task, is_completed: false }
        });
    } catch (error) {
        res.status(500).json({ message: 'Terjadi kesalahan saat menyimpan Todo' });
    }
};

export const getTodoById = async (req: AuthRequest, res: Response): Promise<void> => {
    const { id } = req.params;
    const userId = req.user?.id;
    try {
        const [rows]: any = await pool.query('SELECT * FROM todos WHERE id = ? AND user_id = ?', [id, userId]);
        if (rows.length === 0) {
            res.status(404).json({ success: false, message: 'Tugas tidak ditemukan!' });
            return;
        }
        res.status(200).json({ success: true, data: rows[0] });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Gagal mengambil data.' });
    }
};

export const updateTodo = async (req: AuthRequest, res: Response): Promise<void> => {
    const { id } = req.params;
    const { task, is_completed } = req.body;
    const userId = req.user?.id;
    try {
        const [result]: any = await pool.query(
            'UPDATE todos SET task = ?, is_completed = ? WHERE id = ? AND user_id = ?',
            [task, is_completed, id, userId]
        );
        if (result.affectedRows === 0) {
            res.status(404).json({ success: false, message: 'Tugas tidak ditemukan!' });
            return;
        }
        res.status(200).json({ success: true, message: 'Tugas berhasil diperbarui!' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Gagal memperbarui tugas.' });
    }
};

export const deleteTodo = async (req: AuthRequest, res: Response): Promise<void> => {
    const { id } = req.params;
    const userId = req.user?.id;
    try {
        const [result]: any = await pool.query('DELETE FROM todos WHERE id = ? AND user_id = ?', [id, userId]);
        if (result.affectedRows === 0) {
            res.status(404).json({ success: false, message: 'Tugas tidak ditemukan!' });
            return;
        }
        res.status(200).json({ success: true, message: 'Tugas berhasil dihapus!' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Gagal menghapus tugas.' });
    }
};