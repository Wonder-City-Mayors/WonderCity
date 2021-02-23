const jwt = require('jsonwebtoken');
const _ = require('lodash');

module.exports = {
    issue: (payload, jwtOptions = {}) => {
        console.log(wonder.config);

        return jwt.sign(
            _.clone(payload),
            _.get(wonder, ['config', 'jwtSecret']),
            _.defaults(jwtOptions, _.get(wonder, ['config', 'jwtConfig']))
        );
    },
    verify: token => {
        return new Promise((resolve, reject) => {
            jwt.verify(
                token,
                _.get(wonder, ['config', 'jwtSecret']),
                {},
                (err, tokenPayload = {}) => {
                    if (err) {
                        resolve(null);
                    }

                    resolve(tokenPayload);
                }
            );
        });
    }
};