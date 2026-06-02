import redis from './_lib/redis.js';

export default async function handler(req, res) {
  // Chỉ cho phép GET
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { code } = req.query;
  if (!code) {
    return res.status(400).json({ error: 'Missing transaction code' });
  }

  try {
    // Lấy giao dịch từ Redis
    const rawTx = await redis.get(`tx:${code}`);
    if (!rawTx) {
      return res.status(200).json({ paid: false });
    }
    
    const transaction = JSON.parse(rawTx);
    const isPaid = transaction.paid === true;
    
    return res.status(200).json({ paid: isPaid });
  } catch (error) {
    console.error('Error checking payment:', error);
    return res.status(200).json({ paid: false });
  }
}
