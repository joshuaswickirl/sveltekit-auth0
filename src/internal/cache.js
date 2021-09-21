class Cache {

    constructor() {
        if (!Cache.instance) {
            this.data = {}
            Cache.instance = this
        }
        return Cache.instance
    }

    writeSession(id, tokens) {
        this.data[id] = tokens
    }

    getSession(id) {
        return this.data[id]
    }

    delSession(id) {
        delete this.data[id]
    }
}

const cache = new Cache();

export default cache;
