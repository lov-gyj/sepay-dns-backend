import { Redis } from '@upstash/redis';

const redis = Redis.fromEnv();

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  // SePay gửi webhook với body chứa description (chính là nội dung chuyển khoản)
  const { description, amount } = req.body;
  const transaction_id = description?.trim();

  if (!transaction_id) {
    return res.status(400).json({ error: 'Missing description' });
  }

  // Kiểm tra xem description có đúng định dạng younj... không
  if (!transaction_id.startsWith('younj')) {
    console.warn('Invalid transaction format:', transaction_id);
    return res.status(400).json({ error: 'Invalid transaction format' });
  }

  const data = await redis.get(transaction_id);
  if (!data) {
    console.warn('Order not found for:', transaction_id);
    return res.status(404).json({ error: 'Order not found' });
  }

  const order = JSON.parse(data);
  if (order.status !== 'completed') {
    order.status = 'completed';
    order.download_url = `/api/download?transaction_id=${transaction_id}`;
    await redis.setex(transaction_id, 86400, JSON.stringify(order)); // lưu 1 ngày
    console.log(`Order ${transaction_id} completed.`);
  }

  res.json({ success: true });
}
