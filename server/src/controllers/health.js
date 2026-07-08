/**
 * Health-check controller — used by the frontend to verify
 * the API is reachable.
 */
export async function getHealth(_req, res, next) {
  try {
    res.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    });
  } catch (err) {
    next(err);
  }
}
