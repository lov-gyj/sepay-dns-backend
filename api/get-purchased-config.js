import redis from './_lib/redis.js';

export default async function handler(req, res) {
  const { code } = req.query;

  if (!code) {
    return res.status(400).json({ error: 'Missing transaction code' });
  }

  try {
    const rawPurchase = await redis.get(`purchased:${code}`);
    
    if (!rawPurchase) {
      return res.status(404).json({ success: false, error: 'Transaction not found' });
    }

    const purchase = JSON.parse(rawPurchase);
    return res.status(200).json({
      success: true,
      package: purchase.package,
      date: purchase.date,
      downloadUrl: purchase.downloadUrl
    });
  } catch (error) {
    console.error('Lỗi khi lấy cấu hình:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
