import { StationTokenPayload } from "@interfaces/jwt"
import { validateStation } from "@middlewares/validation"
import Device from "@models/device"
import Value from "@models/value"
import { createServer } from "http"
import { IncomingMessage } from "node:http"
import WebSocket, { Server } from "ws"

type ModifiedIncomingMessage = IncomingMessage & {
    stationPayload: StationTokenPayload
}

type NewStationListener = (stationId: number) => void

const stations: {
    [key: number]: {
        socket: WebSocket
        reject?: () => void
        resolve?: (readout: number) => void
    }
} = {}
const deviceIdToUserId: {
    [key: number]: number
} = {}

let newStationListener: NewStationListener | undefined

export function setNewStationListener(listener: NewStationListener) {
    newStationListener = listener
}

export function getReadout(
    device: Device,
    resolve: (readout: number) => void,
    reject,
) {
    if (device.baseStationId) {
        const station = stations[device.baseStationId]

        if (station) {
            station.resolve = resolve
            station.reject = reject

            station.socket.send(
                JSON.stringify({
                    type: "readout",
                    deviceId: device.id,
                }),
            )
        }
    }
}

export function addDevice(deviceId: number, userId: number) {
    for (let stationId in stations) {
        deviceIdToUserId[deviceId] = userId

        stations[stationId].socket.send(
            JSON.stringify({
                type: "registration",
                deviceId,
            }),
        )
    }
}

export default async function bootstrap() {
    const server = createServer()
    const ws = new Server({
        noServer: true,
    })

    ws.on(
        "connection",
        function connection(socket, request: ModifiedIncomingMessage) {
            if (request.stationPayload) {
                const id = request.stationPayload.stationId

                if (newStationListener) {
                    newStationListener(id)
                }

                stations[id] = { socket }

                socket.on("message", function (data) {
                    const message = JSON.parse(data.toString())

                    if (message.type === "error") {
                        const reject = stations[id].reject

                        if (reject) {
                            reject()
                        }

                        return
                    }

                    if (message.type === "registration") {
                        Device.query()
                            .update({
                                baseStationId: id,
                                userId: deviceIdToUserId[message.deviceId],
                            })
                            .where({
                                id: message.deviceId,
                            })
                            .then(function () {
                                delete deviceIdToUserId[message.deviceId]
                            })
                    }

                    Value.query()
                        .insert({
                            deviceId: message.deviceId,
                            record: message.record,
                            timestamp: new Date(),
                        })
                        .then(function () {
                            const resolve = stations[id].resolve

                            if (resolve) {
                                resolve(message.record)
                            }
                        })
                })
            }
        },
    )

    server.on("upgrade", function upgrade(request, socket, head) {
        validateStation()(request, undefined, () => {
            if (request.stationPayload) {
                ws.handleUpgrade(request, socket, head, function done(socket) {
                    ws.emit("connection", socket, request)
                })
            } else {
                socket.destroy()
            }
        })
    })

    server.listen(
        process.env.STATION_SOCKET_PORT
            ? parseInt(process.env.STATION_SOCKET_PORT, 10)
            : 10001,
    )
}
