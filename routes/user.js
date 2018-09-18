'use strict'

const express = require('express')
const app_root = require('app-root-path')
const body_parser = require('body-parser')
const debug = require('debug')('api:routes:user')

const { User } = require(`${app_root}/db/models/user`)
const { Transaction } = require(`${app_root}/db/models/transaction`)

const router = express.Router()

router.use(body_parser.json())


router.get('/', async (req, res, next) => {
    res.json('User router works.')
})


// Retrieve a user by user_name.
router.get('/:user_name', async (req, res, next) => {
    const user_name = req.params.user_name
    const user = await User.findOne({ user_name })

    // If there is no user by that name 404.
    if (!user) {
        debug(`Could not find user ${user_name}`)
        return res.sendStatus(404)
    }

    debug(`Found ${user_name}...`)

    return res.send(user)
})


// Create a new user.
router.post('/:user_name', async (req, res, next) => {
    // First make sure the request is valid (has a body with a user name).
    const invalid_request = (
        !req.body
        || !req.body.user_name
    )
    if (invalid_request) return res.status(400)

    const user_name = req.params.user_name

    // Make sure the user doesn't already exist.
    const existing_user = await User.findOne({ user_name })
    if (existing_user) return res.sendStatus(409)

    // Create a new user, save it to mongo and send the request body back.
    const user = new User(req.body)

    debug(`Creating new user: ${user_name}`)

    await user.save()

    res.send(req.body)
})


router.get('/:user_name/transaction', async (req, res, next) => {
    const user_name = req.params.user_name
    const transactions = await Transaction.find({ user_name })

    if (!transactions.length) {
        debug('No transactions found.')
        return res.send([])
    }

    debug(`Found ${transactions.length} transactions for ${user_name}`)

    res.send(transactions)
})


// Create a new transaction for a given user.
router.post('/:user_name/transaction', async (req, res, next) => {
    const invalid_request = (
        !req.body
        || !req.body.category
        || !req.body.item
        || !req.body.amount_in_cents
        || !req.body.transaction_type
    )
    if (invalid_request) {
        debug('Create transaction request is invalid.')
        return res.status(400)
    }

    const user_name = req.params.user_name
    const user = await User.findOne({ user_name })

    // If there is no user by that name 404.
    if (!user) {
        debug(`Could not find user ${user_name}`)
        return res.sendStatus(404)
    }

    const transaction = new Transaction(req.body)

    debug('Creating a new transaction...')

    await transaction.save()

    res.send(req.body)
})


// Delete an existing transaction by _id for a given user.
router.delete('/:user_name/transaction/:id', async (req, res, next) => {
    const user_name = req.params.user_name
    const user = await User.findOne({ user_name })

    // If there is no user by that name 404.
    if (!user) {
        debug(`Could not find user ${user_name}`)
        return res.sendStatus(404)
    }

    const _id = req.params.id

    debug(`Deleting transaction ${_id}...`)

    await Transaction.deleteOne({ _id })

    res.send({})
})

exports.router = router

