import redis from './_lib/redis.js';

export default async function handler(req, res) {
  // Chỉ cho phép phương thức POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { code, package: pkg, amount } = req.body;

  if (!code || !pkg || !amount) {
    return res.status(400).json({ error: 'Missing required fields: code, package, amount' });
  }

  try {
    // Lưu giao dịch với thời gian sống 10 phút (600 giây)
    // Dùng `JSON.stringify` để lưu object
    await redis.set(`tx:${code}`, JSON.stringify({
      code,
      package: pkg,
      amount,
      time: Date.now(),
      paid: false
    }), { ex: 600 }); // TTL 600 giây

    console.log(`✅ Đã tạo giao dịch: ${code}`);
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Lỗi khi tạo giao dịch:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
