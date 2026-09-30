import { Request, Response } from 'express';
import pool from '../config/database';
import type { CreateTodoRequest, UpdateTodoRequest, TodoResponse, TodoRow } from '../types/todo';
import type { PaginationMeta } from '../types/common';
import { sendSuccess, sendSuccessPagination, sendError } from '../utils/response';

const parsePositiveInt = (value: unknown, fallback: number): number => {
    const parsed = Number(value);
    return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
};

export const getTodos = async (req: Request, res: Response): Promise<void> => {
    const userId = req.user.id;
    const page = parsePositiveInt(req.query.page, 1);
    const perPage = Math.min(parsePositiveInt(req.query.perPage, 10), 50);
    const offset = (page - 1) * perPage;

    try {
        const [todos]: any = await pool.query(
            'SELECT * FROM todos WHERE user_id = ? ORDER BY id DESC LIMIT ? OFFSET ?',
            [userId, perPage, offset]
        );
        const [countResult]: any = await pool.query(
            'SELECT COUNT(*) AS total FROM todos WHERE user_id = ?',
            [userId]
        );
        const total = countResult[0].total as number;

        const data: TodoResponse[] = (todos as TodoRow[]).map(({ id, task, is_completed }) => ({
            id,
            todo: task,
            completed: Boolean(is_completed)
        }));

        const pagination: PaginationMeta = {
            page,
            perPage,
            total,
            totalPages: Math.ceil(total / perPage)
        };

        sendSuccessPagination(res, 'Berhasil!', data, pagination);
    } catch (error) {
        sendError(res, 'Gagal mengambil data.', 500);
    }
};

export const createTodo = async (req: Request, res: Response): Promise<void> => {
    const payload: CreateTodoRequest = req.body;
    const userId = req.user.id;
    try {
        const [result]: any = await pool.query('INSERT INTO todos (user_id, task) VALUES (?, ?)', [userId, payload.task]);
        const data: TodoResponse = { id: result.insertId, todo: payload.task, completed: false };
        sendSuccess(res, 'Tugas berhasil ditambahkan!', data, 201);
    } catch {
        sendError(res, 'Gagal menambahkan tugas.', 500);
    }
};

export const getTodoById = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const userId = req.user.id;
    try {
        const [rows]: any = await pool.query('SELECT * FROM todos WHERE id = ? AND user_id = ?', [id, userId]);
        if (rows.length === 0) {
            sendError(res, 'Tugas tidak ditemukan!', 404);
            return;
        }
        const row = rows[0] as TodoRow;
        const data: TodoResponse = { id: row.id, todo: row.task, completed: Boolean(row.is_completed) };
        sendSuccess(res, 'Berhasil!', data);
    } catch {
        sendError(res, 'Gagal mengambil data.', 500);
    }
};

export const updateTodo = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const { task, is_completed } = req.body;
    const userId = req.user.id;

    try {
        const fields: string[] = [];
        const values: any[] = [];

        if (task !== undefined) {
            fields.push('task = ?');
            values.push(task);
        }

        if (is_completed !== undefined) {
            fields.push('is_completed = ?');
            values.push(is_completed);
        }

        if (fields.length === 0) {
            sendError(res, 'Tidak ada data yang dikirim untuk diperbarui!', 400);
            return;
        }

        values.push(id, userId);

        const [result]: any = await pool.query(
            `UPDATE todos SET ${fields.join(', ')} WHERE id = ? AND user_id = ?`,
            values
        );

        if (result.affectedRows === 0) {
            sendError(res, 'Tugas tidak ditemukan!', 404);
            return;
        }

        sendSuccess(res, 'Tugas berhasil diperbarui!');
    } catch {
        sendError(res, 'Gagal memperbarui tugas.', 500);
    }
};

export const deleteTodo = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const userId = req.user.id;
    try {
        const [result]: any = await pool.query('DELETE FROM todos WHERE id = ? AND user_id = ?', [id, userId]);
        if (result.affectedRows === 0) {
            sendError(res, 'Tugas tidak ditemukan!', 404);
            return;
        }
        sendSuccess(res, 'Tugas berhasil dihapus!');
    } catch {
        sendError(res, 'Gagal menghapus tugas.', 500);
    }
};