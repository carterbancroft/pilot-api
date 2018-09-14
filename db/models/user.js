'use strict'

const mongoose = require('mongoose')


const user_schema = new mongoose.Schema({
    user_name: String,
    first_name: String,
    last_name: String,
    annual_income_in_cents: Number,
})

exports.User = mongoose.model('User', user_schema)

