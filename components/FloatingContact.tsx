"use client";

import { Mail } from "lucide-react";
import { motion } from "framer-motion";

/**
 * A floating action button (FAB) that opens the default email client.
 * Pre-fills recipient, subject and body for a premium user experience.
 */
export default function FloatingContact() {
    const email = "zokuai7@gmail.com";
    const subject = encodeURIComponent("Project Inquiry - [Your Name]");
    const body = encodeURIComponent("Hi Andrea,\n\nI'm interested in starting a project and would like to discuss more details...\n\nBest regards,\n[Your Name]");

    const gmailLink = `https://mail.google.com/mail/?view=cm&fs=1&to=${email}&su=${subject}&body=${body}`;

    return (
        <motion.a
            href={gmailLink}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            whileHover={{ scale: 1.1, y: -5 }}
            whileTap={{ scale: 0.9 }}
            transition={{
                type: "spring",
                stiffness: 260,
                damping: 20,
                delay: 1
            }}
            className="fixed bottom-8 left-8 z-[100] w-14 h-14 bg-red-600 text-white rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(220,38,38,0.5)] hover:shadow-[0_0_30px_rgba(220,38,38,0.8)] transition-all duration-300 group"
            aria-label="Email Us"
        >
            <Mail size={24} className="group-hover:rotate-12 transition-transform duration-300" />

            {/* Tooltip */}
            <span className="absolute left-full ml-4 px-4 py-2 bg-neutral-900 border border-white/10 text-white text-[10px] font-bold uppercase tracking-[0.2em] rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 -translate-x-2 group-hover:translate-x-0 whitespace-nowrap pointer-events-none shadow-2xl backdrop-blur-md">
                Get in Touch
            </span>

            {/* Pulsing notification dot (purely cosmetic) */}
            <span className="absolute top-0 right-0 w-3 h-3 bg-white rounded-full border-2 border-red-600 animate-pulse"></span>
        </motion.a>
    );
}
