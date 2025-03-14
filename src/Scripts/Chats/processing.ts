import IndexDBInstance from "../Storage/index-db";
import {
    ID_t,
    ChatInfoID_t,
    ChatInfoIDs_t,
    ChatID_t,
    ChatBlockID_t,
    IChat,
    User_t,
    IChatInfo,
    Chat_t,
    Chats_t,
    ChatIDs_t,
    IChatBlock,
    IAllChatsIDs,
    keys_t,
} from "../Storage/IDBSchema";
import { awaitAll } from "../General/general";

export interface IInstructExta {
    instructions?: string;
    extra_info?: string;
}

export interface IChatsHist extends IChatInfo {
    chat_ids: ChatIDs_t;
}

const getChatInfoID = (ID: ID_t): ChatInfoID_t => ID + (ID.slice(-6) != "_INFO" ? "_INFO" : "");
const getChatBlockID = (ID: ID_t): ChatBlockID_t => ID + (ID.slice(-6) != "_CHATS" ? "_CHATS" : "");

const getAllChatInfoIDs = async (): Promise<ChatInfoIDs_t> => ((await IndexDBInstance.get("ALL_CHAT_IDS", "all_chat_ids")) as IAllChatsIDs)?.IDs || [];
const putAllChatIDs = async (IDs: ChatInfoIDs_t) => (await IndexDBInstance.put("ALL_CHAT_IDS", { IDs }, "all_chat_ids")) as keys_t;

const delChatID = async (ID: ID_t, silent: boolean = true) => {
    const chat_ids = await getAllChatInfoIDs();
    const ind = chat_ids.indexOf(ID);
    // console.log("delChatID", ID, ind, chat_ids);
    if (ind === -1)
        if (silent) return;
        else throw "delChatID: ID not found : ID = " + ID;
    chat_ids.splice(ind, 1);
    putAllChatIDs(chat_ids);
    // console.log("delChatID", ID, chat_ids);
    return chat_ids;
};

const prependNewChatID = async (ID: string, silent: boolean = true) => {
    const chat_ids = await getAllChatInfoIDs();
    if (chat_ids.indexOf(ID) !== -1)
        if (silent) return;
        else throw "prependNewChatID: ID repeated : ID = " + ID;
    chat_ids.unshift(ID);
    putAllChatIDs(chat_ids);
    return chat_ids;
};

const prependChatID = async (ID: string) => {
    const chat_ids = await getAllChatInfoIDs();
    const ind = chat_ids.indexOf(ID);
    if (ind != -1) chat_ids.splice(ind, 1);
    chat_ids.unshift(ID);
    putAllChatIDs(chat_ids);
    return chat_ids;
};

const prependOldChatID = async (ID: ID_t, silent: boolean = true) => {
    console.log("prependOldChatID", ID);
    const chat_ids = await getAllChatInfoIDs();
    console.log("prependOldChatID", ID, chat_ids);
    const ind = chat_ids.indexOf(ID);
    console.log("prependOldChatID", ID, chat_ids);
    if (ind === -1)
        if (silent) return;
        else throw "prependOldChatID: ID not found : ID = " + ID;
    chat_ids.splice(ind, 1);
    chat_ids.unshift(ID);
    putAllChatIDs(chat_ids);
    return chat_ids;
};

const createNewChat = async (ID: ID_t, name: string, avatar: string, instructions?: string, extra_info?: string, users?: User_t, chats_ids?: ChatIDs_t) => {
    const chatBlockID = getChatBlockID(ID),
        chatInfoID = getChatInfoID(ID);
    const chat_info: IChatInfo = {
        ID: chatInfoID,
        avatar: avatar,
        name: name,
        instructions: instructions,
        extra_info: extra_info,
        chatBlockID: chatBlockID,
    };
    chats_ids = chats_ids || new Array<ChatID_t>();
    const chat_block: IChatBlock = { ChatBlockID: chatBlockID, chat_ids: chats_ids };
    prependNewChatID(ID);
    console.log("createNewChat", ID, name, avatar, instructions, extra_info, users, chats_ids, chatInfoID, chatBlockID);
    await awaitAll(IndexDBInstance.put("ChatInfo", chat_info), IndexDBInstance.put("ChatBlocks", chat_block));
};

const createNewChatIF = async (ID: ID_t, name: string, avatar: string, instructions?: string, extra_info?: string, users?: User_t, silent: boolean = true) => {
    if (avatar.length > 3)
        if (silent) return;
        else throw "createNewChatIF: abnormally big avatar : avatar = " + avatar;
    const chatInfoID = getChatInfoID(ID);
    // chats = await getChatIDs4ID(ID);
    // console.log("createNewChatIF", ID, name, avatar, instructions, extra_info, users, chats, await IndexDBInstance.keyExists("ChatInfo", chatInfoID));
    if (!(await IndexDBInstance.keyExists("ChatInfo", chatInfoID))) await createNewChat(ID, name, avatar, instructions, extra_info, users, await getChatIDs4ID(ID));
};

const getChat4ID = async (chatID: ChatID_t): Promise<Chat_t> => (await IndexDBInstance.get("Chats", chatID)) as Chat_t;
const getChats4IDs = async (chatIDs: ChatIDs_t): Promise<Chats_t> => (await IndexDBInstance.gets("Chats", chatIDs)) as Chats_t;

