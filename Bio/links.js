document.addEventListener('DOMContentLoaded', () => {

    const WORKER_URL = "https://cdn-links.bbi-younj.workers.dev";

    const notiBody = document.querySelector('.noti-popup-body');
    
    if (notiBody) {
        fetch(`${WORKER_URL}/api/noti`)
            .then(response => response.json())
            .then(data => {
                notiBody.innerHTML = '';
                
                data.forEach((noti, index) => {
                    const notiItem = document.createElement('div');
                    notiItem.className = 'noti-item-new';
                    
                    if (index > 0) {
                        notiItem.style.marginTop = '12px';
                    }
                    
                    notiItem.innerHTML = `
                        <p class="noti-time">${noti.time}</p>
                        <p class="noti-content">${noti.content}</p>
                    `;
                    notiBody.appendChild(notiItem);
                });
            })
            .catch(error => {
                console.error("Lỗi khi tải thông báo từ Worker:", error);
                notiBody.innerHTML = '<p class="noti-content" style="text-align:center; opacity:0.7;">Không thể tải thông báo lúc này.</p>';
            });
    }
    const linkItems = document.querySelectorAll('.link-item[data-link]');
    
    linkItems.forEach(item => {
        item.addEventListener('click', () => {
            const linkKey = item.getAttribute('data-link');
            if (linkKey) {
                const targetUrl = `${WORKER_URL}/${linkKey}`;
                window.open(targetUrl, '_blank', 'noopener,noreferrer');
            }
        });
    });
    const downloadBtns = document.querySelectorAll('.app-list .download-btn');
    
    downloadBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const key = btn.getAttribute('data-key');
            
            if (key) {
                if (typeof showToast === 'function') {
                    showToast('Đang chuyển hướng liên kết...', 'fa-solid fa-spinner fa-spin');
                }
                
                const targetUrl = `${WORKER_URL}/${key}`;
                window.open(targetUrl, '_blank');
            }
        });
    });
});
