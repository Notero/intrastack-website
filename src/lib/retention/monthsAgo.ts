/** Calendar-month subtraction, matching Postgres's `now() - interval 'N months'`. */
export function monthsAgo(n: number): string {
  const d = new Date();
  d.setUTCMonth(d.getUTCMonth() - n);
  return d.toISOString();
}
