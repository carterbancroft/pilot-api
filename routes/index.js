'use strict'

const express = require('express')
const body_parser = require('body-parser')

const router = express.Router()

router.use(body_parser.json())


router.get('/version', async (req, res, next) => {
    const { name, version } = require('../package.json')

    res.json(`${name} version ${version}`)
})

exports.router = router

