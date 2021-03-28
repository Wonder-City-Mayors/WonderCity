import { Knex } from "knex";

export async function seed(knex: Knex) {
    await knex("device").del();

    const devices = [];

    for (let i = 1; i <= 50; i++) {
        devices.push({ id: i });
    }

    await knex("device").insert(devices);
}
