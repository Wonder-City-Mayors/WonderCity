import "@database/init"
import "@utils/validateEnv"

import App from "@lib/app"
import AuthRoute from "@routes/auth"
import UserRoute from "@routes/user"

const app = new App(new AuthRoute(), new UserRoute())

app.bootstrap()
    .then(() => app.jacketzip())
    .catch((e) => console.error("Произошла ошибка."))
