import { Redis } from '@upstash/redis';

// Kiểm tra biến môi trường đã được thiết lập chưa
if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
  console.error('Lỗi: Thiếu biến môi trường UPSTASH_REDIS_REST_URL hoặc UPSTASH_REDIS_REST_TOKEN');
}

// Tạo kết nối Redis từ các biến môi trường
// Vercel sẽ tự động inject các biến này khi deploy
const redis = Redis.fromEnv();

export default redis;
