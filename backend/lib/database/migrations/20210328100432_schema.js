exports.up = function up(knex) {
    return knex.transaction((trx) =>
        trx.schema
            .createTable("permission", (t) => {
                t.increments("id")
                t.string("type", 64).notNullable()
                t.string("operation", 64)
                t.string("target", 64)
            })
            .createTable("role", (t) => {
                t.increments("id")
                t.string("name", 128).notNullable()
            })
            .createTable("permission_role", (t) => {
                t.integer("role_id").unsigned().notNullable()
                t.integer("permission_id").unsigned().notNullable()

                t.foreign("role_id")
                    .references("role.id")
                    .onUpdate("cascade")
                    .onDelete("cascade")

                t.foreign("permission_id")
                    .references("permission.id")
                    .onUpdate("cascade")
                    .onDelete("cascade")

                t.primary(["role_id", "permission_id"])
            })
            .createTable("user", (t) => {
                t.increments("id")
                t.string("username", 32).notNullable()
                t.string("first_name", 128)
                t.string("last_name", 128)
                t.string("email")
                t.binary("password", 60).notNullable()
                t.integer("role_id").unsigned()

                t.foreign("role_id")
                    .references("role.id")
                    .onUpdate("cascade")
                    .onDelete("cascade")
            })
            .createTable("device", (t) => {
                t.increments("id")
                t.text("curr_id")
                t.text("parent")
                t.text("text")
                t.integer("type")
                t.integer("sn_c")
                t.text("sn_m")
                t.integer("user_id").unsigned()

                t.foreign("user_id")
                    .references("user.id")
                    .onUpdate("cascade")
                    .onDelete("set null")
            })
            .createTable("value", (t) => {
                t.increments("id")
                t.dateTime("timestamp").notNullable()
                t.float("record", 8, 2).notNullable()
                t.integer("deviceId").unsigned()

                t.foreign("deviceId")
                    .references("device.id")
                    .onUpdate("cascade")
                    .onDelete("cascade")
            })
            .then(trx.commit),
    )
}

exports.down = function dwon(knex) {
    return knex.transaction((trx) =>
        trx.schema
            .dropTable("permission")
            .dropTable("role")
            .dropTable("permission_role")
            .dropTable("user")
            .dropTable("device")
            .dropTable("value")
            .then(trx.commit),
    )
}
