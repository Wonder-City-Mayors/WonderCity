const randomInt = (start, end) => parseInt(
  Math.random() * (end - start) + start,
  10
);

module.exports = async () => {
  const io = require('socket.io')(wonder.http);
  const path = require('path');
  const cookie = require('cookie');
  const getUser = require(path.join(
    process.cwd(),
    'utils',
    'getUser'
  ));
  
  wonder.query('tree').find().then(allDevices => {
    setInterval(() => {
      const date = new Date();
      date.setTime(date.getTime() + date.getTimezoneOffset() * 60000);

      for (const device of allDevices) {
        const userCache = wonder
          .cache
          .connectedUsers
          [device.user_id];

        if (
          userCache &&
          userCache
            .devices
            .has(device.id) &&
          Math.random() < .05
        ) {
          const value = randomInt(0, 101);

          wonder.query('value').create({
            tree_id: device.id,
            time_stamp_db: date,
            power: value,
            energy: value
          });

          io.to(userCache.socketId).emit('newReadouts', {
            deviceId: device.id,
            value
          });
        }
      }
    }, 1000);
  });

  io.on('connection', socket => {
    const cookies = cookie.parse(socket.handshake.headers.cookie);
    let user;

    getUser(cookies.jwt).then(result => {
      user = result;

      if (user && socket.connected) {
        wonder.cache.connectedUsers[user.id] = {
          socketId: socket.id,
          devices: new Set()
        };
      }
    });

    socket.on('newDevices', devices => {
      if (user) {
        wonder.query('tree').find({
          id_in: devices
        }).then(dbDevices => {
          for (const device of dbDevices) {
            if (device.user_id !== user.id) return;
          }

          if (socket.connected) {
            wonder.cache.connectedUsers[user.id]
              .devices = new Set(devices);
          }
        });
      }
    });

    socket.on('disconnect', () => {
      if (user) {
        delete wonder.cache.connectedUsers[user.id];
      }
    });
  });
};