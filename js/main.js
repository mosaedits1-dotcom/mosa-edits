/**
 * MosaEdits Portfolio - Main Interactive Logic
 * Features:
 * - Theme Switcher (Dark / Light Mode)
 * - Language Switcher (Arabic / English)
 * - Apple Pro Project Price Configurator (Exact user pricing logic)
 * - Dynamic Client Reviews (Stored in localStorage, zero pre-made reviews)
 * - Projects Showcase, Add Video Modal, and Video Lightbox Player
 */

document.addEventListener('DOMContentLoaded', () => {
    // --------------------------------------------------------------------------
    // 1. State Management
    // --------------------------------------------------------------------------
    let currentLang = localStorage.getItem('site_lang') || 'ar';
    let currentTheme = localStorage.getItem('site_theme') || 'dark';
    let activeFilter = 'shorts';

    // Calculator State
    let calcState = {
        activeTab: 'shorts',       // 'shorts' | 'long' | 'podcast'
        reelDuration: 60,          // 60, 90, 120, 150, 180 seconds
        motionLevel: 'simple',     // 'simple' | 'heavy'
        longMinutes: 8,            // 1 to 45 mins
        podcastMinutes: 120,       // 60, 120, 180 mins
        quantity: 1                // 1 to 20
    };

    // DOM Elements
    const htmlElement = document.documentElement;
    const bodyElement = document.body;
    const langSwitchBtn = document.getElementById('langSwitch');
    const currentLangLabel = document.getElementById('currentLangLabel');
    const themeToggleBtn = document.getElementById('themeToggle');
    const navbar = document.getElementById('navbar');
    const menuToggle = document.getElementById('menuToggle');
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
    const projectsGrid = document.getElementById('projectsGrid');

    // --------------------------------------------------------------------------
    // 2. Theme Toggle System (Dark / Light)
    // --------------------------------------------------------------------------
    function applyTheme(theme) {
        currentTheme = theme;
        localStorage.setItem('site_theme', theme);

        if (theme === 'light') {
            bodyElement.classList.add('theme-light');
            bodyElement.classList.remove('theme-dark');
        } else {
            bodyElement.classList.add('theme-dark');
            bodyElement.classList.remove('theme-light');
        }
    }

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            applyTheme(newTheme);
        });
    }

    // --------------------------------------------------------------------------
    // 3. Language Switching System
    // --------------------------------------------------------------------------
    function applyLanguage(lang) {
        currentLang = lang;
        localStorage.setItem('site_lang', lang);

        htmlElement.setAttribute('lang', lang);
        htmlElement.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
        if (currentLangLabel) {
            currentLangLabel.textContent = lang === 'ar' ? 'EN' : 'عربي';
        }

        // Translate all data-i18n elements
        const elementsToTranslate = document.querySelectorAll('[data-i18n]');
        elementsToTranslate.forEach(el => {
            const keyPath = el.getAttribute('data-i18n');
            const translation = getNestedTranslation(translations[lang], keyPath);
            if (translation) {
                el.innerHTML = translation;
            }
        });

        // Re-render dependent dynamic sections
        renderProjects();
        updateCalculator();
        renderReviews();
    }

    function getNestedTranslation(obj, path) {
        return path.split('.').reduce((prev, curr) => (prev && prev[curr] !== undefined) ? prev[curr] : null, obj);
    }

    if (langSwitchBtn) {
        langSwitchBtn.addEventListener('click', () => {
            const newLang = currentLang === 'ar' ? 'en' : 'ar';
            applyLanguage(newLang);
        });
    }

    // --------------------------------------------------------------------------
    // 4. Video URL Helper (Embed converter for YouTube, Shorts, Vimeo, MP4)
    // --------------------------------------------------------------------------
    function generateVideoEmbedHtml(url, title) {
        if (!url || url.trim() === '') {
            return `
                <div class="video-placeholder-demo">
                    <div class="demo-screen-content">
                        <div class="play-indicator"><i class="fa-solid fa-wand-magic-sparkles"></i></div>
                        <h3>${title || 'معاينة المشروع والفيديو'}</h3>
                        <p>${currentLang === 'ar' ? 'يمكنك تشغيل فيديوهات حقيقية بإضافة رابط الفيديو عبر زر "إضافة فيديو جديد"' : 'You can add actual video URLs via the "+ Add New Video" button'}</p>
                        <div class="modal-badge-row">
                            <span class="badge"><i class="fa-solid fa-mobile-screen"></i> 9:16 / 16:9 Ready</span>
                            <span class="badge badge-gold"><i class="fa-solid fa-bolt"></i> ${currentLang === 'ar' ? 'تصدير مناسب لكل المنصات' : 'All-Platform Export'}</span>
                        </div>
                    </div>
                </div>
            `;
        }

        const cleanUrl = url.trim();

        // YouTube Shorts
        const shortsMatch = cleanUrl.match(/youtube\.com\/shorts\/([a-zA-Z0-9_-]+)/);
        if (shortsMatch && shortsMatch[1]) {
            return `<iframe src="https://www.youtube.com/embed/${shortsMatch[1]}?autoplay=1&rel=0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
        }

        // YouTube Standard
        const ytMatch = cleanUrl.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
        if (ytMatch && ytMatch[1]) {
            return `<iframe src="https://www.youtube.com/embed/${ytMatch[1]}?autoplay=1&rel=0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
        }

        // Vimeo
        const vimeoMatch = cleanUrl.match(/vimeo\.com\/(\d+)/);
        if (vimeoMatch && vimeoMatch[1]) {
            return `<iframe src="https://player.vimeo.com/video/${vimeoMatch[1]}?autoplay=1" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe>`;
        }

        // Google Drive Video Embed
        const driveMatch = cleanUrl.match(/drive\.google\.com\/(?:file\/d\/|open\?id=|uc\?id=)?([a-zA-Z0-9_-]{25,})/);
        if (driveMatch && driveMatch[1]) {
            return `<iframe src="https://drive.google.com/file/d/${driveMatch[1]}/preview" allow="autoplay; fullscreen" allowfullscreen style="width:100%; height:100%; border:none; border-radius: var(--radius-md);"></iframe>`;
        }

        // Direct Video (MP4 / WebM)
        if (cleanUrl.endsWith('.mp4') || cleanUrl.endsWith('.webm')) {
            return `<video src="${cleanUrl}" controls autoplay playsinline style="width:100%; height:100%;"></video>`;
        }

        return `<iframe src="${cleanUrl}" allowfullscreen></iframe>`;
    }

    // Helper: Extract Thumbnail URL from Google Drive, YouTube, or direct files
    function getVideoThumbnailUrl(url) {
        if (!url) return '';
        const cleanUrl = url.trim();

        // 1. Google Drive Video
        const driveMatch = cleanUrl.match(/drive\.google\.com\/(?:file\/d\/|open\?id=|uc\?id=)?([a-zA-Z0-9_-]{25,})/);
        if (driveMatch && driveMatch[1]) {
            return `https://lh3.googleusercontent.com/d/${driveMatch[1]}=w800`;
        }

        // 2. YouTube Shorts
        const shortsMatch = cleanUrl.match(/youtube\.com\/shorts\/([a-zA-Z0-9_-]+)/);
        if (shortsMatch && shortsMatch[1]) {
            return `https://img.youtube.com/vi/${shortsMatch[1]}/hqdefault.jpg`;
        }

        // 3. YouTube Standard
        const ytMatch = cleanUrl.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
        if (ytMatch && ytMatch[1]) {
            return `https://img.youtube.com/vi/${ytMatch[1]}/hqdefault.jpg`;
        }

        return '';
    }

    // --------------------------------------------------------------------------
    // 5. Portfolio Rendering & Filtering
    // --------------------------------------------------------------------------
    function renderProjects() {
        if (!projectsGrid) return;

        const projects = getProjectsList();
        projectsGrid.innerHTML = '';

        const filtered = projects.filter(p => {
            if (activeFilter === 'shorts') {
                return p.category === 'shorts' || p.aspect === 'vertical' || p.category === 'ads';
            } else if (activeFilter === 'long') {
                return p.category === 'long' || p.aspect === 'widescreen' || p.category === 'motion' || p.category === 'youtube';
            }
            return true;
        });

        if (filtered.length === 0) {
            const noProjMsg = currentLang === 'ar' ? translations.ar.portfolio.noProjects : translations.en.portfolio.noProjects;
            projectsGrid.innerHTML = `
                <div style="grid-column: 1 / -1; text-align: center; padding: 2.5rem 1rem; color: var(--apple-gray);">
                    <i class="fa-solid fa-film" style="font-size: 2rem; margin-bottom: 0.8rem; opacity: 0.5;"></i>
                    <p style="font-size: 1rem;">${noProjMsg}</p>
                </div>
            `;
            return;
        }

        filtered.forEach((proj, index) => {
            const isVertical = proj.aspect === 'vertical';
            const title = currentLang === 'ar' ? (proj.titleAr || proj.titleEn) : (proj.titleEn || proj.titleAr);
            const watchBtnText = currentLang === 'ar' ? translations.ar.portfolio.watchBtn : translations.en.portfolio.watchBtn;
            const thumbUrl = proj.thumbnailUrl || getVideoThumbnailUrl(proj.videoUrl);

            const card = document.createElement('div');
            card.className = `project-card ag-reveal ag-stagger ${isVertical ? 'vertical-card' : ''}`;
            card.style.setProperty('--reveal-delay', `${(index % 8) * 35}ms`);
            card.setAttribute('data-category', proj.category);
            card.setAttribute('data-proj-id', proj.id);

            card.innerHTML = `
                <div class="project-thumb-box ${isVertical ? 'aspect-9-16' : 'aspect-16-9'}">
                    ${thumbUrl ? `
                        <img src="${thumbUrl}" alt="${title}" class="project-thumbnail-img" loading="lazy" onerror="this.style.display='none';">
                    ` : ''}
                    <div class="project-img-placeholder ${proj.thumbnailBg || 'thumb-short-1'} ${thumbUrl ? 'has-thumb' : ''}">
                        ${isVertical ? '<div class="vertical-badge"><i class="fa-solid fa-mobile-screen"></i> 9:16 Reel</div>' : ''}
                        <div class="thumb-badge"><i class="fa-solid fa-play"></i> ${proj.tag || 'Motion'}</div>
                    </div>
                    
                    <button class="project-play-btn" aria-label="Play Video" data-proj-id="${proj.id}">
                        <i class="fa-solid fa-play"></i>
                    </button>

                    <button class="delete-proj-btn" title="${currentLang === 'ar' ? 'حذف الفيديو' : 'Delete video'}" data-delete-id="${proj.id}">
                        <i class="fa-solid fa-trash-can"></i>
                    </button>
                </div>

                <div class="project-info">
                    <div class="project-meta">
                        <span class="tag ${isVertical ? 'tag-fire' : ''}">${proj.tag || 'Motion'}</span>
                        <span class="tag">${isVertical ? 'Vertical 9:16' : 'Widescreen 16:9'}</span>
                    </div>
                    <h3 class="project-title">${title}</h3>
                    <div class="project-footer">
                        <span class="software-tags"><i class="fa-solid fa-wand-magic-sparkles"></i> ${proj.software || 'DaVinci • AE'}</span>
                        <button class="btn-text project-view-text-btn" data-proj-id="${proj.id}">
                            <span>${watchBtnText}</span>
                            <span class="btn-chevron">
                                <svg class="ag-arrow-svg" viewBox="0 0 16 16" fill="none"><path d="M3 8h10m0 0L8.5 3.5M13 8l-4.5 4.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                            </span>
                        </button>
                    </div>
                </div>
            `;

            projectsGrid.appendChild(card);
        });

        attachCardListeners();
        if (typeof triggerRevealForNewElements === 'function') {
            triggerRevealForNewElements(projectsGrid);
        }
        if (typeof initCardTilt === 'function') {
            initCardTilt();
        }
    }

    function attachCardListeners() {
        // 1. Clicking ANYWHERE on the card (thumbnail, image, title, view button) opens the video!
        document.querySelectorAll('.project-card').forEach(card => {
            card.style.cursor = 'pointer';
            card.addEventListener('click', (e) => {
                if (e.target.closest('.delete-proj-btn')) {
                    return;
                }
                const projId = card.getAttribute('data-proj-id');
                const projects = getProjectsList();
                const project = projects.find(p => p.id === projId);
                if (project) {
                    const title = currentLang === 'ar' ? (project.titleAr || project.titleEn) : (project.titleEn || project.titleAr);
                    const desc = currentLang === 'ar' ? (project.descAr || project.descEn) : (project.descEn || project.descAr);
                    openVideoModal(project.videoUrl, title, desc, project.aspect);
                }
            });
        });

        // 2. Direct click on play button or view text button
        document.querySelectorAll('.project-play-btn, .project-view-text-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const projId = btn.getAttribute('data-proj-id');
                const projects = getProjectsList();
                const project = projects.find(p => p.id === projId);
                if (project) {
                    const title = currentLang === 'ar' ? (project.titleAr || project.titleEn) : (project.titleEn || project.titleAr);
                    const desc = currentLang === 'ar' ? (project.descAr || project.descEn) : (project.descEn || project.descAr);
                    openVideoModal(project.videoUrl, title, desc, project.aspect);
                }
            });
        });

        // 3. Delete button
        document.querySelectorAll('.delete-proj-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const projId = btn.getAttribute('data-delete-id');
                const confirmMsg = currentLang === 'ar' ? 'هل أنت متأكد من حذف هذا الفيديو من المعرض؟' : 'Are you sure you want to delete this project?';
                if (confirm(confirmMsg)) {
                    let projects = getProjectsList();
                    projects = projects.filter(p => p.id !== projId);
                    saveProjectsList(projects);
                    renderProjects();
                }
            });
        });
    }

    // Filter Buttons
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            activeFilter = btn.getAttribute('data-filter');
            filterButtons.forEach(b => b.classList.toggle('active', b === btn));
            renderProjects();
        });
    });

    // --------------------------------------------------------------------------
    // 6. Video Modal & Add Video Modal
    // --------------------------------------------------------------------------
    const videoModal = document.getElementById('videoModal');
    const modalBackdrop = document.getElementById('modalBackdrop');
    const modalCloseBtn = document.getElementById('modalCloseBtn');
    const modalVideoWrapper = document.getElementById('modalVideoWrapper');
    const videoEmbedContainer = document.getElementById('videoEmbedContainer');
    const modalFooterTitle = document.getElementById('modalFooterTitle');
    const modalFooterDesc = document.getElementById('modalFooterDesc');

    function openVideoModal(videoUrl, title, desc, aspect) {
        if (!videoModal) return;
        if (modalFooterTitle) modalFooterTitle.textContent = title || 'فيديو موشن جرافيكس وريلز';
        if (modalFooterDesc) modalFooterDesc.textContent = desc || 'تفاصيل العمل والمؤثرات المستخدمة';

        if (aspect === 'vertical') {
            modalVideoWrapper.classList.add('vertical-video');
        } else {
            modalVideoWrapper.classList.remove('vertical-video');
        }

        if (videoEmbedContainer) {
            videoEmbedContainer.innerHTML = generateVideoEmbedHtml(videoUrl, title);
        }

        videoModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    window.closeModal = function () {
        if (!videoModal) return;
        videoModal.classList.remove('active');
        if (videoEmbedContainer) {
            videoEmbedContainer.innerHTML = '';
        }
        document.body.style.overflow = '';
    };

    if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);
    if (modalBackdrop) modalBackdrop.addEventListener('click', closeModal);

    // Add Video Modal
    const addVideoModal = document.getElementById('addVideoModal');
    const openAddModalBtn = document.getElementById('openAddModalBtn');
    const addModalBackdrop = document.getElementById('addModalBackdrop');
    const addModalCloseBtn = document.getElementById('addModalCloseBtn');
    const addNewProjectForm = document.getElementById('addNewProjectForm');
    const resetDefaultsBtn = document.getElementById('resetDefaultsBtn');

    function openAddModal() {
        if (addVideoModal) {
            addVideoModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }

    function closeAddModal() {
        if (addVideoModal) {
            addVideoModal.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    if (openAddModalBtn) openAddModalBtn.addEventListener('click', openAddModal);
    if (addModalCloseBtn) addModalCloseBtn.addEventListener('click', closeAddModal);
    if (addModalBackdrop) addModalBackdrop.addEventListener('click', closeAddModal);

    if (addNewProjectForm) {
        addNewProjectForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const title = document.getElementById('newProjTitle')?.value || 'مشروع فيديو جديد';
            const url = document.getElementById('newProjUrl')?.value || '';
            const category = document.getElementById('newProjCategory')?.value || 'shorts';
            const aspect = document.getElementById('newProjAspect')?.value || 'vertical';
            const software = document.getElementById('newProjSoftware')?.value || 'DaVinci Resolve • After Effects';
            const desc = document.getElementById('newProjDesc')?.value || 'مونتاج وموشن جرافيكس احترافي.';

            const bgOptions = ['thumb-short-1', 'thumb-short-2', 'thumb-motion-1', 'thumb-comm-1', 'thumb-yt-1'];
            const randomBg = bgOptions[Math.floor(Math.random() * bgOptions.length)];

            const newProject = {
                id: 'proj-' + Date.now(),
                titleAr: title,
                titleEn: title,
                descAr: desc,
                descEn: desc,
                category: category,
                aspect: aspect,
                software: software,
                tag: category === 'shorts' ? 'Reels / TikTok' : (category === 'motion' ? 'Motion Graphics' : 'YouTube'),
                videoUrl: url,
                thumbnailBg: randomBg
            };

            const currentProjects = getProjectsList();
            currentProjects.unshift(newProject);
            saveProjectsList(currentProjects);

            addNewProjectForm.reset();
            closeAddModal();
            renderProjects();
        });
    }

    if (resetDefaultsBtn) {
        resetDefaultsBtn.addEventListener('click', () => {
            const confirmReset = currentLang === 'ar' ? 'استعادة قائمة المشاريع الافتراضية؟' : 'Restore default projects?';
            if (confirm(confirmReset)) {
                saveProjectsList(defaultProjects);
                closeAddModal();
                renderProjects();
            }
        });
    }

    // --------------------------------------------------------------------------
    // 7. Apple Pro Configurator / Project Price Calculator (Exact Formulas)
    // --------------------------------------------------------------------------
    // DOM Elements for Calculator
    const tabShorts = document.getElementById('tabShorts');
    const tabLong = document.getElementById('tabLong');
    const tabPodcast = document.getElementById('tabPodcast');
    const panelShorts = document.getElementById('panelShorts');
    const panelLong = document.getElementById('panelLong');
    const panelPodcast = document.getElementById('panelPodcast');

    const reelDurationInputs = document.querySelectorAll('input[name="reelDuration"]');
    const motionLevelInputs = document.querySelectorAll('input[name="motionLevel"]');
    const longDurationSlider = document.getElementById('longDurationSlider');
    const longDurationBadge = document.getElementById('longDurationBadge');
    const podcastDurationInputs = document.querySelectorAll('input[name="podcastDuration"]');

    const qtyMinusBtn = document.getElementById('qtyMinus');
    const qtyPlusBtn = document.getElementById('qtyPlus');
    const qtyValSpan = document.getElementById('qtyVal');

    const calcServiceTitle = document.getElementById('calcServiceTitle');
    const calcParamLabel = document.getElementById('calcParamLabel');
    const calcParamVal = document.getElementById('calcParamVal');
    const calcPerVideoVal = document.getElementById('calcPerVideoVal');
    const calcQuantityVal = document.getElementById('calcQuantityVal');
    const calcTotalDisplay = document.getElementById('calcTotalDisplay');
    const calcWhatsAppBtn = document.getElementById('calcWhatsAppBtn');
    const dealShortsBtn = document.getElementById('dealShortsBtn');
    const dealLongBtn = document.getElementById('dealLongBtn');
    const calcDeliveryVal = document.getElementById('calcDeliveryVal');
    const calcDiscountRow = document.getElementById('calcDiscountRow');
    const calcDiscountVal = document.getElementById('calcDiscountVal');
    const calcOriginalPrice = document.getElementById('calcOriginalPrice');

    // Switch Calculator Tabs
    function setCalculatorTab(tab) {
        calcState.activeTab = tab;

        tabShorts?.classList.toggle('active', tab === 'shorts');
        tabLong?.classList.toggle('active', tab === 'long');
        tabPodcast?.classList.toggle('active', tab === 'podcast');

        panelShorts?.classList.toggle('active', tab === 'shorts');
        panelLong?.classList.toggle('active', tab === 'long');
        panelPodcast?.classList.toggle('active', tab === 'podcast');

        if (dealShortsBtn) dealShortsBtn.style.display = tab === 'shorts' ? 'block' : 'none';
        if (dealLongBtn) dealLongBtn.style.display = tab === 'long' ? 'block' : 'none';

        updateCalculator();
    }

    tabShorts?.addEventListener('click', () => setCalculatorTab('shorts'));
    tabLong?.addEventListener('click', () => setCalculatorTab('long'));
    tabPodcast?.addEventListener('click', () => setCalculatorTab('podcast'));

    if (dealShortsBtn) {
        dealShortsBtn.addEventListener('click', () => {
            calcState.quantity = 10;
            if (qtyValSpan) qtyValSpan.textContent = '10';
            updateCalculator();
        });
    }

    if (dealLongBtn) {
        dealLongBtn.addEventListener('click', () => {
            calcState.quantity = 4;
            if (qtyValSpan) qtyValSpan.textContent = '4';
            updateCalculator();
        });
    }

    // Listeners for inputs
    reelDurationInputs.forEach(input => {
        input.addEventListener('change', (e) => {
            calcState.reelDuration = parseInt(e.target.value, 10);
            updateCalculator();
        });
    });

    motionLevelInputs.forEach(input => {
        input.addEventListener('change', (e) => {
            calcState.motionLevel = e.target.value;
            updateCalculator();
        });
    });

    function updateSliderTrack() {
        if (!longDurationSlider) return;
        const min = parseFloat(longDurationSlider.min) || 1;
        const max = parseFloat(longDurationSlider.max) || 45;
        const val = parseFloat(longDurationSlider.value) || 8;
        const pct = Math.max(0, Math.min(100, ((val - min) / (max - min)) * 100));
        const isRtl = document.documentElement.getAttribute('dir') === 'rtl';

        if (isRtl) {
            longDurationSlider.style.background = `linear-gradient(to left, var(--apple-blue) 0%, var(--apple-blue) ${pct}%, var(--apple-card-subtle) ${pct}%, var(--apple-card-subtle) 100%)`;
        } else {
            longDurationSlider.style.background = `linear-gradient(to right, var(--apple-blue) 0%, var(--apple-blue) ${pct}%, var(--apple-card-subtle) ${pct}%, var(--apple-card-subtle) 100%)`;
        }
    }

    if (longDurationSlider) {
        longDurationSlider.addEventListener('input', (e) => {
            calcState.longMinutes = parseInt(e.target.value, 10);
            updateSliderTrack();
            updateCalculator();
        });
    }

    // Make slider marks clickable
    const sliderMarkSpans = document.querySelectorAll('.slider-marks span');
    sliderMarkSpans.forEach(mark => {
        mark.addEventListener('click', () => {
            const targetVal = mark.getAttribute('data-val');
            if (targetVal && longDurationSlider) {
                longDurationSlider.value = targetVal;
                calcState.longMinutes = parseInt(targetVal, 10);
                updateSliderTrack();
                updateCalculator();
            }
        });
    });

    podcastDurationInputs.forEach(input => {
        input.addEventListener('change', (e) => {
            calcState.podcastMinutes = parseInt(e.target.value, 10);
            updateCalculator();
        });
    });

    // Quantity Stepper
    if (qtyMinusBtn && qtyPlusBtn && qtyValSpan) {
        qtyMinusBtn.addEventListener('click', () => {
            if (calcState.quantity > 1) {
                calcState.quantity--;
                qtyValSpan.textContent = calcState.quantity;
                updateCalculator();
            }
        });

        qtyPlusBtn.addEventListener('click', () => {
            if (calcState.quantity < 30) {
                calcState.quantity++;
                qtyValSpan.textContent = calcState.quantity;
                updateCalculator();
            }
        });
    }

    // Calculation Engine
    function updateCalculator() {
        let singlePrice = 0;
        let serviceName = '';
        let paramLabel = '';
        let paramValue = '';
        const qty = calcState.quantity;

        if (longDurationBadge) {
            if (calcState.longMinutes === 8) {
                longDurationBadge.textContent = currentLang === 'ar' ? '8 دقائق (الأساس)' : '8 Mins (Base)';
            } else {
                longDurationBadge.textContent = currentLang === 'ar'
                    ? `${calcState.longMinutes} دقيقة`
                    : `${calcState.longMinutes} Mins`;
            }
        }
        updateSliderTrack();

        if (calcState.activeTab === 'shorts') {
            const durationSec = calcState.reelDuration;

            if (durationSec <= 60) {
                singlePrice = 35;
                paramValue = currentLang === 'ar' ? 'أقل من دقيقة (≤ 60 ث)' : 'Under 1 min (≤ 60s)';
            } else if (durationSec === 90) {
                singlePrice = 45;
                paramValue = currentLang === 'ar' ? 'دقيقة ونصف (90 ثانية)' : '1.5 min (90s)';
            } else if (durationSec === 120) {
                singlePrice = 55;
                paramValue = currentLang === 'ar' ? 'دقيقتان (120 ثانية)' : '2 min (120s)';
            } else {
                const extraSeconds = durationSec - 60;
                const extraSteps = Math.ceil(extraSeconds / 30);
                singlePrice = 35 + (extraSteps * 10);
                paramValue = currentLang === 'ar' ? `${durationSec} ثانية` : `${durationSec} seconds`;
            }

            serviceName = currentLang === 'ar' ? 'فيديوهات قصيرة (ريلز)' : 'Short Video (Reels)';
            paramLabel = currentLang === 'ar' ? 'المدة:' : 'Duration:';

        } else if (calcState.activeTab === 'long') {
            const minutes = calcState.longMinutes;
            const isHeavy = calcState.motionLevel === 'heavy';

            if (!isHeavy) {
                const base = 60;
                const extraMins = Math.max(0, minutes - 8);
                singlePrice = base + (extraMins * 5);
                serviceName = currentLang === 'ar' ? 'فيديو طويل (موشن بسيط)' : 'Long-form Video (Simple Motion)';
            } else {
                const base = 80;
                const extraMins = Math.max(0, minutes - 8);
                singlePrice = base + (extraMins * 8);
                serviceName = currentLang === 'ar' ? 'فيديو طويل (موشن مكثف)' : 'Long-form Video (Heavy Motion)';
            }

            paramLabel = currentLang === 'ar' ? 'المدة:' : 'Duration:';
            paramValue = currentLang === 'ar' ? `${minutes} دقيقة` : `${minutes} Minutes`;

        } else if (calcState.activeTab === 'podcast') {
            const durationMin = calcState.podcastMinutes;
            if (durationMin === 60) {
                singlePrice = 60;
                paramValue = currentLang === 'ar' ? 'ساعة واحدة (60 دقيقة)' : '1 Hour (60 mins)';
            } else if (durationMin === 120) {
                singlePrice = 115;
                paramValue = currentLang === 'ar' ? 'ساعتان (120 دقيقة)' : '2 Hours (120 mins)';
            } else {
                singlePrice = 165;
                paramValue = currentLang === 'ar' ? '3 ساعات (180 دقيقة)' : '3 Hours (180 mins)';
            }

            serviceName = currentLang === 'ar' ? 'مونتاج بودكاست' : 'Podcast Episode Edit';
            paramLabel = currentLang === 'ar' ? 'المدة:' : 'Duration:';
        }

        // Delivery Turnaround Time Calculation
        let deliveryText = '';
        if (calcState.activeTab === 'shorts') {
            deliveryText = currentLang === 'ar'
                ? (qty === 1 ? 'يومان كحد أدنى (48 ساعة)' : 'يومان لكل فيديو (تسليم تدريجي)')
                : (qty === 1 ? 'Min. 2 Days (48 Hours)' : '2 Days per video (Scheduled delivery)');
        } else if (calcState.activeTab === 'long') {
            deliveryText = currentLang === 'ar'
                ? (qty === 1 ? 'من 3 إلى 5 أيام عمل' : '3-5 أيام لكل فيديو (تسليم مجدول)')
                : (qty === 1 ? '3 to 5 Business Days' : '3-5 Days per video (Scheduled delivery)');
        } else if (calcState.activeTab === 'podcast') {
            deliveryText = currentLang === 'ar'
                ? (qty === 1 ? '5 أيام عمل' : '5 أيام لكل حلقة (تسليم مجدول)')
                : (qty === 1 ? '5 Business Days' : '5 Days per episode (Scheduled delivery)');
        }

        // Subtotal & Monthly Package Deals (15% for Reels, 20% for Long videos)
        const subtotal = singlePrice * qty;
        let discountPct = 0;
        let discountBadgeText = '';
        if (calcState.activeTab === 'shorts' && qty >= 10) {
            discountPct = 0.15; // 15% discount for Reels
            discountBadgeText = '15%';
        } else if (calcState.activeTab === 'long' && qty >= 4) {
            discountPct = 0.20; // 20% discount for Long videos
            discountBadgeText = '20%';
        }

        const discountAmount = discountPct > 0 ? Math.round(subtotal * discountPct) : 0;
        const totalPrice = subtotal - discountAmount;

        // Toggle Active State on Deal Buttons
        if (dealShortsBtn) dealShortsBtn.classList.toggle('active', calcState.activeTab === 'shorts' && qty >= 10);
        if (dealLongBtn) dealLongBtn.classList.toggle('active', calcState.activeTab === 'long' && qty >= 4);

        // Update DOM displays
        if (calcServiceTitle) calcServiceTitle.textContent = serviceName;
        if (calcParamLabel) calcParamLabel.textContent = paramLabel;
        if (calcParamVal) calcParamVal.textContent = paramValue;
        if (calcPerVideoVal) calcPerVideoVal.textContent = `$${singlePrice}`;
        if (calcQuantityVal) {
            calcQuantityVal.textContent = currentLang === 'ar' ? `${qty} فيديو` : `${qty} Video(s)`;
        }
        if (calcDeliveryVal) calcDeliveryVal.textContent = deliveryText;

        // Discount display
        if (calcDiscountRow && calcDiscountVal) {
            if (discountAmount > 0) {
                calcDiscountRow.style.display = 'flex';
                calcDiscountVal.textContent = `-$${discountAmount} (${discountBadgeText})`;
            } else {
                calcDiscountRow.style.display = 'none';
            }
        }

        // Strikethrough original price if discounted
        if (calcOriginalPrice) {
            if (discountAmount > 0) {
                calcOriginalPrice.style.display = 'inline';
                calcOriginalPrice.textContent = `$${subtotal}`;
            } else {
                calcOriginalPrice.style.display = 'none';
            }
        }

        if (calcTotalDisplay) calcTotalDisplay.textContent = `$${totalPrice}`;

        // Build WhatsApp Message Link to 01096419945 (Clean, simple, perfectly organized)
        if (calcWhatsAppBtn) {
            let discountNote = '';
            if (discountAmount > 0) {
                discountNote = currentLang === 'ar' ? ` (شامل خصم ${discountBadgeText})` : ` (${discountBadgeText} OFF)`;
            }

            const waText = currentLang === 'ar'
                ? `أهلاً موسى 👋\n` +
                `أريد الاستفسار عن تفاصيل باقة:\n` +
                `• الخدمة: ${serviceName} (${qty} فيديو - ${paramValue})\n` +
                `• السعر الإجمالي: $${totalPrice}${discountNote}\n` +
                `• مدة التسليم: ${deliveryText}\n` +
                `جاهز لبدء العمل معك!`
                : `Hi Mosa 👋\n` +
                `I would like to inquire about a package:\n` +
                `• Service: ${serviceName} (${qty} video(s) - ${paramValue})\n` +
                `• Total Price: $${totalPrice}${discountNote}\n` +
                `• Turnaround: ${deliveryText}\n` +
                `Ready to get started!`;

            calcWhatsAppBtn.href = `https://wa.me/201096419945?text=${encodeURIComponent(waText)}`;
        }
    }

    // --------------------------------------------------------------------------
    // 8. Client Review Submission System (Cloud Synced with Google Firebase)
    // --------------------------------------------------------------------------
    const clientReviewForm = document.getElementById('clientReviewForm');
    const reviewRatingInput = document.getElementById('reviewRatingInput');
    const starPicker = document.getElementById('starPicker');
    const reviewFeedback = document.getElementById('reviewFeedback');
    const publishedReviewsContainer = document.getElementById('publishedReviewsContainer');

    // Interactive Star Rating Picker
    if (starPicker) {
        const starButtons = starPicker.querySelectorAll('.star-btn');
        starButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const rating = parseInt(btn.getAttribute('data-rating'), 10);
                if (reviewRatingInput) reviewRatingInput.value = rating;

                starButtons.forEach(s => {
                    const r = parseInt(s.getAttribute('data-rating'), 10);
                    s.classList.toggle('active', r <= rating);
                });
            });
        });
    }

    // Cloud & Local Reviews Storage System
    let cloudReviews = [];

    function initCloudReviews() {
        if (typeof db !== 'undefined' && db) {
            try {
                // Query collection directly without mandatory server-side index to avoid any permission/index rejection
                db.collection('reviews').onSnapshot((snapshot) => {
                    const fetched = [];
                    snapshot.forEach(doc => {
                        fetched.push({ id: doc.id, ...doc.data() });
                    });
                    // Client-side sort so all reviews (even with different date types) show in newest-first order
                    fetched.sort((a, b) => {
                        const timeA = a.createdAtMs || (a.timestamp && a.timestamp.toMillis ? a.timestamp.toMillis() : 0) || 0;
                        const timeB = b.createdAtMs || (b.timestamp && b.timestamp.toMillis ? b.timestamp.toMillis() : 0) || 0;
                        return timeB - timeA;
                    });
                    cloudReviews = fetched;
                    renderReviews();
                }, (error) => {
                    console.error('Firestore onSnapshot error:', error);
                });
            } catch (err) {
                console.error('Firestore subscription error:', err);
            }
        }
    }

    function getStoredReviews() {
        if (cloudReviews && cloudReviews.length > 0) {
            return cloudReviews;
        }

        const saved = localStorage.getItem('client_submitted_reviews');
        if (saved) {
            try {
                return JSON.parse(saved);
            } catch (e) {
                console.error('Error parsing reviews from localStorage', e);
            }
        }
        return [];
    }

    function saveStoredReviews(reviews) {
        localStorage.setItem('client_submitted_reviews', JSON.stringify(reviews));
    }

    function renderReviews() {
        if (!publishedReviewsContainer) return;
        const reviews = getStoredReviews();

        if (reviews.length === 0) {
            const emptyTitle = currentLang === 'ar' ? translations.ar.reviews.emptyStateTitle : translations.en.reviews.emptyStateTitle;
            const emptyDesc = currentLang === 'ar' ? translations.ar.reviews.emptyStateDesc : translations.en.reviews.emptyStateDesc;

            publishedReviewsContainer.innerHTML = `
                <div class="empty-reviews-state">
                    <div class="empty-icon"><i class="fa-regular fa-comment-dots"></i></div>
                    <h4>${emptyTitle}</h4>
                    <p>${emptyDesc}</p>
                </div>
            `;
            return;
        }

        publishedReviewsContainer.innerHTML = '';
        reviews.forEach(rev => {
            const ratingVal = parseInt(rev.rating, 10) || 5;
            const starsText = '★'.repeat(ratingVal) + '☆'.repeat(Math.max(0, 5 - ratingVal));
            const card = document.createElement('div');
            card.className = 'client-review-card';
            card.innerHTML = `
                <div class="review-card-top">
                    <div class="rev-stars-gold">${starsText}</div>
                    <span class="rev-date-tag">${rev.date || 'حديثاً'}</span>
                </div>
                <p class="rev-comment-text">"${rev.comment}"</p>
                <div class="rev-author-meta">
                    <div class="rev-avatar-circle">${(rev.name || 'عميل').charAt(0).toUpperCase()}</div>
                    <div>
                        <strong class="rev-name-label">${rev.name}</strong>
                        ${rev.role ? `<span class="rev-role-label">${rev.role}</span>` : ''}
                    </div>
                </div>
            `;
            publishedReviewsContainer.appendChild(card);
        });
    }

    // Submit Review Form
    if (clientReviewForm) {
        clientReviewForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const name = document.getElementById('reviewName')?.value.trim();
            const role = document.getElementById('reviewRole')?.value.trim() || '';
            const rating = parseInt(reviewRatingInput?.value || '5', 10);
            const comment = document.getElementById('reviewComment')?.value.trim();

            if (!name || !comment) return;

            const now = new Date();
            const nowMs = Date.now();
            const dateStr = now.toLocaleDateString(currentLang === 'ar' ? 'ar-EG' : 'en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
            });

            const newReview = {
                id: 'rev-' + nowMs,
                name: name,
                role: role,
                rating: rating,
                comment: comment,
                date: dateStr,
                createdAtMs: nowMs
            };

            // 1. Save to Google Firebase Cloud Firestore
            if (typeof db !== 'undefined' && db) {
                try {
                    db.collection('reviews').add({
                        name: name,
                        role: role,
                        rating: rating,
                        comment: comment,
                        date: dateStr,
                        createdAtMs: nowMs
                    }).then(() => {
                        console.log('✅ Review successfully saved to Firebase Firestore');
                    }).catch(err => {
                        console.error('Firebase save error:', err);
                    });
                } catch (err) {
                    console.error('Firestore add exception:', err);
                }
            }

            // 2. Also save to local storage as instant local cache
            const reviews = getStoredReviews();
            reviews.unshift(newReview);
            saveStoredReviews(reviews);

            clientReviewForm.reset();
            if (reviewRatingInput) reviewRatingInput.value = '5';
            if (starPicker) {
                starPicker.querySelectorAll('.star-btn').forEach(s => s.classList.add('active'));
            }

            if (reviewFeedback) {
                const waReviewText = currentLang === 'ar'
                    ? `أهلاً موسى 👋\nلقد تركت لك تقييماً جديداً على الموقع:\n• الاسم: ${name}${role ? ` (${role})` : ''}\n• التقييم: ${'★'.repeat(rating)}\n• الرأي: "${comment}"`
                    : `Hi Mosa 👋\nI left a new review on your portfolio:\n• Name: ${name}${role ? ` (${role})` : ''}\n• Rating: ${'★'.repeat(rating)}\n• Review: "${comment}"`;

                const waReviewUrl = `https://wa.me/201096419945?text=${encodeURIComponent(waReviewText)}`;

                reviewFeedback.className = 'form-feedback success';
                reviewFeedback.innerHTML = currentLang === 'ar'
                    ? `<span>${translations.ar.reviews.successMsg}</span> <a href="${waReviewUrl}" target="_blank" rel="noopener noreferrer" style="color: #25D366; font-weight: 700; text-decoration: underline; margin-inline-start: 8px; display: inline-block; margin-top: 6px;"><i class="fa-brands fa-whatsapp"></i> إرسال نسخة لموسى على واتساب لتأكيد النشر</a>`
                    : `<span>${translations.en.reviews.successMsg}</span> <a href="${waReviewUrl}" target="_blank" rel="noopener noreferrer" style="color: #25D366; font-weight: 700; text-decoration: underline; margin-inline-start: 8px; display: inline-block; margin-top: 6px;"><i class="fa-brands fa-whatsapp"></i> Send a copy to Mosa on WhatsApp</a>`;
            }

            renderReviews();
        });
    }

    // Initialize Cloud Reviews sync on load
    initCloudReviews();

    // --------------------------------------------------------------------------
    // 9. Navbar Scroll & Mobile Menu
    // --------------------------------------------------------------------------
    window.addEventListener('scroll', () => {
        if (window.scrollY > 30) {
            navbar?.classList.add('scrolled');
        } else {
            navbar?.classList.remove('scrolled');
        }
    });

    if (menuToggle && mobileMenu) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('active');
            mobileMenu.classList.toggle('active');
            document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
        });

        mobileNavLinks.forEach(link => {
            link.addEventListener('click', () => {
                menuToggle.classList.remove('active');
                mobileMenu.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }

    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeModal();
            closeAddModal();
        }
    });

    // --------------------------------------------------------------------------
    // 10. GOOGLE ANTIGRAVITY ANIMATION SUITE & MICRO-INTERACTIONS
    // --------------------------------------------------------------------------
    let agObserver = null;

    // A) Scroll Reveal System (IntersectionObserver for .ag-reveal on scroll)
    function initAntigravityReveal() {
        if (agObserver) {
            agObserver.disconnect();
        }

        const revealElements = document.querySelectorAll('.ag-reveal:not(.is-revealed)');
        if (!revealElements.length) return;

        if ('IntersectionObserver' in window) {
            agObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('is-revealed');
                        agObserver.unobserve(entry.target);
                    }
                });
            }, {
                threshold: 0.08,
                rootMargin: '0px 0px -40px 0px' // Reveals smoothly as elements enter viewport while scrolling
            });

            const windowHeight = window.innerHeight || document.documentElement.clientHeight;
            revealElements.forEach(el => {
                // If element is already in the upper viewport on entrance, reveal it immediately
                const rect = el.getBoundingClientRect();
                if (rect.top >= 0 && rect.top < windowHeight * 0.75) {
                    el.classList.add('is-revealed');
                } else {
                    agObserver.observe(el);
                }
            });
        } else {
            revealElements.forEach(el => el.classList.add('is-revealed'));
        }
    }

    function triggerRevealForNewElements(container) {
        if (!container) return;
        if (document.body.classList.contains('entrance-active')) return;

        const newElements = container.querySelectorAll('.ag-reveal:not(.is-revealed)');
        if (!newElements.length) return;

        const windowHeight = window.innerHeight || document.documentElement.clientHeight;
        newElements.forEach((el, idx) => {
            const rect = el.getBoundingClientRect();
            // If the element is currently visible inside the viewport, reveal with stagger
            if (rect.top < windowHeight && rect.bottom > 0) {
                const delay = (idx % 6) * 50;
                el.style.setProperty('--reveal-delay', `${delay}ms`);
                setTimeout(() => {
                    el.classList.add('is-revealed');
                }, delay + 20);
            } else if (agObserver) {
                // Otherwise let the scroll observer reveal it when the user scrolls to it
                agObserver.observe(el);
            }
        });
    }

    // Orchestrated Entrance Cascade: reveals top navbar, hero, then registers scroll observer
    function triggerSiteEntranceReveal() {
        // 1. Reveal Navbar
        const navbar = document.getElementById('navbar');
        if (navbar) {
            navbar.classList.add('nav-entered');
        }

        // 2. Reveal Hero Profile Card (top of viewport)
        const profileCard = document.querySelector('.profile-id-card');
        if (profileCard) {
            profileCard.classList.add('is-revealed');
        }

        // 3. Register Scroll Reveal observer for all sections & cards down the page
        initAntigravityReveal();
    }

    // B) Antigravity Zero-Gravity Floating Particles Canvas
    function initAntigravityParticles() {
        const canvas = document.getElementById('agParticlesCanvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let width = window.innerWidth;
        let height = window.innerHeight;
        let dpr = Math.min(window.devicePixelRatio || 1, 2);
        let particles = [];
        let mouse = { x: -1000, y: -1000, radius: 150 };
        let isTabVisible = true;
        let rafId = null;

        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        function resizeCanvas() {
            width = window.innerWidth;
            height = window.innerHeight;
            dpr = Math.min(window.devicePixelRatio || 1, 2);
            canvas.width = Math.round(width * dpr);
            canvas.height = Math.round(height * dpr);
            ctx.setTransform(1, 0, 0, 1, 0, 0);
            ctx.scale(dpr, dpr);
        }
        resizeCanvas();

        window.addEventListener('resize', resizeCanvas, { passive: true });

        // Mouse and Touch Interaction
        window.addEventListener('mousemove', (e) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
        }, { passive: true });

        window.addEventListener('touchstart', (e) => {
            if (e.touches.length > 0) {
                mouse.x = e.touches[0].clientX;
                mouse.y = e.touches[0].clientY;
            }
        }, { passive: true });

        window.addEventListener('touchmove', (e) => {
            if (e.touches.length > 0) {
                mouse.x = e.touches[0].clientX;
                mouse.y = e.touches[0].clientY;
            }
        }, { passive: true });

        window.addEventListener('touchend', () => {
            mouse.x = -1000;
            mouse.y = -1000;
        }, { passive: true });

        window.addEventListener('mouseleave', () => {
            mouse.x = -1000;
            mouse.y = -1000;
        }, { passive: true });

        // Pause ONLY when switching browser tabs to save battery, never freeze on scroll
        document.addEventListener('visibilitychange', () => {
            isTabVisible = !document.hidden;
            if (isTabVisible && !rafId) {
                loop();
            }
        });

        // Luminous modern color palette (vibrant and clear on any monitor/screen)
        const darkColors = [
            'rgba(0, 140, 255, 0.75)',   // Electric Apple Blue
            'rgba(56, 189, 248, 0.70)',   // Cyan Glow
            'rgba(192, 132, 252, 0.65)',  // Cosmic Violet
            'rgba(251, 191, 36, 0.60)',   // Golden Star
            'rgba(255, 255, 255, 0.75)'   // Pure Starlight
        ];

        const lightColors = [
            'rgba(0, 113, 227, 0.55)',
            'rgba(14, 165, 233, 0.50)',
            'rgba(147, 51, 234, 0.45)',
            'rgba(245, 166, 35, 0.50)',
            'rgba(71, 85, 105, 0.45)'
        ];

        class Particle {
            constructor() {
                this.reset(true);
            }

            reset(initial = false) {
                this.x = initial ? Math.random() * width : (Math.random() < 0.5 ? 0 : width);
                this.y = initial ? Math.random() * height : Math.random() * height;
                this.baseRadius = Math.random() * 2.2 + 1.2;
                this.radius = this.baseRadius;
                const speedScale = prefersReducedMotion ? 0.08 : 0.35;
                this.baseVx = (Math.random() - 0.5) * speedScale;
                this.baseVy = (Math.random() - 0.5) * speedScale;
                this.vx = this.baseVx;
                this.vy = this.baseVy;
                this.colorIdx = Math.floor(Math.random() * darkColors.length);
                this.pulseSpeed = Math.random() * 0.03 + 0.01;
                this.pulse = Math.random() * Math.PI * 2;
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;

                // Subtle twinkling pulse
                this.pulse += this.pulseSpeed;
                this.radius = Math.max(0.8, this.baseRadius + Math.sin(this.pulse) * 0.5);

                // Screen boundaries wrap
                if (this.x < -10) this.x = width + 10;
                if (this.x > width + 10) this.x = -10;
                if (this.y < -10) this.y = height + 10;
                if (this.y > height + 10) this.y = -10;

                // Smooth Antigravity mouse repulsion
                const dx = this.x - mouse.x;
                const dy = this.y - mouse.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < mouse.radius && distance > 0) {
                    const force = (mouse.radius - distance) / mouse.radius;
                    const angle = Math.atan2(dy, dx);
                    this.vx += Math.cos(angle) * force * 0.5;
                    this.vy += Math.sin(angle) * force * 0.5;
                } else {
                    this.vx += (this.baseVx - this.vx) * 0.04;
                    this.vy += (this.baseVy - this.vy) * 0.04;
                }
            }

            draw() {
                const palette = currentTheme === 'light' ? lightColors : darkColors;
                const color = palette[this.colorIdx];
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                ctx.fillStyle = color;
                ctx.fill();
            }
        }

        // Responsive particle count (35 to 65 particles)
        const count = Math.max(35, Math.min(Math.floor(width / 24), 65));
        particles = [];
        for (let i = 0; i < count; i++) {
            particles.push(new Particle());
        }

        function drawConnections() {
            const maxDist = 80;
            const maxDistSq = maxDist * maxDist;
            const isLight = currentTheme === 'light';

            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const distSq = dx * dx + dy * dy;

                    if (distSq < maxDistSq) {
                        const alpha = (1 - Math.sqrt(distSq) / maxDist) * (isLight ? 0.12 : 0.18);
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.strokeStyle = isLight
                            ? `rgba(0, 113, 227, ${alpha})`
                            : `rgba(100, 180, 255, ${alpha})`;
                        ctx.lineWidth = 0.6;
                        ctx.stroke();
                    }
                }
            }
        }

        function loop() {
            if (!isTabVisible) {
                rafId = null;
                return;
            }

            ctx.clearRect(0, 0, width, height);

            for (let i = 0; i < particles.length; i++) {
                particles[i].update();
                particles[i].draw();
            }

            drawConnections();

            rafId = requestAnimationFrame(loop);
        }
        loop();
    }

    // D) 3D Perspective Card Tilt & Dynamic Glare Sheen (High Performance RAF)
    function initCardTilt() {
        if (window.matchMedia('(pointer: coarse)').matches) return;

        const tiltCards = document.querySelectorAll('.profile-id-card, .project-card, .feedback-card, .contact-card-apple');
        tiltCards.forEach(card => {
            if (card._tiltInitialized) return;
            card._tiltInitialized = true;

            let rect = null;
            let rafId = null;
            let isHovered = false;

            function updateRect() {
                rect = card.getBoundingClientRect();
            }

            card.addEventListener('mouseenter', () => {
                isHovered = true;
                updateRect();
                card.style.transition = 'transform 0.08s ease-out, box-shadow 0.25s ease';
            });

            card.addEventListener('mousemove', (e) => {
                if (!isHovered) return;
                if (!rect) updateRect();

                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;

                // Max tilt 5 degrees - smooth and physically pleasing
                const rotateX = Math.max(-5.5, Math.min(5.5, ((y - centerY) / centerY) * -5));
                const rotateY = Math.max(-5.5, Math.min(5.5, ((x - centerX) / centerX) * 5));

                if (rafId) cancelAnimationFrame(rafId);
                rafId = requestAnimationFrame(() => {
                    card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-4px)`;
                    card.style.setProperty('--mouse-x', `${x.toFixed(1)}px`);
                    card.style.setProperty('--mouse-y', `${y.toFixed(1)}px`);
                });
            });

            card.addEventListener('mouseleave', () => {
                isHovered = false;
                if (rafId) cancelAnimationFrame(rafId);
                rect = null;

                card.style.transition = 'transform 0.45s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.45s ease';
                card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)';

                setTimeout(() => {
                    if (!isHovered) {
                        card.style.transform = '';
                        card.style.transition = '';
                    }
                }, 460);
            });
        });
    }

    // --------------------------------------------------------------------------
    // 11. Cinematic Site Entrance Screen Controller (Preloader / Intro)
    // --------------------------------------------------------------------------
    function initSiteEntrance() {
        const entrance = document.getElementById('siteEntrance');
        if (!entrance) {
            document.body.classList.add('site-revealed');
            triggerSiteEntranceReveal();
            return;
        }

        // Lock scroll & keep elements holding until entrance curtain dissolves
        document.body.classList.add('entrance-active');
        document.body.style.overflow = 'hidden';

        const progressFill = document.getElementById('entranceProgressFill');
        const counterText = document.getElementById('entranceCounter');
        const statusText = document.getElementById('entranceStatus');
        const enterBtn = document.getElementById('entranceEnterBtn');

        let isEntered = false;
        let progress = 0;

        function exitEntrance() {
            if (isEntered) return;
            isEntered = true;

            entrance.classList.add('entrance-exiting');
            document.body.classList.remove('entrance-active');
            document.body.classList.add('site-revealed');
            document.body.style.overflow = '';

            // Choreographed cascade: elements reveal right in front of user as curtain dissolves
            setTimeout(() => {
                triggerSiteEntranceReveal();
            }, 80);

            setTimeout(() => {
                entrance.classList.add('entrance-hidden');
            }, 750);
        }

        // Animate counter and progress bar smoothly
        const duration = 1600; // 1.6 seconds total
        const startTime = performance.now();

        function updateProgress(currentTime) {
            if (isEntered) return;
            const elapsed = currentTime - startTime;
            progress = Math.min(100, Math.round((elapsed / duration) * 100));

            if (progressFill) progressFill.style.width = `${progress}%`;
            if (counterText) counterText.textContent = `${progress}%`;

            if (progress >= 100) {
                if (statusText) {
                    statusText.textContent = currentLang === 'ar' ? 'جاهز للاستكشاف • Ready' : 'Ready • Explore Now';
                }
                // Auto exit smoothly after reaching 100%
                setTimeout(() => {
                    exitEntrance();
                }, 400);
            } else {
                requestAnimationFrame(updateProgress);
            }
        }
        requestAnimationFrame(updateProgress);

        // Click on enter button
        enterBtn?.addEventListener('click', (e) => {
            e.stopPropagation();
            exitEntrance();
        });

        // Click anywhere on overlay skips/enters immediately
        entrance.addEventListener('click', () => {
            exitEntrance();
        });

        // Keyboard press (Enter, Space, Escape) skips immediately
        window.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ' || e.key === 'Escape') {
                if (!isEntered) {
                    exitEntrance();
                }
            }
        });
    }

    // --------------------------------------------------------------------------
    // 12. Final Application Initialization
    // --------------------------------------------------------------------------
    applyTheme(currentTheme);
    applyLanguage(currentLang);
    updateCalculator();
    renderReviews();

    // Launch Entrance screen & Antigravity animations (orchestrates reveals)
    initSiteEntrance();
    initAntigravityParticles();
    initCardTilt();
});

