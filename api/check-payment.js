import redis from './_lib/redis.js';

export default async function handler(req, res) {
  const { code } = req.query;

  if (!code) {
    return res.status(400).json({ error: 'Missing transaction code' });
  }

  try {
    // Lấy dữ liệu giao dịch từ Redis
    const rawTx = await redis.get(`tx:${code}`);
    
    if (!rawTx) {
      return res.status(404).json({ paid: false, error: 'Transaction not found' });
    }

    const transaction = JSON.parse(rawTx);
    
    // TODO: Tích hợp API kiểm tra thanh toán thực tế (ví dụ: từ ngân hàng, Momo, VNPay)
    // *** Ở đây là PHẦN GIẢ LẬP để demo. Bạn cần thay bằng code thật sau. ***
    // Giả lập: nếu mã bắt đầu bằng "FMI3F3B" thì tự động coi là đã thanh toán
    let isPaid = transaction.paid;
    if (code.startsWith('FMI3F3B') && !isPaid) {
      isPaid = true;
      transaction.paid = true;
      // Cập nhật lại trạng thái đã thanh toán vào Redis
      await redis.set(`tx:${code}`, JSON.stringify(transaction), { ex: 600 });
      
      // Lưu vào danh sách đã mua với thời gian sống lâu hơn (ví dụ: 365 ngày)
      await redis.set(`purchased:${code}`, JSON.stringify({
        package: transaction.package,
        date: new Date().toISOString(),
        downloadUrl: `https://your-domain.vercel.app/api/download?code=${code}&type=${transaction.package}`
      }), { ex: 365 * 24 * 60 * 60 });
    }
    // ========================================================
    
    return res.status(200).json({ paid: isPaid });
  } catch (error) {
    console.error('Lỗi khi kiểm tra thanh toán:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
