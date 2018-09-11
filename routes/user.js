'use strict'

const express = require('express')
const app_root = require('app-root-path')
const body_parser = require('body-parser')

const { User } = require(`${app_root}/db/models/user`)

const router = express.Router()

router.use(body_parser.json())


// Retrieve a user by user_name.
router.get('/:user_name', async (req, res, next) => {
    const user_name = req.params.user_name
    const user = await User.findOne({ user_name })

    // If there is no user by that name 404.
    if (!user) return res.sendStatus(404)

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

    await user.save()

    res.send(req.body)
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
    if (invalid_request) return res.status(400)

    const user_name = req.params.user_name
    const user = await User.findOne({ user_name })

    // If there is no user by that name 404.
    if (!user) return res.sendStatus(404)

    const transaction = req.body

    await User.updateOne(
        { user_name },
        { $push: { transactions: transaction } }
    )

    res.send(req.body)
})


// Delete an existing transaction by _id for a given user.
router.delete('/:user_name/transaction/:id', async (req, res, next) => {
    const user_name = req.params.user_name
    const user = await User.findOne({ user_name })

    // If there is no user by that name 404.
    if (!user) return res.sendStatus(404)

    await User.updateOne(
        { user_name },
        { $pull: { transactions: { _id: req.params.id } } }
    )

    res.send({})
})

exports.router = router

