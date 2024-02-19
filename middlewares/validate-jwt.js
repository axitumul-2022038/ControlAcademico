'use strict'

import jwt from "jsonwebtoken"
import Person from '../src/person/person.model.js'

export const validateJwt =  async(req, res, next)=>{
    try {
        let secretKey = process.env.SECRET_KEY
        let {token} = req.headers
        if(!token) return res.status(401).send({message: 'Unauthorized'})
        let {uid} = jwt.verify(token, secretKey)
        let person = await Person.findOne({_id: uid})
        if(!person) return res.status(404).send({message: 'User not found - Unauthorized'})
        req.person = person
        next()
    } catch (err) {
        console.error(err)
        return res.status(401).send({ message: 'Invalid token'})
    }
}

export const isTeacher = async(req, res, next)=>{
    try {
        let {person} = req
        if(!person || person.role !== 'TEACHER') return res.status(403).send({message: `You dont have access | username: ${person.username}`})
        next()
    } catch (error) {
        console.error(error)
        return res.status(403).send({message: `Unauthorized role`})
    }
}

