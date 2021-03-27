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
 * Разноцветная консоль :Р
 */
import * as colors from 'colors/safe';

/**
 * Инициализация базы данных
 */
import { init as initializeDatabase, db } from '@lib/database';
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
 * Политики))
 */
import getUser from '@policies/getUser';

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

app.get('/values/statPrediction', async (req, res) => {
    if (!getUser(req)) {
        res.status(401).end();

        return;
    }

    if (typeof req.query.deviceId !== "string") {
        res.status(400).end();

        return;
    }

    const IdCounter = parseInt(req.query.deviceId, 10);

    if (isNaN(IdCounter)) {
        res.status(400).end();

        return;
    }

    const Counter = await db.first('*').from('tree').where('id', IdCounter);

    if (!Counter) {
        res.status(400).end();

        return;
    }

    // if (req.user.id != Counter.user_id) {
    //     res.status(403).end();

    //     return;
    // }

    const Valuess = [];
    const Time = new Date();
    for (let i = 0; i != 30; i++) {
        const value = await db.raw(
            "select avg(nice) as average from (select datediff(?, time_stamp_db) as time," +
            " sum(last_record) as nice from value where tree_id = ? group by time having time" +
            " mod 7 = 0) as val;", [Time, IdCounter]
        );
        Time.setTime(86400000 + Time.getTime())
        Valuess.push(value[0].average);
    }
    res.send(Valuess);
});