import express from 'express';
import mongoose from 'mongoose';

const app = express()
app.use(express.json());

const port = process.env.PORT || 8080
const mongoUri = process.env.MONGO_URI || "mongodb://localhost:27017/saunaTemps"

console.log("connecting to mongo with URI " + mongoUri)
await mongoose.connect(mongoUri)
console.log("connected to mongo")

const fiveHoursMillis = 5 * 60 * 60 * 1000


const dataSchema = new mongoose.Schema({
    temp: String,
    timestamp: Date
},{
    collection: "temps"
})

const Model = mongoose.model('temps', dataSchema)

app.listen(port, () => {
    console.log("Server is listening on port " + port)
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
        const timestamp = Date.now()
        console.log(new Date(timestamp))

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

app.get("/saunaApp/latestTemps", async (req, res) => {
    console.log("Returning latest temps")
    const timeSpan = new Date(Date.now() - fiveHoursMillis)
    console.log(timeSpan)
    const data = await Model.find({
        timestamp: {$gte: timeSpan}
    }, 'temp timestamp')
    console.log(data)
    res.json(data)
})

