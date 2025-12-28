
import { RetellWebClient } from "retell-client-js-sdk";

// Initialize the client (ensure this runs only in browser environment if needed, or lazily)
let retellWebClient: RetellWebClient | null = null;

/**
 * Triggers the Voice Agent logic.
 * Tries to connect to Retell AI if configured.
 * Falls back to browser TTS if configuration is missing or connection fails.
 */
export const triggerVoiceAgent = async () => {
    // 1. Check for Retell Configuration
    // Note: We access the env var here. In Next.js client-side, it must start with NEXT_PUBLIC_
    const agentId = process.env.NEXT_PUBLIC_RETELL_AGENT_ID;

    if (agentId) {
        try {
            if (!retellWebClient) {
                retellWebClient = new RetellWebClient();

                // Optional: Setup event listeners
                retellWebClient.on("call_started", () => {
                    console.log("Retell call started");
                });
                retellWebClient.on("call_ended", () => {
                    console.log("Retell call ended");
                });
                retellWebClient.on("error", (error) => {
                    console.error("Retell error:", error);
                    retellWebClient?.stopCall();
                });
            }

            // Fetch access token from backend
            const response = await fetch("/api/create-web-call", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ agent_id: agentId })
            });

            if (!response.ok) {
                throw new Error(`Failed to fetch access token: ${response.statusText}`);
            }

            const data = await response.json();

            if (!data.access_token) {
                throw new Error("No access token returned from backend");
            }

            await retellWebClient.startCall({
                accessToken: data.access_token,
            });

            console.log("Voice Agent connected via Retell AI");
            return; // Success, exit function
        } catch (err) {
            console.error("Retell AI connection failed, falling back to TTS:", err);
            // Fall through to TTS
            alert("Could not connect to AI Agent. Falling back to demo mode.");
        }
    } else {
        console.log("No NEXT_PUBLIC_RETELL_AGENT_ID found. Using TTS demo.");
    }

    // 2. Fallback TTS Logic
    const greeting = "Hi, welcome to Andrea AI Agency. I’m here to help you with website design, AI solutions, and project guidance.";

    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(greeting);
        const voices = window.speechSynthesis.getVoices();

        const preferredVoice = voices.find(voice =>
            voice.name.includes("Google US English") ||
            voice.name.includes("Samantha") ||
            voice.name.includes("Microsoft Zira")
        );

        if (preferredVoice) utterance.voice = preferredVoice;
        utterance.rate = 1.0;

        window.speechSynthesis.speak(utterance);
    } else {
        alert(greeting);
    }
};
