import express from 'express'
import {addtask, getTasks, updateTask, deleteTask, updateTaskStatus} from '../controllers/todo.controller.js';
import { authenticateToken } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/addTask', authenticateToken, addtask);
router.get('/getTask', authenticateToken, getTasks);
router.put('/task/:taskId', authenticateToken, updateTask);
router.delete('/task/:taskId', authenticateToken, deleteTask);
router.patch('/updateStatus/:taskId', authenticateToken, updateTaskStatus);

export default router;