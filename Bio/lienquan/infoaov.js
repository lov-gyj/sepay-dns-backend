/**
 * infoaov.js
 * Quản lý link tải IPA và gán sự kiện cho các nút tải.
 */

// 🔗 Link IPA của bạn (Google Drive hoặc trực tiếp)
const IPA_DOWNLOAD_URL = 'https://drive.google.com/file/d/153Xu3y9yq9jA6-qFttmD2hb6CVnD4MRw/view?usp=drivesdk';

// Hàm xử lý tải chung
function handleDownload(e, buttonName = '') {
    e.preventDefault();

    if (!IPA_DOWNLOAD_URL || IPA_DOWNLOAD_URL === '') {
        alert('Link tải chưa được thiết lập.');
        return;
    }

    // Mở link trong tab mới
    window.open(IPA_DOWNLOAD_URL, '_blank');

    // Hiển thị toast nếu có sẵn
    if (typeof showToast === 'function') {
        showToast('Đang tải IPA...');
    }

    console.log(`📥 ${buttonName || 'Nút tải'} được nhấn → ${IPA_DOWNLOAD_URL}`);
}

// Gán sự kiện cho cả 2 nút
function initButtons() {
    // Nút chính: Tải IPA
    const btnMain = document.getElementById('btnDownloadPackage');
    if (btnMain) {
        btnMain.removeEventListener('click', handleDownload);
        btnMain.addEventListener('click', (e) => handleDownload(e, 'Tải IPA'));
    }

    // Nút phụ: Tải trực tiếp (trước đây là Install Manually)
    const btnDirect = document.getElementById('btnInstallManually');
    if (btnDirect) {
        btnDirect.removeEventListener('click', handleDownload);
        btnDirect.addEventListener('click', (e) => handleDownload(e, 'Tải trực tiếp'));
    }
}

// Bắt đầu khi DOM sẵn sàng
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initButtons);
} else {
    initButtons();
}