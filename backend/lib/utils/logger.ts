const logger = {
    info(message: string) {
        console.log(message);
    },
};

const stream = {
    write(message: string) {
        logger.info(message);
    },
};

export { logger, stream };
