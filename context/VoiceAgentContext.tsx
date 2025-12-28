"use client";

import React, { createContext, useContext, useState, useRef, useEffect, ReactNode } from "react";
import { RetellWebClient } from "retell-client-js-sdk";

interface VoiceAgentContextType {
    isConnecting: boolean;
    isConnected: boolean;
    error: string | null;
    startCall: () => Promise<void>;
    endCall: () => void;
}

const VoiceAgentContext = createContext<VoiceAgentContextType | undefined>(undefined);

export function VoiceAgentProvider({ children }: { children: ReactNode }) {
    const [isConnecting, setIsConnecting] = useState(false);
    const [isConnected, setIsConnected] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const retellClientRef = useRef<RetellWebClient | null>(null);

    // Initialize client on mount
    useEffect(() => {
        if (typeof window !== "undefined" && !retellClientRef.current) {
            retellClientRef.current = new RetellWebClient();

            retellClientRef.current.on("call_started", () => {
                console.log("Retell: Call started");
                setIsConnecting(false);
                setIsConnected(true);
            });

            retellClientRef.current.on("call_ended", () => {
                console.log("Retell: Call ended");
                setIsConnected(false);
                setIsConnecting(false);
            });

            retellClientRef.current.on("error", (err) => {
                console.error("Retell: Error", err);
                setError("Connection failed");
                setIsConnected(false);
                setIsConnecting(false);
            });
        }
    }, []);

    const startCall = async () => {
        setError(null);
        const agentId = process.env.NEXT_PUBLIC_RETELL_AGENT_ID;

        // Fallback if no keys
        if (!agentId) {
            console.warn("No Agent ID found. Falling back to TTS.");
            const greeting = "Hi, welcome. Please configure my Agent ID to talk to me for real.";
            if ('speechSynthesis' in window) {
                window.speechSynthesis.cancel();
                const u = new SpeechSynthesisUtterance(greeting);
                window.speechSynthesis.speak(u);
            } else {
                alert(greeting);
            }
            return;
        }

        try {
            setIsConnecting(true);

            const response = await fetch("/api/create-web-call", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ agent_id: agentId }),
            });

            if (!response.ok) throw new Error(`Server error: ${response.status}`);

            const data = await response.json();
            if (!data.access_token) throw new Error("No access token returned");

            if (retellClientRef.current) {
                await retellClientRef.current.startCall({
                    accessToken: data.access_token,
                });
            }
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            console.error("Failed to start call:", err);
            setError(err.message || "Failed to connect");
            setIsConnecting(false);
        }
    };

    const endCall = () => {
        retellClientRef.current?.stopCall();
    };

    return (
        <VoiceAgentContext.Provider value={{ isConnecting, isConnected, error, startCall, endCall }}>
            {children}
        </VoiceAgentContext.Provider>
    );
}

export function useVoiceAgent() {
    const context = useContext(VoiceAgentContext);
    if (context === undefined) {
        throw new Error("useVoiceAgent must be used within a VoiceAgentProvider");
    }
    return context;
}
