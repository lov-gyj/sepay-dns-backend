import redis from './_lib/redis.js';

function setCorsHeaders(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

export default async function handler(req, res) {
  setCorsHeaders(res);
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const { code } = req.query;
  if (!code) return res.status(400).json({ error: 'Missing transaction code' });

  try {
    const rawTx = await redis.get(`tx:${code}`);
    if (!rawTx) return res.status(200).json({ paid: false });
    const transaction = JSON.parse(rawTx);
    return res.status(200).json({ paid: transaction.paid === true });
  } catch (error) {
    console.error('Error checking payment:', error);
    return res.status(200).json({ paid: false });
  }
}