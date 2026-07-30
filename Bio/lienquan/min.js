        (function() {
            // ==================== PACKAGE DATA ====================
            const defaultPackageData = {
                brand: "Younj OS",
                appName: "Garena Liên Quân Mobile",
                version: "v1.63.11692297",
                size: "212.02 MB",
                linkCount: 1,
                countdownSeconds: 7,
                subtitle: "Premium distribution package",
                type: "IPA",
                features: [
                    "Camera Input",
                    "Advanced install flow",
                    "Premium package delivery",
                    "One-tap open in app"
                ]
            };

            const alternativePackages = {
                lienquan: defaultPackageData,
                pubg: {
                    brand: "Younj OS",
                    appName: "PUBG Mobile iOS Package",
                    version: "v3.2.0.18765",
                    size: "2.4 GB",
                    linkCount: 1,
                    countdownSeconds: 7,
                    subtitle: "Premium battle royale distribution",
                    type: "IPA",
                    features: [
                        "HD Graphics",
                        "Ultra frame rate",
                        "Premium delivery",
                        "Auto install assist"
                    ]
                },
                tool: {
                    brand: "Younj OS",
                    appName: "Younj OS Utility Tool",
                    version: "v2.1.0",
                    size: "45 MB",
                    linkCount: 1,
                    countdownSeconds: 5,
                    subtitle: "System utility for Younj OS",
                    type: "IPA",
                    features: [
                        "System cleanup",
                        "Performance boost",
                        "Network tools",
                        "Quick settings"
                    ]
                },
                config: {
                    brand: "Younj OS",
                    appName: "Younj OS Config Profile",
                    version: "v1.0.3",
                    size: "12 KB",
                    linkCount: 1,
                    countdownSeconds: 3,
                    subtitle: "Configuration profile installer",
                    type: "mobileconfig",
                    features: [
                        "One-tap install",
                        "Secure profile",
                        "Auto renew",
                        "Trusted source"
                    ]
                }
            };

            let currentPackage = { ...defaultPackageData };
            // ==================== DOM REFS ====================
            const $ = (sel) => document.querySelector(sel);
            const $$ = (sel) => document.querySelectorAll(sel);

            const preloader = $('#preloader');
            const appShell = $('#appShell');
            const header = $('#header');
            const heroCard = $('#heroCard');
            const heroAppIcon = $('#heroAppIcon');
            const heroBadge = $('#heroBadge');
            const heroTitle = $('#heroTitle');
            const heroSubtitle = $('#heroSubtitle');
            const heroMetaPills = $('#heroMetaPills');
            const heroTimerPill = $('#heroTimerPill');
            const linksBadge = $('#linksBadge');
            const linksTitle = $('#linksTitle');
            const linkCardTitle = $('#linkCardTitle');
            const linkProgressBar = $('#linkProgressBar');
            const linkCardStatus = $('#linkCardStatus');
            const linkCard = $('#linkCard');
            const methodBadge = $('#methodBadge');
            const btnDownloadPackage = $('#btnDownloadPackage');
            const searchModal = $('#searchModal');
            const searchInput = $('#searchInput');
            const searchResults = $('#searchResults');
            const menuDrawer = $('#menuDrawer');
            const menuOverlay = $('#menuOverlay');
            const toastContainer = $('#toastContainer');
            const cursorRing = $('#cursorRing');
            const themeToggle = $('#themeToggle');
            const allReveal = $$('.reveal');

            let countdownInterval = null;
            let remainingSeconds = currentPackage.countdownSeconds;
            let timerFinished = false;

            // ==================== FUNCTIONS ====================
            function renderPackageData(data) {
                heroTitle.textContent = data.appName;
                heroSubtitle.textContent = data.subtitle;
                linkCardTitle.textContent = `${data.appName} ${data.version}`;
                linksTitle.textContent = data.appName;
                heroMetaPills.innerHTML = `
                    <span class="meta-pill">${data.version}</span>
                    <span class="meta-pill">${data.size}</span>
                    <span class="meta-pill">${data.linkCount} link</span>
                    <span class="meta-pill timer" id="heroTimerPill">00:0${data.countdownSeconds}</span>
                `;
                btnDownloadPackage.textContent = `Download File iPA (${data.size})`;
                // Re-grab timer pill reference
                window.heroTimerPill = $('#heroTimerPill');
                remainingSeconds = data.countdownSeconds;
                timerFinished = false;
                if (countdownInterval) clearInterval(countdownInterval);
                startCountdown();
                // Update link card features
                const featuresEl = linkCard.querySelector('.link-card-features');
                if (featuresEl) {
                    featuresEl.textContent = data.features.join(' · ');
                }
                // Update hero icon image? Keep same logo.
            }

            function startCountdown() {
                if (countdownInterval) clearInterval(countdownInterval);
                remainingSeconds = currentPackage.countdownSeconds;
                timerFinished = false;
                updateTimerDisplay();
                linkProgressBar.style.width = '0%';
                linkCardStatus.innerHTML = '<span class="status-dot"></span> Preparing secure package...';
                linksBadge.textContent = 'AVAILABLE LINKS';
                methodBadge.textContent = 'PREPARING...';
                btnDownloadPackage.style.opacity = '0.7';
                btnDownloadPackage.style.pointerEvents = 'auto';

                const total = currentPackage.countdownSeconds;
                const startTime = Date.now();
                const totalMs = total * 1000;

                countdownInterval = setInterval(() => {
                    const elapsed = Date.now() - startTime;
                    const progress = Math.min(elapsed / totalMs, 1);
                    linkProgressBar.style.width = `${progress * 100}%`;
                    const left = Math.max(0, Math.ceil((totalMs - elapsed) / 1000));
                    remainingSeconds = left;
                    updateTimerDisplay();
                    if (left <= 0) {
                        clearInterval(countdownInterval);
                        countdownInterval = null;
                        timerFinished = true;
                        onTimerComplete();
                    }
                }, 200);
            }

            function updateTimerDisplay() {
                const mins = Math.floor(remainingSeconds / 60);
                const secs = remainingSeconds % 60;
                const display = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
                const pill = $('#heroTimerPill');
                if (pill) pill.textContent = display;
            }

            function onTimerComplete() {
                linksBadge.textContent = 'LINKS READY';
                methodBadge.textContent = 'LINKS READY';
                linkCardStatus.innerHTML = '<span class="status-dot" style="background:#22c55e;"></span> Secure package ready';
                linkProgressBar.style.width = '100%';
                btnDownloadPackage.style.opacity = '1';
                const pill = $('#heroTimerPill');
                if (pill) pill.textContent = 'READY';
                // highlight choose method section
                const methodSection = $('#chooseMethodSection');
                if (methodSection) {
                    methodSection.style.transition = 'box-shadow 0.5s ease';
                    methodSection.style.boxShadow = '0 0 30px rgba(230,34,58,0.25)';
                    setTimeout(() => { methodSection.style.boxShadow = ''; }, 2000);
                }
                showToast('Secure package is ready!');
            }

            // ==================== PRELOADER ====================
            function initPreloader() {
                setTimeout(() => {
                    preloader.classList.add('hidden');
                    appShell.classList.add('visible');
                }, 1500);
            }

            // ==================== THEME ====================
            function initTheme() {
                const saved = localStorage.getItem('younj-os-theme');
                if (saved === 'dark') {
                    document.body.classList.add('dark-mode');
                }
                themeToggle.addEventListener('click', () => {
                    document.body.classList.toggle('dark-mode');
                    const isDark = document.body.classList.contains('dark-mode');
                    localStorage.setItem('younj-os-theme', isDark ? 'dark' : 'light');
                });
            }

            // ==================== COUNTDOWN ====================
            function initCountdown() {
                startCountdown();
            }

            // ==================== REVEAL ANIMATIONS ====================
            function initRevealAnimations() {
                const observer = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            entry.target.classList.add('visible');
                        }
                    });
                }, { threshold: 0.15, rootMargin: '0px 0px -30px 0px' });
                allReveal.forEach(el => observer.observe(el));
            }

            // ==================== MAGNETIC BUTTONS ====================
            function initMagneticButtons() {
                const buttons = document.querySelectorAll('.btn-cta, .btn-secondary, .telegram-cta, .step-card');
                buttons.forEach(btn => {
                    btn.addEventListener('mousemove', (e) => {
                        if (window.innerWidth < 768) return;
                        const rect = btn.getBoundingClientRect();
                        const x = e.clientX - rect.left - rect.width / 2;
                        const y = e.clientY - rect.top - rect.height / 2;
                        btn.style.transform = `translate(${x * 0.08}px, ${y * 0.08}px)`;
                    });
                    btn.addEventListener('mouseleave', () => {
                        btn.style.transform = '';
                    });
                });
            }

            // ==================== RIPPLE ====================
            function createRipple(e, el) {
                const ripple = document.createElement('span');
                ripple.className = 'ripple';
                const rect = el.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                ripple.style.width = ripple.style.height = `${size}px`;
                ripple.style.left = `${e.clientX - rect.left - size / 2}px`;
                ripple.style.top = `${e.clientY - rect.top - size / 2}px`;
                el.style.position = el.style.position || 'relative';
                el.style.overflow = 'hidden';
                el.appendChild(ripple);
                ripple.addEventListener('animationend', () => ripple.remove());
            }

            function initRippleButtons() {
                const rippleTargets = document.querySelectorAll(
                    '.btn-cta, .btn-secondary, .telegram-cta, .icon-btn, .step-card');
                rippleTargets.forEach(el => {
                    el.addEventListener('click', function(e) {
                        createRipple(e, el);
                    });
                });
            }

            // ==================== SEARCH PANEL ====================
            function initSearchPanel() {
                const searchBtn = $('#searchBtn');
                const closeSearch = $('#closeSearch');
                searchBtn.addEventListener('click', () => searchModal.classList.add('open'));
                closeSearch.addEventListener('click', () => searchModal.classList.remove('open'));
                searchModal.addEventListener('click', (e) => {
                    if (e.target === searchModal) searchModal.classList.remove('open');
                });
                searchResults.addEventListener('click', (e) => {
                    const item = e.target.closest('.search-result-item');
                    if (item) {
                        const pkgKey = item.dataset.package;
                        if (alternativePackages[pkgKey]) {
                            currentPackage = { ...alternativePackages[pkgKey] };
                            renderPackageData(currentPackage);
                            searchModal.classList.remove('open');
                            showToast(`Switched to ${currentPackage.appName}`);
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                        }
                    }
                });
                searchInput.addEventListener('input', () => {
                    const val = searchInput.value.toLowerCase();
                    const items = searchResults.querySelectorAll('.search-result-item');
                    items.forEach(item => {
                        item.style.display = item.textContent.toLowerCase().includes(val) ? '' :
                            'none';
                    });
                });
            }

            // ==================== DRAWER ====================
            function initDrawer() {
                const menuBtn = $('#menuBtn');
                menuBtn.addEventListener('click', () => {
                    menuDrawer.classList.add('open');
                    menuOverlay.classList.add('open');
                });
                menuOverlay.addEventListener('click', () => {
                    menuDrawer.classList.remove('open');
                    menuOverlay.classList.remove('open');
                });
                const menuItems = menuDrawer.querySelectorAll('.menu-item');
                menuItems.forEach(item => {
                    item.addEventListener('click', () => {
                        menuDrawer.classList.remove('open');
                        menuOverlay.classList.remove('open');
                    });
                });
            }

            // ==================== TOASTS ====================
            function showToast(message) {
                const toast = document.createElement('div');
                toast.className = 'toast';
                toast.textContent = message;
                toastContainer.appendChild(toast);
                setTimeout(() => {
                    if (toast.parentNode) toast.remove();
                }, 3000);
            }

            function initToasts() {
                btnDownloadPackage.addEventListener('click', () => {
                    if (!timerFinished) {
                        showToast('Please wait for secure package preparation...');
                        return;
                    }
                    showToast('Preparing secure package...');
                });
                $('#btnInstallManually').addEventListener('click', () => showToast('Install flow opened'));
                $('#btnInstallConfig').addEventListener('click', () => showToast('Config install started'));
                $('#btnTelegram').addEventListener('click', () => showToast('Opening Telegram'));
                $('#stepCard1').addEventListener('click', () => showToast('Open the Younj OS main website.'));
                $('#stepCard2').addEventListener('click', () => showToast('Open the website to purchase iCloud lock configurations.'));
            }

            // ==================== CARD TILT ====================
            function initCardTilt() {
                const cards = document.querySelectorAll('.hero-card, .link-card, .method-card, .cert-card, .step-card');
                cards.forEach(card => {
                    card.addEventListener('mousemove', (e) => {
                        if (window.innerWidth < 768) return;
                        const rect = card.getBoundingClientRect();
                        const x = e.clientX - rect.left;
                        const y = e.clientY - rect.top;
                        const rotateX = ((y / rect.height) - 0.5) * -4;
                        const rotateY = ((x / rect.width) - 0.5) * 4;
                        card.style.transform =
                            `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
                    });
                    card.addEventListener('mouseleave', () => {
                        card.style.transform = '';
                    });
                });
            }

            // ==================== PARALLAX ====================
            function initParallax() {
                const blobs = document.querySelectorAll('.ambient-blob');
                window.addEventListener('scroll', () => {
                    const scrolled = window.scrollY;
                    blobs.forEach((blob, i) => {
                        const speed = 0.03 + i * 0.01;
                        blob.style.transform = `translateY(${scrolled * speed}px)`;
                    });
                });
            }

            // ==================== CUSTOM CURSOR ====================
            function initCustomCursor() {
                if (window.innerWidth < 768) return;
                document.addEventListener('mousemove', (e) => {
                    cursorRing.style.opacity = '1';
                    cursorRing.style.left = `${e.clientX}px`;
                    cursorRing.style.top = `${e.clientY}px`;
                });
                document.addEventListener('mouseleave', () => {
                    cursorRing.style.opacity = '0';
                });
                const interactive = document.querySelectorAll('button, a, .search-result-item, .step-card');
                interactive.forEach(el => {
                    el.addEventListener('mouseenter', () => {
                        cursorRing.style.width = '36px';
                        cursorRing.style.height = '36px';
                        cursorRing.style.borderColor = 'rgba(230,34,58,0.9)';
                    });
                    el.addEventListener('mouseleave', () => {
                        cursorRing.style.width = '24px';
                        cursorRing.style.height = '24px';
                        cursorRing.style.borderColor = 'rgba(230,34,58,0.6)';
                    });
                });
            }

            // ==================== HEADER SCROLL EFFECT ====================
            function initHeaderScroll() {
                window.addEventListener('scroll', () => {
                    if (window.scrollY > 10) {
                        header.classList.add('scrolled');
                    } else {
                        header.classList.remove('scrolled');
                    }
                });
            }

            // ==================== FLOATING BLOBS ANIMATION ====================
            function initFloatingBlobs() {
                const blobs = document.querySelectorAll('.ambient-blob');
                let mouseX = 0,
                    mouseY = 0;
                document.addEventListener('mousemove', (e) => {
                    mouseX = e.clientX;
                    mouseY = e.clientY;
                });
                const animate = () => {
                    blobs.forEach((blob, i) => {
                        const speed = 0.005 + i * 0.002;
                        const offsetX = (mouseX - window.innerWidth / 2) * speed;
                        const offsetY = (mouseY - window.innerHeight / 2) * speed;
                        blob.style.transform =
                            `translate(${offsetX}px, ${offsetY}px) translateY(${window.scrollY * 0.02}px)`;
                    });
                    requestAnimationFrame(animate);
                };
                requestAnimationFrame(animate);
            }

            // ==================== INIT ====================
            function init() {
                initPreloader();
                initTheme();
                initCountdown();
                initRevealAnimations();
                initMagneticButtons();
                initRippleButtons();
                initSearchPanel();
                initDrawer();
                initToasts();
                initCardTilt();
                initParallax();
                initCustomCursor();
                initHeaderScroll();
                initFloatingBlobs();
                // Re-render on load
                renderPackageData(currentPackage);
            }

            // Start everything
            document.addEventListener('DOMContentLoaded', init);
        })();