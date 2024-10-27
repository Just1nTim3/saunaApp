import express from 'express';
import mongoose from 'mongoose';

const app = express()
app.use(express.json());

const port = process.env.PORT || 8080
const mongoUri = process.env.MONGO_URI || "mongodb://localhost:27017/saunaTemps"

mongoose.connect(mongoUri)
console.log("connected to mongo")


const dataSchema = new mongoose.Schema({
    temp: String,
    timestamp: String
},{
    collection: "temps"
})

const Model = mongoose.model('temps', dataSchema)

app.listen(port, () => {
    console.log("Server start")
})

app.get('/saunaApp/test', async (req, res) => {
    console.log("test")
    res.send("test")
})

app.get('/saunaApp/allTemps', async (req, res) => {
    console.log("Returning all temps")
    const data = await Model.find()
    res.json(data)
})

app.post('/saunaApp/addTemp', async (req, res) => {
    console.log(req.body)
    if (req.body.temp) {
        if (req.body.temp === "-127.00") {
            console.log("Invalid read from sensor")
            res.send("Invalid temp entry").status(400)
            return
        }
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
            res.send("Internal server error").status(500)
            return
        }
    }
    res.send("Invalid request").status(400)
})

