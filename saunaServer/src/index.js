import express from 'express';
import cors from "cors";
import { MongoDbService } from './MongoService.js';

const app = express()
app.use(express.json());
app.use(cors())

const mongoService = new MongoDbService(process.env.MONGO_URI) 

await mongoService.connectToMongo()

const port = process.env.PORT || 8080

app.listen(port, () => {
    console.log("Server is listening on port " + port)
})

app.get('/saunaApp/test', async (req, res) => {
    console.log("test")
    res.send("test")
})

app.get('/saunaApp/allTemps', async (req, res) => {
    const data = await mongoService.getAllTemps()
    res.json(data)
})

app.post('/saunaApp/addTemp', async (req, res) => {
    console.log(req.body)
    const temp = Number(req.body.temp)
    if (temp) {
        if (temp === -127.00) {
            console.log("Invalid read from sensor")
            res.send("Invalid temp entry").status(400)
            return
        }
        try {
            await mongoService.addTemp(temp)
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
    const data = await mongoService.getLatestTemps()
    res.json(data)
})

