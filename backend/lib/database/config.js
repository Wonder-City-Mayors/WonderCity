const { knexSnakeCaseMappers } = require("objection")
const { config } = require("dotenv")
const { resolve } = require("path")

config({
    path: resolve(process.cwd(), ".env"),
})

module.exports = {
    client: process.env.DB_CLIENT || "mysql",

    connection: {
        host: process.env.DB_HOST || "127.0.0.1",
        user: process.env.DB_USER || "root",
        password: process.env.DB_PASSWORD || "root",
        database: process.env.DB_DATABASE || "main",
        charset: process.env.DB_CHARSET || "utf8",
    },

    migrations: {
        tableName: "knex_migrations",
        directory: "migrations",
    },

    ...knexSnakeCaseMappers(),
}
