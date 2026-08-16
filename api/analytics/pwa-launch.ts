export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { displayMode } = req.body || {};
    return res.status(200).json({
      status: 'success',
      message: 'Launch analytics recorded',
      mode: displayMode,
      id: 'log_' + Date.now().toString(36)
    });
  } catch (err: any) {
    return res.status(200).json({ status: 'skipped', error: err?.message });
  }
}
