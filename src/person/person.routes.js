import express from 'express'
import { validateJwt, isTeacher } from '../../middlewares/validate-jwt.js';
import { test, register, login, update, deleteP } from './person.controller.js';

const api = express.Router();

api.get('/test', [validateJwt, isTeacher], test)
api.post('/register', register)
api.post('/login', login)
api.put('/update/:id', [validateJwt], update)
api.delete('/delete/:id', [validateJwt], deleteP)

export default api