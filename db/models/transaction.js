'use strict'

const mongoose = require('mongoose')


const transaction_schema = new mongoose.Schema({
    user_name: String,
    item: String,
    category: String,
    amount_in_cents: Number,
    tags: [String],
    transaction_type: String,
})

exports.Transaction = mongoose.model('Transaction', transaction_schema)

