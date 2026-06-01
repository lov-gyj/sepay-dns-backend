import redis from '../lib/redis';

export default async function handler(req, res) {
  const { ids } = req.query; // ids = "TX1,TX2"
  if (!ids) return res.json({ transactions: [] });

  const idList = ids.split(',');
  const results = [];
  for (const id of idList) {
    const data = await redis.get(id);
    if (data) {
      const order = JSON.parse(data);
      results.push({
        transaction_id: order.transaction_id,
        status: order.status,
        download_url: order.download_url
      });
    }
  }
  res.json({ transactions: results });
}
