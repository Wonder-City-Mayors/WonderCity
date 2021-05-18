const bcrypt = require("bcrypt")

exports.seed = async function seed(knex) {
    await knex("baseStation").del()

    await bcrypt.hash("asdfasdf", 10).then((password) => {
        return knex("baseStation").insert({
            password,
        })
    })
}
