import AuthController from "@controllers/auth";
import Route from "@interfaces/route";
import { Router } from "express";

export default class AuthRoute implements Route {
    router = Router();
    authController = new AuthController();
}
