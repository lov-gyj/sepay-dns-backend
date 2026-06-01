import redis from '../lib/redis';

export default async function handler(req, res) {
  const { transaction_id } = req.query;
  const data = await redis.get(transaction_id);
  if (!data) return res.status(404).json({ error: 'Not found' });

  const order = JSON.parse(data);
  if (order.status === 'completed') {
    return res.json({
      status: 'completed',
      transaction_id: order.transaction_id,
      download_url: `/api/download?transaction_id=${transaction_id}`
    });
  }
  res.json({ status: 'pending', transaction_id });
}
