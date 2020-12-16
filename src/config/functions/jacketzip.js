const size = require('lodash/size');
let port;

if (process.env.SERIAL_PORT_NAME) {
  const SerialPort = require('serialport');

  port = SerialPort(process.env.SERIAL_PORT_NAME, {
    baudRate: process.env.SERIAL_PORT_BAUD_RATE || 9600
  });
}

const randomInt = (start, end) => parseInt(
  Math.random() * (end - start) + start,
  10
);

const mainCycle = async max => {
  let resolveCurrent, currentId;

  port.on('data', data => {
    data = data.toString();

    if (data === 'error') {
      console.log('blin' + currentId);
    } else {
      const value = parseInt(data, 10);

      wonder.query('value').findOne({
        tree_id: currentId
      }).then(lastRow => {
        const difference = value - lastRow.last_record;

        wonder.query('value').update({
          id: lastRow.id
        }, {
          last_record: value,
          sum: lastRow.sum + difference
        });
      });
    }

    resolveCurrent();
  });

  for (let number = 0; number < max; number += 1) {
    await wonder.query('tree').findOne({
      _skip: number
    }).then(device => {
      currentId = device.id;

      port.write(currentId, err => {
        if (err) {
          console.log('афигеть');
        }
      });

      return new Promise((resolve, reject) => {
        resolveCurrent = resolve;
      });
    });
  }

  mainCycle(max);
};

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

  if (process.env.SERIAL_PORT_NAME) {
    wonder.query('tree').count().then(mainCycle);
  } else {
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
              wonder.query('value').findOne({
                tree_id: device.id
              }).then(lastRow => {
                let isOnline = false;
                const lastSum = lastRow ? lastRow.sum : 0;
                const sum = lastSum + value;

                for (const key in userCache) {
                  if (userCache[key].has(device.id)) {
                    isOnline = true;

                    io.to(key).emit('newReadouts', {
                      deviceId: device.id,
                      lastRecord: value,
                      sum
                    });
                  }
                }

                if (!dev || isOnline) {
                  if (lastRow) {
                    wonder.query('value').update({
                      id: lastRow.id
                    }, {
                      time_stamp_db: new Date(),
                      last_record: value,
                      sum: lastRow.sum + value
                    });
                  } else {
                    wonder.query('value').create({
                      time_stamp_db: new Date(),
                      tree_id: device.id,
                      last_record: value,
                      sum: value
                    });
                  }
                }
              });
            }
          }
        }
      }, 3000);
    });
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
      if (user) {
        delete wonder.cache.connectedUsers[user.id][socket.id];

        if (size(wonder.cache.connectedUsers[user.id]) === 0) {
          delete wonder.cache.connectedUsers[user.id];
        }
      }
    });
  });
};