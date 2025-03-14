import { createEffect, createResource, mergeProps, on, Setter } from "solid-js";
import { getChat4ID, getChatInfo4ID } from "../../Scripts/Chats/processing";
import { SolidMarkdown } from "solid-markdown";
import { ChatID_t } from "../../Scripts/Storage/IDBSchema";

interface IChatCard {
    ID: string;
    setID: Setter<string>;
    trgrs: () => number;
}

// const defaultChatCard: IChatCard = {
//     avatar: "MM",
//     name: "Mayank Maurya",
//     message: "Hello, how are you?",
// };

const getChatCardData = async (ID: string) => {
    const chat_info = await getChatInfo4ID(ID);
    const last_chat = chat_info.lastChatID ? await getChat4ID(chat_info.lastChatID as ChatID_t) : null;
    const last_message = last_chat?.message || "";
    console.log("getChatCardData", ID, chat_info, last_chat, last_message);
    return { chat_info, last_message };
};

const chatCard = (props: IChatCard) => {
    const { ID, setID, trgrs } = props;
    // props = mergeProps(defaultChatCard, props);
    // const { avatar, name, message } = props;

    const [chatCardData, { refetch }] = createResource(ID, getChatCardData);

    console.log("chatCard : ", props, chatCardData(), trgrs);
    createEffect(on(trgrs, () => refetch()));

    return (
        <div class="chat-card" onClick={() => setID(ID)}>
            <div class="chat-card__avatar-div">
                <div class="chat-card__avatar">
                    <div>{chatCardData()?.chat_info.avatar}</div>
                </div>
            </div>
            <div class="chat-card__content">
                <div class="chat-card__name" title={chatCardData()?.chat_info.name}>
                    {chatCardData()?.chat_info.name}
                </div>
                <div class="chat-card__message" title={chatCardData()?.last_message}>
                    <SolidMarkdown>{chatCardData()?.last_message.slice(0, 128)}</SolidMarkdown>
                </div>
            </div>
        </div>
    );
};

export default chatCard;
