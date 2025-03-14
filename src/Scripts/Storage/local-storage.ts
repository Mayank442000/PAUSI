const getFromStore = (key: string) => {
    const item = localStorage.getItem(key);
    console.log(key, item, typeof item);
    if (typeof item === "string") {
        try {
            return JSON.parse(item);
        } catch {}
    }
    return item;
};

const putIntoStore = (key: string, value: any) => {
    localStorage.setItem(key, typeof value != "string" ? JSON.stringify(value) : value);
};

const removeFromStore = (key: string) => {
    localStorage.removeItem(key);
};

const storeAPI = (type: "PUT" | "GET" | "REM", key: string, value?: any) => {
    if (type === "PUT") {
        putIntoStore(key, value);
    } else if (type === "GET") {
        return getFromStore(key);
    } else if (type === "REM") {
        return removeFromStore(key);
    }
};

export { getFromStore, putIntoStore, removeFromStore, storeAPI };
