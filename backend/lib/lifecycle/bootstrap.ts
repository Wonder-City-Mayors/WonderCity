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

let stations: { [key: number]: WebSocket } = {}

export async function checkReadOuts(device: Device) {
    if (device.stationId) {
        let station = stations[device.stationId]
        if (station) {
            station.emit("getReadOut", JSON.stringify({ deviceId: device.id }))
        }
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
                stations[request.stationPayload.stationId] = socket

                socket.on("getReadOut", function (str) {
                    let deviceInfo = JSON.parse(str)
                    let tid = {
                        timestamp: new Date().toISOString(),
                        record: deviceInfo.record,
                        deviceId: deviceInfo.deviceId,
                    }
                    Value.query()
                        .insert(tid)
                        .then(function () {})
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
