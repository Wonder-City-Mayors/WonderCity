const size = require('lodash/size');
const port = (
  process.env.SERIAL_PORT_NAME ?
    require('serialport')(process.env.SERIAL_PORT_NAME, {
      baudRate: process.env.SERIAL_PORT_BAUD_RATE || 9600
    }) :
    undefined
);

const randomInt = (start, end) => parseInt(
  Math.random() * (end - start) + start,
  10
);

module.exports = async () => {
  const dev = process.env.NODE_ENV === 'development';
  const io = require('socket.io')(wonder.http);
  const path = require('path');
  const cookie = require('cookie');
  const getUser = require(path.join(
    process.cwd(),
    'utils',
    'getUser'
  ));

  if (port) {
    let resolveCurrent, rejectCurrent;
    let currentId;
    let currentData = '';

    port.on('data', data => {
      data = data.toString();

      for (let i = 0; i < data.length; i += 1) {
        if (data[i] === '#') {
          currentData += data.substring(0, i);
          let value;

          if (currentData === 'error') {
            console.log(`Блин, ошибка у ${currentId}!`);
            value = 0;
          } else {
            value = parseInt(currentData, 10);
            console.log(value);
          }

            setTimeout(() => {
              console.log(`Отпускаю ${currentId} в светлый путь...`);
              currentData = '';
              resolveCurrent(value);
            }, 5000);

            // wonder.query('value').findOne({
            //   tree_id: currentId
            // }).then(lastRow => {
            //   const difference = value - lastRow.last_record;

            //   wonder.query('value').update({
            //     id: lastRow.id
            //   }, {
            //     last_record: value,
            //     sum: lastRow.sum + difference
            //   });
            // });
          return;
        }
      }

      currentData += data;
    });

    const mainCycle = async max => {
      for (let number = 0; number < max; number += 1) {
        await wonder.query('tree').findOne({
          _skip: number,
          _sort: 'id:asc'
        }).then(device => {
          currentId = device.id;

          port.write(String(5), err => {
            if (err) {
              console.log('афигеть');
            }
          });

          return new Promise((resolve, reject) => {
            resolveCurrent = resolve;
            rejectCurrent = reject;
          }).then(value => {
            const userCache = wonder
              .cache
              .connectedUsers
            [device.user_id];

            wonder.query('value').create({
              tree_id: currentId,
              last_record: value,
              time_stamp_db: new Date()
            });

            if (userCache) {
              console.log(userCache);
              
              for (const key in userCache) {
                if (userCache[key].has(device.id)) {
                  io.to(key).emit('newReadouts', {
                    deviceId: device.id,
                    lastRecord: value
                  });
                }
              }
            }
          }, console.log);
        });
      }

      mainCycle(max);
    };

    wonder.query('tree').count().then(count => {
      setTimeout(() => {
        mainCycle(count);

        console.log('Hardware cycle started!');
      }, 5000);
    });
  } else {
    setInterval(() => {
      wonder.query('tree').find().then(allDevices => {
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
              let isOnline = false;

              for (const key in userCache) {
                if (userCache[key].has(device.id)) {
                  isOnline = true;

                  io.to(key).emit('newReadouts', {
                    deviceId: device.id,
                    lastRecord: value
                  });
                }
              }

              if (!dev || isOnline) {
                wonder.query('value').create({
                  time_stamp_db: new Date(),
                  tree_id: device.id,
                  last_record: value
                });
              }
            }
          }
        }
      });
    }, 3000);
  }

  io.on('connection', socket => {
    const cookies = cookie.parse(socket.handshake.headers.cookie);
    let user;

    getUser(cookies.jwt).then(result => {
      user = result;

      if (user && socket.connected) {
        if (!wonder.cache.connectedUsers.hasOwnProperty(user.id)) {
          wonder.cache.connectedUsers[user.id] = {};
        }
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
      if (user && wonder.cache.connectedUsers.hasOwnProperty(user.id)) {
        delete wonder.cache.connectedUsers[user.id][socket.id];

        if (size(wonder.cache.connectedUsers[user.id]) === 0) {
          delete wonder.cache.connectedUsers[user.id];
        }
      }
    });
  });
};