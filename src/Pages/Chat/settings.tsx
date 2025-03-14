import { createSignal } from "solid-js";
import { getFromStore, putIntoStore } from "../../Scripts/Storage/local-storage";

const Settings = () => {
    let gemini_api_key = (getFromStore("GEMINI_API_KEY") as string) || "";
    let inp_ref: HTMLInputElement | undefined;
    const [getAPIkey, setAPIkey] = createSignal<string>(gemini_api_key);
    const updateGeminiAPIkey = () => {
        if (inp_ref == undefined) return;
        gemini_api_key = inp_ref.value;
        putIntoStore("GEMINI_API_KEY", gemini_api_key);
        setAPIkey(gemini_api_key);
    };
    return (
        <div id="Settings">
            <div id="api">
                <div title={"Gemini API KEY : " + getAPIkey()}> Gemini API key</div>
                <input id="APIkeyInp" placeholder="Please enter Gemini API key" value={getAPIkey()} ref={inp_ref} />
                <button id="APIkeyBut" onClick={() => updateGeminiAPIkey()}>
                    Set
                </button>
            </div>
            <div id="info">
                <div id="how-to-api">
                    Q. How to get Gemini API key?
                    <br />
                    Ans. Please visit <a href="https://aistudio.google.com/app/apikey">Google AI Studio</a> to get the api key and for help watch this{" "}
                    <a href="https://youtube.com/clip/UgkxrUJwurTnmOxFOpIHZ3wgW5M4nzTb4VAU?si=OdHfkYvxz16PL6rA">YouTube video</a>
                </div>
                <div id="privacy">
                    Q. Where is the key stored?
                    <br /> Ans. API key is safely stored locally in your browser's local storage and not shared anywhere
                </div>
            </div>
        </div>
    );
};

export default Settings;
