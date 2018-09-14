'use strict'

const assert = require('assert')
const express = require('express')
const request = require('supertest')
const mongoose = require('mongoose')
const app_root = require('app-root-path')
const body_parser = require('body-parser')

const fixtures = require(`${app_root}/test/fixtures`)
const { router } = require(`${app_root}/routes/user`)
const { User } = require(`${app_root}/db/models/user`)
const { Transaction } = require(`${app_root}/db/models/transaction`)

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

    return body
}


describe('/api/user.js', () => {
    after(() => mongoose.disconnect())
    afterEach(async () => {
        await User.deleteMany({})
        await Transaction.deleteMany({})
    })


    describe('GET /:user_name', () => {
        before(async () => await (new User(fixtures.user)).save())

        it('should get an existing user', async () => {
            const url = `/${fixtures.user_name}`
            const res = await api
                .get(url)
                .send(fixtures.user)
                .expect(200)

            // Clean up some cruft
            const body = clean_response(res.body)

            assert.deepEqual(body, fixtures.user)
        })


        it('should 404 if the user does not exist', async () => {
            const url = '/missing_idiot'
            await api
                .get(url)
                .send(fixtures.user)
                .expect(404)
        })
    })


    describe('POST /:user_name', () => {
        it('should create a new user', async () => {
            const url = `/${fixtures.user_name}`
            const res = await api
                .post(url)
                .send(fixtures.user)
                .expect(200)

            // Clean up some cruft
            const body = clean_response(res.body)

            assert.deepEqual(body, fixtures.user)
        })


        it('should 409 if the user already exists', async () => {
            await (new User(fixtures.user)).save()

            const url = `/${fixtures.user.user_name}`
            await api
                .post(url)
                .send(fixtures.user)
                .expect(409)
        })
    })


    describe('POST /:user_name/transaction', () => {
        before(async () => await (new User(fixtures.user)).save())
        after(async ()  => await Transaction.deleteMany({}))

        it('should create a transaction for a new user', async () => {
            const user_name = fixtures.user_name

            const url = `/${user_name}/transaction`
            const res = await api
                .post(url)
                .send(fixtures.transaction)
                .expect(200)

            assert.deepEqual(res.body, fixtures.transaction)

            // Get the transaction to make sure it was added
            const all_transactions = await Transaction.find({user_name})

            // Should have two transactions (the fixture and this new one).
            assert.equal(all_transactions.length, 1)

            // Convert the mongoose object to a regular JS object.
            const from_mongo = all_transactions[0].toObject()

            // Delete _id since this is auto generated and I didn't mock it.
            delete from_mongo._id
            delete from_mongo.__v

            assert.deepEqual(from_mongo, fixtures.transaction)
        })
    })


    describe('DELETE /:user_name/transaction/:id', () => {
        before(async () => {
            const u = new User(fixtures.user)
            await u.save()

            const t = new Transaction(fixtures.transaction)
            await t.save()
        })


        it('should delete a transaction', async () => {
            const user_name = fixtures.user_name
            const transaction = await Transaction.findOne({user_name})

            const transaction_id = transaction._id.toString()

            const url = `/${user_name}/transaction/${transaction_id}`
            await api
                .delete(url)
                .expect(200)

            // Find the user again to check if the transaction was removed.
            const modified = await Transaction.findOne({_id: transaction_id})

            assert(!modified)
        })
    })
})
