interface ServerCache {
    connectedUsers?: {
        [key: string]: {
            [key: string]: Set<number>
        }
    }
}

const cache: ServerCache = {
};

export default cache;