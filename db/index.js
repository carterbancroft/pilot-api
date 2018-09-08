'use strict'

const mongoose = require('mongoose')


const connection_string = 'mongodb://localhost:27017/pilot_dev'

mongoose.connect(connection_string)

mongoose.connection.on('connected', () => {
    console.log(`Opened connection to ${connection_string}.`)
})

mongoose.connection.on('error', (err) => {
    console.log(`Error connecting to ${connection_string}.`)
})

process.on('SIGINT', () => {
    mongoose.disconnect()
})
