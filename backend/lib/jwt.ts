import jwt from 'jsonwebtoken';
import clone from 'lodash/clone';

import config from '@config';

interface JwtPayload {
    id?: number
};

function issue(payload: JwtPayload, jwtOptions: {} = {}) {
    return jwt.sign(
        clone(payload),
        config.jwtSecret,
        Object.assign(config.jwtConfig, jwtOptions)
    );
}

function verify(token: string) {
    return new Promise<JwtPayload>(function jwtVerifyPromise(resolve, _reject) {
        jwt.verify(
            token,
            config.jwtSecret,
            {},
            (err, tokenPayload: JwtPayload = {}) => {
                if (err) {
                    resolve(null);
                }

                resolve(tokenPayload);
            }
        );
    });
}

export {
    verify,
    issue
};