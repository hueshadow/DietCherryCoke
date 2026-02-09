export const prerender = false;

export async function POST({ request }: { request: Request }) {
  try {
    const { email } = await request.json();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return new Response(JSON.stringify({ error: 'Invalid email' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // TODO: Integrate with Cloudflare KV for storage
    // const kv = env.SUBSCRIBERS;
    // const existing = await kv.get(email);
    // if (existing) {
    //   return new Response(JSON.stringify({ error: 'Already subscribed' }), {
    //     status: 409,
    //     headers: { 'Content-Type': 'application/json' },
    //   });
    // }
    // await kv.put(email, JSON.stringify({ email, subscribedAt: new Date().toISOString(), status: 'active' }));

    // TODO: Send confirmation email via Resend
    // const resendKey = env.RESEND_API_KEY;
    // await fetch('https://api.resend.com/emails', {
    //   method: 'POST',
    //   headers: { Authorization: `Bearer ${resendKey}`, 'Content-Type': 'application/json' },
    //   body: JSON.stringify({
    //     from: 'Diet Cherry Coke <hello@dietcherrycoke.net>',
    //     to: email,
    //     subject: 'Welcome to Diet Cherry Coke Updates!',
    //     html: '<h1>Thanks for subscribing!</h1><p>You will receive updates about Diet Cherry Coke availability and news.</p>',
    //   }),
    // });

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch {
    return new Response(JSON.stringify({ error: 'Internal error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
