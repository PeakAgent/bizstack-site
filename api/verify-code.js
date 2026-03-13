import crypto from 'crypto';

export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { phone, code, token } = req.body || {};
  if (!phone || !code || !token) {
    return res.status(400).json({ error: 'Missing required fields.' });
  }

  const secret = process.env.AUTH_SECRET || 'bizstack-otp-secret';
  const cleanPhone = phone.replace(/\D/g, '');

  let decoded;
  try {
    decoded = Buffer.from(token, 'base64').toString('utf8');
  } catch {
    return res.status(400).json({ error: 'Invalid token.' });
  }

  const parts = decoded.split(':');
  if (parts.length !== 3) {
    return res.status(400).json({ error: 'Invalid token format.' });
  }

  const [storedCode, expiresStr, sig] = parts;
  const expires = parseInt(expiresStr, 10);

  if (isNaN(expires) || Date.now() > expires) {
    return res.status(400).json({ error: 'Code expired. Please request a new one.' });
  }

  // Verify HMAC signature
  const tokenPayload = `${storedCode}:${expiresStr}`;
  const expectedSig = crypto.createHmac('sha256', secret).update(`${cleanPhone}:${tokenPayload}`).digest('hex');
  const sigBuf = Buffer.from(sig, 'hex');
  const expBuf = Buffer.from(expectedSig, 'hex');

  if (sigBuf.length !== expBuf.length || !crypto.timingSafeEqual(sigBuf, expBuf)) {
    return res.status(400).json({ error: 'Invalid token.' });
  }

  // Verify code (timing-safe)
  const submitted = code.trim().slice(0, 6).padEnd(6, '\0');
  const expected  = storedCode.slice(0, 6).padEnd(6, '\0');
  if (!crypto.timingSafeEqual(Buffer.from(submitted), Buffer.from(expected))) {
    return res.status(400).json({ error: 'Incorrect code. Please try again.' });
  }

  return res.status(200).json({ success: true });
}
