import express from 'express';
import mongoose from 'mongoose';

const app = express()
mongoose.connect('mongodb://localhost:27017/saunaTemps')
app.use(express.json());

const dataSchema = new mongoose.Schema({
    temp: String,
    timestamp: String
},{
    colletion: "temps"
})

const Model = mongoose.model('temps', dataSchema)

const port = process.env.PORT || 8080

app.listen(port, () => {
    console.log("Server start")
})

app.get('/test', async (req, res) => {
    res.send("Test")
})

app.get('/all', async (req, res) => {
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

