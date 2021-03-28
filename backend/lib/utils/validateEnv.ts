import { cleanEnv, port, str } from "envalid";

export default function validateEnv() {
    cleanEnv(process.env, {
        NODE_ENV: str(),
        JWT_SECRET: str(),
        PORT: port(),
    });
}
