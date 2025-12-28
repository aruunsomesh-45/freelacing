"use client";

import { useState, useEffect, useRef } from "react";

interface ResponsiveVideoProps {
    src: string;
    poster: string;
    className?: string;
    mobileBreakpoint?: number;
    loadDelay?: number;
}

/**
 * ResponsiveVideo Component
 * 
 * A performance-optimized video component that:
 * - Disables video loading on mobile devices (shows poster image instead)
 * - Uses lazy loading via Intersection Observer
 * - Delays video load until after initial page paint
 * - Falls back to poster image if video fails to load
 * 
 * @param src - Video source URL
 * @param poster - Poster image URL (shown on mobile and before video loads)
 * @param className - Additional CSS classes
 * @param mobileBreakpoint - Screen width below which video is disabled (default: 768)
 * @param loadDelay - Milliseconds to wait before starting video load (default: 1000)
 */
export default function ResponsiveVideo({
    src,
    poster,
    className = "",
    mobileBreakpoint = 768,
    loadDelay = 1000,
}: ResponsiveVideoProps) {
    const [isMobile, setIsMobile] = useState(true); // Default to mobile to prevent flash
    const [shouldLoadVideo, setShouldLoadVideo] = useState(false);
    const [isInView, setIsInView] = useState(false);
    const [hasError, setHasError] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);

    // Detect mobile on mount
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < mobileBreakpoint);
        };

        checkMobile();
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, [mobileBreakpoint]);

    // Intersection Observer for lazy loading
    useEffect(() => {
        const container = containerRef.current;
        if (!container || isMobile) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsInView(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.1, rootMargin: "100px" }
        );

        observer.observe(container);
        return () => observer.disconnect();
    }, [isMobile]);

    // Delay video loading for better LCP
    useEffect(() => {
        if (!isInView || isMobile) return;

        const timer = setTimeout(() => {
            setShouldLoadVideo(true);
        }, loadDelay);

        return () => clearTimeout(timer);
    }, [isInView, isMobile, loadDelay]);

    // Play video when loaded
    useEffect(() => {
        const video = videoRef.current;
        if (!video || !shouldLoadVideo) return;

        const handleCanPlay = () => {
            video.play().catch(() => {
                // Autoplay blocked, show poster instead
                setHasError(true);
            });
        };

        const handleError = () => {
            setHasError(true);
        };

        video.addEventListener("canplay", handleCanPlay);
        video.addEventListener("error", handleError);

        return () => {
            video.removeEventListener("canplay", handleCanPlay);
            video.removeEventListener("error", handleError);
        };
    }, [shouldLoadVideo]);

    return (
        <div ref={containerRef} className={`relative ${className}`}>
            {/* Poster Image - Always shown initially and on mobile */}
            <img
                src={poster}
                alt=""
                aria-hidden="true"
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${shouldLoadVideo && !hasError ? "opacity-0" : "opacity-100"
                    }`}
            />

            {/* Video - Only loaded on desktop after delay */}
            {!isMobile && shouldLoadVideo && !hasError && (
                <video
                    ref={videoRef}
                    className="absolute inset-0 w-full h-full object-cover"
                    src={src}
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="metadata"
                    poster={poster}
                />
            )}
        </div>
    );
}
