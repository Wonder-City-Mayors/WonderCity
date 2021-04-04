import { cleanEnv, port, str } from "envalid"

cleanEnv(process.env, {
    NODE_ENV: str({ choices: ["development", "production"] }),
    JWT_SECRET: str(),
    PORT: port(),
})
