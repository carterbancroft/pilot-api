'use strict'

const chalk = require('chalk')
const express = require('express')

const api = require('./routes/index')

// Open a connection to mongo
require('./db/index')


const app = express()

app.use('/api', api.router)

const port = 9000
app.listen(port, () => {
    console.log(chalk.cyan(`\nListening on port ${port}...`))
})
