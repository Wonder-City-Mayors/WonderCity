import "@database/init";

import App from "@lib/app";
import User from "@models/user";
import validateEnv from "@utils/validateEnv";

validateEnv();

const app = new App([]);

User.query().first().then(console.log);

// app.bootstrap()
//     .then(() => app.jacketzip())
//     .catch((e) => console.error("Произошла ошибка."));
