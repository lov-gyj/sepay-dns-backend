document.addEventListener("DOMContentLoaded", () => {
    // Kích hoạt plugin ScrollTrigger của GSAP
    gsap.registerPlugin(ScrollTrigger);

    // ==========================================
    // 1. GSAP TIMELINE: Hiệu ứng mở trang (Load Animations)
    // ==========================================
    const masterTl = gsap.timeline({ defaults: { ease: "power3.out" } });

    // Đặt trạng thái ban đầu cho các phần tử trên cùng (Hero Section)
    gsap.set(".profile-section", { opacity: 1, y: 0 }); // Reset class .reveal của phần này để GSAP kiểm soát
    gsap.set([".avatar-container", ".greeting", ".name-wrapper", ".role-text"], { y: 30, opacity: 0 });
    gsap.set(".social-btn", { scale: 0, opacity: 0 });

    masterTl
        // Bật nảy Avatar
        .to(".avatar-container", {
            y: 0,
            opacity: 1,
            duration: 1,
            ease: "elastic.out(1, 0.5)"
        })
        // Chữ trượt lên từ từ
        .to([".greeting", ".name-wrapper", ".role-text"], {
            y: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.15
        }, "-=0.6")
        // Các nút mạng xã hội bung ra lần lượt
        .to(".social-btn", {
            scale: 1,
            opacity: 1,
            duration: 0.6,
            stagger: 0.1,
            ease: "back.out(1.7)"
        }, "-=0.4");


    // ==========================================
    // 2. GSAP SCROLLTRIGGER: Đồng bộ hóa với hệ thống Reveal cũ
    // ==========================================
    
    // Tự động quét tất cả các phần tử có class .reveal (trừ phần profile đã chạy lúc đầu)
    const revealElements = document.querySelectorAll(".reveal:not(.profile-section)");
    
    revealElements.forEach((element) => {
        // Kiểm tra xem phần tử có chứa danh sách app hay không để tạo hiệu ứng stagger cho các con bên trong
        const appCards = element.querySelectorAll(".app-card");
        const linkItems = element.querySelectorAll(".link-item");
        
        if (appCards.length > 0) {
            // Nếu là vùng chứa App Cards, làm mượt từng card con xuất hiện tuần tự
            gsap.from(appCards, {
                scrollTrigger: {
                    trigger: element,
                    start: "top 85%", // Kích hoạt khi phần tử cách đáy màn hình 15%
                    toggleActions: "play none none none"
                },
                y: 40,
                opacity: 0,
                duration: 0.6,
                stagger: 0.1,
                ease: "power2.out",
                onStart: () => element.classList.add("active") // Đồng bộ kích hoạt hiển thị vùng chứa
            });
        } else if (linkItems.length > 0) {
            // Nếu là vùng chứa Link Items (Main Card)
            gsap.from(linkItems, {
                scrollTrigger: {
                    trigger: element,
                    start: "top 85%",
                    toggleActions: "play none none none"
                },
                x: -30,
                opacity: 0,
                duration: 0.5,
                stagger: 0.08,
                ease: "power2.out",
                onStart: () => element.classList.add("active")
            });
        } else {
            // Các phần tử reveal thông thường (Tiêu đề, Music Player, Footer...)
            gsap.to(element, {
                scrollTrigger: {
                    trigger: element,
                    start: "top 85%",
                    toggleActions: "play none none none",
                    onEnter: () => element.classList.add("active") // Ép thêm class active từ CSS gốc của bạn để hiện ra
                }
            });
        }
    });


    // ==========================================
    // 3. WEB ANIMATIONS API: Hiệu ứng đốm sáng nền trôi nổi
    // ==========================================
    const lights = document.querySelectorAll(".glass-light");
    
    lights.forEach((light) => {
        const randomX = () => Math.floor(Math.random() * 80) - 40;
        const randomY = () => Math.floor(Math.random() * 80) - 40;
        
        light.animate(
            [
                { transform: `translate(0px, 0px) scale(1)` },
                { transform: `translate(${randomX()}px, ${randomY()}px) scale(1.05)` },
                { transform: `translate(${randomX()}px, ${randomY()}px) scale(0.95)` },
                { transform: `translate(0px, 0px) scale(1)` }
            ],
            {
                duration: 12000 + Math.random() * 4000,
                iterations: Infinity,
                direction: "alternate",
                easing: "ease-in-out"
            }
        );
    });

    // ==========================================
    // 4. MICRO-INTERACTION: Hiệu ứng di chuột / chạm 3D nhẹ
    // ==========================================
    const mainCard = document.querySelector(".main-card");
    if (mainCard) {
        mainCard.addEventListener("mousemove", (e) => {
            const rect = mainCard.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = ((y - centerY) / centerY) * -4;
            const rotateY = ((x - centerX) / centerX) * 4;

            gsap.to(mainCard, {
                rotationX: rotateX,
                rotationY: rotateY,
                transformPerspective: 1000,
                duration: 0.3,
                ease: "power1.out"
            });
        });

        mainCard.addEventListener("mouseleave", () => {
            gsap.to(mainCard, {
                rotationX: 0,
                rotationY: 0,
                duration: 0.6,
                ease: "elastic.out(1, 0.3)"
            });
        });
    }
});
