"use client";

import ProjectForm from "@/components/ProjectForm";
import { motion } from "framer-motion";

export default function StartProjectPage() {
    return (
        <div className="min-h-screen bg-black text-white selection:bg-blue-500/30">
            <div className="container mx-auto px-4 py-32">
                <div className="max-w-4xl mx-auto">

                    {/* Header */}
                    <div className="text-center mb-16 space-y-4">
                        <motion.h1
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-4xl md:text-6xl font-black font-michroma uppercase"
                        >
                            Start Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">Project</span>
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.1 }}
                            className="text-neutral-400 text-lg md:text-xl max-w-2xl mx-auto"
                        >
                            Tell me about your vision. I&apos;ll help you build a high-performance, stunning digital experience.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="pt-4"
                        >
                            <a
                                href="/Andrea_Agency_Reference.pdf"
                                download
                                className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 hover:border-blue-500/50 transition-all text-sm font-medium text-neutral-300 hover:text-white group"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-400 group-hover:scale-110 transition-transform"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" /><polyline points="14 2 14 8 20 8" /><path d="M12 18v-6" /><path d="m9 15 3 3 3-3" /></svg>
                                Download Reference Guide (PDF)
                            </a>
                        </motion.div>
                    </div>

                    <ProjectForm />

                </div>
            </div>
        </div>
    );
}
