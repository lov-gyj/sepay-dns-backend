// api/sepay-webhook.js
import redis from './_lib/redis.js';
import crypto from 'crypto';  // <--- THÊM DÒNG NÀY (ở đầu file, sau import redis)

// Hàm xác thực chữ ký
function verifySignature(payload, signature, secret) {
  const expected = crypto
    .createHmac('sha256', secret)
    .update(JSON.stringify(payload))
    .digest('hex');
  return signature === expected;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const payload = req.body;
    console.log('📥 Webhook từ SePay:', payload);

    // ========== THÊM ĐOẠN XÁC THỰC NGAY SAU ĐÂY ==========
    const signature = req.headers['x-sepay-signature'];
    const secret = process.env.SEPAY_SECRET;
    
    // Nếu bạn đã cấu hình HMAC trên SePay và có secret
    if (secret && signature) {
      if (!verifySignature(payload, signature, secret)) {
        console.error('❌ Chữ ký không hợp lệ!');
        return res.status(401).json({ error: 'Invalid signature' });
      }
      console.log('✅ Xác thực chữ ký thành công');
    }
    // ====================================================

    // Phần xử lý webhook như cũ...
    if (payload.transferType !== 'in') {
      return res.status(200).json({ success: true });
    }

    const transactionCode = payload.content?.trim();
    // ... (các code còn lại giữ nguyên)
