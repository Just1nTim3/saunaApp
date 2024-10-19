import express from 'express';
import mongoose from 'mongoose';

const app = express()

app.listen(8080, () => {
    console.log("Server start")
})

app.get('/test', async (req, res) => {
    res.send("Test")
})



