const jwtSecret: string = 
    process.env.JWT_SECRET || 
    'jwt secret key';

const jwtConfig = {
    expiresIn: "15d"
};

export {
    jwtSecret,
    jwtConfig
};
