import clientPromise from '../lib/mongodb';

export default async function handler(req, res) {
  const { transaction_id } = req.query;
  if (!transaction_id) return res.status(400).json({ error: 'Missing transaction_id' });

  const client = await clientPromise;
  const db = client.db('dnsv3');
  const order = await db.collection('orders').findOne({ transaction_id });

  if (!order || order.status !== 'completed') {
    return res.status(403).json({ error: 'Payment not completed or order not found' });
  }

  // Tạo nội dung file cấu hình động theo package
  const packageConfigs = {
    starter: 'device_limit=1\nduration=1m\nfilter=basic',
    pro: 'device_limit=3\nduration=3m\nfilter=pro',
    elite: 'device_limit=5\nduration=6m\nfilter=elite',
    ultimate: 'device_limit=10\nduration=12m\nfilter=ultimate'
  };
  const content = packageConfigs[order.package_id] || 'default config';
  const fileName = `dnsv3_${transaction_id}.conf`;

  res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
  res.setHeader('Content-Type', 'text/plain');
  res.send(content);
}
