/**
 * ==========================================================================
 * قائمة أعمالك وفيديوهاتك (Projects Data) - MosaEdits
 * ==========================================================================
 * تم التحديث والمزامنة الكاملة مع Google Drive:
 * - 8 فيديوهات قصيرة (ريلز)
 * - 4 فيديوهات طويلة (حذف light bar وإضافة final 009 و grade1)
 * إجمالي: 12 مشروع فيديو حقيقي مصحوبة بالصور المصغرة الرسمية.
 */

const defaultProjects = [
    // =========================================================================
    // 1. الفيديوهات القصيرة (Reels / Shorts) - 8 فيديوهات
    // =========================================================================
    {
        id: "reel-turk-1",
        titleAr: "ريل ترويجي وسياحي: ديناميكية كادرات وانتقالات بصرية (TURK)",
        titleEn: "Dynamic Travel & Tourism Promo Reel (TURK)",
        category: "shorts",
        aspect: "vertical",
        software: "DaVinci Resolve • After Effects",
        tag: "Travel / Promo",
        videoUrl: "https://drive.google.com/file/d/1zAgcpHCUyU4gQIAfjAw1KQyUKRedcbC7/preview",
        thumbnailUrl: "https://lh3.googleusercontent.com/d/1zAgcpHCUyU4gQIAfjAw1KQyUKRedcbC7=w800",
        thumbnailBg: "thumb-short-1"
    },
    {
        id: "reel-turk-2",
        titleAr: "ريل سياحي سينمائي (الجزء الثاني): ساوند ديزاين بطبقات واقعية (TURK 2)",
        titleEn: "Cinematic Tourism Reel Part 2: Layered Sound Design (TURK 2)",
        category: "shorts",
        aspect: "vertical",
        software: "DaVinci Resolve Studio",
        tag: "Cinematic Reel",
        videoUrl: "https://drive.google.com/file/d/18eoOtBXXVkEZQyBpU8f6cL-us5a_tNqs/preview",
        thumbnailUrl: "https://lh3.googleusercontent.com/d/18eoOtBXXVkEZQyBpU8f6cL-us5a_tNqs=w800",
        thumbnailBg: "thumb-comm-1"
    },
    {
        id: "reel-watani",
        titleAr: "ريل وثائقي وطني: هوك حماسي ونصوص سينمائية متفاعلة (ليندك وطني)",
        titleEn: "National Documentary Kinetic Reel: High Impact (Watani)",
        category: "shorts",
        aspect: "vertical",
        software: "After Effects • DaVinci Resolve",
        tag: "Documentary Reel",
        videoUrl: "https://drive.google.com/file/d/1abTTgBIORvaDfRIBsWIeiONcAbdEjVvU/preview",
        thumbnailUrl: "https://lh3.googleusercontent.com/d/1abTTgBIORvaDfRIBsWIeiONcAbdEjVvU=w800",
        thumbnailBg: "thumb-short-2"
    },
    {
        id: "reel-palace",
        titleAr: "ريل قصر الفخامة (PALACE): استعراض معماري سينمائي فاخر",
        titleEn: "Palace Luxury Architectural Showcase Reel (PALACE)",
        category: "shorts",
        aspect: "vertical",
        software: "DaVinci Resolve Studio",
        tag: "Luxury / Showcase",
        videoUrl: "https://drive.google.com/file/d/1tN5RGI6K8KVLIIoiQA7GgPp6ftGEXsXc/preview",
        thumbnailUrl: "https://lh3.googleusercontent.com/d/1tN5RGI6K8KVLIIoiQA7GgPp6ftGEXsXc=w800",
        thumbnailBg: "thumb-motion-1"
    },
    {
        id: "reel-final",
        titleAr: "ريل إعلاني تجاري: مونتاج إيقاعي سريع وهوك قوي (Final)",
        titleEn: "Commercial Master Reel: Snappy Hook & High Energy (Final)",
        category: "shorts",
        aspect: "vertical",
        software: "DaVinci Resolve • After Effects",
        tag: "High Retention",
        videoUrl: "https://drive.google.com/file/d/1jIDj0-PiMnf_8a9NlgaeqVV3Le9fxSjj/preview",
        thumbnailUrl: "https://lh3.googleusercontent.com/d/1jIDj0-PiMnf_8a9NlgaeqVV3Le9fxSjj=w800",
        thumbnailBg: "thumb-short-1"
    },
    {
        id: "reel-2first",
        titleAr: "ريل محتوى اجتماعي: نصوص متحركة وتقطيع متقن (2 First)",
        titleEn: "Social Media Dynamic Reel: Kinetic Captions (2 First)",
        category: "shorts",
        aspect: "vertical",
        software: "Premiere Pro • After Effects",
        tag: "Reels / TikTok",
        videoUrl: "https://drive.google.com/file/d/1aDQska0t5Q3U5qOlJ_gU3ZmZtfzjdJwL/preview",
        thumbnailUrl: "https://lh3.googleusercontent.com/d/1aDQska0t5Q3U5qOlJ_gU3ZmZtfzjdJwL=w800",
        thumbnailBg: "thumb-comm-1"
    },
    {
        id: "reel-4",
        titleAr: "ريل إبداعي: انتقالات بصرية ومؤثرات صوتية محكمة (Project 4)",
        titleEn: "Creative Visual Reel: Seamless Transitions & SFX (Project 4)",
        category: "shorts",
        aspect: "vertical",
        software: "DaVinci Resolve Studio",
        tag: "Creative Reel",
        videoUrl: "https://drive.google.com/file/d/1GNHhUi6CFCgannHWFbtDiMi7QQt3Ia-l/preview",
        thumbnailUrl: "https://lh3.googleusercontent.com/d/1GNHhUi6CFCgannHWFbtDiMi7QQt3Ia-l=w800",
        thumbnailBg: "thumb-short-2"
    },
    {
        id: "reel-1111",
        titleAr: "ريل تفاعلي سريع: هوك أول ثانيتين وتقطيع جراحي (1111)",
        titleEn: "High-Engagement Snappy Reel: Zero-Drag Pacing (1111)",
        category: "shorts",
        aspect: "vertical",
        software: "DaVinci Resolve • After Effects",
        tag: "Viral / Reels",
        videoUrl: "https://drive.google.com/file/d/1xiRSXg5tacDN85-RfkT9bUdwAv-ftx8v/preview",
        thumbnailUrl: "https://lh3.googleusercontent.com/d/1xiRSXg5tacDN85-RfkT9bUdwAv-ftx8v=w800",
        thumbnailBg: "thumb-motion-1"
    },

    // =========================================================================
    // 2. الفيديوهات الطويلة (Long-form / 16:9) - 4 فيديوهات
    // =========================================================================
    {
        id: "long-final-009",
        titleAr: "مونتاج سينمائي تجاري كامل (Final 009)",
        titleEn: "Complete Commercial Master Edit (Final 009)",
        category: "long",
        aspect: "widescreen",
        software: "DaVinci Resolve Studio",
        tag: "Commercial / 16:9",
        videoUrl: "https://drive.google.com/file/d/1eCGLcdz-rgdkmJ-74u2Zyvlaw-J_8uUg/preview",
        thumbnailUrl: "https://lh3.googleusercontent.com/d/1eCGLcdz-rgdkmJ-74u2Zyvlaw-J_8uUg=w800",
        thumbnailBg: "thumb-comm-1"
    },
    {
        id: "long-grade-1",
        titleAr: "تلوين سينمائي وتصحيح ألوان احترافي (Color Grade 1)",
        titleEn: "Professional Cinematic Color Grading (Grade 1)",
        category: "long",
        aspect: "widescreen",
        software: "DaVinci Resolve Studio",
        tag: "Color Grading",
        videoUrl: "https://drive.google.com/file/d/1ZJdvlJUSj85OCoCH1gcPFEFuj6dNsCuO/preview",
        thumbnailUrl: "https://lh3.googleusercontent.com/d/1ZJdvlJUSj85OCoCH1gcPFEFuj6dNsCuO=w800",
        thumbnailBg: "thumb-short-1"
    },
    {
        id: "long-saas-intro",
        titleAr: "مقدمة موشن جرافيكس لمنصة SaaS التقنية (16:9)",
        titleEn: "SaaS Digital Platform Motion Graphics Intro (16:9)",
        category: "long",
        aspect: "widescreen",
        software: "After Effects • Illustrator",
        tag: "Motion Graphics",
        videoUrl: "https://drive.google.com/file/d/1bDbSBGvLJuXHGTQS8ZvwrJb8FgFcvUia/preview",
        thumbnailUrl: "https://lh3.googleusercontent.com/d/1bDbSBGvLJuXHGTQS8ZvwrJb8FgFcvUia=w800",
        thumbnailBg: "thumb-motion-1"
    },
    {
        id: "long-saas-sfx",
        titleAr: "فيديو توضيحي كامل لمنصة SaaS مع هندسة صوتية SFX متكاملة",
        titleEn: "Complete SaaS Explainer Video with Full SFX Design",
        category: "long",
        aspect: "widescreen",
        software: "After Effects • DaVinci Resolve",
        tag: "SaaS Explainer",
        videoUrl: "https://drive.google.com/file/d/1AfhdYaALMka8TcFzNaUsi1Z5nd8lzfTl/preview",
        thumbnailUrl: "https://lh3.googleusercontent.com/d/1AfhdYaALMka8TcFzNaUsi1Z5nd8lzfTl=w800",
        thumbnailBg: "thumb-comm-1"
    }
];

// جلب المشاريع من LocalStorage أو استخدام الافتراضية
function getProjectsList() {
    const saved = localStorage.getItem('portfolio_user_projects');
    if (saved) {
        try {
            const parsed = JSON.parse(saved);
            // ترقية وتحديث تلقائي إذا كانت البيانات القديمة تحتوي على الفيديو المحذوف أو تفتقر للفيديوهات الجديدة
            const hasOldLightBar = Array.isArray(parsed) && parsed.some(p => p.id === 'long-light-bar');
            const hasNewGrade = Array.isArray(parsed) && parsed.some(p => p.id === 'long-grade-1');
            const hasDummy = Array.isArray(parsed) && parsed.some(p => p.id === 'proj-1' || !p.thumbnailUrl);
            
            if (!hasNewGrade || hasOldLightBar || hasDummy) {
                localStorage.setItem('portfolio_user_projects', JSON.stringify(defaultProjects));
                return defaultProjects;
            }
            return parsed;
        } catch (e) {
            console.error('Error parsing projects data from localStorage', e);
        }
    }
    return defaultProjects;
}

// حفظ قائمة المشاريع في LocalStorage
function saveProjectsList(projects) {
    localStorage.setItem('portfolio_user_projects', JSON.stringify(projects));
}
