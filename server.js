const express=require('express');
const mongoose=require('mongoose');
const cors = require('cors');


const app=express();

// Add CORS middleware to allow cross-origin requests
app.use(cors());

//to use middleware for postman testing
app.use(express.json());



//sample in memory storage for todo items
//let todos=[];
//mongodb connection

mongoose.connect('mongodb://localhost:27017/mern-app')
.then(()=>{
    console.log('DBconnected')
})
.catch((err)=>{
    console.log(err)
})

//create schema
const todoschema=new mongoose.Schema({
    title: {
        required:true,
        type:String
    },
    description:String
})

//create model
const todomodel=mongoose.model('todo',todoschema)



//create todo item
app.post('/todos',async(req,res)=>{
    const{title,description}=req.body;
    // const newtodo={
    //     id:todos.length+1,
    //     title,
    //     description
    // };
    // todos.push(newtodo);
    // console.log(todos);
try {
    const newtodo=new todomodel({title,description})
    await newtodo.save();
    res.status(201).json(newtodo);
} catch (error) {
    console.log(error)
    res.status(500).json({message:error.message});
}
})

//get all items
app.get('/todos',async(req,res)=>{
    try {
        const todos = await todomodel.find();
        res.json(todos);
    } catch (error) {
        console.log(error)
    res.status(500).json({message:error.message});        
    }
})

//update a todo item
app.put("/todos/:id",async (req,res)=>{
    try {
        const {title,description}=req.body;
        const id = req.params.id;
        const updatedtodo=await todomodel.findByIdAndUpdate(
            id,
            {title,description},
            {new : true}
        )
        if(!updatedtodo){
            return res.status(404).json({message:"Todo not found"})
        }
        res.json(updatedtodo)
    } catch (error) {
        console.log(error)
    res.status(500).json({message:error.message});
    }
})

//delete a todo item
app.delete('/todos/:id',async(req,res)=>{
    try {
        const id=req.params.id;
        await todomodel.findByIdAndDelete
        res.status(204).end();
    } catch (error) {
        console.log(error)
        res.status(500).json({message:error.message});
    }

   
})

//start the server
const port=8000;
app.listen(port,()=>{
    console.log("your server"+port);
})