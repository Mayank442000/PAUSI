import { ChatSession, Content, GenerativeModel, GoogleGenerativeAI, Part, StartChatParams } from "@google/generative-ai";
// import { getEnvVar } from "../Storage/envs";
import { IInstructExta } from "../Chats/processing";
import { getFromStore } from "../Storage/local-storage";
import { IChat } from "../Storage/IDBSchema";
import { Setter } from "solid-js";

class GeminiAI {
    #GEMINI_API_KEY: string;
    #genAI: GoogleGenerativeAI;
    #model_name: string;
    #model: GenerativeModel;
    #chat: ChatSession | undefined;
    #setAIloaded: Setter<boolean>;

    constructor(setAIloaded: Setter<boolean>, api_key: string = "", model_name: string = "") {
        this.#GEMINI_API_KEY = api_key || getFromStore("GEMINI_API_KEY"); //getEnvVar("GEMINI_API_KEY");
        this.#model_name = model_name || "gemini-2.0-flash-lite";
        this.#genAI = new GoogleGenerativeAI(this.#GEMINI_API_KEY);
        this.#model = this.#genAI.getGenerativeModel({ model: this.#model_name });
        this.#setAIloaded = setAIloaded;
        this.checkAILoaded();
        console.log("GeminiAI.constructor : ", this.#GEMINI_API_KEY, this.#model_name, this.#genAI, this.#model);
    }

    checkAILoaded() {
        if (this.#GEMINI_API_KEY && this.#genAI && this.#model_name && this.#model) {
            this.#setAIloaded(true);
            return true;
        }
        this.#setAIloaded(false);
        return false;
    }

    refresh(api_key: string = "", model_name: string = "") {
        this.#GEMINI_API_KEY = api_key || getFromStore("GEMINI_API_KEY") || this.#GEMINI_API_KEY; //getEnvVar("GEMINI_API_KEY");
        this.#model_name = model_name || this.#model_name || "gemini-2.0-flash-lite";
        this.#genAI = new GoogleGenerativeAI(this.#GEMINI_API_KEY);
        this.#model = this.#genAI.getGenerativeModel({ model: this.#model_name });
        console.log("GeminiAI.constructor : ", this.#GEMINI_API_KEY, this.#model_name, this.#genAI, this.#model);
    }

    async sendText(prompt: string, history: Array<IChat>): Promise<string> {
        const result = await this.#model.generateContent([prompt]);
        const text_response = result.response.text();
        console.log("prompt: ", prompt, "\nreply: ", text_response);
        return text_response;
    }

    startChat(chat_history: Array<IChat> = [], instruct_extra: IInstructExta = {}) {
        const history = new Array<Content>();
        for (let chat of chat_history) {
            history.push({
                role: chat.sender == "$user" ? "user" : "model", // ["function","system"]
                parts: [{ text: chat.message as string }],
            });
        }
        const instructs = []; //new Array<string>();
        if (instruct_extra?.instructions) instructs.push({ text: "Instructions:-\n" + instruct_extra.instructions });
        if (instruct_extra?.extra_info) instructs.push({ text: "Extra Info:-\n" + instruct_extra.extra_info });
        const chat_param: StartChatParams = {
            history: history,
            systemInstruction: { role: "system", parts: instructs },
        };
        console.log("GeminiAI.startChat.chat_param : ", chat_param);
        this.#chat = this.#model.startChat(chat_param);
    }

    chatChecking = (auto_create: boolean = true) => {
        if (this.#chat == undefined) {
            if (auto_create) this.startChat();
            else throw "GeminiAI.sendChat : Chat doesn't exists";
        }
    };

    async sendChat(prompt: string, auto_create: boolean = true) {
        this.chatChecking(auto_create);
        if (this.#chat == undefined) throw "GeminiAI.sendChat : Chat doesn't exists event after attempting to create one";
        let result = await this.#chat.sendMessage(prompt);
        const text_response = result.response.text();
        console.log("prompt: ", prompt, "\nreply: ", text_response);
        return text_response;
    }

    async streamChat(prompt: string, auto_create: boolean = true) {
        this.chatChecking(auto_create);
        if (this.#chat == undefined) throw "GeminiAI.sendChat : Chat doesn't exists event after attempting to create one";
        const result = await this.#chat.sendMessageStream(prompt);
        const stream = result.stream;
        return stream;
    }
}

export default GeminiAI;
