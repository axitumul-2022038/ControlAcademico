'use strict' //Modo estricto

import Course from './course.model.js'
import { checkUpdate } from '../../utils/validator.js'

export const test = (req, res)=>{
    console.log('test is running')
    return res.send({message: 'Test is running'})
}

export const register = async(req, res)=>{
    try{
        //Capturar el formulario (body)
        let data = req.body
        //Guardar la información en la BD
        let couser = new Course(data)
        await couser.save() //Guardar en la BD
        //Responder al usuario
        return res.send({message: `Registered successfully ${couser.name}`})
    }catch(err){
        console.error(err)
        return res.status(500).send({message: 'Error registering couser', err: err})
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
        //Actualizar (BD)
        let updatedCourse = await Course.findOneAndUpdate(
            {_id: id}, //ObjectsId <- hexadecimales (Hora sys, Version Mongo, Llave privada...)
            data, //Los datos que se van a actualizar
            {new: true} //Objeto de la BD ya actualizado
        )
        //Validar la actualización
        if(!updatedCourse) return res.status(401).send({message: 'Course not found and not updated'})
        //Respondo al usuario
        return res.send({message: 'Updated person', updatedCourse})
    }catch(err){
        console.error(err)
        if(err.keyValue.name) return res.status(400).send({message: `Name ${err.keyValue.name} is alredy taken`})
        return res.status(500).send({message: 'Error updating course'})
    }
}

export const deleteC = async(req, res)=>{
    try{
        //Obtener el Id
        let { id } = req.params
        //Validar si está logeado y es el mismo X No lo vemos hoy X
        //Eliminar (deleteOne (solo elimina no devuelve el documento) / findOneAndDelete (Me devuelve el documento eliminado))
        let deletedCourse = await Person.findOneAndDelete({_id: id}) 
        //Verificar que se eliminó
        if(!deletedCourse) return res.status(404).send({message: 'Account not found and not deleted'})
        //Responder
        return res.send({message: `Course with name ${deletedCourse.name} deleted successfully`}) //status 200
    }catch(err){
        console.error(err)
        return res.status(500).send({message: 'Error deleting course'})
    }
}