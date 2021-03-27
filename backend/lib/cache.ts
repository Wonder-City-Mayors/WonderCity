interface ServerCache {
    connectedUsers: {
        [key: string]: {
            [key: string]: Set<number>
        }
    }
}

const cache: ServerCache = {
    connectedUsers: {}
};

export default cache;