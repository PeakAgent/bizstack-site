import crypto from 'crypto';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { phone } = req.body || {};
  if (!phone || phone.replace(/\D/g, '').length < 10) {
    return res.status(400).json({ error: 'Please enter a valid phone number.' });
  }

  const code = String(Math.floor(100000 + Math.random() * 900000));
  const expires = Date.now() + 10 * 60 * 1000; // 10-minute window
  const secret = process.env.AUTH_SECRET || 'bizstack-otp-secret';
  const cleanPhone = phone.replace(/\D/g, '');
  const tokenPayload = `${code}:${expires}`;
  const sig = crypto.createHmac('sha256', secret).update(`${cleanPhone}:${tokenPayload}`).digest('hex');
  const token = Buffer.from(`${tokenPayload}:${sig}`).toString('base64');

  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken  = process.env.TWILIO_AUTH_TOKEN;
  const fromNumber = process.env.TWILIO_PHONE_NUMBER;

  if (!accountSid || !authToken || !fromNumber) {
    // Dev mode: return token without SMS (remove `code` from prod response)
    console.warn('[send-verification] Twilio env vars not set — dev mode, skipping SMS');
    return res.status(200).json({ success: true, token, _dev_code: code });
  }

  const body = `Your BizStack AI code is: ${code}. Valid for 10 minutes. Reply STOP to opt out.`;
  const auth = Buffer.from(`${accountSid}:${authToken}`).toString('base64');

  try {
    const twilioRes = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`,
      {
        method: 'POST',
        headers: {
          Authorization: `Basic ${auth}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({ From: fromNumber, To: phone, Body: body }).toString(),
      }
    );

    if (!twilioRes.ok) {
      const err = await twilioRes.text();
      console.error('[send-verification] Twilio error:', err);
      return res.status(500).json({ error: 'Failed to send SMS. Please try again.' });
    }

    return res.status(200).json({ success: true, token });
  } catch (e) {
    console.error('[send-verification] Error:', e);
    return res.status(500).json({ error: 'Failed to send SMS. Please try again.' });
  }
}
