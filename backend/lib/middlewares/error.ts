import HttpException from "@exceptions/HttpException";
import { NextFunction, Request, Response } from "express";

export default function errorMiddleware(
    error: HttpException,
    req: Request,
    res: Response,
    next: NextFunction,
) {
    try {
        res.status(error.status || 500).json({
            message: error.message || "Something went wrong",
        });
    } catch (e) {
        next(e);
    }
}
