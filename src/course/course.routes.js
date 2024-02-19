import express from 'express'
import { validateJwt, isTeacher } from '../../middlewares/validate-jwt.js';
import { test, register, update, deleteC } from './course.controller.js';

const api = express.Router();

api.get('/test', [validateJwt, isTeacher], test)
api.post('/register',[isTeacher], register)
api.put('/update/:id', [validateJwt, isTeacher], update)
api.delete('/delete/:id', [validateJwt, isTeacher], deleteC)

export default api