import express from 'express';
import mongoose from 'mongoose';

const app = express()
mongoose.connect('mongodb://localhost:27017/saunaTemps')

const dataSchema = new mongoose.Schema({
    temp: String,
    timestamp: String
},{
    colletion: "temps"
})

const Model = mongoose.model('temps', dataSchema)


app.listen(8080, () => {
    console.log("Server start")
})

app.get('/test', async (req, res) => {
    res.send("Test")
})

app.get('/all', async (req, res) => {
    const data = await Model.find()
    res.json(data)
})


