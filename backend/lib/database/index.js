const { Model } = require("objection")
const knex = require("knex")
const config = require("./config")

let db

function init() {
    db = knex(config)

    Model.knex(db)
}

function getDb() {
    return db
}

module.exports = { db, init, getDb }
