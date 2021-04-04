import HttpException from "@exceptions/HttpException"
import { getMeDto } from "@lib/dtos/user.dto"
import { verify } from "@lib/jwt"
import User from "@models/user"
import { isEmpty } from "@utils"

export default class UserService {
    async me(userData: getMeDto) {
        if (isEmpty(userData)) {
            throw new HttpException(400, "Некорректные данные запроса.")
        }

        const payload = await verify(userData.jwt)

        if (!payload) {
            throw new HttpException(401, "Авторизация неуспешна.")
        }

        return (await User.query().findById(payload.id)).toResponseUser()
    }
}
