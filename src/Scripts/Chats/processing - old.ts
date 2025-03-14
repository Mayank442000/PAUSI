import { getFromStore, putIntoStore, removeFromStore } from "../Storage/local-storage";

type ID_t = string;
type IDs_t = Array<ID_t>;
type chat_t = IChatCard;
type chats_t = Array<IChatCard>;
type users_t = Array<IChatUser>;

export interface IChatCard {
    sender: string;
    avatar: string;
    message: string;
    time: number;
}

export interface IInstructExta {
    instructions?: string;
    extra_info?: string;
}

export interface IChatUser {
    avatar: string;
    name: string;
    userID: ID_t;
}

interface IChatBasic {
    binfo: {
        // Basic Info = Binfo
        avatar: string;
        name: string;
        instructions?: string;
        extra_info?: string;
    };
    lastMsg?: IChatCard;
    users?: users_t;
    ID: ID_t;
    chatID: ID_t;
}

export interface IChatsHist {
    binfo: {
        avatar: string;
        name: string;
    };
    users?: users_t;
    ID: ID_t;
    chats: chats_t;
}

const getBasicInfoID = (ID: ID_t) => ID + (ID.slice(-6) != "_BINFO" ? "_BINFO" : "");
const getChatHistID = (ID: ID_t) => ID + (ID.slice(-6) != "_CHATS" ? "_CHATS" : "");

const getAllChatIDs = (): IDs_t => getFromStore("ALL_CHAT_IDS");
const putAllChatIDs = (IDs: IDs_t) => putIntoStore("ALL_CHAT_IDS", IDs);

const prependNewChatID = (ID: string) => {
    const chat_ids = getAllChatIDs();
    if (chat_ids.indexOf(ID) !== -1) throw "prependNewChatID: ID repeated : ID = " + ID;
    chat_ids.unshift(ID);
    putAllChatIDs(chat_ids);
    return chat_ids;
};

const prependChatID = (ID: string) => {
    const chat_ids = getAllChatIDs();
    const ind = chat_ids.indexOf(ID);
    if (ind != -1) chat_ids.splice(ind, 1);
    chat_ids.unshift(ID);
    putAllChatIDs(chat_ids);
    return chat_ids;
};

const prependOldChatID = (ID: string) => {
    console.log("prependOldChatID : ", ID);
    const chat_ids = getAllChatIDs();
    const ind = chat_ids.indexOf(ID);
    console.log("prependOldChatID : ", ID, chat_ids, ind);
    if (ind === -1) throw "prependOldChatID: ID not found : ID = " + ID;
    chat_ids.splice(ind, 1);
    chat_ids.unshift(ID);
    putAllChatIDs(chat_ids);
    return chat_ids;
};

const createNewChat = (ID: ID_t, name: string, avatar: string, instructions?: string, extra_info?: string, users?: users_t, chats?: chats_t) => {
    const chatID = getChatHistID(ID),
        basicID = getBasicInfoID(ID);
    const chat_basic: IChatBasic = {
        ID: basicID,
        binfo: {
            avatar: avatar,
            name: name,
            instructions: instructions,
            extra_info: extra_info,
        },
        chatID: chatID,
    };
    chats = chats || new Array<chat_t>();
    prependNewChatID(ID);
    putIntoStore(basicID, chat_basic);
    putIntoStore(chatID, chats);
};

const createNewChatIF = (ID: ID_t, name: string, avatar: string, instructions?: string, extra_info?: string, users?: users_t) => {
    if (avatar.length > 3) throw "createNewChatIF: abnormally big avatar : avatar = " + avatar;
    const chat_basic = getChatBasic4ID(ID);
    const chats = getChats4ID(ID);
    if (!chat_basic) createNewChat(ID, name, avatar, instructions, extra_info, users, chats);
};

const deleteChatIF = (ID: ID_t) => {
    const chatID = getChatHistID(ID),
        basicID = getBasicInfoID(ID);
    const chat_basic = getChatBasic4ID(ID);
    const chats = getChats4ID(ID);
    if (chat_basic) removeFromStore(basicID);
    if (chats) removeFromStore(chatID);
};

const updateChat2Storage = (chatobj: IChatsHist) => {
    const ID = chatobj.ID;
    const chatID = getChatHistID(ID),
        basicID = getBasicInfoID(ID);
    const { chats: chat_history, ...rest } = chatobj;
    putIntoStore(chatID, chat_history);
    const chat_basic_info: IChatBasic = Object.assign(rest, { lastMsg: chat_history[chat_history.length - 1], chatID: chatID });
    putIntoStore(basicID, chat_basic_info);
};

const getChatHis4ID = (ID: ID_t): IChatsHist => {
    const chatID = getChatHistID(ID),
        basicID = getBasicInfoID(ID);
    const chat_basic = getFromStore(basicID) as IChatBasic;
    const chats = (getFromStore(chat_basic.chatID) || getFromStore(chatID) || []) as chats_t;
    const chat_hist: IChatsHist = Object.assign(chat_basic, { chats: chats });
    return chat_hist;
};

const getChatBasic4ID = (ID: ID_t) => {
    const basicID = getBasicInfoID(ID);
    const chat_basic = getFromStore(basicID) as IChatBasic;
    return chat_basic;
};

const getChats4ID = (ID: ID_t) => {
    const chatID = getChatHistID(ID);
    const chats = (getFromStore(chatID) || []) as chats_t;
    return chats;
};

const getChatBasic_Chat4ID = (ID: ID_t): [IChatBasic, chats_t] => {
    const chatID = getChatHistID(ID),
        basicID = getBasicInfoID(ID);
    const chat_basic = getFromStore(basicID) as IChatBasic;
    const chats = (getFromStore(chat_basic.chatID) || getFromStore(chatID) || []) as chats_t;
    return [chat_basic, chats];
};

const combineBinfoChats = (chat_basic: IChatBasic, chats: chats_t) => {
    const chat_hist: IChatsHist = Object.assign(chat_basic, { chats: chats });
    return chat_hist;
};

const updateChatBasicChats2Storage = (chat_basic: IChatBasic, chats: chats_t) => {
    const chat_hist = combineBinfoChats(chat_basic, chats);
    console.log("updateChatBasicChats2Storage : ", chat_basic, chats, chat_hist);
    return updateChat2Storage(chat_hist);
};

export { getAllChatIDs, getChatHis4ID, getChatBasic4ID, getChatBasic_Chat4ID, updateChatBasicChats2Storage, createNewChatIF, deleteChatIF, prependOldChatID };
