import clientPromise from '../lib/mongodb';

export default async function handler(req, res) {
  const { transaction_id } = req.query;
  if (!transaction_id) return res.status(400).json({ error: 'Missing transaction_id' });

  const client = await clientPromise;
  const db = client.db('dnsv3');
  const order = await db.collection('orders').findOne({ transaction_id });

  if (!order) return res.status(404).json({ error: 'Order not found' });

  if (order.status === 'completed') {
    return res.json({
      status: 'completed',
      transaction_id: order.transaction_id,
      download_url: order.download_url
    });
  } else {
    return res.json({
      status: 'pending',
      transaction_id: order.transaction_id
    });
  }
}
