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
        const expenseSummaryCollection = client.db('bachelor').collection('expenseSummary')
        const expenseDetailsCollection = client.db('bachelor').collection('expenseDetails')
        app.post('/add-details', async (req, res)=>{
            const details = req.body;
            expenseDetailsCollection.insertOne(details)
            console.log(details)
        })
        app.post('/expense', async (req, res)=>{
            const details = req.body;
            expenseDetailsCollection.insertOne(details)
            console.log(details)
        })
    } finally{}
}
run()
app.get('/', (req, res) => {
    res.send('server is working fine')
})
app.listen(port)