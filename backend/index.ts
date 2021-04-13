import "@database/init"
import "@utils/validateEnv"

import App from "@lib/app"
import AuthRoute from "@routes/auth"
import UserRoute from "@routes/user"
import DeviceRoute from "@routes/device"
import ValueRoute from "@routes/value"

const app = new App(
    new AuthRoute(),
    new UserRoute(),
    new DeviceRoute(),
    new ValueRoute(),
)

app.bootstrap()
    .then(() => app.jacketzip())
    .catch((e) => console.error("Произошла ошибка."))
