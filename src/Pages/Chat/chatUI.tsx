import { Accessor, createResource, createSignal, For, onMount, Setter, Show } from "solid-js";
import AI from "../../Scripts/AI/AI";
import "./ChatUI.sass";
import ChatCard from "./chat-cards";
import ChatScreen from "./chat-screen";
import { getAllChatInfoIDs, prependChatID } from "../../Scripts/Chats/processing";
import Settings from "./settings";
import AddNewChat from "./add-chat";
import HomeChatUI from "./home-chat-ui";
import { ID_t } from "../../Scripts/Storage/IDBSchema";

interface IChatUI {}

const ChatUI = () => {
    // const [ChatUIData] = createResource(getChatUIData);
    const [getCurID, setCurID] = createSignal("Home-Chat-UI"); // "Add-New-Chat" "Settings" "MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM"
    const [getAIloaded, setAIloaded] = createSignal(false);
    const [getIDs, setIDs] = createSignal<Array<string>>([]);
    const id_trgrs: { [key: string]: { getNum: Accessor<number>; setNum: Setter<number> } } = {};

    const refreshIDs = async (ID?: ID_t) => {
        console.log("ChatUI refreshIDs", ID, ID ? prependChatID : getAllChatInfoIDs);
        const chat_ids = (ID ? await prependChatID(ID) : await getAllChatInfoIDs()) || [];
        console.log("ChatUI refreshIDs", ID, getIDs(), chat_ids);
        setIDs(chat_ids);
        return chat_ids;
    };

    const createTrgr4ID = (ID: ID_t) => {
        const [getNum, setNum] = createSignal<number>(1);
        id_trgrs[ID] = { getNum, setNum };
    };

    const createIDTrgrs = async () => {
        const all_ids = await getAllChatInfoIDs();
        console.log("ChatUI.refreshCallBack ", all_ids);
        for (let _id of all_ids) {
            // console.log("ChatUI.refreshCallBack ", _id);
            createTrgr4ID(_id);
            // console.log("get : ", getNum());
        }
        setIDs(all_ids);
    };

    const refreshCallBack = async (ID: ID_t) => {
        console.log("ChatUI.refreshCallBack ");
        createTrgr4ID(ID);
        const all_ids = await refreshIDs(ID);
        console.log("ChatUI.refreshCallBack ", getIDs(), typeof all_ids);
        console.log("ChatUI.refreshCallBack ", all_ids, "|", id_trgrs);
    };

    onMount(async () => {
        await createIDTrgrs();
        console.log("ChatUI mounted", getIDs()); //, await getAllChatInfoIDs());
    });

    const chattCallBack = async (message_count: number, ID: string) => {
        if (ID == "PAUSI" && message_count < 0) {
            // window.location.reload();
            setCurID("Home-Chat-UI");
            await refreshIDs();
            return;
        }
        if (true || message_count == 1) {
            const chat_ids = await refreshIDs(ID);
            console.log("ChatUI chattCallBack", message_count, ID, chat_ids);
        }
        const { getNum, setNum } = id_trgrs[ID];
        setNum(getNum() + 1);
        console.log("ChatUI chattCallBack", message_count, ID, getNum());
    };

    // console.log("ChatUI", ChatUIData(), getIDs());
    // createNewChatIF("MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM", "MM", "Mayank Maurya");
    const ai = new AI(setAIloaded);
    return (
        <div id="MainChatDiv">
            <div id="left-panel" class="panel">
                <div id="Menu">
                    <span title="Click to refresh" onClick={() => window.location.reload()}>
                        PAUSI
                    </span>
                    <span title="configure" onClick={() => setCurID("Settings")}>
                        Menu
                    </span>
                </div>
                <div id="search" title="Under development">
                    <input id="search-input" placeholder="search feature is under development" disabled />
                </div>
                <div id="chats">
                    {/* TODO: ChatList */}
                    <For each={getIDs()}>{(id, ind) => <ChatCard ID={id} setID={setCurID} trgrs={id_trgrs[id]?.getNum} />}</For>
                </div>
                <div id="new-chat-div">
                    <div id="new-chat" onClick={() => setCurID("Add-New-Chat")}>
                        + Add New Chat
                    </div>
                </div>
            </div>
            <div id="right-panel" class="panel">
                <Show when={getAIloaded() && getCurID().length === 32 && getCurID()} keyed>
                    <ChatScreen ai={ai} ID={getCurID()} callback={chattCallBack} />
                </Show>
                <Show when={!(getAIloaded() || ["Home-Chat-UI"].includes(getCurID())) || getCurID() === "Settings"} keyed>
                    <Settings />
                </Show>
                <Show when={getAIloaded() && getCurID() === "Add-New-Chat"} keyed>
                    <AddNewChat refreshCallBack={refreshCallBack} setCurID={setCurID} />
                </Show>
                <Show when={getCurID() === "Home-Chat-UI"} keyed>
                    <HomeChatUI />
                </Show>
                {/* {
                    if(getCurID().length === 32)
                        <ChatScreen ai={ai} ID={getCurID()} />
                } */}
            </div>
        </div>
    );
};

export default ChatUI;
