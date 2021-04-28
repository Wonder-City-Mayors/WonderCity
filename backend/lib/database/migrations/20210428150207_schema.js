exports.up = function (knex) {
    return knex.transaction((trx) =>
        trx.schema
            .createTable("bind_requests", (t) => {
                t.integer("user_id").unsigned().notNull()
                t.integer("device_id").unsigned().notNull()

                t.foreign("user_id")
                    .references("user.id")
                    .onUpdate("cascade")
                    .onDelete("cascade")
                t.foreign("device_id")
                    .references("device.id")
                    .onUpdate("cascade")
                    .onDelete("cascade")
            })
            .then(trx.commit)
            .catch(trx.rollback),
    )
}

exports.down = function (knex) {
    return knex.transaction((trx) =>
        trx.schema
            .deleteTable("bind_requests")
            .then(trx.commit)
            .catch(trx.rollback),
    )
}
