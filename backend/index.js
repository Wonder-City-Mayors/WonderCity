/**
 * Настройка файла ./.env
 * для хранения конфиденциальной информации
 */
import { config } from 'dotenv';
config();

/**
 * Использование конфигурации из ./.env
 */
const { PORT = 3000 } = process.env;

/**
 * Express.js
 */
import express from 'express';

/**
 * Разноцветная консоль :Р
 */
import colors from 'colors/safe';

/**
 * Работа с базой данных
 */
import Knex from 'knex';

/**
 * Knex-объект
 */
const knex = new Knex({
    client: process.env.DB_CLIENT || 'mysql',
    connection: {
        host: process.env.DB_HOST || '127.0.0.1',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || 'root',
        database: process.env.DB_DATABASE || 'main',
        charset: process.env.DB_CHARSET || 'utf8'
    }
});

/**
 * Express-приложение
 */
const app = express();

app.get('/', (req, res) => {
    res.send('Hello, World!');
});

app.listen(PORT, () => {
    console.log(colors.green(
        `Сервер запущен на порте ${
            colors.underline.bold(String(PORT))
        }.`
    ));
});