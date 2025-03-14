const HomeChatUI = () => {
    return (
        <div id="Home-Chat-UI">
            <div id="Header">
                <h1 onClick={() => window.location.reload()} title="Welcome to PAUSI; click to refresh">
                    Welcome to PAUSI
                </h1>
            </div>
            <div id="About">
                <h2>Create Your Personalized AI Chats</h2>
                <p>PAUSI lets you unleash your creativity and build your own AI chat bots! Design AI personalities for any purpose you can imagine:</p>
                <div>
                    <ol>
                        <li>
                            <span class="bullet-head">Coding Companion:</span> Create an AI to help you with programming questions and code snippets.
                        </li>
                        <li>
                            <span class="bullet-head">Creative Partner:</span> Brainstorm ideas, write stories, or compose music with an AI collaborator.
                        </li>
                        <li>
                            <span class="bullet-head">Character Role-Play:</span> Design AI bots based on your favorite characters for fun and engaging
                            conversations.
                        </li>
                        <li>
                            <span class="bullet-head">Personal Tutor:</span> Build an AI to help you learn new subjects or practice skills.
                        </li>
                        <li>
                            <span class="bullet-head">And Much More!</span> The possibilities are limitless.
                        </li>
                    </ol>
                </div>
            </div>
            <div id="Get-Started">
                <h2>Get Started in Minutes:</h2>
                <p>Remember if you feel lost you can come back to this by clicking "Pausi" icon in top left</p>
                <ol>
                    <li>
                        <span class="bullet-head">Explore the Panel:</span> On the left, you'll see the <span class="highlights">Panel</span>. This is your gateway
                        to PAUSI's features.
                    </li>
                    <li>
                        <span class="bullet-head">Setup your AI:</span> Currently PAUSI works only on Gemini which you may setup after clicking on "Menu" on top of
                        left pannel
                    </li>
                    <li>
                        <span class="bullet-head">Click “+ Add New Chat”:</span> Find the <span class="highlights">“+ Add New Chat”</span> button in the Menu and
                        click it. This will take you to the AI bot creation page.
                    </li>
                    <li>
                        <span class="bullet-head">Customize Your Bot:</span> On the “Create New Chat” screen, you can:
                        <ul>
                            <li>
                                Give your bot a <span class="highlights">Name</span> and <span class="highlights">Avatar</span>.
                            </li>
                            <li>
                                Define its <span class="highlights">Instructions</span> - tell the AI how to behave and what its purpose is. Be creative and
                                specific!
                            </li>
                            <li>
                                Add <span class="highlights">Extra Information</span> to give your bot more context.
                            </li>
                        </ul>
                    </li>
                    <li>
                        <span class="bullet-head">Click “Create”:</span> Once you're happy with your bot's configuration, click the{" "}
                        <span class="highlights">“Create”</span> button to start chatting!
                    </li>
                    <li>
                        <span class="bullet-head">Chat and Have Fun!</span>
                    </li>
                </ol>
            </div>
            <div id="left-panel-overview">
                <h2> &lt;- Quick Left Panel Overview:</h2>
                <ul>
                    <li>
                        <span class="bullet-head">Profile:</span> Access your settings and personal information.
                    </li>
                    <li>
                        <span class="bullet-head">Search:</span> Find past conversations quickly.
                    </li>
                    <li>
                        <span class="bullet-head">Chat List:</span> See and manage your existing chats.
                    </li>
                    <li>
                        <span class="bullet-head">Add New Chat:</span> Create new AI bots and personalized chat experiences.
                    </li>
                </ul>
            </div>
            <div id="ready">
                <h2>Ready to Begin?</h2>
                <p>
                    Start exploring PAUSI and build your own unique AI chat experiences today! Click <b>“+ Add New Chat”</b> in the menu to get started.
                </p>
            </div>
            <hr />
        </div>
    );
};

export default HomeChatUI;
