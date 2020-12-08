const size = require('lodash/size');

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

  wonder.query('user').findOne({
    username: 'asdfasdf',
    password: 'asdfasdf'
  }).then(user => 'ye');

  wonder.query('tree').find().then(allDevices => {
    setInterval(() => {
      const date = new Date();
      // date.setTime(date.getTime() + date.getTimezoneOffset() * 60000);
      // по идее, надо бы записывать время по Гринвичу, но js+knex настолько умный,
      // что достаёт потом это время в местном формате и в строчку превращает
      // как надо, так что... всё ок :)

      for (const device of allDevices) {
        const userCache = wonder
          .cache
          .connectedUsers
        [device.user_id];

        if (userCache) {
          const value = randomInt(0, 501);

          if (value <= 100) {
            const dev = process.env.NODE_ENV === 'development';
            let isOnline = false;

            for (const key in userCache) {
              if (userCache[key].has(device.id)) {
                isOnline = true;

                io.to(key).emit('newReadouts', {
                  deviceId: device.id,
                  value
                });
              }
            }

            if (!dev || isOnline) {
              wonder.query('value').create({
                tree_id: device.id,
                time_stamp_db: date,
                power: value,
                energy: value
              });
            }
          }
        }
      }
    }, 3000);
  });

  io.on('connection', socket => {
    const cookies = cookie.parse(socket.handshake.headers.cookie);
    let user;

    getUser(cookies.jwt).then(result => {
      user = result;

      if (user && socket.connected) {
        if (!wonder.cache.connectedUsers.hasOwnProperty(user.id)) {
          wonder.cache.connectedUsers[user.id] = {};
        }

        wonder.cache.connectedUsers[user.id][socket.id] = new Set();
      }
    });

    socket.on('newDevices', devices => {
      if (user) {
        wonder.query('tree').find({
          id_in: devices
        }).then(dbDevices => {
          if (socket.connected) {
            for (const device of dbDevices) {
              if (device.user_id !== user.id) {
                return;
              }
            }

            wonder
              .cache
              .connectedUsers
            [user.id]
            [socket.id] = new Set(devices);
          }
        });
      }
    });

    socket.on('disconnect', () => {
      if (user) {
        delete wonder.cache.connectedUsers[user.id][socket.id];

        if (size(wonder.cache.connectedUsers[user.id]) === 0) {
          delete wonder.cache.connectedUsers[user.id];
        }
      }
    });
  });
};