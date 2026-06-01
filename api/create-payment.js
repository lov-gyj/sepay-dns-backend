import redis from '../lib/redis';
import axios from 'axios';

export default async function handler(req, res) {
  const { package_id } = req.body;
  const transactionId = 'DNS' + Date.now() + Math.random().toString(36).substring(2, 10);

  try {
    // Gọi SePay lấy QR (giống cũ)
    const sepayRes = await axios.post('https://my.sepay.dev/api/v1/payment/create', {
      amount: 150000,
      description: `DNS V3 - ${package_id}`,
      order_code: transactionId,
      return_url: `${process.env.BASE_URL}/payment-result`,
    }, {
      headers: { 'Authorization': `Bearer ${process.env.SEPAY_API_KEY}` }
    });

    const qrUrl = sepayRes.data?.data?.qr_data_url;

    // Lưu vào Redis với key là transactionId, hết hạn sau 1 giờ
    await redis.setex(transactionId, 3600, JSON.stringify({
      transaction_id: transactionId,
      package_id,
      status: 'pending',
      qr_url: qrUrl,
      created_at: new Date().toISOString()
    }));

    res.json({ transaction_id: transactionId, qr_url: qrUrl, status: 'pending' });
  } catch (err) {
    // fallback QR ảo nếu lỗi
    const fakeQr = `https://via.placeholder.com/300?text=QR+${transactionId}`;
    await redis.setex(transactionId, 3600, JSON.stringify({
      transaction_id: transactionId,
      package_id,
      status: 'pending',
      qr_url: fakeQr
    }));
    res.json({ transaction_id: transactionId, qr_url: fakeQr, status: 'pending' });
  }
}
