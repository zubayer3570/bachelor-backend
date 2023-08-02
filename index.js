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
        const accountsCollection = client.db("bachelor's-website").collection('accounts-collection')
        const otherExpensesCollection = client.db("bachelor's-website").collection('other-expenses-collection')
        //post
        app.post('/add-expense', async (req, res) => {
            const data = req.body;
            await expenseCollection.insertOne(data)
            res.send({ message: 'Expense Added' })
        })
        // app.post('/add-person', async (req, res) => {
        //     const data = req.body;
        //     await personCollection.insertOne(data)
        //     res.send({ message: 'Person Added' })
        // })
        app.post('/update-meal-count', async (req, res) => {
            const data = req.body;
            const getData = await personCollection.findOne({ name: data.name })
            let totalMealToday = 0;
            data.mealCountUpdate.map(meal => totalMealToday += meal)
            getData.mealCount[data.index][1] = totalMealToday
            getData.mealCount[data.index][2] = data.mealCountUpdate
            const result = await personCollection.updateOne({ name: data.name }, { $set: { mealCount: getData.mealCount } })
            res.send({ message: result })
        })
        app.post('/add-to-other-expenses', async (req, res) => {
            const data = req.body;
            await otherExpensesCollection.insertOne(data)
            res.send({ message: 'Expense Added' })
        })
        app.post('/add-account/:name', async (req, res) => {
            const { name } = req.params;
            const accountData = {
                name,
                addedToMeal: [],
                addedToOther: [0]
            }
            const days = [
                ["1", 0, [0, 0, 0]],
                ["2", 0, [0, 0, 0]],
                ["3", 0, [0, 0, 0]],
                ["4", 0, [0, 0, 0]],
                ["5", 0, [0, 0, 0]],
                ["6", 0, [0, 0, 0]],
                ["7", 0, [0, 0, 0]],
                ["8", 0, [0, 0, 0]],
                ["9", 0, [0, 0, 0]],
                ["10", 0, [0, 0, 0]],
                ["11", 0, [0, 0, 0]],
                ["12", 0, [0, 0, 0]],
                ["13", 0, [0, 0, 0]],
                ["14", 0, [0, 0, 0]],
                ["15", 0, [0, 0, 0]],
                ["16", 0, [0, 0, 0]],
                ["17", 0, [0, 0, 0]],
                ["18", 0, [0, 0, 0]],
                ["19", 0, [0, 0, 0]],
                ["20", 0, [0, 0, 0]],
                ["21", 0, [0, 0, 0]],
                ["22", 0, [0, 0, 0]],
                ["23", 0, [0, 0, 0]],
                ["24", 0, [0, 0, 0]],
                ["25", 0, [0, 0, 0]],
                ["26", 0, [0, 0, 0]],
                ["27", 0, [0, 0, 0]],
                ["28", 0, [0, 0, 0]],
                ["29", 0, [0, 0, 0]],
                ["30", 0, [0, 0, 0]],
                ["31", 0, [0, 0, 0]]
            ]
            const mealData = {
                name,
                mealCount: days
            }
            await personCollection.insertOne(mealData)
            await accountsCollection.insertOne(accountData)
            res.send({ message: 'Account Added' })
        })
        app.post('/add-to-meal/:name', async (req, res) => {
            const { name } = req.params;
            const { amount } = req.body;
            const date = String(new Date()).substring(0, 24)
            const data = {
                amount: parseInt(amount),
                date
            }

            await accountsCollection.updateOne({ name }, { $push: { addedToMeal: data } })
            res.send({ message: 'Added to Meal' })
        })
        app.post('/add-to-other/:name', async (req, res) => {
            const { name } = req.params;
            const { amount } = req.body;
            const date = String(new Date()).substring(0, 24)
            const data = {
                amount: parseInt(amount),
                date
            }
            // const accountData = await accountsCollection.findOne({ name })
            // accountData.addedToOther.push(parseInt(amount))
            await accountsCollection.updateOne({ name }, { $push: { addedToOther: data } })
            res.send({ message: 'Added to Other' })
        })

        //get
        app.get('/get-expenses-details', async (req, res) => {
            let totalMealExpense = 0;
            let totalAddedToMeal = 0
            const cursor = expenseCollection.find({})
            const expenseDetails = await cursor.toArray()
            expenseDetails.map(expense => totalMealExpense += parseInt(expense.amount))
            const cursor1 = accountsCollection.find({})
            const allAccountDetails = await cursor1.toArray()
            allAccountDetails.map(account => {
                account.addedToMeal.map(payment => totalAddedToMeal += payment.amount)
            })
            const mealBalance = totalAddedToMeal - totalMealExpense
            res.send({ expenseDetails, mealBalance, totalMealExpense })
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
        app.get('/get-ave-meal-rate', async (req, res) => {
            const cursor1 = expenseCollection.find({}).project({ date: 0, description: 0 })
            const data1 = await cursor1.toArray()
            let totalAmount = 0;
            data1.forEach(singleExpense => totalAmount += parseInt(singleExpense.amount))

            const cursor2 = personCollection.find({})
            const data2 = await cursor2.toArray()
            let totalMeal = 0;
            data2.forEach(singleData => {
                singleData.mealCount.forEach(singleDay => totalMeal += singleDay[1])
            })
            const ave = (totalAmount / totalMeal).toFixed(4)
            res.send({ ave })
        })
        app.get('/get-other-expenses', async (req, res) => {
            const cursor = otherExpensesCollection.find({})
            const result = await cursor.toArray()
            res.send(result)
        })
        app.get('/get-ave-other-expenses', async (req, res) => {
            const otherExpenseCursor = otherExpensesCollection.find({})
            const data = await otherExpenseCursor.toArray()
            let totalOtherAmount = 0;
            data.forEach(singleExpense => totalOtherAmount += parseInt(singleExpense.amount))

            const accountCursor = accountsCollection.find({})
            const accountData = await accountCursor.toArray()
            const aveOtherExpenses = (totalOtherAmount / accountData.length).toFixed(2)
            res.send({ aveOtherExpenses })
        })
        app.get('/get-account-names', async (req, res) => {
            const cursor = accountsCollection.find({})
            const data = await cursor.toArray()
            res.send({ data })
        })
        app.get('/get-person-meal/:name', async (req, res) => {
            const personName = req.params.name
            const result = await personCollection.findOne({ name: personName })
            let totalPersonMeal = 0
            result.mealCount.map(meal => totalPersonMeal += meal[1])
            res.send({ totalPersonMeal });
        })
        app.get('/added-to-other/:name', async (req, res) => {
            const personName = req.params.name
            const result = await accountsCollection.findOne({ name: personName })
            let addedToOther = 0
            result.addedToOther.map(amount => addedToOther += amount)
            res.send({ addedToOther });
        })
        app.get('/added-to-meal/:name', async (req, res) => {
            const personName = req.params.name
            const result = await accountsCollection.findOne({ name: personName })
            let addedToMeal = 0
            result.addedToMeal.map(data => addedToMeal += data.amount)
            res.send({ addedToMeal });
        })
        app.get('/get-meal-payment-details/:name', async (req, res) => {
            const { name } = req.params
            const data = await accountsCollection.findOne({ name })
            res.send({ data })
        })
    } finally { }
}
run()
app.get('/', (req, res) => res.send('server is working fine'))
app.listen(port)