import { AsyncLocalStorage } from 'async_hooks';

class ContextManager {
    constructor() {
        this.asyncLocalStorage = new AsyncLocalStorage();
    }

    run(callback) {
        this.asyncLocalStorage.run(new Map(), callback);
    }

    set(key, value) {
        const store = this.asyncLocalStorage.getStore();
        if (store) store.set(key, value);
    }

    get(key) {
        const store = this.asyncLocalStorage.getStore();
        return store ? store.get(key) : undefined;
    }

    getAll() {
        const store = this.asyncLocalStorage.getStore();
        if (!store) return {};
        const entries = {};
        store.forEach((value, key) => entries[key] = value);
        return entries;
    }
}

export default new ContextManager();
