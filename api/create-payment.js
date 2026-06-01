import { Redis } from '@upstash/redis';

const redis = Redis.fromEnv();

function randomString(length) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { package_id } = req.body;
  if (!package_id) return res.status(400).json({ error: 'Missing package_id' });

  const amount = 150000;
  const suffix = randomString(6);           // 6 ký tự ngẫu nhiên
  const transactionCode = `younj${suffix}`; // nội dung chuyển khoản

  // Tạo QR code theo định dạng SePay với nội dung là transactionCode
  const bankCode = 'MB';                    // MB Bank
  const qrUrl = `https://qr.sepay.vn/img?acc=150313&bank=${bankCode}&amount=${amount}&des=${transactionCode}&template=compact`;

  // Lưu order vào Redis, hết hạn sau 1 giờ
  await redis.setex(transactionCode, 3600, JSON.stringify({
    transaction_id: transactionCode,
    package_id,
    amount,
    status: 'pending',
    qr_url: qrUrl,
    created_at: new Date().toISOString()
  }));

  // Trả về cho frontend
  res.json({
    transaction_id: transactionCode,
    qr_url: qrUrl,
    package_id,
    status: 'pending',
    amount: amount,
    transfer_content: transactionCode   // thêm trường này để frontend hiển thị nội dung
  });
}
