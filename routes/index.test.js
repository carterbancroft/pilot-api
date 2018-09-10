'use strict'

const assert = require('assert')
const express = require('express')
const request = require('supertest')
const body_parser = require('body-parser')

const { router } = require('./index')

// Create a connection to the database
require('../db')

const app = express()

app.use(router)
app.use(body_parser.json())

const api = request(app)


describe('/api', () => {
    describe('GET /', () => {
        it('should return the app name and version', async () => {
            const res = await api.get('/').expect(200)

            const { name, version } = require('../package.json')
            const expected = `${name} version ${version}`

            assert.equal(expected, res.body)
        })
    })
})
