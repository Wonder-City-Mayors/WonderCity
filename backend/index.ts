import { init } from "@database";
import App from "@lib/app";
import { logger } from "@utils/logger";
import validateEnv from "@utils/validateEnv";

init();

// validateEnv();

// const app = new App([]);

// app.bootstrap()
//     .then(() => app.jacketzip())
//     .then(() => logger.info("Сервер запущен!"))
//     .catch((e) => console.error("Произошла ошибка."));
