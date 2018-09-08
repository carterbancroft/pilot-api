'use strict'

const assert = require('assert')
const express = require('express')
const request = require('supertest')
const body_parser = require('body-parser')

const { router } = require('./index')

const app = express()

app.use(router)
app.use(body_parser.json())


describe('/api', () => {
    it('should return the app name and version', async () => {
        const res = await request(app).get('/version').expect(200)

        const { name, version } = require('../package.json')
        const expected = `${name} version ${version}`

        assert.equal(expected, res.body)
    })
})
