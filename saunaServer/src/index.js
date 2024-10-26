import express from 'express';
import mongoose from 'mongoose';

const app = express()
mongoose.connect('mongodb://localhost:27017/saunaTemps')
console.log("connected to mongo")
app.use(express.json());

const dataSchema = new mongoose.Schema({
    temp: String,
    timestamp: String
},{
    collection: "temps"
})

const Model = mongoose.model('temps', dataSchema)

const port = process.env.PORT || 8080

app.listen(port, () => {
    console.log("Server start")
})

app.get('/test', async (req, res) => {
    console.log("test")
    res.send("test")
})

app.get('/all', async (req, res) => {
    console.log("Returning all temps")
    const data = await Model.find()
    res.json(data)
})

app.post('/addTemp', async (req, res) => {
    console.log(req.body)
    if (req.body.temp) {
        const timestamp = new Date().toISOString()
        console.log(timestamp)

        const newTempEntry = new Model({
            temp: req.body.temp,
            timestamp: timestamp
        })

        try {
            console.log("Adding entry to db")
            await newTempEntry.save()
            res.send("ok")
            return
        } catch (err) {
            res.send("Internal server error").statusCode(500)
            return
        }
    }
    res.send("Invalid request").statusCode(400)
})

