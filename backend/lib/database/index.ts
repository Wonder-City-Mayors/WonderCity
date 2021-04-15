import { Model } from "objection"
import knex, { Knex } from "knex"

let db: Knex<any[], unknown>

const config = require('./config.js')

function init() {
    db = knex(config)

    Model.knex(db)
}

export { db, init }
