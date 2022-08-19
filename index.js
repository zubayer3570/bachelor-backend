const express = require('express')
const cors = require('cors')
const { MongoClient } = require('mongodb')
const app = express()
const port = 5000
app.use(cors())
app.use(express.json())
const client = new MongoClient('mongodb+srv://database-user-1:databaseofzubayer@cluster0.1f3iy.mongodb.net/?retryWrites=true&w=majority')
const run = () => {
    try {
        client.connect()
        const dateCollection = client.db("bachelor's-website").collection('date-collection')
        app.post('/add-date', async (req, res)=>{
            const date = req.body;
            dateCollection.insertOne(date)
            res.send({message: 'Date Added'})
        })
        app.get('/get-all-date', async (req, res)=>{
            const cursor = dateCollection.find({})
            const allDate = await cursor.toArray()
            res.send(allDate)
        })
    } finally { }
}
run()
app.get('/', (req, res) => {
    res.send('server is working fine')
})
app.listen(port)