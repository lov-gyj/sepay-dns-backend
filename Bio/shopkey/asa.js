        (function() {
            // ── Floating Particles ──
            const particlesContainer = document.getElementById('particles');
            const particleColors = ['#7B61FF', '#2D8CFF', '#a78bfa', '#00e5ff', '#ffb300', '#ff4081', '#4ade80'];
            for (let i = 0; i < 30; i++) {
                const particle = document.createElement('div');
                particle.classList.add('particle');
                const size = Math.random() * 6 + 3;
                particle.style.width = size + 'px';
                particle.style.height = size + 'px';
                particle.style.left = Math.random() * 100 + '%';
                particle.style.background = particleColors[Math.floor(Math.random() * particleColors.length)];
                particle.style.animationDuration = (Math.random() * 12 + 8) + 's';
                particle.style.animationDelay = (Math.random() * 10) + 's';
                particle.style.boxShadow = `0 0 ${size*3}px ${particle.style.background}`;
                particlesContainer.appendChild(particle);
            }

            // ── Loading Screen ──
            const loadingScreen = document.getElementById('loading-screen');
            window.addEventListener('load', () => {
                setTimeout(() => {
                    loadingScreen.classList.add('hidden');
                }, 800);
            });
            if (document.readyState === 'complete') {
                setTimeout(() => {
                    loadingScreen.classList.add('hidden');
                }, 400);
            }

            // ── Header scroll effect ──
            const header = document.getElementById('header');
            window.addEventListener('scroll', () => {
                if (window.scrollY > 20) {
                    header.classList.add('scrolled');
                } else {
                    header.classList.remove('scrolled');
                }
            }, { passive: true });

            // ── Scroll Reveal ──
            const revealEls = document.querySelectorAll('.reveal');
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
            revealEls.forEach(el => observer.observe(el));

            // ── Pusher ──
            const pusher = new Pusher('dc5b7f387763b9843b85', { cluster: 'ap1' });
            let currentChannel = null;

            // ── Bottom Sheet ──
            const sheetOverlay = document.getElementById('sheet-overlay');
            const paymentSheet = document.getElementById('payment-sheet');
            const sheetProductName = document.getElementById('sheet-product-name');
            const bankInfoEl = document.getElementById('sheet-bank-info');
            const originalBankInfoHTML = bankInfoEl.innerHTML;
            let currentProduct = '';
            let generatedCode = '';

// Hàm tạo mã ngẫu nhiên trên web
function generateCode() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = 'YOUNJ';
    for (let i = 0; i < 6; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
}

window.openSheet = function(productName) {
    currentProduct = productName;
    
    // 1. Tự tạo mã ngay trên web
    generatedCode = generateCode();
    
    // 2. Hiển thị UI
    bankInfoEl.innerHTML = originalBankInfoHTML;
    document.getElementById('qr-container').style.display = 'flex';
    document.querySelector('.btn-copy').style.display = 'inline-flex';
    sheetProductName.textContent = productName;
    
    const sheetCodeEl = document.getElementById('sheet-code');
    if (sheetCodeEl) sheetCodeEl.textContent = generatedCode;
    
    // 3. Tạo QR code với mã vừa sinh
    generateQR(generatedCode);
    
    // 4. Mở popup
    sheetOverlay.classList.add('active');
    paymentSheet.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    const confirmBtn = document.getElementById('btn-confirm-payment');
    confirmBtn.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" style="margin-right:6px;animation:loaderRotate 2s linear infinite;"><circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-width="3" stroke-dasharray="32" stroke-dashoffset="8"/></svg> ĐANG LẮNG NGHE THANH TOÁN...';
    confirmBtn.disabled = true;
    confirmBtn.style.opacity = '0.7';
    confirmBtn.style.background = 'linear-gradient(135deg, var(--gradient-start), var(--gradient-end))';
    confirmBtn.style.boxShadow = '0 10px 30px rgba(123, 97, 255, .35)';
    confirmBtn.onclick = null;
    
    // 5. Kết nối Pusher lắng nghe Backend báo về
    if (currentChannel) pusher.unsubscribe(currentChannel.name);
    const channelName = `payment-${generatedCode}`;
    currentChannel = pusher.subscribe(channelName);
    
    currentChannel.bind('payment-success', function(data) {
        document.getElementById('qr-container').style.display = 'none';
        document.querySelector('.btn-copy').style.display = 'none';
        bankInfoEl.innerHTML = `
            <div style="text-align:center;color:#16a34a;font-size:18px;margin-bottom:10px;font-weight:800;" class="success-anim">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="#16a34a" style="vertical-align:middle;margin-right:6px;"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
              THANH TOÁN THÀNH CÔNG!
            </div>
            <div style="text-align:center;font-size:14px;color:var(--subtext);margin-bottom:8px;">Dưới đây là Key sản phẩm của bạn [Lưu ý Key có giới hạn hãy dùng ngay sau khi mua !]</div>
            <div style="background:#EEF2F8;border:2px dashed #7B61FF;padding:16px;border-radius:12px;font-weight:bold;font-size:18px;color:#7B61FF;word-break:break-all;text-align:center;" class="success-anim">${data.key}</div>
        `;
        
        confirmBtn.disabled = false;
        confirmBtn.style.opacity = '1';
        confirmBtn.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" style="margin-right:6px;"><path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/></svg> SAO CHÉP KEY';
        confirmBtn.style.background = 'linear-gradient(135deg, #22c55e, #16a34a)';
        confirmBtn.style.boxShadow = '0 10px 30px rgba(34,197,94,.4)';
        
        confirmBtn.onclick = function() {
            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(data.key).then(() => showCustomToast('Đã sao chép Key!'));
            } else {
                fallbackCopy(data.key);
            }
        };
    });
};


            window.closeSheet = function() {
                sheetOverlay.classList.remove('active');
                paymentSheet.classList.remove('active');
                document.body.style.overflow = '';
                if (currentChannel) {
                    pusher.unsubscribe(currentChannel.name);
                    currentChannel = null;
                }
            };

            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && sheetOverlay.classList.contains('active')) closeSheet();
            });

            function generateQR(transferContent) {
                const qrContainer = document.getElementById('qr-container');
                if (!qrContainer) return;
                qrContainer.innerHTML =
                    '<img id="qr-image" alt="Mã QR Thanh Toán" style="width: 100%; height: auto; border-radius: 8px; display: block;" />';
                const qrImage = document.getElementById('qr-image');
                const bankId = 'MB';
                const accountNo = 'VQRQAKGHG6504';
                const accountName = 'KHONG MANH YEN';
                const amount = '20000';
                const qrUrl =
                    `https://img.vietqr.io/image/${bankId}-${accountNo}-compact.png?amount=${amount}&addInfo=${transferContent}&accountName=${encodeURIComponent(accountName)}`;
                qrImage.src = qrUrl;
            }

            window.copyCode = function() {
                const sheetCode = document.getElementById('sheet-code');
                const code = sheetCode ? sheetCode.textContent : '';
                if (navigator.clipboard && navigator.clipboard.writeText) {
                    navigator.clipboard.writeText(code).then(() => showCustomToast('Đã sao chép nội dung CK!'));
                } else {
                    fallbackCopy(code);
                }
            };

            function fallbackCopy(text) {
                const textarea = document.createElement('textarea');
                textarea.value = text;
                textarea.style.position = 'fixed';
                textarea.style.opacity = '0';
                document.body.appendChild(textarea);
                textarea.select();
                try { document.execCommand('copy'); } catch (e) {}
                document.body.removeChild(textarea);
                showCustomToast('Đã sao chép!');
            }

            function showCustomToast(msg) {
                const toast = document.getElementById('copy-toast');
                const toastMsg = document.getElementById('toast-msg');
                toastMsg.textContent = msg;
                toast.classList.add('show');
                clearTimeout(toast._timeout);
                toast._timeout = setTimeout(() => {
                    toast.classList.remove('show');
                }, 2000);
            }

            // ── FAQ Accordion ──
            window.toggleFAQ = function(btn) {
                const item = btn.parentElement;
                const isOpen = item.classList.contains('open');
                document.querySelectorAll('.faq-item.open').forEach(el => el.classList.remove('open'));
                if (!isOpen) item.classList.add('open');
            };

            // ── Bottom Navigation Scroll ──
            window.scrollToSection = function(sectionId, navBtn) {
                const section = document.getElementById(sectionId);
                if (section) {
                    const headerHeight = 100;
                    const top = section.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                    window.scrollTo({ top, behavior: 'smooth' });
                }
                document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
                if (navBtn) navBtn.classList.add('active');
            };

            const sections = ['hero', 'products-section', 'support-section'];
            const navItems = document.querySelectorAll('.nav-item');
            window.addEventListener('scroll', () => {
                let currentSection = 'hero';
                const scrollPos = window.scrollY + 150;
                sections.forEach(id => {
                    const el = document.getElementById(id);
                    if (el && el.offsetTop <= scrollPos) currentSection = id;
                });
                navItems.forEach(item => {
                    item.classList.remove('active');
                    if (item.getAttribute('data-target') === currentSection) item.classList.add('active');
                });
            }, { passive: true });

            // ── Ripple effect on buy buttons ──
            document.querySelectorAll('.btn-buy').forEach(btn => {
                btn.addEventListener('click', function(e) {
                    const ripple = document.createElement('span');
                    ripple.classList.add('ripple');
                    const rect = this.getBoundingClientRect();
                    const size = Math.max(rect.width, rect.height);
                    ripple.style.width = ripple.style.height = size + 'px';
                    ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
                    ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';
                    this.appendChild(ripple);
                    ripple.addEventListener('animationend', () => ripple.remove());
                });
            });

            console.log('%c🧠 YOUNJ KEY STORE %c v2026 %c✨',
                'font-weight:bold;color:#7B61FF;font-size:16px;',
                'color:#2D8CFF;',
                'color:#fbbf24;');
        })();