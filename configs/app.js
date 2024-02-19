'use strict'

import express from 'express'
import morgan from 'morgan'
import helmet from 'helmet'
import cors from 'cors'
import { config } from "dotenv"
import personRoutes from '../src/person/person.routes.js'
import courseRoutes from '../src/course/course.routes.js'
import { validateJwt } from '../middlewares/validate-jwt.js'



const app = express()
config();
const port = process.env.PORT || 3056


app.use(express.urlencoded({extended: false}))
app.use(express.json())
app.use(cors()) 
app.use(helmet()) 
app.use(morgan('dev'))

app.use(courseRoutes)
app.use(personRoutes)
app.use(validateJwt)



export const initServer = ()=>{
    app.listen(port)
    console.log(`Server HTTP running in port ${port}`)
}