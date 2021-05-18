exports.up = function (knex) {
    return knex.transaction((trx) =>
        trx.schema
            .createTable("base_station", (t) => {
                t.increments("id")
                t.binary("password", 60).notNull()
            })
            .table("device", (t) => {
                t.integer("base_station_id").unsigned()

                t.foreign("base_station_id")
                    .references("base_station.id")
                    .onUpdate("cascade")
                    .onDelete("set null")
            })
            .then(trx.commit),
    )
}

exports.down = function (knex) {
    return knex.transaction((trx) =>
        trx.schema
            .table("device", (t) => {
                t.dropForeign("base_station_id")
                t.dropColumn("base_station_id")
            })
            .dropTable("base_station")
            .then(trx.commit),
    )
}
