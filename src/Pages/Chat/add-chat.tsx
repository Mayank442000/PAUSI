import { onMount, Setter } from "solid-js";
import { getRandomBase64 } from "../../Scripts/General/random";
import { createNewChatIF } from "../../Scripts/Chats/processing";

interface IAddNewChat {
    setCurID: Setter<string>;
    refreshIDs: () => void;
}

const AddNewChat = (props: IAddNewChat) => {
    const { setCurID, refreshIDs } = props;
    let id_el: HTMLInputElement | undefined,
        name_el: HTMLInputElement | undefined,
        avatar_el: HTMLInputElement | undefined,
        instructions_el: HTMLTextAreaElement | undefined,
        extra_el: HTMLTextAreaElement | undefined;

    const randomiseID = () => {
        if (id_el == undefined) return;
        const ID = getRandomBase64(32, id_el.value);
        id_el.value = ID;
        return ID;
    };

    const autoAvatar = (name = "") => {
        name = name || (name_el?.value as string);
        let avatar = avatar_el?.value;
        console.log("autoAvatar", avatar, name, avatar_el, avatar || !name || !avatar_el);
        if (avatar || !name || !avatar_el) return;
        if (name.indexOf(" ")) {
            const name_parts = name.split(" ");
            avatar = (name_parts[0][0] + (name_parts?.[1]?.[0] || "") + (name_parts?.[2]?.[0] || "")).toUpperCase();
        } else avatar = name.slice(0, 2);
        console.log(avatar);
        avatar_el.value = avatar;
    };

    const createNewChat = () => {
        const ID = randomiseID(),
            NAME = name_el?.value,
            AVATAR = avatar_el?.value,
            INSTRUCTIONS = instructions_el?.value,
            EXTRA = extra_el?.value;
        if (ID && NAME && AVATAR) {
            createNewChatIF(ID, NAME, AVATAR, INSTRUCTIONS, EXTRA);
            console.log("AddNewChat.createNewChat", ID, NAME, AVATAR, INSTRUCTIONS, EXTRA);
            refreshIDs();
            // setCurID(ID);
        }
    };

    onMount(() => {
        randomiseID();
    });

    return (
        <div id="AddNewChat-div">
            <div id="AddNewChat">
                <div class="new-chat-field">
                    <div class="new-chat-label">Name</div>
                    <input class="new-chat-input" placeholder="Bot Name" onChange={(e) => autoAvatar(e.target.value)} ref={name_el} />
                    {/* value="Rick Sanchez" */}
                </div>
                <div class="new-chat-field">
                    <div class="new-chat-label">Avatar</div>
                    <input class="new-chat-input" placeholder="Bot Initials" maxlength={3} ref={avatar_el} />
                    {/* value="RS" */}
                </div>
                <div class="new-chat-field">
                    <div class="new-chat-label">Instructions</div>
                    <textarea
                        class="new-chat-input"
                        placeholder="Instructions; like:&#10;1. You (Bot) are character 'A' from show 'B' have and live in 'C' and we are 'D'...&#10;2. You (Bot) are a math tutor and help me complete my homework..."
                        ref={instructions_el}
                    >
                        {/* You are Rick Sanchez from Rick and Morty */}
                    </textarea>
                </div>
                <div class="new-chat-field">
                    <div class="new-chat-label">Extra Information</div>
                    <textarea
                        class="new-chat-input"
                        placeholder="Extra Information; like:&#10;1. You (Bot) like to do 'Z' in free time and we also do 'Y' sometimes together...&#10;2. I'm in grade 'Z' and I want answers to be step by step with explanation..."
                        ref={extra_el}
                    >
                        {/* I am Morty */}
                    </textarea>
                </div>
                <div class="new-chat-field">
                    <div class="new-chat-label">ID</div>
                    <input
                        class="new-chat-input"
                        placeholder="Randomly Generated; your input will be treated as part of seed;"
                        ref={id_el}
                        onClick={() => randomiseID()}
                        title="Click to randomise"
                    />
                </div>
                <div class="new-chat-field">
                    <button id="new-chat-butt" onClick={createNewChat}>
                        Create
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddNewChat;
