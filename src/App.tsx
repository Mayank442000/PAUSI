import logo from "./logo.svg";
import styles from "./App.sass";

import { Router, Route } from "@solidjs/router";
import { MetaProvider, Title } from "@solidjs/meta";

import ChatUI from "./Pages/Chat";

function App() {
    return (
        <MetaProvider>
            <Title>PAUSI | Personal Avatar User Space for Immersion</Title>{" "}
            <meta name="description" content="Create and interact with your own personal AI avatars in PAUSI, a user-owned space designed for immersive experiences." />
            <meta
                name="keywords"
                content="PAWS-EE, AI, avatar, personal AI, user-created, virtual character, immersive experience, privacy-focused, data ownership, communication, digital companion"
            />
            <meta name="author" content="Your App Name/Your Company Name" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            {/* Optional: Open Graph tags for social media sharing */}
            <meta property="og:title" content="PAUSI | Personal Avatar User Space for Immersion" />
            <meta property="og:description" content="Create and interact with your own personal AI avatars in PAUSI, a user-owned space designed for immersive experiences." />
            {/* <meta property="og:image" content="URL to your app's logo or a relevant image" /> */}
            <meta property="og:url" content="URL to your app's website" />
            <meta property="og:type" content="website" />
            {/* Optional: Twitter Card tags for Twitter sharing */}
            <meta name="twitter:card" content="summary_large_image" />
            {/* <meta name="twitter:image" content="URL to your app's logo or a relevant image" /> */}
            <meta name="twitter:title" content="PAUSI | Personal Avatar User Space for Immersion" />
            <meta name="twitter:description" content="Create and interact with your own personal AI avatars in PAUSI, a user-owned space designed for immersive experiences." />
            {/* <meta name="twitter:site" content="@YourTwitterHandle" /> */}
            <meta name="Pun" content="PAUSI : PAWS-EE" />
            <ChatUI />;
        </MetaProvider>
    );
}

export default App;
