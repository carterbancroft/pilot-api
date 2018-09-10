'use strict'

const express = require('express')
const body_parser = require('body-parser')

const { User } = require('../db/models/user')

const router = express.Router()

router.use(body_parser.json())


router.get('/version', async (req, res, next) => {
    const { name, version } = require('../package.json')

    res.json(`${name} version ${version}`)
})


// Retrieve a user by user_name.
router.get('/:user_name', async (req, res, next) => {
    const user_name = req.params.user_name
    const u = await User.findOne({ user_name })

    // If there is no user by that name 404.
    if (!u) return res.sendStatus(404)

    return res.send(u)
})


// Create a new user.
router.post('/:user_name', async (req, res, next) => {
    // First make sure the request is valid (has a body with a user name).
    const invalid_request = (
        !req.body
        || !req.body.user_name
    )
    if (invalid_request) return res.status(400)

    const user_name = req.body.user_name

    // Make sure the user doesn't already exist.
    const existing = await User.findOne({ user_name })
    if (existing) return res.sendStatus(409)

    // Create a new user, save it to mongo and send the request body back.
    const u = new User(req.body)

    await u.save()

    res.send(req.body)
})

// TODO: implement update user
// TODO: implement delete user

exports.router = router

