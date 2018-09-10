'use strict'

const mongoose = require('mongoose')

const env = process.env.NODE_ENV
const connection_string = `mongodb://localhost:27017/pilot_${env}`

mongoose.connect(connection_string, { useNewUrlParser: true })

mongoose.connection.on('error', err => {
    console.log(`\nError connecting to ${connection_string}.`)
})

// Disconnect on app close.
process.on('SIGTERM', () => {
    mongoose.disconnect()
})
