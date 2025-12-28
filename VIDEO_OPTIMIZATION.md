# Video Performance Optimization Guide

## Summary of Changes Made

### 1. Created `ResponsiveVideo` Component
**Location:** `components/ui/ResponsiveVideo.tsx`

A performance-optimized video component that:
- **Disables video on mobile devices** (< 768px) - shows poster image instead
- **Lazy loads using Intersection Observer** - only loads when element is in viewport
- **Delays video load** - waits for initial page paint before loading video
- **Falls back to poster image** if video fails to load
- **Uses `preload="none"`** to prevent blocking page render

### 2. Updated Hero Components

| Component | Before | After |
|-----------|--------|-------|
| `ParallaxHero.tsx` | Raw `<video>` with autoPlay | `ResponsiveVideo` with lazy load |
| `Hero.tsx` | Raw `<video>` with autoPlay | `ResponsiveVideo` with lazy load |
| `app/features/page.tsx` | Raw `<video>` with autoPlay | `ResponsiveVideo` with lazy load |
| `app/services/page.tsx` | Raw `<video>` with autoPlay | `ResponsiveVideo` with lazy load |
| `Contact.tsx` | Added `preload="none"` to effect video | Optimized |

---

## Video Assets That Need Compression

**Current video sizes (too large for web):**

| File | Current Size | Target Size | Action Needed |
|------|-------------|-------------|---------------|
| `hero-main.mp4` | **15.5 MB** | < 2 MB | ⚠️ CRITICAL - Compress heavily |
| `about-hero-bg.mp4` | **12.3 MB** | < 2 MB | ⚠️ CRITICAL - Compress heavily |
| `card-2.mp4` | **19.9 MB** | < 2 MB | ⚠️ CRITICAL - Compress or remove |
| `hero-flow.mp4` | **6.9 MB** | < 2 MB | ⚠️ Needs compression |
| `hero-hover.mp4` | **2.4 MB** | < 2 MB | ⚠️ Slight compression |
| Others (~1 MB) | OK | OK | ✅ No action needed |

---

## How to Compress Videos

### Option 1: FFmpeg (Free, Local)
```bash
# Compress to 720p, 24fps, H.264, 2MB target
ffmpeg -i hero-main.mp4 -vcodec libx264 -crf 28 -preset slow -vf "scale=-1:720" -r 24 -an hero-main-compressed.mp4

# Create WebM version (better compression)
ffmpeg -i hero-main.mp4 -vcodec libvpx-vp9 -crf 30 -b:v 0 -vf "scale=-1:720" -r 24 -an hero-main-compressed.webm
```

### Option 2: HandBrake (Free, GUI)
1. Open video in HandBrake
2. Set Quality: RF 28-32 (higher = smaller file)
3. Resolution: 1280x720 or lower
4. Frame Rate: 24 fps
5. Audio: None (remove audio track)
6. Export as MP4 (H.264) and WebM (VP9)

### Option 3: Cloud Services (Recommended for Production)
- **Cloudinary** - Best for auto-optimization, adaptive streaming
- **Mux** - Professional video hosting with auto-transcoding
- **Bunny.net Stream** - Budget-friendly CDN streaming
- **Uploadcare** - Easy integration with smart compression

---

## Recommended Video Specifications

| Property | Value |
|----------|-------|
| Resolution | 1280x720 (720p) max |
| Frame Rate | 24 fps |
| Duration | 3-6 seconds, looping |
| File Size | < 2 MB per video |
| Format | MP4 (H.264) + WebM (VP9) |
| Audio | None (remove audio track) |
| Bitrate | ~500 kbps VBR |

---

## Additional Recommendations

### 1. Consider Replacing Large Videos
For `hero-main.mp4` (15.5 MB), consider:
- Using a **static image** with CSS animations
- Using **Lottie animations** (much smaller, GPU-accelerated)
- Using **CSS gradients with motion effects**

### 2. Use Modern Formats
Provide both MP4 and WebM:
```tsx
<video>
    <source src="/hero.webm" type="video/webm" />
    <source src="/hero.mp4" type="video/mp4" />
</video>
```

### 3. Host on CDN Video Service
Instead of Netlify static hosting:
- Upload to Cloudinary/Mux
- Use their CDN URLs (auto-optimized per device)

---

## Files Modified

1. `components/ui/ResponsiveVideo.tsx` - NEW
2. `components/ParallaxHero.tsx` - Updated
3. `components/Hero.tsx` - Updated
4. `app/features/page.tsx` - Updated
5. `app/services/page.tsx` - Updated
6. `components/Contact.tsx` - Updated

---

## Next Steps

1. **Compress all videos** using FFmpeg or HandBrake to < 2 MB each
2. **Create WebM versions** of all videos for better compression
3. **Consider CDN hosting** for production (Cloudinary, Mux)
4. **Test on slow 3G connection** in Chrome DevTools
5. **Run Lighthouse audit** to verify LCP improvements

---

*Generated on: December 28, 2024*
