'use strict'

const cors = require('cors')
const chalk = require('chalk')
const express = require('express')

const api = require('./routes/index')
const user_route = require('./routes/user')

// Open a connection to mongo
require('./db/index')


const app = express()

// Whitelist our client for CORS but no other origins.
/*const whitelist = ['http://localhost:3000']
const cors_options = {
    origin: (origin, callback) => {
        if (whitelist.includes(origin)) {
            return callback(null, true)
        }

        const message = 'not allowed by CORS'
        console.log(message)
        return callback(new Error(message))
    }
}
app.use(cors(cors_options))*/
app.use(cors())

app.use('/api', api.router)
app.use('/api/user', user_route.router)

const port = 9001
app.listen(port, () => {
    console.log(chalk.cyan(`\nListening on port ${port}...`))
})
