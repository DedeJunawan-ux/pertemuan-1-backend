import { Router } from 'express';
import authRoutes from './auth.routes';
import todoRoutes from './todo.routes';
import { authenticateJWT } from '../middlewares/auth.middleware'; 

const router = Router();
router.use('/auth', authRoutes);
router.use('/todos', authenticateJWT, todoRoutes); 

export default router;