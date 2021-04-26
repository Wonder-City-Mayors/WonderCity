const bcrypt = require("bcrypt")

exports.seed = async function seed(knex) {
    await knex("user").del()

    await bcrypt.hash("asdfasdf", 10).then((password) => {
        return knex("user").insert({
            username: "asdfasdf",
            password,
            firstName: "Георгий",
            lastName: "Бердников",
        })
    })
}
