import { Server as httpServer } from "http";
import { Server, Socket } from "socket.io";
import * as cookie from "cookie";
import size from "lodash/size";

import getUser from "@utils/getUser";
import { db } from "@database";
import cache from "@lib/cache";

function randomInt(start: number, end: number) {
    return Math.trunc(Math.random() * (end - start) + start);
}

export default async function (server: httpServer) {
    const io = new Server(server);
    const port = process.env.SERIAL_PORT_NAME
        ? require("serialport")(process.env.SERIAL_PORT_NAME, {
              baudRate: process.env.SERIAL_PORT_BAUD_RATE || 9600,
          })
        : undefined;

    if (port) {
        let resolveCurrent, rejectCurrent;
        let currentId;
        let currentData = "";

        port.on("data", (data) => {
            data = data.toString();

            for (let i = 0; i < data.length; i += 1) {
                if (data[i] === "#") {
                    currentData += data.substring(0, i);
                    let value;

                    if (currentData === "error") {
                        console.log(`Блин, ошибка у ${currentId}!`);
                        value = 0;
                    } else {
                        value = parseInt(currentData, 10);
                        console.log(value);
                    }

                    setTimeout(() => {
                        console.log(`Отпускаю ${currentId} в светлый путь...`);
                        currentData = "";
                        resolveCurrent(value);
                    }, 5000);

                    /*
                     * Тут бы очень надо
                     * записать значение в БД
                     */

                    return;
                }
            }

            currentData += data;
        });

        const mainCycle = async (max) => {
            for (let number = 0; number < max; number += 1) {
                await db("tree")
                    .select("*")
                    .offset(number)
                    .limit(1)
                    .orderBy("id", "asc")
                    .first()
                    .then((device) => {
                        currentId = device.id;

                        port.write(String(5), (err) => {
                            if (err) {
                                console.log("афигеть");
                            }
                        });

                        return new Promise((resolve, reject) => {
                            resolveCurrent = resolve;
                            rejectCurrent = reject;
                        }).then((value) => {
                            const userCache =
                                cache.connectedUsers[device.user_id];

                            db("value").insert({
                                tree_id: currentId,
                                last_record: value,
                                time_stamp_db: new Date(),
                            });

                            if (userCache) {
                                console.log(userCache);

                                for (const key in userCache) {
                                    if (userCache[key].has(device.id)) {
                                        io.to(key).emit("newReadouts", {
                                            deviceId: device.id,
                                            lastRecord: value,
                                        });
                                    }
                                }
                            }
                        }, console.log);
                    });
            }

            mainCycle(max);
        };

        db("tree")
            .count("*")
            .then((count) => {
                setTimeout(() => {
                    mainCycle(count);

                    console.log("Запущен цикл железа.");
                }, 5000);
            });
    } else {
        setInterval(() => {
            db("tree")
                .select("*")
                .then((allDevices) => {
                    const date = new Date();
                    date.setTime(
                        date.getTime() + date.getTimezoneOffset() * 60000,
                    );

                    for (const device of allDevices) {
                        const userCache = cache.connectedUsers[device.user_id];

                        if (userCache) {
                            const value = randomInt(0, 501);

                            if (value <= 100) {
                                let isOnline = false;

                                for (const key in userCache) {
                                    if (userCache[key].has(device.id)) {
                                        isOnline = true;

                                        io.to(key).emit("newReadouts", {
                                            deviceId: device.id,
                                            lastRecord: value,
                                        });
                                    }
                                }

                                if (!process.env.DEV || isOnline) {
                                    db("value").insert({
                                        time_stamp_db: new Date(),
                                        tree_id: device.id,
                                        last_record: value,
                                    });
                                }
                            }
                        }
                    }
                });
        }, 3000);
    }

    io.on("connection", (socket: Socket) => {
        const cookies = cookie.parse(socket.handshake.headers.cookie);
        let user;

        getUser(cookies.jwt).then((result) => {
            user = result;

            if (user && socket.connected) {
                if (!(user.id in cache.connectedUsers)) {
                    cache.connectedUsers[user.id] = {};
                }
            }
        });

        socket.on("newDevices", (devices) => {
            if (user) {
                db("tree")
                    .select("*")
                    .whereIn("id", devices)
                    .then((dbDevices) => {
                        if (socket.connected) {
                            for (const device of dbDevices) {
                                if (device.user_id !== user.id) {
                                    return;
                                }
                            }

                            cache.connectedUsers[user.id][socket.id] = new Set(
                                devices,
                            );
                        }
                    });
            }
        });

        socket.on("disconnect", () => {
            if (user && user.id in cache.connectedUsers) {
                delete cache.connectedUsers[user.id][socket.id];

                if (size(cache.connectedUsers[user.id]) === 0) {
                    delete cache.connectedUsers[user.id];
                }
            }
        });
    });
}
