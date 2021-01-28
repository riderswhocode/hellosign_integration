const express = require('express')
const { static } = require('express')
const ejs = require('ejs')
const path = require('path')
require('dotenv').config()

//MongoDB
const mongoose = require('mongoose')

const app = express();
const port = process.env.PORT || "3000"

app.set('view engine', 'ejs')

app.use(express.json())
app.use(static(path.join(__dirname,'/public')))

const hsroute = require('./routes/hellosign_routes')
const integrapayroute = require('./routes/integrapay_routes')

app.get('/agreement', (req, res) => {
    res.status(200).sendFile('./public/agreement-list.html', { root: __dirname})
})

app.get('/sign', (req, res) => {
    res.status(200).sendFile('./public/contract.html', { root: __dirname})
})

app.get('/agreement/create', (req, res) => {
    res.status(200).sendFile('./public/agreement-form.html', { root: __dirname})
})

app.use('/hellosign', hsroute)
app.use('/payment', integrapayroute)

const uri = process.env.MONGO_DEV_URI
mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
})

const connection = mongoose.connection

connection.once('open', () => {
    console.log(`MongoDB Atlas connection: OK `)
})

app.listen(port, () => {
    console.log(`Node Server is running on Development Server under Port ${port}`)
})





