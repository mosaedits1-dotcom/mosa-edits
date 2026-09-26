/**
 * ==========================================================================
 * قائمة أعمالك وفيديوهاتك (Projects Data) - MosaEdits
 * ==========================================================================
 * - تبسيط وتنسيق أسماء الفيديوهات لتكون واضحة وأنيقة وبدون حشو كلام
 * - الفيديو الأول المعروض: ريل وثائقي وطني (reel-watani) في صدارة المعرض
 * - إجمالي 12 مشروع فيديو حقيقي (8 ريلز + 4 فيديوهات طويلة)
 */

const CURRENT_PROJECTS_VERSION = 'v5_clean_short_titles';

const defaultProjects = [
    // =========================================================================
    // 1. الفيديوهات القصيرة (Reels / Shorts) - 8 فيديوهات
    // =========================================================================
    {
        id: "reel-watani",
        titleAr: "ريل وثائقي وطني",
        titleEn: "National Documentary Reel",
        category: "shorts",
        aspect: "vertical",
        software: "After Effects • DaVinci Resolve",
        tag: "وثائقي",
        videoUrl: "https://drive.google.com/file/d/1abTTgBIORvaDfRIBsWIeiONcAbdEjVvU/preview",
        thumbnailUrl: "https://lh3.googleusercontent.com/d/1abTTgBIORvaDfRIBsWIeiONcAbdEjVvU=w800",
        thumbnailBg: "thumb-short-2"
    },
    {
        id: "reel-turk-1",
        titleAr: "ريل سياحي ترويجي (TURK)",
        titleEn: "Travel & Promo Reel (TURK)",
        category: "shorts",
        aspect: "vertical",
        software: "DaVinci Resolve • After Effects",
        tag: "ترويجي",
        videoUrl: "https://drive.google.com/file/d/1zAgcpHCUyU4gQIAfjAw1KQyUKRedcbC7/preview",
        thumbnailUrl: "https://lh3.googleusercontent.com/d/1zAgcpHCUyU4gQIAfjAw1KQyUKRedcbC7=w800",
        thumbnailBg: "thumb-short-1"
    },
    {
        id: "reel-turk-2",
        titleAr: "ريل سياحي سينمائي (TURK 2)",
        titleEn: "Cinematic Travel Reel (TURK 2)",
        category: "shorts",
        aspect: "vertical",
        software: "DaVinci Resolve Studio",
        tag: "سينمائي",
        videoUrl: "https://drive.google.com/file/d/18eoOtBXXVkEZQyBpU8f6cL-us5a_tNqs/preview",
        thumbnailUrl: "https://lh3.googleusercontent.com/d/18eoOtBXXVkEZQyBpU8f6cL-us5a_tNqs=w800",
        thumbnailBg: "thumb-comm-1"
    },
    {
        id: "reel-palace",
        titleAr: "ريل قصر الفخامة (PALACE)",
        titleEn: "Luxury Showcase (PALACE)",
        category: "shorts",
        aspect: "vertical",
        software: "DaVinci Resolve Studio",
        tag: "فخامة",
        videoUrl: "https://drive.google.com/file/d/1tN5RGI6K8KVLIIoiQA7GgPp6ftGEXsXc/preview",
        thumbnailUrl: "https://lh3.googleusercontent.com/d/1tN5RGI6K8KVLIIoiQA7GgPp6ftGEXsXc=w800",
        thumbnailBg: "thumb-motion-1"
    },
    {
        id: "reel-final",
        titleAr: "ريل إعلاني تجاري (Final)",
        titleEn: "Commercial Reel (Final)",
        category: "shorts",
        aspect: "vertical",
        software: "DaVinci Resolve • After Effects",
        tag: "إعلاني",
        videoUrl: "https://drive.google.com/file/d/1jIDj0-PiMnf_8a9NlgaeqVV3Le9fxSjj/preview",
        thumbnailUrl: "https://lh3.googleusercontent.com/d/1jIDj0-PiMnf_8a9NlgaeqVV3Le9fxSjj=w800",
        thumbnailBg: "thumb-short-1"
    },
    {
        id: "reel-2first",
        titleAr: "ريل محتوى اجتماعي (2 First)",
        titleEn: "Social Media Reel (2 First)",
        category: "shorts",
        aspect: "vertical",
        software: "Premiere Pro • After Effects",
        tag: "سوشيال ميديا",
        videoUrl: "https://drive.google.com/file/d/1aDQska0t5Q3U5qOlJ_gU3ZmZtfzjdJwL/preview",
        thumbnailUrl: "https://lh3.googleusercontent.com/d/1aDQska0t5Q3U5qOlJ_gU3ZmZtfzjdJwL=w800",
        thumbnailBg: "thumb-comm-1"
    },
    {
        id: "reel-4",
        titleAr: "ريل إبداعي (Project 4)",
        titleEn: "Creative Reel (Project 4)",
        category: "shorts",
        aspect: "vertical",
        software: "DaVinci Resolve Studio",
        tag: "إبداعي",
        videoUrl: "https://drive.google.com/file/d/1GNHhUi6CFCgannHWFbtDiMi7QQt3Ia-l/preview",
        thumbnailUrl: "https://lh3.googleusercontent.com/d/1GNHhUi6CFCgannHWFbtDiMi7QQt3Ia-l=w800",
        thumbnailBg: "thumb-short-2"
    },
    {
        id: "reel-1111",
        titleAr: "ريل تفاعلي سريع (1111)",
        titleEn: "Dynamic Fast Reel (1111)",
        category: "shorts",
        aspect: "vertical",
        software: "DaVinci Resolve • After Effects",
        tag: "تفاعلي",
        videoUrl: "https://drive.google.com/file/d/1xiRSXg5tacDN85-RfkT9bUdwAv-ftx8v/preview",
        thumbnailUrl: "https://lh3.googleusercontent.com/d/1xiRSXg5tacDN85-RfkT9bUdwAv-ftx8v=w800",
        thumbnailBg: "thumb-motion-1"
    },

    // =========================================================================
    // 2. الفيديوهات الطويلة (Long-form / 16:9) - 4 فيديوهات
    // =========================================================================
    {
        id: "long-final-009",
        titleAr: "مونتاج سينمائي تجاري (Final 009)",
        titleEn: "Cinematic Commercial Edit (Final 009)",
        category: "long",
        aspect: "widescreen",
        software: "DaVinci Resolve Studio",
        tag: "تجاري 16:9",
        videoUrl: "https://drive.google.com/file/d/1eCGLcdz-rgdkmJ-74u2Zyvlaw-J_8uUg/preview",
        thumbnailUrl: "https://lh3.googleusercontent.com/d/1eCGLcdz-rgdkmJ-74u2Zyvlaw-J_8uUg=w800",
        thumbnailBg: "thumb-comm-1"
    },
    {
        id: "long-grade-1",
        titleAr: "تلوين وتصحيح سينمائي (Grade 1)",
        titleEn: "Cinematic Color Grading (Grade 1)",
        category: "long",
        aspect: "widescreen",
        software: "DaVinci Resolve Studio",
        tag: "تصحيح ألوان",
        videoUrl: "https://drive.google.com/file/d/1ZJdvlJUSj85OCoCH1gcPFEFuj6dNsCuO/preview",
        thumbnailUrl: "https://lh3.googleusercontent.com/d/1ZJdvlJUSj85OCoCH1gcPFEFuj6dNsCuO=w800",
        thumbnailBg: "thumb-short-1"
    },
    {
        id: "long-saas-intro",
        titleAr: "موشن جرافيكس منصة SaaS",
        titleEn: "SaaS Motion Graphics Intro",
        category: "long",
        aspect: "widescreen",
        software: "After Effects • Illustrator",
        tag: "موشن جرافيكس",
        videoUrl: "https://drive.google.com/file/d/1bDbSBGvLJuXHGTQS8ZvwrJb8FgFcvUia/preview",
        thumbnailUrl: "https://lh3.googleusercontent.com/d/1bDbSBGvLJuXHGTQS8ZvwrJb8FgFcvUia=w800",
        thumbnailBg: "thumb-motion-1"
    },
    {
        id: "long-saas-sfx",
        titleAr: "فيديو توضيحي وهندسة صوتية SaaS",
        titleEn: "SaaS Explainer & Sound Design",
        category: "long",
        aspect: "widescreen",
        software: "After Effects • DaVinci Resolve",
        tag: "فيديو توضيحي",
        videoUrl: "https://drive.google.com/file/d/1AfhdYaALMka8TcFzNaUsi1Z5nd8lzfTl/preview",
        thumbnailUrl: "https://lh3.googleusercontent.com/d/1AfhdYaALMka8TcFzNaUsi1Z5nd8lzfTl=w800",
        thumbnailBg: "thumb-comm-1"
    }
];

// جلب المشاريع مع تحديث تلقائي للإصدار الجديد والأول في الترتيب
function getProjectsList() {
    const savedVersion = localStorage.getItem('portfolio_projects_version');
    const saved = localStorage.getItem('portfolio_user_projects');

    if (saved && savedVersion === CURRENT_PROJECTS_VERSION) {
        try {
            return JSON.parse(saved);
        } catch (e) {
            console.error('Error parsing projects data from localStorage', e);
        }
    }

    // تحديث البيانات تلقائياً للترتيب والأسماء الجديدة
    localStorage.setItem('portfolio_user_projects', JSON.stringify(defaultProjects));
    localStorage.setItem('portfolio_projects_version', CURRENT_PROJECTS_VERSION);
    return defaultProjects;
}

// حفظ قائمة المشاريع في LocalStorage
function saveProjectsList(projects) {
    localStorage.setItem('portfolio_user_projects', JSON.stringify(projects));
}
