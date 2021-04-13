import HttpException from "@exceptions/HttpException"
import { UserWithJwt } from "@interfaces/jwt"
import { createUserDto } from "@lib/dtos/auth.dto"
import { issueByUser } from "@lib/jwt"
import User from "@models/user"
import { compare, hash } from "bcrypt"
import { isEmpty } from "lodash"

export default class AuthService {
    public async signUp(userData: createUserDto): Promise<UserWithJwt> {
        if (isEmpty(userData)) {
            throw new HttpException(400, "Некорректные данные пользователя.")
        }

        const existingUser = await User.query()
            .first()
            .where("username", userData.username)

        if (existingUser) {
            throw new HttpException(
                409,
                `Пользователь с логином '${userData.username}' уже существует.`,
            )
        }

        const newUser = await User.query().insert({
            username: userData.username,
            password: await hash(userData.password, 10),
        })

        const jwt = issueByUser(newUser)

        return {
            data: newUser,
            jwt,
        }
    }

    public async signIn(userData: createUserDto): Promise<UserWithJwt> {
        if (isEmpty(userData)) {
            throw new HttpException(400, "Некорректные данные пользователя.")
        }

        const foundUser = await User.query()
            .first()
            .where("username", userData.username)

        if (
            !(
                foundUser &&
                (await compare(
                    userData.password,
                    foundUser.password.toString(),
                ))
            )
        ) {
            throw new HttpException(400, `Неверный логин или пароль.`)
        }

        return {
            data: foundUser.toResponseUser(),
            jwt: issueByUser(foundUser),
        }
    }
}
