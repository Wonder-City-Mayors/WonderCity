import { Knex } from "knex";

export async function seed(knex: Knex) {
    await knex("device").del();

    const devices: { id: number }[] = [];

    for (let i = 1; i <= 50; i++) {
        devices.push({ id: i });
    }

    await knex("device").insert(devices);
}
