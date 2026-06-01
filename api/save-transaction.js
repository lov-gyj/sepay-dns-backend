import redis from './_lib/redis.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { transactionCode, packageType, timestamp } = req.body;

  if (!transactionCode || !packageType) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const downloadUrl = `/api/download?code=${transactionCode}&type=${packageType}`;
    const purchaseData = {
      package: packageType,
      date: timestamp || new Date().toISOString(),
      downloadUrl
    };
    
    await redis.set(`purchased:${transactionCode}`, JSON.stringify(purchaseData), { ex: 365 * 24 * 60 * 60 });
    console.log(`✅ Đã lưu giao dịch đã mua: ${transactionCode}`);
    
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Lỗi khi lưu giao dịch:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
