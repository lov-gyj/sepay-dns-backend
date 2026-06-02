// api/sepay-webhook.js
import redis from './_lib/redis.js';

export default async function handler(req, res) {
  // Chỉ chấp nhận POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Lấy dữ liệu từ body (SePay gửi JSON)
    const payload = req.body;
    console.log('📥 Webhook received:', JSON.stringify(payload, null, 2));

    // Kiểm tra cấu trúc payload
    if (!payload || typeof payload !== 'object') {
      console.error('❌ Invalid payload structure');
      return res.status(200).json({ success: true }); // Vẫn trả 200 để SePay không gửi lại
    }

    // Chỉ xử lý giao dịch tiền vào (transferType = 'in')
    if (payload.transferType !== 'in') {
      console.log('⏩ Ignoring non-inbound transaction');
      return res.status(200).json({ success: true });
    }

    // Lấy mã giao dịch từ nội dung chuyển khoản (trường "content")
    let transactionCode = payload.content?.trim() || '';
    // Loại bỏ các ký tự đặc biệt nếu có (chỉ giữ chữ hoa và số)
    transactionCode = transactionCode.replace(/[^A-Z0-9]/g, '');
    
    if (!transactionCode) {
      console.log('⚠️ No transaction code found in content:', payload.content);
      return res.status(200).json({ success: true });
    }

    console.log(`🔍 Looking for transaction: ${transactionCode}`);

    // Lấy giao dịch từ Redis
    const rawTx = await redis.get(`tx:${transactionCode}`);
    if (!rawTx) {
      console.log(`❌ Transaction ${transactionCode} not found in Redis`);
      return res.status(200).json({ success: true });
    }

    let transaction;
    try {
      transaction = JSON.parse(rawTx);
    } catch (e) {
      console.error('❌ Failed to parse transaction JSON:', e);
      return res.status(200).json({ success: true });
    }

    const expectedAmount = transaction.amount;
    const receivedAmount = payload.transferAmount;

    // Kiểm tra số tiền (cho phép chênh lệch tối đa 1000đ do phí)
    if (Math.abs(receivedAmount - expectedAmount) > 1000) {
      console.log(`⚠️ Amount mismatch: expected ${expectedAmount}, got ${receivedAmount}`);
      return res.status(200).json({ success: true });
    }

    // Cập nhật trạng thái thanh toán
    transaction.paid = true;
    await redis.set(`tx:${transactionCode}`, JSON.stringify(transaction), { ex: 600 }); // giữ 10 phút

    // Lưu vào danh sách đã mua (vĩnh viễn 1 năm)
    const downloadUrl = `/api/download?code=${transactionCode}&type=${transaction.package}`;
    const purchasedData = {
      package: transaction.package,
      date: new Date().toISOString(),
      downloadUrl
    };
    await redis.set(`purchased:${transactionCode}`, JSON.stringify(purchasedData), { ex: 365 * 24 * 60 * 60 });

    console.log(`✅ SUCCESS: Transaction ${transactionCode} marked as paid.`);
    return res.status(200).json({ success: true });

  } catch (error) {
    // Log lỗi chi tiết để debug
    console.error('❌ UNHANDLED ERROR in webhook:', error);
    console.error(error.stack);
    // Dù lỗi gì cũng trả 200 để SePay không gửi lại
    return res.status(200).json({ success: false, error: error.message });
  }
}
