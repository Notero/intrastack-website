/**
 * Guards the retention-purge cron route. Fails closed: an unset CRON_SECRET
 * must reject every request, not allow them all through.
 */
export function isAuthorizedCronRequest(request: Request): boolean {
  const secret = process.env.CRON_SECRET;
  const auth = request.headers.get("authorization");
  return !!secret && auth === `Bearer ${secret}`;
}
