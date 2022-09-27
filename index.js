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
        const expenseCollection = client.db("bachelor's-website").collection('expense-collection')
        const personCollection = client.db("bachelor's-website").collection('person-collection')
        //post
        app.post('/add-expense', async (req, res) => {
            const data = req.body;
            expenseCollection.insertOne(data)
            res.send({ message: 'Expense Added' })
        })
        app.post('/add-person', async (req, res) => {
            const data = req.body;
            personCollection.insertOne(data)
            res.send({ message: 'Person Added' })
        })
        app.post('/update-meal-count', async (req, res) => {
            const data = req.body;
            const getData = await personCollection.findOne({ name: data.name })
            getData.mealCount[data.index][1] = data.mealCountUpdate
            const result = await personCollection.updateOne({ name: data.name }, { $set: { mealCount: getData.mealCount } })
            res.send({ message: result })
        })
        //get
        app.get('/get-expenses-details', async (req, res) => {
            const cursor = expenseCollection.find({})
            const result = await cursor.toArray()
            res.send(result)
        })
        app.get('/get-total-expense-amount', async (req, res) => {
            const cursor = expenseCollection.find({})
            const data = await cursor.toArray()
            let totalAmount = 0;
            data.forEach(singleExpense => totalAmount += parseInt(singleExpense.amount))
            res.send({ totalAmount })
        })
        app.get('/get-person', async (req, res) => {
            const cursor = personCollection.find({})
            const result = await cursor.toArray()
            res.send(result)
        })
        app.get('/get-person-data/:person', async (req, res) => {
            const personName = req.params.person
            const result = await personCollection.findOne({ name: personName })
            res.send(result)
        })
        app.get('/get-total-meal', async (req, res) => {
            const cursor = personCollection.find({})
            const data = await cursor.toArray()
            let totalMeal = 0;
            data.forEach(singleData => {
                singleData.mealCount.forEach(singleDay => totalMeal += singleDay[1])
            })
            res.send({ totalMeal })
        })
    } finally { }
}
run()
app.get('/', (req, res) => {
    res.send('server is working fine')
})
app.listen(port)