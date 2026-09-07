import express from 'express';
import cors from 'cors';
import { authenticateJWT } from './middlewares/auth.middleware';
import { validateRegister, validateLogin, validateTodo } from './middlewares/validator.middleware';
import * as AuthController from './controllers/auth.controller';
import * as TodoController from './controllers/todo.controller';

const app = express();

app.use(cors());
app.use(express.json());

app.post('/api/auth/register', validateRegister, AuthController.register);
app.post('/api/auth/login', validateLogin, AuthController.login);

app.get('/api/todos', authenticateJWT, TodoController.getTodos);
app.post('/api/todos', authenticateJWT, validateTodo, TodoController.createTodo);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server Backend berjalan dengan baik di http://localhost:${PORT}`);
});