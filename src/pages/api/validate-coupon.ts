import type { APIRoute } from 'astro';

const GHL_BASE = 'https://services.leadconnectorhq.com';

/**
 * Validates a coupon code against GoHighLevel before checkout.
 * Call this before creating the invoice so invalid codes are rejected early.
 */
export const POST: APIRoute = async ({ request }) => {
  const token = import.meta.env.GHL_API_TOKEN;
  const locationId = import.meta.env.GHL_LOCATION_ID;

  if (!token || !locationId) {
    return new Response(
      JSON.stringify({ valid: false, error: 'Coupon validation is not configured.' }),
      { status: 503, headers: { 'Content-Type': 'application/json' } }
    );
  }

  let body: { couponCode?: string };
  try {
    body = await request.json();
  } catch {
    return new Response(
      JSON.stringify({ valid: false, error: 'Invalid request.' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  const couponCode = (body.couponCode ?? '').trim().toUpperCase();
  if (!couponCode) {
    return new Response(
      JSON.stringify({ valid: false, error: 'Coupon code is required.' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  const headers = {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
    Version: '2021-07-28',
  };

  let getData: Record<string, unknown> = {};
  try {
    // GHL: Try fetch by code first, then fallback to list and match by code
    let coupon: Record<string, unknown> | null = null;

    const getRes = await fetch(
      `${GHL_BASE}/payments/coupon?locationId=${encodeURIComponent(locationId)}&code=${encodeURIComponent(couponCode)}`,
      { method: 'GET', headers }
    );
    getData = (await getRes.json().catch(() => ({}))) as Record<string, unknown>;

    if (getRes.status === 401 || getRes.status === 403) {
      return new Response(
        JSON.stringify({ valid: false, error: 'Coupon validation is not configured. Check payment system settings.' }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (getRes.ok && (getData?.coupon ?? getData?.id ?? getData?._id)) {
      coupon = (getData?.coupon ?? getData) as Record<string, unknown>;
    }

    if (!coupon) {
      const listRes = await fetch(
        `${GHL_BASE}/payments/coupon/list?locationId=${encodeURIComponent(locationId)}`,
        { method: 'GET', headers }
      );
      const listData = (await listRes.json().catch(() => ({}))) as Record<string, unknown>;
      const coupons = (Array.isArray(listData?.coupons) ? listData.coupons : listData) as Array<Record<string, unknown>>;
      const match = Array.isArray(coupons)
        ? coupons.find((c) => String(c?.code ?? c?.promotionalCode ?? '').toUpperCase() === couponCode)
        : undefined;
      if (match) coupon = match;
    }

    if (!coupon) {
      const message =
        (typeof getData?.message === 'string' ? getData.message : null) ??
        (typeof getData?.error === 'string' ? getData.error : null) ??
        'Invalid or expired coupon code.';
      return new Response(
        JSON.stringify({ valid: false, error: message }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const id = coupon?.id ?? coupon?._id;
    if (!id) {
      return new Response(
        JSON.stringify({ valid: false, error: 'Invalid coupon response.' }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const endDate = coupon?.endDate ?? coupon?.validTill;
    if (endDate && new Date(String(endDate)) < new Date()) {
      return new Response(
        JSON.stringify({ valid: false, error: 'This coupon has expired.' }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ valid: true, couponId: id, coupon }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown error';
    console.error('[validate-coupon API] Error:', err);
    return new Response(
      JSON.stringify({
        valid: false,
        error: 'Coupon service unavailable. You can leave the coupon blank and continue, or try again later.',
        details: import.meta.env.DEV ? msg : undefined,
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
