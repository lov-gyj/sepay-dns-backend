import redis from '../lib/redis';

export default async function handler(req, res) {
  const { transaction_id, status } = req.body;
  if (!transaction_id) return res.status(400).end();

  const data = await redis.get(transaction_id);
  if (!data) return res.status(404).end();

  const order = JSON.parse(data);
  if (status === 'success' || status === 'completed') {
    order.status = 'completed';
    order.download_url = `/api/download?transaction_id=${transaction_id}`;
    await redis.setex(transaction_id, 86400, JSON.stringify(order)); // lưu 1 ngày
  } else {
    order.status = 'failed';
    await redis.setex(transaction_id, 3600, JSON.stringify(order));
  }
  res.json({ success: true });
}
