import clientPromise from '../lib/mongodb';
import crypto from 'crypto';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  // Xác thực signature (tuỳ chọn nếu SePay có)
  const signature = req.headers['x-signature'];
  const rawBody = JSON.stringify(req.body);
  if (process.env.SEPAY_WEBHOOK_SECRET && signature) {
    const hmac = crypto.createHmac('sha256', process.env.SEPAY_WEBHOOK_SECRET);
    const computed = hmac.update(rawBody).digest('hex');
    if (computed !== signature) {
      console.warn('Invalid signature');
      return res.status(401).json({ error: 'Invalid signature' });
    }
  }

  const { transaction_id, status } = req.body;
  if (!transaction_id) return res.status(400).json({ error: 'Missing transaction_id' });

  const client = await clientPromise;
  const db = client.db('dnsv3');
  const order = await db.collection('orders').findOne({ transaction_id });
  if (!order) return res.status(404).json({ error: 'Order not found' });

  if (status === 'success' || status === 'completed') {
    // Tạo download_url động (sẽ xử lý trong api/download)
    const downloadUrl = `${process.env.BASE_URL}/api/download?transaction_id=${transaction_id}`;
    await db.collection('orders').updateOne(
      { transaction_id },
      {
        $set: {
          status: 'completed',
          download_url: downloadUrl,
          updated_at: new Date()
        }
      }
    );
  } else {
    await db.collection('orders').updateOne(
      { transaction_id },
      { $set: { status: 'failed', updated_at: new Date() } }
    );
  }

  res.json({ success: true });
}
