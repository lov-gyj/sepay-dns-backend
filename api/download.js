import redis from './_lib/redis.js';

export default async function handler(req, res) {
  const { code, type } = req.query;

  if (!code || !type) {
    return res.status(400).send('Missing code or type');
  }

  try {
    // Kiểm tra mã giao dịch có hợp lệ không
    const rawPurchase = await redis.get(`purchased:${code}`);
    if (!rawPurchase) {
      return res.status(403).send('Invalid or expired transaction code');
    }

    // TODO: Thay thế URL này bằng link thật đến file .mobileconfig của bạn
    // Bạn có thể upload file lên GitHub và lấy link raw, hoặc dùng dịch vụ lưu trữ khác
    const fileUrls = {
      dns1: 'https://your-storage.com/config_dns1.mobileconfig',
      dns2: 'https://your-storage.com/config_dns2.mobileconfig',
      dns3: 'https://your-storage.com/config_dns3.mobileconfig'
    };

    const fileUrl = fileUrls[type];
    if (!fileUrl) {
      return res.status(404).send('Configuration file not found for this package');
    }

    // Chuyển hướng đến URL của file cấu hình
    return res.redirect(fileUrl);
  } catch (error) {
    console.error('Lỗi khi tải file:', error);
    return res.status(500).send('Internal server error');
  }
}
