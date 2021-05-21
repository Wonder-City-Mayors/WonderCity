import cache from "@lib/cache"
import Device from "@models/device"
import { getAllRoles, getUser } from "@utils"
import * as cookie from "cookie"
import { Server as HttpServer } from "http"
import size from "lodash/size"
import { Server, Socket } from "socket.io"
import { setNewStationListener, getReadout } from "./bootstrap"

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
        ; (async function () {
            while (true) {
                const allDevices = await Device.query().where({
                    baseStationId: stationId,
                })

                for (let i = 0; i < allDevices.length; i++) {
                    await new Promise((resolve, reject) => {
                        getReadout(allDevices[i], resolve, reject)
                    }).then(
                        (readout: number) => {
                            const userId = allDevices[i].userId
                            const userSockets =
                                userId && cache.connectedUsers[userId]

                            if (userSockets) {
                                for (let socketId in userSockets) {
                                    if (
                                        userSockets[socketId].has(
                                            allDevices[i].id,
                                        )
                                    ) {
                                        io.to(socketId).emit("newReadouts", {
                                            deviceId: allDevices[i].id,
                                            record: readout,
                                        })
                                    }
                                }
                            }
                        },
                        () => {
                            console.log("Couldn't get device readouts.")
                        },
                    )
                }

                await new Promise((resolve, reject) => {
                    setTimeout(resolve, 5000)
                })
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
