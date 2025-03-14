import { createResource, createSignal, For, onMount, Show } from "solid-js";
import { assert } from "../../Scripts/error";
// import { getFromStore, putIntoStore } from "../../Scripts/Storage/local-storage";
import Chat, { createChatCard, getRandomChatID } from "./chat";
import AI from "../../Scripts/AI/AI";
import { getChatBasic_Chat4ID, getChats4IDs, setChat, setChatIDs4ChatBlock, updateLastChat } from "../../Scripts/Chats/processing";
import { avatar_t, Chat_t, ChatBlockID_t, ChatIDs_t, Chats_t, IChatInfo, ID_t, name_t } from "../../Scripts/Storage/IDBSchema";
// import { sleep } from "../../Scripts/General/general";

// const sample_chats: Array<IChatCard> = [];
// for (let i = 0; i < 10; i++) {
//     const samp = Object.assign({}, defaultChatCard);
//     if (Math.random() < 0.5) samp.sender = "$user";
//     sample_chats.push(samp);
// }

interface IChatScreen {
    ID: string;
    ai: AI;
    callback: (message_count: number, ID: string) => void;
}

// const defaultChats: IChatsHist = {
//     binfo: { avatar: "MM", name: "Mayank Maurya" },
//     ID: "MM",
//     chats: sample_chats,
// };

const getChatScreenData = async (ID: ID_t) => {
    const { chat_info, chat_block_id, chat_ids } = await getChatBasic_Chat4ID(ID);
    const chats = await getChats4IDs(chat_ids);
    console.log("ChatScreen.getChatScreenData : ", ID, chat_info, chat_block_id, chat_ids, chats);
    return { chat_info, chat_block_id, chat_ids, chats };
};

const ChatScreen = (props: IChatScreen) => {
    const { ID, ai, callback } = props;
    let main_div: HTMLDivElement | undefined; // TODO: Make it reactive
    let chat_body_div: HTMLDivElement | undefined;
    let chat_input_ele: HTMLTextAreaElement | undefined;
    let messages_count: number = 0;

    // const [chat_info, chats] = getChatBasic_Chat4ID(ID);
    // const [chatScreenData] = createResource(ID, getChatScreenData);
    // console.log(JSON.stringify(defaultChats));

    const [getChats, setChats] = createSignal<Chats_t>([]);
    const [getLoaded, setLoaded] = createSignal<boolean>(false);
    let chat_started: boolean = false;
    // delete chats_hist.chats;

    var chat_info: IChatInfo | undefined, chat_block_id: ChatBlockID_t | undefined, chat_ids: ChatIDs_t | undefined, chats: Chats_t | undefined;
    getChatScreenData(ID).then((data) => {
        chat_info = data.chat_info;
        chat_block_id = data.chat_block_id;
        chat_ids = data.chat_ids;
        chats = data.chats;
        setChats(chats);
        setLoaded(true);
        scrollToBottom();
    });

    const resizeTxtFld = (e: InputEvent) => {
        const ele = e.target as HTMLTextAreaElement;
        const data = e.data as string;
        const main_div_height = main_div?.offsetHeight as number,
            ele_height = ele.scrollHeight;
        ele.style.height = "";
        ele.style.height = Math.min(main_div_height * 0.3, ele.scrollHeight) + "px";
    };

    const scrollToBottom = () => chat_body_div?.scrollTo(0, chat_body_div.scrollHeight);

    // console.log("ChatScreen", "chat_info : ", chatScreenData()?.chat_info);
    onMount(async () => scrollToBottom());

    const startChat = () => {
        if (chat_started) return;
        ai.startChat(getChats(), { instructions: chat_info?.instructions, extra_info: chat_info?.extra_info });
    };

    const pushChat = (chat: Chat_t) => {
        setChats([...getChats(), chat]);
        setChat(chat);
        messages_count += 1;
        setChatIDs4ChatBlock(chat_block_id as ChatBlockID_t, chat_ids as ChatIDs_t);
        callback(messages_count, ID);
        chat_ids?.push(chat.chatID);
    };

    const sendMessage = async () => {
        if (chat_input_ele == undefined) return;
        const data = chat_input_ele.value;
        if (data) {
            startChat();
            let new_chat = createChatCard("$user", data, chat_info?.avatar as avatar_t, getRandomChatID(), Date.now());
            // new_chat.message = data;
            // new_chat.sender = "$user"; //Math.random() < 0.5 ? "$user" : "Mayank Maurya";
            pushChat(new_chat);
            console.log("sendMessage.new_chat.user : ", new_chat);
            chat_input_ele.value = "";
            scrollToBottom();
            if (ai) {
                const reply = await ai.sendChat(data);
                // const reply = data;
                new_chat = createChatCard(chat_info?.name as name_t, reply, chat_info?.avatar as avatar_t, getRandomChatID(), Date.now());
                pushChat(new_chat);
                console.log("sendMessage.new_chat.ai : ", new_chat);
                scrollToBottom();
            }
            updateLastChat(chat_info as IChatInfo, new_chat.chatID);
            // updateChatBasicChats2Storage(chat_info as IChatInfo, getChats());
        }
        chat_input_ele.focus();
    };

    const handleKeyDown = (event: KeyboardEvent) => event.key === "Enter" && event.ctrlKey && chat_input_ele && sendMessage();

    return (
        <div id="chat-screen" ref={main_div}>
            <Show when={getLoaded()} keyed>
                <div id="chat-header">
                    <div id="chat-info">
                        <div id="chat-name">{chat_info?.name}</div>
                    </div>
                    <div id="chat-settings">⚙</div>
                </div>
                <div id="chats-body" ref={chat_body_div}>
                    <For each={getChats()}>{(chat_data, i) => <Chat {...chat_data} />}</For>
                </div>
                <div id="chat-footer">
                    <textarea id="chat-input" onInput={resizeTxtFld} onKeyDown={handleKeyDown} ref={chat_input_ele} />
                    <div id="chat-send-div">
                        <div id="chat-send" title="ctrl + enter" onClick={sendMessage}>
                            Send
                        </div>
                    </div>
                </div>
            </Show>
            <Show when={!getLoaded()}>
                <h1 id="loader">Loading Chats...</h1>
            </Show>
        </div>
    );
};

export default ChatScreen;
