import cache from "@lib/cache"
import Device from "@models/device"
import Value from "@models/value"
import { getAllRoles, getUser } from "@utils"
import * as cookie from "cookie"
import { Server as HttpServer } from "http"
import size from "lodash/size"
import { Server, Socket } from "socket.io"
import { setNewStationListener } from "./bootstrap"

function randomInt(start: number, end: number) {
    return Math.trunc(Math.random() * (end - start) + start)
}

export default function jacketzip(server: HttpServer) {
    async function updateCache() {
        cache.roles = {}

        const roles = await getAllRoles()

        for (let i = 0; i < roles.length; i += 1) {
            cache.roles[roles[i].id] = roles[i]
        }
    }

    const io = new Server(server)

    setNewStationListener((stationId: number) => {
        ;(async function () {
            while (true) {
                const allDevices = await Device.query().where({
                    stationId,
                })

                for (let i = 0; i < allDevices.length; i++) {
                    await new Promise()
                }
            }
        })()
    })

    io.on("connection", (socket: Socket) => {
        const cookies = cookie.parse(socket.handshake.headers.cookie || "")
        let user

        getUser(cookies.jwt).then((result) => {
            user = result

            if (user && socket.connected) {
                if (!(user.id in cache.connectedUsers)) {
                    cache.connectedUsers[user.id] = {}
                }
            }
        })

        socket.on("newDevices", (devices) => {
            if (user) {
                Device.query()
                    .whereIn("id", devices)
                    .then((dbDevices) => {
                        if (socket.connected) {
                            for (const device of dbDevices) {
                                if (device.userId !== user.id) {
                                    return
                                }
                            }

                            cache.connectedUsers[user.id][socket.id] = new Set(
                                devices,
                            )
                        }
                    })
            }
        })

        socket.on("disconnect", () => {
            if (user && user.id in cache.connectedUsers) {
                delete cache.connectedUsers[user.id][socket.id]

                if (size(cache.connectedUsers[user.id]) === 0) {
                    delete cache.connectedUsers[user.id]
                }
            }
        })
    })

    setInterval(updateCache, 300000)

    return updateCache()
}
