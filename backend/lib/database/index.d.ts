import { Knex } from "knex";

export let db: Knex<any[], unknown> | null;
export function init(): void;
