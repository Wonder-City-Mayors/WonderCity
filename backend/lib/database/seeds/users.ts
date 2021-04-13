import { Knex } from "knex";
import * as bcrypt from "bcrypt";

export async function seed(knex: Knex) {
    await knex("user").del();

    await bcrypt.hash("asdfasdf", 10).then((password) => {
        return knex("user").insert({
            username: "asdfasdf",
            password,
            firstName: "Георгий",
            lastName: "Бердников",
        });
    });
}
