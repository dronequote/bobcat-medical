import type { APIRoute } from 'astro';

const GHL_BASE = 'https://services.leadconnectorhq.com';

export const POST: APIRoute = async ({ request }) => {
  const token = import.meta.env.GHL_API_TOKEN;
  const locationId = import.meta.env.GHL_LOCATION_ID;

  if (!token || !locationId) {
    return new Response(
      JSON.stringify({ error: 'Contact form is not configured. Missing GHL_API_TOKEN or GHL_LOCATION_ID.' }),
      { status: 503, headers: { 'Content-Type': 'application/json' } }
    );
  }

  let body: { name?: string; email?: string; subject?: string; message?: string; phone?: string };
  try {
    body = await request.json();
  } catch {
    return new Response(
      JSON.stringify({ error: 'Invalid JSON body.' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  const name = (body.name ?? '').trim();
  const email = (body.email ?? '').trim();
  const subject = (body.subject ?? 'General Inquiry').trim();
  const message = (body.message ?? '').trim();
  const phone = (body.phone ?? '').trim();

  if (!email) {
    return new Response(
      JSON.stringify({ error: 'Email is required.' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  const nameParts = name ? name.split(/\s+/) : [];
  const firstName = nameParts[0] ?? 'Contact';
  const lastName = nameParts.slice(1).join(' ') || 'Form';

  const headers = {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
    Version: '2021-07-28',
  };

  try {
    const createRes = await fetch(`${GHL_BASE}/contacts/`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        locationId,
        firstName,
        lastName,
        email,
        ...(phone && { phone }),
      }),
    });

    const createData = await createRes.json().catch(() => ({}));
    const contactId = createData?.contact?.id ?? createData?.contact?._id ?? createData?.id ?? createData?._id;

    if (!createRes.ok) {
      console.error('[contact API] GHL create contact failed:', createRes.status, createData);
      return new Response(
        JSON.stringify({ error: 'Could not submit. Please try again or email us directly.' }),
        { status: 502, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (contactId && (subject || message)) {
      const noteBody = [subject && `Subject: ${subject}`, message].filter(Boolean).join('\n\n');
      await fetch(`${GHL_BASE}/contacts/${contactId}/notes`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          body: noteBody,
          contactId,
        }),
      });
    }

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (err) {
    console.error('[contact API] Error:', err);
    return new Response(
      JSON.stringify({ error: 'Something went wrong. Please try again or email us directly.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
