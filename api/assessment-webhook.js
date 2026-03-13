import { Resend } from 'resend';

// ─── Scoring ──────────────────────────────────────────────────────────────────

const TIER_THRESHOLDS = [
  { min: 0,  max: 24, tier: 'Starter',    index: 0 },
  { min: 25, max: 49, tier: 'Growth',     index: 1 },
  { min: 50, max: 74, tier: 'Scale',      index: 2 },
  { min: 75, max: 100, tier: 'Enterprise', index: 3 },
];

function scoreAnswers(answers) {
  const BUDGET  = { '<500': 5, '500-1000': 15, '1000-2500': 30, '2500+': 50 };
  const TEAM    = { '1': 5, '2-5': 15, '6-15': 30, '16+': 50 };
  const REVENUE = { '<50k': 5, '50k-200k': 15, '200k-500k': 30, '500k+': 50 };
  const SYSTEMS = { '0': 0, '1-2': 10, '3-5': 20, '5+': 30 };
  let score = 0;
  if (answers.budget)  score += BUDGET[answers.budget]   ?? 10;
  if (answers.team)    score += TEAM[answers.team]        ?? 10;
  if (answers.revenue) score += REVENUE[answers.revenue]  ?? 10;
  if (answers.systems) score += SYSTEMS[answers.systems]  ?? 5;
  return Math.round((score / 180) * 100);
}

function getTier(score) {
  return TIER_THRESHOLDS.find(t => score >= t.min && score <= t.max) ?? TIER_THRESHOLDS[0];
}

// ─── ROI Calculator ───────────────────────────────────────────────────────────

function calcROI(tierName) {
  const HOURS = { Starter: 8, Growth: 20, Scale: 40, Enterprise: 80 };
  const PRICES = { Starter: 99, Growth: 299, Scale: 499, Enterprise: 999 };
  const hoursSaved = HOURS[tierName] ?? 10;
  const monthlySavings = Math.round(hoursSaved * 4.33 * 25);
  const price = PRICES[tierName] ?? 99;
  const roi = Math.round(((monthlySavings - price) / price) * 100);
  return { hoursSaved, monthlySavings, price, roi };
}

// ─── Proposal Email ───────────────────────────────────────────────────────────

const TIER_BULLETS = {
  Starter: [
    'A professional custom website, live within 48 hours',
    'Google Business Profile setup so people can actually find you',
    'Monthly SEO report so you always know where you stand',
  ],
  Growth: [
    'Everything in Starter, plus lead generation campaigns',
    'Email marketing automation and CRM setup done for you',
    'Social media management 3x per week - hands off your end',
  ],
  Scale: [
    'Google and Meta ad management, fully handled',
    'Advanced automation that eliminates repetitive busywork',
    'A dedicated account manager who knows your business',
  ],
  Enterprise: [
    'A custom-trained AI voice agent for your business',
    'Unlimited automation builds and weekly strategy sessions',
    'White-glove onboarding and custom third-party integrations',
  ],
};

