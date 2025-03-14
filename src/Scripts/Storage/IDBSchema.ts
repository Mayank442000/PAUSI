import { DBSchema } from "idb";

export type ID_t = string;
export type IDs_t = Array<ID_t>;
export type ChatInfoID_t = string;
export type ChatInfoIDs_t = Array<ChatInfoID_t>;
export type ChatID_t = string;
export type ChatIDs_t = Array<ChatID_t>;
export type ChatBlockID_t = string;
// export type ChatBlockIDs_t = Array<ChatBlockID_t>;
export type Chat_t = IChat;
export type Chats_t = Array<Chat_t>;
export type User_t = IUsers;
export type Users_t = Array<User_t>;

export type instructions_t = string;
export type extra_info_t = string;
export type avatar_t = string;
export type name_t = string;

export interface IChat {
    chatID: ChatID_t;
    sender: string;
    avatar: string;
    message: string;
    time_ms: number;
}

export interface IChatBlock {
    ChatBlockID: ChatBlockID_t;
    chat_ids: ChatIDs_t;
}

export interface IAllChatsIDs {
    IDs: IDs_t;
}

export interface IUsers {
    UserID: string;
    avatar: string;
    name: string;
    instructions?: string;
    extra_info?: string;
    AI: boolean;
}

export interface IChatInfo {
    ID: ChatInfoID_t;
    avatar: avatar_t;
    name: name_t;
    instructions?: instructions_t;
    extra_info?: extra_info_t;
    Users?: IUsers[];
    lastChatID?: ChatID_t;
    chatBlockID: ChatBlockID_t;
}

export interface IPausiDBSchema {
    ALL_CHAT_IDS: {
        key: "all_chat_ids";
        value: IAllChatsIDs;
    };
    Users: {
        key: string;
        value: IUsers;
        indexes: {
            name: name_t;
        };
    };
    ChatInfo: {
        key: string;
        value: IChatInfo;
        indexes: {
            name: name_t;
        };
    };
    ChatBlocks: {
        key: ChatBlockID_t;
        value: IChatBlock;
    };
    Chats: {
        key: ChatID_t;
        value: IChat;
        indexes: {};
    };
}

export type stores_t = keyof IPausiDBSchema;
export type keys_t = IPausiDBSchema[keyof IPausiDBSchema]["key"];
export type value_t = IPausiDBSchema[keyof IPausiDBSchema]["value"];
