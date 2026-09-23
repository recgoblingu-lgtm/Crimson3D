export async function onRequestPost({ request, env }) {
  try {
    const data = await request.json();
    const name = clean(data.name, 120);
    const email = clean(data.email, 180);
    const discord = clean(data.discord, 120);
    const notes = clean(data.notes, 800);

    if (!name || !email || !data.agree || !/^\S+@\S+\.\S+$/.test(email)) {
      return json({ error: 'Please provide a name, a valid email, and consent to be contacted.' }, 400);
    }

    if (!env.DISCORD_WEBHOOK_URL) {
      return json({ error: 'Purchase requests are not configured yet. Please contact the site owner.' }, 503);
    }

    const content = [
      '**New Crimson3D purchase request**',
      '',
      '**Model:** Crimson Blade',
      `**Name:** ${name}`,
      `**Email:** ${email}`,
      `**Discord:** ${discord || 'Not provided'}`,
      `**Notes:** ${notes || 'None'}`,
    ].join('\n');

    const discordResponse = await fetch(env.DISCORD_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content, allowed_mentions: { parse: [] } }),
    });

    if (!discordResponse.ok) {
      return json({ error: 'Discord could not accept the request. Please try again later.' }, 502);
    }

    return json({ ok: true }, 200);
  } catch (error) {
    console.error('Purchase request error:', error);
    return json({ error: 'Unexpected server error.' }, 500);
  }
}

function clean(value, max) {
  return String(value || '').trim().slice(0, max);
}

function json(body, status) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' },
  });
}
