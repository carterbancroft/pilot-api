'use strict'

const chalk = require('chalk')
const express = require('express')

const api = require('./routes/index')
const user_route = require('./routes/user/index')

// Open a connection to mongo
require('./db/index')


const app = express()

app.use('/api', api.router)
app.use('/api/user', user_route.router)

const port = 9001
app.listen(port, () => {
    console.log(chalk.cyan(`\nListening on port ${port}...`))
})
