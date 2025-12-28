"use client";

import { useVoiceAgent as useVoiceAgentContext } from "@/context/VoiceAgentContext";

/**
 * Re-export the hook from context for backward compatibility
 */
export function useVoiceAgent() {
    return useVoiceAgentContext();
}
