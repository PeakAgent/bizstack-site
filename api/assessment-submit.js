import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_ADDRESS = 'BizStack AI <hello@bizstack.vip>';
const TEAM_EMAIL   = 'andrew@peakagentai.com';

// ─────────────────────────────────────────────────────────────────
//  TIER CONFIG (mirrors frontend TIERS)
// ─────────────────────────────────────────────────────────────────
const TIER_COLORS = {
  starter:    '#3B82F6',
  growth:     '#8B5CF6',
  scale:      '#06B6D4',
  enterprise: '#F59E0B',
};

// ─────────────────────────────────────────────────────────────────
//  PROSPECT HTML EMAIL
// ─────────────────────────────────────────────────────────────────
function buildProspectEmail({ answers, tierName, tierPrice, tierDesc, tierFeatures, agencyCost, savingsAmt }) {
  const firstName = answers.contactName.split(' ')[0] || 'there';
  const tierKey   = tierName.toLowerCase();
  const accent    = TIER_COLORS[tierKey] || '#3B82F6';

  const featureRows = tierFeatures
    .map(f => `
      <tr>
        <td style="padding:8px 0;border-bottom:1px solid #1E293B;font-size:14px;color:#CBD5E1;">
          <span style="color:${accent};margin-right:10px;">✓</span>${f}
        </td>
      </tr>`)
    .join('');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1.0">
  <title>Your BizStack AI Assessment Results</title>
</head>
<body style="margin:0;padding:0;background:#0F172A;font-family:'Inter',system-ui,sans-serif;color:#F1F5F9;">

  <!-- Wrapper -->
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0F172A;padding:40px 20px;">
    <tr><td align="center">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;">

        <!-- Header -->
        <tr>
          <td style="padding-bottom:32px;text-align:center;">
            <div style="font-family:'Space Grotesk',system-ui,sans-serif;font-size:22px;font-weight:800;color:#FFFFFF;letter-spacing:-0.02em;">
              BizStack<span style="color:#3B82F6;">.vip</span>
            </div>
          </td>
        </tr>

        <!-- Eyebrow -->
        <tr>
          <td style="padding-bottom:8px;text-align:center;">
            <span style="font-size:11px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:${accent};">
              Assessment Complete
            </span>
          </td>
        </tr>

        <!-- Hero heading -->
        <tr>
          <td style="padding-bottom:8px;text-align:center;">
            <h1 style="margin:0;font-family:'Space Grotesk',system-ui,sans-serif;font-size:28px;font-weight:800;color:#FFFFFF;letter-spacing:-0.02em;">
              Hey ${firstName}, here's your plan.
            </h1>
          </td>
        </tr>
        <tr>
          <td style="padding-bottom:32px;text-align:center;">
            <p style="margin:0;font-size:15px;color:#94A3B8;">
              Based on your assessment, we recommend <strong style="color:#FFFFFF;">${tierName}</strong> for ${answers.businessName || 'your business'}.
            </p>
          </td>
        </tr>

        <!-- Tier card -->
        <tr>
          <td style="padding-bottom:24px;">
            <table width="100%" cellpadding="0" cellspacing="0"
              style="background:#1E293B;border:1px solid rgba(255,255,255,.08);border-radius:12px;overflow:hidden;">
              <!-- Top accent bar -->
              <tr><td style="height:3px;background:${accent};"></td></tr>
              <tr>
                <td style="padding:24px 28px 20px;">
                  <span style="display:inline-block;font-size:11px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:${accent};background:rgba(59,130,246,.1);padding:4px 10px;border-radius:999px;margin-bottom:12px;">
                    ${tierName} Plan
                  </span>
                  <div style="font-family:'Space Grotesk',system-ui,sans-serif;font-size:36px;font-weight:800;color:${accent};margin-bottom:4px;letter-spacing:-0.02em;">
                    ${tierPrice}<span style="font-size:16px;font-weight:400;color:#64748B;">/mo</span>
                  </div>
                  <p style="margin:0 0 20px;font-size:14px;color:#94A3B8;">${tierDesc}</p>
                  <p style="margin:0 0 12px;font-size:11px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:#475569;">
                    What's included
                  </p>
                  <table width="100%" cellpadding="0" cellspacing="0">${featureRows}</table>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- Cost comparison -->
        <tr>
          <td style="padding-bottom:24px;">
            <table width="100%" cellpadding="0" cellspacing="0"
              style="background:#1E293B;border:1px solid rgba(255,255,255,.08);border-radius:12px;overflow:hidden;">
              <tr>
                <td style="padding:20px 28px 16px;">
                  <p style="margin:0 0 4px;font-size:11px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:#475569;">
                    The Numbers
                  </p>
                  <h3 style="margin:0 0 16px;font-family:'Space Grotesk',system-ui,sans-serif;font-size:18px;font-weight:700;color:#FFFFFF;">
                    What this would cost to build with an agency
                  </h3>
                  <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                      <td width="50%" style="padding:12px 16px;background:rgba(16,185,129,.08);border-radius:8px 0 0 8px;border:1px solid rgba(16,185,129,.2);text-align:center;vertical-align:top;">
                        <div style="font-size:10px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:#10B981;margin-bottom:6px;">Your BizStack Price</div>
                        <div style="font-family:'JetBrains Mono',monospace,sans-serif;font-size:26px;font-weight:700;color:#10B981;">${tierPrice}</div>
                        <div style="font-size:11px;color:rgba(16,185,129,.7);">per month</div>
                      </td>
                      <td width="50%" style="padding:12px 16px;background:rgba(239,68,68,.04);border-radius:0 8px 8px 0;border:1px solid rgba(239,68,68,.15);border-left:none;text-align:center;vertical-align:top;">
                        <div style="font-size:10px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:#F87171;margin-bottom:6px;">Agency Build Cost</div>
                        <div style="font-family:'JetBrains Mono',monospace,sans-serif;font-size:26px;font-weight:700;color:#475569;text-decoration:line-through;">${agencyCost}</div>
                        <div style="font-size:11px;color:#475569;">one-time build</div>
                      </td>
                    </tr>
                  </table>
                  <div style="margin-top:12px;padding:10px 16px;background:rgba(16,185,129,.08);border:1px solid rgba(16,185,129,.15);border-radius:8px;text-align:center;">
                    <span style="font-family:'JetBrains Mono',monospace,sans-serif;font-size:18px;font-weight:700;color:#10B981;">${savingsAmt}</span>
                    <span style="font-size:13px;color:#94A3B8;margin-left:8px;">saved vs. agency pricing</span>
                  </div>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- Rent-to-own callout -->
        <tr>
          <td style="padding-bottom:32px;">
            <table width="100%" cellpadding="0" cellspacing="0"
              style="background:rgba(59,130,246,.06);border:1px solid rgba(59,130,246,.2);border-radius:12px;">
              <tr>
                <td style="padding:18px 24px;">
                  <p style="margin:0 0 6px;font-size:13px;font-weight:700;color:#3B82F6;">&#9679; Own Everything After 24 Months</p>
                  <p style="margin:0;font-size:13px;color:#94A3B8;line-height:1.6;">
                    After 24 months, you <strong style="color:#F1F5F9;">own every asset we build</strong> — your website, automations, CRM setup, and AI agents. Then keep everything running for just $49–149/mo. No agency owns your stuff. You do.
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- CTA -->
        <tr>
          <td style="padding-bottom:12px;text-align:center;">
            <a href="https://calendly.com"
              style="display:inline-block;padding:16px 40px;background:linear-gradient(90deg,#3B82F6,#8B5CF6);color:#FFFFFF;text-decoration:none;font-weight:700;font-size:15px;border-radius:10px;letter-spacing:.01em;">
              Book My Free Strategy Call →
            </a>
          </td>
        </tr>
        <tr>
          <td style="padding-bottom:40px;text-align:center;">
            <p style="margin:0;font-size:13px;color:#64748B;">
              Your custom proposal is being prepared and will arrive within 24 hours.
            </p>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="border-top:1px solid #1E293B;padding-top:24px;text-align:center;">
            <p style="margin:0 0 4px;font-family:'Space Grotesk',system-ui,sans-serif;font-size:14px;font-weight:700;color:#FFFFFF;">
              BizStack<span style="color:#3B82F6;">.vip</span>
            </p>
            <p style="margin:0;font-size:12px;color:#475569;">
              Everything your business needs to run better. Built in 48 hours.
              &nbsp;·&nbsp;
              <a href="mailto:hello@bizstack.vip" style="color:#475569;">hello@bizstack.vip</a>
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>

</body>
</html>`;
}

// ─────────────────────────────────────────────────────────────────
//  TEAM PLAIN-TEXT EMAIL
// ─────────────────────────────────────────────────────────────────
function buildTeamEmailText({ answers, score, tierKey, tierName, tierPrice }) {
  const a = answers;
  const urgencyFlag = a.timeline === 'asap' ? '🔴 URGENT — respond within 2 hours' : a.timeline === 'this-month' ? '🟡 This month — respond today' : '🟢 Exploring';

  const socialStr = a.socialPlatforms.includes('none')
    ? 'None yet'
    : a.socialPlatforms.join(', ') + (a.postFrequency ? ` (${a.postFrequency})` : '');

  return `New BizStack Assessment Lead
${'='.repeat(50)}

CONTACT
  Name:     ${a.contactName}
  Business: ${a.businessName}
  Email:    ${a.email}
  Phone:    ${a.phone}
  Industry: ${a.industry}

RECOMMENDED TIER
  Tier:     ${tierName}  (${tierPrice}/mo)
  Score:    ${score}

TIMELINE & URGENCY
  ${urgencyFlag}
  Timeline: ${a.timeline}
  Budget:   ${a.budget}

CURRENT SETUP
  Website:         ${a.hasWebsite ? 'Yes — ' + (a.websiteUrl || 'URL not provided') : 'No'}
  CRM:             ${a.hasCRM ? 'Yes — ' + (a.crmName || 'Not specified') : 'No'}
  Email marketing: ${a.hasEmail ? 'Yes' : 'No'}
  Social media:    ${socialStr}
  Pain point:      ${a.painPoint}

${'─'.repeat(50)}
Respond within 2 hours for best conversion.
View at bizstack.vip/assessment
`;
}

// ─────────────────────────────────────────────────────────────────
//  HANDLER
// ─────────────────────────────────────────────────────────────────
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const {
    answers, score, tierKey, tierName, tierPrice,
    tierDesc, tierFeatures, agencyCost, savingsAmt
  } = req.body || {};

  if (!answers || !answers.email || !tierKey) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  if (!process.env.RESEND_API_KEY) {
    console.warn('[assessment-submit] RESEND_API_KEY not set — skipping email send');
    return res.status(200).json({ success: true, mode: 'dev-no-key' });
  }

  const prospectHtml = buildProspectEmail({
    answers, tierName, tierPrice, tierDesc, tierFeatures, agencyCost, savingsAmt
  });
  const teamText = buildTeamEmailText({ answers, score, tierKey, tierName, tierPrice });

  try {
    const [prospectResult, teamResult] = await Promise.all([
      resend.emails.send({
        from:    FROM_ADDRESS,
        to:      [answers.email],
        subject: `Your BizStack AI Assessment — ${tierName} Plan Recommended`,
        html:    prospectHtml,
      }),
      resend.emails.send({
        from:    FROM_ADDRESS,
        to:      [TEAM_EMAIL],
        subject: `New Lead: ${answers.contactName} — ${answers.businessName} — ${tierName} (score: ${score})`,
        text:    teamText,
      }),
    ]);

    console.log('[assessment-submit] emails sent', {
      prospect: prospectResult.data?.id,
      team:     teamResult.data?.id,
    });

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('[assessment-submit] Resend error:', err);
    // Still return 200 to frontend — email failure shouldn't break the UX
    return res.status(200).json({ success: true, emailError: err.message });
  }
}