function buildProposalHtml({ firstName, tierName, price, monthlySavings, roi }) {
  const bullets = TIER_BULLETS[tierName] || TIER_BULLETS.Starter;
  const netSavings = Math.max(0, monthlySavings - price);

  const bulletRows = bullets.map(b => `
        <tr>
          <td style="padding: 9px 0; border-bottom: 1px solid #1c2a1c; font-size: 15px; color: #cdd6c6; line-height: 1.5;">
            <span style="color: #52B788; font-weight: 700; margin-right: 10px;">&#10003;</span>${b}
          </td>
        </tr>`).join('');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your BizStack Recommendation</title>
</head>
<body style="margin: 0; padding: 0; background-color: #0d1117; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif;">

  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #0d1117; padding: 48px 16px;">
    <tr>
      <td align="center">
        <table width="560" cellpadding="0" cellspacing="0" style="max-width: 560px; width: 100%;">

          <!-- Logo -->
          <tr>
            <td style="padding-bottom: 36px;">
              <span style="font-size: 18px; font-weight: 700; letter-spacing: -0.3px; color: #e6edf3;">
                BizStack<span style="color: #52B788;">.vip</span>
              </span>
            </td>
          </tr>

          <!-- Card -->
          <tr>
            <td style="background-color: #161b22; border-radius: 14px; border: 1px solid #30363d; padding: 40px 40px 36px;">

              <!-- Greeting -->
              <p style="margin: 0 0 6px; font-size: 12px; font-weight: 600; letter-spacing: 0.09em; text-transform: uppercase; color: #52B788;">
                Your Recommendation
              </p>
              <h1 style="margin: 0 0 16px; font-size: 26px; font-weight: 700; color: #e6edf3; line-height: 1.3;">
                Hey ${firstName} - here's your plan.
              </h1>
              <p style="margin: 0 0 32px; font-size: 15px; color: #8b949e; line-height: 1.65;">
                Thanks for taking the assessment. Based on what you shared, we matched you with
                the BizStack plan that fits where your business is right now - and where you're
                headed.
              </p>

              <!-- Tier + Price -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #0d1117; border: 1.5px solid #238636; border-radius: 10px; margin-bottom: 28px;">
                <tr>
                  <td style="padding: 24px 28px;">
                    <p style="margin: 0 0 4px; font-size: 11px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: #52B788;">
                      Recommended Plan
                    </p>
                    <p style="margin: 0 0 2px; font-size: 24px; font-weight: 700; color: #e6edf3;">
                      ${tierName}
                    </p>
                    <p style="margin: 0; font-size: 30px; font-weight: 700; color: #52B788; font-family: 'Courier New', Courier, monospace;">
                      $${price}<span style="font-size: 15px; color: #484f58; font-family: inherit;">/mo</span>
                    </p>
                  </td>
                </tr>
              </table>

              <!-- ROI -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 28px;">
                <tr>
                  <td style="background-color: #0f2318; border: 1px solid #1c4428; border-radius: 8px; padding: 18px 22px;">
                    <p style="margin: 0; font-size: 15px; color: #8b949e; line-height: 1.6;">
                      Based on your challenges, BizStack replaces work that would cost you
                      <strong style="color: #e6edf3;">$${monthlySavings.toLocaleString()}/mo</strong> to hire for.
                      At $${price}/mo, you'd save roughly
                      <strong style="color: #52B788;">~$${netSavings.toLocaleString()}/mo</strong> compared to doing it
                      the old way.
                    </p>
                  </td>
                </tr>
              </table>

              <!-- What's included -->
              <p style="margin: 0 0 14px; font-size: 13px; font-weight: 600; letter-spacing: 0.06em; text-transform: uppercase; color: #484f58;">
                What's included
              </p>
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 32px;">
                ${bulletRows}
              </table>

              <!-- CTA -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="padding-bottom: 14px;">
                    <a href="https://bizstack.vip"
                       style="display: inline-block; background-color: #238636; color: #ffffff; text-decoration: none;
                              font-size: 15px; font-weight: 600; padding: 13px 34px; border-radius: 7px; letter-spacing: 0.01em;">
                      Get Started at BizStack.vip &rarr;
                    </a>
                  </td>
                </tr>
                <tr>
                  <td align="center">
                    <p style="margin: 0; font-size: 13px; color: #484f58;">
                      No contracts. No setup fees. Live in 48 hours.
                    </p>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- Sign-off -->
          <tr>
            <td style="padding: 28px 4px 0;">
              <p style="margin: 0 0 4px; font-size: 14px; color: #8b949e;">
                - The BizStack Team
              </p>
              <p style="margin: 0; font-size: 13px; color: #484f58;">
                Questions? Reply to this email or write to
                <a href="mailto:hello@bizstack.vip" style="color: #52B788; text-decoration: none;">hello@bizstack.vip</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>

</body>
</html>`;
}

// ─── Mission Control API ──────────────────────────────────────────────────────

const MC_BASE = 'https://mc.bizstack.vip';

async function mcPost(path, body) {
  const res = await fetch(`${MC_BASE}${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.MC_API_KEY,
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`MC ${path} ${res.status}: ${text.slice(0, 200)}`);
  }
  return res.json();
}

