import { openDB, deleteDB, wrap, unwrap, IDBPDatabase } from "idb";
import { IPausiDBSchema, stores_t, keys_t, value_t } from "./IDBSchema";
import { sleep } from "../General/general";

class IndexDB {
    #DBName: string = "user-1";
    #DBVer: number = 1;
    #DB: IDBPDatabase<IPausiDBSchema> | undefined;
    init_done: boolean = false;

    constructor() {
        this.#DB = undefined;
        this.init();
    }

    async init() {
        this.#DB = await openDB<IPausiDBSchema>(this.#DBName, this.#DBVer, {
            upgrade(db, oldVersion, newVersion, transaction) {
                console.log(`Upgrading database from version ${oldVersion} to ${newVersion}`);

                // Object Store: ALL_CHAT_IDS
                if (!db.objectStoreNames.contains("ALL_CHAT_IDS")) {
                    db.createObjectStore("ALL_CHAT_IDS"); // Key is "all_chat_ids", no keyPath needed in create
                }

                // Object Store: Users
                if (!db.objectStoreNames.contains("Users")) {
                    const usersStore = db.createObjectStore("Users", { keyPath: "UserID" });
                    if (!usersStore.indexNames.contains("name")) {
                        usersStore.createIndex("name", "name");
                    }
                }

                // Object Store: ChatInfo
                if (!db.objectStoreNames.contains("ChatInfo")) {
                    const chatInfoStore = db.createObjectStore("ChatInfo", { keyPath: "ID" });
                    if (!chatInfoStore.indexNames.contains("name")) {
                        chatInfoStore.createIndex("name", "name");
                    }
                }

                // Object Store: ChatBlocks
                if (!db.objectStoreNames.contains("ChatBlocks")) {
                    db.createObjectStore("ChatBlocks", { keyPath: "ChatBlockID" });
                }

                // Object Store: Chats
                if (!db.objectStoreNames.contains("Chats")) {
                    db.createObjectStore("Chats", { keyPath: "chatID" });
                }

                console.log("Database upgrade completed.");
            },
        });
        // db.put("ALL_CHAT_IDS", { IDs: [] }, "all_chat_ids");
        this.init_done = true;
        if ((await this.#getAllKeys("ALL_CHAT_IDS")).length == 0) this.put("ALL_CHAT_IDS", { IDs: [] }, "all_chat_ids");
    }

    async #awaitInit(ms: number = 512) {
        while (!this.init_done) await sleep(ms);
        return this.init_done;
    }

    async #getAllKeys(storeName: stores_t) {
        await this.#awaitInit();
        return (await this.#DB?.getAllKeys(storeName)) as Array<keys_t>;
    }

    async keyExists(storeName: stores_t, key: keys_t) {
        await this.#awaitInit();
        const all_keys = await this.#getAllKeys(storeName);
        return all_keys.includes(key);
    }

    async allKeys(storeName: stores_t) {
        await this.#awaitInit();
        return (await this.#DB?.getAllKeys(storeName)) as Array<keys_t>;
    }

    async get(storeName: stores_t, key: keys_t) {
        await this.#awaitInit();
        const a = (await this.#DB?.get<stores_t>(storeName, key)) as IPausiDBSchema[stores_t]["value"];
        console.log("IndexDB.get : ", storeName, key, a);
        return a;
    }

    async put(storeName: stores_t, value: value_t, key?: keys_t) {
        await this.#awaitInit();
        console.log("IndexDB.put : ", storeName, value, key);
        return await this.#DB?.put<stores_t>(storeName, value, key);
    }

    async del(storeName: stores_t, key: keys_t) {
        await this.#awaitInit();
        return await this.#DB?.delete(storeName, key);
    }

    async gets(storeName: stores_t, keys: Array<keys_t>) {
        await this.#awaitInit();
        if (this.#DB == undefined) return;
        const tx = this.#DB.transaction(storeName, "readwrite");
        const store = tx.store;
        const get_res = await Promise.all(keys.map(async (key) => await store.get(key)));
        await tx.done;
        return get_res;
    }

    async dels(storeName: stores_t, keys: Array<keys_t>) {
        await this.#awaitInit();
        if (this.#DB == undefined) return;
        const tx = this.#DB.transaction(storeName, "readwrite");
        const store = tx.store;
        const del_res = await Promise.all(keys.map(async (key) => await store.delete(key)));
        await tx.done;
        return del_res;
    }
}

const IndexDBInstance = new IndexDB();
export default IndexDBInstance;
export { IndexDB };
