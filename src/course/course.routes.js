import express from 'express'
import { validateJwt, isTeacher } from '../../middlewares/validate-jwt.js';
import { test, register, update, deleteC } from './course.controller.js';

const api = express.Router();

api.get('/test', test)
api.post('/register', register)
api.put('/update/:id', update)
api.delete('/delete/:id',    deleteC)

export default api