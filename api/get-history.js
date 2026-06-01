import clientPromise from '../lib/mongodb';

export default async function handler(req, res) {
  const { ids } = req.query; // ids = "TX1,TX2"
  if (!ids) return res.json({ transactions: [] });

  const idList = ids.split(',');
  const client = await clientPromise;
  const db = client.db('dnsv3');
  const orders = await db.collection('orders').find({
    transaction_id: { $in: idList }
  }).toArray();

  const transactions = orders.map(o => ({
    transaction_id: o.transaction_id,
    status: o.status,
    download_url: o.download_url
  }));

  res.json({ transactions });
}
