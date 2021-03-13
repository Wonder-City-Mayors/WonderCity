import bcrypt from 'bcrypt';

export default {
    signUp: async (req, res) => {
        const { username, password } = req.body;

        if (
            !password ||
            !username ||
            password.length < 8 ||
            /[^0-9a-zA-Z#$*_]/.test(username)
        ) {
            res.throw(400, "Некорректный логин или пароль");
            return;
        }

        const potentiallyExistingUser = await wonder
            .query('user')
            .findOne({ username });

        if (potentiallyExistingUser) {
            res.throw(403, "Пользователь с таким логином уже зарегистрирован");
            return;
        }

        const userId = await wonder.knex.transaction(trx => {
            const date = new Date();

            return bcrypt
                .hash(password, 10)
                .then(hash => trx.insert({
                    first_name: 'Пользователь',
                    last_name: 'Анонимный',
                    password: hash,
                    username,
                })
                    .into('user')
                )
                .then(userId => userId[0]);
        });

        const jwt = wonder.services.jwt.issue({
            id: userId
        });

        res.send({
            jwt,
            data: {
                isAuthenticated: true,
                first_name: 'Пользователь',
                last_name: 'Анонимный',
                permissions: [],
                username
            }
        });

        return;
    },

    signIn: async (req, res) => {
        const { username, password } = req.body;

        if (
            !password ||
            !username ||
            password.length < 8 ||
            /[^0-9a-zA-Z#$*_]/.test(username)
        ) {
            res.throw(400, "Некорректный логин или пароль");
            return;
        }

        const user = await wonder.query('user').findOne({ username });

        if (
            !user ||
            !(await bcrypt.compare(password, String(user.password)))
        ) {
            res.throw(401, "Неправильный логин или пароль");
            return;
        }

        const jwt = wonder.services.jwt.issue({
            id: user.id
        });

        const permissions = user.role_id ?
            wonder.cache.roles[user.role_id].permissions :
            [];

        res.send({
            jwt,
            data: {
                isAuthenticated: true,
                permissions,
                firstName: user.first_name,
                lastName: user.last_name,
                username: user.username
            },
        });

        return;

    },

    addDevice: async (req, res) => {
        if (req.body.id) {
            const id = parseInt(req.body.id, 10);

            if (id) {
                const device = await wonder.query('tree').findOne({ id });

                if (device) {
                    if (device.user_id === null) {
                        await wonder.query('tree').update({
                            id: id
                        }, {
                            user_id: req.user.id
                        });

                        res.send('OK');
                        return;
                    }

                    res.throw(403);
                    return;
                }
            }
        }

        res.throw(400);
    },

    addName: async (req, res) => {
        req.query.name
        if
            (req.query.name) {
            wonder.query("user").update({ id: req.user.id }, { first_name: req.query.name })
            res.send("Ок")
            return
        }
        res.throw(400)
    },

    /**
     * Обработчик, который меняет фамилию пользователя
     * 
     * @throws 400
     * 
     * @param {ExpressRequest} request 
     * @param {ExpressResponse} response 
     */
    changeLastName: async (request, response) => {
        const lastName = String(request.body.lastName);

        if (!lastName || /[^А-яёЁ]/.test(lastName)) {
            response.throw(400, "Некорректная фамилия");
            return;
        }

        await wonder.knex('user')
            .update('last_name', lastName)
            .where('id', request.user.id);

        response.status(200).send();
    },

    /**
     * Обработчик, который меняет электронную почту пользователя
     * 
     * @throws 400
     * 
     * @param {ExpressRequest} req 
     * @param {ExpressResponse} res 
     */
    changeEmail: async (req, res) => {
        if (/^\w+@\w+\.\w+$/.test(req.body.email)) {
            await wonder.knex('user')
                .update('email', req.body.email)
                .where('id', req.user.id);
            res.status(200).end();
        }
        else {
            res.throw(400, 'Insert normal email')
        }
    },

    /**
     * Обработчик, который меняет пароль пользователя
     * 
     * @throws 400
     * 
     * @param {ExpressRequest} req 
     * @param {ExpressResponse} res 
     */
    changePassword: async (req, res) => {
        // Тело функции
        if (!req.body.password || req.body.password.length < 8) {
            res.throw(400);
            return;
        }
        await wonder.knex('user')
            .update('password', await bcrypt.hash(req.body.password, 10))
            .where('id', req.user.id);
        res.status(200).end();
    }
};

