"use client";

import { Mic, Phone, Loader2, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useVoiceAgent } from "@/hooks/use-voice-agent";

/**
 * A floating action button that triggers the AI Voice Agent.
 * Uses the Retell AI SDK via a custom hook.
 */
export default function VoiceAgentButton() {
    const { isConnecting, isConnected, startCall, endCall } = useVoiceAgent();

    const handleClick = () => {
        if (isConnected) {
            endCall();
        } else {
            startCall();
        }
    };

    return (
        <motion.button
            onClick={handleClick}
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            transition={{
                type: "spring",
                stiffness: 260,
                damping: 20,
                delay: 1.5
            }}
            className={`fixed bottom-28 right-8 z-[100] w-14 h-14 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(0,0,0,0.2)] transition-all duration-300 group ${isConnected
                    ? "bg-red-600 text-white shadow-[0_0_30px_rgba(220,38,38,0.6)]"
                    : "bg-white text-black hover:shadow-[0_0_30px_rgba(255,255,255,0.6)]"
                }`}
            aria-label={isConnected ? "End Call" : "Talk to AI Agent"}
            disabled={isConnecting}
        >
            <div className="relative flex items-center justify-center w-full h-full">
                <AnimatePresence mode="wait">
                    {isConnecting ? (
                        <motion.div
                            key="loading"
                            initial={{ opacity: 0, rotate: 0 }}
                            animate={{ opacity: 1, rotate: 360 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        >
                            <Loader2 size={24} />
                        </motion.div>
                    ) : isConnected ? (
                        <motion.div
                            key="active"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0 }}
                        >
                            <X size={24} />
                        </motion.div>
                    ) : (
                        <motion.div
                            key="idle"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0 }}
                        >
                            <Mic size={24} className="group-hover:scale-110 transition-transform duration-300" />
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Ping animation when idle/ready */}
                {!isConnected && !isConnecting && (
                    <span className="absolute inset-0 rounded-full bg-white/30 animate-ping opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                )}

                {/* Ripple animation when connected */}
                {isConnected && (
                    <>
                        <span className="absolute inset-0 rounded-full border-2 border-red-400 animate-ping opacity-75"></span>
                        <span className="absolute inset-0 rounded-full border border-red-500 animate-[ping_1.5s_ease-in-out_infinite] opacity-50 delay-150"></span>
                    </>
                )}
            </div>

            {/* Tooltip */}
            <span className="absolute right-full mr-4 px-4 py-2 bg-neutral-900 border border-white/10 text-white text-[10px] font-bold uppercase tracking-[0.2em] rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0 whitespace-nowrap pointer-events-none shadow-2xl backdrop-blur-md">
                {isConnected ? "End Call" : isConnecting ? "Connecting..." : "Talk to AI Agent"}
            </span>
        </motion.button>
    );
}
