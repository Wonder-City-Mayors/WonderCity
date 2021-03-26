import setApi from '@lib/api';
import app from '@lib/app';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import * as colors from 'colors/safe';

export default async function onCreated() {
    app
        .use(cookieParser())
        .use(bodyParser.json({ extended: true }));

    if (process.env.DEV) {
        app.use(function logMiddleware(req, res, next) {
            const start = new Date();

            res.on('finish', function logFinishListener() {
                const ms = colors.underline(
                    colors.bold(String(Date.now() - start.getTime()))
                );
                const url = colors.cyan(req.originalUrl);
                const code = (
                    res.statusCode >= 200 ?
                        (
                            res.statusCode >= 300 ?
                                (
                                    res.statusCode >= 400 ?
                                        (
                                            res.statusCode >= 500 ?
                                                colors.red(res.statusCode) :
                                                colors.magenta(res.statusCode)
                                        ) :
                                        colors.yellow(res.statusCode)
                                ) :
                                colors.green(res.statusCode)
                        ) :
                        colors.gray(res.statusCode)
                );

                console.log(
                    `${start.getHours()}:${start.getMinutes()}:` +
                    `${start.getSeconds()} • ${ms} ms ` +
                    `${code} with ${req.method} on ${url}`
                );
            });

            next();
        });
    }

    await setApi();
};