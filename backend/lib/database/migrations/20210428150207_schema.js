exports.up = function (knex) {
    return knex.transaction((trx) =>
        trx.schema.createTable("bind_requests", (t) => {
            t.unsigned("user_id").notNull()
            t.unsigned("device_id").notNull()

            t.foreign("user_id")
                .references("user.id")
                .onUpdate("cascade")
                .onDelete("cascade")
            t.foreign("device_id")
                .references("device.id")
                .onUpdate("cacade")
                .onDelete("cascade")
        }),
    )
}

exports.down = function (knex) {
    return knex.transaction((trx) => trx.schema.deleteTable("bind_requests"))
}