// ─── Handler ──────────────────────────────────────────────────────────────────

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const payload = req.body || {};
  const { name, phone, email, company, answers = {}, proposalRequested = false, tierData } = payload;

  const resolvedName  = name  || answers.name  || null;
  const resolvedEmail = email || answers.email || null;
  const resolvedPhone = phone || answers.phone || null;
  const resolvedCo    = company || answers.company || null;
  const firstName     = (resolvedName || '').trim().split(' ')[0] || 'there';

  // Use frontend-calculated values if present, otherwise recalculate
  const score    = scoreAnswers(answers);
  const tierInfo = getTier(score);
  const tierName = tierData?.name || tierInfo.tier;
  const roiData  = calcROI(tierName);
  const price          = tierData?.price        ?? roiData.price;
  const monthlySavings = tierData?.monthlyCost  ?? roiData.monthlySavings;
  const { hoursSaved, roi } = roiData;

  // ── Proposal email path ───────────────────────────────────────────────────
  if (proposalRequested) {
    if (!resolvedEmail) {
      return res.status(400).json({ error: 'No email address found.' });
    }

    const resendKey = process.env.RESEND_API_KEY;
    if (!resendKey) {
      console.warn('[assessment-webhook] RESEND_API_KEY not set');
      return res.status(500).json({ error: 'Email not configured.' });
    }

    const emailMonthlySavings = tierData?.monthlyCost  ?? monthlySavings;
    const emailPrice          = tierData?.price        ?? price;
    const emailTierName       = tierData?.name         ?? tierName;

    try {
      const resend = new Resend(resendKey);
      await resend.emails.send({
        from:    'BizStack AI <hello@bizstack.vip>',
        to:      [resolvedEmail],
        subject: `Your BizStack Recommendation is Ready, ${firstName}`,
        html:    buildProposalHtml({ firstName, tierName: emailTierName, price: emailPrice, monthlySavings: emailMonthlySavings, roi }),
      });
      console.log(`[assessment-webhook] Proposal sent to ${resolvedEmail} (${emailTierName})`);
      return res.status(200).json({ success: true, proposed: true });
    } catch (e) {
      console.error('[assessment-webhook] Resend error:', e.message);
      return res.status(500).json({ error: 'Failed to send proposal email.' });
    }
  }

  // ── Normal assessment submit path ─────────────────────────────────────────
  const displayName  = resolvedName || resolvedPhone || resolvedEmail || 'Unknown';
  const submittedAt  = new Date().toISOString();
  const alertMessage = [
    `New BizStack lead: ${displayName} from ${resolvedCo || 'unknown company'}`,
    `Recommended tier: ${tierName} at $${price}/mo`,
    `ROI: Saves ~$${monthlySavings}/mo vs hiring`,
    `Submitted: ${submittedAt}`,
  ].join('\n');

  if (process.env.MC_API_KEY) {
    try {
      await mcPost('/api/lead-ingest', {
        name: displayName, phone: resolvedPhone, email: resolvedEmail,
        company: resolvedCo, tier: tierName, score, roi: roiData,
        answers, submittedAt, andrewAlertMessage: alertMessage,
      });
    } catch (e) {
      console.error('[assessment-webhook] Lead ingest failed:', e.message);
    }
  }

  console.log(`[assessment-webhook] Processed: ${displayName} | ${tierName} | score=${score}`);
  return res.status(200).json({ success: true, tier: tierName, score, roi: roiData });
}
