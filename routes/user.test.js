'use strict'

const assert = require('assert')
const express = require('express')
const request = require('supertest')
const mongoose = require('mongoose')
const body_parser = require('body-parser')

const { router } = require('./user')
const { User } = require('../db/models/user')
const { user_fixture } = require('../fixtures')

// Create a connection to the database
require('../db')

const app = express()

app.use(router)
app.use(body_parser.json())

const api = request(app)


// Helper to clean up some cruft that gets auto-added by mongoose
function clean_response(body) {
    delete body['_id']
    delete body['__v']
    delete body.transactions[0]['_id']

    return body
}


describe('/api/user', () => {
    after(() => mongoose.disconnect())
    afterEach(async () => await User.deleteMany({}))


    describe('GET /:user_name', () => {
        before(async () => await (new User(user_fixture)).save())

        it('should get an existing user', async () => {
            const url = `/${user_fixture.user_name}`
            const res = await api
                .get(url)
                .send(user_fixture)
                .expect(200)

            // Clean up some cruft
            const body = clean_response(res.body)

            assert.deepEqual(user_fixture, body)
        })


        it('should 404 if the user does not exist', async () => {
            const url = '/missing_idiot'
            await api
                .get(url)
                .send(user_fixture)
                .expect(404)
        })
    })


    describe('POST /:user_name', () => {
        it('should create a new user', async () => {
            const url = `/${user_fixture.user_name}`
            const res = await api
                .post(url)
                .send(user_fixture)
                .expect(200)

            // Clean up some cruft
            const body = clean_response(res.body)

            assert.deepEqual(body, user_fixture)
        })


        it('should 409 if the user already exists', async () => {
            await (new User(user_fixture)).save()

            const url = `/${user_fixture.user_name}`
            await api
                .post(url)
                .send(user_fixture)
                .expect(409)
        })
    })
})
