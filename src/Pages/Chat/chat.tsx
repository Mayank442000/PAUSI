import { mergeProps } from "solid-js";
import { SolidMarkdown } from "solid-markdown";
// import { IChatCard } from "../../Scripts/Chats/processing";
import { getDTstring } from "../../Scripts/time";
import { ChatID_t, IChat } from "../../Scripts/Storage/IDBSchema";
import { getRandomBase64 } from "../../Scripts/General/random";

// import { markdown } from "markdown";
// import { SolidMarkdown } from "solid-markdown";

// TODO: Remove ?

// const defaultChatCard: IChatCard = {
//     avatar: "MM",
//     message: `Jo hobby vala tha vo resume ni kiya kyuki time hi ni mila in
//                 sbme toh tko kya bolti us kam k liye, mne socha ye jb app bn
//                 jaegi tb dekhti hu...fri tk kr deti hu ye kam fr hobby vala
//                 4 days m wrap kr denge kyuki kuch kuch chizein toh smjh ari
//                 thi aur exact replicate kr skte h hum`,
//     time: 0, //"23:11",
//     sender: "Mayank Maurya",
// };

const getRandomChatID = (): ChatID_t => getRandomBase64(32);

const createChatCard = (sender: string, message: string, avatar: string, chatID?: ChatID_t, time?: number): IChat => {
    time = time || Date.now();
    const chat: IChat = {
        chatID: chatID || getRandomChatID(),
        sender: sender,
        message: message,
        avatar: avatar,
        time_ms: time,
    };
    return chat;
};

const Chat = (props: IChat) => {
    // props = mergeProps(props);
    const { chatID, avatar, message, time_ms, sender } = props;
    const sentByMe = sender === "$user";
    return (
        <div class="chat-space" classList={{ "by-user": sentByMe }}>
            <div class="chat-block" classList={{ "by-user": sentByMe }}>
                <div class="sender-data" classList={{ "by-user": sentByMe }}>
                    <div class="sender-avatar-div">
                        <div class="sender-avatar">{avatar}</div>
                    </div>
                    <div class="chat-triangle-div" classList={{ "by-user": sentByMe }}>
                        <div class="chat-triangle" classList={{ "by-user": sentByMe }}></div>
                    </div>
                </div>
                <div class="chat-data">
                    <div class="chat-body">
                        {/* {message} */}
                        <SolidMarkdown class="chat-markdown">{message}</SolidMarkdown>
                    </div>
                    <div class="chat-time">{getDTstring(time_ms)}</div>
                </div>
            </div>
        </div>
    );
};

export default Chat;
export { createChatCard, getRandomChatID };
// export { defaultChatCard, createChatCard };
