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
        //Capturar el formulario (body)
        let data = req.body
        //Encriptar la contraseña
        data.password = await encrypt(data.password)
        //Asignar el rol por defecto
        data.role = 'STUDENT'

        let course = await Course.findOne({ _id: data.keeper })
        if (!course) return res.status(404).send({ message: 'courses not found' })
        //Guardar la información en la BD
        let person = new Person(data)
        await person.save() //Guardar en la BD
        //Responder al usuario
        return res.send({message: `Registered successfully, can be logged with username ${person.username}`})
    }catch(err){
        console.error(err)
        return res.status(500).send({message: 'Error registering person', err: err})
    }
}

export const login = async(req, res)=>{
    try{
        //Capturar los datos (body)
        let { username, password } = req.body
        //Validar que el usuario exista
        let person = await Person.findOne({username}) //buscar un solo registro
        //Verifico que la contraseña coincida
        if(person && await checkPassword(password, person.password)){
            let loggedPerson = {
                uid: person._id,
                username: person.username,
                name: person.name,
                role: person.role
            }
            //generar token
            let token = await generateJwt(loggedPerson)
             //Respondo al usuario
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

export const update = async(req, res)=>{ //Datos generales (No password)
    try{
        //Obtener el id del usuario a actualizar
        let { id } = req.params
        //Obtener los datos a actualizar
        let data = req.body
        //Validar si data trae datos
        let update = checkUpdate(data, id)
        if(!update) return res.status(400).send({message: 'Have submitted some data that cannot be updated or missing data'})
        //Validar si tiene permisos (tokenización) X Hoy No lo vemos X
        //Actualizar (BD)
        let updatedPerson = await Person.findOneAndUpdate(
            {_id: id}, //ObjectsId <- hexadecimales (Hora sys, Version Mongo, Llave privada...)
            data, //Los datos que se van a actualizar
            {new: true} //Objeto de la BD ya actualizado
        )
        //Validar la actualización
        if(!updatedPerson) return res.status(401).send({message: 'Person not found and not updated'})
        //Respondo al usuario
        return res.send({message: 'Updated person', updatedPerson})
    }catch(err){
        console.error(err)
        if(err.keyValue.username) return res.status(400).send({message: `Username ${err.keyValue.username} is alredy taken`})
        return res.status(500).send({message: 'Error updating account'})
    }
}

export const deleteP = async(req, res)=>{
    try{
        //Obtener el Id
        let { id } = req.params
        //Validar si está logeado y es el mismo X No lo vemos hoy X
        //Eliminar (deleteOne (solo elimina no devuelve el documento) / findOneAndDelete (Me devuelve el documento eliminado))
        let deletedPerson = await Person.findOneAndDelete({_id: id}) 
        //Verificar que se eliminó
        if(!deletedPerson) return res.status(404).send({message: 'Account not found and not deleted'})
        //Responder
        return res.send({message: `Account with username ${deletedPerson.username} deleted successfully`}) //status 200
    }catch(err){
        console.error(err)
        return res.status(500).send({message: 'Error deleting account'})
    }
}