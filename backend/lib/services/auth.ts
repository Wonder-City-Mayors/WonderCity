import HttpException from "@exceptions/HttpException";
import { TokenWithData } from "@interfaces/auth";
import { createUserDto } from "@lib/dtos/users.dto";
import { issue } from "@lib/jwt";
import User from "@models/user";
import { compare, hash } from "bcrypt";
import { isEmpty } from "lodash";

export default class AuthService {
    public async signUp(userData: createUserDto): Promise<User> {
        if (isEmpty(userData)) {
            throw new HttpException(400, "Некорректные данные пользователя.");
        }

        const existingUser = await User.query()
            .first()
            .where("username", userData.username);

        if (existingUser) {
            throw new HttpException(
                409,
                `Пользователь с логином '${userData.username}' уже существует.`,
            );
        }

        const newUser = await User.query().insert({
            username: userData.username,
            password: await hash(userData.password, 10),
        });

        return newUser;
    }

    public async signIn(userData: createUserDto): Promise<TokenWithData> {
        if (isEmpty(userData)) {
            throw new HttpException(400, "Некорректные данные пользователя.");
        }

        const foundUser = await User.query()
            .first()
            .where("username", userData.username);

        if (
            !(
                foundUser &&
                (await compare(userData.password, foundUser.password))
            )
        ) {
            throw new HttpException(400, `Неверный логин или пароль.`);
        }

        return this.createToken(foundUser);
    }

    private createToken(user: User): TokenWithData {
        return {
            expiresIn: 60 * 60,
            token: issue({
                id: user.id,
            }),
        };
    }
}
