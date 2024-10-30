import mongoose from 'mongoose';

export class MongoDbService {

    dataSchema = new mongoose.Schema({
        temp: Number,
        timestamp: Date
    },{
        collection: "temps"
    })
    
    static fiveHoursMillis = 5 * 60 * 60 * 1000

    port
    mongoUri
    Model

    constructor(mongoUri) {
        this.mongoUri = mongoUri || "mongodb://localhost:27017/saunaTemps"
        this.Model = mongoose.model('temps', this.dataSchema)
    }

    async connectToMongo(params) {
        console.log("connecting to mongo with URI " + this.mongoUri)
        await mongoose.connect(this.mongoUri)
        console.log("connected to mongo")    
    }

    async getAllTemps() {
        console.log("Returning all temps")
        return await this.Model.find()    
    }

    async getLatestTemps() {
        console.log("Returning latest temps")
        const timeSpan = new Date(Date.now() - MongoDbService.fiveHoursMillis)
        console.log(timeSpan)
        const data = await this.Model.find({
            timestamp: {$gte: timeSpan}
        }, 'temp timestamp')
        console.log(data)
        return data
    }

    async addTemp(temp) {
        const timestamp = Date.now()
        console.log(new Date(timestamp))

        const newTempEntry = new this.Model({
            temp: temp,
            timestamp: timestamp
        })

        console.log("Adding entry to db")
        await newTempEntry.save()
        console.log("Entry added")
    }


}