import { Setter } from "solid-js";
import { IInstructExta } from "../Chats/processing";
import GeminiAI from "./gemini";
import { IChat } from "../Storage/IDBSchema";

class AI {
    #model: GeminiAI; // | ChatGPT | etc
    #setAIloaded: Setter<boolean>;
    constructor(setAIloaded: Setter<boolean>, model: GeminiAI | undefined = undefined) {
        this.#model = model || new GeminiAI(setAIloaded);
        this.#setAIloaded = setAIloaded;
        this.checkAILoaded();
    }

    checkAILoaded() {
        return this.#model.checkAILoaded();
    }

    refresh() {
        this.#model.refresh();
    }

    async sendText(prompt: string, history: Array<IChat>): Promise<string> {
        return await this.#model.sendText(prompt, history);
    }

    startChat(chat_history: Array<IChat> = [], instruct_extra: IInstructExta = {}) {
        return this.#model.startChat(chat_history, instruct_extra);
    }

    async sendChat(prompt: string, auto_create: boolean = false) {
        return await this.#model.sendChat(prompt, auto_create);
    }

    async streamChat(prompt: string, auto_create: boolean = false) {
        return await this.#model.streamChat(prompt, auto_create);
    }
}

export default AI;
export { GeminiAI };
