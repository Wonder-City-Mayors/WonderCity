import HttpException from "@exceptions/HttpException"
import {
    deviceIdDto,
    emailDto,
    jwtDto,
    lastNameDto,
    nameDto,
    passwordDto,
} from "@lib/dtos/user.dto"
import Device from "@models/device"
import User from "@models/user"
import { getResponseUser, isEmpty } from "@utils"
import { hash } from "bcrypt"
import { addDevice } from "@lifecycle/bootstrap"

export default class UserService {
    async me(userData: jwtDto) {
        if (isEmpty(userData)) {
            throw new HttpException(400, "Некорректные данные запроса.")
        }

        const responseUser = await getResponseUser(userData.jwt)

        if (!responseUser) {
            throw new HttpException(401, "Авторизация неуспешна.")
        }

        return responseUser
    }

    async addDevice(user: User, deviceData: deviceIdDto) {
        if (isEmpty(deviceData)) {
            throw new HttpException(400, "Некорректные данные запроса.")
        }

        const device = await Device.query().findById(deviceData.id)

        if (device.userId) {
            throw new HttpException(409, "Этот датчик уже занят.")
        }

        addDevice(device.id, user.id)
    }

    async changeFirstName(user: User, nameData: nameDto) {
        if (isEmpty(nameData)) {
            throw new HttpException(400, "Некорректные данные запроса.")
        }

        await User.query()
            .update({
                firstName: nameData.name,
            })
            .where("id", user.id)
    }

    async changeLastName(user: User, lastNameData: lastNameDto) {
        if (isEmpty(lastNameData)) {
            throw new HttpException(400, "Некорректные данные запроса.")
        }

        await User.query()
            .update({
                lastName: lastNameData.lastName,
            })
            .where("id", user.id)
    }

    async changeEmail(user: User, emailData: emailDto) {
        if (isEmpty(emailData)) {
            throw new HttpException(400, "Некорректные данные запроса.")
        }

        await User.query()
            .update({
                email: emailData.email,
            })
            .where("id", user.id)
    }

    async changePassword(user: User, passwordData: passwordDto) {
        if (isEmpty(passwordDto)) {
            throw new HttpException(400, "Некорректные данные запроса.")
        }

        await hash(passwordData.password, 10).then((password) => {
            return User.query()
                .update({
                    password,
                })
                .where("id", user.id)
        })
    }
}
