/**
 * Настройка файла ./.env
 * для хранения конфиденциальной информации
 */
import { config as dotenvConfig } from 'dotenv';
dotenvConfig();

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
import * as colors from 'colors/safe';

/**
 * Инициализация базы данных
 */
import { init as initializeDatabase } from '@lib/database';
initializeDatabase();

/**
 * Функции жизненного цикла
 */
import bootstrap from '@lifecycle/bootstrap';
import configuration from '@lifecycle/configuration';
import jacketzip from '@lifecycle/jacketzip';

/**
 * Express-приложение
 */
import app from '@lib/app';

/**
 * Загрузка и логгинг и всякая фигня
 */
console.log(colors.yellow(
    "Предзагрузчик сервера запущен..."
));

bootstrap()
    .then(() => {
        console.log(colors.green(
            "Предзагрузчик сервера завершил свою работу."
        ));
        console.log(colors.yellow(
            "Запуск конфигурации сервера..."
        ));

        return configuration()
    })
    .then(() => {
        console.log(colors.green(
            "Конфигурация сервера завершена."
        ));
        console.log(colors.yellow(
            "Запуск постзагрузчика сервера..."
        ));

        return jacketzip(
            app.listen(PORT, () => {
                console.log(colors.green(
                    'Сервер запущен на порте ' +
                    colors.underline(colors.bold(String(PORT))) +
                    '.'
                ));
            })
        );
    })
    .then(() => {
        console.log(colors.green(
            "Постзагрузчик сервера завершил свою работу."
        ));
    })
    .catch(e => {
        console.log(colors.red(
            "Произошла ошибка."
        ));

        console.log(e);
    });