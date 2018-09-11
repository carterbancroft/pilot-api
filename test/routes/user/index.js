'use strict'

const assert = require('assert')
const express = require('express')
const request = require('supertest')
const mongoose = require('mongoose')
const app_root = require('app-root-path')
const body_parser = require('body-parser')

const { router } = require(`${app_root}/routes/user`)
const { User } = require(`${app_root}/db/models/user`)
const { user_fixture } = require(`${app_root}/test/fixtures`)

// Create a connection to the database
require(`${app_root}/db`)

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


    describe('POST /:user_name/transaction', () => {
        before(async () => await (new User(user_fixture)).save())

        it('should create a transaction for a new user', async () => {
            const user_name = user_fixture.user_name

            const new_transaction = {
                category: 'some category',
                item: 'some item',
                amount_in_cents: 5000,
                tags: [ 'some tag', 'some other tag' ],
                transaction_type: 'expense'
            }

            const url = `/${user_name}/transaction`
            const res = await api
                .post(url)
                .send(new_transaction)
                .expect(200)

            assert.deepEqual(res.body, new_transaction)

            // Get the user from mongo and we'll make sure the transaction was
            // added.
            const user = await User.findOne({user_name})

            // Should have two transactions (the fixture and this new one).
            assert.equal(user.transactions.length, 2)

            // Convert the mongoose object to a regular JS object.
            const from_mongo = user.transactions[1].toObject()

            // Delete _id since this is auto generated and I didn't mock it.
            delete from_mongo._id

            assert.deepEqual(from_mongo, new_transaction)
        })
    })
})
