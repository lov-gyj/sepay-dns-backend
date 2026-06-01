import redis from '../lib/redis';

export default async function handler(req, res) {
  const { transaction_id } = req.query;
  const data = await redis.get(transaction_id);
  if (!data) return res.status(404).send('Order not found');

  const order = JSON.parse(data);
  if (order.status !== 'completed') return res.status(403).send('Payment not completed');

  // Nội dung file config
  const content = `# DNS V3 Config\nPackage: ${order.package_id}\nTransaction: ${transaction_id}`;
  res.setHeader('Content-Disposition', `attachment; filename="dnsv3_${transaction_id}.conf"`);
  res.send(content);
}
