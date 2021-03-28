import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import hpp from "hpp";
import compression from "compression";
import Route from "@interfaces/route";
import errorMiddleware from "@middlewares/error";
import { logger, stream } from "@utils/logger";
import bootstrap from "@lifecycle/bootstrap";
import jacketzip from "@lifecycle/jacketzip";

export default class App {
    public app: express.Application;
    public port: number;
    public dev: boolean;

    constructor(routes: Route[]) {
        this.app = express();
        this.port = parseInt(process.env.PORT, 10);
        console.log(process.env.DEV);
        this.dev = Boolean(process.env.DEV);

        if (isNaN(this.port)) {
            this.port = 3000;
        }

        this.initializeMiddlewares();
        this.initializeRoutes(routes);
        this.initializeErrorHandling();
    }

    public bootstrap() {
        return bootstrap();
    }

    public async jacketzip() {
        return jacketzip(
            this.app.listen(this.port, () => {
                logger.info(`🚀 App listening on the port ${this.port}`);
            }),
        );
    }

    public getServer() {
        return this.app;
    }

    private initializeMiddlewares() {
        if (this.dev) {
            this.app.use(cors({ origin: true, credentials: true }));
        } else {
            this.app.use(
                cors({ origin: "your.domain.com", credentials: true }),
            );
        }

        this.app
            .use(express.json())
            .use(express.urlencoded({ extended: true }))
            .use(hpp())
            .use(helmet())
            .use(compression())
            .use(cookieParser());
    }

    private initializeRoutes(routes: Route[]) {
        for (let i = 0; i < routes.length; i++)
            this.app.use("/", routes[i].router);
    }

    private initializeErrorHandling() {
        this.app.use(errorMiddleware);
    }
}
