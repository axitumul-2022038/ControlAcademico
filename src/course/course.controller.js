'use strict'

import Course from './course.model.js'
import { checkUpdate } from '../../utils/validator.js'

export const test = (req, res)=>{
    console.log('test is running')
    return res.send({message: 'Test is running'})
}

export const register = async(req, res)=>{
    try{
        let data = req.body
        let couser = new Course(data)
        await couser.save()
        return res.send({message: `Registered successfully ${couser.name}`})
    }catch(err){
        console.error(err)
        return res.status(500).send({message: 'Error registering couser', err: err})
    }
}

export const update = async(req, res)=>{
    try{
        let { id } = req.params
        let data = req.body
        let update = checkUpdate(data, id)
        if(!update) return res.status(400).send({message: 'Have submitted some data that cannot be updated or missing data'})
        let updatedCourse = await Course.findOneAndUpdate(
            {_id: id},
            data,
            {new: true}
        )
        if(!updatedCourse) return res.status(401).send({message: 'Course not found and not updated'})
        return res.send({message: 'Updated course', updatedCourse})
    }catch(err){
        console.error(err)
        if(err.keyValue.name) return res.status(400).send({message: `Name ${err.keyValue.name} is alredy taken`})
        return res.status(500).send({message: 'Error updating course'})
    }
}

export const deleteC = async(req, res)=>{
    try{
        let { id } = req.params
        let deletedCourse = await Course.findOneAndDelete({_id: id}) 
        if(!deletedCourse) return res.status(404).send({message: 'Account not found and not deleted'})
        return res.send({message: `Course with name ${deletedCourse.name} deleted successfully`})
    }catch(err){
        console.error(err)
        return res.status(500).send({message: 'Error deleting course'})
    }
}