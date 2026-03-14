import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_ADDRESS = 'BizStack AI <hello@bizstack.vip>';
const TEAM_EMAIL   = 'andrew@peakagentai.com';

const STRIPE_LINKS = {
  starter:    'https://buy.stripe.com/3cI3cv0wC2GD2us9mB8so02',
  growth:     'https://buy.stripe.com/28E00j2EK6WT1qobuJ8so04',
  scale:      'https://buy.stripe.com/eVqaEXfrw5SP6KI56l8so03',
  enterprise: 'https://buy.stripe.com/cNi6oH0wC4OL9WUgP38so05',
};

const FULL_FEATURES = {
  starter: [
    'Professional custom website, mobile-responsive + SSL',
    'Basic CRM setup to capture and track leads',
    'Email templates + automated lead capture',
    'Google Business Profile setup and optimization',
    '2 content updates per month',
    'Own everything after 24 months — no contracts',
  ],
  growth: [
    'Animated professional website',
    'CRM with advanced automations and pipeline management',
    '2 lead capture campaigns',
    'Email + SMS follow-up sequences',
    'Appointment booking automation',
    'Review generation system',
    'Monthly analytics report',
    'Own everything after 24 months — no contracts',
  ],
  scale: [
    'Scroll-animated showcase website',
    'AI chatbot on your website (qualifies leads 24/7)',
    '3 lead capture campaigns',
    'Email + SMS sequences',
    'Appointment booking automation',
    'LinkedIn content — 20 posts/month',
    'Full SEO audit and on-page optimization',
    'Self-healing monitoring',
    'Bi-weekly strategy calls',
    'Own everything after 24 months — no contracts',
  ],
  enterprise: [
    'Multi-page animated platform',
    'Everything in Scale, plus:',
    'AI voice agent (handles calls and inquiries 24/7)',
    'Custom integrations between all your tools',
    'Unlimited automations',
    'Advanced analytics dashboard',
    'Weekly strategy sessions',
    'Dedicated support with guaranteed response time',
    'White-glove onboarding and migration',
    'Own everything after 24 months — no contracts',
  ],
};

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
function buildProspectEmail({ answers, tierName, tierPrice, tierDesc, tierFeatures, agencyCost, savingsAmt, stripeLink }) {
  const firstName = answers.contactName.split(' ')[0] || 'there';
  const tierKey   = tierName.toLowerCase();
  const accent    = TIER_COLORS[tierKey] || '#3B82F6';

  // Use canonical full feature list, falling back to whatever was sent from frontend
  const features = FULL_FEATURES[tierKey] || tierFeatures || [];

  const featureRows = features
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
            <a href="${stripeLink || 'https://bizstack.vip'}"
              style="display:inline-block;padding:16px 40px;background:linear-gradient(90deg,#3B82F6,#8B5CF6);color:#FFFFFF;text-decoration:none;font-weight:700;font-size:15px;border-radius:10px;letter-spacing:.01em;">
              Get Started — ${tierPrice}/mo →
            </a>
          </td>
        </tr>
        <tr>
          <td style="padding-bottom:12px;text-align:center;">
            <a href="https://bizstack.vip/onboarding-checklist"
              style="display:inline-block;padding:13px 32px;background:transparent;border:1px solid rgba(255,255,255,.15);color:#94A3B8;text-decoration:none;font-weight:600;font-size:14px;border-radius:10px;letter-spacing:.01em;">
              📋 Review Your Onboarding Checklist →
            </a>
          </td>
        </tr>
        <tr>
          <td style="padding-bottom:12px;text-align:center;">
            <a href="https://bizstack.vip/onboarding"
              style="display:inline-block;padding:13px 32px;background:transparent;border:1px solid rgba(255,255,255,.15);color:#94A3B8;text-decoration:none;font-weight:600;font-size:14px;border-radius:10px;letter-spacing:.01em;">
              Start your onboarding form →
            </a>
          </td>
        </tr>
        <tr>
          <td style="padding-bottom:40px;text-align:center;">
            <p style="margin:0;font-size:13px;color:#64748B;">
              Ready to get started? Click the button above to begin your subscription. Review the checklist first to prepare your assets, then complete the onboarding form so we can start building.
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

  const stripeLink = STRIPE_LINKS[tierKey] || '';
  const prospectHtml = buildProspectEmail({
    answers, tierName, tierPrice, tierDesc, tierFeatures, agencyCost, savingsAmt, stripeLink
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

    // ── Fire lead to Mission Control (async, non-blocking) ──────────────────
    postToMissionControl({ answers, score, tierKey, tierPrice }).catch(err => {
      console.error('[assessment-submit] Mission Control post failed:', err.message);
    });

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('[assessment-submit] Resend error:', err);
    // Still return 200 to frontend — email failure shouldn't break the UX
    // Still try to post lead even if email failed
    postToMissionControl({ answers, score, tierKey, tierPrice }).catch(err => {
      console.error('[assessment-submit] Mission Control post failed:', err.message);
    });
    return res.status(200).json({ success: true, emailError: err.message });
  }
}

// ─────────────────────────────────────────────────────────────────
//  MISSION CONTROL LEAD INGESTION
// ─────────────────────────────────────────────────────────────────
async function postToMissionControl({ answers, score, tierKey }) {
  const INGEST_URL = 'https://app.bizstack.vip/api/leads/ingest';
  const apiKey = process.env.LEADS_INGEST_KEY;

  if (!apiKey) {
    console.warn('[assessment-submit] LEADS_INGEST_KEY not set — skipping lead ingest');
    return;
  }

  // Build a readable notes string from assessment answers
  const urgency = (() => {
    const t = (answers.timeline || '').toLowerCase();
    if (t.includes('asap') || t.includes('immediately') || t.includes('now')) return 'high';
    if (t.includes('exploring') || t.includes('someday') || t.includes('no rush')) return 'low';
    return 'medium';
  })();

  const notes = [
    `Score: ${score}`,
    `Urgency: ${urgency} | Timeline: ${answers.timeline || '—'} | Budget: ${answers.budget || '—'}`,
    `Website: ${answers.hasWebsite ? (answers.websiteUrl || 'Yes') : 'No'} | CRM: ${answers.hasCRM ? (answers.crmName || 'Yes') : 'No'} | Email marketing: ${answers.hasEmail ? 'Yes' : 'No'}`,
    `Social: ${(answers.socialPlatforms || []).join(', ') || 'None'}`,
    `Pain point: ${answers.painPoint || '—'}`,
  ].join('\n');

  const payload = {
    name:     answers.contactName,
    email:    answers.email,
    phone:    answers.phone,
    company:  answers.businessName,
    industry: answers.industry,
    tier:     tierKey,
    source:   'Assessment',
    notes,
  };

  console.log('[assessment-submit] Posting lead to Mission Control ingest:', answers.email);

  const res = await fetch(INGEST_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key':    apiKey,
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    console.error('[assessment-submit] Mission Control ingest rejected — status:', res.status, data);
    throw new Error(`Ingest returned ${res.status}`);
  }
  console.log('[assessment-submit] ✅ Mission Control lead ingested:', res.status, data);
  return data;
}
