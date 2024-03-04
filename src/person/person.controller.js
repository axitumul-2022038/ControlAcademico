'use strict' //Modo estricto

import Person from './person.model.js'
import { checkPassword, encrypt, checkUpdate } from '../../utils/validator.js'
import { generateJwt } from '../../utils/jwt.js'
import Course from '../course/course.model.js'

export const test = (req, res)=>{
    console.log('test is running')
    return res.send({message: 'Test is running'})
}

export const register = async(req, res)=>{
    try{
        let data = req.body
        data.password = await encrypt(data.password)
        data.role = 'STUDENT'

        let course = await Course.findOne({ _id: data.course })
        if (!course) return res.status(404).send({ message: 'courses not found' })
        let person = new Person(data)
        await person.save()
        return res.send({message: `Registered successfully, can be logged with username ${person.username}`})
    }catch(err){
        console.error(err)
        return res.status(500).send({message: 'Error registering person', err: err})
    }
}

export const login = async(req, res)=>{
    try{
        let { username, password } = req.body
        let person = await Person.findOne({username}) 
        if(person && await checkPassword(person.password)){
            let loggedPerson = {
                uid: person._id,
                username: person.username,
                name: person.name,
                role: person.role
            }
            let token = await generateJwt(loggedPerson)
             return res.send(
                {   
                    message: `Welcome ${loggedPerson.name}`,
                    loggedPerson,
                    token
                }
            )}
        return res.status(404).send({message: 'Invalid credentials'})
    }catch(err){
        console.error(err)
        return res.status(500).send({message: 'Error to login'})
    }
}

export const update = async(req, res)=>{ 
    try{
        let { id } = req.params
        let data = req.body
        let update = checkUpdate(data, id)
        if(!update) return res.status(400).send({message: 'Have submitted some data that cannot be updated or missing data'})
        let updatedPerson = await Person.findOneAndUpdate(
            {_id: id}, 
            data,
            {new: true}
        )
        if(!updatedPerson) return res.status(401).send({message: 'Person not found and not updated'})
        return res.send({message: 'Updated person', updatedPerson})
    }catch(err){
        console.error(err)
        if(err.keyValue.username) return res.status(400).send({message: `Username ${err.keyValue.username} is alredy taken`})
        return res.status(500).send({message: 'Error updating account'})
    }
}

export const deleteP = async(req, res)=>{
    try{
        let { id } = req.params
        let deletedPerson = await Person.findOneAndDelete({_id: id}) 
        if(!deletedPerson) return res.status(404).send({message: 'Account not found and not deleted'})
        return res.send({message: `Account with username ${deletedPerson.username} deleted successfully`}) 
    }catch(err){
        console.error(err)
        return res.status(500).send({message: 'Error deleting account'})
    }
}