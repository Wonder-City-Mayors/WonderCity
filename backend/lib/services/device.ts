import Device from "@models/device"
import Value from "@models/value"

export default class DeviceService {
    getReadouts = async (userId: number, page: number) => {
        return await Device.query()
            .where("userId", userId)
            .limit(10)
            .offset((page - 1) * 10)
            .then((devices) =>
                Promise.all(
                    devices.map((device) =>
                        Value.query()
                            .first()
                            .where("deviceId", device.id)
                            .orderBy("timestamp", "desc")
                            .then((value) => {
                                return (
                                    value || {
                                        deviceId: device.id,
                                        record: null,
                                    }
                                )
                            }),
                    ),
                ),
            )
    }
}
