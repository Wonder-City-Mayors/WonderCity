import HttpException from "@exceptions/HttpException";
import { createUserDto } from "@lib/dtos/users.dto";
import User from "@models/user";
import { isEmpty } from "lodash";

export default class AuthService {
    public async signUp(userData: createUserDto): Promise<User> {
        if (isEmpty(userData)) {
            throw new HttpException(400, "Некорректные данные пользователя.");
        }
    }
}
