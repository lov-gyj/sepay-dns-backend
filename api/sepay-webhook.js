// api/sepay-webhook.js
import redis from './_lib/redis.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const payload = req.body;
    console.log('📥 Webhook từ SePay:', payload);

    // Chỉ xử lý giao dịch tiền vào
    if (payload.transferType !== 'in') {
      return res.status(200).json({ success: true });
    }

    const transactionCode = payload.content?.trim();
    if (!transactionCode) {
      return res.status(200).json({ success: true });
    }

    // Tìm giao dịch trong Redis
    const rawTx = await redis.get(`tx:${transactionCode}`);
    if (!rawTx) {
      console.log(`❌ Không tìm thấy giao dịch: ${transactionCode}`);
      return res.status(200).json({ success: true });
    }

    const transaction = JSON.parse(rawTx);
    const expectedAmount = transaction.amount;
    const receivedAmount = payload.transferAmount;

    // Kiểm tra số tiền (có thể cho phép chênh lệch nhỏ)
    if (receivedAmount < expectedAmount) {
      console.log(`⚠️ Số tiền không khớp: cần ${expectedAmount}, nhận ${receivedAmount}`);
      return res.status(200).json({ success: true });
    }

    // Đánh dấu đã thanh toán
    transaction.paid = true;
    await redis.set(`tx:${transactionCode}`, JSON.stringify(transaction), { ex: 600 });

    // Lưu vào danh sách đã mua
    const downloadUrl = `/api/download?code=${transactionCode}&type=${transaction.package}`;
    await redis.set(`purchased:${transactionCode}`, JSON.stringify({
      package: transaction.package,
      date: new Date().toISOString(),
      downloadUrl
    }), { ex: 365 * 24 * 60 * 60 });

    console.log(`✅ Thanh toán thành công: ${transactionCode}`);
    return res.status(200).json({ success: true });

  } catch (error) {
    console.error('Lỗi webhook:', error);
    return res.status(200).json({ success: true });
  }
}
