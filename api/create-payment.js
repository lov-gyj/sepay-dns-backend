import clientPromise from '../lib/mongodb';
import axios from 'axios';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { package_id } = req.body;
  if (!package_id) return res.status(400).json({ error: 'Missing package_id' });

  const amount = 150000;
  const transactionId = 'DNS' + Date.now() + Math.random().toString(36).substring(2, 10).toUpperCase();

  try {
    // Gọi SePay tạo QR
    const sepayRes = await axios.post(
      'https://my.sepay.dev/api/v1/payment/create',
      {
        amount,
        description: `DNS V3 - ${package_id}`,
        order_code: transactionId,
        return_url: `${process.env.BASE_URL}/payment-result`,
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.SEPAY_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const qrUrl = sepayRes.data?.data?.qr_data_url || sepayRes.data?.data?.qr_code_url;
    if (!qrUrl) throw new Error('No QR from SePay');

    // Lưu order vào MongoDB
    const client = await clientPromise;
    const db = client.db('dnsv3');
    await db.collection('orders').insertOne({
      transaction_id: transactionId,
      package_id,
      amount,
      status: 'pending',
      qr_url: qrUrl,
      download_url: null,
      created_at: new Date(),
      updated_at: new Date()
    });

    return res.json({
      transaction_id: transactionId,
      qr_url: qrUrl,
      package_id,
      status: 'pending'
    });
  } catch (err) {
    console.error(err);
    // Fallback: tạo QR giả (cho test không cần SePay thật)
    const fakeQr = `https://via.placeholder.com/300?text=QR+${transactionId}`;
    const client = await clientPromise;
    const db = client.db('dnsv3');
    await db.collection('orders').insertOne({
      transaction_id: transactionId,
      package_id,
      amount,
      status: 'pending',
      qr_url: fakeQr,
      download_url: null,
      created_at: new Date(),
      updated_at: new Date()
    });
    return res.json({
      transaction_id: transactionId,
      qr_url: fakeQr,
      package_id,
      status: 'pending'
    });
  }
}