const setChat = async (chat: IChat) => {
    IndexDBInstance.put("Chats", chat);
    return chat.chatID;
};

const getChatsIDs4ChatBlock = async (chat_block_id: ChatBlockID_t): Promise<ChatIDs_t> => ((await IndexDBInstance.get("ChatBlocks", chat_block_id)) as IChatBlock)?.chat_ids;
const setChatIDs4ChatBlock = async (chat_block_id: ChatBlockID_t, chat_ids: ChatIDs_t) => IndexDBInstance.put("ChatBlocks", { chat_ids, ChatBlockID: chat_block_id });
const getChatIDs4ID = async (ID: ID_t): Promise<ChatIDs_t> => {
    try {
        return await getChatsIDs4ChatBlock(getChatBlockID(ID));
    } catch {
        return [];
    }
};

const deleteChatBlock = async (chat_block_id: ChatBlockID_t) => {
    if (!chat_block_id) return;
    const chat_ids = await getChatsIDs4ChatBlock(chat_block_id);
    return await awaitAll(IndexDBInstance.del("ChatBlocks", chat_block_id), IndexDBInstance.dels("Chats", chat_ids));
};

const deleteChatIF = async (ID: ID_t, silent: boolean = true) => {
    const chatInfoID = getChatInfoID(ID);
    const chat_info = await getChatInfo4ID(ID);
    return await awaitAll(IndexDBInstance.del("ChatInfo", chatInfoID), deleteChatBlock(chat_info?.chatBlockID), delChatID(ID, silent));
};

const updateChat2Storage = (chatobj: IChatsHist) => {
    const ID = chatobj.ID;
    const chatBlockID = getChatBlockID(ID),
        chatInfoID = getChatInfoID(ID);
    const { chat_ids, ...rest } = chatobj;
    setChatIDs4ChatBlock(chatBlockID, chat_ids);
    const chat_basic_info: IChatInfo = Object.assign(rest, { lastMsg: chat_ids[chat_ids.length - 1], chatBlockID: chatBlockID });
    IndexDBInstance.put("ChatInfo", chat_basic_info);
};

const getChatHis4ID = async (ID: ID_t): Promise<IChatsHist> => {
    const chatBlockID = getChatBlockID(ID),
        chatInfoID = getChatInfoID(ID);
    const chat_info = (await IndexDBInstance.get("ChatInfo", chatInfoID)) as IChatInfo;
    const chats_ids: ChatIDs_t = await getChatsIDs4ChatBlock(chat_info.chatBlockID || chatBlockID); // (getFromStore(chat_info.chatBlockID) || getFromStore(chatBlockID) || []) as ChatIDs_t;
    const chat_hist: IChatsHist = Object.assign(chat_info, { chat_ids: chats_ids });
    return chat_hist;
};

const getChatInfo4ID = async (ID: ID_t): Promise<IChatInfo> => {
    const chatInfoID = getChatInfoID(ID);
    const chat_basic = (await IndexDBInstance.get("ChatInfo", chatInfoID)) as IChatInfo;
    return chat_basic;
};

const getChatBasic_Chat4ID = async (ID: ID_t): Promise<{ chat_info: IChatInfo; chat_block_id: ChatBlockID_t; chat_ids: ChatIDs_t }> => {
    const chatBlockID = getChatBlockID(ID),
        chatInfoID = getChatInfoID(ID);
    const chat_info = (await IndexDBInstance.get("ChatInfo", chatInfoID)) as IChatInfo;
    const chat_block_id = chat_info.chatBlockID || chatBlockID;
    const chat_ids: ChatIDs_t = await getChatsIDs4ChatBlock(chat_block_id);
    return { chat_info, chat_block_id, chat_ids };
};

const combineBinfoChats = (chat_basic: IChatInfo, chat_ids: ChatIDs_t) => {
    const chat_hist: IChatsHist = Object.assign(chat_basic, { chat_ids: chat_ids });
    return chat_hist;
};

const updateChatBasicChats2Storage = (chat_basic: IChatInfo, chat_ids: ChatIDs_t) => {
    const chat_hist = combineBinfoChats(chat_basic, chat_ids);
    console.log("updateChatBasicChats2Storage : ", chat_basic, chat_ids, chat_hist);
    return updateChat2Storage(chat_hist);
};

const updateLastChat = (chat_info: IChatInfo, last_message_id: ChatID_t) => {
    const new_chat_info: IChatInfo = Object.assign(chat_info, { lastChatID: last_message_id });
    IndexDBInstance.put("ChatInfo", new_chat_info);
};

export {
    getAllChatInfoIDs,
    // getChatHis4ID,
    getChatInfo4ID,
    getChatBasic_Chat4ID,
    // updateChatBasicChats2Storage,
    createNewChatIF,
    deleteChatIF,
    // prependOldChatID,
    getChat4ID,
    getChats4IDs,
    setChat,
    setChatIDs4ChatBlock,
    updateLastChat,
    prependOldChatID,
    prependChatID,
    // putAllChatIDs, // TODO: Remove this
};
