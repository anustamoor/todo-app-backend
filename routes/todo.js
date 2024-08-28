import express from 'express';
import {getAllTodos, createTodo, getTodoById, updateTodo, deleteTodo, completeTodo } from '../controllers/todo.js';

const router = express.Router();

router.get('/', getAllTodos);
router.post('/', createTodo);
router.get('/:id', getTodoById);
router.put('/:id', updateTodo);
router.put('/complete/:id', completeTodo);
router.delete('/:id', deleteTodo);

export default router;